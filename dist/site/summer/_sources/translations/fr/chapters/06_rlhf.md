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

# Apprentissage par renforcement à partir des retours humains

Aucune technique n'a fait davantage pour faire entrer le HITL ML dans le grand public que l'apprentissage par renforcement à partir des retours humains (RLHF). C'est le mécanisme derrière InstructGPT {cite}`ouyang2022training` et un composant central des pipelines de suivi d'instructions dans de nombreux grands modèles de langage modernes {cite}`stiennon2020learning`. Comprendre le RLHF — non seulement comme une recette à suivre, mais comme une approche principiée de l'alignement — est essentiel pour quiconque travaille dans l'IA moderne.

---

## Le problème de l'alignement

Les grands modèles de langage (LLM) entraînés uniquement sur la prédiction du token suivant optimisent un objectif de substitution : prédire quel texte vient ensuite dans un corpus de textes rédigés par des humains. Cet objectif est lié à, mais distinct de, ce que nous voulons réellement : des réponses utiles, précises, sûres et alignées sur les valeurs humaines.

Le décalage entre l'objectif d'entraînement et le comportement souhaité est appelé le **problème de l'alignement** {cite}`russell2019human`. Concrètement, un modèle de langage entraîné sur du texte d'internet apprend à :
- Produire des continuations plausibles (qui peuvent être factuellement erronées)
- Refléter les biais et les préjudices présents dans les données d'entraînement
- Être évasif ou manipulateur quand c'est ce qui suit statistiquement le prompt

Le RLHF aborde l'alignement en rendant les préférences humaines *partie intégrante de l'objectif d'optimisation*.

---

## Le pipeline RLHF

Le RLHF se déroule en trois étapes :

```text
Étape 1 : Affinement supervisé (SFT)
  --> Collecter des données de démonstration (l'humain rédige les réponses idéales)
  --> Affiner le LLM de base sur les démonstrations

Étape 2 : Entraînement du modèle de récompense
  --> Collecter des préférences par paires (l'humain évalue A vs B)
  --> Entraîner le modèle de récompense R(x, y) à prédire les préférences humaines

Étape 3 : Affinement par RL
  --> Affiner le LLM avec PPO/RL pour maximiser R(x, y)
  --> La pénalité KL empêche un trop grand écart par rapport au modèle SFT
```

### Étape 1 : Affinement supervisé

En partant d'un modèle de base pré-entraîné $\pi_0$, nous collectons un ensemble de données de paires (prompt, réponse idéale), rédigées ou sélectionnées par des contractants humains suivant des consignes détaillées. Le modèle est affiné sur ces démonstrations en utilisant l'entropie croisée standard :

$$
\mathcal{L}_\text{SFT}(\theta) = -\mathbb{E}_{(x, y) \sim \mathcal{D}_\text{demo}} \left[ \log \pi_\theta(y \mid x) \right]
$$

Le modèle SFT $\pi_\text{SFT}$ est un bien meilleur point de départ pour le RLHF que le modèle pré-entraîné brut.

### Étape 2 : Entraînement du modèle de récompense

Pour un ensemble de prompts $\{x_i\}$, nous générons $K$ réponses par prompt en utilisant $\pi_\text{SFT}$ et les présentons à des évaluateurs humains sous forme de comparaisons par paires : « Quelle réponse est meilleure, A ou B ? »

Le modèle de récompense $r_\phi$ est entraîné à prédire ces préférences. Sous le **modèle de Bradley-Terry** (Chapitre 8), la probabilité que la réponse $y_w$ soit préférée à $y_l$ est :

$$
P(y_w \succ y_l \mid x) = \sigma\left(r_\phi(x, y_w) - r_\phi(x, y_l)\right)
$$

Le modèle de récompense est entraîné à minimiser la perte de classement par paires :

$$
\mathcal{L}_\text{RM}(\phi) = -\mathbb{E}_{(x, y_w, y_l) \sim \mathcal{D}_\text{pref}} \left[ \log \sigma\left(r_\phi(x, y_w) - r_\phi(x, y_l)\right) \right]
$$

Le modèle de récompense est généralement initialisé à partir du modèle SFT avec une tête scalaire remplaçant la couche finale.

### Étape 3 : Affinement par RL avec PPO

Avec un modèle de récompense entraîné, nous pouvons utiliser l'apprentissage par renforcement pour affiner le LLM. Chaque prompt $x$ est un état ; chaque réponse $y$ est une trajectoire de choix de tokens ; et la récompense est $r_\phi(x, y)$.

L'objectif d'optimisation inclut une **pénalité de divergence KL** pour empêcher le modèle de dériver trop loin de la référence SFT (ce qui conduirait au détournement de récompense {cite}`krakovna2020specification,gao2023scaling`) :

$$
\max_\theta \mathbb{E}_{x \sim \mathcal{D}, y \sim \pi_\theta(\cdot | x)} \left[ r_\phi(x, y) - \beta \cdot \text{KL}\left[\pi_\theta(\cdot \mid x) \| \pi_\text{SFT}(\cdot \mid x)\right] \right]
$$

Le paramètre $\beta$ contrôle la force de la pénalité KL. Un petit $\beta$ permet plus d'optimisation mais risque le détournement de récompense ; un grand $\beta$ maintient le modèle proche du SFT mais limite les gains d'alignement.

**L'Optimisation par Politique Proximale (PPO)** {cite}`schulman2017proximal` est l'algorithme standard pour cette étape, choisi pour sa stabilité par rapport aux méthodes de gradient de politique brutes.

---

## Une démonstration simplifiée du RLHF

Le pipeline RLHF complet nécessite une infrastructure à grande échelle. L'exemple suivant démontre les idées clés à petite échelle.

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

## Défis du RLHF

### Détournement de récompense

Un mode d'échec clé : la politique trouve des moyens d'obtenir une récompense élevée du modèle de récompense sans que cela corresponde à un comportement genuinement bon. Par exemple, un LLM pourrait apprendre à produire des réponses flatteuses ou formulées avec assurance (que les évaluateurs ont tendance à bien noter) plutôt que précises.

Le détournement de récompense est plus probable quand :
- Le modèle de récompense est entraîné sur un nombre insuffisant de données de préférences
- La politique est autorisée à s'éloigner fortement de la référence SFT (petit $\beta$)
- La distribution du modèle de récompense dérive pendant l'entraînement PPO

**Stratégies d'atténuation :** Pénalité KL, entraînement itératif du modèle de récompense, évaluation diversifiée, contraintes de l'IA constitutionnelle.

### Biais des évaluateurs

Les évaluateurs humains ont des biais systématiques. Ils tendent à préférer les réponses plus longues (biais de verbosité), les textes à la formulation plus assurée (biais de confiance), et les réponses qui concordent avec leurs croyances préalables. Ces biais se propagent dans le modèle de récompense.

Le fameux échec de servilité des modèles RLHF — où le modèle dit aux utilisateurs ce qu'ils veulent entendre plutôt que ce qui est vrai — est en partie le résultat de la préférence des évaluateurs pour les réponses agréables.

### Supervision évolutive

Pour les tâches complexes, les humains ne peuvent pas juger de manière fiable quelle réponse IA est correcte. Un évaluateur comparant deux longues démonstrations mathématiques ou deux implémentations de code peut simplement choisir la plus lisible, indépendamment de l'exactitude. **La supervision évolutive** est le problème ouvert de la conception de procédures d'évaluation qui restent fiables à mesure que la complexité des tâches croît {cite}`bowman2022measuring`.

---

## L'IA constitutionnelle (RLAIF)

**L'IA constitutionnelle** {cite}`bai2022constitutional`, développée chez Anthropic, réduit la dépendance aux évaluateurs humains en utilisant l'IA elle-même pour générer des étiquettes de préférences guidées par un ensemble de principes (une « constitution »). Le processus :

1. Générer des réponses à des prompts potentiellement nuisibles
2. Utiliser un critique IA pour évaluer les réponses par rapport aux principes constitutionnels
3. Réviser les réponses guidées par le retour IA (RLAIF — RL à partir du retour IA)
4. Entraîner un modèle de récompense sur les préférences générées par IA
5. Affiner avec RLHF en utilisant ce modèle de récompense

Le RLAIF peut générer des données de préférences à une échelle bien supérieure à l'étiquetage humain, et permet un contrôle précis sur les valeurs encodées dans le modèle de récompense.

```{seealso}
L'article original InstructGPT {cite}`ouyang2022training` décrit la première application à grande échelle du RLHF aux LLM. Le travail fondateur sur le RLHF pour l'apprentissage par renforcement profond est {cite}`christiano2017deep`. PPO est décrit dans {cite}`schulman2017proximal`. L'IA constitutionnelle est issue de {cite}`bai2022constitutional`.
```
