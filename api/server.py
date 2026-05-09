from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sys
import os

# Ensure the parent directory is in the path to import agents
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from agents.agent1_preprocessor import process_corpus
from agents.agent2_pragmatic import analyze_batch as analyze_pragmatics
from agents.agent3_semantic import analyze_batch as analyze_semantics
from agents.agent4_register import analyze_batch as analyze_register
from agents.agent5_orchestrator import synthesize_report

from agents.agent0_profiler import profile_corpus as run_profiler
from core.memory import save_analysis
import uuid
import time

app = FastAPI(title="PMDD API", description="Pragmatic Meaning Drift Detector Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, this can be restricted to specific Netlify/Vercel URLs
    allow_credentials=False, # Must be False when allow_origins is ["*"]
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    """Returns the operational status of the PMDD Engine."""
    return {
        "status": "online",
        "agents": "active",
        "governance": "loaded",
        "version": "v3.0.0"
    }

class AnalysisRequest(BaseModel):
    text: str

@app.post("/api/analyze")
async def analyze_text(request: AnalysisRequest):
    try:
        start_time = time.time()
        
        # Agent 1
        corpus_data = process_corpus(request.text)
        segments = corpus_data["segments"]
        if not segments:
            raise HTTPException(status_code=400, detail="No valid sentences found.")

        # Agent 0: Profiler (Adaptive Routing)
        execution_plan = run_profiler(segments)
        
        from core.governance import FrameworkGovernance
        trace_log = []
        execution_plan = FrameworkGovernance.enforce_routing_rules(execution_plan, trace_log)
        
        active_frameworks = []
        
        # Agent 2
        if execution_plan.get("run_pragmatics", True):
            try:
                segments = analyze_pragmatics(segments)
                active_frameworks.append("Pragmatics")
            except Exception as e:
                print(f"API Error in Pragmatics: {e}")
                for seg in segments:
                    seg["pragmatics"] = {"speech_act": "error", "confidence": 0.0, "reasoning": "API Timeout"}
            
        # Agent 3
        if execution_plan.get("run_semantics", True):
            try:
                segments = analyze_semantics(segments)
                active_frameworks.append("Semantics")
            except Exception as e:
                print(f"API Error in Semantics: {e}")
                for seg in segments:
                    seg["semantics"] = {"ideational_complexity": "low", "confidence": 0.0, "reasoning": "API Timeout"}
            
        # Agent 4
        if execution_plan.get("run_register", True):
            try:
                segments = analyze_register(segments)
                active_frameworks.append("Register")
            except Exception as e:
                print(f"API Error in Register: {e}")
                for seg in segments:
                    seg["register"] = {"formality_score": 0.0, "confidence": 0.0, "reasoning": "API Timeout"}
            
        # Apply Confidence Penalties before Synthesis
        segments = FrameworkGovernance.apply_confidence_penalties(segments, execution_plan, trace_log)
        
        # Agent 5
        final_output = synthesize_report(segments, execution_plan)
        
        # Attach Traceability Log
        final_output["traceability_log"] = trace_log
        
        # --- CONFIDENCE PROPAGATION ---
        # Calculate Systemic Uncertainty Index
        total_conf = 0.0
        conf_count = 0
        for seg in segments:
            if "pragmatics" in seg and "confidence" in seg["pragmatics"]:
                total_conf += seg["pragmatics"]["confidence"]
                conf_count += 1
            if "semantics" in seg and "confidence" in seg["semantics"]:
                total_conf += seg["semantics"]["confidence"]
                conf_count += 1
            if "register" in seg and "confidence" in seg["register"]:
                total_conf += seg["register"]["confidence"]
                conf_count += 1
                
        avg_confidence = (total_conf / conf_count) if conf_count > 0 else 1.0
        systemic_uncertainty_index = round(1.0 - avg_confidence, 3)
        final_output["math_scores"]["systemic_uncertainty_index"] = systemic_uncertainty_index
        # ------------------------------
        
        # Save to episodic memory
        corpus_id = str(uuid.uuid4())
        sample_text = " ".join([seg['text'] for seg in segments[:3]])
        save_analysis(
            corpus_id=corpus_id,
            domain=execution_plan.get("domain", "Unknown"),
            frameworks=active_frameworks,
            report=final_output.get("report", {}),
            text_sample=sample_text
        )
        
        runtime = round(time.time() - start_time, 2)
        
        return {
            "status": "success",
            "runtime_seconds": runtime,
            "execution_plan": execution_plan,
            "segments": segments,
            "final_output": final_output
        }
    except Exception as e:
        print(f"Error during analysis: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

class LongitudinalRequest(BaseModel):
    time_1_text: str
    time_2_text: str

@app.post("/api/analyze/longitudinal")
async def analyze_longitudinal(request: LongitudinalRequest):
    """
    Analyzes two texts chronologically and calculates semantic/pragmatic drift.
    """
    try:
        from core.math_engine import calculate_longitudinal_drift
        from core.governance import FrameworkGovernance
        
        # Analyze Time 1
        segments_1 = process_corpus(request.time_1_text)["segments"]
        plan_1 = run_profiler(segments_1)
        plan_1 = FrameworkGovernance.enforce_routing_rules(plan_1)
        if plan_1.get("run_pragmatics", True): segments_1 = analyze_pragmatics(segments_1)
        if plan_1.get("run_semantics", True): segments_1 = analyze_semantics(segments_1)
        if plan_1.get("run_register", True): segments_1 = analyze_register(segments_1)
        segments_1 = FrameworkGovernance.apply_confidence_penalties(segments_1, plan_1)
        report_1 = synthesize_report(segments_1, plan_1)
        
        # Analyze Time 2
        segments_2 = process_corpus(request.time_2_text)["segments"]
        plan_2 = run_profiler(segments_2)
        plan_2 = FrameworkGovernance.enforce_routing_rules(plan_2)
        if plan_2.get("run_pragmatics", True): segments_2 = analyze_pragmatics(segments_2)
        if plan_2.get("run_semantics", True): segments_2 = analyze_semantics(segments_2)
        if plan_2.get("run_register", True): segments_2 = analyze_register(segments_2)
        segments_2 = FrameworkGovernance.apply_confidence_penalties(segments_2, plan_2)
        report_2 = synthesize_report(segments_2, plan_2)
        
        # Extract Speech Act Distributions
        def extract_sa_dist(segments):
            dist = {}
            for s in segments:
                if "pragmatics" in s and "speech_act" in s["pragmatics"]:
                    sa = s["pragmatics"]["speech_act"].lower()
                    dist[sa] = dist.get(sa, 0) + 1
            return dist
            
        dist_1 = extract_sa_dist(segments_1)
        dist_2 = extract_sa_dist(segments_2)
        
        # Calculate Math Drift
        drift_score = calculate_longitudinal_drift(dist_1, dist_2)
        
        return {
            "time_1_report": report_1,
            "time_2_report": report_2,
            "longitudinal_metrics": {
                "kl_divergence_drift": round(drift_score, 4),
                "speech_act_distribution_t1": dist_1,
                "speech_act_distribution_t2": dist_2,
                "drift_magnitude": "High" if drift_score > 0.5 else "Moderate" if drift_score > 0.2 else "Low"
            }
        }
    except Exception as e:
        print(f"Error during longitudinal analysis: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}
