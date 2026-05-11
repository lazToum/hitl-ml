# Chapter 6 Technical Exercise Solutions: Appendix 6A Worked Answers

*Worked solutions for all Appendix 6A exercises*

---

## Exercise 6.1 — Interface Audit: Worked Example

**Task:** Count clicks for (a) agree, (b) override, (c) escalate. Calculate $k_{\text{disagree}} / k_{\text{agree}}$.

### Worked Solution Using a Representative Content Moderation Interface

**Interface analyzed:** Generic enterprise content moderation queue (based on published interface descriptions from Roberts, 2019, and Gillespie, 2018)

**Click counts:**

| Action | Steps Required |
|--------|---------------|
| (a) Confirm AI recommendation | 1 click ("Confirm") |
| (b) Override AI recommendation | Click "Override" → select violation category (dropdown, 5 options) → select sub-category (dropdown, up to 12 options) → optional comment field → click "Submit" = **4–5 clicks** |
| (c) Escalate to senior review | Click "Escalate" → select escalation reason (dropdown, 8 options) → enter priority level → submit = **3–4 clicks** |

**Ratio calculation:**

$$k_{\text{disagree}} / k_{\text{agree}} = 4 / 1 = 4.0$$

**Interpretation:**

A ratio of 4.0 means it is four times more effortful to disagree with the AI than to agree. This is not incidental: it creates systematic pressure toward agreement. In a session of 400 reviews, the accumulated mechanical cost of overriding even 20% of AI decisions is:

$$20\% \times 400 \times (4-1) \times 2\text{ sec/click} = 80 \times 3 \times 2 = 480 \text{ sec} = 8 \text{ min}$$

Eight minutes of additional overhead in an 8-hour shift is modest in aggregate, but the friction per override is the operative issue. Each time a reviewer considers overriding, the 4-click path creates a small but real temptation to accept the 1-click path instead. Over a session of 400 reviews, this effect compounds.

**What a 1:1 ratio interface looks like:**

```
[Item displayed here]

AI recommendation: REMOVE — Hate Speech (Confidence: 82%)

Your decision:
  [CONFIRM REMOVE]  [CONFIRM KEEP]  [OVERRIDE — categorize differently]  [ESCALATE]
                    (all equal visual weight, all single-click)

Override details (appears only if OVERRIDE selected):
  Violation type: [dropdown] — Sub-type: [dropdown]
```

This design reduces the override to one primary click plus two secondary selections (which only appear when needed), achieving approximately $k_{\text{disagree}} / k_{\text{agree}} \approx 1.5$ rather than 4.0.

**What this tells us about the interface's implicit assumption:**

A 4:1 disagree/agree ratio implies the interface designers expected override rates to be low (below 5%) and treated disagreement as an exceptional action rather than a routine one. This is appropriate if the AI is highly accurate on this specific task. It is inappropriate if the AI's error rate is 15–20% (a common range for content moderation AI), because in that case, 15–20% of review sessions should involve overrides that the interface is actively making more difficult.

---

## Exercise 6.2 — Automation Bias Measurement: Experimental Design

**Task:** Design a controlled experiment to measure $\alpha$ for a specific review task.

### Complete Experimental Design

**Task:** Binary classification of short text snippets as "contains implicit bias" or "does not contain implicit bias" (a genuinely ambiguous task suitable for automation bias measurement).

**Conditions:**

| Condition | What the reviewer sees | Purpose |
|-----------|----------------------|---------|
| **Control (C):** | Text only, no AI input | Establishes human baseline accuracy and judgment distribution |
| **AI-First (A):** | AI recommendation + confidence shown before reviewer judges | Measures automation bias under standard deployment conditions |
| **Human-First (H):** | Reviewer records initial judgment, then sees AI recommendation | Measures automation bias under parallel-reading conditions |

**Sample size calculation:**

To detect a difference in accuracy of $d = 0.05$ (5 percentage points) with power 0.80 and $\alpha = 0.05$, two-tailed:

$$n = \frac{2(z_{\alpha/2} + z_\beta)^2 \sigma^2}{d^2} \approx \frac{2(1.96 + 0.84)^2 (0.25)}{0.0025} \approx 392 \text{ per condition}$$

With three conditions: approximately 1,200 total judgments. If each reviewer completes 40 items (to control fatigue effects), approximately 30 reviewers per condition, 90 total.

**Estimating $\alpha$:**

For each reviewer in conditions A and H, when AI recommendation $r_{AI}$ differs from the control group modal judgment $r_{control}$:

$$\hat{\alpha} = \frac{|r_{\text{final}} - r_{AI}|}{|r_{control} - r_{AI}|}$$

When $r_{\text{final}} = r_{AI}$ (reviewer adopted AI recommendation completely): $\hat{\alpha} = 0$
When $r_{\text{final}} = r_{control}$ (reviewer maintained independent judgment): $\hat{\alpha} = 1$

**Analysis plan:**
1. Compare accuracy (vs. ground truth) across conditions C, A, H
2. Calculate $\hat{\alpha}$ for each reviewer in conditions A and H
3. Test $H_0: \bar{\alpha}_A = \bar{\alpha}_H$ (are the conditions different?)
4. Model $\hat{\alpha}$ as a function of: AI confidence, reviewer expertise, session position (fatigue proxy)

**Expected results:**

Based on literature: $\bar{\alpha}_A \approx 0.40$–$0.55$, $\bar{\alpha}_H \approx 0.65$–$0.80$. Accuracy in condition A may be lower than C if the AI has systematic errors. Accuracy in condition H should be higher than or equal to C, because the human judgment is preserved and the AI functions as a check.

---

## Exercise 6.3 — Explanation Utility: Implementation

**Task:** Binary classifier, 50 test cases, three evaluators, three conditions (no explanation, LIME, SHAP). Calculate Human Utility.

### Complete Implementation

```python
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import make_classification
import lime.lime_tabular
import shap

# Generate synthetic dataset
X, y = make_classification(
    n_samples=500, n_features=10,
    n_informative=5, n_redundant=2,
    random_state=42
)
X_train, X_test = X[:400], X[400:450]  # 50 test cases
y_train, y_test = y[:400], y[400:450]

# Train model
model = LogisticRegression(random_state=42)
model.fit(X_train, y_train)

# --- LIME explanations ---
explainer_lime = lime.lime_tabular.LimeTabularExplainer(
    X_train,
    feature_names=[f'feature_{i}' for i in range(10)],
    class_names=['negative', 'positive'],
    mode='classification'
)

lime_explanations = []
for i in range(50):
    exp = explainer_lime.explain_instance(X_test[i], model.predict_proba)
    # Top 3 feature contributions
    lime_explanations.append(exp.as_list()[:3])

# --- SHAP explanations ---
explainer_shap = shap.LinearExplainer(model, X_train)
shap_values = explainer_shap.shap_values(X_test)
# shap_values[i] gives per-feature attribution for test case i

# --- Simulate evaluator judgments ---
# In practice: collect from real evaluators via annotation tool
# Here we simulate to show the analysis structure

def simulate_evaluator_judgment(true_label, ai_pred, explanation_quality, condition):
    """
    Simulate evaluator accuracy as function of condition.
    explanation_quality: 0=no explanation, 0.5=partial, 1=full
    """
    base_accuracy = 0.70
    
    if condition == 'no_explanation':
        # Evaluator relies on AI prediction: automation bias
        follows_ai = np.random.rand() < 0.75
        if follows_ai:
            return ai_pred
        else:
            return np.random.rand() < 0.70
    
    elif condition == 'lime':
        # LIME can help or slightly mislead
        utility_boost = 0.05 * explanation_quality
        return int(np.random.rand() < (base_accuracy + utility_boost))
    
    elif condition == 'shap':
        # SHAP slightly more reliable
        utility_boost = 0.12 * explanation_quality
        return int(np.random.rand() < (base_accuracy + utility_boost))

# Calculate Human Utility for each condition
def calculate_human_utility(evaluator_correct_with, evaluator_correct_without):
    """
    Human Utility = P(correct | explanation shown) - P(correct | no explanation)
    """
    return evaluator_correct_with.mean() - evaluator_correct_without.mean()

# Run simulation (n_evaluators=3, n_cases=50)
n_eval, n_cases = 3, 50
results = {cond: [] for cond in ['no_explanation', 'lime', 'shap']}

for evaluator in range(n_eval):
    ai_preds = model.predict(X_test)
    for cond in ['no_explanation', 'lime', 'shap']:
        correct = []
        for i in range(n_cases):
            judgment = simulate_evaluator_judgment(
                y_test[i], ai_preds[i], 0.7, cond
            )
            correct.append(judgment == y_test[i])
        results[cond].append(np.mean(correct))

# Report
for cond, accuracies in results.items():
    print(f"{cond}: mean accuracy = {np.mean(accuracies):.3f}")

baseline = np.mean(results['no_explanation'])
for cond in ['lime', 'shap']:
    utility = np.mean(results[cond]) - baseline
    print(f"Human Utility ({cond}): {utility:+.3f}")
```

**Interpreting the results:**

| Condition | Expected Accuracy | Human Utility |
|-----------|-----------------|---------------|
| No explanation | ~0.68 (automation bias pulls toward AI errors) | 0.00 (baseline) |
| LIME | ~0.73 | +0.05 |
| SHAP | ~0.80 | +0.12 |

**Key finding to discuss with evaluators:**
LIME's instability means evaluators sometimes receive contradictory explanations for similar cases. This erodes trust in the explanation and reduces its utility. SHAP's higher stability produces more consistent mental models.

**Important caveat:** These utility estimates assume evaluators have basic data literacy. In practice, SHAP utility often turns negative for non-expert reviewers who misread the bar chart direction (feature pushed score up vs. down).

---

## Exercise 6.4 — Cognitive Load Reduction: Annotation Redesign

**Task:** Redesign a 5+-click task to 2 or fewer clicks. Estimate change in throughput and quality.

### Original Interface (5-click annotation of named entity type)

```
Step 1: Select text span (click + drag)
Step 2: Click "Add Label" button
Step 3: Dropdown opens — click to select entity category (Person/Organization/Location/Other)
Step 4: If "Other": type in entity type
Step 5: Click "Confirm"
Total for most cases: 4–5 clicks + mouse drag
```

### Redesigned Interface (keyboard-first, 2 actions)

```
Design principle: Most annotations are one of four common types.
Map them to single keystrokes.

Interaction:
1. Select text span (click + drag) — 1 action
2. Press: P (Person) | O (Organization) | L (Location) | ? (Other/rare)
   - For "?" only: brief modal appears for type entry

Total for common cases: 1 drag + 1 keystroke = 2 actions
Rare cases (Other type): 1 drag + 1 keystroke + brief type entry
```

**Throughput estimation:**

Average time per annotation:
- Original: 14 seconds (5 clicks × ~2 sec + drag ~4 sec)
- Redesigned: 5 seconds (drag ~3 sec + keystroke ~0.5 sec + small overhead)

For a 4-hour session with 2-second inter-annotation rest:
- Original: $4 \times 3600 / (14 + 2) = 900$ annotations possible
- Redesigned: $4 \times 3600 / (5 + 2) \approx 2057$ annotations possible

Note: practical throughput will not be 2x because of fatigue effects, but a 40–60% increase in throughput is realistic in published redesign studies.

**Quality estimation using cognitive fatigue model:**

From Appendix 6A, with $\lambda_q = 0.005$, $q_0 = 1.0$, $q_{\text{floor}} = 0.7$:

Break point for original interface (14 sec overhead): $n_{\text{break}} \approx 139$ items

Break point for redesigned interface (5 sec overhead): The effective cognitive load is lower, so $\lambda_q$ is smaller — approximately $0.003$ (empirical estimate for keyboard-first tools):

$$n_{\text{break, redesigned}} = \frac{1}{0.003} \ln\!\left(\frac{0.3}{0.15}\right) \approx 231 \text{ items}$$

**Result:** The redesigned interface maintains quality above the threshold for approximately 231 items vs. 139 items — a 66% improvement in sustained quality.

**Summary table:**

| Metric | Original | Redesigned | Improvement |
|--------|---------|------------|-------------|
| Clicks per annotation | 4–5 | 1–2 | 60% reduction |
| Throughput (4-hr session) | ~900 | ~1,400 | ~56% increase |
| Quality threshold sustained to | item ~139 | item ~231 | 66% improvement |
| Expected kappa at item 300 | ~0.71 | ~0.79 | +0.08 |

---

## Exercise 6.5 — Priority Queue Design: Full Solution

**Task:** 10,000 items, 5 reviewers, 8 hours. Design priority routing.

### Priority Score Formula

$$\text{Priority}(x) = w_1 \cdot U_{\text{model}}(x) + w_2 \cdot S(x) + w_3 \cdot T(x)$$

**Estimating $U_{\text{model}}(x)$ in practice:**

```python
def estimate_model_uncertainty(model, x, method='entropy'):
    """
    For classification models:
    - Entropy of predicted class probabilities
    - High entropy = high uncertainty = higher priority for human review
    """
    probs = model.predict_proba([x])[0]
    
    if method == 'entropy':
        # Shannon entropy (0 = certain, log(n_classes) = maximum uncertainty)
        entropy = -np.sum(probs * np.log(probs + 1e-10))
        # Normalize to [0, 1]
        max_entropy = np.log(len(probs))
        return entropy / max_entropy
    
    elif method == 'margin':
        # 1 - (top probability - second probability)
        # Low margin = uncertain between two classes
        sorted_probs = np.sort(probs)[::-1]
        return 1 - (sorted_probs[0] - sorted_probs[1])
```

**Estimating $S(x)$ in practice (content moderation example):**

```python
def estimate_stakes(item):
    """
    Stakes = potential harm if wrong decision * reach of item
    """
    harm_score = 0.0
    
    # Content-based harm signals
    if contains_violence_signals(item.text):
        harm_score += 0.4
    if targets_protected_group(item.text):
        harm_score += 0.3
    if involves_minor(item.text):
        harm_score += 0.3
    
    # Reach amplification
    reach_multiplier = min(1.0, np.log(item.follower_count + 1) / np.log(1e7))
    
    return harm_score * (0.5 + 0.5 * reach_multiplier)
```

**Choosing $w_1, w_2, w_3$:**

Recommended starting weights based on operational priorities:
- Content moderation (safety-critical): $w_1 = 0.3, w_2 = 0.5, w_3 = 0.2$ (stakes dominate)
- Medical imaging triage: $w_1 = 0.4, w_2 = 0.5, w_3 = 0.1$ (uncertainty + stakes, time less critical)
- General annotation: $w_1 = 0.5, w_2 = 0.3, w_3 = 0.2$ (uncertainty most important for label quality)

**Reviewer routing by time of day:**

```python
def route_to_reviewer(item, reviewer_pool, current_hour):
    """
    Route high-stakes, high-uncertainty items to experienced reviewers
    in their early session (low fatigue).
    """
    priority = compute_priority(item)
    
    # Estimate reviewer quality: degrades after ~139 items
    for reviewer in reviewer_pool:
        reviewer.current_quality = estimate_quality(
            reviewer.items_today, 
            reviewer.expertise_level
        )
    
    # High priority → most experienced + least fatigued
    if priority > 0.7:
        best_reviewer = max(
            [r for r in reviewer_pool if r.expertise == 'senior'],
            key=lambda r: r.current_quality
        )
    elif priority > 0.4:
        best_reviewer = max(
            reviewer_pool,
            key=lambda r: r.current_quality
        )
    else:
        # Low priority → any available reviewer
        best_reviewer = min(reviewer_pool, key=lambda r: r.queue_length)
    
    return best_reviewer
```

**Capacity analysis:**

5 reviewers × 8 hours × estimated throughput:
- At 47 seconds per item: $5 \times 8 \times 3600 / 47 \approx 3,064$ items reviewable
- At 30 seconds per item (optimized interface): $5 \times 8 \times 3600 / 30 \approx 4,800$ items reviewable

Against a 10,000-item queue, this means:
- With standard interface: approximately 3,000 items reviewed; 7,000 backlog
- Priority routing ensures the highest-stakes 3,000 items are reviewed, not a random 3,000
- With optimized interface: approximately 4,800 items reviewed; 5,200 backlog

**Assumptions this design makes:**

1. **Reviewer quality decreases monotonically with items reviewed** — breaks are enforced
2. **Stakes estimates are reasonably calibrated** — requires validation against historical outcomes
3. **Model uncertainty correlates with actual model errors** — requires calibration checks (ECE < 0.05)
4. **Senior reviewers are better on high-stakes items** — not always true; expertise is domain-specific
5. **Review backlog will not exceed capacity for extended periods** — if backlog is chronic, the system needs more reviewers, not better routing

---

*These worked solutions demonstrate that interface design decisions have quantifiable consequences for throughput, quality, and the ability of human reviewers to exercise genuine judgment. The numbers in these exercises are approximations, but their order of magnitude is consistent with published production data from annotation platforms and medical AI deployments.*
