import json
from typing import List, Dict, Any
from utils.openai_client import get_structured_completion
from core.llm_schemas import PragmaticAnalysis

SYSTEM_PROMPT = """
You are a computational pragmatics expert. Analyze the given text segment using strict linguistic frameworks:
1. Speech Act Theory (Searle): Classify the dominant speech acts. Choose from: Assertive, Directive, Commissive, Expressive, Declaration.
2. Gricean Maxims: Identify any violations of Quantity, Quality, Relation, or Manner.
You must strictly follow the required JSON schema. Only return valid classifications based on the text. Provide exact substrings as evidence.
"""

def analyze_batch(segments: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Analyzes a batch of segments for pragmatic features.
    In a production system, this should be async or batched into a single prompt for efficiency.
    For Phase 1 stability, we process sequentially.
    """
    results = []
    for seg in segments:
        text = seg['text']
        try:
            parsed_data = get_structured_completion(
                prompt=f"Text to analyze: '{text}'",
                system_prompt=SYSTEM_PROMPT,
                response_model=PragmaticAnalysis
            )
            # Convert pydantic model to dict
            pragmatic_data = parsed_data.model_dump()
            # We don't expose _reasoning to the final output, keep it internally or discard
            # Or we can keep it in the dict but not show in the UI
            results.append({**seg, "pragmatics": pragmatic_data})
        except Exception as e:
            # Deterministic fallback or error logging
            print(f"Agent 2 Error on segment {seg['id']}: {e}")
            results.append({**seg, "pragmatics": {"error": str(e)}})
            
    return results
