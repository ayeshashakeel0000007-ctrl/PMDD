# PMDD Best Example Gallery

This gallery archives canonical examples of the PMDD framework’s behavior. It is designed to support academic presentations, GitHub documentation, and thesis defense arguments by transparently showcasing both the system's strengths and its expected heuristic limitations.

---

## 1. Perfect Drift Escalation
**Context:** A transition from administrative neutrality to material aggression.
- **T1 (Neutral):** "The committee *will review* [Mental] the budget."
- **T2 (Escalation):** "We *must destroy* [Material] the opposing infrastructure."
- **PMDD Behavior:** Correctly registers an extreme KL Divergence spike. Relational/Mental baseline migrates entirely to a High-Aggression Material distribution.

## 2. Institutional vs. Persuasive Discourse
**Context:** Differentiating between rigid organizational framing and emotional coercion.
- **Institutional:** "The department *is responsible* [Relational] for safety."
- **Persuasive:** "You *must believe* [Mental] that we *are fighting* [Material] for your survival."
- **PMDD Behavior:** Identifies the heavy injection of directives and highly emotive Mental processes in the persuasive text, separating it mathematically from the Relational baseline of the institutional text.

## 3. Calibration Hotspots & Disagreement
**Context:** The system exposes its own uncertainty in highly ambiguous rhetoric.
- **Clause:** "I *think* [Mental] we *should launch* [Material] the strike."
- **PMDD Behavior:** Flags as a "Complex/Nested" transitivity structure. Depending on the dependency parse, PMDD may latch onto "think" (Mental), causing a Disagreement Spike when human annotators tag it as Material (launch strike). 
- **Thesis Value:** Demonstrates that PMDD correctly bounds its own heuristic confidence, relying on Expected Calibration Error (ECE) to alert researchers to parse instability.

## 4. Reviewer Challenge Failures (Methodological Honesty)
**Context:** Explicit boundary testing showcasing the limits of SFL heuristics.
- **Sarcasm:** "Oh fantastic, another catastrophic failure by the leadership team."
  - *PMDD Failure:* Misclassified as positive due to the 'fantastic' modifier.
- **Metaphorical Directives:** "We need to completely drain the swamp."
  - *PMDD Failure:* Registers "drain" as a literal Material action lacking severe negative semantic weight.
- **Fragmentation:** "More delays. Great."
  - *PMDD Failure:* Lacks a strict verb root; SFL engine defaults to unclassified or drops the clause from the KL scalar.

## 5. Confidence Collapse Cases
**Context:** Instances where the heuristic extraction fails to establish a dominant semantic root.
- **Clause:** "It would be best if you left."
- **PMDD Behavior:** Confidence drops below 50%. The parser struggles between the Relational ("would be") and the Material ("left"). The Disagreement Explorer surfaces this clause for manual human review, proving the system acts as a transparent observatory rather than an overconfident black-box.
