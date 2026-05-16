from typing import List, Dict, Any
from utils.openai_client import get_structured_completion
from core.llm_schemas import BatchSemanticAnalysis

SYSTEM_PROMPT = """
You are a semanticist. Extract key content words and assign them to Semantic Fields for each segment.
Strictly follow the JSON schema. Return ONLY compact JSON. No verbose explanations.
"""

async def analyze_batch(segments: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Analyzes semantic fields for content words in ONE concurrent API call.
    """
    if not segments: return segments
    
    batch_text = "\n".join([f"[{seg['id']}] {seg['text']}" for seg in segments])
    prompt = f"Segments to analyze:\n{batch_text}"
    
    try:
        parsed_data = await get_structured_completion(
            prompt=prompt,
            system_prompt=SYSTEM_PROMPT,
            response_model=BatchSemanticAnalysis
        )
        res_map = {r.segment_id: r.analysis.model_dump() for r in parsed_data.results}
        return [{**seg, "semantics": res_map.get(seg['id'], {"error": "Missing analysis"})} for seg in segments]
    except Exception as e:
        print(f"Agent 3 Batch Error: {e}")
        return [{**seg, "semantics": {"error": str(e)}} for seg in segments]
