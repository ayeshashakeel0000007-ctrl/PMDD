import os
import json
import numpy as np
from typing import List, Dict, Any
from utils.openai_client import client
from core.math_engine import calculate_cosine_distance

# =====================================================================
# MEMORY GOVERNANCE:
# Memory is strictly SUPPORTIVE and non-authoritative. 
# It provides contextual priors to the Profiler but CANNOT override 
# deterministic rules enforced by core.governance.py.
# =====================================================================

MEMORY_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "memory", "episodic_memory.json")

def _load_memory() -> List[Dict[str, Any]]:
    if not os.path.exists(MEMORY_FILE):
        return []
    with open(MEMORY_FILE, "r") as f:
        return json.load(f)

def _save_memory(memory: List[Dict[str, Any]]):
    os.makedirs(os.path.dirname(MEMORY_FILE), exist_ok=True)
    with open(MEMORY_FILE, "w") as f:
        json.dump(memory, f, indent=2)

def get_embedding(text: str) -> List[float]:
    """Generates an OpenAI embedding for the text."""
    try:
        response = client.embeddings.create(
            input=text,
            model="text-embedding-3-small"
        )
        return response.data[0].embedding
    except Exception as e:
        print(f"Embedding error: {e}")
        return []

def retrieve_similar(text: str, top_k: int = 2, min_validation_score: float = 0.7) -> List[Dict[str, Any]]:
    """Retrieves top-k similar previous analyses, auditing for quality."""
    memory = _load_memory()
    if not memory:
        return []
        
    query_embedding = get_embedding(text)
    if not query_embedding:
        return []

    scored_memories = []
    for item in memory:
        # MEMORY AUDITING: Ignore low quality or invalidated memories
        val_score = item.get("validation_score", 1.0)
        if val_score < min_validation_score:
            continue
            
        if "embedding_vector" in item and item["embedding_vector"]:
            dist = calculate_cosine_distance(query_embedding, item["embedding_vector"])
            scored_memories.append((dist, item))
            
    scored_memories.sort(key=lambda x: x[0])
    
    results = []
    for dist, item in scored_memories[:top_k]:
        clean_item = {k: v for k, v in item.items() if k != "embedding_vector"}
        clean_item["similarity_distance"] = dist
        results.append(clean_item)
        
    return results

def save_analysis(corpus_id: str, domain: str, frameworks: List[str], report: Dict[str, Any], text_sample: str):
    """Saves a successfully completed analysis into episodic memory."""
    memory = _load_memory()
    embedding = get_embedding(text_sample)
    
    # Assume 1.0 validation score initially, could be downgraded later by humans
    record = {
        "corpus_id": corpus_id,
        "domain": domain,
        "frameworks_used": frameworks,
        "report_summary": report.get("executive_summary", ""),
        "embedding_vector": embedding,
        "validation_status": "Verified",
        "validation_score": 1.0 
    }
    
    memory.append(record)
    _save_memory(memory)
