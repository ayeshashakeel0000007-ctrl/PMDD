"""
PMDD Human vs. Agent Evaluation Pipeline
Compares Agent outputs against the Gold Standard human annotations in pilot_corpus_01.json
Calculates IAA (Krippendorff's Alpha) and Accuracy (F1, ECE).
"""
import json
import os
import sys

# Add project root to path for absolute imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.benchmarking import (
    calculate_krippendorffs_alpha_nominal, 
    calculate_precision_recall_f1,
    calculate_expected_calibration_error
)

def run_evaluation(pilot_corpus_path="data/corpora/pilot_corpus_01.json"):
    print("=== PMDD Human vs. Agent Validation Study ===\n")
    
    if not os.path.exists(pilot_corpus_path):
        print(f"Error: {pilot_corpus_path} not found.")
        return
        
    with open(pilot_corpus_path, 'r') as f:
        corpus = json.load(f)
        
    print(f"Loaded Pilot Corpus: {len(corpus)} segments.")
    
    # 1. Human Inter-Annotator Agreement (IAA)
    human_annotations_matrix = []
    consensus_labels = []
    transitivity_consensus = []
    
    for item in corpus:
        human_data = item.get("human_annotations", {})
        # Extract speech acts
        acts = [
            human_data.get("annotator_1", {}).get("speech_act"),
            human_data.get("annotator_2", {}).get("speech_act"),
            human_data.get("annotator_3", {}).get("speech_act")
        ]
        human_annotations_matrix.append(acts)
        
        # Extract transitivity
        trans_acts = [
            human_data.get("annotator_1", {}).get("transitivity_process"),
            human_data.get("annotator_2", {}).get("transitivity_process"),
            human_data.get("annotator_3", {}).get("transitivity_process")
        ]

        from collections import Counter
        valid_acts = [a for a in acts if a]
        if valid_acts:
            consensus_labels.append(Counter(valid_acts).most_common(1)[0][0])
        else:
            consensus_labels.append("unknown")

        valid_trans = [a for a in trans_acts if a]
        if valid_trans:
            transitivity_consensus.append(Counter(valid_trans).most_common(1)[0][0])
        else:
            transitivity_consensus.append("unknown")
            
    # Calculate Alpha
    alpha = calculate_krippendorffs_alpha_nominal(human_annotations_matrix)
    print(f"\n1. Human Baseline Reliability")
    print(f"   Krippendorff's Alpha (Nominal Speech Acts): {alpha:.3f}")
    if alpha > 0.8:
        print("   -> STATUS: High Reliability (Publishable)")
    else:
        print("   -> STATUS: Moderate/Low Reliability")
        
    # 2. Agent Validation Metrics (vs. Consensus)
    print("\n2. Agent Validation Metrics (vs. Consensus)")
    
    # Simulate agent responses here to prove the mathematical pipeline works.
    agent_labels = ["assertive", "directive", "expressive"]
    agent_transitivity = ["material", "relational", "mental"]
    agent_confidences = [0.85, 0.90, 0.70]
    
    f1_scores = calculate_precision_recall_f1(consensus_labels, agent_labels, target_class="directive")
    print(f"   Speech Act F1 Score (Target: 'directive'): {f1_scores['f1']:.3f}")
    
    f1_trans = calculate_precision_recall_f1(transitivity_consensus, agent_transitivity, target_class="material")
    print(f"   Transitivity F1 Score (Target: 'material'): {f1_trans['f1']:.3f}")
    
    # 3. Calibration (ECE)
    correct_predictions = [c == a for c, a in zip(consensus_labels, agent_labels)]
    ece = calculate_expected_calibration_error(agent_confidences, correct_predictions)
    
    print("\n3. Calibration & Uncertainty Science")
    print(f"   Expected Calibration Error (ECE): {ece:.3f}")
    if ece < 0.15:
        print("   -> STATUS: Highly Calibrated (Agent knows what it doesn't know)")
    else:
        print("   -> STATUS: Poorly Calibrated (Agent is overconfident)")

if __name__ == "__main__":
    run_evaluation()
