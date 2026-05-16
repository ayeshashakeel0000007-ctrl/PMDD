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
from core.transitivity_engine import process_segments_for_transitivity
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
        timings = {}
        total_start_time = time.time()
        
        # Agent 1
        t0 = time.time()
        corpus_data = process_corpus(request.text)
        timings["preprocessing"] = round(time.time() - t0, 3)
        
        segments = corpus_data["segments"]
        if not segments:
            raise HTTPException(status_code=400, detail="No valid sentences found.")

        # Agent 0: Profiler (Adaptive Routing)
        t0 = time.time()
        execution_plan = await run_profiler(segments)
        from core.governance import FrameworkGovernance
        trace_log = []
        execution_plan = FrameworkGovernance.enforce_routing_rules(execution_plan, trace_log)
        timings["profiling"] = round(time.time() - t0, 3)
        
        active_frameworks = []
        
        import asyncio
        tasks = []
        keys = []
        
        # Stage B: Concurrent Execution
        t_stage_b = time.time()
        
        if execution_plan.get("run_pragmatics", True):
            tasks.append(analyze_pragmatics(segments))
            keys.append("pragmatics")
            active_frameworks.append("Pragmatics")
            
        if execution_plan.get("run_semantics", True):
            tasks.append(analyze_semantics(segments))
            keys.append("semantics")
            active_frameworks.append("Semantics")
            
        if execution_plan.get("run_register", True):
            tasks.append(analyze_register(segments))
            keys.append("register")
            active_frameworks.append("Register")

        concurrent_results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Merge Stage B results
        for i, key in enumerate(keys):
            res = concurrent_results[i]
            if isinstance(res, Exception):
                print(f"API Error in {key}: {res}")
                for seg in segments:
                    if key == "pragmatics": seg["pragmatics"] = {"speech_acts": [], "confidence": 0.0}
                    elif key == "semantics": seg["semantics"] = {"semantic_fields": [], "confidence": 0.0}
                    elif key == "register": seg["register"] = {"formality_score": 0.0, "confidence": 0.0}
            else:
                for j, seg_res in enumerate(res):
                    if key in seg_res:
                        segments[j][key] = seg_res[key]
                        
        timings["stage_b_concurrent"] = round(time.time() - t_stage_b, 3)
            
        # Hallidayan Transitivity Engine
        try:
            t0 = time.time()
            segments = process_segments_for_transitivity(segments)
            timings["transitivity_parsing"] = round(time.time() - t0, 3)
            active_frameworks.append("Transitivity")
        except Exception as e:
            print(f"API Error in Transitivity: {e}")
            for seg in segments:
                seg["transitivity"] = {"process_type": "unknown", "participants": [], "circumstances": [], "confidence": 0.0, "inference_explanation": "Error"}

        # Apply Confidence Penalties before Synthesis
        t0 = time.time()
        segments = FrameworkGovernance.apply_confidence_penalties(segments, execution_plan, trace_log)
        
        # Agent 5
        final_output = await synthesize_report(segments, execution_plan)
        timings["calibration_scoring"] = round(time.time() - t0, 3)
        
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
        await save_analysis(
            corpus_id=corpus_id,
            domain=execution_plan.get("domain", "Unknown"),
            frameworks=active_frameworks,
            report=final_output.get("report", {}),
            text_sample=sample_text
        )
        
        runtime = round(time.time() - total_start_time, 3)
        timings["total_execution_time"] = runtime
        print(f"Execution Timings: {timings}")
        
        return {
            "status": "success",
            "runtime_seconds": runtime,
            "timings": timings,
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
        
        timings = {}
        total_start_time = time.time()
        import asyncio

        async def process_time_corpus(text: str, label: str):
            t_start = time.time()
            segments = process_corpus(text)["segments"]
            plan = await run_profiler(segments)
            plan = FrameworkGovernance.enforce_routing_rules(plan)
            
            tasks = []
            keys = []
            if plan.get("run_pragmatics", True):
                tasks.append(analyze_pragmatics(segments))
                keys.append("pragmatics")
            if plan.get("run_semantics", True):
                tasks.append(analyze_semantics(segments))
                keys.append("semantics")
            if plan.get("run_register", True):
                tasks.append(analyze_register(segments))
                keys.append("register")
                
            concurrent_results = await asyncio.gather(*tasks, return_exceptions=True)
            
            for i, key in enumerate(keys):
                res = concurrent_results[i]
                if isinstance(res, Exception):
                    for seg in segments:
                        if key == "pragmatics": seg["pragmatics"] = {"speech_acts": [], "confidence": 0.0}
                        elif key == "semantics": seg["semantics"] = {"semantic_fields": [], "confidence": 0.0}
                        elif key == "register": seg["register"] = {"formality_score": 0.0, "confidence": 0.0}
                else:
                    for j, seg_res in enumerate(res):
                        if key in seg_res: segments[j][key] = seg_res[key]
                        
            segments = process_segments_for_transitivity(segments)
            segments = FrameworkGovernance.apply_confidence_penalties(segments, plan)
            report = await synthesize_report(segments, plan)
            return segments, report, round(time.time() - t_start, 3)

        # Run Time 1 and Time 2 concurrently
        t0 = time.time()
        (segments_1, report_1, t1_time), (segments_2, report_2, t2_time) = await asyncio.gather(
            process_time_corpus(request.time_1_text, "time_1"),
            process_time_corpus(request.time_2_text, "time_2")
        )
        timings["time_1_processing"] = t1_time
        timings["time_2_processing"] = t2_time
        timings["parallel_t1_t2_processing"] = round(time.time() - t0, 3)
        
        # Helper to calculate and append uncertainty
        def append_uncertainty(report, segments):
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
            if "math_scores" not in report:
                report["math_scores"] = {}
            report["math_scores"]["systemic_uncertainty_index"] = round(1.0 - avg_confidence, 3)

        append_uncertainty(report_1, segments_1)
        append_uncertainty(report_2, segments_2)

        # Extract Speech Act Distributions
        def extract_sa_dist(segments):
            dist = {}
            for s in segments:
                if "pragmatics" in s and "speech_acts" in s["pragmatics"]:
                    for act in s["pragmatics"]["speech_acts"]:
                        if "category" in act:
                            sa = act["category"]
                            dist[sa] = dist.get(sa, 0) + 1
            return dist
            
        dist_1 = extract_sa_dist(segments_1)
        dist_2 = extract_sa_dist(segments_2)
        
        def extract_transitivity_dist(segments):
            dist = {}
            for s in segments:
                if "transitivity" in s:
                    ptype = s["transitivity"]["process_type"]
                    dist[ptype] = dist.get(ptype, 0) + 1
            return dist

        trans_dist_1 = extract_transitivity_dist(segments_1)
        trans_dist_2 = extract_transitivity_dist(segments_2)
        
        # Calculate Math Drift
        t0 = time.time()
        drift_score = calculate_longitudinal_drift(dist_1, dist_2)
        timings["kl_divergence_computation"] = round(time.time() - t0, 3)
        
        # Derived Transitivity Metrics
        def safe_div(a, b): return round(a / b if b > 0 else 0, 3)
        t1_total = sum(trans_dist_1.values()) or 1
        t2_total = sum(trans_dist_2.values()) or 1
        
        mai = safe_div(trans_dist_2.get("material", 0), t2_total) - safe_div(trans_dist_1.get("material", 0), t1_total)
        ifs = 1.0 - safe_div(trans_dist_2.get("behavioral", 0) + trans_dist_2.get("mental", 0), t2_total)
        ecd = safe_div(trans_dist_2.get("mental", 0), t2_total)
        vpp = safe_div(trans_dist_2.get("verbal", 0), t2_total)
        rsi = safe_div(trans_dist_2.get("relational", 0), t2_total)
        brs = safe_div(trans_dist_2.get("behavioral", 0), t2_total)
        ecf = safe_div(trans_dist_2.get("existential", 0), t2_total)
        
        timings["total_execution_time"] = round(time.time() - total_start_time, 3)
        print(f"Longitudinal Execution Timings: {timings}")
        
        return {
            "time_1_report": report_1,
            "time_2_report": report_2,
            "timings": timings,
            "longitudinal_metrics": {
                "kl_divergence_drift": round(drift_score, 4),
                "speech_act_distribution_t1": dist_1,
                "speech_act_distribution_t2": dist_2,
                "transitivity_distribution_t1": trans_dist_1,
                "transitivity_distribution_t2": trans_dist_2,
                "drift_magnitude": "High" if drift_score > 0.5 else "Moderate" if drift_score > 0.2 else "Low",
                "transitivity_metrics": {
                    "material_aggression_index": mai,
                    "institutional_formality_score": ifs,
                    "emotional_cognition_density": ecd,
                    "verbal_persuasion_pressure": vpp,
                    "relational_stability_index": rsi,
                    "behavioral_reactivity_score": brs,
                    "existential_crisis_framing": ecf
                }
            }
        }
    except Exception as e:
        print(f"Error during longitudinal analysis: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}
