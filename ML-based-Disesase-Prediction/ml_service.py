from fastapi import FastAPI
import torch
import numpy as np
import pandas as pd
import joblib
from pydantic import BaseModel
from medicin_mapper import get_medicines_for_disease


from test_common_model_v2 import (
    DiseaseClassifier,
    parse_symptoms,
    build_feature_vector,
    predict_proba_torch,
    apply_common_bias,
    top_k_predictions,
    build_class_symptom_profiles_from_csv,
    positive_only_match_distribution,
    symptom_indices
)

app = FastAPI()

class SymptomRequest(BaseModel):
    symptoms: str

# -------- LOAD MODEL --------
model_path = "model_checkpoints/common_first_model_v2.pt"

# Try loading with joblib first (the actual format used)
try:
    bundle = joblib.load(model_path)
except Exception:
    # Fallback to torch.load with weights_only=True
    try:
        bundle = torch.load(model_path, map_location="cpu", weights_only=True)
    except Exception:
        # Final fallback to torch.load with pickle
        bundle = torch.load(model_path, map_location="cpu", weights_only=False)

# Handle both possible bundle formats
if "model_state" in bundle:
    # Format: state dict with metadata
    input_dim = int(bundle.get("input_dim", 0))
    num_classes = int(bundle.get("num_classes", 0))
    model = DiseaseClassifier(input_dim=input_dim, num_classes=num_classes).to("cpu")
    model.load_state_dict(bundle["model_state"])
    model.eval()
    feature_cols = bundle.get("feature_cols", [])
    label_encoder = bundle.get("label_encoder")
    classes = label_encoder.classes_ if label_encoder else np.array([])
else:
    # Format: direct model object
    model = bundle["model"]
    feature_cols = bundle["feature_cols"]
    classes = bundle["classes"]

common_classes = set(bundle.get("common_classes", []))
device = torch.device("cpu")

# profiles (IMPORTANT)
class_profiles = build_class_symptom_profiles_from_csv(
    "sympdis_clean_basic.csv", feature_cols
)

# -------- API --------
@app.post("/predict")
def predict(req: SymptomRequest):
    symptom_text = req.symptoms

    # FIX
    symptoms = parse_symptoms(symptom_text)

    x, recognized, unknown = build_feature_vector(feature_cols, symptoms)

    if len(recognized) == 0:
        return {"error": "No valid symptoms"}

    prob_raw = predict_proba_torch(model, x, device)
    prob_adj = apply_common_bias(prob_raw, classes, common_classes, 1.2)[0]

    # blend
    reported_idx = symptom_indices(feature_cols, recognized)
    if reported_idx.size > 0:
        pos_only = positive_only_match_distribution(
            reported_idx, classes, class_profiles
        )
        prob_adj = 0.7 * prob_adj + 0.3 * pos_only
        prob_adj = prob_adj / prob_adj.sum()

    preds = top_k_predictions(prob_adj, classes, 3)

    # ✅ INSIDE FUNCTION
    final_output = []

    for disease, conf in preds:
        meds = get_medicines_for_disease(disease)

        final_output.append({
            "disease": disease,
            "medicines": meds
        })

    return {
        "recognized_symptoms": recognized,
        "results": final_output
    } 