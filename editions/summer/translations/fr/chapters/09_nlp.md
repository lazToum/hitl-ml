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

# L'humain dans la boucle en traitement automatique des langues

Le langage naturel est le domaine où le HITL ML a sans doute eu le plus grand impact — et où ses difficultés conceptuelles les plus profondes se manifestent. Le langage est intrinsèquement social : sa signification est construite par des communautés humaines, sa pragmatique dépend du contexte et de l'intention, et sa qualité ne peut être jugée que par des lecteurs humains. Mais cela signifie également que l'annotation en TAL n'est pas simplement un processus de collecte d'observations. C'est un processus de *construction* de catégories.

---

## Le problème constitutif dans l'annotation en TAL

En imagerie médicale, il existe une vérité de terrain : une tumeur est présente ou elle ne l'est pas. L'étiquette du radiologue peut être incertaine, mais elle tente de suivre quelque chose de réel. L'annotation en TAL est souvent fondamentalement différente. Quand un annotateur marque un tweet comme « toxique », il n'y a pas de molécule toxique dans le tweet que nous tentons de détecter. **L'étiquette constitue la catégorie.**

Cela a des conséquences profondes qui sont fréquemment sous-estimées :

**La main-d'œuvre d'annotation définit le phénomène.** Un schéma d'étiquettes pour le « discours offensant » encode les sensibilités de celui qui l'a conçu et de ceux qui l'ont appliqué. Une équipe d'annotateurs anglophones issus d'un seul groupe démographique, travaillant sous des consignes rédigées par une équipe de politique d'entreprise, produit un jeu de données qui reflète la compréhension de cette équipe des offenses — non un standard humain universel. Les modèles entraînés sur de telles données exhiberont ces mêmes frontières implicites.

**Les consignes sont de la théorie, qu'elles le reconnaissent ou non.** Tout schéma d'annotation formule des affirmations sur l'ontologie. Décider que « l'ironie » et le « sarcasme » appartiennent à la même classe est une affirmation théorique, non une commodité neutre. Décider d'étiqueter « la colère » comme une classe unique plutôt que de distinguer « la colère juste » de la « colère hostile » effondre une distinction qui peut importer pour la tâche en aval. Ces décisions sont prises sous pression de production et rarement revisitées.

**L'instabilité des étiquettes dans le temps.** Le langage social évolue. Un modèle de toxicité entraîné en 2018 mal classifiera le contenu de 2024 non pas parce qu'il est statistiquement sous-entraîné, mais parce que la signification sociale de certains termes a changé. L'annotation en TAL n'échantillonne pas une distribution statique — elle échantillonne une cible mouvante que l'acte d'étiquetage contribue partiellement à constituer.

:::{admonition} Le problème des artefacts d'annotation
:class: important

Geva et al. {cite}`geva2019annotator` ont démontré que les jeux de données d'inférence en langue naturelle (NLI) contiennent des artefacts systématiques introduits par le processus d'annotation lui-même. Les annotateurs invités à rédiger des hypothèses « d'implication » pour une prémisse donnée tendent à utiliser certains schémas syntaxiques ; ceux qui rédigent des hypothèses de « contradiction » en utilisent d'autres. Les modèles apprennent à classifier sur la base de ces artefacts plutôt que de la relation sémantique visée — ils résolvent la tâche d'annotation, non la tâche TAL sous-jacente.

Ce n'est pas de la négligence. C'est une conséquence inhérente du fait de demander aux humains de construire des exemples pour correspondre à une étiquette. Le processus HITL insère un signal systématique qui n'était jamais censé être dans les données.
:::

---

## Annotation de classification de texte

La tâche d'annotation TAL la plus simple est l'attribution d'une catégorie à un document textuel. L'analyse de sentiment, la classification thématique, la détection d'intention et le filtrage de spam sont tous des tâches de classification.

**Défis spécifiques à la classification de texte :**

*Subjectivité.* Les catégories comme « toxique » ou « offensant » sont intrinsèquement subjectives et varient selon les contextes culturels, les antécédents des annotateurs et le contexte de la plateforme. D'un annotateur à l'autre, les perceptions de l'offensivité diffèrent significativement selon les données démographiques — un fait aux implications directes pour l'équité {cite}`blodgett2020language`.

*Ambiguïté des étiquettes.* De nombreux documents appartiennent à plusieurs catégories ou se situent à la frontière. Une critique à 60 % positive et 40 % négative est genuinement ambiguë, non mal étiquetée. Forcer une seule étiquette écarte de véritables informations (voir le Chapitre 13 sur les étiquettes souples et le désaccord des annotateurs).

*Granularité des étiquettes.* Un modèle de sentiment à 2 classes peut suffire pour la surveillance des médias sociaux ; une échelle à 7 points peut être nécessaire pour l'analyse des retours produits. La granularité appropriée dépend de la tâche en aval, mais est généralement fixée avant l'annotation — une décision de conception conséquente prise avec des données insuffisantes.

---

## Reconnaissance d'entités nommées

L'annotation NER nécessite d'identifier des spans de texte et d'assigner un type d'entité (PERSONNE, ORGANISATION, LIEU, etc.). L'annotation est plus complexe que la classification de documents pour plusieurs raisons :

**Les frontières de span sont ambiguës.** Dans « le PDG d'Apple Tim Cook a annoncé... », l'entité PERSONNE couvre-t-elle « Tim Cook » ou « le PDG d'Apple Tim Cook » ? Les consignes doivent explicitement traiter ces cas, et l'accord inter-annotateurs sur les spans est systématiquement inférieur à celui sur les types.

**L'attribution de types nécessite une connaissance du monde.** « Apple » est une ORG dans un contexte, un PRODUIT dans un autre, et sans doute aucun des deux dans « tarte aux pommes ». Les annotateurs ont besoin d'une connaissance du domaine suffisante pour faire des attributions de types correctes.

**Entités imbriquées.** « L'Université de Californie, Berkeley » contient une ORGANISATION imbriquée dans un LIEU. Le balisage BIO standard ne peut pas représenter les entités imbriquées ; des schémas plus complexes (par exemple BIOES, ou des formats basés sur des graphes) sont requis.

**Efficacité d'annotation.** La pré-annotation avec un modèle NER de référence accélère significativement l'annotation en permettant aux annotateurs de corriger les prédictions plutôt que d'annoter de zéro. Dans une étude sur la NER clinique, des augmentations de débit de 30 à 60 % ont été observées {cite}`lingren2014evaluating` ; l'ampleur de ces gains dépend fortement de la qualité du modèle de référence et du domaine.

---

## Extraction de relations et annotation sémantique

Au-delà de l'identification des entités, l'extraction de relations exige l'annotation des *relations* entre entités :

- Les annotateurs doivent comprendre à la fois les entités et le prédicat qui les relie
- Les types de relations ont des distinctions sémantiques complexes (TRAVAILLE\_POUR vs. EST\_EMPLOYÉ\_PAR vs. A\_FONDÉ)
- Les exemples négatifs (paires d'entités sans relation) sont bien plus courants que les positifs

**L'accord inter-annotateurs pour l'extraction de relations** tend à être inférieur à celui des tâches de classification. Pour des schémas bien définis, des valeurs de $\kappa$ dans la plage 0,65–0,80 sont couramment rapportées {cite}`pustejovsky2012natural` ; pour des relations sémantiques complexes (causalité d'événements, relations temporelles), l'accord peut être considérablement plus faible selon la conception du schéma et la formation des annotateurs.

---

## Post-édition de traduction automatique (MTPE)

La post-édition de traduction automatique est une forme mature du HITL en TAL. Un traducteur humain corrige la sortie d'un système de TA plutôt que de traduire à partir de zéro :

**Post-édition légère (LPE) :** Seules les erreurs critiques sont corrigées. Appropriée quand les exigences de qualité de traduction sont modérées.

**Post-édition complète (FPE) :** La sortie est corrigée jusqu'à une qualité de publication. La sortie éditée devient typiquement des données d'entraînement pour une amélioration ultérieure de la TA — un véritable cycle de raffinement avec l'humain dans la boucle.

**HTER (Taux d'édition ciblée humaine) :** Une métrique qui mesure la distance d'édition entre la sortie de la TA et la traduction post-éditée, normalisée par la longueur de la phrase {cite}`graham2015accurate`. En règle générale praticienne approximative, un HTER inférieur à environ 0,3 est souvent considéré comme une bonne sortie de TA ; au-dessus de 0,5, la traduction à partir de zéro peut être plus rapide — bien que ces seuils varient selon le domaine et la paire de langues.

---

## IA conversationnelle et annotation de dialogues

L'annotation de dialogue introduit une structure temporelle :

- **Annotation au niveau du tour :** étiqueter chaque tour (intention, sentiment, qualité)
- **Annotation au niveau du dialogue :** évaluer la cohérence globale, le succès de la tâche, la satisfaction de l'utilisateur
- **Annotation de trace d'interaction :** identifier des moments de défaillance spécifiques dans une conversation

Le HITL est particulièrement important dans le dialogue parce que les défaillances du modèle sont souvent subtiles et cumulatives : une erreur factuelle au tour 3 peut ne pas devenir apparente avant le tour 7. Les annotateurs humains qui tracent des conversations peuvent identifier ces schémas de défaillance à longue portée que les métriques automatisées manquent entièrement.

---

## Étiquetage programmatique et supervision faible

Quand les données étiquetées sont rares, la **supervision faible** permet d'utiliser plusieurs fonctions d'étiquetage bruitées et se chevauchant pour générer des étiquettes probabilistes à grande échelle. **Snorkel** {cite}`ratner2017snorkel` est le cadre canonique :

```{code-cell} python
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import f1_score

rng = np.random.default_rng(42)

# -------------------------------------------------------
# Toy weak supervision: sentiment classification
# 5 labeling functions (LFs) with different coverage/accuracy
# Label: +1 (positive), -1 (negative), 0 (abstain)
# -------------------------------------------------------

N = 1000
true_labels = rng.choice([-1, 1], size=N)
X_features = np.column_stack([
    true_labels * 0.8 + rng.normal(0, 0.5, N),
    rng.normal(0, 1, N),
    rng.normal(0, 1, N),
])

def make_lf(accuracy, coverage, seed):
    rng_lf = np.random.default_rng(seed)
    votes = np.zeros(N, dtype=int)
    active = rng_lf.random(N) < coverage
    correct = rng_lf.random(N) < accuracy
    votes[active & correct]  = true_labels[active & correct]
    votes[active & ~correct] = -true_labels[active & ~correct]
    return votes

LFs = np.column_stack([
    make_lf(accuracy=0.85, coverage=0.60, seed=1),
    make_lf(accuracy=0.78, coverage=0.45, seed=2),
    make_lf(accuracy=0.70, coverage=0.80, seed=3),
    make_lf(accuracy=0.90, coverage=0.30, seed=4),
    make_lf(accuracy=0.60, coverage=0.90, seed=5),
])

def majority_vote(LF_matrix):
    labels = []
    for i in range(LF_matrix.shape[0]):
        votes = LF_matrix[i][LF_matrix[i] != 0]
        labels.append(0 if len(votes) == 0 else int(np.sign(votes.sum())))
    return np.array(labels)

mv_labels = majority_vote(LFs)
covered = mv_labels != 0

print(f"Coverage:                    {covered.mean():.1%}")
print(f"MV accuracy (covered):       {(mv_labels[covered] == true_labels[covered]).mean():.3f}")

X_train, y_train = X_features[covered], mv_labels[covered]
X_test,  y_test  = X_features[~covered], true_labels[~covered]

if len(X_train) > 10 and len(X_test) > 10:
    clf = LogisticRegression().fit(X_train, y_train)
    preds = clf.predict(X_test)
    print(f"F1 on uncovered test set:    {f1_score(y_test, preds):.3f}")
```

---

## RLHF pour les modèles de langage : la réalité de l'annotation

Le Chapitre 6 a couvert le RLHF techniquement. Du point de vue du TAL, la tâche d'annotation est plus difficile qu'elle n'y paraît de l'extérieur.

**Ce que l'on demande réellement aux annotateurs** — comparer deux sorties du modèle et indiquer laquelle est « meilleure » — semble simple. En pratique, « meilleure » est un concept sous-spécifié que les annotateurs résolvent à l'aide d'heuristiques personnelles. Certains pondèrent fortement la fluidité ; d'autres pondèrent la précision factuelle ; d'autres pénalisent la verbosité. Sans consignes strictes, le jeu de données de préférences résultant ne reflète pas les valeurs humaines en abstrait mais les stratégies de résolution particulières de la main-d'œuvre d'annotation employée.

**Les dimensions d'annotation clés sont :**

- *Utilité :* La réponse répond-elle bien à la question ? Est-elle informative, claire et appropriément détaillée ?
- *Exactitude factuelle :* La réponse est-elle factuellement précise ? Cela exige des évaluateurs une connaissance du domaine — une exigence qui crée de sérieux problèmes de qualité à grande échelle, puisque les annotateurs généralistes ne peuvent pas vérifier les affirmations de spécialistes.
- *Inoffensivité :* La réponse évite-t-elle un contenu toxique, biaisé, nuisible ou inapproprié ? Ces jugements nécessitent des consignes détaillées car « nuisible » est hautement dépendant du contexte et varie selon les cultures, les époques et le contexte de la plateforme.
- *Calibration :* La réponse exprime-t-elle une incertitude appropriée ? Les annotateurs préfèrent systématiquement les réponses qui sonnent sûres d'elles, ce qui crée un signal de récompense contre l'humilité épistémique appropriée.

L'interaction entre les critères est complexe : une réponse maximalement utile à une question dangereuse peut être maximalement nuisible. Les consignes doivent spécifier comment arbitrer entre des critères concurrents — et ces arbitrages sont effectivement des décisions politiques, non des décisions d'annotation. La main-d'œuvre d'annotation fait de la politique.

**L'échelle concentre l'influence démographique.** Le RLHF pour les grands modèles implique des effectifs d'annotation relativement réduits (de quelques centaines à quelques milliers) prenant des milliards de décisions en aval. Les biais démographiques et culturels de cette main-d'œuvre se propagent dans le comportement du modèle à grande échelle d'une manière qui ne se produirait pas si l'annotation était plus distribuée. C'est l'un des problèmes structurels les moins discutés du pipeline RLHF actuel.

---

## La boucle de retour annotation–modèle

En TAL plus que dans tout autre domaine, les processus d'annotation et de développement du modèle s'entremêlent dans le temps :

1. Les annotateurs sont calibrés en utilisant les sorties existantes du modèle comme référence (souvent implicitement).
2. Le modèle de récompense apprend ce que les annotations tendent à préférer.
3. Le générateur est affiné pour produire des sorties qui obtiennent une récompense élevée.
4. Ces sorties influencent ce à quoi ressemble une « bonne » réponse dans les tours d'annotation suivants.

Cette boucle de retour n'est pas intrinsèquement pathologique — c'est ce qui permet au RLHF de converger — mais elle signifie que le comportement du modèle est façonné par une cible mouvante que le processus d'annotation lui-même contribue à déplacer. Distinguer ce que le modèle a appris parce que cela reflète les préférences humaines de ce qu'il a appris parce qu'il a appris à reconnaître les heuristiques des annotateurs est empiriquement difficile.

Il n'y a pas de solution propre. La meilleure pratique actuelle consiste à surveiller la dérive à l'aide de jugements de préférences mis de côté collectés à intervalles réguliers, et à traiter la version des consignes d'annotation comme une variable expérimentale.

---

## Évaluation des modèles TAL génératifs

Contrairement aux modèles de classification qui ont une métrique de précision claire, l'évaluation de la qualité de génération nécessite le jugement humain :

| Méthode d'évaluation | Description | Coût |
|---|---|---|
| Évaluation directe (DA) | Les annotateurs évaluent la qualité sur une échelle | Moyen |
| Jugement comparatif | Les annotateurs comparent deux sorties | Faible |
| MQM (Métriques de qualité multidimensionnelles) | Taxonomie structurée des erreurs | Élevé |
| Préférence RLHF | Étiquettes de préférences utilisées pour l'entraînement | Moyen |
| LLM-comme-juge | Un LLM évalue les sorties (corrèle modérément avec l'humain) | Très faible |
| BERTScore, BLEU | Métriques automatiques (corrélation imparfaite avec le jugement humain) | Très faible |

Les métriques automatiques (BLEU pour la TA, ROUGE pour la résumé) sont peu coûteuses mais imparfaitement corrélées avec les jugements humains de qualité {cite}`reiter2018structured`. Les approches LLM-comme-juge montrent un accord modéré avec les annotateurs humains {cite}`zheng2023judging` et sont de plus en plus utilisées pour les itérations rapides, mais ne devraient pas remplacer l'évaluation humaine pour les évaluations finales. Pour les décisions à enjeux réels, l'évaluation humaine reste nécessaire.

```{seealso}
Supervision faible Snorkel : {cite}`ratner2017snorkel`. Consignes d'annotation en TAL : {cite}`pustejovsky2012natural`. Artefacts d'annotation dans la NLI : {cite}`geva2019annotator`. Biais des annotateurs et jeux de données TAL : {cite}`blodgett2020language`. Pour l'évaluation des modèles génératifs : {cite}`reiter2018structured`.
```
