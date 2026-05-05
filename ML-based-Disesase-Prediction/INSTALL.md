# Installation Guide for ML-based Disease Prediction

## Prerequisites
- Python 3.11+
- pip (latest version)

## Installation Steps

### Option 1: GPU/CUDA Installation (RTX 3050, RTX 3060, RTX 4090, etc.)

This is recommended for faster inference and training.

```bash
# Step 1: Create a virtual environment (optional but recommended)
python -m venv venv
source venv/Scripts/activate  # On Windows: venv\Scripts\activate

# Step 2: Install PyTorch with CUDA 12.1 support first
python -m pip install --upgrade pip
python -m pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121

# Step 3: Install remaining dependencies
pip install -r requirements.txt
```

**Verify GPU support:**
```bash
python -c "import torch; print(f'CUDA available: {torch.cuda.is_available()}')"
```

### Option 2: CPU-Only Installation

Use this if you don't have a compatible GPU or want to avoid GPU setup.

```bash
# Step 1: Create a virtual environment (optional but recommended)
python -m venv venv
source venv/Scripts/activate  # On Windows: venv\Scripts\activate

# Step 2: Install all dependencies (CPU-only PyTorch)
python -m pip install --upgrade pip
pip install -r requirements-cpu.txt
```

**Run with CPU flag:**
```bash
python test_common_model_v2.py --cpu --symptoms "fever, cough"
```

## Quick Start

### Run the disease predictor
```bash
# GPU mode (auto-detects CUDA)
python test_common_model_v2.py --symptoms "fever, cough, sore throat"

# GPU with boosted common diseases
python test_common_model_v2.py --symptoms "fever, cough" --inference-common-boost 2.5

# CPU-only mode
python test_common_model_v2.py --symptoms "fever, cough" --cpu

# Interactive mode
python test_common_model_v2.py --interactive
```

### Run the Streamlit dashboard
```bash
streamlit run streamlit_dashboard.py
```

## System Requirements

### For GPU Support
- NVIDIA GPU with compute capability 6.0+
- NVIDIA CUDA Toolkit 12.1+
- NVIDIA cuDNN 8.9+
- ~2.4GB additional disk space for PyTorch CUDA wheels

### Tested GPUs
- NVIDIA GeForce RTX 3050 (4GB VRAM)
- NVIDIA GeForce RTX 3060 (12GB VRAM)
- Other RTX series with 2GB+ VRAM

### For CPU-Only
- No special requirements
- All CPU-capable systems supported
- Slower inference (~5-10x compared to GPU)

## Troubleshooting

### "CUDA device not available"
```bash
# Make sure you followed Option 1 above
# Verify with:
python -c "import torch; print(torch.cuda.is_available())"
# Should print: True
```

### "numpy.dtype size changed" error
This means incompatible numpy/pandas versions. Run:
```bash
pip install --upgrade --force-reinstall -r requirements.txt
```

### ImportError for dependencies
Make sure you're in the correct virtual environment and all dependencies are installed:
```bash
pip install -r requirements.txt --force-reinstall
```

## Virtual Environment Best Practices

Always use a virtual environment to avoid conflicts:

```bash
# Create
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (macOS/Linux)
source venv/bin/activate

# Deactivate
deactivate
```

## Notes
- Pinned versions ensure reproducibility across machines
- GPU support requires NVIDIA CUDA 12.1+
- PyTorch 2.5.1 is the latest stable version compatible with these dependencies
- All versions tested and verified on Windows 11 with Python 3.11
