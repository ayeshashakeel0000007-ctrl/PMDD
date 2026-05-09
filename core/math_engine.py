import numpy as np
from scipy.spatial.distance import cosine
from scipy.stats import entropy
from typing import List, Tuple

def calculate_entropy(probabilities: list[float]) -> float:
    p = np.array(probabilities)
    p = p[p > 0]
    return float(entropy(p, base=2))

def calculate_kl_divergence(p: list[float], q: list[float]) -> float:
    epsilon = 1e-10
    p_arr = np.array(p) + epsilon
    q_arr = np.array(q) + epsilon
    p_arr = p_arr / np.sum(p_arr)
    q_arr = q_arr / np.sum(q_arr)
    return float(entropy(p_arr, q_arr))

def calculate_cosine_distance(vec_a: list[float], vec_b: list[float]) -> float:
    if not vec_a or not vec_b:
        return 1.0
    return float(cosine(vec_a, vec_b))

def normalize_score(score: float, min_val: float, max_val: float) -> float:
    if max_val == min_val:
        return 0.0
    return max(0.0, min(1.0, (score - min_val) / (max_val - min_val)))

def confidence_weighted_aggregation(scores_with_confidence: List[Tuple[float, float]]) -> float:
    """
    Aggregates a list of (score, confidence) tuples using a weighted average.
    Low-confidence scores will have mathematically less impact on the final metric.
    """
    if not scores_with_confidence:
        return 0.0
    
    total_weight = sum(conf for _, conf in scores_with_confidence)
    if total_weight == 0:
        return sum(s for s, _ in scores_with_confidence) / len(scores_with_confidence)
        
    weighted_sum = sum(score * conf for score, conf in scores_with_confidence)
    return float(weighted_sum / total_weight)

def calculate_longitudinal_drift(dist_a: dict, dist_b: dict) -> float:
    """
    Calculates the KL Divergence between two normalized frequency distributions
    to measure temporal semantic/pragmatic drift.
    """
    # Ensure all keys exist in both with a tiny epsilon to avoid log(0)
    epsilon = 1e-9
    all_keys = set(dist_a.keys()).union(set(dist_b.keys()))
    
    if not all_keys:
        return 0.0
        
    p = np.array([dist_a.get(k, 0.0) + epsilon for k in all_keys])
    q = np.array([dist_b.get(k, 0.0) + epsilon for k in all_keys])
    
    # Normalize
    p_sum = np.sum(p)
    q_sum = np.sum(q)
    
    if p_sum == 0 or q_sum == 0:
        return 0.0
        
    p = p / p_sum
    q = q / q_sum
    
    # Calculate KL Divergence: sum(P * log(P / Q))
    kl_divergence = np.sum(p * np.log(p / q))
    if np.isnan(kl_divergence) or np.isinf(kl_divergence):
        return 10.0
    if kl_divergence > 10.0:
        kl_divergence = 10.0
        
    return float(kl_divergence)

def calculate_temporal_variance(score_series: list) -> float:
    """
    Calculates the temporal variance (volatility) of a specific semantic or pragmatic 
    score across multiple time points. High variance indicates narrative instability.
    """
    import numpy as np
    if not score_series or len(score_series) < 2:
        return 0.0
    return float(np.var(score_series, ddof=1))
