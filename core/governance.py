from typing import Dict, Any, List

class FrameworkGovernance:
    """
    Centralized governance ruleset.
    Ensures deterministic, reproducible constraints over adaptive LLM behavior.
    """
    
    @staticmethod
    def enforce_routing_rules(execution_plan: Dict[str, Any], trace_log: List[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Applies hard domain-based overrides to the execution plan."""
        domain = execution_plan.get("domain", "").lower()
        if trace_log is None:
            trace_log = []
            
        if "institutional" in domain or "academic" in domain or "clinical" in domain:
            execution_plan["run_register"] = True
            msg = "Governance Override: Register Theory enforced for formal domains."
            execution_plan["routing_rationale"] += f" [{msg}]"
            trace_log.append({"event": "Routing Override", "target": "Register", "reason": msg, "timestamp": "execution_time"})
            
        if "political" in domain or "social" in domain:
            execution_plan["run_pragmatics"] = True
            msg = "Governance Override: Pragmatics enforced for persuasive/social domains."
            execution_plan["routing_rationale"] += f" [{msg}]"
            trace_log.append({"event": "Routing Override", "target": "Pragmatics", "reason": msg, "timestamp": "execution_time"})
            
        return execution_plan

    @staticmethod
    def apply_confidence_penalties(segments: List[Dict[str, Any]], execution_plan: Dict[str, Any], trace_log: List[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        """
        Applies mathematical penalties based on theoretical governance rules.
        """
        complexity = execution_plan.get("linguistic_complexity", 0.5)
        if trace_log is None:
            trace_log = []
            
        for idx, seg in enumerate(segments):
            # Rule 1: High complexity / Emotional instability penalty to semantics
            if complexity > 0.8 and "semantics" in seg and "confidence" in seg["semantics"]:
                old_conf = seg["semantics"]["confidence"]
                new_conf = max(0.1, old_conf * 0.85)
                seg["semantics"]["confidence"] = new_conf
                trace_log.append({"event": "Confidence Penalty", "target": f"Segment {idx} Semantics", "reason": "High complexity/instability", "old_value": old_conf, "new_value": new_conf})
                
            # Rule 2: Low evidence quality penalizes overall confidence heavily
            for framework in ["pragmatics", "semantics", "register"]:
                if framework in seg and "evidence_quality" in seg[framework] and "confidence" in seg[framework]:
                    eq = seg[framework]["evidence_quality"]
                    if eq < 0.5:
                        old_conf = seg[framework]["confidence"]
                        new_conf = max(0.1, old_conf * 0.70)
                        seg[framework]["confidence"] = new_conf
                        trace_log.append({"event": "Confidence Penalty", "target": f"Segment {idx} {framework}", "reason": f"Low evidence quality ({eq})", "old_value": old_conf, "new_value": new_conf})
                        
        return segments
