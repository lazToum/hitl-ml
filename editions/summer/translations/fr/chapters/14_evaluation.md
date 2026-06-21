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

# Évaluation et métriques

Savoir si votre système HITL fonctionne nécessite plus que la mesure de la précision du modèle. Vous devez savoir si vous tirez de la valeur de votre budget d'annotation, si le modèle est réellement mieux aligné sur l'intention humaine, et si un retour humain supplémentaire continuera à améliorer les choses. Ce chapitre couvre le paysage complet de l'évaluation dans les contextes HITL.

---

## Métriques centrées sur le modèle

Les métriques d'apprentissage automatique standard s'appliquent directement aux systèmes HITL, avec quelques nuances importantes.

### Métriques de classification

**La précision** est appropriée quand les classes sont équilibrées et que toutes les erreurs coûtent également. Dans les contextes HITL, cependant, l'ensemble de test étiqueté peut être biaisé par la stratégie de requête (l'apprentissage actif interroge des exemples non aléatoires), rendant les estimations de précision simples peu fiables.

**Le score F1** est la moyenne harmonique de la précision et du rappel, appropriée pour les classes déséquilibrées. Dans les contextes HITL, la précision et le rappel peuvent importer différemment selon l'asymétrie du coût entre les faux positifs et les faux négatifs.

**L'AUROC** mesure la capacité du modèle à discriminer entre classes indépendamment du seuil — important pour les tâches sensibles à la calibration comme le dépistage médical.

**La calibration** mesure dans quelle mesure les probabilités prédites correspondent aux fréquences empiriques. Dans les systèmes HITL, les modèles entraînés sur des ensembles étiquetés biaisés (issus de l'apprentissage actif) peuvent être mal calibrés même quand ils sont précis.

### Métriques pour les modèles génératifs

Pour les modèles de langage et les systèmes génératifs, l'évaluation est fondamentalement plus difficile. Aucune métrique automatique unique ne capture la qualité :

- **BLEU / ROUGE / METEOR :** Métriques basées sur des références pour la traduction et la résumé. Corrèlent faiblement avec les jugements humains de qualité pour la génération de texte long.
- **Perplexité :** Mesure dans quelle mesure le modèle prédit le texte mis de côté. Condition nécessaire mais non suffisante pour la qualité.
- **BERTScore :** Similarité basée sur les plongements par rapport aux références. Mieux corrélée avec les jugements humains que les métriques n-grammes.
- **Évaluation humaine :** L'étalon-or. Voir la Section 14.3.

---

## Métriques d'efficacité de l'annotation

L'évaluation HITL devrait également mesurer si le retour humain est utilisé efficacement.

### Courbes d'apprentissage

Une **courbe d'apprentissage** trace les performances du modèle en fonction du nombre d'exemples étiquetés. Une courbe d'apprentissage raide (amélioration rapide avec peu d'étiquettes) indique que la stratégie d'annotation sélectionne des exemples informatifs. Une courbe d'apprentissage plate indique que l'étiquetage supplémentaire fournit des rendements décroissants.

```{code-cell} python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import f1_score, roc_auc_score
from sklearn.model_selection import StratifiedShuffleSplit

rng = np.random.default_rng(42)
X, y = make_classification(n_samples=5000, n_features=30, n_informative=15,
                            weights=[0.8, 0.2], random_state=42)
X_test, y_test = X[4000:], y[4000:]
X_pool, y_pool = X[:4000], y[:4000]

label_sizes = [20, 40, 60, 100, 150, 200, 300, 400, 600, 800, 1000, 1500, 2000]
metrics = {'f1': [], 'auc': []}

for n in label_sizes:
    idx = rng.choice(len(X_pool), n, replace=False)
    clf = LogisticRegression(max_iter=500, class_weight='balanced')
    clf.fit(X_pool[idx], y_pool[idx])
    preds = clf.predict(X_test)
    probs = clf.predict_proba(X_test)[:, 1]
    metrics['f1'].append(f1_score(y_test, preds))
    metrics['auc'].append(roc_auc_score(y_test, probs))

# Fit learning curve: performance ≈ a - b/sqrt(n)
from scipy.optimize import curve_fit

def learning_curve_fn(n, a, b):
    return a - b / np.sqrt(n)

popt_f1, _ = curve_fit(learning_curve_fn, label_sizes, metrics['f1'], p0=[0.9, 2])
popt_auc, _ = curve_fit(learning_curve_fn, label_sizes, metrics['auc'], p0=[0.95, 1])

n_smooth = np.linspace(20, 3000, 200)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(11, 4))

ax1.scatter(label_sizes, metrics['f1'], color='#2b3a8f', zorder=5, s=40)
ax1.plot(n_smooth, learning_curve_fn(n_smooth, *popt_f1), '--', color='#e05c5c',
         label=f'Fit: {popt_f1[0]:.3f} - {popt_f1[1]:.1f}/√n')
ax1.set_xlabel("Labeled examples"); ax1.set_ylabel("F1 score")
ax1.set_title("Learning Curve: F1"); ax1.legend(); ax1.grid(alpha=0.3)

ax2.scatter(label_sizes, metrics['auc'], color='#0d9e8e', zorder=5, s=40)
ax2.plot(n_smooth, learning_curve_fn(n_smooth, *popt_auc), '--', color='#e05c5c',
         label=f'Fit: {popt_auc[0]:.3f} - {popt_auc[1]:.2f}/√n')
ax2.set_xlabel("Labeled examples"); ax2.set_ylabel("AUROC")
ax2.set_title("Learning Curve: AUROC"); ax2.legend(); ax2.grid(alpha=0.3)

plt.tight_layout()
plt.savefig('learning_curves.png', dpi=150)
plt.show()

# Estimate the annotation budget needed to reach a target performance
target_f1 = 0.80
n_needed = (popt_f1[1] / (popt_f1[0] - target_f1)) ** 2
print(f"Estimated labels needed to reach F1={target_f1}: {n_needed:.0f}")
```

### Analyse du retour sur investissement (ROI)

Le ROI du retour humain répond à la question : pour chaque étiquette supplémentaire, dans quelle mesure les performances du modèle s'améliorent-elles ?

$$
\text{ROI}(n) = \frac{\Delta \text{performance}(n)}{\text{coût par étiquette}}
$$

À mesure qu'un modèle mûrit (et que les exemples faciles à apprendre sont épuisés), le ROI diminue typiquement. L'implication pratique : les budgets d'annotation devraient être concentrés en début de projet, avec davantage d'étiquettes collectées aux premières étapes quand le ROI est le plus élevé.

---

## Évaluation humaine

Pour les systèmes génératifs et les tâches subjectives, l'évaluation humaine reste l'étalon-or.

### Évaluation directe (DA)

Les annotateurs évaluent les sorties sur une échelle absolue (par exemple, 1 à 100 pour la qualité de traduction, ou 1 à 5 pour l'utilité de la réponse). La DA a été standardisée dans l'évaluation de la traduction automatique (références WMT).

**Meilleures pratiques pour la DA :**
- Randomiser l'ordre des sorties pour prévenir l'ancrage
- Utiliser un nombre suffisant d'annotateurs par élément (3 à 5 minimum)
- Inclure des contrôles de qualité (exemples évidemment bons et mauvais pour détecter les évaluateurs inattentifs)
- Rapporter l'accord inter-annotateurs aux côtés des scores agrégés

### Évaluation comparative

Les annotateurs choisissent entre deux sorties : « Laquelle est meilleure ? » Les jugements comparatifs sont plus rapides et plus cohérents que les évaluations absolues (voir le Chapitre 8). Les **systèmes de classement ELO** (empruntés aux échecs) convertissent les résultats de comparaisons par paires en un classement de qualité continu.

```{code-cell} python
import numpy as np

def update_elo(rating_a, rating_b, outcome_a, k=32):
    """Update ELO ratings. outcome_a: 1=A wins, 0=B wins, 0.5=tie."""
    expected_a = 1 / (1 + 10 ** ((rating_b - rating_a) / 400))
    expected_b = 1 - expected_a
    new_a = rating_a + k * (outcome_a - expected_a)
    new_b = rating_b + k * ((1 - outcome_a) - expected_b)
    return new_a, new_b

# Simulate 5 model versions being compared pairwise
rng = np.random.default_rng(42)
true_quality = [0.60, 0.70, 0.75, 0.80, 0.85]  # underlying model quality
n_models = len(true_quality)
elo_ratings = {i: 1000.0 for i in range(n_models)}

for _ in range(500):  # 500 pairwise comparisons
    i, j = rng.choice(n_models, 2, replace=False)
    p_i_wins = true_quality[i] / (true_quality[i] + true_quality[j])
    outcome = 1.0 if rng.random() < p_i_wins else 0.0
    elo_ratings[i], elo_ratings[j] = update_elo(elo_ratings[i], elo_ratings[j], outcome)

print("ELO Rankings after 500 comparisons:")
sorted_models = sorted(elo_ratings.items(), key=lambda x: x[1], reverse=True)
for rank, (model_id, elo) in enumerate(sorted_models, 1):
    print(f"  Rank {rank}: Model {model_id}  ELO={elo:.1f}  True quality={true_quality[model_id]:.2f}")
```

### Tests comportementaux (CheckList)

**CheckList** {cite}`ribeiro2020beyond` est une méthodologie pour l'évaluation comportementale systématique des modèles TAL. Au lieu d'ensembles de test aléatoires, elle conçoit des cas de test qui sondent des capacités spécifiques :

- **Tests de Fonctionnalité Minimale (MFT) :** Le modèle gère-t-il les cas simples et évidents ?
- **Tests d'Invariance (INV) :** La sortie du modèle change-t-elle quand elle ne devrait pas (par exemple lors d'une paraphrase) ?
- **Tests d'Attentes Directionnelles (DIR) :** La sortie du modèle change-t-elle dans la direction attendue quand l'entrée change ?

CheckList rend l'évaluation humaine ciblée et exploitable : au lieu d'un seul chiffre de précision, elle fournit un profil de capacités.

---

## Mesurer l'alignement sur l'intention humaine

Pour les systèmes RLHF, mesurer l'alignement est un défi d'évaluation central.

**Évaluation du modèle de récompense :** La précision du modèle de récompense sur un ensemble de test de préférences mis de côté. Ouyang et al. {cite}`ouyang2022training` rapportent environ 72 % de précision par paires pour le modèle de récompense d'InstructGPT ; à titre de point de référence approximatif, des chiffres dans cette fourchette sont couramment cités pour des pipelines RLHF similaires, bien que les résultats varient considérablement selon la tâche et la qualité des données.

**Taux de victoire :** Étant donné deux versions du modèle (par exemple, référence SFT vs. affinement RLHF), quelle fraction des réponses le modèle RLHF gagne-t-il dans les comparaisons par paires humaines ?

**GPT-4 comme évaluateur :** L'utilisation d'un LLM capable pour évaluer les réponses est devenue courante pour l'itération rapide. Gilardi et al. {cite}`gilardi2023chatgpt` et Zheng et al. {cite}`zheng2023judging` trouvent que l'accord entre évaluateurs LLM et jugement humain varie approximativement de 0,7 à 0,9 selon la tâche — utile pour les comparaisons A/B rapides, mais moins fiable pour détecter la servilité, la nuance culturelle ou les problèmes de sécurité.

**Détection de la servilité :** Mesurer si le modèle change ses réponses en fonction de la préférence implicite de l'utilisateur (par exemple, « Je pense que X est correct ; qu'en pensez-vous ? »). Un modèle bien aligné ne devrait pas être servile.

---

## Tests A/B dans les systèmes déployés

Pour les systèmes en production, l'évaluation ultime est le **test A/B** : acheminer une fraction des utilisateurs vers la nouvelle version du modèle et mesurer les résultats en aval.

Les tests A/B donnent une estimation non biaisée de la qualité du modèle dans le contexte de déploiement réel, capturant des effets que l'évaluation en laboratoire manque (comportement des utilisateurs, distribution de la population, cas limites).

Le défi : des métriques en aval appropriées. Les métriques d'engagement (clics, durée de session) peuvent récompenser un comportement manipulateur. Les taux d'achèvement des tâches ou les enquêtes de satisfaction des utilisateurs sont mieux alignées mais plus bruitées.

```{seealso}
Tests comportementaux CheckList : {cite}`ribeiro2020beyond`. Pour la méthodologie d'évaluation RLHF, voir {cite}`ouyang2022training`. Pour les meilleures pratiques d'évaluation humaine en TA : {cite}`graham2015accurate`. Pour la théorie des courbes d'apprentissage : {cite}`mukherjee2003estimating`.
```
