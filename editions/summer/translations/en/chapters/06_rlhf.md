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

# Reinforcement Learning from Human Feedback

No technique has done more to bring HITL ML into the mainstream than Reinforcement Learning from Human Feedback (RLHF). It is the mechanism behind InstructGPT {cite}`ouyang2022training` and a core component of instruction-following pipelines in many modern large language models {cite}`stiennon2020learning`. Understanding RLHF — not just as a recipe to follow, but as a principled approach to alignment — is essential for anyone working in modern AI.

---

## The Alignment Problem

Large language models (LLMs) trained purely on next-token prediction optimize for a proxy objective: predict what text comes next in a corpus of human-written text. This objective is related to, but distinct from, what we actually want: responses that are helpful, accurate, safe, and aligned with human values.

The mismatch between the training objective and the desired behavior is called the **alignment problem** {cite}`russell2019human`. Concretely, a language model trained on internet text learns to:
- Produce plausible-sounding continuations (which may be factually wrong)
- Reflect the biases and harms present in training data
- Be evasive or manipulative when this is what follows the prompt statistically

RLHF addresses alignment by making human preferences *part of the optimization objective*.

---

## The RLHF Pipeline

RLHF proceeds in three stages:

```text
Stage 1: Supervised Fine-Tuning (SFT)
  --> Collect demonstration data (human writes ideal responses)
  --> Fine-tune base LLM on demonstrations

Stage 2: Reward Model Training
  --> Collect pairwise preferences (human rates A vs B)
  --> Train reward model R(x, y) to predict human preferences

Stage 3: RL Fine-Tuning
  --> Fine-tune LLM using PPO/RL to maximize R(x, y)
  --> KL penalty prevents excessive deviation from SFT model
```

### Stage 1: Supervised Fine-Tuning

Starting from a pre-trained base model $\pi_0$, we collect a dataset of (prompt, ideal response) pairs, written or selected by human contractors who follow detailed guidelines. The model is fine-tuned on these demonstrations using standard cross-entropy:

$$
\mathcal{L}_\text{SFT}(\theta) = -\mathbb{E}_{(x, y) \sim \mathcal{D}_\text{demo}} \left[ \log \pi_\theta(y \mid x) \right]
$$

The SFT model $\pi_\text{SFT}$ is a much better starting point for RLHF than the raw pre-trained model.

### Stage 2: Reward Model Training

For a set of prompts $\{x_i\}$, we generate $K$ responses per prompt using $\pi_\text{SFT}$ and present them to human labelers as pairwise comparisons: "Which response is better, A or B?"

The reward model $r_\phi$ is trained to predict these preferences. Under the **Bradley-Terry** model (Chapter 8), the probability that response $y_w$ is preferred to $y_l$ is:

$$
P(y_w \succ y_l \mid x) = \sigma\left(r_\phi(x, y_w) - r_\phi(x, y_l)\right)
$$

The reward model is trained to minimize the pairwise ranking loss:

$$
\mathcal{L}_\text{RM}(\phi) = -\mathbb{E}_{(x, y_w, y_l) \sim \mathcal{D}_\text{pref}} \left[ \log \sigma\left(r_\phi(x, y_w) - r_\phi(x, y_l)\right) \right]
$$

The reward model is typically initialized from the SFT model with a scalar head replacing the final layer.

### Stage 3: RL Fine-Tuning with PPO

With a trained reward model, we can use reinforcement learning to fine-tune the LLM. Each prompt $x$ is a state; each response $y$ is a trajectory of token choices; and the reward is $r_\phi(x, y)$.

The optimization objective includes a **KL divergence penalty** to prevent the model from drifting too far from the SFT baseline (which would lead to reward hacking {cite}`krakovna2020specification,gao2023scaling`):

$$
\max_\theta \mathbb{E}_{x \sim \mathcal{D}, y \sim \pi_\theta(\cdot | x)} \left[ r_\phi(x, y) - \beta \cdot \text{KL}\left[\pi_\theta(\cdot \mid x) \| \pi_\text{SFT}(\cdot \mid x)\right] \right]
$$

The $\beta$ parameter controls the KL penalty strength. Small $\beta$ allows more optimization but risks reward hacking; large $\beta$ keeps the model close to SFT but limits alignment gains.

**Proximal Policy Optimization (PPO)** {cite}`schulman2017proximal` is the standard algorithm for this stage, chosen for its stability relative to raw policy gradient methods.

---

## A Simplified RLHF Demonstration

The full RLHF pipeline requires large-scale infrastructure. The following example demonstrates the key ideas at small scale.

```{code-cell} python
import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
from torch.nn import functional as F

torch.manual_seed(42)
rng = np.random.default_rng(42)

# -----------------------------------------------
# Toy setup: responses are 4-dimensional vectors
# "Quality" is known analytically (sum of positive values)
# We simulate a reward model learning this from pairwise feedback
# -----------------------------------------------

class RewardModel(nn.Module):
    def __init__(self, d=4, hidden=32):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(d, hidden), nn.ReLU(),
            nn.Linear(hidden, hidden), nn.ReLU(),
            nn.Linear(hidden, 1)
        )
    def forward(self, x):
        return self.net(x).squeeze(-1)

def true_quality(x):
    """The hidden ground-truth reward function."""
    return x.sum(dim=-1) + 0.5 * (x ** 2).mean(dim=-1)

# Generate pairwise preference data
N_PAIRS = 500
X1 = torch.randn(N_PAIRS, 4)
X2 = torch.randn(N_PAIRS, 4)
q1, q2 = true_quality(X1), true_quality(X2)
# Human prefers X1 when q1 > q2 (with some noise)
noise = torch.randn(N_PAIRS) * 0.5
preferred_1 = ((q1 - q2 + noise) > 0).float()

# Train reward model
rm = RewardModel(d=4, hidden=32)
optimizer = optim.Adam(rm.parameters(), lr=3e-3)

losses = []
for epoch in range(200):
    r1 = rm(X1)
    r2 = rm(X2)
    # Bradley-Terry loss
    logit = r1 - r2
    loss = F.binary_cross_entropy_with_logits(logit, preferred_1)
    optimizer.zero_grad(); loss.backward(); optimizer.step()
    losses.append(loss.item())

# Evaluate: does the reward model agree with true quality?
X_eval = torch.randn(1000, 4)
with torch.no_grad():
    r_pred = rm(X_eval).numpy()
    r_true = true_quality(X_eval).numpy()

corr = np.corrcoef(r_pred, r_true)[0, 1]
print(f"Reward model correlation with true quality: {corr:.4f}")
print(f"Final training loss: {losses[-1]:.4f}")

import matplotlib.pyplot as plt
plt.figure(figsize=(8, 3))
plt.subplot(1, 2, 1)
plt.plot(losses, color='#2b3a8f', linewidth=1.5)
plt.xlabel("Epoch"); plt.ylabel("Pairwise loss")
plt.title("Reward Model Training")

plt.subplot(1, 2, 2)
plt.scatter(r_true[:200], r_pred[:200], alpha=0.4, s=15, color='#2b3a8f')
plt.xlabel("True quality"); plt.ylabel("Predicted reward")
plt.title(f"Reward Model vs. Truth (r={corr:.3f})")
plt.tight_layout()
plt.savefig('reward_model.png', dpi=150)
plt.show()
```

---

## Challenges in RLHF

### Reward Hacking

A key failure mode: the policy finds ways to get high reward from the reward model that do not correspond to genuinely good behavior. For example, an LLM might learn to produce responses that are flattering or confidently worded (which labelers tend to rate highly) rather than accurate.

Reward hacking is more likely when:
- The reward model is trained on insufficient preference data
- The policy is allowed to diverge far from the SFT baseline (small $\beta$)
- The reward model distribution shifts during PPO training

**Mitigation strategies:** KL penalty, iterated reward model training, diverse evaluation, constitutional AI constraints.

### Evaluator Bias

Human labelers have systematic biases. They tend to prefer longer responses (verbosity bias), more confident-sounding text (confidence bias), and responses that agree with their prior beliefs. These biases propagate into the reward model.

The famous sycophancy failure of RLHF models — where the model tells users what they want to hear rather than what is true — is partly a result of evaluator preference for agreeable responses.

### Scalable Oversight

For complex tasks, humans cannot reliably judge which AI response is correct. A labeler comparing two long mathematical proofs or two code implementations may simply pick the more readable one, regardless of correctness. **Scalable oversight** is the open research problem of designing evaluation procedures that remain reliable as task complexity grows {cite}`bowman2022measuring`.

---

## Constitutional AI (RLAIF)

**Constitutional AI** {cite}`bai2022constitutional`, developed at Anthropic, reduces reliance on human labelers by using the AI itself to generate preference labels guided by a set of principles (a "constitution"). The process:

1. Generate responses to potentially harmful prompts
2. Use an AI critic to evaluate responses against constitutional principles
3. Revise responses guided by AI feedback (RLAIF — RL from AI Feedback)
4. Train a reward model on AI-generated preferences
5. Fine-tune with RLHF using this reward model

RLAIF can generate preference data at a far larger scale than human labeling, and allows fine-grained control over the values encoded in the reward model.

```{seealso}
The original InstructGPT paper {cite}`ouyang2022training` describes the first large-scale application of RLHF to LLMs. The foundational RLHF for deep RL work is {cite}`christiano2017deep`. PPO is described in {cite}`schulman2017proximal`. Constitutional AI is from {cite}`bai2022constitutional`.
```
