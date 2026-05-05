import pandas as pd
import os
import sys

# Add NFI project directory to sys.path to import rag module
nfi_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'National-Formulary-of-India-NFI-2011-RAGed')
sys.path.insert(0, nfi_path)
sys.path.append("D:/Major/National-Formulary-of-India-NFI-2011-RAGed")

# Set CHROMA_DIR for rag.py
os.environ['CHROMA_DIR'] = os.path.join(nfi_path, 'chroma_db')

from rag import answer

# Get the parent directory where the CSV files are located
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# load once
cleaned_df = pd.read_csv(os.path.join(parent_dir, "Cleaned version.csv"))
product_df = pd.read_csv(os.path.join(parent_dir, "Product List_10_4_2026 @ 11_38_19.csv"))

# ✅ NEW: normalize product names (only change added)
product_df['clean_name'] = product_df['Generic Name'].str.lower().str.split().str[0]


def get_medicines_for_disease(disease):
    
    disease = disease.lower().strip()

    meds_row = cleaned_df[cleaned_df['diseases'].str.lower() == disease]

    if meds_row.empty:
        return []

    medicines = []
    for col in ['medicine_1', 'medicine_2', 'medicine_3']:
        med = meds_row[col].values[0]
        if pd.notna(med):
            medicines.append(med)

    if not medicines:
        return []

    result = []

    for med in medicines:
        
        # ✅ NEW: clean medicine name
        med_clean = med.lower().split()[0]

        # ✅ UPDATED MATCHING (only this changed)
        product = product_df[
            product_df['clean_name'] == med_clean
        ]

        if not product.empty:
            row = product.iloc[0]

            result.append({
                "name": med,
                "price": row.get("MRP", "NA"),
                "group": row.get("Group Name", "NA"),
                "details": enrich_medicine(med) 
            })
        else:
            result.append({
                "name": med,
                "price": "NA",
                "group": "NA",
                "details": enrich_medicine(med) 
            })

    return result


def enrich_medicine(med_name):
    query = f"Information about {med_name} including uses dosage side effects contraindications"

    try:
        res = answer(query)
        return res["answer"]
    except Exception as e:
        return str(e)