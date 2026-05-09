"""
PMDD Automated Experiment Summary & LaTeX Generator
Parses experiment results to generate Markdown and LaTeX tables for publications.
"""
import json
import os
import sys

def generate_latex_table(headers, rows, caption="Experiment Results", label="tab:results"):
    """Generates a clean LaTeX table snippet."""
    num_cols = len(headers)
    col_format = "c" * num_cols
    
    latex = f"\\begin{{table}}[h!]\n\\centering\n\\begin{{tabular}}{{{col_format}}}\n\\hline\n"
    latex += " & ".join(headers) + " \\\\\n\\hline\n"
    
    for row in rows:
        latex += " & ".join([str(item) for item in row]) + " \\\\\n"
        
    latex += f"\\hline\n\\end{{tabular}}\n\\caption{{{caption}}}\n\\label{{{label}}}\n\\end{{table}}"
    return latex

def generate_markdown_table(headers, rows):
    """Generates a Markdown table snippet."""
    md = "| " + " | ".join(headers) + " |\n"
    md += "| " + " | ".join(["---"] * len(headers)) + " |\n"
    for row in rows:
        md += "| " + " | ".join([str(item) for item in row]) + " |\n"
    return md

def summarize_experiment(experiment_json_path, output_dir="docs/publications/"):
    if not os.path.exists(experiment_json_path):
        print(f"Error: Could not find {experiment_json_path}")
        return
        
    with open(experiment_json_path, 'r') as f:
        data = json.load(f)
        
    print(f"Generating summaries for: {experiment_json_path}")
    
    # 1. Benchmark Metrics Summary
    headers = ["Metric", "Value"]
    rows = []
    if "math_scores" in data:
        for k, v in data["math_scores"].items():
            if isinstance(v, float):
                rows.append([k.replace("_", " ").title(), f"{v:.3f}"])
            else:
                rows.append([k.replace("_", " ").title(), str(v)])
                
    latex_metrics = generate_latex_table(headers, rows, caption="Systemic Metrics", label="tab:metrics")
    md_metrics = generate_markdown_table(headers, rows)
    
    # 2. Governance Intervention Summary
    gov_headers = ["Intervention Type", "Count"]
    gov_rows = []
    if "traceability_log" in data:
        penalties = [log for log in data["traceability_log"] if "Penalty" in log.get("event", "")]
        overrides = [log for log in data["traceability_log"] if "Routing Override" in log.get("event", "")]
        gov_rows.append(["Confidence Penalties", len(penalties)])
        gov_rows.append(["Routing Overrides", len(overrides)])
        gov_rows.append(["Total Interventions", len(data["traceability_log"])])
        
    latex_gov = generate_latex_table(gov_headers, gov_rows, caption="Deterministic Governance Interventions", label="tab:governance")
    md_gov = generate_markdown_table(gov_headers, gov_rows)
    
    # Save Outputs
    os.makedirs(output_dir, exist_ok=True)
    basename = os.path.basename(experiment_json_path).replace(".json", "")
    
    latex_path = os.path.join(output_dir, f"{basename}_tables.tex")
    with open(latex_path, 'w') as f:
        f.write("% Benchmark Metrics\n" + latex_metrics + "\n\n")
        f.write("% Governance Analytics\n" + latex_gov + "\n")
        
    md_path = os.path.join(output_dir, f"{basename}_summary.md")
    with open(md_path, 'w') as f:
        f.write(f"# Experiment Summary: {basename}\n\n")
        f.write("## Systemic Metrics\n" + md_metrics + "\n\n")
        f.write("## Governance Analytics\n" + md_gov + "\n")
        
    print(f"Successfully generated summaries at {output_dir}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        summarize_experiment(sys.argv[1])
    else:
        print("Usage: python generate_experiment_summary.py <path_to_results.json>")
