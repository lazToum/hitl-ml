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

# L'Apprentissage automatique avec l'humain dans la boucle
## *Incompris*

```{epigraph}
Il n'y a pas besoin d'une thèse intitulée « L'apprentissage automatique avec l'humain dans la boucle ».
Ou plutôt — il y en a absolument besoin, et elle n'a jamais été écrite.
Ceci n'est pas cette thèse. C'est ce qui vient à sa place.
```

---

Ce manuel est un guide complet, exécutable et délibérément non académique de l'**apprentissage automatique avec l'humain dans la boucle (HITL ML)** — la discipline qui consiste à concevoir des systèmes où le jugement humain et l'intelligence des machines ne se contentent pas de coexister, mais se transforment activement l'un l'autre.

Il est *incompris* d'au moins trois façons :

**Le domaine est incompris.** Demandez à la plupart des gens comment fonctionne l'apprentissage automatique et ils décriront un processus qui s'achève lorsque le modèle est déployé. En réalité, l'humain n'est jamais retiré de la boucle — il est seulement masqué. Derrière chaque système « autonome » se trouvent des annotateurs, des réviseurs, des collecteurs de retours et des ingénieurs qui prennent des décisions de jugement. Le HITL ML rend tout cela visible et délibéré.

**Le rôle de l'humain est incompris.** L'humain dans la boucle n'est pas un échafaudage temporaire destiné à être démonté dès que le modèle est suffisamment bon. Le jugement humain est le signal qui définit ce que « suffisamment bon » veut dire. On ne peut pas spécifier la fonction objectif, la récompense, le schéma d'étiquettes ou la métrique d'évaluation sans qu'un humain décide de ce qui compte. La machine optimise ; l'humain décide quoi optimiser.

**Vous êtes incompris — et moi aussi.** Vous lisez un livre sur le fait d'être intégré dans un système. En le lisant, vous êtes intégré dans un système. Le modèle qui a pu contribuer à générer certaines parties de ce texte a été entraîné sur des retours humains. Les annotations qui ont entraîné les modèles que vous utilisez ont été fournies par des humains dont les noms n'apparaissent nulle part. Nous sommes tous, d'une certaine manière, des humains dans la boucle de quelque chose de plus grand que nous.

Ce livre ne prétend pas le contraire. Il nomme ces humains, décrit leur travail, et soutient que les comprendre est aussi important que de comprendre la descente de gradient.

:::{admonition} Édition française
:class: note
Ceci est la traduction française. L'original en anglais constitue l'édition de référence principale.
:::

---

## Ce que couvre ce manuel

Seize chapitres répartis en six parties, des fondements aux frontières :

**Partie I — Fondements.** Ce qu'est le HITL ML, d'où il vient, et comment penser l'espace des modes d'interaction homme–machine.

**Partie II — Techniques fondamentales.** L'annotation et l'étiquetage, l'apprentissage actif et l'apprentissage automatique interactif — les trois piliers classiques du HITL.

**Partie III — Apprentissage à partir des retours humains.** L'apprentissage par renforcement à partir des retours humains (RLHF), l'apprentissage à partir de démonstrations et l'apprentissage des préférences à partir de comparaisons et de classements — les paradigmes qui alimentent l'alignement moderne de l'IA.

**Partie IV — Applications.** Le TAL, la vision par ordinateur et la santé — le HITL à travers le prisme de domaines réels avec des contraintes réelles.

**Partie V — Systèmes et pratique.** Les plateformes d'annotation, le contrôle qualité du crowdsourcing et les cadres d'évaluation — l'infrastructure qui fait fonctionner le HITL à grande échelle.

**Partie VI — Éthique et horizons.** Les humains derrière les données : l'équité, le bien-être des annotateurs, les biais, et où tout cela nous mène.

---

## Une note sur le code

Chaque chapitre technique comprend du code Python exécutable. Tous les exemples sont autonomes et utilisent des bibliothèques standard : NumPy, scikit-learn, PyTorch, Hugging Face Transformers.

```{code-cell} python
# A taste of what's ahead: querying the most uncertain sample
import numpy as np
from sklearn.linear_model import LogisticRegression

rng = np.random.default_rng(42)
X = rng.normal(size=(100, 2))
y = (X[:, 0] + X[:, 1] > 0).astype(int)

model = LogisticRegression().fit(X[:20], y[:20])

probs = model.predict_proba(X[20:])
entropy = -np.sum(probs * np.log(probs + 1e-9), axis=1)
most_uncertain = np.argmax(entropy) + 20

print(f"Most uncertain sample index: {most_uncertain}")
print(f"Predicted probabilities:     {probs[most_uncertain - 20].round(3)}")
print()
print("The model doesn't know. So we ask a human.")
```

---

## Notation

- $\mathcal{X}$ — espace des entrées ; $\mathcal{Y}$ — espace des étiquettes
- $f_\theta : \mathcal{X} \to \mathcal{Y}$ — un modèle de paramètres $\theta$
- $\mathcal{U}$ — pool non étiqueté ; $\mathcal{L}$ — jeu de données étiqueté
- $h$ — un annotateur humain ; $\mathcal{H}$ — un ensemble d'annotateurs

---

*Vous êtes un humain dans la boucle. Commençons.*
