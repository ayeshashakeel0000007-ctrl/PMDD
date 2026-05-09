"""
PMDD Reproducibility Audit Script
Verifies the integrity of batch experiments, traceability logs, and metadata.
"""
import os
import json
import glob

def audit_experiments(experiments_dir="experiments"):
    print("=== PMDD Reproducibility Audit ===\n")
    
    config_files = glob.glob(os.path.join(experiments_dir, "exp_*.json"))
    result_files = glob.glob(os.path.join(experiments_dir, "results_*.json"))
    
    print(f"Found {len(config_files)} Experiment Configurations.")
    print(f"Found {len(result_files)} Result Files.\n")
    
    total_issues = 0
    
    for config_path in config_files:
        basename = os.path.basename(config_path).replace(".json", "")
        # Assuming config is exp_XXX.json and result is results_XXX.json
        exp_id = basename.replace("exp_", "")
        
        result_path = os.path.join(experiments_dir, f"results_{exp_id}.json")
        
        print(f"Auditing Experiment: {exp_id}...")
        
        # 1. Existence Check
        if not os.path.exists(result_path):
            print(f"  [!] Missing Result File: {result_path}")
            total_issues += 1
            continue
            
        with open(result_path, 'r') as f:
            try:
                results = json.load(f)
            except json.JSONDecodeError:
                print(f"  [!] Corrupt JSON in {result_path}")
                total_issues += 1
                continue
                
        # 2. Metadata Integrity
        if "execution_plan" not in results:
            print(f"  [!] Missing Execution Plan in {exp_id}")
            total_issues += 1
            
        # 3. Traceability Audit
        if "traceability_log" not in results:
            print(f"  [!] Missing Traceability Log in {exp_id}")
            total_issues += 1
        elif not isinstance(results["traceability_log"], list):
            print(f"  [!] Traceability Log is malformed in {exp_id}")
            total_issues += 1
            
        # 4. Calibration & Uncertainty Integrity
        if "math_scores" not in results or "systemic_uncertainty_index" not in results.get("math_scores", {}):
            print(f"  [!] Missing Systemic Uncertainty Index in {exp_id}")
            total_issues += 1
            
    if total_issues == 0:
        print("\n[SUCCESS] Audit Passed: All experiments are structurally sound and reproducible.")
    else:
        print(f"\n[WARNING] Audit Failed: Found {total_issues} structural or metadata issues.")
        
if __name__ == "__main__":
    audit_experiments()
