---
jupytext:
  formats: md:myst
  text_representation:
    extension: .md
    format_name: myst
kernelspec:
  display_name: Python 3
  language: python
  name: python3
---

# Learning from Comparisons and Rankings

Asking humans to assign an absolute quality score to an output is hard. What is the numerical quality of this essay, on a scale from 1 to 10? The question is ill-posed: humans lack a stable internal scale, and their scores are heavily influenced by anchoring, context, and fatigue.

Asking humans to *compare* two outputs is much easier: which essay is better, A or B? Comparative judgments are more consistent, more reliable, and tap into human preferences more directly than absolute ratings. This chapter covers the mathematical foundations and practical applications of learning from comparisons and rankings.

---

## Why Comparisons Are Better Than Ratings

### Psychological Grounding

The superiority of comparative judgments has a long history in psychometrics. Thurstone's Law of Comparative Judgment {cite}`thurstone1927law` (1927) showed that even when humans have inconsistent absolute judgments, their relative judgments follow a consistent probabilistic law. Comparisons exploit the fact that humans are far better at *relative* perception than absolute calibration.

### Statistical Efficiency

Each pairwise comparison provides information about the *relative* positions of two items on the quality scale. With $K$ items, $K-1$ comparisons can rank all items; only $O(\log K)$ comparisons are needed to find the top item. Absolute ratings typically require more judgments to achieve the same precision.

### Scalability

For generative models, the number of distinct outputs is effectively infinite. Rating an output absolutely requires establishing a shared scale across all outputs; comparing outputs requires only local, relative judgments that are naturally calibrated to each other.

---

## The Bradley-Terry Model

The dominant probabilistic model for pairwise comparisons is the **Bradley-Terry (BT) model** {cite}`bradley1952rank`. Each item $i$ has a latent quality score $\alpha_i \in \mathbb{R}$. The probability that item $i$ is preferred to item $j$ in a direct comparison is:

$$
P(i \succ j) = \frac{e^{\alpha_i}}{e^{\alpha_i} + e^{\alpha_j}} = \sigma(\alpha_i - \alpha_j)
$$

where $\sigma$ is the logistic sigmoid. This is equivalent to assuming that the perceived quality of item $i$ is $\alpha_i + \epsilon$ where $\epsilon$ is a standard logistic noise term.

### Identifiability

The BT model is identifiable up to a translation: if $\alpha$ is a solution, so is $\alpha + c$ for any constant $c$. A standard convention is to fix one score (e.g., $\alpha_0 = 0$) or to constrain $\sum_i \alpha_i = 0$. The scores are only identified when the **comparison graph** (nodes = items, edges = observed pairs) is **connected** — if the graph has disconnected components, the relative scores across components are undefined.

### Parameter Estimation

Given a dataset of pairwise comparisons $\mathcal{D} = \{(i, j, y_{ij})\}$ where $y_{ij} = 1$ if $i$ was preferred to $j$, the log-likelihood is:

$$
\mathcal{L}(\alpha) = \sum_{(i, j, y_{ij}) \in \mathcal{D}} \left[ y_{ij} \log \sigma(\alpha_i - \alpha_j) + (1 - y_{ij}) \log \sigma(\alpha_j - \alpha_i) \right]
$$

This is a concave function of $\alpha$ and can be maximized via gradient ascent or Newton's method.

```{code-cell} python
import numpy as np
from scipy.optimize import minimize
from scipy.special import expit  # sigmoid

rng = np.random.default_rng(42)

# -----------------------------------------------
# Simulate Bradley-Terry: 8 items with true quality scores
# Generate pairwise comparisons and recover the scores
# -----------------------------------------------

N_ITEMS = 8
true_alpha = rng.normal(0, 1, N_ITEMS)
print(f"True quality ranking: {np.argsort(true_alpha)[::-1]}")

# Generate comparisons: every pair compared 5 times
comparisons = []
for i in range(N_ITEMS):
    for j in range(i + 1, N_ITEMS):
        for _ in range(5):
            p_i_wins = expit(true_alpha[i] - true_alpha[j])
            winner = i if rng.random() < p_i_wins else j
            loser  = j if winner == i else i
            comparisons.append((winner, loser))

print(f"Total comparisons: {len(comparisons)}")

def neg_log_likelihood(alpha, comparisons):
    """Bradley-Terry negative log-likelihood."""
    alpha = np.array(alpha)
    loss = 0.0
    for winner, loser in comparisons:
        log_prob = np.log(expit(alpha[winner] - alpha[loser]) + 1e-10)
        loss -= log_prob
    return loss

def neg_grad(alpha, comparisons):
    alpha = np.array(alpha)
    grad = np.zeros(len(alpha))
    for winner, loser in comparisons:
        p = expit(alpha[winner] - alpha[loser])
        grad[winner] -= (1 - p)
        grad[loser]  -= (-p)
    return grad

# Fix alpha[0] = 0 to resolve scale ambiguity
result = minimize(
    lambda a: neg_log_likelihood(np.concatenate([[0.0], a]), comparisons),
    x0=np.zeros(N_ITEMS - 1),
    jac=lambda a: neg_grad(np.concatenate([[0.0], a]), comparisons)[1:],
    method='L-BFGS-B'
)
est_alpha = np.concatenate([[0.0], result.x])

# Compare true vs estimated ranking
true_rank = np.argsort(true_alpha)[::-1]
est_rank  = np.argsort(est_alpha)[::-1]

print(f"\nTrue ranking (item indices): {true_rank}")
print(f"Estimated ranking:           {est_rank}")
rank_corr = np.corrcoef(true_alpha, est_alpha)[0, 1]
print(f"Correlation with true scores: {rank_corr:.4f}")
```

---

## Thurstone's Model

Thurstone's model {cite}`thurstone1927law` is closely related to Bradley-Terry but uses a Gaussian rather than logistic noise:

$$
P(i \succ j) = \Phi\left(\frac{\alpha_i - \alpha_j}{\sqrt{2}\sigma}\right)
$$

where $\Phi$ is the standard normal CDF. When $\sigma = 1/\sqrt{2}$, this becomes equivalent to BT with a minor scaling difference. In practice, the two models give nearly identical results.

---

## Rank Aggregation

When each annotator provides a complete ranking of $K$ items (rather than pairwise comparisons), the problem is **rank aggregation**: combine multiple ranked lists into a consensus ranking.

**Borda count:** Each item receives a score equal to the number of items ranked below it in each annotator's ranking. Scores are summed across annotators. Simple and robust.

**Kemeny–Young:** Find the ranking that minimizes the sum of pairwise disagreements (the Kendall tau distance) with each annotator's ranking. This is NP-hard for large $K$ but tractable for small sets.

**RankNet / ListNet:** Neural approaches that learn a scoring function from ranked lists, enabling generalization to unseen items.

---

## Dueling Bandits

In **online** preference learning, items arrive in a stream and we must decide which pairs to compare, balancing exploration (learning about unknown items) and exploitation (presenting high-quality items). This is the **dueling bandit** problem {cite}`yue2009interactively`.

Key algorithms:
- **Doubler:** Maintains a champion item; challenges it with random competitors
- **RUCB (Relative Upper Confidence Bound):** Computes UCB-style confidence intervals for each item's probability of beating each other item
- **MergeRank:** Combines tournament-style comparison with UCB

Dueling bandits are used in online recommendation systems (which article to show next, given implicit feedback) and interactive preference elicitation for RLHF data collection.

---

## Preference Learning for Language Models

In the context of RLHF (Chapter 6), the Bradley-Terry model is used to train the reward model. An important variant is **Direct Preference Optimization (DPO)** {cite}`rafailov2023direct`, which shows that the RLHF objective can be optimized directly from preference data without training a separate reward model:

$$
\mathcal{L}_\text{DPO}(\theta) = -\mathbb{E}_{(x, y_w, y_l) \sim \mathcal{D}} \left[ \log \sigma \left( \beta \log \frac{\pi_\theta(y_w \mid x)}{\pi_\text{ref}(y_w \mid x)} - \beta \log \frac{\pi_\theta(y_l \mid x)}{\pi_\text{ref}(y_l \mid x)} \right) \right]
$$

DPO is simpler than full RLHF (no PPO training loop, no reward model) while achieving comparable or better results on many benchmarks {cite}`rafailov2023direct`. It has become a widely adopted alternative to PPO-based RLHF for instruction-following fine-tuning, though both approaches remain in active use and their relative strengths are task-dependent.

---

## Collecting High-Quality Preference Data

The quality of preference data determines the quality of the reward model. Key considerations:

**Prompt diversity.** Preference data should cover the full distribution of prompts the model will encounter in deployment. Gaps in coverage lead to unreliable reward model behavior in those regions.

**Response diversity.** Comparing two very similar responses provides little information. The compared responses should differ enough for annotators to have a clear preference.

**Annotator agreement.** Low inter-annotator agreement suggests the comparison criteria are ambiguous. Measure agreement (Cohen's κ) and revise guidelines when it is below acceptable thresholds.

**Calibration.** Annotators should understand *why* one response is better: helpfulness, accuracy, safety, style? Tasks that bundle multiple criteria tend to produce inconsistent preferences. It is often better to collect preferences on each criterion separately.

```{seealso}
Bradley-Terry model: {cite}`bradley1952rank`. Thurstone: {cite}`thurstone1927law`. Dueling bandits: {cite}`yue2009interactively`. Direct Preference Optimization (DPO): {cite}`rafailov2023direct`.
```
