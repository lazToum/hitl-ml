# Chapter 18 Technical Appendix Solutions

*Worked solutions to exercises from Appendix 18A*

---

## Exercise 18A.1 Solution — Human Contribution Audit

**Task:** Simulate a HITL system with a confidence threshold for routing; compute HCI and complementarity.

### Full Implementation

```python
import numpy as np
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
import matplotlib.pyplot as plt

def simulate_hitl_system(confidence_threshold=0.70, 
                          human_accuracy_on_routed=0.80,
                          n=2000, random_state=42):
    """
    Simulate HITL system and compute Human Contribution Index.
    
    Args:
        confidence_threshold: cases below this confidence are routed to human
        human_accuracy_on_routed: probability human is correct on routed cases
        n: number of test cases
    """
    np.random.seed(random_state)
    
    # Generate dataset and train model
    X, y = make_classification(n_samples=5000, n_features=10, 
                                n_informative=6, random_state=42)
    X_train, y_train = X[:3000], y[:3000]
    X_test, y_test = X[3000:3000+n], y[3000:3000+n]
    
    model = LogisticRegression(max_iter=500)
    model.fit(X_train, y_train)
    
    probs = model.predict_proba(X_test)
    confidence = probs.max(axis=1)
    model_preds = model.predict(X_test)
    
    # Route based on confidence
    routed_mask = confidence < confidence_threshold
    routing_rate = routed_mask.mean()
    
    # Simulate human decisions on routed cases
    n_routed = routed_mask.sum()
    human_decisions = np.where(
        np.random.random(n_routed) < human_accuracy_on_routed,
        y_test[routed_mask],      # correct
        1 - y_test[routed_mask]   # incorrect
    )
    
    # Build HITL decision set
    hitl_decisions = model_preds.copy()
    hitl_decisions[routed_mask] = human_decisions
    
    # Compute metrics
    auto_acc = accuracy_score(y_test[~routed_mask], model_preds[~routed_mask])
    human_acc = accuracy_score(y_test[routed_mask], human_decisions)
    model_acc_on_routed = accuracy_score(y_test[routed_mask], model_preds[routed_mask])
    hitl_acc = accuracy_score(y_test, hitl_decisions)
    model_only_acc = accuracy_score(y_test, model_preds)
    
    routing_benefit = routing_rate * (human_acc - model_acc_on_routed)
    hci = routing_benefit
    
    return {
        'threshold': confidence_threshold,
        'routing_rate': routing_rate,
        'hitl_accuracy': hitl_acc,
        'model_only_accuracy': model_only_acc,
        'human_accuracy_on_routed': human_acc,
        'model_accuracy_on_routed': model_acc_on_routed,
        'hci': hci,
        'human_value_add': hitl_acc - model_only_acc,
    }


# ─── Part (d): Sweep thresholds to find HCI maximum ───
thresholds = np.arange(0.50, 0.99, 0.02)
results = [simulate_hitl_system(t) for t in thresholds]

hci_values = [r['hci'] for r in results]
routing_rates = [r['routing_rate'] for r in results]
value_adds = [r['human_value_add'] for r in results]

optimal_threshold = thresholds[np.argmax(hci_values)]
print(f"HCI-maximizing threshold: {optimal_threshold:.2f}")
print(f"Maximum HCI: {max(hci_values):.4f}")
print(f"Routing rate at optimal: {routing_rates[np.argmax(hci_values)]:.2%}")

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))

ax1.plot(thresholds, hci_values, 'b-', linewidth=2)
ax1.axvline(x=optimal_threshold, color='red', linestyle='--', 
            label=f'Optimal: {optimal_threshold:.2f}')
ax1.set_xlabel('Confidence Threshold')
ax1.set_ylabel('Human Contribution Index (HCI)')
ax1.set_title('HCI vs. Confidence Threshold')
ax1.legend()

ax2.plot(thresholds, routing_rates, 'g-', linewidth=2, label='Routing Rate')
ax2.plot(thresholds, value_adds, 'b--', linewidth=2, label='Human Value-Add')
ax2.set_xlabel('Confidence Threshold')
ax2.set_ylabel('Rate / Improvement')
ax2.set_title('Routing Rate and Value-Add vs. Threshold')
ax2.legend()

plt.tight_layout()
plt.savefig('hci_analysis.png', dpi=150)
```

**Expected results:**
- HCI is maximized at threshold approximately 0.62–0.72, depending on the dataset
- The optimal threshold balances two competing effects: as threshold increases, more cases are routed (including ones the model would have gotten right), diluting the routing benefit; as threshold decreases, only the most extreme uncertainty is routed, reducing volume
- The maximum is where the marginal case routed has exactly equal expected accuracy under human and model review

---

## Exercise 18A.2 Solution — Accountability Architecture Audit

**Task:** Audit a frequently-used AI system for the four accountability layers.

### Strong Audit Framework

```python
from dataclasses import dataclass
from typing import Optional, List

@dataclass
class AccountabilityAudit:
    system_name: str
    # Layer 1: Decision audit trail
    has_audit_trail: bool
    audit_trail_details: Optional[str]
    # Layer 2: Aggregate monitoring
    has_aggregate_monitoring: bool
    monitoring_details: Optional[str]
    monitoring_disaggregated: bool  # by demographic group?
    # Layer 3: Independent audit
    has_independent_audit: bool
    audit_frequency: Optional[str]
    audit_public: bool
    # Layer 4: Contestability
    has_contestability_pathway: bool
    contestability_accessible: bool  # actually reachable, not just exists
    contestability_has_timeframe: bool
    contestability_has_authority: bool  # human with actual power to reverse
    
    def score(self) -> dict:
        """Compute accountability score by layer."""
        l1 = int(self.has_audit_trail)
        l2 = int(self.has_aggregate_monitoring) + int(self.monitoring_disaggregated)
        l3 = int(self.has_independent_audit) + int(self.audit_public)
        l4 = sum([
            int(self.has_contestability_pathway),
            int(self.contestability_accessible),
            int(self.contestability_has_timeframe),
            int(self.contestability_has_authority),
        ])
        
        return {
            'layer_1_score': l1,
            'layer_2_score': l2 / 2.0,  # normalize to [0,1]
            'layer_3_score': l3 / 2.0,
            'layer_4_score': l4 / 4.0,
            'total_score': (l1 + l2/2 + l3/2 + l4/4) / 4.0
        }


# Example: spam filter
spam_filter_audit = AccountabilityAudit(
    system_name="Gmail Spam Filter",
    has_audit_trail=True,  # per-email decisions logged
    audit_trail_details="Individual decisions logged in account activity",
    has_aggregate_monitoring=True,
    monitoring_details="Google reports aggregate spam detection rates",
    monitoring_disaggregated=False,  # no public demographic breakdown
    has_independent_audit=False,
    audit_frequency=None,
    audit_public=False,
    has_contestability_pathway=True,
    contestability_accessible=True,   # "Not spam" button
    contestability_has_timeframe=False,  # no defined response time
    contestability_has_authority=True   # moves email, trains model
)

scores = spam_filter_audit.score()
print(f"Accountability scores: {scores}")
```

**Common finding:** Most production AI systems have Layer 1 (documented) and partial Layer 2 (aggregate monitoring but not disaggregated), but lack Layer 3 (independent audit) and have Layer 4 that is nominally present but practically inaccessible.

---

## Exercise 18A.3 Solution — Civic Participation Simulation

**Finding regulatory comment periods:**

Common sources:
- regulations.gov (US federal regulatory proposals)
- Federal Register (federalregister.gov)
- NIST ai.gov/policies (for AI RMF updates)
- EU Commission (ec.europa.eu/digital-single-market)

**Strong comment structure:**

1. **Identify the implicit fairness definition:** Most proposals implicitly adopt one without naming it. Example: "The proposal requires that error rates be reported by demographic group" — this implicitly prioritizes equalized odds over calibration.

2. **Assess monitoring requirements:** Does the proposal require aggregate metrics only (overall accuracy) or slice-based (per demographic group)? The latter is necessary for detecting disparate impact.

3. **Evaluate contestability provisions:** Does the proposal specify: (a) response time for challenges, (b) a decision-maker with actual authority to reverse, (c) an explanation standard, (d) access for affected parties without legal representation?

**Sample comment excerpt:**
"Section 4.2 requires disclosure of aggregate accuracy metrics, but this standard is insufficient to detect systematic failures for minority subgroups. The False Positive Rate (FPR) for a system may appear acceptable in aggregate while being substantially elevated for a specific demographic group — as documented in COMPAS and comparable risk assessment systems. I recommend that Section 4.2 be amended to require slice-based performance reporting by demographic group, with statistical significance testing for performance disparities. This standard is achievable for any system that collects or accesses demographic information."

---

## Computing HCI with Complementarity Analysis

```python
def compute_complementarity(y_true, model_preds, human_preds):
    """
    Analyze human-AI complementarity.
    
    Complementarity C > 0 means humans correct model errors.
    C <= 0 means human and model errors are correlated.
    """
    model_correct = (model_preds == y_true)
    human_correct = (human_preds == y_true)

    p_human_given_model_wrong = (
        human_correct[~model_correct].mean()
        if (~model_correct).sum() > 0 else float('nan')
    )
    p_human_given_model_right = (
        human_correct[model_correct].mean()
        if model_correct.sum() > 0 else float('nan')
    )

    complementarity = p_human_given_model_wrong - p_human_given_model_right

    return {
        'complementarity': complementarity,
        'p_human_correct_given_model_wrong': p_human_given_model_wrong,
        'p_human_correct_given_model_right': p_human_given_model_right,
        'agreement_matrix': {
            'both_right': (model_correct & human_correct).mean(),
            'both_wrong': (~model_correct & ~human_correct).mean(),
            'human_only_right': (~model_correct & human_correct).mean(),
            'model_only_right': (model_correct & ~human_correct).mean(),
        }
    }
```

**Interpretation:** Complementarity > 0.20 indicates strong human-AI complementarity — the HITL system will substantially outperform either alone. Complementarity near 0 indicates humans and model fail on the same cases — adding human review adds cost without adding accuracy. Negative complementarity (humans worse when model is wrong) indicates systematic automation bias or a domain mismatch between human expertise and routed case characteristics.
