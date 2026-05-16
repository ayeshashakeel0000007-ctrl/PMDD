# PMDD Thesis Drafting Guide

This document provides structured writing assistance for the PMDD thesis, ensuring the project is presented as an **explainable, uncertainty-aware computational discourse modeling framework operating under constrained theoretical assumptions.**

---

## 1. Claim Discipline (What PMDD Claims vs. Does Not Claim)

To maintain rigorous scientific credibility and avoid hyperbolic AGI framing, adhere to these boundaries throughout the thesis:

### What PMDD Claims:
- **Heuristic Mapping:** PMDD claims to reliably map English syntactic dependencies to Hallidayan Transitivity categories using deterministic, static rules.
- **Drift Quantification:** PMDD claims to calculate a mathematically stable Kullback-Leibler (KL) divergence score representing the distributional shift in speech acts over time.
- **Calibration Transparency:** PMDD claims to expose its own uncertainty, calculating Expected Calibration Error (ECE) and highlighting disagreement hotspots.
- **Explainability:** PMDD claims that every pragmatic prediction can be perfectly traced back to the specific clause, word, and rule that generated it.

### What PMDD Does NOT Claim:
- **True "Understanding":** PMDD does *not* read, comprehend, or "understand" human language. It is a structural pattern matcher.
- **General Intelligence:** PMDD is *not* a general-purpose LLM or an AGI.
- **Perfect Semantic Resolution:** PMDD does *not* claim to perfectly resolve deep irony, sarcasm, or multi-layered metaphor.
- **Predictive Power:** PMDD measures *historical* rhetorical drift; it does not predict future human behavior.

---

## 2. Strongest Scientific Contributions
When framing the core value of the thesis, emphasize:
1. **Methodological Transparency & Reproducibility:** Unlike black-box LLMs, PMDD’s frozen heuristics and random seed locking guarantee 100% deterministic reproducibility.
2. **Calibration Integrity:** The integration of Reliability Diagrams and Disagreement Analysis, treating AI doubt as a feature rather than a bug.
3. **Theory Integration:** The novel fusion of Information Theory (KL Divergence) with Systemic Functional Linguistics (SFL).

---

## 3. Reviewer Anticipation Notes (Defense Preparation)

Anticipate and proactively address these common academic challenges in your Methodology or Discussion chapters:

- **Why heuristic SFL instead of deep neural parsing (e.g., BERT/Transformers)?**
  *Response:* Neural models suffer from uncalibrated overconfidence and black-box unexplainability. Heuristics were chosen explicitly to guarantee deterministic tracing; when the model fails, the researcher knows *exactly* which syntactic dependency caused the failure, allowing for scientific critique rather than algorithmic guessing.
- **Why KL Divergence instead of Cosine Similarity?**
  *Response:* Cosine similarity measures vector distance (often polluted by topic overlap). KL Divergence measures *distributional* shift in action/intent, natively handling the concept of vanishing speech acts (via Laplace smoothing).
- **How is uncertainty modeled?**
  *Response:* Through confidence binning against human empirical accuracy (Calibration Curves). Uncertainty is not hidden; it is aggressively surfaced in the "Disagreement Explorer."

---

## 4. Recommended Thesis Structure & Word Counts

### Chapter 1: Introduction (Approx. 1,500 - 2,000 words)
- The crisis of black-box NLP in discourse analysis.
- The need for explainable, theory-grounded observatories.
- *Asset:* PMDD Architecture Mermaid Diagram.

### Chapter 2: Literature Review (Approx. 3,000 - 4,000 words)
- Systemic Functional Linguistics (SFL) and Transitivity.
- Pragmatic Drift and Escalation modeling.
- The state of AI Calibration and Disagreement science.

### Chapter 3: Methodology & Architecture (Approx. 3,000 - 4,000 words)
- *Asset:* `PMDD_METHODOLOGY_WHITEPAPER.md`
- Detail the SFL spaCy extraction rules.
- Detail the KL Divergence math and smoothing constants.
- State the Architecture Freeze constraints (Python seed locking).

### Chapter 4: Validation & Calibration Science (Approx. 2,500 - 3,500 words)
- *Asset:* The Sanity Benchmark Matrix.
- *Asset:* Reliability Diagrams (Calibration Curves).
- Compare Expected Confidence vs. Observed Empirical Accuracy.

### Chapter 5: Results (Empirical Corpus Execution) (Approx. 3,000 - 5,000 words)
- Present the findings from the real-world corpora runs (Political, Crisis, Institutional).
- *Asset:* Ablation Study Chart (proving SFL's necessity).

### Chapter 6: Discussion & Disagreement Analysis (Approx. 2,500 - 3,500 words)
- Provide deep qualitative analysis using the Secondary Process labels.
- Analyze the "Confidence Collapse Zones."

### Chapter 7: Limitations & Error Taxonomy (Approx. 1,500 - 2,000 words)
- *Asset:* `PMDD_ERROR_TAXONOMY.md`
- Explicitly discuss Metaphor, Sarcasm, and Mixed Transitivity boundaries.

### Chapter 8: Conclusion & Future Work (Approx. 1,000 - 1,500 words)
- Summarize PMDD as a step toward honest, calibrated computational linguistics.
