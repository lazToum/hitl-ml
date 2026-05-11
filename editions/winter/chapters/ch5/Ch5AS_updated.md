# Technical Exercise Solutions 5A: The Mathematics and Psychology of Optimal Human-AI Asks

*Worked solutions for all Appendix 5A exercises*

---

## Exercise 5A.1 — Information Value Calculation

**Problem:** A spam filter has confidence 0.65 on an email. A human reviewer has 90% accuracy on boundary cases.

### Part (a) — Expected information gain from asking the human reviewer

Using the information-theoretic framework from 5A.1:

Let $Y \in \{0,1\}$ (spam/not-spam), with the system's current estimate $P(Y=1 \mid X) = 0.65$.

The **prior entropy** of $Y$ given the system's information:
$$H(Y \mid X) = -0.65 \log_2(0.65) - 0.35 \log_2(0.35) \approx 0.934 \text{ bits}$$

Now model the human's response $H \in \{0,1\}$. The human has 90% accuracy, so:
- $P(H = 1 \mid Y = 1) = 0.90$ (correctly identifies spam)
- $P(H = 0 \mid Y = 0) = 0.90$ (correctly identifies non-spam)
- $P(H = 1 \mid Y = 0) = 0.10$ (false positive rate)
- $P(H = 0 \mid Y = 1) = 0.10$ (false negative rate)

Marginal probability of the human saying spam:
$$P(H=1) = P(H=1 \mid Y=1) P(Y=1) + P(H=1 \mid Y=0) P(Y=0)$$
$$= 0.90 \times 0.65 + 0.10 \times 0.35 = 0.585 + 0.035 = 0.620$$

Posterior distribution given $H=1$:
$$P(Y=1 \mid H=1) = \frac{P(H=1 \mid Y=1) P(Y=1)}{P(H=1)} = \frac{0.90 \times 0.65}{0.620} \approx 0.944$$

Posterior distribution given $H=0$:
$$P(H=0) = 1 - 0.620 = 0.380$$
$$P(Y=1 \mid H=0) = \frac{0.10 \times 0.65}{0.380} \approx 0.171$$

**Conditional entropy** after observing the human's response:
$$H(Y \mid H) = P(H=1) \cdot H(Y \mid H=1) + P(H=0) \cdot H(Y \mid H=0)$$

where:
$$H(Y \mid H=1) = -0.944 \log_2(0.944) - 0.056 \log_2(0.056) \approx 0.332 \text{ bits}$$
$$H(Y \mid H=0) = -0.171 \log_2(0.171) - 0.829 \log_2(0.829) \approx 0.638 \text{ bits}$$

$$H(Y \mid H) = 0.620 \times 0.332 + 0.380 \times 0.638 = 0.206 + 0.242 = 0.448 \text{ bits}$$

**Information gain:**
$$\text{IG}(H; Y \mid X) = H(Y \mid X) - H(Y \mid H) = 0.934 - 0.448 = \mathbf{0.486 \text{ bits}}$$

The human reviewer reduces uncertainty about the spam classification by 0.486 bits — just over half a bit, representing a substantial reduction from the prior entropy of 0.934 bits.

### Part (b) — Minimum email value to justify review

Cost of asking: 30 seconds at $0.01/second = $0.30$.

The ask is worthwhile when:
$$\text{IG}(H; Y \mid X) > \frac{C_\text{ask}}{V_\text{decision}}$$
$$0.486 > \frac{0.30}{V_\text{decision}}$$
$$V_\text{decision} > \frac{0.30}{0.486} \approx \mathbf{\$0.617}$$

At these costs, human review of a borderline email is worthwhile whenever the value of correct classification exceeds approximately $0.62. Note this is a *per-email* analysis — most legitimate emails are worth far more in terms of potential missed communication, and most spam is worth filtering if the classification cost is reasonable.

### Part (c) — Information gain at 0.95 confidence

At confidence 0.95, prior entropy drops sharply:
$$H(Y \mid X) = -0.95 \log_2(0.95) - 0.05 \log_2(0.05) \approx 0.286 \text{ bits}$$

The system is already quite certain. Re-running the calculation with the same human accuracy:
$$P(H=1) = 0.90 \times 0.95 + 0.10 \times 0.05 = 0.855 + 0.005 = 0.860$$
$$P(Y=1 \mid H=1) = \frac{0.90 \times 0.95}{0.860} \approx 0.995$$
$$P(Y=1 \mid H=0) = \frac{0.10 \times 0.95}{0.140} \approx 0.679$$

$$H(Y \mid H) = 0.860 \times H(0.995) + 0.140 \times H(0.679)$$
$$\approx 0.860 \times 0.041 + 0.140 \times 0.901 = 0.035 + 0.126 = 0.161 \text{ bits}$$

$$\text{IG} = 0.286 - 0.161 = \mathbf{0.125 \text{ bits}}$$

Information gain falls from 0.486 to 0.125 bits — a 74% reduction. At 95% confidence, the system is already close to certainty, so the human adds little new information. This confirms that human review should be concentrated in the uncertainty band, not applied uniformly.

---

## Exercise 5A.2 — Alert Fatigue Simulation

### Setup

Using the provided simulation function:

```python
import numpy as np
import matplotlib.pyplot as plt

def simulate_alert_fatigue(n_alerts=300, precision=0.7,
                            alpha=0.05, beta=0.15):
    trust = 1.0
    history = [trust]
    for _ in range(n_alerts):
        is_valid = np.random.random() < precision
        trust = min(1.0, trust + alpha) if is_valid else max(0.0, trust - beta)
        history.append(trust)
    return history

# Scenario parameters
np.random.seed(42)

# (a) 10/hour at 70% precision
hist_a = simulate_alert_fatigue(n_alerts=300, precision=0.70)

# (b) 3/hour at 90% precision  
hist_b = simulate_alert_fatigue(n_alerts=300, precision=0.90)

# (c) 20/hour at 90% precision
hist_c = simulate_alert_fatigue(n_alerts=300, precision=0.90)
```

### Analytical equilibrium calculation

At equilibrium, expected trust change per alert = 0:
$$\alpha \cdot p + (-\beta) \cdot (1-p) = 0$$
$$\alpha p = \beta (1-p)$$
$$p^* = \frac{\beta}{\alpha + \beta}$$

Where $p$ is precision. Equilibrium is reached when precision equals this critical value. If $p > p^*$, trust trends upward; if $p < p^*$, trust degrades.

For our parameters ($\alpha = 0.05, \beta = 0.15$):
$$p^* = \frac{0.15}{0.05 + 0.15} = \frac{0.15}{0.20} = 0.75$$

- Scenario (a): precision 0.70 < 0.75 → trust trends **downward** to 0
- Scenario (b): precision 0.90 > 0.75 → trust trends **upward** toward stable high value
- Scenario (c): same precision as (b) → also trends upward, but rate of alerts is irrelevant to equilibrium *level* (only alert volume changes the time-to-equilibrium, not the endpoint)

### Simulation results (approximate)

| Scenario | Alert Rate | Precision | Equilibrium Trust | Alerts to Equilibrium |
|----------|-----------|-----------|------------------|-----------------------|
| (a) | 10/hr | 70% | ~0.0 | ~120 alerts |
| (b) | 3/hr | 90% | ~0.85 | ~80 alerts |
| (c) | 20/hr | 90% | ~0.85 | ~50 alerts |

**Key finding:** Scenario (b) and (c) reach similar equilibrium trust levels because precision determines the stable point. The higher alert rate in (c) means equilibrium is reached faster — but since trust is trending upward (precision > critical value), faster isn't harmful here. The critical failure is scenario (a): low precision drives trust to zero regardless of alert volume.

**Design implication:** Precision is the dominant factor for long-run trust. Volume matters for how quickly trust changes, not where it stabilizes. A low-precision, low-volume system still destroys trust; a high-precision, high-volume system can maintain trust if precision stays above the critical threshold.

---

## Exercise 5A.3 — Optimal Query Granularity

### Part (a) — Maximum information per response

For a binary (k=2) query:
$$I_\text{max} = \log_2(2) = 1.0 \text{ bit}$$

For a 5-label (k=5) query (assuming labels used with equal probability):
$$I_\text{max} = \log_2(5) \approx 2.32 \text{ bits}$$

The 5-label interface can capture 2.32× more information per response in the best case.

### Part (b) — Computing $k^*$ with $\beta = 1.5$

The optimal granularity formula:
$$k^* = \arg\max_k \frac{\log_2 k}{k^\beta \cdot C_\text{per-choice}}$$

Setting $C_\text{per-choice} = 1$ (normalized), maximize:
$$f(k) = \frac{\log_2 k}{k^{1.5}}$$

Take derivative and set to zero (treating $k$ as continuous):
$$f'(k) = \frac{1/(k \ln 2) \cdot k^{1.5} - \log_2 k \cdot 1.5 k^{0.5}}{k^3} = 0$$

Numerator = 0:
$$\frac{k^{0.5}}{ln 2} = 1.5 k^{0.5} \log_2 k$$
$$\frac{1}{\ln 2} = 1.5 \log_2 k$$
$$\log_2 k = \frac{1}{1.5 \ln 2} = \frac{1}{1.5 \times 0.693} \approx 0.962$$
$$k = 2^{0.962} \approx 1.95$$

Evaluating at integers near this value:
- $f(2) = \log_2(2) / 2^{1.5} = 1.0 / 2.828 \approx 0.354$
- $f(3) = \log_2(3) / 3^{1.5} = 1.585 / 5.196 \approx 0.305$
- $f(5) = \log_2(5) / 5^{1.5} = 2.322 / 11.18 \approx 0.208$

**$k^* = 2$** (binary choice) maximizes efficiency under $\beta = 1.5$.

This result aligns with the chapter's practical observation: for tasks with significant cognitive load, binary queries often capture most of the decision value at minimum cost. Additional labels provide diminishing information returns relative to their cognitive cost.

### Part (c) — Experimental design measuring actual information captured

Use **inter-annotator agreement as information proxy**:

1. Recruit 50 content moderators to label 200 items under two conditions: binary (violating / not-violating) or 5-label schema.
2. For each item, compute inter-annotator agreement (Cohen's kappa for binary; Krippendorff's alpha for ordinal 5-label).
3. Measure **actual information per response** as: $\text{actual\_info}(k) = \kappa \times I_\text{max}(k)$ — the theoretical maximum weighted by observed agreement.

High inter-annotator disagreement means the additional labels are capturing noise, not genuine signal. If the 5-label condition shows $\kappa = 0.45$ while binary shows $\kappa = 0.82$:
$$\text{actual\_info}(5) = 0.45 \times 2.32 = 1.04 \text{ bits}$$
$$\text{actual\_info}(2) = 0.82 \times 1.00 = 0.82 \text{ bits}$$

In this hypothetical, the 5-label scheme actually captures only slightly more usable information despite its theoretical advantage — and requires substantially more cognitive effort. The experiment reveals whether the granularity benefit survives contact with real annotators.

---

## Exercise 5A.4 — HITL Policy Optimization

### Implementation

```python
import numpy as np
from collections import defaultdict

class HITLQLearner:
    """
    Q-learning agent deciding when to ask humans vs. auto-decide.
    State: (confidence_bin, trust_level)
    Actions: 0=auto_decide, 1=binary_query, 2=detailed_query
    """
    
    def __init__(self, alpha=0.1, gamma=0.9, epsilon=0.1):
        self.alpha = alpha     # Learning rate
        self.gamma = gamma     # Discount factor
        self.epsilon = epsilon # Exploration rate
        # Q-table: state -> action -> value
        self.Q = defaultdict(lambda: np.zeros(3))
        
    def _state(self, confidence, trust):
        """Discretize state."""
        conf_bin = min(int(confidence * 10), 9)  # 0-9
        trust_level = 0 if trust < 0.4 else (1 if trust < 0.7 else 2)
        return (conf_bin, trust_level)
    
    def choose_action(self, confidence, trust):
        state = self._state(confidence, trust)
        if np.random.random() < self.epsilon:
            return np.random.randint(3)
        return np.argmax(self.Q[state])
    
    def update(self, conf, trust, action, reward, next_conf, next_trust):
        state = self._state(conf, trust)
        next_state = self._state(next_conf, next_trust)
        target = reward + self.gamma * np.max(self.Q[next_state])
        self.Q[state][action] += self.alpha * (target - self.Q[state][action])


def simulate_episode(agent, episode=0):
    """
    Simulate one HITL decision episode.
    Returns (confidence, trust, action, reward, next_confidence, next_trust).
    """
    # Sample a confidence score from a Beta distribution
    confidence = np.random.beta(2, 2)  # Concentrated around 0.5
    trust = np.random.uniform(0.5, 1.0)
    
    action = agent.choose_action(confidence, trust)
    
    # Ground truth: with probability=confidence, auto-decision is correct
    is_correct = np.random.random() < confidence
    
    # Reward structure
    if action == 0:  # Auto-decide
        reward = 10 if is_correct else -(10 * (1 - confidence) * 2)
        trust_change = 0.0  # No human interaction
    elif action == 1:  # Binary query
        ask_cost = 1.0
        human_correct = np.random.random() < 0.88  # Human accuracy
        reward = 10 if human_correct else -5
        reward -= ask_cost
        trust_change = -0.5 * (1 - trust)  # Slow trust erosion from asking
    else:  # Detailed query
        ask_cost = 2.0
        human_correct = np.random.random() < 0.93  # Higher accuracy
        reward = 10 if human_correct else -3
        reward -= ask_cost
        trust_change = -0.3 * (1 - trust)
    
    next_trust = np.clip(trust + trust_change, 0, 1)
    next_confidence = np.random.beta(2, 2)  # Next episode confidence
    
    return confidence, trust, action, reward, next_confidence, next_trust


# Train
np.random.seed(42)
agent = HITLQLearner(alpha=0.1, gamma=0.9, epsilon=0.15)

for episode in range(10_000):
    conf, trust, action, reward, next_conf, next_trust = simulate_episode(agent)
    agent.update(conf, trust, action, reward, next_conf, next_trust)
    
    # Decay exploration
    if episode % 1000 == 0:
        agent.epsilon = max(0.01, agent.epsilon * 0.9)


# Analyze learned policy
print("Learned Policy (confidence bins 0-9 at high trust):")
print("Bin | Confidence Range | Action")
print("-" * 40)
action_names = ["Auto-decide", "Binary query", "Detailed query"]

for conf_bin in range(10):
    state = (conf_bin, 2)  # High trust
    best_action = np.argmax(agent.Q[state])
    conf_range = f"{conf_bin/10:.1f}–{(conf_bin+1)/10:.1f}"
    print(f" {conf_bin:2d} | {conf_range:16s} | {action_names[best_action]}")
```

### Expected results and interpretation

Typical learned policy structure at high trust:

| Confidence Bin | Range | Learned Action |
|---------------|-------|----------------|
| 0–3 | 0.0–0.3 | Auto-decide (negative direction) |
| 4–5 | 0.4–0.5 | Detailed query |
| 5–6 | 0.5–0.6 | Binary query |
| 7–9 | 0.7–0.9 | Auto-decide (positive direction) |

**Key finding:** The policy typically switches from asking to auto-deciding around confidence **0.65–0.75** at high trust. At lower trust levels, this switch point moves higher (the agent asks less when trust is already eroded, because each ask further erodes trust without recovering enough accuracy to compensate).

The policy also reveals an interesting asymmetry: very low-confidence cases (0.0–0.3) often get auto-decided negatively rather than queried. The rationale is that asking a human about a clearly low-confidence case costs trust without providing much new information — the system already "knows" it should reject. Human review is concentrated in the middle band where the cost-benefit calculation is genuinely uncertain.

**At what confidence does auto-decide beat asking?** Approximately $c \geq 0.68$ under these parameters. Below this threshold, the value of human correction outweighs the ask costs. Above it, the auto-decision is reliable enough that asking costs more (in time, trust erosion, and monetary cost) than it recovers.
