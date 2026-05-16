# Pragmatic Meaning Drift Detector (PMDD)

**An explainable, calibration-aware computational discourse experimentation framework for longitudinal pragmatic and Hallidayan transitivity analysis.**

## 1. Project Abstract
PMDD is a deterministic linguistic research framework designed to quantify "Pragmatic Meaning Drift" (PMD) over time. By fusing **Systemic Functional Linguistics (SFL)** heuristic extraction with **Information Theory (Kullback-Leibler Divergence)**, PMDD provides a reproducible, trace-able mechanism to observe how institutional rhetoric escalates into directive aggression. 

Unlike black-box Large Language Models (LLMs), PMDD operates under strict, transparent methodological boundaries. It does not claim "true semantic understanding" or AGI capabilities. Instead, it relies on explicit syntactic dependency parsing, ensuring that every shift in pragmatic tone is entirely explainable and reproducible.

## 2. Strongest Scientific Contributions
PMDD was engineered specifically for academic rigor and reviewer transparency:
- **Explainability:** 100% trace-ability from the final KL scalar back to the specific spaCy dependency node that triggered the classification.
- **Calibration Science:** PMDD natively bounds its own uncertainty. It outputs Expected Calibration Error (ECE) and visual Reliability Diagrams, actively highlighting "Confidence Collapse Zones" to the researcher.
- **Disagreement Transparency:** The framework embraces human-machine disagreement as a feature, supplying a "Disagreement Explorer" to analyze edge cases in sarcasm, irony, and complex metaphor.
- **Reproducibility:** Seed-locked architecture (`PYTHONHASHSEED`, standard `random`, and `numpy` fixed to `42`) guarantees that identical data will always yield identical drift metrics.
- **Hallidayan Integration:** The system successfully operationalizes M.A.K. Halliday’s Transitivity framework (Material, Mental, Verbal, Relational) into a computational NLP pipeline.

## 3. Core Architecture
- **Data Ingestion:** Reads chronological text sets (e.g., speeches, transcripts).
- **Speech Act Engine:** Heuristically tags clauses (Directive, Expressive, Assertive).
- **Transitivity Engine (SFL):** Extracts the primary syntactic root to assign Hallidayan verb processes.
- **Calibration Loop:** Bins confidence scores and compares them against human ground-truth labels.
- **Drift Calculation:** Calculates temporal drift severity via normalized KL Divergence.

## 4. Running the Sanity Benchmarks
To prove the deterministic stability of the architecture, PMDD ships with a suite of controlled synthetic corpora.
```bash
# Execute the strict validation matrix
python experiments/run_sanity_checks.py

# Execute the mathematical ablation study
python experiments/run_ablation_study.py
```
Outputs (including Overleaf-ready PDFs and CSVs) are automatically archived in `experiments/results/`.

## 5. Thesis Artifacts & Documentation
This repository contains a full suite of artifacts prepared for academic deployment:
- `docs/PMDD_METHODOLOGY_WHITEPAPER.md`: The formal algorithmic pipeline.
- `docs/PMDD_ERROR_TAXONOMY.md`: Explicit boundary awareness and limitation logging.
- `docs/ANNOTATION_PILOT_PROTOCOL.md`: Protocol for human-in-the-loop validation studies.
- `docs/BEST_EXAMPLE_GALLERY.md`: Curated instances of drift escalation and calibration hotspots.
- `experiments/EXPERIMENT_JOURNAL_TEMPLATE.md`: Standardized logging for real-world corpus runs.

## 6. How to Cite PMDD
If you use PMDD for longitudinal discourse analysis or explainable NLP experimentation, please cite the project:

**Citation Example:**
> Author Name. (2026). *Pragmatic Meaning Drift Detector (PMDD): An explainable, calibration-aware computational discourse experimentation framework.* [Software].

**BibTeX:**
```bibtex
@software{pmdd_2026,
  author = {Author Name},
  title = {Pragmatic Meaning Drift Detector (PMDD)},
  year = {2026},
  note = {An explainable, calibration-aware computational discourse framework.}
}
```

**Reproducibility Statement:**
Researchers replicating PMDD experiments must ensure `PYTHONHASHSEED=42` is set in their environment to guarantee identical heuristic extraction pathways.
