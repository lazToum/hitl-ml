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

# Une taxonomie de l'interaction homme–machine

Un vocabulaire précis est le préalable à une pensée claire. Le terme « humain dans la boucle » est utilisé de manière imprécise en pratique — tantôt pour signifier qu'un humain étiquette des données d'entraînement, tantôt qu'un humain peut outrepasser la décision d'un modèle, et tantôt qu'un humain dirige activement le processus d'apprentissage en temps réel. Ce sont des choses significativement différentes.

Ce chapitre cartographie le paysage de l'interaction homme–machine dans l'apprentissage automatique, en fournissant le vocabulaire conceptuel utilisé tout au long du reste du manuel.

---

## Niveaux d'automatisation

La distinction la plus fondamentale concerne le degré d'implication active de l'humain dans la prise de décision du système. Un cadre bien connu issu de la théorie de l'automatisation {cite}`sheridan1992telerobotics` distingue dix niveaux, mais pour les besoins de l'apprentissage automatique, trois catégories capturent l'essentiel de la variation :

### L'humain dans la boucle (HITL)

L'humain est un *participant actif au processus d'apprentissage*. Les décisions — ou du moins les décisions importantes — nécessitent un apport humain avant d'être finalisées. Le système ne peut pas fonctionner sans une implication humaine continue.

*Exemples :* Un système d'apprentissage actif qui interroge un clinicien avant d'ajouter un cas aux données d'entraînement. Un annotateur qui étiquette des exemples immédiatement utilisés pour la mise à jour du modèle. Un évaluateur RLHF comparant des sorties de modèle.

### L'humain sur la boucle (HOTL)

Le système fonctionne de manière autonome, mais un humain le surveille et peut intervenir. L'humain est un *superviseur*, non un participant. Le retour peut ou non alimenter à nouveau l'entraînement.

*Exemples :* Un système de modération de contenu qui signale automatiquement les publications ; un examinateur humain échantillonne et corrige une fraction des décisions. Un pilote automatique qui pilote l'avion mais alerte le pilote en cas d'anomalie.

### L'humain aux commandes (HIC)

L'humain prend toutes les décisions ; le système fournit des *recommandations ou des informations* mais n'a pas d'autonomie. C'est la forme la plus faible de déploiement d'apprentissage automatique.

*Exemples :* Un système d'aide au diagnostic qui montre à un médecin l'estimation de probabilité du modèle, mais laisse la décision finale entièrement au praticien.

```{admonition} Quel niveau est approprié ?
:class: tip

Le niveau d'automatisation approprié dépend du coût des erreurs, de la fiabilité du modèle, de l'expertise des humains disponibles et des contraintes de latence de la tâche. Ces facteurs évoluent à mesure qu'un modèle mûrit — la plupart des systèmes démarrent en HITL et migrent vers HOTL lorsque la confiance s'établit.
```

```text
Données brutes --> Prétraitement --> Caractéristiques --> Entraînement --> Évaluation --> Déploiement
    ^                    ^                                    ^                ^               ^
    |                    |                                    |                |               |
Collection          Annotation                          Apprentissage      Test          Surveillance
 feedback           & étiquetage                           actif           feedback      & correction
```

| Étape          | Rôle humain                                                      | Chapitre |
|----------------|------------------------------------------------------------------|----------|
| Collection     | Décider quelles données collecter ; stratégie d'échantillonnage  | 3, 4     |
| Annotation     | Assigner des étiquettes, des structures, des métadonnées         | 3, 13    |
| Entraînement   | Requêtes d'apprentissage actif ; retour en ligne                 | 4, 5, 6  |
| Évaluation     | Évaluation humaine des sorties du modèle                        | 14       |
| Déploiement    | Surveillance, gestion des exceptions, corrections               | 12, 14   |

---

## Implication humaine active vs. passive

Dans un HITL *actif*, le système sélectionne les points de données à présenter à l'humain — en posant des questions de manière stratégique. Dans un HITL *passif*, l'humain fournit un retour sur les données qui arrivent quelles qu'elles soient (par exemple, des lots d'étiquetage attribués séquentiellement).

L'implication active est plus efficace car le retour est dirigé là où il améliorera le plus le modèle. L'implication passive est plus simple à mettre en œuvre et à gérer.

Une distinction connexe est celle entre le retour **par lots** et **en ligne** :

- **Par lots :** Les humains étiquettent un grand ensemble d'exemples ; le modèle se ré-entraîne. On répète.
- **En ligne (flux continu) :** Le retour humain arrive en continu ; le modèle se met à jour de manière incrémentale.

Les flux de travail par lots sont la norme dans l'industrie (projets d'annotation suivis de cycles d'entraînement). Les flux de travail en ligne sont plus naturels pour les systèmes interactifs et les contextes d'apprentissage par renforcement.

---

## Annotateurs uniques vs. multiples

La plupart des présentations formelles du HITL supposent un seul annotateur cohérent. En pratique, l'annotation implique de nombreuses personnes, et leurs jugements diffèrent.

**L'agrégation** combine plusieurs annotations en une seule étiquette, typiquement par vote majoritaire ou par un modèle statistique (Chapitre 13).

**Le désaccord comme signal** — certains chercheurs soutiennent que le désaccord des annotateurs est une information précieuse qui ne devrait pas être réduite à une seule étiquette « de référence ». Les approches perspectivistes du traitement automatique des langues, par exemple, préservent plusieurs annotations sous forme d'étiquettes souples reflétant l'ambiguïté réelle des données {cite}`uma2021learning`.

---

## Un cadre unifié

Nous pouvons représenter toute configuration HITL par un quintuplet :

$$
\text{Config HITL} = (\text{niveau}, \text{modalité}, \text{étape}, \text{fréquence}, \text{annotateurs})
$$

où :

- **niveau** $\in$ {HITL, HOTL, HIC}
- **modalité** $\in$ {étiquette, correction, démonstration, préférence, LN, implicite}
- **étape** $\in$ {collection, annotation, entraînement, évaluation, déploiement}
- **fréquence** $\in$ {lots, en ligne}
- **annotateurs** $\in \mathbb{N}^+$ (nombre d'annotateurs par élément)

Cette taxonomie nous permet de comparer des systèmes HITL divers selon les mêmes axes et de raisonner sur les compromis entre eux. Le reste du manuel explore en profondeur des cellules spécifiques de cet espace.

```{seealso}
Pour une étude empirique de la façon dont les décisions d'annotation affectent le comportement ultérieur du modèle, voir {cite}`bender2021stochastic`. Pour une revue des systèmes d'apprentissage automatique interactif, voir {cite}`amershi2014power`.
```
