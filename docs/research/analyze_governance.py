"""
PMDD Governance Analytics
Parses batch results and extracts formal statistics on how often the deterministic
governance layer intervened against the LLM's raw proposals.
"""
import os
import glob
import json

def analyze_governance_interventions(experiment_dir="experiments"):
    """
    Scans all results_*.json files and calculates governance intervention statistics.
    """
    print("=== PMDD Governance Intervention Analysis ===\n")
    
    result_files = glob.glob(os.path.join(experiment_dir, "results_*.json"))
    if not result_files:
        print("No experiment results found. Run batch_runner.py first.")
        return

    total_sentences = 0
    total_penalties = 0
    total_overrides = 0
    total_delta = 0.0
    
    for file_path in result_files:
        try:
            with open(file_path, 'r') as f:
                data = json.load(f)
                
            trace_log = data.get("traceability_log", [])
            sentences = data.get("sentences", [])
            total_sentences += len(sentences)
            
            for log in trace_log:
                if log.get("event") == "Confidence Penalty":
                    total_penalties += 1
                    if "old_value" in log and "new_value" in log:
                        total_delta += (log["old_value"] - log["new_value"])
                elif log.get("event") == "Framework Override":
                    total_overrides += 1
                    
        except Exception as e:
            print(f"Error parsing {file_path}: {e}")
            
    if total_penalties > 0:
        avg_delta = total_delta / total_penalties
    else:
        avg_delta = 0.0
        
    print(f"Total Sentences Analyzed: {total_sentences}")
    print(f"Total Framework Overrides Enforced: {total_overrides}")
    print(f"Total Confidence Penalties Applied: {total_penalties}")
    
    if total_sentences > 0:
        penalty_rate = (total_penalties / total_sentences) * 100
        print(f"Penalty Application Rate: {penalty_rate:.2f}% of sentences")
        
    print(f"Average Confidence Reduction per Penalty: -{avg_delta:.3f}")
    
    print("\nThese statistics are formatted for inclusion in the 'Methodology' section.")

if __name__ == "__main__":
    # Point this to the root PMDD project directory if running from within docs/research/
    analyze_governance_interventions(experiment_dir="../../experiments")
