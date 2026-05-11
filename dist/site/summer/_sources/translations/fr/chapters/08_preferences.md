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

# Apprentissage à partir de comparaisons et de classements

Demander aux humains d'attribuer un score de qualité absolu à une production est difficile. Quelle est la qualité numérique de cet essai, sur une échelle de 1 à 10 ? La question est mal posée : les humains ne disposent pas d'une échelle interne stable, et leurs scores sont fortement influencés par l'ancrage, le contexte et la fatigue.

Demander aux humains de *comparer* deux productions est bien plus facile : quel essai est meilleur, A ou B ? Les jugements comparatifs sont plus cohérents, plus fiables, et exploitent plus directement les préférences humaines que les évaluations absolues. Ce chapitre couvre les fondements mathématiques et les applications pratiques de l'apprentissage à partir de comparaisons et de classements.

---

## Pourquoi les comparaisons sont meilleures que les évaluations

### Fondement psychologique

La supériorité des jugements comparatifs a une longue histoire en psychométrie. La loi du jugement comparatif de Thurstone {cite}`thurstone1927law` (1927) a montré que même quand les humains ont des jugements absolus incohérents, leurs jugements relatifs suivent une loi probabiliste cohérente. Les comparaisons exploitent le fait que les humains sont bien meilleurs dans la perception *relative* que dans la calibration absolue.

### Efficacité statistique

Chaque comparaison par paires fournit des informations sur les positions *relatives* de deux éléments sur l'échelle de qualité. Avec $K$ éléments, $K-1$ comparaisons peuvent classer tous les éléments ; seulement $O(\log K)$ comparaisons sont nécessaires pour trouver l'élément le mieux classé. Les évaluations absolues nécessitent généralement davantage de jugements pour atteindre la même précision.

### Évolutivité

Pour les modèles génératifs, le nombre de sorties distinctes est effectivement infini. Évaluer absolument une sortie exige d'établir une échelle partagée sur toutes les sorties ; comparer des sorties ne requiert que des jugements locaux et relatifs naturellement calibrés l'un par rapport à l'autre.

---

## Le modèle de Bradley-Terry

Le modèle probabiliste dominant pour les comparaisons par paires est le **modèle de Bradley-Terry (BT)** {cite}`bradley1952rank`. Chaque élément $i$ possède un score de qualité latent $\alpha_i \in \mathbb{R}$. La probabilité que l'élément $i$ soit préféré à l'élément $j$ dans une comparaison directe est :

$$
P(i \succ j) = \frac{e^{\alpha_i}}{e^{\alpha_i} + e^{\alpha_j}} = \sigma(\alpha_i - \alpha_j)
$$

où $\sigma$ est la fonction sigmoïde logistique. Cela équivaut à supposer que la qualité perçue de l'élément $i$ est $\alpha_i + \epsilon$ où $\epsilon$ est un terme de bruit logistique standard.

### Identifiabilité

Le modèle BT est identifiable à une translation près : si $\alpha$ est une solution, $\alpha + c$ l'est aussi pour toute constante $c$. La convention standard est de fixer un score (par exemple $\alpha_0 = 0$) ou de contraindre $\sum_i \alpha_i = 0$. Les scores ne sont identifiables que quand le **graphe de comparaison** (nœuds = éléments, arêtes = paires observées) est **connexe** — si le graphe a des composantes déconnectées, les scores relatifs entre composantes sont indéfinis.

### Estimation des paramètres

Étant donné un ensemble de données de comparaisons par paires $\mathcal{D} = \{(i, j, y_{ij})\}$ où $y_{ij} = 1$ si $i$ a été préféré à $j$, la log-vraisemblance est :

$$
\mathcal{L}(\alpha) = \sum_{(i, j, y_{ij}) \in \mathcal{D}} \left[ y_{ij} \log \sigma(\alpha_i - \alpha_j) + (1 - y_{ij}) \log \sigma(\alpha_j - \alpha_i) \right]
$$

C'est une fonction concave de $\alpha$ qui peut être maximisée par montée de gradient ou par la méthode de Newton.

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

## Le modèle de Thurstone

Le modèle de Thurstone {cite}`thurstone1927law` est étroitement lié au modèle de Bradley-Terry mais utilise un bruit gaussien plutôt que logistique :

$$
P(i \succ j) = \Phi\left(\frac{\alpha_i - \alpha_j}{\sqrt{2}\sigma}\right)
$$

où $\Phi$ est la fonction de répartition de la loi normale standard. Quand $\sigma = 1/\sqrt{2}$, cela devient équivalent au BT avec une légère différence d'échelle. En pratique, les deux modèles donnent des résultats presque identiques.

---

## Agrégation de classements

Quand chaque annotateur fournit un classement complet de $K$ éléments (plutôt que des comparaisons par paires), le problème est **l'agrégation de classements** : combiner plusieurs listes classées en un classement de consensus.

**Le compte de Borda :** Chaque élément reçoit un score égal au nombre d'éléments classés en dessous de lui dans le classement de chaque annotateur. Les scores sont sommés sur tous les annotateurs. Simple et robuste.

**Kemeny–Young :** Trouver le classement qui minimise la somme des désaccords par paires (la distance de Kendall tau) avec le classement de chaque annotateur. Ceci est NP-difficile pour un grand $K$ mais réalisable pour de petits ensembles.

**RankNet / ListNet :** Des approches neuronales qui apprennent une fonction de score à partir de listes classées, permettant la généralisation à des éléments non vus.

---

## Les bandits duellants

Dans l'apprentissage par préférences **en ligne**, les éléments arrivent en flux continu et nous devons décider quelles paires comparer, en équilibrant l'exploration (apprendre sur des éléments inconnus) et l'exploitation (présenter des éléments de haute qualité). C'est le problème des **bandits duellants** {cite}`yue2009interactively`.

Algorithmes clés :
- **Doubler :** Maintient un élément champion ; le défie avec des concurrents aléatoires
- **RUCB (Borne de Confiance Supérieure Relative) :** Calcule des intervalles de confiance de style UCB pour la probabilité de chaque élément de battre chaque autre élément
- **MergeRank :** Combine la comparaison par tournoi avec UCB

Les bandits duellants sont utilisés dans les systèmes de recommandation en ligne (quel article afficher ensuite, étant donné un retour implicite) et l'élicitation de préférences interactives pour la collecte de données RLHF.

---

## L'apprentissage par préférences pour les modèles de langage

Dans le contexte du RLHF (Chapitre 6), le modèle de Bradley-Terry est utilisé pour entraîner le modèle de récompense. Une variante importante est **l'Optimisation Directe des Préférences (DPO)** {cite}`rafailov2023direct`, qui montre que l'objectif RLHF peut être optimisé directement à partir des données de préférences sans entraîner un modèle de récompense séparé :

$$
\mathcal{L}_\text{DPO}(\theta) = -\mathbb{E}_{(x, y_w, y_l) \sim \mathcal{D}} \left[ \log \sigma \left( \beta \log \frac{\pi_\theta(y_w \mid x)}{\pi_\text{ref}(y_w \mid x)} - \beta \log \frac{\pi_\theta(y_l \mid x)}{\pi_\text{ref}(y_l \mid x)} \right) \right]
$$

Le DPO est plus simple que le RLHF complet (pas de boucle d'entraînement PPO, pas de modèle de récompense) tout en atteignant des résultats comparables ou meilleurs sur de nombreuses références {cite}`rafailov2023direct`. Il est devenu une alternative largement adoptée au RLHF basé sur PPO pour l'affinement par suivi d'instructions, bien que les deux approches restent en usage actif et que leurs forces relatives dépendent de la tâche.

---

## Collecter des données de préférences de haute qualité

La qualité des données de préférences détermine la qualité du modèle de récompense. Considérations clés :

**Diversité des prompts.** Les données de préférences devraient couvrir la distribution complète des prompts que le modèle rencontrera lors du déploiement. Les lacunes de couverture conduisent à un comportement peu fiable du modèle de récompense dans ces régions.

**Diversité des réponses.** Comparer deux réponses très similaires fournit peu d'information. Les réponses comparées devraient être suffisamment différentes pour que les annotateurs aient une préférence claire.

**Accord inter-annotateurs.** Un faible accord inter-annotateurs suggère que les critères de comparaison sont ambigus. Mesurer l'accord (kappa de Cohen) et réviser les consignes quand il est en dessous des seuils acceptables.

**Calibration.** Les annotateurs devraient comprendre *pourquoi* une réponse est meilleure : utilité, précision, sécurité, style ? Les tâches qui regroupent plusieurs critères tendent à produire des préférences incohérentes. Il est souvent préférable de collecter des préférences sur chaque critère séparément.

```{seealso}
Modèle de Bradley-Terry : {cite}`bradley1952rank`. Thurstone : {cite}`thurstone1927law`. Bandits duellants : {cite}`yue2009interactively`. Optimisation Directe des Préférences (DPO) : {cite}`rafailov2023direct`.
```
