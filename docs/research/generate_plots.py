"""
PMDD Empirical Plotting Infrastructure
Provides academic visualization for calibration curves and reliability diagrams.
This script is intended to be run by researchers offline.
"""
import json
import numpy as np
import matplotlib.pyplot as plt

def generate_reliability_diagram(confidence_scores, accuracies, num_bins=10, save_path="reliability_diagram.png"):
    """
    Generates an academic Reliability Diagram plotting Confidence vs Accuracy.
    """
    confidences = np.array(confidence_scores)
    accs = np.array(accuracies).astype(float)
    
    bin_boundaries = np.linspace(0.0, 1.0, num_bins + 1)
    bin_lowers = bin_boundaries[:-1]
    bin_uppers = bin_boundaries[1:]
    
    bin_accuracies = []
    bin_confidences = []
    
    for bin_lower, bin_upper in zip(bin_lowers, bin_uppers):
        in_bin = (confidences > bin_lower) & (confidences <= bin_upper)
        if bin_lower == 0.0:
            in_bin = (confidences >= bin_lower) & (confidences <= bin_upper)
            
        if np.any(in_bin):
            bin_accuracies.append(np.mean(accs[in_bin]))
            bin_confidences.append(np.mean(confidences[in_bin]))
        else:
            bin_accuracies.append(0.0)
            bin_confidences.append(0.0)
            
    plt.figure(figsize=(8, 8))
    plt.plot([0, 1], [0, 1], linestyle='--', color='gray', label='Perfect Calibration')
    
    plt.plot(bin_confidences, bin_accuracies, marker='o', color='#0f766e', linewidth=2, label='Agent Model')
    
    plt.title("Reliability Diagram (Calibration Curve)")
    plt.xlabel("Confidence")
    plt.ylabel("Accuracy")
    plt.legend()
    plt.grid(True, alpha=0.3)
    
    base_path = save_path.rsplit('.', 1)[0]
    plt.savefig(f"{base_path}.png", dpi=300, bbox_inches='tight')
    plt.savefig(f"{base_path}.pdf", bbox_inches='tight')
    plt.savefig(f"{base_path}.svg", bbox_inches='tight')
    print(f"Saved Reliability Diagram to {base_path}.[png/pdf/svg]")

def plot_ece_histogram(confidence_scores, save_path="ece_histogram.png"):
    """
    Plots the distribution of confidence scores.
    """
    plt.figure(figsize=(8, 6))
    plt.hist(confidence_scores, bins=10, range=(0, 1), color='#1e293b', edgecolor='#64ffda')
    
    plt.title("Confidence Distribution Histogram")
    plt.xlabel("Confidence Score")
    plt.ylabel("Number of Predictions")
    plt.grid(axis='y', alpha=0.3)
    
    base_path = save_path.rsplit('.', 1)[0]
    plt.savefig(f"{base_path}.png", dpi=300, bbox_inches='tight')
    plt.savefig(f"{base_path}.pdf", bbox_inches='tight')
    plt.savefig(f"{base_path}.svg", bbox_inches='tight')
    print(f"Saved ECE Histogram to {base_path}.[png/pdf/svg]")

if __name__ == "__main__":
    # Example test data
    dummy_confidences = [0.9, 0.85, 0.6, 0.4, 0.95, 0.8, 0.5, 0.7, 0.99, 0.3]
    dummy_accuracies = [1, 1, 0, 0, 1, 1, 1, 0, 1, 0]
    
    print("Generating sample plots...")
    generate_reliability_diagram(dummy_confidences, dummy_accuracies, save_path="docs/research/sample_reliability.png")
    plot_ece_histogram(dummy_confidences, save_path="docs/research/sample_histogram.png")
