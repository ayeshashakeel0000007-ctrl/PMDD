from typing import List, Dict, Any
from core.math_engine import calculate_entropy, confidence_weighted_aggregation
from pydantic import BaseModel, Field

class SynthesisReport(BaseModel):
    simple_explanation: str = Field(..., description="An easy-to-understand summary for non-specialists.")
    technical_analysis: str = Field(..., description="A rigorous academic synthesis with mathematical references.")
    conclusion: str

def synthesize_report(segments: List[Dict[str, Any]], execution_plan: Dict[str, Any] = None) -> Dict[str, Any]:
    """
    Agent 5 Orchestrator. 
    Uses confidence-weighted aggregation.
    """
    # 1. Pragmatics: Speech Act Entropy
    speech_act_counts = {"Assertive": 0, "Directive": 0, "Commissive": 0, "Expressive": 0, "Declaration": 0}
    total_acts = 0
    
    for seg in segments:
        if "pragmatics" in seg and "speech_acts" in seg["pragmatics"]:
            for act in seg["pragmatics"]["speech_acts"]:
                cat = act["category"]
                if cat in speech_act_counts:
                    speech_act_counts[cat] += 1
                    total_acts += 1
                    
    if total_acts > 0:
        probs = [count / total_acts for count in speech_act_counts.values()]
        pragmatic_entropy = calculate_entropy(probs)
    else:
        pragmatic_entropy = 0.0

    # 2. Register: Confidence-Weighted Formality
    formality_tuples = []
    for seg in segments:
        if "register" in seg and "formality_score" in seg["register"]:
            f_score = seg["register"]["formality_score"]
            # Default confidence to 1.0 if not present for some reason
            conf = seg["register"].get("confidence", 1.0)
            formality_tuples.append((f_score, conf))
            
    avg_formality = confidence_weighted_aggregation(formality_tuples)
    
    # 3. Synthesis Prompt
    from utils.openai_client import get_structured_completion
    
    plan_str = str(execution_plan) if execution_plan else "None"
    
    system_prompt = f"""
    You are the Chief Linguistic Analyst. Synthesize the linguistic findings into a dual-layer report.
    
    Mathematical Data:
    - Pragmatic Entropy: {pragmatic_entropy:.3f}
    - Speech Act Distribution: {speech_act_counts}
    - Confidence-Weighted Formality: {avg_formality:.3f}
    
    Execution Routing Context:
    {plan_str}
    
    Provide BOTH a simple explanation and a technical academic analysis.
    """
    
    try:
        report_data = get_structured_completion(
            prompt="Synthesize the findings.",
            system_prompt=system_prompt,
            response_model=SynthesisReport
        )
        return {
            "math_scores": {
                "pragmatic_entropy": pragmatic_entropy,
                "speech_act_distribution": speech_act_counts,
                "confidence_weighted_formality": avg_formality
            },
            "report": report_data.model_dump()
        }
    except Exception as e:
        print(f"Agent 5 Error: {e}")
        return {"error": str(e)}
