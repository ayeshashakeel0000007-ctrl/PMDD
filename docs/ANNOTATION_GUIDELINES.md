# PMDD Annotation Guidelines: Speech Acts & Transitivity

This document outlines the standard operating procedure for annotating benchmark corpora used to validate the Pragmatic Meaning Drift Detector (PMDD).

## 1. Goal of Annotation
Human annotators will read discourse segments and label them according to standard pragmatics and Systemic Functional Linguistics (SFL) transitivity frameworks. These annotations serve as the **Ground Truth** for calculating PMDD's reliability, F1-scores, and calibration.

## 2. Speech Act Annotation Schema
Each clause must be assigned ONE primary Speech Act category based on the speaker's illocutionary intent:

- **Assertive:** Stating a belief or fact (e.g., "The system is offline.")
- **Directive:** Attempting to get the listener to do something (e.g., "Fix the system immediately.")
- **Commissive:** Committing the speaker to a future action (e.g., "We will restore power by 5 PM.")
- **Expressive:** Expressing a psychological state (e.g., "We apologize for the inconvenience.")
- **Declarative:** Changing reality in accord with the proposition (e.g., "You are hereby fired.")

## 3. Hallidayan Transitivity Annotation Schema
Each clause must be assigned ONE primary Process Type based on how reality is represented:

- **Material:** Physical actions or events. *[Actor + Goal]* (e.g., "The company built the reactor.")
- **Mental:** Cognition, perception, or reaction. *[Senser + Phenomenon]* (e.g., "Citizens fear the outcome.")
- **Relational:** States of being or possession. *[Carrier + Attribute]* (e.g., "The situation is catastrophic.")
- **Verbal:** Acts of communication. *[Sayer + Verbiage]* (e.g., "The spokesperson announced a delay.")
- **Behavioral:** Physiological/psychological acts. *[Behaver]* (e.g., "The crowd cheered.")
- **Existential:** Stating existence. *[Existent]* (e.g., "There are three options.")

## 4. Resolving Ambiguity
If a clause contains multiple verbs, annotate the **main independent clause** root verb. If a speech act feels like a hybrid (e.g., a polite request that functions as a command), code the **pragmatic intent** (Directive), not the literal syntax.

## 5. Export Format
All annotations should be exported as a CSV with the following columns:
`segment_id, text, annotator_id, speech_act, transitivity_process`
