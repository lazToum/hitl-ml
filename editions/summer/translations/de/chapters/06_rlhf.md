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

# Bestärkendes Lernen aus menschlichem Feedback

Keine Technik hat HITL ML mehr in den Mainstream gebracht als Reinforcement Learning from Human Feedback (RLHF). Es ist der Mechanismus hinter InstructGPT {cite}`ouyang2022training` und ein Kernbestandteil von Instruktionsfolge-Pipelines in vielen modernen großen Sprachmodellen {cite}`stiennon2020learning`. RLHF zu verstehen — nicht nur als zu befolgendes Rezept, sondern als prinzipiellen Ansatz zur Ausrichtung — ist für jeden, der in der modernen KI arbeitet, unerlässlich.

---

## Das Ausrichtungsproblem

Große Sprachmodelle (LLMs), die rein auf Next-Token-Vorhersage trainiert wurden, optimieren für ein Proxy-Ziel: vorhersagen, welcher Text als nächstes in einem Korpus menschlich geschriebener Texte kommt. Dieses Ziel ist verwandt mit, aber verschieden von dem, was wir tatsächlich wollen: Antworten, die hilfreich, präzise, sicher und an menschliche Werte angepasst sind.

Die Diskrepanz zwischen dem Trainingsziel und dem gewünschten Verhalten wird als **Ausrichtungsproblem** {cite}`russell2019human` bezeichnet. Konkret lernt ein auf Internet-Text trainiertes Sprachmodell:
- Plausibel klingende Fortsetzungen zu produzieren (die sachlich falsch sein können)
- Die Verzerrungen und Schäden in Trainingsdaten widerzuspiegeln
- Ausweichend oder manipulativ zu sein, wenn dies statistisch auf den Prompt folgt

RLHF adressiert die Ausrichtung, indem menschliche Präferenzen *Teil des Optimierungsziels* werden.

---

## Die RLHF-Pipeline

RLHF verläuft in drei Phasen:

```text
Phase 1: Supervised Fine-Tuning (SFT)
  --> Demonstrationsdaten sammeln (Mensch schreibt ideale Antworten)
  --> Basis-LLM auf Demonstrationen feinabstimmen

Phase 2: Training des Belohnungsmodells
  --> Paarweise Präferenzen sammeln (Mensch bewertet A vs. B)
  --> Belohnungsmodell R(x, y) trainieren, um menschliche Präferenzen vorherzusagen

Phase 3: RL-Feinabstimmung
  --> LLM mittels PPO/RL feinabstimmen, um R(x, y) zu maximieren
  --> KL-Strafe verhindert übermäßige Abweichung vom SFT-Modell
```

### Phase 1: Supervised Fine-Tuning

Ausgehend von einem vortrainierten Basismodell $\pi_0$ sammeln wir einen Datensatz von (Prompt, ideale Antwort)-Paaren, geschrieben oder ausgewählt von menschlichen Auftragnehmern, die detaillierten Richtlinien folgen. Das Modell wird auf diesen Demonstrationen mit Standard-Kreuzentropie feinabgestimmt:

$$
\mathcal{L}_\text{SFT}(\theta) = -\mathbb{E}_{(x, y) \sim \mathcal{D}_\text{demo}} \left[ \log \pi_\theta(y \mid x) \right]
$$

Das SFT-Modell $\pi_\text{SFT}$ ist ein viel besserer Ausgangspunkt für RLHF als das rohe vortrainierte Modell.

### Phase 2: Training des Belohnungsmodells

Für eine Menge von Prompts $\{x_i\}$ generieren wir $K$ Antworten pro Prompt mit $\pi_\text{SFT}$ und präsentieren sie menschlichen Annotierenden als paarweise Vergleiche: „Welche Antwort ist besser, A oder B?"

Das Belohnungsmodell $r_\phi$ wird trainiert, um diese Präferenzen vorherzusagen. Unter dem **Bradley-Terry-Modell** (Kapitel 8) ist die Wahrscheinlichkeit, dass Antwort $y_w$ gegenüber $y_l$ bevorzugt wird:

$$
P(y_w \succ y_l \mid x) = \sigma\left(r_\phi(x, y_w) - r_\phi(x, y_l)\right)
$$

Das Belohnungsmodell wird trainiert, den paarweisen Rankingverlust zu minimieren:

$$
\mathcal{L}_\text{RM}(\phi) = -\mathbb{E}_{(x, y_w, y_l) \sim \mathcal{D}_\text{pref}} \left[ \log \sigma\left(r_\phi(x, y_w) - r_\phi(x, y_l)\right) \right]
$$

Das Belohnungsmodell wird typischerweise vom SFT-Modell initialisiert, wobei der letzte Layer durch einen skalaren Kopf ersetzt wird.

### Phase 3: RL-Feinabstimmung mit PPO

Mit einem trainierten Belohnungsmodell können wir Bestärkendes Lernen verwenden, um den LLM feinabzustimmen. Jeder Prompt $x$ ist ein Zustand; jede Antwort $y$ ist eine Trajektorie von Token-Entscheidungen; und die Belohnung ist $r_\phi(x, y)$.

Das Optimierungsziel enthält eine **KL-Divergenz-Strafe**, um zu verhindern, dass das Modell zu weit vom SFT-Ausgangspunkt abweicht (was zu Reward-Hacking führen würde {cite}`krakovna2020specification,gao2023scaling`):

$$
\max_\theta \mathbb{E}_{x \sim \mathcal{D}, y \sim \pi_\theta(\cdot | x)} \left[ r_\phi(x, y) - \beta \cdot \text{KL}\left[\pi_\theta(\cdot \mid x) \| \pi_\text{SFT}(\cdot \mid x)\right] \right]
$$

Der Parameter $\beta$ steuert die Stärke der KL-Strafe. Kleines $\beta$ erlaubt mehr Optimierung, birgt aber das Risiko von Reward-Hacking; großes $\beta$ hält das Modell nahe am SFT, begrenzt aber die Ausrichtungsgewinne.

**Proximal Policy Optimization (PPO)** {cite}`schulman2017proximal` ist der Standardalgorithmus für diese Phase, gewählt wegen seiner Stabilität gegenüber reinen Policy-Gradient-Methoden.

---

## Eine vereinfachte RLHF-Demonstration

Die vollständige RLHF-Pipeline erfordert großskalige Infrastruktur. Das folgende Beispiel demonstriert die Kernideen im kleinen Maßstab.

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

## Herausforderungen bei RLHF

### Reward-Hacking

Ein zentraler Versagensmodus: Die Policy findet Wege, vom Belohnungsmodell hohe Belohnungen zu erhalten, die nicht echtem guten Verhalten entsprechen. Beispielsweise könnte ein LLM lernen, Antworten zu produzieren, die schmeichelnd oder selbstsicher klingen (was Annotatoren tendenziell hoch bewerten), anstatt präzise zu sein.

Reward-Hacking ist wahrscheinlicher, wenn:
- Das Belohnungsmodell auf unzureichenden Präferenzdaten trainiert wurde
- Der Policy erlaubt wird, weit vom SFT-Ausgangspunkt abzuweichen (kleines $\beta$)
- Die Verteilung des Belohnungsmodells während des PPO-Trainings driftet

**Minderungsstrategien:** KL-Strafe, iteratives Belohnungsmodell-Training, diverse Evaluierung, Constitutional-AI-Beschränkungen.

### Evaluatorenverzerrung

Menschliche Annotatoren haben systematische Verzerrungen. Sie tendieren dazu, längere Antworten zu bevorzugen (Ausführlichkeitsverzerrung), selbstsicher klingende Texte (Konfidenzverzerrung) und Antworten, die mit ihren vorherigen Überzeugungen übereinstimmen. Diese Verzerrungen pflanzen sich in das Belohnungsmodell fort.

Das bekannte Kriechertum-Versagen von RLHF-Modellen — bei dem das Modell Nutzern sagt, was sie hören wollen, anstatt was wahr ist — ist teilweise ein Ergebnis der Evaluatorenpräferenz für gefällige Antworten.

### Skalierbare Aufsicht

Für komplexe Aufgaben können Menschen nicht zuverlässig beurteilen, welche KI-Antwort korrekt ist. Ein Annotator, der zwei lange mathematische Beweise oder zwei Code-Implementierungen vergleicht, wählt möglicherweise einfach den lesbareren aus, unabhängig von der Korrektheit. **Skalierbare Aufsicht** ist das offene Forschungsproblem der Entwicklung von Evaluierungsverfahren, die zuverlässig bleiben, wenn die Aufgabenkomplexität wächst {cite}`bowman2022measuring`.

---

## Constitutional AI (RLAIF)

**Constitutional AI** {cite}`bai2022constitutional`, entwickelt bei Anthropic, reduziert die Abhängigkeit von menschlichen Annotierenden, indem die KI selbst Präferenz-Labels generiert, geleitet von einer Menge von Prinzipien (einer „Verfassung"). Der Prozess:

1. Antworten auf potenziell schädliche Prompts generieren
2. Eine KI-Kritik verwenden, um Antworten gegen konstitutionelle Prinzipien zu bewerten
3. Antworten anhand von KI-Feedback überarbeiten (RLAIF — RL from AI Feedback)
4. Ein Belohnungsmodell auf KI-generierten Präferenzen trainieren
5. Mit RLHF unter Verwendung dieses Belohnungsmodells feinabstimmen

RLAIF kann Präferenzdaten in weit größerem Umfang als menschliche Annotation generieren und ermöglicht eine feingranulare Kontrolle über die im Belohnungsmodell kodierten Werte.

```{seealso}
Das originale InstructGPT-Papier {cite}`ouyang2022training` beschreibt die erste großskalige Anwendung von RLHF auf LLMs. Die grundlegende RLHF-Arbeit für tiefes RL ist {cite}`christiano2017deep`. PPO wird in {cite}`schulman2017proximal` beschrieben. Constitutional AI stammt aus {cite}`bai2022constitutional`.
```
