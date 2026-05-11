# Technical Appendix 6A: Interface Design for Human-in-the-Loop Systems

*Formal frameworks and implementation patterns for cognitive-load-aware HITL interfaces*

---

## 1. Cognitive Load Theory and Interface Design

### 1.1 The Three-Component Model

Cognitive Load Theory (Sweller, 1988; Paas & van Merriënboer, 1994) identifies three components of cognitive load relevant to HITL interface design:

**Intrinsic Load**: The inherent complexity of the decision task itself.

$$IL = f(\text{task complexity},\; \text{element interactivity})$$

**Extraneous Load**: Cognitive overhead imposed by interface design that does not contribute to the decision.

$$EL = f(\text{navigation steps},\; \text{visual noise},\; \text{context switches})$$

**Germane Load**: Cognitive effort directed toward actual schema formation and judgment.

$$GL = \text{Total Working Memory} - IL - EL$$

The design goal for HITL interfaces is to minimize extraneous load, so germane load can be maximized within the human's working memory limits.

**Practical implication for annotation tools:**

If total working memory capacity is approximately 7 ± 2 chunks (Miller, 1956), and a review task intrinsically requires 4–5 chunks of working memory (holding the item, the relevant criteria, and their interaction), then extraneous load must be held to 2–3 chunks or less. Every unnecessary menu layer, every redundant click, every context switch consumes a chunk that could otherwise support judgment quality.

### 1.2 Formalizing the Annotation Click Problem

Let $T$ be total annotation session time, $N$ be the number of items to review, and define:

- $t_j$ = time on genuine judgment per item
- $t_m$ = time on interface mechanics per item (clicks, navigation, confirmation dialogs)
- $q_0$ = baseline judgment quality (early session)
- $\delta(t_m)$ = quality degradation function as a function of accumulated mechanical overhead

Then:

$$\text{Session Quality} = q_0 - \int_0^N \delta(t_m \cdot n)\; dn$$

The key insight is that $\delta$ is nonlinear and accelerates after approximately 150–200 items in most empirical studies. Reducing $t_m$ shifts the inflection point of quality degradation substantially to the right.

**Benchmark targets** derived from Appen (2020) and Labelbox (2022) production data:

| Interface Design | Avg. $t_m$ per item | Session kappa at item 400 |
|-----------------|---------------------|--------------------------|
| Legacy (menu-based) | 14 sec | 0.61 |
| Optimized (keyboard shortcuts) | 5 sec | 0.79 |
| Optimal (single-action annotation) | 2 sec | 0.84 |

---

## 2. Automation Bias: Formal Model

### 2.1 The Anchor-Adjustment Framework

Automation bias can be modeled as an anchoring process (Tversky & Kahneman, 1974). When a human reviewer $h$ is shown an AI recommendation $r_{AI}$ before forming their independent judgment:

$$r_h = r_{AI} + \alpha \cdot (r_{\text{independent}} - r_{AI})$$

where $\alpha \in [0, 1]$ is the adjustment coefficient. When $\alpha = 1$, the human makes a fully independent judgment. When $\alpha = 0$, the human simply adopts the AI recommendation. Empirical studies in radiology consistently find $\alpha \in [0.3, 0.7]$ depending on fatigue level, AI confidence display, and domain expertise.

The adjustment coefficient degrades with:

$$\alpha(t, f, c) = \alpha_0 \cdot e^{-\lambda_f f} \cdot e^{-\lambda_c c}$$

where $f$ is fatigue (hours of session elapsed), $c$ is confidence of AI display (higher AI confidence shown → lower $\alpha$), and $\lambda_f, \lambda_c$ are empirically estimated decay constants.

### 2.2 Interface Interventions That Increase $\alpha$

**Pre-commitment approach:** Require the human to record their initial assessment before revealing the AI recommendation.

$$\alpha_{\text{pre-commit}} \approx 1.0 \quad \text{(by construction)}$$

Subsequent comparison with AI recommendation then functions as a second-opinion check rather than an anchor. The Israeli Air Force study (Mosier & Skitka, 1996) found this intervention brought measured $\alpha$ to 0.92 under conditions where the standard interface produced $\alpha = 0.41$.

**Uncertainty-dependent display:** Show AI recommendation only when AI uncertainty exceeds a threshold $\tau_U$:

$$\text{Display}_{AI} = \begin{cases} \text{Show confidence + region} & \text{if } U_{AI} > \tau_U \\ \text{Hide recommendation} & \text{if } U_{AI} \leq \tau_U \end{cases}$$

This reserves AI display for cases where it adds the most information, reducing the frequency of the anchoring stimulus.

**Disagree-facilitation:** Reduce the UI cost of disagreement. If $C_{\text{agree}}$ = 1 click and $C_{\text{disagree}}$ = $k$ clicks, then:

$$P(\text{disagree}) \propto \frac{1}{k}$$

Setting $k = 1$ (one-click disagreement, same cost as agreement) significantly increases the rate of independent overrides when they are warranted.

---

## 3. Explainability Output Quality Metrics

### 3.1 Faithfulness and Stability

An explanation method $E$ that maps model $f$ and input $x$ to a feature importance vector is evaluated on two key dimensions:

**Faithfulness**: Does the explanation accurately reflect what the model is doing?

$$\text{Faithfulness}(E, f, x) = \text{corr}\bigl(\Delta f(x, \text{mask}),\; E(f, x)\bigr)$$

where $\Delta f(x, \text{mask})$ measures the actual change in model output when features are masked according to the importance ranking.

**Stability**: Do similar inputs produce similar explanations?

$$\text{Stability}(E, f, x) = 1 - \mathbb{E}_{\epsilon}\bigl[\|E(f, x + \epsilon) - E(f, x)\|_2\bigr]$$

where $\epsilon$ is small perturbation. LIME explanations have measured stability scores of approximately 0.4–0.6; SHAP stability scores are typically 0.7–0.85 for the same models.

### 3.2 Human Interpretability Metric

Explanation utility is not just about faithfulness to the model — it must also be comprehensible to the human receiver. Define:

$$\text{Utility}(E, h) = P(\text{correct override} \mid E \text{ shown to } h) - P(\text{correct override} \mid E \text{ not shown to } h)$$

A positive utility means the explanation helps the human catch model errors. A negative utility — which is observed in several empirical studies — means the explanation is actively leading the human astray (for example, by making a flawed model look trustworthy).

Empirical ranges from medical imaging studies (2019–2023):

| Explanation Type | Human Utility (mean) |
|-----------------|----------------------|
| Probability score only | −0.04 |
| Probability + highlighted region | +0.12 |
| Probability + region + plain-language rationale | +0.21 |
| Full SHAP feature plot (no training) | −0.07 |

The plain-language rationale condition consistently outperforms pure visualization, suggesting that natural language anchors human interpretation more effectively than visual overlays alone.

---

## 4. Interface Sequence Models

### 4.1 Information Ordering and Decision Quality

Let the decision process be modeled as a Bayesian belief update. The human reviewer starts with a prior belief $P(y)$ about the item's true label and updates it based on evidence:

$$P(y \mid E_{\text{human}}, E_{\text{AI}}) = \frac{P(E_{\text{human}}, E_{\text{AI}} \mid y) \cdot P(y)}{P(E_{\text{human}}, E_{\text{AI}})}$$

Under ideal Bayesian updating, the order of evidence presentation does not matter — the posterior is the same regardless of whether human evidence $E_{\text{human}}$ or AI evidence $E_{\text{AI}}$ is encountered first.

Humans are not ideal Bayesian updaters. Empirically, the ordering effect can be substantial. Define:

$$\Delta_{\text{order}} = P(\text{correct} \mid \text{Human-first}) - P(\text{correct} \mid \text{AI-first})$$

Studies in radiology and legal document review find $\Delta_{\text{order}}$ values of 0.05–0.15 in favor of human-first sequencing, particularly when the AI's recommendation is wrong.

The mechanism: when the AI recommendation arrives first, it sets an anchor ($\alpha < 1$). When the human's own judgment arrives first, it becomes the anchor, and the AI functions as a check rather than a cue.

### 4.2 Optimal Interface Sequencing Algorithm

```
PROCEDURE OptimalReviewSequence(item, AI_model, human_reviewer):

    // Phase 1: Establish human prior (independent)
    initial_judgment = human_reviewer.assess(item)
    record(initial_judgment, timestamp=now)

    // Phase 2: Compute AI recommendation
    ai_prediction, ai_confidence, ai_explanation = AI_model.predict(item)

    // Phase 3: Conditional display based on uncertainty
    IF ai_confidence < HIGH_CONFIDENCE_THRESHOLD:
        show_to_human(ai_prediction, ai_confidence, ai_explanation)
        final_judgment = human_reviewer.review(
            item,
            own_judgment=initial_judgment,
            ai_input=ai_prediction
        )
    ELSE:
        // AI is highly confident: log agreement without burdening reviewer
        IF initial_judgment == ai_prediction:
            final_judgment = initial_judgment
            log(agreement=True, reviewed=False)
        ELSE:
            // Disagreement on high-confidence case: escalate
            final_judgment = escalate_to_senior_reviewer(item)

    record(final_judgment, ai_prediction, ai_confidence)
    RETURN final_judgment
```

---

## 5. Attention Map Quality Assessment (Medical Imaging Context)

### 5.1 Grad-CAM Formal Definition

For a convolutional neural network with class activation weights $\alpha_k^c$ for class $c$ and feature map activations $A^k$:

$$L_{\text{Grad-CAM}}^c = \text{ReLU}\!\Bigl(\sum_k \alpha_k^c A^k\Bigr)$$

where:

$$\alpha_k^c = \frac{1}{Z} \sum_i \sum_j \frac{\partial y^c}{\partial A_{ij}^k}$$

This produces a coarse heatmap indicating which spatial regions most influenced class $c$'s prediction score.

### 5.2 Radiologist Utility of Grad-CAM

Grad-CAM is useful to radiologists when:

1. **Localization is correct**: The highlighted region overlaps with a true pathology region. Intersection-over-union (IoU) between Grad-CAM highlight and ground-truth annotation should exceed 0.5.

2. **Highlight is not dominated by artifacts**: The proportion of attention mass on non-anatomical image features (scanner labels, borders, artifacts) should be below 5%.

3. **Uncertainty is not masked**: A high-confidence prediction with a diffuse, low-magnitude Grad-CAM should be treated differently from a high-confidence prediction with a tight, high-magnitude Grad-CAM. Some interfaces flatten both to the same visual representation.

**Implementation check:**

```python
def assess_gradcam_quality(gradcam_map, ground_truth_mask, artifact_mask):
    # Localization quality
    intersection = np.logical_and(gradcam_map > 0.5, ground_truth_mask)
    union = np.logical_or(gradcam_map > 0.5, ground_truth_mask)
    iou = intersection.sum() / union.sum()

    # Artifact contamination
    artifact_attention = (gradcam_map * artifact_mask).sum()
    total_attention = gradcam_map.sum()
    artifact_fraction = artifact_attention / total_attention

    # Concentration (sharpness)
    entropy = -np.sum(gradcam_map * np.log(gradcam_map + 1e-8))

    return {
        'localization_iou': iou,
        'artifact_fraction': artifact_fraction,
        'attention_entropy': entropy,  # lower = more concentrated
        'display_recommended': iou > 0.5 and artifact_fraction < 0.05
    }
```

---

## 6. The Review Queue as a Cognitive System

### 6.1 Queue Design and Cognitive Fatigue

Define reviewer quality $q(n)$ as a function of items reviewed $n$:

$$q(n) = q_0 \cdot e^{-\lambda_q n} + q_{\text{floor}}$$

where $q_0$ is initial quality, $q_{\text{floor}}$ is a floor (quality does not go to zero), and $\lambda_q$ is a fatigue decay constant empirically estimated at 0.003–0.008 per item in most annotation studies.

**Break scheduling to maintain quality above threshold $q_{\min}$:**

$$n_{\text{break}} = \frac{1}{\lambda_q} \ln\!\left(\frac{q_0 - q_{\text{floor}}}{q_{\min} - q_{\text{floor}}}\right)$$

For $q_0 = 1.0$, $q_{\text{floor}} = 0.7$, $q_{\min} = 0.85$, $\lambda_q = 0.005$:

$$n_{\text{break}} = \frac{1}{0.005} \ln\!\left(\frac{0.3}{0.15}\right) = 200 \cdot \ln(2) \approx 139 \text{ items}$$

Implication: for high-stakes annotation, breaks should be enforced approximately every 140 items.

### 6.2 Priority Routing in Review Queues

Not all items should have equal priority in a review queue. A simple priority score:

$$\text{Priority}(x) = w_1 \cdot U_{\text{model}}(x) + w_2 \cdot S(x) + w_3 \cdot T(x)$$

where:
- $U_{\text{model}}(x)$ = model uncertainty for item $x$
- $S(x)$ = estimated stakes of a wrong decision for item $x$
- $T(x)$ = time pressure (how old is this item in the queue)
- $w_1, w_2, w_3$ = weighting parameters

High priority items (high uncertainty × high stakes × time pressure) should surface to the top of the queue and be routed to the most experienced reviewers.

---

## 7. Exercises

### Exercise 6.1 — Interface Audit

Take any annotation tool or AI-assisted review interface you have access to. Count the number of clicks required to (a) confirm the AI's recommendation, (b) override the AI's recommendation, and (c) escalate to senior review. Calculate $k_{\text{disagree}} / k_{\text{agree}}$. What does this ratio tell you about the interface's implicit assumption about how often the human should disagree?

### Exercise 6.2 — Automation Bias Measurement

Design a controlled experiment to measure the automation bias coefficient $\alpha$ for a specific review task. What condition defines the "AI-first" group? What defines the "Human-first" group? What defines the "AI absent" control? How would you estimate $\alpha$ from the results?

### Exercise 6.3 — Explanation Utility

Implement a simple binary classifier. For 50 test cases, have three evaluators assess each case: (a) without any explanation, (b) with a LIME explanation, and (c) with a SHAP explanation. Calculate Human Utility for each explanation type. Which performs best? Are there systematic differences based on case difficulty?

### Exercise 6.4 — Cognitive Load Reduction

Choose a multi-step annotation task (at least 5 clicks per item required). Redesign the interface to reduce clicks per item to 2 or fewer while maintaining all necessary data capture. Prototype the redesign and estimate the expected change in annotation throughput and quality.

### Exercise 6.5 — Priority Queue Design

A content moderation queue contains 10,000 items. You have 5 reviewers and 8 hours. Design a priority routing system using the $\text{Priority}(x)$ formula above. How do you estimate $U_{\text{model}}(x)$ and $S(x)$ in practice? How do you choose $w_1, w_2, w_3$? What assumptions does your design make about reviewer quality at different times of day?

---

## References

- Sweller, J. (1988). Cognitive load during problem solving. *Cognitive Science*, 12(2), 257–285.
- Tversky, A., & Kahneman, D. (1974). Judgment under uncertainty: Heuristics and biases. *Science*, 185(4157), 1124–1131.
- Parasuraman, R., & Manzey, D. H. (2010). Complacency and bias in human use of automation. *Human Factors*, 52(3), 381–410.
- Ribeiro, M. T., Singh, S., & Guestrin, C. (2016). "Why should I trust you?" *KDD 2016*.
- Lundberg, S. M., & Lee, S. I. (2017). A unified approach to interpreting model predictions. *NIPS 2017*.
- Selvaraju, R. R., et al. (2017). Grad-CAM: Visual explanations from deep networks. *ICCV 2017*.
- Mosier, K. L., & Skitka, L. J. (1996). Human decision makers and automated decision aids: Made for each other? In *Automation and Human Performance*. Erlbaum.
- Miller, G. A. (1956). The magical number seven, plus or minus two. *Psychological Review*, 63(2), 81–97.
