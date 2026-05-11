# Technical Appendix 5A: The Mathematics and Psychology of Optimal Human-AI Asks

*Formal foundations for intervention timing, frequency, and format design*

---

## Overview

Chapter 5 introduced three design levers for human-in-the-loop asks: timing, frequency, and format. This appendix provides mathematical frameworks for optimizing each, drawing on information theory, cognitive psychology, and reinforcement learning.

---

## 5A.1 Information-Theoretic Foundations of Ask Design

### 5A.1.1 Information Value of a Human Response

The value of asking a human is the expected reduction in uncertainty about the correct action. Let:
- $Y$ = the correct decision (unknown to the system)
- $H$ = the human's response
- $X$ = the system's current information

The **information gain** from asking is:

$$\text{IG}(H; Y \mid X) = H(Y \mid X) - H(Y \mid H, X)$$

where $H(\cdot)$ denotes entropy. A high information gain means the human's response substantially reduces uncertainty about the right action.

**Optimal ask criterion:** Ask a human when:

$$\text{IG}(H; Y \mid X) > \frac{C_\text{ask}}{V_\text{decision}}$$

where $C_\text{ask}$ is the cost (time, attention, trust) of the ask and $V_\text{decision}$ is the value of making the correct decision.

### 5A.1.2 Query Optimization

The **optimal query** $Q^*$ maximizes information gain subject to cognitive load constraints:

$$Q^* = \arg\max_{Q \in \mathcal{Q}} \text{IG}(H_Q; Y \mid X) - \lambda \cdot \text{CogLoad}(Q)$$

where $\text{CogLoad}(Q)$ is the cognitive effort required to answer query $Q$, and $\lambda$ is a cost-effort tradeoff parameter.

**Key insight:** A simpler query (lower cognitive load) is only preferable if its information loss is proportionally small. The 911 example illustrates this: the revised question had *lower* cognitive load and *higher* information gain simultaneously.

### 5A.1.3 Mutual Information and Human-AI Complementarity

The value of the full human-AI system depends on the *complementarity* between human and AI knowledge:

$$I(H_\text{human}; Y \mid H_\text{AI}, X) = H(Y \mid H_\text{AI}, X) - H(Y \mid H_\text{human}, H_\text{AI}, X)$$

This is the additional uncertainty reduction from the human, given the AI has already processed $X$. High complementarity means the human knows things the AI doesn't — this is when HITL is most valuable.

---

## 5A.2 Alert Fatigue: A Dynamic Model

### 5A.2.1 Trust as a State Variable

Let $\tau_t \in [0, 1]$ represent the human's trust in the system's alerts at time $t$. Trust evolves dynamically:

$$\tau_{t+1} = \tau_t + \alpha \cdot \mathbf{1}[\text{alert}_t \text{ was valid}] - \beta \cdot \mathbf{1}[\text{alert}_t \text{ was false}]$$

where $\alpha$ is the trust gain from a true alert and $\beta$ is the trust loss from a false alarm ($\beta > \alpha$ in most empirical settings — trust erodes faster than it builds).

**Effective alert value:**

$$V_\text{effective}(t) = \tau_t \cdot V_\text{intrinsic}$$

A system with $\tau_t \to 0$ produces alerts of near-zero effective value regardless of intrinsic importance.

### 5A.2.2 Precision-Fatigue Tradeoff

Define:
- $r$ = alert rate (alerts per hour)
- $p(r)$ = precision of alerts as a function of rate (decreasing in $r$)
- $\tau(r)$ = equilibrium trust as a function of rate (decreasing in $r$)
- $\rho$ = human response rate (function of $\tau$)

The effective information extracted per hour:

$$I_\text{effective}(r) = r \cdot p(r) \cdot \tau(r) \cdot \rho(\tau(r)) \cdot V_\text{per alert}$$

This function peaks at some optimal rate $r^*$ and decreases as $r$ increases beyond the point where precision and trust erosion dominate.

```python
import numpy as np
from scipy.optimize import minimize_scalar

def effective_information(r, precision_decay=0.1, trust_decay=0.05,
                           base_value=1.0):
    """Model of effective information extracted vs. alert rate."""
    # Precision decreases with alert rate
    precision = 1 / (1 + precision_decay * r)

    # Trust equilibrium decreases with false alarm rate
    false_alarm_rate = r * (1 - precision)
    trust = 1 / (1 + trust_decay * false_alarm_rate)

    # Response probability is function of trust
    response_prob = trust ** 0.5

    return r * precision * trust * response_prob * base_value

result = minimize_scalar(
    lambda r: -effective_information(r),
    bounds=(0.1, 100),
    method='bounded'
)
print(f"Optimal alert rate: {result.x:.2f} alerts/hour")
```

### 5A.2.3 Habituation and Recovery

A habituation model capturing faster degradation under consecutive alerts:

$$\tau_t = \tau_{\text{baseline}} \cdot e^{-\gamma \cdot n_\text{recent}}$$

where $n_\text{recent}$ is the number of alerts in the recent window. Recovery follows a slower exponential:

$$\tau_{t+T} = \tau_t + (1 - \tau_t) \cdot (1 - e^{-\delta T})$$

**Design implication:** Spacing alerts recovers attention; clustering alerts degrades it faster than average-rate models predict.

---

## 5A.3 Optimal Timing Models

### 5A.3.1 Attention Windows

Let $a(t) \in [0, 1]$ be the human's attention availability at time $t$. The **effective response quality** for an alert sent at time $t$ is:

$$Q_\text{response}(t) = Q_\text{max} \cdot a(t) \cdot \tau(t)$$

Optimal timing: $t^* = \arg\max_t Q_\text{response}(t)$.

**Attention models:**

*Task interrupt model:* Research by Bailey & Iqbal (2008) showed that interruption at natural task breakpoints produced 45% higher response quality than interruption mid-task.

*Contextual relevance model:* Alert relevance to current task increases effective attention. A fraud alert to someone actively shopping: $a \approx 0.9$. Same alert at 3 AM: $a \approx 0.2$.

### 5A.3.2 The Window of Relevance Problem

An alert sent too late loses the context needed to answer accurately. Let $\Delta t$ = time between the event and the alert. The **context availability** degrades:

$$C(\Delta t) = e^{-\kappa \Delta t}$$

for decay rate $\kappa$ depending on event type (financial transactions: fast decay; persistent content: slower decay).

Optimal alert delay balances context availability against attention window:

$$t^* = \arg\max_t a(t + t_\text{event}) \cdot C(t)$$

**Fraud alert implication:** Optimal timing is approximately $t^* \approx 0$ — immediately after the transaction — because financial context decays rapidly.

---

## 5A.4 Format Design: Cognitive Load and Response Accuracy

### 5A.4.1 Cognitive Load Model

Following Sweller's cognitive load theory, response accuracy for query complexity $c$ with available working memory $W$:

$$A(c, W) = \begin{cases} A_\text{max} & \text{if } c \leq W \\ A_\text{max} \cdot (W/c)^\alpha & \text{if } c > W \end{cases}$$

**Key result:** Beyond working memory capacity, every additional unit of complexity reduces accuracy as a power law.

### 5A.4.2 Optimal Query Granularity

A $k$-choice query captures $\log_2 k$ bits at $O(k)$ cognitive cost.

$$k^* = \arg\max_k \frac{\log_2 k}{k^\beta \cdot C_\text{per-choice}}$$

For most practical settings, $k^* \in [2, 5]$.

### 5A.4.3 Question Framing and Specificity

The 911 "personally" and "right now" example is a textbook framing effect. More specific, grounded questions activate episodic memory rather than general judgment and produce more accurate responses.

**Optimal fraud query components:**
1. Merchant name (activates episodic memory of the transaction)
2. Exact amount (distinguishes from similar transactions)
3. Time (eliminates ambiguity about which transaction)
4. Location (adds confirmatory context)

Each element reduces ambiguity and increases the probability that the human's response reflects genuine knowledge rather than a defaulted guess.

---

## 5A.5 Feedback Integration: Closing the Learning Loop

### 5A.5.1 Active Learning Formulation

Each human response to a HITL query is a labeled data point. The system should select queries to maximize expected model improvement:

$$Q^*_\text{next} = \arg\max_Q \mathbb{E}[\Delta \text{ModelPerf} \mid H_Q, \mathcal{D}_\text{current}]$$

Query cases near the decision boundary, in underrepresented categories, and where human and model systematically disagree (calibration needs).

### 5A.5.2 RL Formulation of the Full HITL Loop

The ask-learn loop formalized as an MDP:

**State** $s_t$: Model weights, human trust $\tau_t$, queue depth, context

**Action** $a_t$: Ask with query format $Q$, or act autonomously

**Reward**:
$$r_t = \Delta\text{Acc}(a_t) - C_\text{ask} \cdot \mathbf{1}[a_t = \text{ask}] - \lambda \cdot \Delta\tau_t$$

**Optimal policy** $\pi^*$ maximizes:
$$\mathbb{E}\left[\sum_t \gamma^t r_t\right]$$

This captures the essential tension: maximizing short-run accuracy (by asking often) degrades long-run trust and attention. The optimal policy trades these off.

---

## 5A.6 Exercises

**Exercise 5A.1 — Information Value Calculation**

A spam filter has confidence 0.65 on an email. A human reviewer has 90% accuracy on boundary cases.

(a) Calculate the expected information gain from asking the human reviewer.
(b) If the cost of asking is 30 seconds of reviewer time (valued at $0.01/second), at what minimum email value must human review be worthwhile?
(c) How does information gain change if filter confidence was 0.95?

**Exercise 5A.2 — Alert Fatigue Simulation**

Using the dynamic trust model from 5A.2:

```python
def simulate_alert_fatigue(n_alerts=300, precision=0.7,
                            alpha=0.05, beta=0.15):
    """
    Simulate trust dynamics under sustained alerting.
    Returns trust history.
    """
    trust = 1.0
    history = [trust]

    for _ in range(n_alerts):
        is_valid = np.random.random() < precision
        trust = min(1.0, trust + alpha) if is_valid else max(0.0, trust - beta)
        history.append(trust)

    return history
```

Simulate three scenarios: (a) 10/hour at 70% precision; (b) 3/hour at 90% precision; (c) 20/hour at 90% precision. Compare equilibrium trust levels. Which maintains trust best?

**Exercise 5A.3 — Optimal Query Granularity**

For a content moderation interface with 5 labels vs. 2 labels:

(a) Calculate maximum information per response for each.
(b) Assuming $\beta = 1.5$ in the granularity formula, compute $k^*$.
(c) Design an experiment measuring actual information captured (using inter-annotator agreement as a proxy).

**Exercise 5A.4 — HITL Policy Optimization**

Implement a Q-learning agent learning when to ask:

- State: confidence (binned 0–10), trust (high/medium/low)
- Actions: auto-decide, binary query, detailed query
- Reward: +10 correct, -1 ask cost, -0.5×(1-trust) incorrect auto-decision

Simulate 10,000 episodes. At what confidence level does the optimal policy switch from asking to auto-deciding?

---

## 5A.7 Recommended Reading

### Alert Design and Cognitive Load
- Sweller, J., van Merrienboer, J. J. G., & Paas, F. G. W. C. (1998). Cognitive architecture and instructional design. *Educational Psychology Review*, 10, 251–296.
- Bailey, B. P., & Iqbal, S. T. (2008). Understanding changes in mental workload during execution of goal-directed tasks. *ACM Transactions on Computer-Human Interaction*, 14(4).

### Alert Fatigue Research
- Ancker, J. S., et al. (2017). Effects of workload, work complexity, and repeated alerts on alert fatigue. *BMC Medical Informatics and Decision Making*, 17(1), 36.

### Question Framing
- Schwarz, N. (1999). Self-reports: How the questions shape the answers. *American Psychologist*, 54(2), 93–105.
- Tourangeau, R., Rips, L. J., & Rasinski, K. (2000). *The Psychology of Survey Response*. Cambridge University Press.

### Active Learning
- Settles, B. (2012). *Active Learning*. Morgan & Claypool.
- Amershi, S., et al. (2014). Power to the people: The role of humans in interactive machine learning. *AI Magazine*, 35(4), 105–120.

### HITL Reinforcement Learning
- Christiano, P., et al. (2017). Deep reinforcement learning from human preferences. *NeurIPS*.
- Ziegler, D. M., et al. (2019). Fine-tuning language models from human feedback. *arXiv:1909.08593*.
