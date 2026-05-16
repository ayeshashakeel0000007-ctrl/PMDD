# PMDD Architecture Freeze Manifest

**Date of Freeze:** May 2026
**Framework Status:** Empirically Validated Computational Discourse Intelligence Framework

## 1. Frozen Dependencies
To guarantee 100% computational reproducibility for thesis reviewers and academic publication, the following core dependencies must remain strictly locked:
- `fastapi` == 0.100+
- `spacy` == 3.7+ (Model: `en_core_web_sm` strictly heuristic parsing, no neural drift)
- `scikit-learn` == 1.3+
- `matplotlib` / `seaborn` (for offline generation)

## 2. Frozen Heuristics
- **Pragmatics (Speech Acts):** The classification logic mapping utterances to Searle's 5 macro-classes (Assertive, Directive, Commissive, Expressive, Declarative) is frozen.
- **SFL Transitivity:** The `transitivity_engine.py` mapping dependency roots to the 6 Hallidayan Process Types (Material, Mental, Relational, Verbal, Behavioral, Existential) is frozen. No new rule exceptions will be added to avoid shifting benchmark baselines.

## 3. Mathematical Determinism
- **Random Seed Locking:** A new `core/seed_lock.py` module enforces `PYTHONHASHSEED=42`, `numpy.random.seed(42)`, and standard library `random.seed(42)` immediately upon startup. This ensures that any probability-based tie-breaking resolves identically on every run.
- **KL Divergence:** The normalization bounds (bounded 0 to 1) and Laplace smoothing constants are locked.

## 4. Frozen APIs
- The `POST /api/analyze` and `POST /api/analyze-longitudinal` schemas are immutable.
- The `frontend/src/App.jsx` component routing is locked. UI cosmetic updates are restricted.

## Summary
The system is now treated as a physical laboratory instrument. Its calibration is fixed, enabling the collection of highly reliable longitudinal data.
