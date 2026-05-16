# PMDD Result Archive Structure

This directory houses the deterministic outputs of PMDD's empirical validation and real-world corpus experiments.

## Directory Structure

- `/plots/`: Contains high-resolution `matplotlib` PNGs (e.g., Calibration Curves, Ablation Bar Charts).
- `/pdfs/`: Contains vector-perfect PDF exports of plots specifically generated for Overleaf/LaTeX integration.
- `/latex/`: Contains `.tex` files representing tabular data (e.g., Sanity Benchmark Matrices, Confusion Matrices) formatted for direct thesis copy-pasting.
- `/manifests/`: Contains the `.json` and `.csv` raw data dumps from experiment runs.

## Naming Conventions
All experimental outputs should follow a strict timestamped ID convention to guarantee reproducibility mapping:
`EXP_[YYYYMMDD]_[CORPUS_NAME]_[METRIC]`

**Example:**
`EXP_20260513_CRISIS-01_AblationChart.pdf`

## Reproducibility Workflow
1. Execute the experiment script (e.g., `python experiments/run_ablation_study.py`).
2. The script will automatically dump the raw `.csv` to `/manifests/` and the generated figure to `/pdfs/`.
3. Log the `EXP_ID` directly into your `EXPERIMENT_JOURNAL_TEMPLATE.md` to ensure a perfect 1:1 trace between your interpretive notes and the physical file asset.
