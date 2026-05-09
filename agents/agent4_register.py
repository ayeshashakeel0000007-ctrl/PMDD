from typing import List, Dict, Any
from utils.openai_client import get_structured_completion
from core.llm_schemas import RegisterAnalysis

SYSTEM_PROMPT = """
You are an expert in Systemic Functional Linguistics and Register Theory (Halliday).
Analyze the register of the given text segment.
1. Assign a formality score from 0.0 (highly informal, colloquial) to 1.0 (highly formal, academic/legal).
2. Identify the Tenor (the relationship between speaker and audience, e.g., 'Expert to Novice', 'Peer to Peer').
3. Identify the Mode (the channel characteristics, e.g., 'Written to be read', 'Spoken dialogue').
Extract textual evidence justifying your analysis.
Strictly follow the JSON schema.
"""

def analyze_batch(segments: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Analyzes register features for segments.
    """
    results = []
    for seg in segments:
        text = seg['text']
        try:
            parsed_data = get_structured_completion(
                prompt=f"Text to analyze: '{text}'",
                system_prompt=SYSTEM_PROMPT,
                response_model=RegisterAnalysis
            )
            results.append({**seg, "register": parsed_data.model_dump()})
        except Exception as e:
            print(f"Agent 4 Error on segment {seg['id']}: {e}")
            results.append({**seg, "register": {"error": str(e)}})
            
    return results
