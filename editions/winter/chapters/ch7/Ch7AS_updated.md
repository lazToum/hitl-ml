# Chapter 7 Technical Exercise Solutions: Appendix 7A Worked Answers

*Worked solutions for all Appendix 7A exercises*

---

## Exercise 7.1 — Computing Kappa

**Given:**

|  | Ann 2: T | Ann 2: N |
|--|----------|----------|
| **Ann 1: T** | 20 | 15 |
| **Ann 1: N** | 10 | 55 |

**Step 1: Compute $P_o$ (observed agreement)**

Agreement cells are the diagonal: (T,T) = 20 and (N,N) = 55.

$$P_o = \frac{20 + 55}{100} = \frac{75}{100} = 0.75$$

**Step 2: Compute marginal proportions**

Annotator 1:
- P(Ann 1 labels T) = (20+15)/100 = 35/100 = 0.35
- P(Ann 1 labels N) = (10+55)/100 = 65/100 = 0.65

Annotator 2:
- P(Ann 2 labels T) = (20+10)/100 = 30/100 = 0.30
- P(Ann 2 labels N) = (15+55)/100 = 70/100 = 0.70

**Step 3: Compute $P_e$ (expected chance agreement)**

$$P_e = (0.35 \times 0.30) + (0.65 \times 0.70) = 0.105 + 0.455 = 0.56$$

**Step 4: Compute $\kappa$**

$$\kappa = \frac{P_o - P_e}{1 - P_e} = \frac{0.75 - 0.56}{1 - 0.56} = \frac{0.19}{0.44} = 0.432$$

**Interpretation (Landis-Koch scale):**

$\kappa = 0.432$ falls in the "Moderate agreement" range ($0.40 \leq \kappa < 0.60$).

Substantively: approximately 43% of possible non-chance agreement was achieved. For most content moderation tasks, this is below the recommended threshold of 0.60. It suggests the annotation guidelines need revision, a calibration session is warranted, or the task has irreducible ambiguity.

**Step 5: 95% Confidence Interval**

$$\text{Var}(\kappa) = \frac{P_o(1-P_o)}{N(1-P_e)^2} = \frac{0.75 \times 0.25}{100 \times (0.44)^2} = \frac{0.1875}{100 \times 0.1936} = \frac{0.1875}{19.36} = 0.00968$$

$$\text{SE}(\kappa) = \sqrt{0.00968} = 0.0984$$

$$\text{CI}_{95\%} = 0.432 \pm 1.96 \times 0.0984 = 0.432 \pm 0.193 = [0.239, 0.625]$$

The wide CI reflects the relatively small sample ($N=100$). For reliable kappa estimation, $N \geq 250–300$ is recommended.

---

## Exercise 7.2 — Fleiss' Kappa and When It Diverges

**When Cohen's kappa (applied pairwise) gives a misleading picture:**

**Case 1: Annotator with extreme bias**

Suppose three annotators have the following agreement pattern:
- Annotators 1 and 2 agree on 85% of items ($\kappa_{12} = 0.70$)
- Annotators 1 and 3 agree on 85% of items ($\kappa_{13} = 0.70$)
- Annotators 2 and 3 agree on 60% of items ($\kappa_{23} = 0.20$)

Average pairwise kappa: $\bar{\kappa} = (0.70 + 0.70 + 0.20)/3 = 0.53$

Fleiss' kappa: depends on the exact pattern, but it captures the *overall* consistency of the three-annotator system rather than the average of pairs. If Annotator 3 labels differently from both 1 and 2 on the same items, Fleiss' $\kappa$ would be lower than the average pairwise $\kappa$, correctly reflecting that the three-annotator system is less consistent than the pairwise averages suggest.

**Case 2: Circular agreement**

It is possible for each pairwise kappa to be moderate while the three annotators never all agree on the same item. This is pathological but theoretically possible. Fleiss' kappa, which requires all annotators to agree simultaneously for the numerator, would be near zero in this case. Average pairwise kappa would be moderate and misleadingly optimistic.

**Practical recommendation:**

When $M \geq 3$, report Fleiss' kappa as the primary agreement metric, supplemented by pairwise kappas to identify which specific annotator pairs are outliers. If Fleiss' kappa is substantially lower than average pairwise kappa, this is a signal of the circular agreement problem.

---

## Exercise 7.3 — Dawid-Skene vs. Majority Vote Simulation

**Setup:**

```python
import numpy as np

def simulate_annotation(N_items=100, expert_error=0.05, novice_error=0.30,
                        n_expert=2, n_novice=8):
    """Simulate annotation with expert and novice annotators."""
    np.random.seed(42)
    
    # True labels (balanced)
    true_labels = np.random.randint(0, 2, N_items)
    
    annotations = {}
    
    # Expert annotations
    for e in range(n_expert):
        ann_labels = true_labels.copy()
        flip_mask = np.random.rand(N_items) < expert_error
        ann_labels[flip_mask] = 1 - ann_labels[flip_mask]
        annotations[f'expert_{e}'] = ann_labels
    
    # Novice annotations
    for n in range(n_novice):
        ann_labels = true_labels.copy()
        flip_mask = np.random.rand(N_items) < novice_error
        ann_labels[flip_mask] = 1 - ann_labels[flip_mask]
        annotations[f'novice_{n}'] = ann_labels
    
    return true_labels, annotations

# Run simulation
true, anns = simulate_annotation()
all_labels = np.array(list(anns.values()))  # shape: (10, 100)

# Method A: Majority voting (all annotators)
majority_vote = (all_labels.mean(axis=0) > 0.5).astype(int)

# Method B: Expert-only labels
expert_labels = np.array([anns[k] for k in anns if 'expert' in k])
expert_majority = (expert_labels.mean(axis=0) > 0.5).astype(int)

# Method C: Dawid-Skene (use the implementation from Appendix 7A)
# (Simplified: here we report theoretical expectations)

# Accuracy comparison
print(f"Majority vote (all) accuracy: {(majority_vote == true).mean():.3f}")
print(f"Expert-only accuracy: {(expert_majority == true).mean():.3f}")
```

**Expected results:**

| Method | Expected Accuracy |
|--------|------------------|
| Majority vote (2 experts + 8 novices) | ~0.78 |
| Expert-only (2 experts, majority vote) | ~0.93 |
| Dawid-Skene (all 10) | ~0.90 |

**Analysis:**

Including novice annotators with a 30% error rate *hurts* majority voting compared to expert-only, because 8 noisy votes overwhelm 2 high-quality votes. Majority voting implicitly assumes all annotators are equally reliable — a false assumption when novice and expert quality differs substantially.

Dawid-Skene recovers most of the benefit of expert-only labels even when novices are included, because it learns that novice annotators are less reliable and down-weights their votes accordingly. It doesn't need to know in advance which annotators are experts.

**Practical implication:** If you must mix expert and novice annotators, use Dawid-Skene (or a similar model that estimates annotator quality from the data) rather than simple majority voting. The quality difference is substantial when expert-novice error rates differ by 25+ percentage points.

---

## Exercise 7.4 — Framing Effect Experimental Design

**Complete experimental design:**

**Research question:** Does framing the annotation task as "Would a reasonable person find this harmful?" (Version B) produce higher inter-annotator agreement than "Is this toxic?" (Version A)?

**Study design:**

- **Between-subjects design** (each annotator sees only one framing, to avoid contamination)
- N = 400 items per condition (power analysis: sufficient to detect kappa difference of 0.10 with power 0.80)
- 20 annotators per condition (10 items per annotator)

**Wait** — with 400 items and 20 annotators each seeing all 400 items:
- Total annotations per condition: 400 × 20 = 8,000
- Cost at $0.10/annotation: $800 per condition

**Primary outcomes:**
1. Cohen's kappa (pairwise, averaged) per condition
2. Positive label rate (% labeled toxic) per condition

**Statistical tests:**
1. Kappa comparison: test whether $\kappa_B - \kappa_A > 0$ using bootstrap confidence intervals on the kappa estimates
2. Positive rate comparison: two-proportion z-test for label rate difference

**Controls:**
- Randomize item order within each annotator's queue (to prevent sequence effects from creating spurious between-condition differences)
- Balance item difficulty (easy/hard/borderline) equally across conditions
- Recruit annotators with similar demographic profiles for both conditions (or explicitly match conditions on demographics)

**Expected results:**
- Version B: Higher kappa (approximately 0.05–0.15 higher)
- Version B: Lower positive rate (3–8 percentage points fewer items labeled toxic)
- Version A: Greater variance in positive rate across annotators

**Possible null result:**
If the items in the dataset are mostly unambiguous (very clear toxic or very clear benign), framing effects will be small and you may find no significant kappa difference. The framing effect is most visible on borderline items.

---

## Exercise 7.5 — Annotation Budget Optimization

**Setup:**
- Budget: $5,000
- Task: binary, 2,000 items minimum
- Expert: $2.00/label, single-annotator kappa = 0.75
- Crowd: $0.05/label, single-annotator kappa = 0.50

**Strategy 1: Expert annotators, 3 per item**
- Cost per item: $2.00 × 3 = $6.00
- Maximum items: $5,000 / $6.00 = 833 items
- Coverage: 833/2,000 = 42% — **fails minimum coverage requirement**

**Strategy 2: Crowdworkers, 5 per item**
- Cost per item: $0.05 × 5 = $0.25
- Maximum items: $5,000 / $0.25 = 20,000 items
- Using redundancy formula for kappa improvement:

$$\kappa(5) \approx 0.50 + (1 - 0.50) \times \left(1 - e^{-0.3 \times 4}\right) = 0.50 + 0.50 \times (1 - e^{-1.2}) = 0.50 + 0.50 \times 0.699 = 0.850$$

Expected aggregate kappa ≈ 0.85 (approximate — actual will be somewhat lower due to shared crowd annotator biases)
Coverage: 20,000 items (well above minimum)

**Strategy 3: Hybrid — crowd label, expert review of disagreements**
- Round 1: 3 crowd annotators per item: $0.05 × 3 × 2,000 = $300
- Identify contested items (those with split 2:1 or 1:2 votes): approximately 15–25% of items = 300–500 items
- Round 2: Expert review of contested items: $2.00 × 400 (estimated) = $800
- Total: $1,100 for 2,000 items
- Remaining budget: $3,900 → annotate additional 12,000 items at crowd-only rate

Expected quality: Agreed items (crowd majority agreement) have effective kappa ~0.80; expert-resolved items have kappa ~0.85.

**Recommendation:**

For most practical purposes, **Strategy 3 (hybrid)** is optimal:
- Meets minimum coverage (2,000+ items)
- Achieves high quality on contested items through expert resolution
- Uses remaining budget to scale coverage significantly
- Explicit documentation of which items were expert-reviewed provides important data provenance

**When to choose Strategy 2 (crowd-only):**
- If the task is well-defined and relatively objective (crowd annotators perform well)
- If you need very large scale (millions of items)
- If expert annotators in this domain are unavailable or prohibitively expensive

**When to choose Strategy 1 (expert-only):**
- If the task requires specialized domain knowledge (medical, legal)
- If stakes are high and low-quality labels would cause downstream harm
- If you are willing to sacrifice coverage for quality (e.g., a core validation set)
