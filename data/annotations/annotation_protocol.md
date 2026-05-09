# PMDD Inter-Annotator Agreement Protocol

## Purpose
This protocol defines the structural guidelines for human annotators creating "Gold Standard" linguistic evaluation datasets. These datasets will be used to mathematically benchmark the PMDD agents using Cohen's Kappa, Precision, Recall, and F1 metrics.

## Methodology

### 1. Speech Act Annotation (Pragmatics)
For each sentence in the target corpus, assign exactly **ONE** dominant Speech Act category:
- **Assertive:** Stating facts, beliefs, descriptions (e.g., "The economy grew by 2%.")
- **Directive:** Commands, requests, advice (e.g., "You must vote tomorrow.")
- **Commissive:** Promises, threats, commitments (e.g., "I will lower taxes.")
- **Expressive:** Feelings, attitudes, apologies (e.g., "I am deeply sorry.")
- **Declaration:** Changing reality via words (e.g., "I resign.")

### 2. Register Formality
Assign a score from `0.0` (Highly informal) to `1.0` (Highly formal).
- **0.0 - 0.2:** Casual, slang, highly colloquial.
- **0.4 - 0.6:** Consultative, neutral journalism.
- **0.8 - 1.0:** Frozen, legalistic, highly academic.

## Workflow
1. Download the corpus segment to be annotated.
2. Complete the `annotation_template.json` following this protocol.
3. Save as `corpusID_annotatorID.json`.
4. Upload to the PMDD benchmarking pipeline (when activated in future phases).
