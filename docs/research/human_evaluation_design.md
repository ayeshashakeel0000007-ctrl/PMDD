# Human vs. Agent Evaluation Study Protocol

## 1. Objective
To formally evaluate the PMDD pipeline against human "Gold Standard" annotations, specifically analyzing the platform's reliability in classifying Speech Acts and measuring Register Formality.

## 2. Methodology
1. **Pilot Annotation**: Three independent linguistic researchers will annotate the `political_01` benchmark dataset using the PMDD annotation schema.
2. **Inter-Annotator Agreement (IAA)**: We will calculate Krippendorff's Alpha to measure agreement across the three human annotators.
3. **Agent Benchmarking**: The PMDD pipeline will process the identical corpus. We will calculate the precision, recall, and F1 score of the agent against the human consensus.
4. **Calibration Measurement**: We will utilize Expected Calibration Error (ECE) to determine if the agent's internal confidence scores accurately predict its likelihood of matching the human consensus.

## 3. Targets
- **Human IAA (Alpha)**: Target > 0.80 for high reliability.
- **Agent vs Human (F1)**: Target > 0.75 for Pragmatic Speech Acts.
- **Calibration (ECE)**: Target < 0.15 (indicating low overconfidence).
