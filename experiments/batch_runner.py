import os
import glob
import json
import csv
import time
import subprocess

def run_batch():
    """
    Scans the experiments/ directory for any configuration files (excluding schemas)
    and executes them sequentially to prevent API rate limits and ensure deterministic stability.
    """
    print("=== PMDD Batch Experiment Runner ===")
    experiment_files = glob.glob(os.path.join("experiments", "*.json"))
    experiment_files = [f for f in experiment_files if "schema" not in f and not os.path.basename(f).startswith("results_")]
    
    if not experiment_files:
        print("No experiment configurations found.")
        return
        
    print(f"Found {len(experiment_files)} experiments to run.")
    
    results_summary = []
    
    for config_file in experiment_files:
        print(f"\n--- Executing: {config_file} ---")
        start_time = time.time()
        
        # We call the run_experiment script synchronously as a subprocess to keep memory clean
        try:
            result = subprocess.run(["python", "experiments/run_experiment.py", config_file], capture_output=True, text=True)
            print(result.stdout)
            if result.stderr:
                print(f"Errors during execution: {result.stderr}")
                
            # Attempt to read the output file to aggregate results
            with open(config_file, 'r') as f:
                config_data = json.load(f)
                exp_id = config_data.get("experiment_id", "unknown")
                
            output_file = os.path.join("experiments", f"results_{exp_id}.json")
            if os.path.exists(output_file):
                with open(output_file, 'r') as f:
                    output_data = json.load(f)
                    
                scores = output_data.get("math_scores", {})
                results_summary.append({
                    "experiment_id": exp_id,
                    "runtime_seconds": round(time.time() - start_time, 2),
                    "systemic_uncertainty_index": scores.get("systemic_uncertainty_index", "N/A"),
                    "pragmatic_entropy": scores.get("pragmatic_entropy", "N/A"),
                    "semantic_cohesion": scores.get("semantic_cohesion", "N/A")
                })
        except Exception as e:
            print(f"Failed to execute {config_file}: {str(e)}")
            
        # Hard sleep to protect OpenAI rate limits between massive batches
        print("Sleeping for 5 seconds to respect rate limits...")
        time.sleep(5)
        
    # Write aggregated results
    if results_summary:
        csv_path = os.path.join("experiments", "batch_results_summary.csv")
        keys = results_summary[0].keys()
        with open(csv_path, 'w', newline='') as output_file:
            dict_writer = csv.DictWriter(output_file, fieldnames=keys)
            dict_writer.writeheader()
            dict_writer.writerows(results_summary)
        print(f"\n=== Batch Execution Complete. Summary saved to {csv_path} ===")

if __name__ == "__main__":
    run_batch()
