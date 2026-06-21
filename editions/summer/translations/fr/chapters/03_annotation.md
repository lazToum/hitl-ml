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

# Annotation et étiquetage des données

L'annotation de données est la forme d'implication humaine la plus répandue dans l'apprentissage automatique. Avant qu'un modèle puisse apprendre, quelqu'un doit lui indiquer quelles sont les bonnes réponses — et ce quelqu'un est généralement un humain. Ce chapitre couvre la théorie et la pratique de l'annotation : ce qui rend l'annotation difficile, comment concevoir des tâches d'annotation, comment mesurer la qualité, et comment gérer les désaccords.

---

## Types d'annotation

Les tâches d'annotation varient énormément dans leur structure, leur difficulté et leur coût. Les principaux types comprennent :

### Classification

L'annotateur assigne chaque instance à l'une des $K$ catégories prédéfinies. C'est la tâche d'annotation la plus simple sur le plan cognitif, mais définir un bon schéma de catégories (une *taxonomie*) peut s'avérer étonnamment difficile.

La **classification binaire** (est-ce une image de chat ?) est le cas le plus simple. La **classification multiclasse** (quelle espèce est cet animal ?) demande aux annotateurs de choisir une option parmi une liste. L'annotation **multi-étiquettes** (quels sujets couvre cet article ?) autorise plusieurs étiquettes simultanées.

### Étiquetage de séquences

Chaque token d'une séquence reçoit une étiquette. La Reconnaissance d'Entités Nommées (NER) en est l'exemple canonique — les annotateurs marquent des spans de texte comme PERSONNE, ORGANISATION, LIEU, etc. L'annotation est généralement réalisée à l'aide du schéma de balisage BIO (Début-Intérieur-Extérieur) ou BIOES :

```text
  B-ORG    O           B-ORG    O     O      O
```

### Annotation de spans et de relations

Au-delà de l'étiquetage des tokens individuels, les annotateurs peuvent avoir besoin de :
- Identifier des spans (expressions multi-tokens) et leur assigner des types
- Marquer des *relations* entre spans (« Apple » a ACQUIS « Shazam »)
- Annoter des chaînes de coréférence (toutes les mentions de la même entité)

Ces tâches sont cognitivement exigeantes et présentent un accord inter-annotateurs plus faible.

### Boîtes englobantes et détection d'objets

Les annotateurs dessinent des rectangles autour des objets dans les images et assignent une étiquette de catégorie à chaque boîte. La précision de localisation est importante : une boîte trop petite manque le contexte ; une boîte trop grande inclut le fond. Les outils d'annotation modernes calculent l'intersection sur l'union (IoU) avec les annotations de référence pour signaler les problèmes de qualité.

### Segmentation

Annotation au niveau des pixels : chaque pixel est assigné à une classe (segmentation sémantique) ou à une instance d'objet spécifique (segmentation d'instance). La segmentation de haute qualité est parmi les types d'annotation les plus coûteux, avec des tarifs allant de plusieurs dizaines à plus d'une centaine de dollars par image pour des scènes complexes, selon le domaine et les outils disponibles.

### Transcription et traduction

Audio → texte (données d'entraînement pour la reconnaissance automatique de la parole), écriture manuscrite → texte (données OCR), ou langue source → langue cible (données pour la traduction automatique). Ces tâches exigent une expertise linguistique et ne peuvent pas être réalisées de manière fiable par des annotateurs non formés.

---

## Consignes d'annotation

Le déterminant le plus important de la qualité d'annotation est la qualité des **consignes d'annotation** : les instructions écrites que suivent les annotateurs.

De bonnes consignes :
- Énoncent l'objectif de la tâche et expliquent *pourquoi* l'étiquette est importante
- Fournissent une définition claire de chaque catégorie avec des exemples positifs et négatifs
- Traitent explicitement les cas limites et les cas difficiles courants
- Précisent la conduite à tenir en cas d'incertitude (par exemple, marquer « passer » vs. choix forcé)
- Incluent des exemples travaillés d'annotation complète

Les mauvaises consignes demandent aux annotateurs d'utiliser leur « bon sens » pour les cas limites — ce qui conduit à des décisions incohérentes qui dégradent la qualité du modèle et font croître le désaccord inter-annotateurs.

```{admonition} Le développement des consignes est itératif
:class: note

Ne vous attendez pas à rédiger des consignes parfaites d'emblée. Effectuez un petit tour d'annotation pilote, analysez les désaccords et mettez à jour les consignes. Répétez. Des consignes bien développées passent généralement par 3 à 5 cycles de révision avant de se stabiliser.
```

---

## Mesurer la qualité d'annotation : l'accord inter-annotateurs

Quand plusieurs annotateurs étiquettent les mêmes données, leur accord peut être mesuré. Un accord élevé suggère que la tâche est bien définie et que les annotateurs l'ont comprise. Un accord faible suggère une ambiguïté dans la tâche, les consignes ou les données elles-mêmes.

### Le kappa de Cohen

Pour deux annotateurs étiquetant des données dans $K$ catégories, le **kappa de Cohen** {cite}`cohen1960coefficient` corrige l'accord observé en tenant compte du hasard :

$$
\kappa = \frac{P_o - P_e}{1 - P_e}
$$

où $P_o$ est l'accord proportionnel observé et $P_e$ est la probabilité d'accord par hasard (calculée à partir des distributions marginales des étiquettes).

$\kappa = 1$ signifie un accord parfait ; $\kappa = 0$ signifie un accord équivalent au hasard ; $\kappa < 0$ signifie un désaccord systématique.

| Plage de $\kappa$ | Interprétation        |
|-------------------|-----------------------|
| $< 0$             | Inférieur au hasard   |
| $0{,}0 - 0{,}20$  | Léger                 |
| $0{,}21 - 0{,}40$ | Passable              |
| $0{,}41 - 0{,}60$ | Modéré                |
| $0{,}61 - 0{,}80$ | Substantiel           |
| $0{,}81 - 1{,}00$ | Presque parfait       |

### Le kappa de Fleiss

Étend le kappa de Cohen à $M > 2$ annotateurs. Chaque annotateur étiquette indépendamment chaque élément ; la formule agrège les annotateurs :

$$
\kappa_F = \frac{\bar{P} - \bar{P}_e}{1 - \bar{P}_e}
$$

où $\bar{P}$ est l'accord par paires moyen sur tous les couples d'annotateurs, et $\bar{P}_e$ est l'accord attendu sous affectation aléatoire.

### L'alpha de Krippendorff

La métrique la plus générale, prenant en charge n'importe quel nombre d'annotateurs, tout type d'échelle (nominale, ordinale, par intervalles, par ratios), et les données manquantes {cite}`krippendorff2011computing` :

$$
\alpha = 1 - \frac{D_o}{D_e}
$$

où $D_o$ est le désaccord observé et $D_e$ est le désaccord attendu. L'alpha de Krippendorff est généralement préféré dans les travaux académiques en raison de sa flexibilité.

```{code-cell} python
import numpy as np
from sklearn.metrics import cohen_kappa_score

# Simulate two annotators labeling 200 items into 3 categories
rng = np.random.default_rng(0)
true_labels = rng.integers(0, 3, size=200)

# Annotator 1: mostly agrees with ground truth
ann1 = true_labels.copy()
flip_mask = rng.random(200) < 0.15
ann1[flip_mask] = rng.integers(0, 3, size=flip_mask.sum())

# Annotator 2: less consistent
ann2 = true_labels.copy()
flip_mask2 = rng.random(200) < 0.30
ann2[flip_mask2] = rng.integers(0, 3, size=flip_mask2.sum())

kappa_12 = cohen_kappa_score(ann1, ann2)
kappa_1true = cohen_kappa_score(ann1, true_labels)
kappa_2true = cohen_kappa_score(ann2, true_labels)

print(f"Cohen's κ (ann1 vs ann2):   {kappa_12:.3f}")
print(f"Cohen's κ (ann1 vs truth):  {kappa_1true:.3f}")
print(f"Cohen's κ (ann2 vs truth):  {kappa_2true:.3f}")
```

---

## Gérer les désaccords

Quand les annotateurs sont en désaccord, plusieurs stratégies sont possibles :

### Vote majoritaire

L'étiquette la plus courante est prise comme référence. Simple et robuste quand le nombre d'annotateurs par élément est impair. Échoue quand un sous-groupe minoritaire d'annotateurs est systématiquement plus précis.

### Vote pondéré

Les annotateurs sont pondérés par leur précision estimée (dérivée de l'accord avec une référence ou d'autres annotateurs). Les annotateurs les plus précis ont plus d'influence.

### Étiquettes souples

Plutôt que de réduire les annotations à une seule étiquette, on préserve la distribution. Si 3 annotateurs sur 5 ont dit « positif » et 2 « neutre », cela se représente comme $(p_\text{pos}, p_\text{neutre}, p_\text{nég}) = (0{,}6, 0{,}4, 0{,}0)$. L'entraînement sur des étiquettes souples améliore la calibration.

### Arbitrage

Un annotateur senior ou un expert du domaine tranche les désaccords. C'est la méthode de référence, mais elle est coûteuse ; généralement réservée aux domaines à enjeux élevés.

### Modèles statistiques

Des approches plus sophistiquées modélisent la compétence des annotateurs de manière probabiliste. Le modèle **Dawid-Skene** {cite}`dawid1979maximum` estime simultanément les matrices de confusion des annotateurs et les vraies étiquettes des éléments par EM. Voir le Chapitre 13 pour les détails.

---

## Le bruit d'étiquetage et ses effets

L'annotation réelle est bruitée. Les effets du bruit d'étiquetage sur l'entraînement du modèle dépendent du type de bruit :

- Le **bruit aléatoire** (étiquettes aléatoirement inversées) dégrade les performances, mais les modèles sont étonnamment robustes à des niveaux modérés (jusqu'à ~20 % pour de nombreuses tâches).
- Le **bruit systématique/adversarial** (étiquettes systématiquement erronées selon des schémas spécifiques) est bien plus dommageable et plus difficile à détecter.
- Le **bruit conditionnel à la classe** (erreurs plus probables pour certaines classes) biaise la frontière de décision du modèle.

Une règle empirique pratique : avec $n$ exemples d'entraînement et une fraction $\epsilon$ d'étiquettes corrompues, les performances du modèle se dégradent environ comme si vous disposiez de $(1 - 2\epsilon)^2 n$ exemples propres {cite}`natarajan2013learning`. Pour $\epsilon = 0{,}2$, cela équivaut à perdre 36 % de vos données.

```{code-cell} python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score

rng = np.random.default_rng(42)
X, y = make_classification(n_samples=2000, n_features=20, random_state=42)

noise_levels = np.linspace(0, 0.45, 15)
mean_accs = []

for eps in noise_levels:
    y_noisy = y.copy()
    flip = rng.random(len(y)) < eps
    y_noisy[flip] = 1 - y_noisy[flip]
    scores = cross_val_score(LogisticRegression(max_iter=500), X, y_noisy, cv=5)
    mean_accs.append(scores.mean())

plt.figure(figsize=(7, 4))
plt.plot(noise_levels, mean_accs, 'o-', color='#2b3a8f', linewidth=2)
plt.xlabel("Label noise rate (ε)", fontsize=12)
plt.ylabel("Cross-validated accuracy", fontsize=12)
plt.title("Effect of Label Noise on Model Performance", fontsize=13)
plt.axvline(0.2, color='#e05c5c', linestyle='--', alpha=0.7, label='20% noise')
plt.legend()
plt.tight_layout()
plt.savefig('label_noise_effect.png', dpi=150)
plt.show()
print(f"\nAccuracy at 0% noise:  {mean_accs[0]:.3f}")
print(f"Accuracy at 20% noise: {mean_accs[round(0.2 / 0.45 * 14)]:.3f}")
print(f"Accuracy at 40% noise: {mean_accs[-2]:.3f}")
```

---

## Coût et débit d'annotation

Comprendre l'économie de l'annotation est essentiel pour la planification des projets.

| Type de tâche                    | Débit typique       | Coût par élément (spécialiste) |
|----------------------------------|---------------------|---------------------------------|
| Classification binaire d'images  | 200–500/h           | 0,02–0,10 $                    |
| NER (texte court)                | 50–150 éléments/h   | 0,10–0,50 $                    |
| Extraction de relations          | 20–60 éléments/h    | 0,30–1,50 $                    |
| Segmentation d'images médicales  | 5–30 éléments/h     | 10–100 $                       |
| Annotation vidéo                 | 5–20 min vidéo/h    | 20–200 $                       |

Ces chiffres sont des estimations approximatives d'ordre de grandeur et varient considérablement selon l'expertise du domaine requise, la qualité de l'outil d'annotation, la clarté des consignes et l'expérience de l'annotateur. Ils sont à titre indicatif, non prescriptif.

```{seealso}
Les options d'outils d'annotation sont couvertes au Chapitre 12. Les modèles statistiques pour l'annotation en production participative (Dawid-Skene, MACE) sont traités au Chapitre 13.
```
