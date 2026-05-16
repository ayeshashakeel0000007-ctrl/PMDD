# PMDD Formal Error Taxonomy

This document catalogs the primary failure modes of the Pragmatic Meaning Drift Detector (PMDD). Establishing this taxonomy is a critical scientific prerequisite, providing transparency for peer review and forming the basis of the thesis "Limitations" chapter.

## 1. Semantic Ambiguity & Polysemy
**Description:** Words that possess multiple contextual meanings depending on domain-specific usage.
**Impact on PMDD:** `spaCy` dependency parsing may misclassify the root verb.
**Example:** "The board *tabled* the motion." (Classified as Material construction rather than Verbal/Relational postponement).
**Mitigation:** PMDD's Disagreement Explorer explicitly flags these boundary cases by observing confidence-drop spikes during dependency parsing.

## 2. Mixed Transitivity Structures
**Description:** Clauses containing nested process types where the pragmatic intent is split.
**Impact on PMDD:** Hallidayan SFL extraction heuristically grabs the primary syntactic root, potentially missing the pragmatic payload of the subordinate clause.
**Example:** "I *think* [Mental] we must *destroy* [Material] the enemy." 
**Mitigation:** PMDD maps to the primary syntactic root but logs "Complex/Nested" structures to the backend. The annotation protocol now captures "Secondary Process" labels for qualitative discussion.

## 3. Implicit Directives
**Description:** Commands masked as Relational statements or polite hypothetical Mental constructs.
**Impact on PMDD:** Classification failure. Fails to register the escalating coercive intent.
**Example:** "It would be best if you vacated the premises."
**Mitigation:** PMDD tracks these under "False Escalation" mismatches when evaluated against human ground-truth.

## 4. Metaphorical Escalation
**Description:** Extreme escalation masked in standard metaphorical language.
**Impact on PMDD:** The system reads a Material process but fails to grasp the emotional severity.
**Example:** "We are going to *drain the swamp*."
**Mitigation:** While SFL correctly identifies the Material action ("drain"), the KL Divergence equations rely on the baseline distribution remaining stable. Metaphors cause divergence spikes, but the specific intent requires human interpretation.

## 5. Emotional Indirectness
**Description:** Sentiments expressed through objective structural language rather than expressive emotive terms.
**Impact on PMDD:** High-arousal negative emotion is missed because the syntax registers as Relational.
**Example:** "The sky is blue, water is wet, and you are entirely incompetent."
**Mitigation:** PMDD relies on Speech Act KL divergence rather than sentiment analysis.

## 6. Low-Context Failures
**Description:** Short clauses whose pragmatic force relies entirely on previous sentences (anaphora resolution).
**Impact on PMDD:** The heuristics interpret the clause in a vacuum, losing the rhetorical thread.
**Example:** "Do it now." (What is 'it'?)
**Mitigation:** The architecture calculates Drift over the entire temporal distribution, smoothing over localized low-context failures.

## 7. Clause Fragmentation & Ellipsis
**Description:** Highly abbreviated, informal, or syntactically incomplete utterances.
**Impact on PMDD:** Missing `nsubj` or `root` nodes cause the SFL engine to default to "Unclassified" or "Relational".
**Example:** "More delays. Great."
**Mitigation:** PMDD explicitly filters out clauses lacking a strict verb root to prevent polluting the longitudinal drift scalar.

## 8. Calibration Mismatch
**Description:** When PMDD returns an 80%+ Confidence score for a heuristic mapping that humans empirically disagree with.
**Impact on PMDD:** Overconfidence pollutes the trustworthiness of the observatory.
**Example:** PMDD is 90% confident "I understand" is Mental, but in context, it was used as a Verbal threat acknowledgement.
**Mitigation:** Addressed mathematically via the Expected Calibration Error (ECE) and visual Reliability Diagrams.
