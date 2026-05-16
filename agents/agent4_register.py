from typing import List, Dict, Any
from utils.openai_client import get_structured_completion
from core.llm_schemas import BatchRegisterAnalysis

SYSTEM_PROMPT = """
You are an expert in Systemic Functional Linguistics and Register Theory.
Analyze the register of the text segments.
1. Assign a formality score from 0.0 to 1.0.
2. Identify Tenor and Mode.
Strictly follow the JSON schema. Return ONLY compact JSON. No verbose explanations.
"""

async def analyze_batch(segments: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Analyzes register features for segments in ONE concurrent API call.
    """
    if not segments: return segments
    
    batch_text = "\n".join([f"[{seg['id']}] {seg['text']}" for seg in segments])
    prompt = f"Segments to analyze:\n{batch_text}"
    
    try:
        parsed_data = await get_structured_completion(
            prompt=prompt,
            system_prompt=SYSTEM_PROMPT,
            response_model=BatchRegisterAnalysis
        )
        res_map = {r.segment_id: r.analysis.model_dump() for r in parsed_data.results}
        return [{**seg, "register": res_map.get(seg['id'], {"error": "Missing analysis"})} for seg in segments]
    except Exception as e:
        print(f"Agent 4 Batch Error: {e}")
        return [{**seg, "register": {"error": str(e)}} for seg in segments]
