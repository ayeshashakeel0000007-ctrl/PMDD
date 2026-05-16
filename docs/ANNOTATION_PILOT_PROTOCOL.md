# PMDD Annotation Pilot Protocol

This protocol defines the workflow for the initial small-batch human annotation campaign designed to establish empirical baselines for the PMDD framework.

## 1. Pilot Objectives
The goal of this pilot is to:
- Test the clarity of the `ANNOTATION_GUIDELINES.md`.
- Establish initial Inter-Annotator Agreement (Cohen's Kappa) on a subset of 50 clauses.
- Identify edge cases, particularly regarding the Hallidayan boundary between *Mental* cognition and *Verbal* communication in persuasive rhetoric.

## 2. Annotator Recruitment & Setup
- **Cohort Size:** 3 Annotators (preferably with linguistic or discourse analysis backgrounds).
- **Tooling:** Annotators will use Excel or Google Sheets. Do **not** use PMDD for annotation entry to preserve experimental blinding.
- **Multi-Label Transitivity:** Clauses often contain mixed structures (e.g., "I think [Mental] we should build [Material]"). Annotators MUST provide a **Primary Process Label** (representing the core pragmatic intent) and an optional **Secondary Process Label** (representing subordinate syntactic framing). IAA statistics (Cohen's Kappa) will be calculated strictly on the Primary label. Secondary labels are reserved for ambiguity analysis and thesis discussion.
- **Payload:** The pilot payload (`data/corpora/pilot_corpus_01.json`) will be exported to a flattened CSV containing exactly 50 clauses randomly sampled from the benchmark categories.

## 3. Disagreement Resolution Workflow
Once annotations are returned, the Lead Researcher will run:
`python experiments/calculate_iaa.py pilot_annotations.csv`

1. **Initial Kappa Check:** If the raw Kappa is below 0.65, the protocol mandates a resolution meeting.
2. **Ambiguity Review:** The script will print the "Top Disagreement Pairs." Annotators will review these specific clauses.

## 4. Empirical Labeling Definitions
For this phase, annotators must also code the following secondary attributes (Boolean 0/1 or Likert 1-5):
- **Aggression:** Implicit or explicit intent to harm, dominate, or forcefully coerce.
- **Persuasion:** Rhetorical effort to alter the belief state or behavior of the recipient.
- **Institutional Framing:** Language that relies on bureaucratic, administrative, or "objective" structural authority (often aligning with Relational processes).
- **Emotional Escalation:** Sudden shifts toward high-arousal negative/positive sentiment, typically manifesting as expressive speech acts.
3. **Guideline Refinement:** The core `ANNOTATION_GUIDELINES.md` will be updated to explicitly clarify the edge cases (e.g., "If the clause contains both a mental state and a verbal directive, prioritize the explicit pragmatic intent").
4. **Final Lock:** Once the pilot hits an acceptable baseline, the guidelines are frozen for the full dataset campaign.
