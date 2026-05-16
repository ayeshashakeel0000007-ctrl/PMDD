import csv
import sys
from sklearn.metrics import cohen_kappa_score
import os

def calculate_iaa(csv_file_path):
    """
    Calculates Cohen's Kappa for Inter-Annotator Agreement.
    Expects a CSV with columns: segment_id, annotator_1_label, annotator_2_label
    """
    if not os.path.exists(csv_file_path):
        print(f"Error: File {csv_file_path} not found.")
        return

    labels_1 = []
    labels_2 = []

    try:
        with open(csv_file_path, mode='r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                l1 = row.get("annotator_1_label", "").strip()
                l2 = row.get("annotator_2_label", "").strip()
                if l1 and l2:
                    labels_1.append(l1)
                    labels_2.append(l2)
                    
        if len(labels_1) < 2:
            print("Error: Need at least 2 annotated segments to calculate Kappa.")
            return
            
        kappa = cohen_kappa_score(labels_1, labels_2)
        
        print("\n=== Inter-Annotator Agreement Report ===")
        print(f"Total Segments Analyzed: {len(labels_1)}")
        print(f"Cohen's Kappa Score: {round(kappa, 4)}")
        
        if kappa > 0.8: print("Agreement Level: Excellent")
        elif kappa > 0.6: print("Agreement Level: Substantial")
        elif kappa > 0.4: print("Agreement Level: Moderate")
        else: print("Agreement Level: Poor / Fair")
        print("========================================\n")
        
        # Disagreement analysis
        disagreements = [(l1, l2) for l1, l2 in zip(labels_1, labels_2) if l1 != l2]
        if disagreements:
            print("Top Disagreement Pairs:")
            from collections import Counter
            counts = Counter(disagreements)
            for (l1, l2), count in counts.most_common(5):
                print(f"  Annotator 1 ({l1}) vs Annotator 2 ({l2}): {count} occurrences")

    except Exception as e:
        print(f"Error processing IAA: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python calculate_iaa.py <path_to_csv>")
    else:
        calculate_iaa(sys.argv[1])
