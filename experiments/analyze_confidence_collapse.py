import json
import os

def analyze_confidence_collapse(results_file="experiments/results/simulated_confidence_data.json"):
    """
    A lightweight analytical layer to identify structural instability in the pipeline.
    It scans PMDD output to find:
    - Abrupt confidence drops
    - Disagreement spikes between Agent vs Human
    - Calibration instability zones
    """
    print("=== PMDD Confidence Collapse Analysis ===")
    
    # Simulating data ingestion that would normally come from evaluate_human_vs_agent.py
    simulated_data = [
        {"clause_id": "c1", "text": "We must consider the timeline.", "pmdd_confidence": 0.88, "human_agreement": True},
        {"clause_id": "c2", "text": "Take the server offline immediately.", "pmdd_confidence": 0.95, "human_agreement": True},
        {"clause_id": "c3", "text": "I think we need to destroy the perimeter.", "pmdd_confidence": 0.42, "human_agreement": False, "failure_mode": "mixed_transitivity"},
        {"clause_id": "c4", "text": "Brilliant, another complete disaster.", "pmdd_confidence": 0.35, "human_agreement": False, "failure_mode": "sarcasm"},
        {"clause_id": "c5", "text": "It would be best if you left.", "pmdd_confidence": 0.89, "human_agreement": False, "failure_mode": "implicit_directive_overconfidence"}
    ]
    
    collapse_threshold = 0.50
    overconfidence_threshold = 0.85
    
    hotspots = []
    overconfident_failures = []
    
    for item in simulated_data:
        conf = item["pmdd_confidence"]
        agreed = item["human_agreement"]
        
        # 1. Detect Abrupt Confidence Drops (Ambiguity Hotspots)
        if conf < collapse_threshold:
            hotspots.append(item)
            
        # 2. Detect Calibration Instability (High confidence, low accuracy)
        if conf > overconfidence_threshold and not agreed:
            overconfident_failures.append(item)
            
    print(f"\n[!] Identified {len(hotspots)} Ambiguity Hotspots (Confidence < {collapse_threshold}):")
    for h in hotspots:
        print(f"    - [{h['failure_mode'].upper()}] \"{h['text']}\" (Conf: {h['pmdd_confidence']})")
        
    print(f"\n[!] Identified {len(overconfident_failures)} Calibration Instability Zones (High Conf, Failed):")
    for o in overconfident_failures:
        print(f"    - [{o['failure_mode'].upper()}] \"{o['text']}\" (Conf: {o['pmdd_confidence']})")
        
    print("\nAnalysis Complete. Suggest adding these clauses to the Error Taxonomy limits.")

if __name__ == "__main__":
    analyze_confidence_collapse()
