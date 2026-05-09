# PMDD: Pragmatic Meaning Drift Detector

**An interpretable computational linguistics infrastructure for deterministic governance, adaptive discourse analysis, uncertainty-aware linguistic reasoning, and longitudinal semantic drift experimentation.**

## 1. Abstract
The PMDD platform is a research-grade, multi-agent computational linguistics framework. It analyzes complex discourse (political, institutional, conversational) using specialized Large Language Model (LLM) agents grounded in formal linguistic theories (Speech Act Theory, Systemic Functional Linguistics, Register Theory). 

Crucially, it utilizes a **Deterministic Governance Layer** to mathematically constrain LLM autonomy, ensuring high reproducibility, transparent traceability, and formal uncertainty measurement.

## 2. Architecture & Deterministic Governance
PMDD enforces a strict hierarchical separation of concerns to prevent uncontrolled LLM hallucination:

1. **Agent 0 (Profiler)**: Scans the corpus and proposes an "Execution Plan" (e.g., determining which linguistic frameworks are necessary).
2. **Framework Governance (Deterministic Layer)**: Hardcoded Python rules intercept the Profiler's plan. It can forcefully override routing (e.g., forcing Register analysis for Political text) and applies mathematical penalties to the LLM's raw confidence scores based on structural instability or weak evidence.
3. **Specialized Agents (Pragmatics, Semantics, Register)**: Execute localized, highly constrained analysis based on the strict governance parameters.
4. **Agent 5 (Orchestrator)**: Synthesizes the final report.

*(For detailed architectural methodology and flowcharts, see `docs/research/governance_methodology.md`)*

## 3. Uncertainty Science & Calibration
The platform does not accept LLM confidence at face value.
- **Systemic Uncertainty Index**: A top-level mathematical aggregate of all penalized confidence scores.
- **Expected Calibration Error (ECE)**: The platform natively supports ECE benchmarking (`core/benchmarking.py`) to measure if the LLM is overconfident compared to human "Gold Standard" annotations.
- **Traceability Logs**: Every single governance intervention (routing override or confidence penalty) is permanently logged and exportable.

*(For uncertainty methodology, see `docs/research/uncertainty_methodology.md`)*

## 4. Longitudinal & Batch Experimentation
PMDD is built for large-scale, offline empirical research.
- **Batch Runner**: `experiments/batch_runner.py` allows researchers to queue hundreds of JSON experiment configurations and execute them sequentially, ensuring deterministic stability and protecting against API rate limits.
- **Longitudinal Drift Tracking**: The mathematical engine calculates formal **KL Divergence** and **Temporal Variance** across chronological corpora to mathematically prove semantic and pragmatic drift over time.
- **Offline Plotting**: Use `docs/research/generate_plots.py` to convert batch output data into publication-ready Reliability Diagrams and Calibration Histograms.

## 5. UI/UX: The Analytical Engine
The platform includes an elegant, React-based frontend designed specifically for researchers.
- **Dual-Layer Reporting**: Switch seamlessly between a "Practical Summary" and a highly detailed "Academic Analysis".
- **Visual Confidence**: Sentence matrices are dynamically tinted based on localized confidence scores.
- **Citation-Ready Exports**: Instantly download results as JSON, metric CSVs, or fully formatted Methodological Markdown (`.md`) reports containing the full Traceability Audit Trail.

## 6. Installation & Execution
1. Clone the repository.
2. Install Python dependencies: `pip install -r requirements.txt` (including `openai`, `fastapi`, `numpy`, `scipy`, `matplotlib`).
3. Set your `OPENAI_API_KEY` in a `.env` file.
4. **Run the Backend API**: `uvicorn api.server:app --reload --port 8000`
5. **Run the Frontend UI**: Navigate to `frontend/` and run `npm install` followed by `npm run dev`.
6. **Run Batch Experiments**: `python experiments/batch_runner.py`

## 7. Research Status
Currently undergoing Phase 9 (Human vs. Agent Empirical Validation Studies).
Targeting publication-grade reproducibility and calibration modeling.
