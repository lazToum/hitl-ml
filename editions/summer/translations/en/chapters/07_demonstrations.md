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

# Learning from Demonstrations

When a task is difficult to specify but easy to demonstrate, it can be more efficient to teach by example than to define by rule. A human expert shows a robotic arm how to grasp an object; a programmer's interaction with their IDE provides a sequence of correct edits; a chess grandmaster plays a game. **Learning from demonstrations** extracts a policy from such behavioral data, avoiding the need for hand-crafted reward functions or explicit task specifications.

---

## Behavioral Cloning

The simplest approach is **behavioral cloning (BC)**: treat the demonstration as supervised data and learn a mapping from states to actions.

Given a dataset of state-action pairs $\mathcal{D} = \{(s_i, a_i)\}$ from an expert demonstrator, we fit a policy $\pi_\theta(a \mid s)$ by minimizing the negative log-likelihood:

$$
\mathcal{L}_\text{BC}(\theta) = -\frac{1}{|\mathcal{D}|} \sum_{(s, a) \in \mathcal{D}} \log \pi_\theta(a \mid s)
$$

This is precisely standard supervised learning applied to sequential data.

### The Covariate Shift Problem

BC has a fundamental weakness: **distribution shift** between training and deployment. The expert's demonstrations cover states visited by the expert. But during deployment, the learned policy may make slightly different decisions, leading it to states the expert never visited — states where the policy has no supervision and may fail badly.

Crucially, errors **compound**: a small deviation leads to an unfamiliar state, where a slightly wrong action leads to an even more unfamiliar state, and so on. Performance degrades as $O(T^2 \epsilon)$ where $T$ is the episode length and $\epsilon$ is the error rate at each step — much worse than the $O(T\epsilon)$ degradation of an oracle policy {cite}`ross2010efficient`.

```{admonition} Example: Autonomous Driving
:class: note

A behavioral cloning model for lane-keeping trained on human driving data performs well on straight roads (states near the training distribution). But the moment it drifts slightly — a state no human driver would be in because they would have already corrected — it has no data to guide it and may drive off the road.
```

```text
Algorithm DAgger:
  Initialize: D <- {} (empty dataset)
  Train initial policy pi_1 on M expert demonstrations

  for iteration i = 1, 2, ..., N:
    1. Run pi_i in the environment to collect states {s_1, ..., s_t}
    2. Query expert for actions on each visited state: a_t = pi*(s_t)
    3. Aggregate: D <- D u {(s_1, a_1), ..., (s_t, a_t)}
    4. Train pi_{i+1} by supervised learning on D
```

DAgger achieves $O(T\epsilon)$ regret — the same as an oracle policy — because the training distribution converges to match the deployment distribution.

The key requirement is that the expert can be queried on any state, including states the expert would never naturally visit. This is feasible in simulation (ask the expert to correct the robot from an unusual configuration) but can be challenging or unsafe in real physical systems.

---

## Inverse Reinforcement Learning

Sometimes the expert's behavior is better understood not as a sequence of actions to mimic but as the outcome of optimizing an unknown reward function. **Inverse Reinforcement Learning (IRL)** {cite}`ng2000algorithms` recovers this latent reward function from demonstrations.

Given demonstrations $\tau = \{(s_1, a_1), \ldots, (s_T, a_T)\}$, IRL finds a reward function $R(s, a)$ such that the expert's policy is optimal under $R$.

The appeal of IRL over BC: if we recover the true reward function, we can re-optimize it in new environments, with different dynamics, or with improved planners — generalizing far beyond the demonstrated scenarios.

### Maximum Entropy IRL

**MaxEnt IRL** {cite}`ziebart2008maximum` resolves the IRL ambiguity problem (there are many reward functions consistent with any set of demonstrations) by choosing the reward function that, while consistent with the demonstrated behavior, leads to a distribution over trajectories with *maximum entropy*. Trajectories are distributed as:

$$
P(\tau \mid R) \propto \exp\left(\sum_t R(s_t, a_t)\right)
$$

The learning objective matches the expert's observed feature expectations $\mu_E = \mathbb{E}_{\tau \sim \pi^*}[\phi(\tau)]$ to the model's feature expectations $\mu_\theta = \mathbb{E}_{\tau \sim \pi_\theta}[\phi(\tau)]$.

---

## GAIL: Generative Adversarial Imitation Learning

**GAIL** {cite}`ho2016generative` bypasses reward function learning entirely, using a GAN-like formulation to directly match the state-action distribution of the expert.

A discriminator $D_\psi$ is trained to distinguish expert state-action pairs $(s, a) \sim \pi^*$ from policy state-action pairs $(s, a) \sim \pi_\theta$:

$$
\mathcal{L}_D = -\mathbb{E}_{\pi^*}[\log D_\psi(s,a)] - \mathbb{E}_{\pi_\theta}[\log(1 - D_\psi(s,a))]
$$

The generator (the policy $\pi_\theta$) is trained to fool the discriminator — i.e., to produce state-action pairs that look like the expert's. The discriminator's output $\log D_\psi(s,a)$ serves as a reward signal for the policy.

GAIL achieves expert-level performance on continuous control benchmarks with far fewer demonstrations than BC, and generalizes better than MaxEnt IRL in complex environments.

---

## Behavioral Cloning in NLP: A Practical Example

```{code-cell} python
import numpy as np
import torch
import torch.nn as nn
from torch.utils.data import DataLoader, TensorDataset

torch.manual_seed(42)

# -----------------------------------------------
# Toy NLP task: rewriting sentences to be more formal
# We simulate this as a simple sequence transformation
# In practice: fine-tuning a seq2seq model on expert rewrites
# -----------------------------------------------

class SimpleSeq2Seq(nn.Module):
    def __init__(self, vocab_size=100, embed_dim=32, hidden_dim=64):
        super().__init__()
        self.embed = nn.Embedding(vocab_size, embed_dim, padding_idx=0)
        self.encoder = nn.GRU(embed_dim, hidden_dim, batch_first=True)
        self.decoder = nn.GRU(embed_dim, hidden_dim, batch_first=True)
        self.proj = nn.Linear(hidden_dim, vocab_size)
        self.hidden_dim = hidden_dim

    def forward(self, src, tgt):
        src_emb = self.embed(src)
        _, hidden = self.encoder(src_emb)
        tgt_emb = self.embed(tgt)
        out, _ = self.decoder(tgt_emb, hidden)
        return self.proj(out)

# Generate synthetic demonstration data
VOCAB = 100
rng = np.random.default_rng(42)
N, SEQ_LEN = 1000, 12

src_seqs = torch.tensor(rng.integers(1, VOCAB, (N, SEQ_LEN)), dtype=torch.long)
# "Expert" transformation: shift tokens by 1 (toy formalization)
tgt_seqs = torch.clamp(src_seqs + 1, 1, VOCAB - 1)
tgt_in  = torch.cat([torch.ones(N, 1, dtype=torch.long), tgt_seqs[:, :-1]], dim=1)

dataset = TensorDataset(src_seqs, tgt_in, tgt_seqs)
loader = DataLoader(dataset, batch_size=64, shuffle=True)

model = SimpleSeq2Seq(vocab_size=VOCAB)
optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)
criterion = nn.CrossEntropyLoss(ignore_index=0)

# Behavioral cloning training
train_losses = []
for epoch in range(20):
    epoch_loss = 0
    for src, tgt_i, tgt_o in loader:
        logits = model(src, tgt_i)
        loss = criterion(logits.reshape(-1, VOCAB), tgt_o.reshape(-1))
        optimizer.zero_grad(); loss.backward(); optimizer.step()
        epoch_loss += loss.item()
    train_losses.append(epoch_loss / len(loader))

print(f"Initial loss: {train_losses[0]:.3f}")
print(f"Final loss:   {train_losses[-1]:.3f}")

# Evaluate: check token accuracy on held-out examples
model.eval()
with torch.no_grad():
    src_test = src_seqs[-100:]
    tgt_test_in = tgt_in[-100:]
    tgt_test_out = tgt_seqs[-100:]
    logits = model(src_test, tgt_test_in)
    preds = logits.argmax(dim=-1)
    acc = (preds == tgt_test_out).float().mean().item()
    print(f"Token accuracy on held-out set: {acc:.3f}")
```

---

## Comparison of Imitation Learning Methods

| Method         | Requires reward? | Expert queried online? | Generalizes to new dynamics? | Complexity     |
|----------------|-----------------|------------------------|------------------------------|----------------|
| Behavioral Cloning | No          | No                     | Poorly (distribution shift)  | Low            |
| DAgger         | No              | Yes                    | Moderately                   | Medium         |
| MaxEnt IRL     | Recovers it     | No                     | Well                         | High           |
| GAIL           | No              | No                     | Well                         | High           |

---

## Applications

**Robotics.** Teaching robots to manipulate objects, navigate environments, or perform household tasks. Physical demonstrations are collected via teleoperation or kinesthetic teaching.

**Autonomous driving.** Early self-driving systems such as ALVINN {cite}`pomerleau1989alvinn` and NVIDIA's DAVE relied heavily on behavioral cloning from human driving data.

**Game AI.** Imitation learning on human gameplay bootstraps agents before RL fine-tuning. AlphaStar trained on human replays before RL; this approach is common when human-level demonstrations are available.

**Code generation.** Language model fine-tuning on high-quality code demonstrations (GitHub Copilot, Codex) is a form of behavioral cloning.

**Clinical decision support.** Learning from expert physician decision sequences for complex protocols.

```{seealso}
The foundational BC/DAgger analysis is in {cite}`ross2011reduction`. MaxEnt IRL is from {cite}`ziebart2008maximum`. GAIL is from {cite}`ho2016generative`. For a comprehensive survey of imitation learning, see {cite}`osa2018algorithmic`.
```
