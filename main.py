import json
from agents.agent1_preprocessor import process_corpus
from agents.agent2_pragmatic import analyze_batch as analyze_pragmatics
from agents.agent3_semantic import analyze_batch as analyze_semantics
from agents.agent4_register import analyze_batch as analyze_register
from agents.agent5_orchestrator import synthesize_report

SAMPLE_TEXT = """
It is absolutely unacceptable that the committee has decided to ignore our proposal. 
We must demand an immediate review of the budget allocation before the end of the fiscal year! 
However, I understand that the financial constraints are quite severe at this moment. 
Therefore, I humbly request that we schedule a brief meeting to discuss alternative solutions.
"""

def main():
    print("Starting PMDD v3.0 Pipeline...")
    
    # 1. Preprocessing
    print("\n[Agent 1] Preprocessing corpus...")
    corpus_data = process_corpus(SAMPLE_TEXT)
    segments = corpus_data["segments"]
    print(f"Generated {len(segments)} segments.")
    
    # 2. Pragmatics
    print("\n[Agent 2] Running Pragmatic Analysis...")
    segments = analyze_pragmatics(segments)
    
    # 3. Semantics
    print("\n[Agent 3] Running Semantic Analysis...")
    segments = analyze_semantics(segments)
    
    # 4. Register
    print("\n[Agent 4] Running Register Analysis...")
    segments = analyze_register(segments)
    
    # 5. Orchestration & Synthesis
    print("\n[Agent 5] Orchestrating Math & Synthesis...")
    final_output = synthesize_report(segments)
    
    print("\n=== FINAL PMDD REPORT ===")
    print(json.dumps(final_output, indent=2))
    
    # Save the full trace
    with open("data/test_output.json", "w") as f:
        json.dump({"segments": segments, "final_output": final_output}, f, indent=2)
    print("\nTrace saved to data/test_output.json")

if __name__ == "__main__":
    main()
