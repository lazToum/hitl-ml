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

# Production participative et contrôle qualité

Quand les tâches d'annotation sont suffisamment simples pour être réalisées par des non-experts, les plateformes de production participative offrent l'accès à de grandes main-d'œuvres d'annotation à la demande à faible coût par élément. Construire des jeux de données étiquetés de haute qualité à partir des foules nécessite une conception soigneuse des tâches, une redondance stratégique et un contrôle qualité rigoureux.

---

## Plateformes de production participative

**Amazon Mechanical Turk (MTurk)** est la place de marché de production participative originale, lancée en 2005. Les travailleurs (« Turkers ») accomplissent des micro-tâches (HITs) publiées par les demandeurs. Une étude de 2018 a trouvé un revenu horaire effectif médian pour les Turkers d'environ 2 $/h — bien en dessous du salaire minimum dans de nombreux pays à revenu élevé {cite}`hara2018data` — une préoccupation éthique abordée au Chapitre 15. MTurk convient mieux aux tâches simples avec des critères clairs et vérifiables.

**Prolific** est une plateforme de production participative académique qui applique un standard de rémunération minimum (actuellement environ 9 £/h, soit approximativement 11 $/h, tel qu'indiqué dans les directives publiées par Prolific), filtre les participants par données démographiques et maintient un panel de travailleurs qui ont opté pour la participation à la recherche. Préféré pour la recherche en sciences sociales et les tâches nécessitant une représentativité.

**Appen** (et similaires : Telus International, iMerit) fournit des main-d'œuvres d'annotation gérées avec gestion de la qualité, utilisées pour des tâches plus complexes et des projets d'entreprise.

**Communautés spécialisées.** Pour des tâches spécifiques au domaine, des communautés de passionnés du domaine peuvent fournir des annotations de haute qualité : Galaxy Zoo pour l'astronomie, eBird pour les espèces d'oiseaux, Chess Tempo pour l'annotation de positions d'échecs.

---

## Conception de tâches pour la production participative

### Décomposer les tâches complexes

Les tâches complexes devraient être décomposées en micro-tâches simples et bien définies. Au lieu de demander aux travailleurs d'annoter complètement un document, posez-leur une question ciblée à la fois : « Cette phrase contient-elle un nom de personne ? » ou « Évaluez la clarté de cette traduction sur une échelle de 1 à 5. »

**Avantages de la décomposition :**
- Demande cognitive moindre par tâche → moins de fatigue, meilleure qualité
- Chaque micro-tâche peut faire l'objet d'un contrôle qualité séparé
- Plus facile à auditer et déboguer

### L'importance des instructions

Le principal prédicteur de la qualité en production participative est la qualité des instructions. De bonnes instructions de tâche :
- Expliquent le *but* de la tâche en une phrase
- Donnent une définition claire et non ambiguë de chaque catégorie
- Fournissent 3 à 5 exemples travaillés (en particulier les cas limites)
- Sont assez courtes pour que les travailleurs les lisent réellement (< 300 mots pour les tâches simples)

Réalisez une **étude pilote** (10 à 50 travailleurs, 20 à 100 tâches) avant de passer à l'échelle. Analysez les désaccords du pilote ; la plupart pointent vers des ambiguïtés dans les instructions qui peuvent être corrigées.

### Questions de référence

Intégrez des **questions de référence** — des tâches avec des réponses correctes connues — tout au long du lot de tâches. Les travailleurs qui échouent aux questions de référence en dessous d'un seuil sont retirés du projet.

```{code-cell} python
import numpy as np
from scipy.stats import binom

rng = np.random.default_rng(42)

def simulate_gold_screening(n_workers=100, gold_per_batch=5,
                             p_good_worker=0.7, good_acc=0.92,
                             bad_acc=0.55, threshold=0.70):
    """
    Simulate quality screening via gold questions.
    Returns: precision and recall of identifying bad workers.
    """
    worker_quality = rng.choice(['good', 'bad'], size=n_workers,
                                 p=[p_good_worker, 1 - p_good_worker])
    results = {'tp': 0, 'fp': 0, 'tn': 0, 'fn': 0}

    for q in worker_quality:
        acc = good_acc if q == 'good' else bad_acc
        n_correct = rng.binomial(gold_per_batch, acc)
        passed = (n_correct / gold_per_batch) >= threshold
        if q == 'bad' and not passed:  results['tp'] += 1
        if q == 'good' and not passed: results['fp'] += 1
        if q == 'bad' and passed:      results['fn'] += 1
        if q == 'good' and passed:     results['tn'] += 1

    tp, fp, fn = results['tp'], results['fp'], results['fn']
    precision = tp / (tp + fp + 1e-6)
    recall    = tp / (tp + fn + 1e-6)
    return precision, recall

# Vary gold question count
gold_counts = [3, 5, 8, 10, 15, 20]
precisions, recalls = [], []
for g in gold_counts:
    p_list, r_list = [], []
    for _ in range(50):
        p, r = simulate_gold_screening(gold_per_batch=g)
        p_list.append(p); r_list.append(r)
    precisions.append(np.mean(p_list))
    recalls.append(np.mean(r_list))

import matplotlib.pyplot as plt
fig, ax = plt.subplots(figsize=(7, 4))
ax.plot(gold_counts, precisions, 'o-', color='#2b3a8f', label='Precision', linewidth=2)
ax.plot(gold_counts, recalls,    's--', color='#0d9e8e', label='Recall',    linewidth=2)
ax.set_xlabel("Gold questions per batch", fontsize=12)
ax.set_ylabel("Screening performance", fontsize=12)
ax.set_title("Worker Screening via Gold Standard Questions", fontsize=13)
ax.legend(fontsize=11); ax.grid(alpha=0.3)
plt.tight_layout()
plt.savefig('gold_screening.png', dpi=150)
plt.show()

p, r = simulate_gold_screening(gold_per_batch=5)
print(f"5 gold questions: Precision={p:.3f}, Recall={r:.3f}")
p, r = simulate_gold_screening(gold_per_batch=10)
print(f"10 gold questions: Precision={p:.3f}, Recall={r:.3f}")
```

---

## Modèles statistiques pour l'agrégation des étiquettes

Le vote majoritaire est une référence naturelle mais ignore les différences de précision entre annotateurs. Les modèles statistiques peuvent faire mieux.

### Le modèle de Dawid-Skene

Le **modèle de Dawid-Skene (DS)** {cite}`dawid1979maximum` estime conjointement :
- La **vraie étiquette** $z_i$ pour chaque élément $i$
- La **matrice de confusion** $\pi_j^{(k,l)}$ pour chaque annotateur $j$ : la probabilité que l'annotateur $j$ étiquette un élément avec la vraie classe $k$ comme classe $l$

L'algorithme EM itère :
- **Étape E :** Étant donné les matrices de confusion des annotateurs, calculer la probabilité a posteriori de chaque vraie étiquette
- **Étape M :** Étant donné les estimations des étiquettes des éléments, mettre à jour les matrices de confusion des annotateurs

```{code-cell} python
import numpy as np
from scipy.special import softmax

def dawid_skene_em(annotations, n_classes, n_iter=20):
    """
    Simplified Dawid-Skene EM for binary classification.
    annotations: dict {item_idx: [(annotator_idx, label), ...]}
    Returns: estimated true labels and annotator accuracies.
    """
    items = sorted(annotations.keys())
    n_items = len(items)
    annotators = sorted({a for anns in annotations.values() for a, _ in anns})
    n_annotators = len(annotators)
    ann_idx = {a: i for i, a in enumerate(annotators)}

    # Initialize: majority vote
    T = np.zeros((n_items, n_classes))  # soft label estimates
    for i, item in enumerate(items):
        for _, label in annotations[item]:
            T[i, label] += 1
        T[i] /= T[i].sum()

    # Confusion matrices: shape (n_annotators, n_classes, n_classes)
    PI = np.ones((n_annotators, n_classes, n_classes)) * 0.5

    for _ in range(n_iter):
        # M-step: update confusion matrices
        PI = np.zeros((n_annotators, n_classes, n_classes)) + 1e-6
        for i, item in enumerate(items):
            for ann, label in annotations[item]:
                a = ann_idx[ann]
                for k in range(n_classes):
                    PI[a, k, label] += T[i, k]
        PI /= PI.sum(axis=2, keepdims=True)

        # E-step: update soft label estimates
        T = np.zeros((n_items, n_classes))
        for i, item in enumerate(items):
            log_p = np.zeros(n_classes)
            for ann, label in annotations[item]:
                a = ann_idx[ann]
                log_p += np.log(PI[a, :, label] + 1e-10)
            T[i] = softmax(log_p)

    return {item: T[i] for i, item in enumerate(items)}, PI

# Simulate crowdsourcing scenario
rng = np.random.default_rng(42)
N_ITEMS, N_ANNOTATORS, ANNS_PER_ITEM = 200, 10, 3
true_labels = rng.integers(0, 2, N_ITEMS)
# Annotator accuracies: 3 good (0.9), 4 medium (0.75), 3 noisy (0.6)
accuracies = [0.90]*3 + [0.75]*4 + [0.60]*3

annotations = {}
for i in range(N_ITEMS):
    anns_for_item = []
    chosen = rng.choice(N_ANNOTATORS, ANNS_PER_ITEM, replace=False)
    for a in chosen:
        acc = accuracies[a]
        label = true_labels[i] if rng.random() < acc else 1 - true_labels[i]
        anns_for_item.append((a, int(label)))
    annotations[i] = anns_for_item

# Run Dawid-Skene
soft_labels, confusion = dawid_skene_em(annotations, n_classes=2, n_iter=30)
ds_preds = {i: int(np.argmax(soft_labels[i])) for i in range(N_ITEMS)}

# Compare with majority vote
mv_preds = {}
for i in range(N_ITEMS):
    votes = [l for _, l in annotations[i]]
    mv_preds[i] = int(np.round(np.mean(votes)))

ds_acc = np.mean([ds_preds[i] == true_labels[i] for i in range(N_ITEMS)])
mv_acc = np.mean([mv_preds[i] == true_labels[i] for i in range(N_ITEMS)])

print(f"Majority vote accuracy:  {mv_acc:.3f}")
print(f"Dawid-Skene accuracy:    {ds_acc:.3f}")
print(f"\nEstimated annotator accuracies (diagonal of confusion matrix):")
for a in range(N_ANNOTATORS):
    est_acc = np.mean([confusion[a, k, k] for k in range(2)])
    print(f"  Annotator {a}: estimated={est_acc:.3f}, true={accuracies[a]:.2f}")
```

### MACE

**MACE (Estimation de la Compétence Multi-Annotateurs)** {cite}`hovy2013learning` est un modèle probabiliste alternatif qui représente explicitement le comportement de spam (étiquetage aléatoire) des annotateurs par opposition à l'annotation compétente. Un annotateur fournit soit une étiquette significative (avec probabilité $1 - \text{spam}_j$) soit une étiquette aléatoire (avec probabilité $\text{spam}_j$). Ce modèle à deux composantes est souvent mieux calibré que Dawid-Skene pour les scénarios de production participative où certains annotateurs sont de purs spammeurs.

---

## Redondance et stratégie d'agrégation

Le nombre optimal d'annotateurs par élément dépend de la difficulté de la tâche et de la qualité des annotateurs :

- **Tâches faciles avec des annotateurs qualifiés :** 1 à 2 annotateurs par élément est souvent suffisant
- **Tâches modérées avec des annotateurs formés :** 3 annotateurs + vote majoritaire
- **Tâches difficiles/subjectives avec des travailleurs de production participative :** 5 à 7 annotateurs + Dawid-Skene

L'intuition clé : la redondance est la plus précieuse quand la précision des annotateurs est faible. Pour des annotateurs de précision $p$, la précision du vote majoritaire avec $n$ annotateurs est :

$$
P(\text{VM correct}) = \sum_{k > n/2}^{n} \binom{n}{k} p^k (1-p)^{n-k}
$$

Pour $p = 0{,}70$, ajouter un troisième annotateur augmente la précision du vote majoritaire de 70 % à 78 % ; pour $p = 0{,}90$, le gain d'un troisième annotateur est négligeable (de 90 % à 97 %).

```{seealso}
Modèle de Dawid-Skene : {cite}`dawid1979maximum`. MACE : {cite}`hovy2013learning`. Pour une revue complète de la production participative pour le TAL : {cite}`snow2008cheap`. Éthique de la foule et rémunération équitable : voir le Chapitre 15.
```
