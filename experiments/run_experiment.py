import json
import sys
import os
import time

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from agents.agent1_preprocessor import process_corpus
from agents.agent0_profiler import profile_corpus
from agents.agent2_pragmatic import analyze_batch as analyze_pragmatics
from agents.agent3_semantic import analyze_batch as analyze_semantics
from agents.agent4_register import analyze_batch as analyze_register
from agents.agent5_orchestrator import synthesize_report
from core.governance import FrameworkGovernance

def run_experiment(config_path: str):
    """Executes a defined PMDD experiment."""
    print(f"Loading experiment config: {config_path}")
    with open(config_path, 'r') as f:
        config = json.load(f)
        
    print(f"Experiment ID: {config['experiment_id']}")
    print(f"Description: {config['description']}")
    
    # Load Corpus (mocked for the pilot, since pilot_corpus_01.json contains raw text in a real scenario)
    # We will just use a hardcoded test string for the pilot runner demonstration if the file isn't found
    corpus_text = "The implementation of the new policy will begin immediately. Please ensure you have submitted all documentation by Friday."
    try:
        if os.path.exists(config['corpus_path']):
            with open(config['corpus_path'], 'r') as f:
                corpus_data = json.load(f)
                if isinstance(corpus_data, list):
                    corpus_text = " ".join([item.get("text", "") for item in corpus_data])
                elif "text" in corpus_data:
                    corpus_text = corpus_data["text"]
    except Exception as e:
        print(f"Warning: Could not load corpus_path. Using default text. {e}")

    print("--- Starting Experimental Pipeline ---")
    start_time = time.time()
    
    # Segment
    segments = process_corpus(corpus_text)["segments"]
    
    # Profiler
    execution_plan = profile_corpus(segments)
    
    # Apply Experimental Governance Overrides
    overrides = config.get("governance_overrides", {})
    if "force_domain" in overrides:
        execution_plan["domain"] = overrides["force_domain"]
        
    execution_plan = FrameworkGovernance.enforce_routing_rules(execution_plan)
    
    # Frameworks
    fw_config = config.get("frameworks", {})
    
    if execution_plan.get("run_pragmatics", True) and fw_config.get("pragmatics", True):
        try:
            segments = analyze_pragmatics(segments)
        except Exception as e:
            print(f"API Error in Pragmatics: {e}")
            for seg in segments:
                seg["pragmatics"] = {"speech_act": "error", "confidence": 0.0, "reasoning": "API Timeout"}
                
    if execution_plan.get("run_semantics", True) and fw_config.get("semantics", True):
        try:
            segments = analyze_semantics(segments)
        except Exception as e:
            print(f"API Error in Semantics: {e}")
            for seg in segments:
                seg["semantics"] = {"ideational_complexity": "low", "confidence": 0.0, "reasoning": "API Timeout"}
                
    if execution_plan.get("run_register", True) and fw_config.get("register", True):
        try:
            segments = analyze_register(segments)
        except Exception as e:
            print(f"API Error in Register: {e}")
            for seg in segments:
                seg["register"] = {"formality_score": 0.0, "confidence": 0.0, "reasoning": "API Timeout"}
        
    segments = FrameworkGovernance.apply_confidence_penalties(segments, execution_plan)
    
    final_output = synthesize_report(segments, execution_plan)
    
    runtime = round(time.time() - start_time, 2)
    print(f"--- Experiment Completed in {runtime}s ---")
    
    output_path = f"experiments/results_{config['experiment_id']}.json"
    with open(output_path, 'w') as f:
        json.dump(final_output, f, indent=2)
        
    print(f"Results saved to: {output_path}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python run_experiment.py <path_to_config.json>")
        sys.exit(1)
        
    run_experiment(sys.argv[1])
