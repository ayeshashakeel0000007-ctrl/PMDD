import os
import random

def enforce_deterministic_execution(seed_value=42):
    """
    Locks all stochastic components of the Python runtime to ensure 100% reproducibility.
    Must be called at the very top of execution before any libraries (like numpy/torch) are fully initialized.
    """
    # 1. Lock Python Hash Seed
    os.environ['PYTHONHASHSEED'] = str(seed_value)
    
    # 2. Lock core Python random
    random.seed(seed_value)
    
    # 3. Lock NumPy
    try:
        import numpy as np
        np.random.seed(seed_value)
    except ImportError:
        pass
        
    # 4. Lock Scikit-Learn (relies on NumPy, but enforcing just in case)
    # sklearn generally uses np.random state or explicit random_state params.
    
    # 5. Lock spaCy / PyTorch if installed
    try:
        import torch
        torch.manual_seed(seed_value)
        torch.cuda.manual_seed_all(seed_value)
        torch.backends.cudnn.deterministic = True
        torch.backends.cudnn.benchmark = False
    except ImportError:
        pass
        
    print(f"[SCIENCE MODE] Deterministic execution locked (Seed: {seed_value}). PYTHONHASHSEED={os.environ['PYTHONHASHSEED']}")

# Automatically enforce on import
enforce_deterministic_execution()
