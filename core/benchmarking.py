import numpy as np
from typing import List, Dict, Any

def calculate_cohens_kappa(human_labels: List[str], agent_labels: List[str]) -> float:
    """
    Calculates Cohen's Kappa for agreement between human annotators and PMDD agents.
    Assumes lists are of equal length and perfectly aligned.
    """
    if len(human_labels) != len(agent_labels) or not human_labels:
        return 0.0
        
    categories = list(set(human_labels + agent_labels))
    num_items = len(human_labels)
    
    # Calculate observed agreement (Po)
    agreements = sum(1 for h, a in zip(human_labels, agent_labels) if h == a)
    p_o = agreements / num_items
    
    # Calculate expected agreement (Pe)
    p_e = 0.0
    for cat in categories:
        human_prob = human_labels.count(cat) / num_items
        agent_prob = agent_labels.count(cat) / num_items
        p_e += (human_prob * agent_prob)
        
    if p_e == 1.0:
        return 1.0 # Perfect agreement where all items are the same category
        
    kappa = (p_o - p_e) / (1 - p_e)
    return float(kappa)

def calculate_precision_recall_f1(human_labels: List[str], agent_labels: List[str], target_class: str) -> Dict[str, float]:
    """
    Calculates Precision, Recall, and F1 for a specific target class.
    """
    if len(human_labels) != len(agent_labels) or not human_labels:
        return {"precision": 0.0, "recall": 0.0, "f1": 0.0}
        
    true_positives = sum(1 for h, a in zip(human_labels, agent_labels) if h == target_class and a == target_class)
    false_positives = sum(1 for h, a in zip(human_labels, agent_labels) if h != target_class and a == target_class)
    false_negatives = sum(1 for h, a in zip(human_labels, agent_labels) if h == target_class and a != target_class)
    
    precision = true_positives / (true_positives + false_positives) if (true_positives + false_positives) > 0 else 0.0
    recall = true_positives / (true_positives + false_negatives) if (true_positives + false_negatives) > 0 else 0.0
    
    f1 = 2 * (precision * recall) / (precision + recall) if (precision + recall) > 0 else 0.0
    
    return {
        "precision": float(precision),
        "recall": float(recall),
        "f1": float(f1)
    }

def calculate_expected_calibration_error(confidence_scores: List[float], correct_predictions: List[bool], num_bins: int = 10) -> float:
    """
    Calculates Expected Calibration Error (ECE).
    This formally measures whether the agent's confidence matches its actual accuracy.
    A perfectly calibrated agent has an ECE of 0.0.
    """
    import numpy as np
    
    if not confidence_scores or len(confidence_scores) != len(correct_predictions):
        return 0.0
        
    confidences = np.array(confidence_scores)
    accuracies = np.array(correct_predictions).astype(float)
    
    bin_boundaries = np.linspace(0.0, 1.0, num_bins + 1)
    bin_lowers = bin_boundaries[:-1]
    bin_uppers = bin_boundaries[1:]
    
    ece = 0.0
    total_samples = len(confidences)
    
    for bin_lower, bin_upper in zip(bin_lowers, bin_uppers):
        # Find indices of samples that fall into this bin
        in_bin = (confidences > bin_lower) & (confidences <= bin_upper)
        # For the first bin, include 0.0
        if bin_lower == 0.0:
            in_bin = (confidences >= bin_lower) & (confidences <= bin_upper)
            
        prop_in_bin = np.mean(in_bin)
        if prop_in_bin > 0:
            accuracy_in_bin = np.mean(accuracies[in_bin])
            avg_confidence_in_bin = np.mean(confidences[in_bin])
            ece += np.abs(avg_confidence_in_bin - accuracy_in_bin) * prop_in_bin
            
    return float(ece)

def calculate_krippendorffs_alpha_nominal(annotations: List[List[str]]) -> float:
    """
    Calculates Krippendorff's Alpha for nominal data (e.g., Speech Acts) across multiple annotators.
    annotations structure: list of lists, where annotations[i] represents all annotators' labels for sentence i.
    """
    import collections
    
    # Flatten to get all unique categories
    all_labels = [label for item in annotations for label in item if label is not None]
    if not all_labels:
        return 0.0
        
    categories = list(set(all_labels))
    num_items = len(annotations)
    
    # Calculate Observed Disagreement (Do)
    total_pairs = 0
    observed_disagreement = 0.0
    
    for item in annotations:
        valid_labels = [l for l in item if l is not None]
        m = len(valid_labels)
        if m < 2:
            continue # Needs at least 2 annotators for this item
            
        item_counts = collections.Counter(valid_labels)
        
        item_disagreement = 0.0
        for cat_c in categories:
            for cat_k in categories:
                if cat_c != cat_k:
                    # Metric function for nominal is 1 if c != k, 0 if c == k
                    item_disagreement += item_counts[cat_c] * item_counts[cat_k]
                    
        observed_disagreement += item_disagreement / (m - 1)
        total_pairs += m

    if total_pairs == 0:
        return 0.0
        
    # Calculate Expected Disagreement (De)
    global_counts = collections.Counter(all_labels)
    expected_disagreement = 0.0
    for cat_c in categories:
        for cat_k in categories:
            if cat_c != cat_k:
                expected_disagreement += global_counts[cat_c] * global_counts[cat_k]
                
    expected_disagreement = expected_disagreement / (len(all_labels) - 1)
    
    # Alpha = 1 - (Do / De)
    if expected_disagreement == 0:
        return 1.0 # Perfect agreement (only one category used by everyone)
        
    alpha = 1.0 - (observed_disagreement / expected_disagreement)
    return float(alpha)

def calculate_bootstrap_ci(data: List[float], num_samples: int = 1000, ci: float = 0.95) -> Dict[str, float]:
    """
    Calculates the Bootstrap Confidence Interval for the mean of a dataset.
    This provides rigorous publication-ready interval estimates rather than point estimates.
    """
    import numpy as np
    
    if not data or len(data) < 2:
        if not data:
            return {"mean": 0.0, "lower_bound": 0.0, "upper_bound": 0.0}
        return {"mean": data[0], "lower_bound": data[0], "upper_bound": data[0]}
        
    data_array = np.array(data)
    means = []
    
    # Resample with replacement
    for _ in range(num_samples):
        sample = np.random.choice(data_array, size=len(data_array), replace=True)
        means.append(np.mean(sample))
        
    means = np.sort(means)
    
    lower_percentile = ((1.0 - ci) / 2.0) * 100
    upper_percentile = (1.0 - ((1.0 - ci) / 2.0)) * 100
    
    lower_bound = np.percentile(means, lower_percentile)
    upper_bound = np.percentile(means, upper_percentile)
    
    return {
        "mean": float(np.mean(data_array)),
        "lower_bound": float(lower_bound),
        "upper_bound": float(upper_bound)
    }
