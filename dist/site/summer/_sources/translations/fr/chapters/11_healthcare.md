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

# L'humain dans la boucle en santé et en sciences

La santé et les sciences représentent deux des domaines où le HITL ML est le plus important et le plus débattu. Les enjeux sont élevés : un cancer manqué ou une cible médicamenteuse erronée a un coût humain réel. L'annotation nécessite une expertise rare et coûteuse. Les exigences réglementaires contraignent ce que les modèles peuvent faire et comment ils doivent être validés. Et contrairement au TAL, où le problème d'annotation est en partie une construction sociale, il existe ici souvent une vérité de terrain réelle — une tumeur est présente ou elle ne l'est pas — même si aucun observateur individuel ne peut la déterminer de manière fiable.

La présentation dominante dans la couverture populaire est « l'IA contre l'humain » : l'IA remplacera-t-elle les radiologues ? Cette présentation est erronée d'une façon qui importe. La vraie question est quelle forme de collaboration humain-IA produit de meilleurs résultats que l'un ou l'autre seul, et comment construire des systèmes qui permettent cette collaboration plutôt que de la perturber.

---

## Analyse d'images médicales

L'imagerie médicale — radiologie (rayons X, scanner, IRM), pathologie (lames de tissu), dermatologie, ophtalmologie — est le domaine où l'IA médicale a progressé le plus rapidement.

### Exigences en matière d'annotateurs experts

L'annotation d'images médicales nécessite généralement des médecins avec une formation spécialisée dans une sous-spécialité. Cela rend l'annotation :

- **Lente :** Les spécialistes ont du temps limité ; l'annotation entre en concurrence avec les obligations cliniques
- **Coûteuse :** Les coûts vont de plusieurs dizaines à plusieurs centaines de dollars par cas annoté, selon la sous-spécialité, la modalité et la complexité de la tâche
- **Variable :** Même les spécialistes ne sont pas d'accord, en particulier sur les cas limites — un fait souvent traité comme un problème mais qui est en réalité informatif

### Variabilité inter-radiologues

La variabilité entre lecteurs est bien documentée en radiologie. Pour l'interprétation des radiographies thoraciques, le désaccord entre lecteurs est substantiel — dans l'étude CheXNet, quatre radiologues ont étiqueté le même ensemble de test de détection de pneumonie avec des scores F1 couvrant environ 12 points de pourcentage {cite}`rajpurkar2017chexnet`, reflétant une incertitude diagnostique réelle sur les cas limites. Pour la détection de nodules en scanner pulmonaire, la variabilité intra-lecteur (même lecteur, même cas, jour différent) peut être aussi grande que la variabilité inter-lecteur.

Cette variabilité n'est pas simplement du bruit — elle reflète une incertitude diagnostique réelle. Les modèles entraînés sur les annotations d'un seul radiologue peuvent apprendre les biais spécifiques de ce médecin plutôt que la pathologie sous-jacente.

:::{admonition} La controverse CheXNet comme leçon HITL
:class: note

Quand Rajpurkar et al. ont prétendu que leur modèle CheXNet « dépassait les performances des radiologues » en détection de pneumonie, la prétention a immédiatement été contestée par la communauté radiologique {cite}`yu2022assessing`. Une partie de la controverse portait sur l'ensemble de test spécifique et la comparaison avec les radiologues. Mais un problème plus profond était méthodologique : la référence de « performance des radiologues » utilisait des lecteurs individuels sous pression de temps, tandis que la radiologie clinique implique typiquement la consultation, la comparaison avec les images antérieures et l'accès au contexte clinique — rien de tout cela n'était disponible pour le modèle.

La leçon n'est pas que le modèle était bon ou mauvais, mais que **les comparaisons de performance nécessitent de spécifier la configuration HITL**. Un modèle qui surpasse un radiologue individuel lisant à froid peut toujours être moins précis qu'un radiologue utilisant la sortie du modèle comme second avis. Ce sont des systèmes différents avec des modes d'erreur différents, et leur agrégation diffère.
:::

:::{admonition} Étiquettes souples en médecine
:class: important

Plusieurs projets d'IA médicale ont adopté des **étiquettes souples** qui reflètent la distribution des opinions d'experts plutôt qu'une seule étiquette « de référence ». Une radiographie thoracique étiquetée comme 60 % pneumonie / 40 % atélectasie par un panel de radiologues porte plus d'information qu'un choix binaire forcé. Les modèles entraînés sur de telles distributions montrent une meilleure calibration et une quantification d'incertitude plus appropriée — et cette incertitude est cliniquement significative, car elle dit au clinicien quand consulter, pas seulement ce que le modèle pense.
:::

### Apprentissage actif pour les maladies rares

L'apprentissage actif est particulièrement précieux pour les maladies rares et les pathologies rares, où même un grand pool non étiqueté ne contient qu'un petit nombre de cas positifs. L'échantillonnage aléatoire standard gaspillerait le temps des experts à étiqueter principalement des cas négatifs.

L'apprentissage actif basé sur l'incertitude sélectionne naturellement les cas limites où le modèle est incertain — qui, pour les conditions rares, tendent à être les cas positifs et les négatifs limites. Cela concentre le temps des spécialistes là où il est le plus précieux. La combinaison de l'entraînement déséquilibré en classes (avec `class_weight='balanced'` ou similaire) et de la sélection basée sur l'incertitude est une pratique standard pour les tâches de détection de pathologies rares.

---

## Annotation de TAL clinique

Les dossiers médicaux électroniques (DME) contiennent une richesse énorme de textes narratifs cliniques : notes des médecins, résumés de sortie, rapports radiologiques, rapports anatomopathologiques. L'extraction d'informations structurées à partir de ces textes nécessite le TAL — et un TAL de haute qualité nécessite des données d'entraînement annotées.

**Tâches d'annotation de TAL clinique courantes :**
- **NER clinique :** Identifier les médicaments, les dosages, les diagnostics, les procédures et les symptômes dans le texte
- **Détection de négation :** « Aucune preuve de pneumonie » vs. « Pneumonie confirmée » — une distinction critique qui est étonnamment difficile
- **Raisonnement temporel :** Distinguer les conditions actuelles des antécédents (« antécédents d'IM, présenté avec douleur thoracique »)
- **Dé-identification :** Supprimer les Informations de Santé Protégées (ISP) pour permettre le partage des données

**La dé-identification des ISP** est à la fois une tâche d'annotation et une exigence de gouvernance des données. En vertu de HIPAA (États-Unis) et du RGPD (UE), les données de santé ne peuvent pas être partagées sans suppression ou anonymisation des identifiants de patients. Des outils de dé-identification automatisés existent mais sont imparfaits ; la révision humaine des sorties automatisées est une pratique standard, et le profil de risque est asymétrique : les faux négatifs (ISP manquées) créent une exposition légale, rendant des seuils conservateurs nécessaires.

### i2b2 / n2c2 comme modèle

Les initiatives de tâches partagées i2b2 (Informatics for Integrating Biology and the Bedside) et leurs successeurs n2c2 (National NLP Clinical Challenges) ont publié une série de jeux de données de TAL clinique annotés par des experts. Ceux-ci illustrent à la fois le potentiel et le coût : les efforts d'annotation impliquent généralement des équipes d'experts du domaine clinique travaillant sur plusieurs mois, annotant des centaines de documents par défi. Les jeux de données n2c2 ont catalysé des progrès rapides précisément parce qu'ils ont résolu le problème de gouvernance du partage de données (dé-identification + accords institutionnels), pas seulement le problème d'annotation.

---

## Considérations réglementaires

L'IA médicale est soumise à une surveillance réglementaire dans la plupart des juridictions.

**FDA (États-Unis) :** Les logiciels comme dispositif médical (SaMD) basés sur l'IA/ML nécessitent une approbation ou une autorisation préalable à la mise sur le marché. Le Plan d'action IA/ML de la FDA de 2021 met l'accent sur des **plans de contrôle des changements prédéterminés** — documentant comment le modèle sera mis à jour et comment ces mises à jour seront validées avant le déploiement. Un modèle qui apprend en continu à partir du retour clinique est, dans ce cadre, un dispositif différent après chaque mise à jour et peut nécessiter une revalidation.

**Marquage CE (Europe) :** Les dispositifs médicaux incluant les systèmes d'IA doivent se conformer au Règlement sur les Dispositifs Médicaux (MDR). Le MDR exige une évaluation clinique, une surveillance post-commercialisation et la documentation des données utilisées pour l'entraînement et la validation.

**Implication HITL clé :** Les cadres réglementaires exigent une documentation claire des processus d'annotation, des qualifications des annotateurs, de la fiabilité inter-évaluateurs et de tout changement aux données d'entraînement. Ce n'est pas de la paperasserie — c'est la piste d'audit qui permet à un clinicien de comprendre quelles données d'entraînement ont produit le comportement actuel du modèle, et c'est légalement requis. Les pipelines HITL qui traitent l'annotation comme un sous-processus informel créent un risque réglementaire qui devient généralement visible au pire moment.

---

## Annotation de données scientifiques

Au-delà de la santé, le HITL ML joue un rôle croissant et sous-estimé dans la recherche scientifique, où le défi d'annotation mêle souvent expertise du domaine et échelle.

### Astronomie : Galaxy Zoo

Galaxy Zoo {cite}`lintott2008galaxy` a externalisé la classification morphologique des galaxies du Sloan Digital Sky Survey à des scientifiques citoyens. Le projet original a collecté plus de 40 millions de classifications de plus de 100 000 bénévoles, démontrant que la classification d'images scientifiques à grande échelle est réalisable quand la tâche peut être décomposée en questions simples répondables sans formation spécialisée (« Cette galaxie est-elle lisse ou présente-t-elle des structures ? »).

L'expérience Galaxy Zoo a produit deux résultats méthodologiques importants. Premièrement, l'accord entre scientifiques citoyens et astronomes professionnels était élevé pour les cas clairs et divergeait systématiquement sur les cas limites — précisément les cas où la distinction importe scientifiquement. La solution n'était pas d'écarter les données des sciences citoyennes sur les cas limites mais de traiter la distribution des réponses des bénévoles comme une étiquette souple encodant une ambiguïté morphologique réelle. Deuxièmement, le classificateur entraîné sur les étiquettes de Galaxy Zoo surpassait les modèles entraînés pour reproduire les étiquettes de n'importe quel expert unique, parce que la distribution de la foule capturait une réelle incertitude visuelle que le choix forcé d'un expert unique effondrait.

### Génomique : Classification de la pathogénicité

L'annotation des variants génomiques — décider si un variant est pathogène, bénin ou de signification incertaine — est un problème à enjeux élevés de TAL et de jugement d'expert. Les bases de données cliniques de variants comme ClinVar agrègent des interprétations d'experts de plusieurs laboratoires soumetteurs, et le désaccord entre laboratoires est courant. L'apprentissage actif est utilisé pour prioriser quels variants nécessitent une révision experte complète (recherche bibliographique, évaluation des preuves fonctionnelles) par rapport à ceux pouvant être auto-classifiés par des preuves existantes. Le résultat est un pipeline hybride où la plupart des variants sont gérés par une logique automatisée, un sous-ensemble nécessite une révision experte, et les cas les plus difficiles sont signalés pour un consensus multi-laboratoires.

### Climat et sciences de la Terre

L'étiquetage d'images satellites pour le changement d'utilisation des terres, la déforestation, l'étendue des glaciers et les trajectoires des tempêtes implique des experts en télédétection et, de plus en plus, des plateformes de sciences citoyennes. Le principal défi HITL dans ce domaine est temporel : les étiquettes faites aujourd'hui peuvent devenir obsolètes à mesure que le monde change, et la vérification de la vérité terrain (enquêtes de terrain) est coûteuse et logistiquement contrainte. L'apprentissage actif qui priorise les images où la prédiction du modèle est en désaccord avec des a priori physiques (par exemple, prédire la déforestation dans une région connue pour être protégée) est une façon pratique de diriger de rares ressources de vérification de terrain.

### Neurosciences : La connectomique

La reconstruction des circuits neuronaux à partir d'images de microscopie électronique — la connectomique — nécessite une annotation au niveau des pixels des membranes neuronales à travers d'énormes piles d'images. Le projet Eyewire a gamifié cette tâche, engageant des dizaines de milliers de joueurs dans le traçage de neurones à travers des volumes d'images 3D. La conception de la gamification a résolu un problème HITL spécifique : la tâche nécessite une attention soutenue et un raisonnement spatial sur de longues sessions, ce qui entraîne une dégradation de la qualité dans l'annotation traditionnelle. Décomposer la tâche en segments de jeu avec des mécanismes sociaux a maintenu l'engagement et la qualité des annotateurs à des échelles que l'annotation professionnelle ne peut pas atteindre.

---

## Gérer les annotateurs spécialistes

Quand l'annotation nécessite une expertise rare, les approches habituelles de production participative (Chapitre 13) ne s'appliquent pas.

**La tension fondamentale** est que les personnes capables de produire les annotations de la plus haute qualité sont aussi celles dont le temps est le plus précieux et le plus contraint. Chaque décision de conception dans un pipeline d'annotation spécialisée devrait être évaluée par rapport à la question : est-ce que cela fait le meilleur usage du temps rare des experts ?

**Ce que cela signifie en pratique :**

- **Pré-annoter agressivement.** Utiliser des annotateurs de niveau inférieur, des modèles automatisés ou des systèmes basés sur des règles pour générer des candidats que le spécialiste révise et corrige plutôt que de créer à partir de zéro. Le jugement du spécialiste est le goulot d'étranglement ; lui fournir une pré-annotation à corriger est plus rapide que de lui demander d'annoter à partir d'un écran vide, à condition que la qualité de la pré-annotation soit suffisante pour que la correction ne soit pas plus lente que de recommencer.

- **Concevoir pour l'attention des experts, non le débit.** Les interfaces d'annotation optimisées pour un débit élevé (décisions binaires rapides, raccourcis clavier, affichage minimal) sont appropriées pour la production participative. L'annotation spécialisée bénéficie souvent d'interfaces plus riches : comparaison côte à côte avec des cas antérieurs, accès facile aux matériaux de référence, champs de confiance d'annotation, et possibilité de signaler un cas pour discussion. Cela ralentit les annotations individuelles mais améliore la qualité et réduit le besoin de ré-annotation.

- **Suivre explicitement les schémas d'annotateurs individuels.** Avec un petit pool de spécialistes, il est faisable et important de suivre le taux d'accord de chaque annotateur avec le panel, de signaler les cas qui semblent incohérents avec leur propre historique et d'en discuter lors de sessions de calibration régulières. Ce n'est pas de la surveillance — c'est le même processus de qualité que la médecine clinique utilise pour les évaluations de performance, et les spécialistes répondent généralement bien quand il est présenté comme une amélioration qualitative partagée plutôt que comme une évaluation.

- **La conception de session est importante.** L'annotation médicale est cognitivement exigeante. Les preuves de la radiologie et de la pathologie suggèrent que les taux d'erreur augmentent de manière mesurable après environ 90 minutes de lecture continue, et que des pauses de quelques minutes seulement peuvent partiellement restaurer l'attention. Les interfaces d'annotation qui imposent des invites de pause (sans possibilité de les ignorer) sont une décision de conception HITL simple avec un impact réel sur la qualité.

---

## Un pipeline HITL d'apprentissage actif pour l'imagerie médicale

```{code-cell} python
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_auc_score
from sklearn.datasets import make_classification
import matplotlib.pyplot as plt

rng = np.random.default_rng(42)

# Simulate a rare-pathology detection task
# 8% positive class (e.g., rare pathology)
X, y = make_classification(
    n_samples=5000, n_features=100,
    n_informative=20, n_redundant=10,
    weights=[0.92, 0.08],
    random_state=42
)
X_train, y_train = X[:4000], y[:4000]
X_test,  y_test  = X[4000:], y[4000:]

print(f"Training set positive prevalence: {y_train.mean():.1%}")

def run_medical_al(strategy, n_initial=50, budget=300):
    labeled = list(rng.choice(len(X_train), n_initial, replace=False))
    unlabeled = [i for i in range(len(X_train)) if i not in labeled]
    aucs = []

    while len(labeled) < n_initial + budget:
        model = LogisticRegression(max_iter=500, class_weight='balanced')
        model.fit(X_train[labeled], y_train[labeled])

        if len(labeled) % 30 == 0:
            preds = model.predict_proba(X_test)[:, 1]
            aucs.append(roc_auc_score(y_test, preds))

        X_pool = X_train[unlabeled]
        if strategy == 'uncertainty' and len(labeled) >= 10:
            probs = model.predict_proba(X_pool)
            entropy = -np.sum(probs * np.log(probs + 1e-9), axis=1)
            q = int(np.argmax(entropy))
        else:
            q = rng.integers(0, len(unlabeled))

        labeled.append(unlabeled.pop(q))

    return np.array(aucs)

aucs_al  = run_medical_al('uncertainty')
aucs_rnd = run_medical_al('random')
label_counts = np.arange(len(aucs_al)) * 30 + 50

plt.figure(figsize=(7, 4))
plt.plot(label_counts, aucs_al,  'o-',  color='#2b3a8f', linewidth=2, label='Uncertainty AL')
plt.plot(label_counts, aucs_rnd, 's--', color='#e05c5c', linewidth=2, label='Random baseline')
plt.xlabel("Expert labels obtained", fontsize=12)
plt.ylabel("AUROC", fontsize=12)
plt.title("Active Learning for Rare Pathology Detection", fontsize=13)
plt.legend(); plt.grid(alpha=0.3)
plt.tight_layout()
plt.savefig('medical_al.png', dpi=150)
plt.show()

# Show how AL preferentially selects positive examples
# by checking which class the queried examples belong to
n_init = 50
labeled_al  = list(rng.choice(len(X_train), n_init, replace=False))
labeled_rnd = labeled_al.copy()
unlabeled_al  = [i for i in range(len(X_train)) if i not in labeled_al]
unlabeled_rnd = unlabeled_al.copy()

model = LogisticRegression(max_iter=500, class_weight='balanced')
model.fit(X_train[labeled_al], y_train[labeled_al])
probs = model.predict_proba(X_train[unlabeled_al])
entropy = -np.sum(probs * np.log(probs + 1e-9), axis=1)
top50_al  = [unlabeled_al[i] for i in np.argsort(entropy)[-50:]]
top50_rnd = list(rng.choice(unlabeled_rnd, 50, replace=False))

pos_rate_al  = y_train[top50_al].mean()
pos_rate_rnd = y_train[top50_rnd].mean()
print(f"\nPositive rate in next 50 queries:")
print(f"  Uncertainty AL: {pos_rate_al:.1%}  (base rate: {y_train.mean():.1%})")
print(f"  Random:         {pos_rate_rnd:.1%}")
print(f"  AL queries {pos_rate_al/y_train.mean():.1f}x more positives than random")
```

```{seealso}
Production participative Galaxy Zoo : {cite}`lintott2008galaxy`. Performances des radiologues CheXNet : {cite}`rajpurkar2017chexnet`. Qualité des radiographies et diagnostic assisté par IA : {cite}`yu2022assessing`. Méthodologie d'annotation de TAL clinique : {cite}`pustejovsky2012natural`. Pour le plan d'action IA/ML de la FDA, consulter la documentation publiée par la FDA (2021).
```
