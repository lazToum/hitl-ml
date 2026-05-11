# Appendix 18A: Measuring Human Contribution in HITL Systems

*Quantifying human value-add, civic AI literacy frameworks, and accountability architectures*

---

## 18A.1 Quantifying the Human Value-Add

### The Human Contribution Index (HCI)

In a HITL system, the human contribution can be formally measured as the difference between the system's performance with and without human review:

$$\text{HCI} = \text{Acc}(f_\text{HITL}) - \text{Acc}(f_\text{automated})$$

However, this aggregate measure conflates two distinct effects:
1. **Routing benefit**: cases routed to humans were genuinely harder, and human accuracy on those cases exceeds model accuracy
2. **Review quality**: the human reviews cases accurately

A decomposed measure:

$$\text{HCI} = \underbrace{P(\text{routed}) \cdot (\text{Acc}_\text{human, routed} - \text{Acc}_\text{model, routed})}_{\text{routing benefit}} + \underbrace{(1-P(\text{routed})) \cdot 0}_{\text{automated cases}}$$

```python
import numpy as np
from sklearn.metrics import accuracy_score

def compute_hci(y_true, model_preds, human_decisions, routed_mask):
    """
    Compute Human Contribution Index.
    
    Args:
        y_true: ground truth labels
        model_preds: model predictions (for all cases)
        human_decisions: human labels (for routed cases only)
        routed_mask: boolean array, True where case was routed
    """
    auto_acc = accuracy_score(
        y_true[~routed_mask], model_preds[~routed_mask]
    )
    human_acc = (
        accuracy_score(y_true[routed_mask], human_decisions)
        if routed_mask.sum() > 0 else np.nan
    )
    model_acc_on_routed = (
        accuracy_score(y_true[routed_mask], model_preds[routed_mask])
        if routed_mask.sum() > 0 else np.nan
    )
    
    hitl_decisions = model_preds.copy()
    hitl_decisions[routed_mask] = human_decisions
    hitl_acc = accuracy_score(y_true, hitl_decisions)
    
    routing_rate = routed_mask.mean()
    routing_benefit = routing_rate * (human_acc - model_acc_on_routed)
    
    return {
        'hitl_accuracy': hitl_acc,
        'auto_only_accuracy': accuracy_score(y_true, model_preds),
        'human_accuracy_on_routed': human_acc,
        'model_accuracy_on_routed': model_acc_on_routed,
        'routing_rate': routing_rate,
        'hci': routing_benefit,
        'human_value_add': hitl_acc - accuracy_score(y_true, model_preds)
    }
```

---

## 18A.2 Human-AI Complementarity Analysis

The value of a HITL system depends on complementarity between human and AI capabilities. Formally, the complementarity $C$ is:

$$C = P(\text{human correct} \mid \text{model wrong}) - P(\text{human correct} \mid \text{model right})$$

$C > 0$ means humans are more likely to be correct when the model is wrong — the system benefits from human involvement. $C \leq 0$ means human and model errors are correlated — adding humans doesn't help.

```python
def complementarity_analysis(y_true, model_preds, human_preds):
    """
    Analyze human-AI complementarity.
    Returns complementarity score and agreement matrix.
    """
    model_correct = (model_preds == y_true)
    human_correct = (human_preds == y_true)

    p_human_given_model_wrong = (
        human_correct[~model_correct].mean()
        if (~model_correct).sum() > 0 else np.nan
    )
    p_human_given_model_right = (
        human_correct[model_correct].mean()
        if model_correct.sum() > 0 else np.nan
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

---

## 18A.3 Civic AI Literacy Framework

The chapter argues that civic participation in AI governance is accessible to people with basic AI literacy. The following framework maps competency levels to participation forms:

| Literacy Level | Key Concepts | Participation Forms |
|----------------|-------------|---------------------|
| **Level 1 (Basic)** | AI as statistical pattern matching; uncertainty is normal; models can be wrong | Noticing and reporting AI errors; informed consumer of AI products |
| **Level 2 (Functional)** | Training data determines behavior; calibration vs. accuracy; fairness tradeoffs | Public comment on AI regulations; understanding AI explanations |
| **Level 3 (Critical)** | Feedback loops; impossibility theorems; accountability gaps | Auditing AI systems; advocacy for fairness standards; advising policymakers |
| **Level 4 (Technical)** | All of the above plus implementation | Red-teaming; designing audits; building oversight tools |

Reading this book puts you solidly at Level 2, with exposure to Level 3 concepts. Level 2 is sufficient for meaningful participation in most public governance processes.

---

## 18A.4 Accountability Architecture

A complete accountability architecture for a HITL system has four layers:

**Layer 1: Decision audit trail.**
Every automated and human-reviewed decision is logged with: timestamp, input features (or hash), model confidence, routing decision, human reviewer ID, human decision, and outcome (when observable).

**Layer 2: Aggregate monitoring.**
Regular reporting of: accuracy by demographic group, false positive and false negative rates, override rates, reviewer agreement rates.

**Layer 3: Independent audit.**
Periodic (quarterly, annually) review by parties independent of the operating team, with access to audit logs and aggregate statistics. Findings reported publicly for high-stakes systems.

**Layer 4: Contestability pathway.**
Documented, functional process by which individuals affected by a system's decision can: (a) receive a meaningful explanation, (b) challenge the decision with a human reviewer who has actual authority to override, (c) receive a response within defined time limits.

---

## 18A.5 Exercises

**Exercise 18A.1 — Human Contribution Audit.**
Using a classification dataset of your choice, simulate a HITL system:
(a) Train a model; route cases with confidence < 0.7 to a simulated human.
(b) Simulate human performance: correct 80% of the time on routed cases.
(c) Compute HCI and complementarity scores.
(d) At what confidence threshold is HCI maximized? Why?

**Exercise 18A.2 — Accountability Architecture Audit.**
Choose an AI system you interact with regularly (spam filter, content recommendation, fraud detection):
(a) Which layers of the accountability architecture does it have?
(b) Is there a public description of how decisions are made?
(c) Can you find a contestability pathway? How accessible is it?
(d) Write a one-page accountability assessment.

**Exercise 18A.3 — Civic Participation Simulation.**
Find a recent public comment period on AI regulation (FTC AI guidelines, NIST AI RMF updates, EU AI Act implementation):
(a) Read the draft document's key provisions.
(b) Write a public comment (250–500 words) using concepts from this book.
(c) Identify: what fairness definition does the proposal implicitly adopt? What monitoring requirements does it include? What contestability provisions?
