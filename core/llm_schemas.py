from pydantic import BaseModel, Field
from typing import List, Optional

class SpeechAct(BaseModel):
    category: str = Field(..., description="Must be one of: Assertive, Directive, Commissive, Expressive, Declaration.")
    confidence: float = Field(..., description="LLM confidence in this classification (0.0 to 1.0).")
    evidence: str = Field(..., description="Exact substring from the text proving this speech act.")

class GriceanMaximViolation(BaseModel):
    maxim: str = Field(..., description="Must be one of: Quantity, Quality, Relation, Manner.")
    violation_type: str = Field(..., description="Short description of the violation.")
    evidence: str = Field(..., description="Exact substring proving the violation.")

class PragmaticAnalysis(BaseModel):
    reasoning_chain: str = Field(..., description="Step-by-step internal reasoning chain.")
    confidence: float = Field(..., description="Overall confidence in pragmatic analysis (0.0 to 1.0).")
    evidence_quality: float = Field(..., description="Quality of extracted evidence (0.0 to 1.0).")
    speech_acts: List[SpeechAct] = Field(..., description="List of speech acts identified in the chunk.")
    maxim_violations: List[GriceanMaximViolation] = Field(..., description="Any Gricean maxim violations.")

class SemanticField(BaseModel):
    word: str = Field(..., description="The content word being mapped.")
    field: str = Field(..., description="The semantic field the word belongs to.")
    contextual_meaning: str = Field(..., description="The contextual meaning in this specific sentence.")

class SemanticAnalysis(BaseModel):
    reasoning_chain: str = Field(..., description="Step-by-step reasoning for semantic field assignments.")
    confidence: float = Field(..., description="Overall confidence in semantic mapping (0.0 to 1.0).")
    evidence_quality: float = Field(..., description="Quality of extracted evidence (0.0 to 1.0).")
    semantic_fields: List[SemanticField] = Field(..., description="Semantic mapping for key content words in the chunk.")

class RegisterAnalysis(BaseModel):
    reasoning_chain: str = Field(..., description="Internal reasoning for Register evaluation.")
    confidence: float = Field(..., description="Overall confidence in register analysis (0.0 to 1.0).")
    evidence_quality: float = Field(..., description="Quality of extracted evidence (0.0 to 1.0).")
    formality_score: float = Field(..., description="Formality score from 0.0 (highly informal) to 1.0 (highly formal).")
    tenor: str = Field(..., description="Relationship between speaker and audience.")
    mode: str = Field(..., description="Channel characteristics.")
    evidence: str = Field(..., description="Key textual markers indicating this register.")

class ProfilerExecutionPlan(BaseModel):
    domain: str = Field(..., description="Predicted corpus domain (e.g., Political, Clinical, Academic, Social Media).")
    communicative_intent: str = Field(..., description="Primary intent (e.g., Persuasion, Information Exchange, Emotion).")
    linguistic_complexity: float = Field(..., description="Complexity score (0.0 to 1.0).")
    run_pragmatics: bool = Field(..., description="Should Pragmatics agent run?")
    run_semantics: bool = Field(..., description="Should Semantics agent run?")
    run_register: bool = Field(..., description="Should Register agent run?")
    routing_rationale: str = Field(..., description="Explanation of why these frameworks were activated.")
