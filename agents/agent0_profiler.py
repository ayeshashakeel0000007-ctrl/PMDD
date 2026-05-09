import json
from typing import Dict, Any, List
from utils.openai_client import get_structured_completion
from core.llm_schemas import ProfilerExecutionPlan
from core.memory import retrieve_similar

SYSTEM_PROMPT = """
You are the PMDD Profiler Agent. Your job is to inspect a sample of a corpus, classify its domain and communicative intent, and deterministically output an Execution Plan.
You MUST decide which linguistic frameworks are mathematically relevant to this text.
If the text is highly formal academic writing, perhaps Gricean maxims are less relevant than Register.
If the text is political, Pragmatics is highly relevant.
Also consider previous successful execution plans if retrieved context is provided.
Strictly adhere to the JSON schema.
"""

def profile_corpus(segments: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Reads a random sample of up to 5 sentences from the corpus to profile it.
    Retrieves similar past profiles from memory to guide the execution plan.
    """
    if not segments:
        return {}
        
    # Sample up to 5 segments for profiling
    sample_size = min(5, len(segments))
    sample_texts = [seg['text'] for seg in segments[:sample_size]]
    combined_sample = " ".join(sample_texts)
    
    # Retrieve similar context from Episodic Memory
    similar_past = retrieve_similar(combined_sample, top_k=2)
    memory_context = ""
    if similar_past:
        memory_context = "\n[Retrieved Memory of Similar Corpora:]\n"
        for idx, mem in enumerate(similar_past):
            memory_context += f"Domain: {mem.get('domain')}, Frameworks Used: {mem.get('frameworks_used')}\n"

    try:
        parsed_data = get_structured_completion(
            prompt=f"Text Sample: '{combined_sample}'\n{memory_context}",
            system_prompt=SYSTEM_PROMPT,
            response_model=ProfilerExecutionPlan
        )
        return parsed_data.model_dump()
    except Exception as e:
        print(f"Agent 0 Profiler Error: {e}")
        # Deterministic Fallback: Run everything if Profiler fails
        return {
            "domain": "Unknown",
            "communicative_intent": "Unknown",
            "linguistic_complexity": 0.5,
            "run_pragmatics": True,
            "run_semantics": True,
            "run_register": True,
            "routing_rationale": "Fallback execution plan due to profiler error."
        }
