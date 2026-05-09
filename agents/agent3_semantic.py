from typing import List, Dict, Any
from utils.openai_client import get_structured_completion
from core.llm_schemas import SemanticAnalysis

SYSTEM_PROMPT = """
You are a semanticist. Extract key content words (nouns, main verbs, adjectives) from the text and assign them to broad Semantic Fields (e.g., 'POWER', 'EMOTION', 'CLINICAL', 'ECONOMY', 'POLITICS', 'SOCIETY').
You must carefully consider the contextual meaning of the word in this specific sentence.
Strictly follow the JSON schema.
"""

def analyze_batch(segments: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Analyzes semantic fields for content words in the segments.
    """
    results = []
    for seg in segments:
        text = seg['text']
        try:
            parsed_data = get_structured_completion(
                prompt=f"Text to analyze: '{text}'",
                system_prompt=SYSTEM_PROMPT,
                response_model=SemanticAnalysis
            )
            results.append({**seg, "semantics": parsed_data.model_dump()})
        except Exception as e:
            print(f"Agent 3 Error on segment {seg['id']}: {e}")
            results.append({**seg, "semantics": {"error": str(e)}})
            
    return results
