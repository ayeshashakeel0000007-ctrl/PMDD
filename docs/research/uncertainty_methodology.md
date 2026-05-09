# Uncertainty & Calibration Methodology

## 1. Abstract
The PMDD (Pragmatic Meaning Drift Detector) platform utilizes a rigorous mathematical approach to uncertainty. Rather than blindly trusting Large Language Model (LLM) outputs, the platform calculates a **Systemic Uncertainty Index**, applies deterministic confidence penalties, and utilizes Expected Calibration Error (ECE) to continuously measure the alignment between the agent's confidence and its actual accuracy.

## 2. Confidence Propagation
Each specialized agent (Pragmatics, Semantics, Register) is required to output a localized `confidence` score (0.0 to 1.0) along with its analysis. 

This confidence is not taken at face value. It is immediately subjected to the **Deterministic Governance Layer**, which applies penalties based on objective textual metrics:
- **Ideational Complexity Penalty**: If a text segment exhibits high semantic complexity or emotional variance (e.g., score > 0.8), the localized confidence score is automatically multiplied by `0.85`.
- **Evidence Quality Penalty**: If the agent's self-assessed `evidence_quality` falls below `0.5`, its confidence is severely slashed by a multiplier of `0.70`.

## 3. Systemic Uncertainty Index
The final **Systemic Uncertainty Index** is an aggregate metric representing the entire pipeline's lack of confidence in a given run.
It is calculated as:
`Systemic Uncertainty Index = 1.0 - (Average Penalized Confidence across all active frameworks)`

A high Uncertainty Index (e.g., > 0.40) indicates that the platform's outputs for that specific corpus should be interpreted with caution.

## 4. Expected Calibration Error (ECE)
To ensure the LLM's raw confidence scores are scientifically meaningful, the platform utilizes **Expected Calibration Error (ECE)** during benchmarking runs.
ECE divides the confidence space into 10 bins (0.0-0.1, 0.1-0.2, etc.) and measures the absolute difference between the *average confidence* in that bin and the *actual accuracy* (measured against human Gold Standards) in that bin.

A perfectly calibrated agent (where 80% confidence means 80% accuracy) has an ECE of `0.0`. The PMDD platform strives for an ECE `< 0.15` during formal benchmarking.
