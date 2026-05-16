import json
from typing import List, Dict, Any
from utils.openai_client import get_structured_completion
from core.llm_schemas import BatchPragmaticAnalysis

SYSTEM_PROMPT = """
You are a computational pragmatics expert. Analyze the given text segments using strict linguistic frameworks:
1. Speech Act Theory: Classify the dominant speech acts. Choose from: Assertive, Directive, Commissive, Expressive, Declaration.
2. Gricean Maxims: Identify any violations.
You must strictly follow the required JSON schema. Return ONLY compact JSON. No verbose explanations or chain-of-thought.
"""

async def analyze_batch(segments: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Analyzes a batch of segments for pragmatic features in ONE concurrent API call.
    """
    if not segments: return segments
    
    # Prepare batch prompt
    batch_text = "\n".join([f"[{seg['id']}] {seg['text']}" for seg in segments])
    prompt = f"Segments to analyze:\n{batch_text}"
    
    try:
        parsed_data = await get_structured_completion(
            prompt=prompt,
            system_prompt=SYSTEM_PROMPT,
            response_model=BatchPragmaticAnalysis
        )
        # Map back to segments
        res_map = {r.segment_id: r.analysis.model_dump() for r in parsed_data.results}
        return [{**seg, "pragmatics": res_map.get(seg['id'], {"error": "Missing analysis"})} for seg in segments]
    except Exception as e:
        print(f"Agent 2 Batch Error: {e}")
        return [{**seg, "pragmatics": {"error": str(e)}} for seg in segments]
