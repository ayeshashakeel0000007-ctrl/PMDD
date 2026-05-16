from core.nlp_engine import get_nlp

MATERIAL_VERBS = {"build", "create", "make", "write", "compose", "develop", "change", "fix", "repair", "reduce", "increase", "improve", "hit", "break", "take", "give", "deliver", "unleash", "run", "walk", "go", "come", "sit", "stand", "send", "offer", "provide"}
MENTAL_VERBS = {"know", "think", "believe", "understand", "consider", "see", "hear", "feel", "notice", "observe", "like", "want", "hate", "fear", "enjoy", "expect", "assume"}
RELATIONAL_VERBS = {"be", "equal", "represent", "define", "mean", "have", "seem", "appear", "become", "possess", "contain", "remain"}
VERBAL_VERBS = {"say", "tell", "ask", "reply", "suggest", "claim", "declare", "announce", "state", "report", "argue", "insist"}
BEHAVIORAL_VERBS = {"smile", "laugh", "cry", "breathe", "cough", "dream", "stare", "listen", "watch", "look", "frown"}

def analyze_transitivity(text):
    """
    Analyzes a text clause by clause and returns Hallidayan Transitivity metrics.
    Returns: process_type, participants, circumstances, confidence.
    """
    nlp = get_nlp()
    doc = nlp(text)
    
    main_verb = None
    for token in doc:
        if token.pos_ == "VERB" or token.dep_ == "ROOT":
            main_verb = token
            break
            
    if not main_verb:
        return {
            "process_type": "relational",
            "participants": ["Carrier: Implicit"],
            "circumstances": [],
            "confidence": 0.3,
            "inference_explanation": "Defaulted to relational due to lack of explicit action verb."
        }

    lemma = main_verb.lemma_.lower()
    
    process_type = "material"
    confidence = 0.5
    inference = f"Verb '{lemma}' maps to general action (Material) by default."
    
    if lemma in MENTAL_VERBS:
        process_type = "mental"
        confidence = 0.8
        inference = f"Verb '{lemma}' is a cognitive/perceptive mental process."
    elif lemma in RELATIONAL_VERBS:
        process_type = "relational"
        confidence = 0.85
        inference = f"Verb '{lemma}' establishes a state of being or possession."
    elif lemma in VERBAL_VERBS:
        process_type = "verbal"
        confidence = 0.9
        inference = f"Verb '{lemma}' denotes explicit communication."
    elif lemma in BEHAVIORAL_VERBS:
        process_type = "behavioral"
        confidence = 0.7
        inference = f"Verb '{lemma}' denotes physiological/psychological behavior."
    elif lemma in MATERIAL_VERBS:
        process_type = "material"
        confidence = 0.85
        inference = f"Verb '{lemma}' denotes physical transformation or action."
    elif lemma == "be" and any(tok.dep_ == "expl" for tok in doc):
        process_type = "existential"
        confidence = 0.95
        inference = "Construct 'There is/are' denotes existential process."

    # Extract Participants heuristically
    participants = []
    circumstances = []
    
    for child in main_verb.children:
        if child.dep_ in ("nsubj", "nsubjpass", "csubj"):
            if process_type == "material": participants.append(f"Actor: {child.text}")
            elif process_type == "mental": participants.append(f"Senser: {child.text}")
            elif process_type == "relational": participants.append(f"Carrier: {child.text}")
            elif process_type == "verbal": participants.append(f"Sayer: {child.text}")
            elif process_type == "behavioral": participants.append(f"Behaver: {child.text}")
            elif process_type == "existential": participants.append(f"Existent: {child.text}")
        elif child.dep_ in ("dobj", "pobj", "attr", "acomp"):
            if process_type == "material": participants.append(f"Goal: {child.text}")
            elif process_type == "mental": participants.append(f"Phenomenon: {child.text}")
            elif process_type == "relational": participants.append(f"Attribute: {child.text}")
            elif process_type == "verbal": participants.append(f"Verbiage: {child.text}")
        elif child.dep_ == "prep":
            prep_obj = " ".join([c.text for c in child.children])
            circumstances.append(f"Circumstance ({child.text} {prep_obj})")
            
    if not participants:
        participants.append("Implicit Participant")
        confidence -= 0.2

    return {
        "process_type": process_type,
        "participants": participants,
        "circumstances": circumstances,
        "confidence": round(max(0.1, min(1.0, confidence)), 2),
        "inference_explanation": inference
    }

def process_segments_for_transitivity(segments):
    for seg in segments:
        seg["transitivity"] = analyze_transitivity(seg["text"])
    return segments
