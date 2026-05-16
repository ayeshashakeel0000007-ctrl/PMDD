# PMDD Thesis Structure & Assets

This document maps the PMDD software engineering outputs directly into your formal thesis chapters.

## Thesis Outline Mapping

### 1. Introduction
- **Asset:** Use the **Longitudinal Semantic Observatory Pipeline** Mermaid diagram to introduce the end-to-end system.
- **Focus:** The need for explainable, uncertainty-aware computational discourse analysis over black-box LLMs.

### 2. Related Work
- **Focus:** Systemic Functional Linguistics (SFL), Kullback-Leibler Divergence in NLP, and existing limitations in pragmatic drift measurement.

### 3. Methodology & Architecture
- **Asset:** `docs/PMDD_METHODOLOGY_WHITEPAPER.md` (Integrate entirely).
- **Asset:** **SFL Transitivity Pipeline** Mermaid diagram.
- **Asset:** **Pragmatic Drift Workflow** Mermaid diagram.
- **Focus:** The deterministic freezing of the architecture, random seed locking, and strict heuristic mapping.

### 4. Empirical Validation & Sanity Benchmarking
- **Asset:** The "Sanity Validation Matrix" output from `experiments/run_sanity_checks.py`.
- **Asset:** The Pilot Annotation Protocol (`docs/ANNOTATION_PILOT_PROTOCOL.md`).
- **Focus:** Proving the system responds linearly to the Drift Sensitivity Gradient (0% -> 100% escalation).

### 5. Confidence Calibration Science
- **Asset:** The Reliability Diagram PDF (`experiments/generate_publication_plots.py`).
- **Asset:** **Calibration & Reliability Loop** Mermaid diagram.
- **Focus:** Overconfidence detection and Expected Calibration Error (ECE).

### 6. Ablation Studies
- **Asset:** The Ablation Bar Chart (`experiments/results/ablation/ablation_chart.pdf`).
- **Focus:** Proving that the removal of the SFL Hallidayan engine critically damages the model's ability to detect semantic escalation.

### 7. Disagreement Analysis
- **Asset:** The **Disagreement Analysis Pipeline** Mermaid diagram.
- **Asset:** Transitivity Confusion Matrix PDF.
- **Focus:** Surfacing the Human vs Agent mismatches natively via the React Dashboard.

### 8. Limitations (Error Taxonomy)
- **Asset:** `docs/PMDD_ERROR_TAXONOMY.md`
- **Focus:** Sarcasm, Mixed Transitivity, and Semantic Ambiguity.

---

## Formal Terminology Table

| Term | PMDD Formal Definition |
| :--- | :--- |
| **Pragmatic Meaning Drift** | A quantifiable scalar (0.0 - 1.0) calculated via KL Divergence representing the structural shift in speech act distributions between Time 1 and Time 2. |
| **Hallidayan Process Shift** | The longitudinal migration of clause structures (e.g., from *Relational* states of being to *Material* aggressive action). |
| **False Escalation** | An error state where syntactic aggression is registered, but human pragmatics dictate neutral intent (surfaced via Disagreement Explorer). |
| **Uncertainty Calibration** | The mathematical alignment between the system's *Expected Confidence* and its *Observed Empirical Accuracy*. |
| **Discourse Fragmentation** | Highly abbreviated, low-context syntactic structures that cause standard dependency parsing to fail or misclassify. |
