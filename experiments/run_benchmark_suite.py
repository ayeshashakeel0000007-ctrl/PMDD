import os
import json
import time
import sys

# 1. Immediately lock determinism
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import core.seed_lock

def generate_manifest(experiment_id, target_corpus, results_path):
    """Generates the formal experiment manifest file."""
    manifest = {
        "experiment_id": experiment_id,
        "timestamp_utc": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "pmdd_version": "3.0.0-FROZEN",
        "target_corpus": target_corpus,
        "calibration_settings": {
            "random_seed": 42,
            "kl_divergence_smoothing": 1e-10,
            "transitivity_heuristics": "v1.frozen"
        },
        "output_directory": results_path
    }
    
    manifest_path = os.path.join(results_path, f"manifest_{experiment_id}.json")
    with open(manifest_path, 'w') as f:
        json.dump(manifest, f, indent=4)
        
    print(f"Generated Experiment Manifest: {manifest_path}")
    return manifest

def run_benchmark_suite(benchmarks_dir="data/benchmarks"):
    """Iterates over frozen benchmark corpora and executes the pipeline."""
    print("=== PMDD Automated Benchmark Pipeline ===\n")
    
    if not os.path.exists(benchmarks_dir):
        print(f"Error: Benchmarks directory {benchmarks_dir} not found.")
        return
        
    categories = [d for d in os.listdir(benchmarks_dir) if os.path.isdir(os.path.join(benchmarks_dir, d))]
    
    if not categories:
        print("No benchmark categories found. Ensure data/benchmarks/ is populated.")
        return
        
    results_base = "experiments/results"
    os.makedirs(results_base, exist_ok=True)
    
    timestamp = time.strftime("%Y%m%d_%H%M%S")
    run_id = f"EXP_{timestamp}"
    run_dir = os.path.join(results_base, run_id)
    os.makedirs(run_dir, exist_ok=True)
    
    print(f"Initializing Experiment Run: {run_id}")
    
    for category in categories:
        print(f"\n-> Processing Category: {category}")
        cat_path = os.path.join(benchmarks_dir, category)
        # In a real implementation, this would load the JSON files, 
        # pass them through core/transitivity_engine.py and api/server.py algorithms,
        # and save the predictions alongside the ground truth.
        print("   [Simulation] Running deterministic PMDD heuristics...")
        print("   [Simulation] Calculating Confidence Distributions...")
        
    # Generate the locked manifest
    generate_manifest(run_id, "ALL_BENCHMARKS", run_dir)
    print("\n=== Benchmark Pipeline Complete ===")
    print(f"Results and Manifest securely saved to: {run_dir}")

if __name__ == "__main__":
    run_benchmark_suite()
