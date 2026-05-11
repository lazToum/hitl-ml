# Équité, biais et éthique

Les systèmes avec l'humain dans la boucle héritent à la fois des capacités et des limites des humains qui y participent. Les annotateurs apportent des connaissances, du jugement et de la créativité à leur travail — mais aussi des biais, de la fatigue et le contexte social de leur vie. Les choix que nous faisons dans la conception des systèmes HITL — qui annote, ce qu'on leur demande, comment ils sont rémunérés et comment leur travail est utilisé — ont des conséquences qui s'étendent bien au-delà des métriques de précision du modèle.

Ce chapitre aborde les dimensions éthiques du HITL ML.

---

## Sources de biais dans les systèmes HITL

### Données démographiques des annotateurs

L'annotation n'est pas un acte neutre. Les étiquettes que les annotateurs assignent reflètent leurs perspectives, leurs expériences et leurs contextes culturels. Quand la main-d'œuvre d'annotation est démographiquement homogène — comme c'est souvent le cas, avec le travail à la tâche étant davantage pratiqué par des jeunes, des hommes, dans des pays occidentaux — le jeu de données résultant encode les perspectives de ce groupe.

**Preuves :** Des études sur les jeux de données d'annotation en TAL ont trouvé que les caractéristiques démographiques des annotateurs prédisent leurs choix d'étiquettes pour les tâches subjectives (toxicité, sentiment, offensivité). Les jeux de données annotés principalement par des travailleurs basés aux États-Unis encodent des normes culturelles américaines qui ne se généralisent pas à d'autres régions {cite}`geva2019annotator`.

**Conséquences :** Les modèles entraînés sur de telles données performent bien pour les utilisateurs ressemblant au pool d'annotateurs et moins bien — ou de manière biaisée — pour les utilisateurs qui ne leur ressemblent pas.

**Atténuation :** Diversification délibérée de la main-d'œuvre ; annotation stratifiée (assurer que des annotateurs des groupes démographiques pertinents contribuent aux tâches pertinentes) ; suivre les données démographiques des annotateurs et leur effet sur les distributions d'étiquettes.

### Formulation de la tâche

La façon dont une question est formulée influence les réponses qu'elle suscite. Si on demande aux annotateurs « Ce texte est-il toxique ? », ils peuvent répondre différemment que si on leur demandait « Ce texte ferait-il du tort à quelqu'un appartenant au groupe mentionné ? » La formulation intègre des suppositions sur ce qui importe.

**Exemple :** L'annotation du « langage abusif » sur les médias sociaux varie significativement selon que les annotateurs voient des informations contextuelles sur l'identité de l'auteur. Un énoncé qui semble menaçant isolément peut être reconnu comme du langage réapproprié ou une plaisanterie de groupe quand le contexte est fourni.

### Effets de plateforme

La plateforme et la structure de rémunération affectent la qualité d'annotation. Les travailleurs rémunérés par tâche plutôt que par heure ont intérêt à travailler rapidement ; cela augmente le débit mais diminue la qualité. Les travailleurs qui craignent d'être bloqués d'une plateforme pour faible précision peuvent éviter de marquer « incertain » et deviner plutôt, masquant une ambiguïté réelle.

### Biais de confirmation et d'ancrage

Les annotateurs sont influencés par :
- **La pré-annotation :** Les prédictions du modèle montrées aux annotateurs sont acceptées plus souvent que rejetées, même quand elles sont erronées
- **Les effets d'ordre :** Étiqueter le même élément dans des contextes différents donne des réponses différentes
- **L'amorçage :** Les éléments précédents dans une tâche affectent la façon dont les éléments suivants sont étiquetés

---

## Équité dans les systèmes HITL

### Qu'est-ce que l'équité ?

L'équité dans l'apprentissage automatique est un concept contesté avec de multiples définitions formelles souvent mutuellement incompatibles {cite}`barocas2019fairness`. Pour les besoins du HITL, les dimensions les plus pertinentes sont :

**Représentation :** Les données d'entraînement sont-elles représentatives des populations que le modèle affectera ?

**Parité de performance :** Le modèle fonctionne-t-il également bien dans différents groupes démographiques ?

**Cohérence des étiquettes :** Les mêmes comportements sont-ils étiquetés de façon identique quel que soit celui qui les réalise ? (Des recherches ont montré que ce n'est pas toujours le cas — un contenu identique est parfois étiqueté différemment quand il est attribué à différents groupes raciaux ou de genre.)

### Apprentissage actif respectueux de l'équité

Les stratégies d'apprentissage actif standard se concentrent sur l'incertitude du modèle, qui tend à se concentrer sur les exemples de la classe majoritaire. Cela peut exacerber les disparités de performance pour les groupes minoritaires.

Les **stratégies de requête respectueuses de l'équité** augmentent le critère d'incertitude avec des contraintes de diversité ou de représentation :

$$
x^* = \argmax_{x \in \mathcal{U}} \left[ \lambda \cdot \text{incertitude}(x) + (1 - \lambda) \cdot \text{bonus\_groupe\_minoritaire}(x) \right]
$$

Fixer $\lambda < 1$ assure que la stratégie de requête n'ignore pas entièrement la représentation des minorités.

---

## Bien-être des annotateurs

### Le problème du travail fantôme

Le travail d'annotation qui alimente l'apprentissage automatique est largement invisible. Les travailleurs des données — souvent dans le Sud Global — étiquettent des images, transcrivent de la parole et modèrent du contenu pour de faibles salaires, sans avantages, dans des arrangements d'économie à la tâche sans sécurité d'emploi. « Anatomy of an AI System » de Kate Crawford et Vladan Joler {cite}`crawford2018anatomy` et « Ghost Work » de Mary Gray et Siddharth Suri {cite}`gray2019ghost` ont documenté l'ampleur et la précarité de ce travail.

**Statistiques Amazon MTurk :** Une analyse systématique de 2018 des gains MTurk a trouvé une rémunération horaire effective médiane d'environ 2 $/h — en dessous du salaire minimum dans la plupart des États américains et de nombreux pays à revenu élevé {cite}`hara2018data`. Les travailleurs hors des pays à revenu élevé font face à des obstacles supplémentaires : les demandeurs restreignent fréquemment les tâches bien rémunérées aux qualifications américaines uniquement, et le pool de travailleurs en compétition pour les tâches ouvertes restantes est mondial, comprimant davantage les gains effectifs.

**Modération de contenu :** Une forme particulièrement préjudiciable de travail d'annotation — examiner du contenu graphique, violent et perturbant — a été liée à des troubles de stress post-traumatique, de la dépression et de l'anxiété chez les travailleurs {cite}`newton2019trauma`. Les plateformes ont fait l'objet de critiques pour un soutien en santé mentale inadéquat et des quotas d'exposition excessifs.

### Pratiques éthiques

**Rémunération équitable :** Payer les travailleurs d'annotation au moins au salaire minimum local. Des recherches ont montré qu'une rémunération plus élevée attire des travailleurs de meilleure qualité sans augmenter proportionnellement les coûts par étiquette correcte.

**Visibilité du travail :** Reconnaître le travail qui crée des données d'entraînement dans les publications et la documentation des produits.

**Soutien en santé mentale :** Pour les travailleurs qui examinent du contenu nuisible, fournir un soutien psychologique, des rotations et des limites d'exposition.

**Représentation des travailleurs :** Permettre aux travailleurs d'annotation de signaler des préoccupations, demander des clarifications des consignes et contester des évaluations de qualité injustes.

---

## Vie privée dans l'annotation

### Informations de Santé Protégées (ISP) et données personnelles

Les tâches d'annotation impliquent souvent des données personnelles sensibles. Un projet d'annotation médicale peut exposer les travailleurs aux dossiers de patients ; un projet TAL peut exposer les travailleurs à des communications privées ; un projet de modération de contenu expose les travailleurs aux divulgations personnelles des utilisateurs.

Les cadres réglementaires (HIPAA, RGPD) restreignent la manière dont les données personnelles peuvent être partagées avec les main-d'œuvres d'annotation. Principes clés :

- **Minimisation des données :** Ne partager que les informations dont les annotateurs ont besoin pour accomplir la tâche
- **Dé-identification :** Supprimer les ISP et les données personnelles avant l'annotation dans la mesure du possible
- **Consentement :** Lorsque des données réelles d'utilisateurs sont annotées, s'assurer du consentement approprié ou d'une base légale
- **Contrôles d'accès :** Limiter les annotateurs pouvant accéder aux données sensibles selon le rôle et l'habilitation

### Les données synthétiques comme alternative

Pour les tâches où les données réelles comportent des risques de confidentialité, la génération de données synthétiques peut créer des jeux de données prêts à l'annotation sans exposer d'informations sensibles. Pour le TAL clinique, par exemple, les textes de DME synthétiques peuvent fournir des données d'entraînement réalistes pour les modèles de dé-identification sans exposer de vrais dossiers de patients.

---

## Annotation adversariale et empoisonnement des données

Les systèmes HITL créent une surface d'attaque : si un adversaire peut influencer le processus d'annotation, il peut influencer le comportement du modèle.

**Empoisonnement des données via l'annotation :** Un attaquant ayant accès à la main-d'œuvre d'annotation (par exemple, un compte de travailleur à la tâche compromis) peut injecter des exemples systématiquement mal étiquetés. C'est particulièrement efficace dans les contextes d'apprentissage actif, où le modèle interroge préférentiellement les exemples incertains — qui peuvent être la cible de l'adversaire.

**Détournement de récompense via le retour :** Dans le RLHF, les annotateurs (ou les annotations générées par IA) qui évaluent systématiquement hautement certains types de contenu peuvent orienter le modèle vers ce contenu, indépendamment de sa qualité réelle.

**Atténuation :** Plusieurs annotateurs indépendants par élément ; détection des valeurs aberrantes sur les schémas d'annotation ; surveillance des anomalies d'accord ou de désaccord ; maintien d'ensembles d'évaluation qui ne peuvent pas être influencés par la main-d'œuvre d'annotation.

---

## Éthique institutionnelle

### IRB et révision éthique

Les projets de recherche impliquant des sujets humains — y compris les travailleurs d'annotation — nécessitent souvent l'approbation d'un Comité d'Éthique de la Recherche (IRB). Les projets d'annotation qui collectent des données sur les croyances des travailleurs, leurs réponses à du contenu sensible ou des informations démographiques devraient être soumis au même cadre éthique que les autres recherches sur sujets humains.

### Gouvernance des données

Les organisations devraient avoir des politiques claires pour :
- Quelles données peuvent être envoyées pour annotation externe vs. annotées en interne
- Combien de temps les données d'annotation sont conservées et par qui
- Qui a accès aux annotations et aux modèles entraînés sur celles-ci
- Comment gérer les demandes de suppression des données annotées (droit à l'effacement du RGPD)

### Transparence et responsabilité

Les utilisateurs affectés par des systèmes d'apprentissage automatique ont un intérêt légitime à comprendre comment ces systèmes ont été construits. Documenter la méthodologie d'annotation — qui a étiqueté les données, dans quelles conditions, avec quelles consignes — est une forme de responsabilité qui bénéficie aux utilisateurs, aux régulateurs et au domaine dans son ensemble.

**Les Fiches de Données pour les Jeux de Données** {cite}`gebru2021datasheets` fournit un modèle structuré pour documenter la provenance des jeux de données, les procédures d'annotation et les limitations connues.

```{seealso}
Cadre d'équité algorithmique : {cite}`barocas2019fairness`. Travail fantôme et travail sur plateforme : Gray & Suri (2019). Fiches de Données pour les Jeux de Données : {cite}`gebru2021datasheets`. Bien-être des travailleurs de modération de contenu : {cite}`newton2019trauma`. Données démographiques des annotateurs et jeux de données TAL : {cite}`geva2019annotator`.
```
