# Perspectives et directions futures

Le domaine de l'apprentissage automatique avec l'humain dans la boucle évolue rapidement. Les modèles de fondation, les LLM comme annotateurs, et les nouveaux paradigmes de collaboration humain-IA remodèlent l'économie et la pratique du HITL d'une manière qui était inimaginable il y a encore cinq ans. Ce chapitre final cartographie le paysage des directions émergentes et des problèmes ouverts.

---

## Les modèles de fondation et le rôle changeant de l'annotation

Les modèles de fondation — grands modèles pré-entraînés sur des données larges pouvant être adaptés aux tâches en aval — changent fondamentalement l'économie du HITL.

### Réduire la charge d'annotation

Une tâche qui nécessitait auparavant des milliers d'exemples étiquetés pour s'entraîner de zéro peut n'en nécessiter que des dizaines lors de l'affinement d'un modèle de fondation. Le prompting en quelques exemples peut éliminer entièrement le besoin d'affinement pour certaines tâches.

**Implication :** Le ROI de l'annotation change. L'effort d'annotation est désormais mieux dirigé vers :
- Des ensembles d'évaluation de haute qualité (pour mesurer si le modèle adapté fonctionne réellement)
- Les cas difficiles et cas limites que le modèle de fondation traite incorrectement
- Des exemples spécifiques à la tâche qui enseignent au modèle quelque chose qu'il ne peut pas inférer du pré-entraînement

### Nouvelles formes de spécification

Quand le modèle de base comprend déjà le langage, le code et le sens commun, les utilisateurs peuvent communiquer avec lui en langage naturel plutôt qu'à travers des exemples étiquetés. Un utilisateur qui veut un classificateur de texte n'a plus besoin d'étiqueter 500 exemples — il peut rédiger une description de la tâche de classification et évaluer les performances en zéro-shot.

Cela déplace le défi HITL de la *collecte d'exemples* vers la *spécification de tâche* : aider les utilisateurs à articuler précisément ce qu'ils veulent sous une forme sur laquelle le modèle peut agir. C'est plus difficile qu'il n'y paraît — les descriptions en langage naturel de tâches sont souvent ambiguës d'une façon que les exemples annotés ne le sont pas.

---

## Les LLM comme annotateurs

L'un des développements les plus significatifs de 2023 à 2025 est l'utilisation des **LLM comme oracles d'annotation**. Au lieu de demander à un humain « Cet avis est-il positif ou négatif ? », on demande à GPT-4 ou à Claude. Pour des tâches de classification bien définies, les annotations LLM correspondent souvent ou approchent de près la précision des travailleurs à la tâche {cite}`gilardi2023chatgpt`, et le coût par annotation des appels API est généralement de plusieurs ordres de grandeur inférieur aux taux de main-d'œuvre humaine.

### Où l'annotation LLM fonctionne bien

- Tâches de classification simples et bien définies (sentiment, sujet, intention)
- Tâches où les étiquettes humaines encodent un consensus culturel que le LLM a absorbé
- Tâches où l'annotation est cohérente d'un contexte à l'autre (pas très subjective)
- Générer des annotations de premier passage pour révision humaine

### Où l'annotation LLM échoue

- Tâches de domaine hautement spécialisées nécessitant une expertise rare (médical, juridique, scientifique)
- Tâches nécessitant une connaissance culturelle locale ou une variation linguistique
- Tâches de sécurité et de préjudice, où le LLM peut être mal calibré dans la même direction que les données sur lesquelles il a été entraîné
- Nouveaux types de tâches peu représentés dans le pré-entraînement

### RLAIF et IA constitutionnelle

Comme discuté au Chapitre 6, le retour généré par IA peut être utilisé pour entraîner des modèles de récompense et guider l'affinement RL. Cela crée une boucle de retour : les LLM génèrent des données, les modèles sont entraînés sur celles-ci, et de meilleurs modèles génèrent de meilleures données. La question de savoir comment amorcer cette boucle sans encoder des erreurs systématiques du modèle initial est un problème ouvert central dans la recherche sur la supervision évolutive.

---

## Supervision faible à grande échelle

**L'étiquetage programmatique** via des fonctions d'étiquetage (Chapitre 9) permet aux experts du domaine d'exprimer leurs connaissances sous forme de code plutôt que d'exemples étiquetés. Des systèmes comme Snorkel {cite}`ratner2017snorkel` et ses successeurs ont considérablement mûri et sont maintenant utilisés en production dans les grandes entreprises technologiques.

**Directions de recherche :**
- **Fonctions d'étiquetage augmentées par LLM :** Utiliser les LLM pour générer des fonctions d'étiquetage à partir de descriptions en langage naturel
- **Apprentissage basé sur les tranches :** Identifier des sous-ensembles critiques des données (tranches) où les fonctions d'étiquetage sont en désaccord et diriger l'annotation humaine là-dessus
- **Agrégation consciente de l'incertitude :** De meilleurs modèles statistiques pour combiner des fonctions d'étiquetage avec différentes précisions et corrélations

---

## Apprentissage continu avec supervision humaine

La plupart des systèmes d'apprentissage automatique sont entraînés hors ligne et déployés comme modèles statiques. Le monde change ; les modèles précis au moment du déploiement se dégradent à mesure que la distribution des données évolue.

**L'apprentissage continu** — la capacité d'apprendre de nouvelles données tout en conservant les anciennes connaissances — est un domaine de recherche actif. La supervision humaine est critique : l'apprentissage continu automatisé sans révision humaine peut rapidement encoder des décalages de distribution qui sont des erreurs plutôt que de véritables changements dans le monde.

**L'apprentissage continu HITL** implique :
- Surveiller le décalage de distribution (automatisé) et acheminer les exemples décalés vers la révision humaine
- Ré-entraînement sélectif : les exemples approuvés par l'humain de la nouvelle distribution sont ajoutés aux données d'entraînement
- Révision humaine des changements de comportement du modèle après chaque mise à jour

---

## HITL multimodal

À mesure que les systèmes IA deviennent multimodaux — traitant et générant simultanément du texte, des images, de l'audio et de la vidéo — l'annotation devient plus complexe. Un seul contenu peut nécessiter une annotation à travers les modalités, avec des dépendances entre elles.

**Types de tâches émergents :**
- Annotation vidéo + transcription (que se passe-t-il, qui parle, que décrit le texte visuellement ?)
- Annotation image médicale + rapport clinique
- Annotation de trajectoire robotique (liant les données de capteurs aux séquences d'actions)

Les modèles de fondation multimodaux (GPT-4V, Gemini, Claude) changent également le paysage d'annotation ici — les modèles peuvent maintenant interpréter des images et générer des annotations candidates, que les humains révisent.

---

## Supervision évolutive

Un problème ouvert fondamental en HITL ML est la **supervision évolutive** {cite}`irving2018ai,bowman2022measuring` : à mesure que les systèmes IA deviennent plus capables que les humains dans des domaines spécifiques, comment maintenir une supervision humaine significative ?

Pour des tâches comme la prédiction de structure de protéines, l'analyse juridique ou la vérification de preuves mathématiques, même des annotateurs experts peuvent ne pas être en mesure de juger quelle sortie IA est correcte. Les méthodes HITL actuelles s'effondrent quand le jugement humain est moins fiable que le modèle évalué.

**Approches proposées {cite}`bowman2022measuring` :**

**Débat :** Deux systèmes IA argumentent pour des conclusions différentes ; un juge humain évalue les arguments plutôt que les conclusions directement. La conclusion correcte devrait être plus défendable.

**Amplification :** Les juges humains consultent des assistants IA (le modèle lui-même) pour aider à évaluer des sorties complexes. Cela exploite les capacités IA pour étendre la supervision humaine plutôt que de la remplacer.

**Supervision du processus :** Au lieu d'évaluer la sortie finale, les humains évaluent le *processus de raisonnement* — signalant les étapes défectueuses dans une chaîne de pensée, indépendamment du fait que la réponse finale soit correcte.

---

## L'évolution de la division du travail

La trajectoire à long terme du HITL ML va vers une collaboration plus fluide entre humains et IA, où aucun n'est simplement « l'étiqueteur » et l'autre « l'apprenant », mais les deux contribuent à un processus cognitif partagé.

**Tendances à observer :**
- **Annotation assistée par IA :** L'IA propose ; les humains décident. La qualité s'améliore à mesure que l'IA propose de meilleures options.
- **Exploration guidée par l'humain :** Les humains fixent des objectifs et des contraintes ; l'IA explore l'espace des solutions.
- **Évaluation collaborative :** Les humains et l'IA évaluent conjointement des sorties complexes par dialogue.
- **Apprentissage par préférences à grande échelle :** Les signaux implicites (comment les utilisateurs interagissent avec les sorties IA) alimentent un apprentissage par préférences continu sans nécessiter de sessions d'annotation explicites.

La question de la confiance à accorder au jugement IA par rapport au jugement humain — et dans quels domaines, à quels niveaux de capacité, avec quelles garanties — est en fin de compte une question sociétale, pas seulement technique. Le HITL ML fournit l'infrastructure technique pour y répondre avec soin, plutôt que par défaut.

---

## Problèmes de recherche ouverts

Nous clôturons avec une liste de problèmes ouverts importants sur lesquels le domaine travaille activement :

1. **Arrêt optimal en apprentissage actif :** Quand la valeur marginale de la prochaine annotation est-elle inférieure au coût ? Des règles d'arrêt principiées restent insaisissables.

2. **Allocation du budget d'annotation entre tâches :** Dans des contextes multi-tâches, comment un budget d'annotation fixe doit-il être réparti entre les tâches ?

3. **Décalage de distribution dans l'apprentissage actif :** L'apprentissage actif crée des ensembles étiquetés biaisés. Comment calibrer correctement les modèles entraînés de cette façon ?

4. **Généralisation du modèle de récompense :** Les modèles de récompense RLHF peuvent ne pas se généraliser à de nouvelles paires prompt-réponse. Comment construire des modèles de préférences plus robustes ?

5. **Supervision évolutive :** Comment maintenir une supervision humaine alors que les systèmes IA dépassent les performances humaines dans des domaines spécifiques ?

6. **Modélisation des annotateurs :** De meilleurs modèles statistiques du comportement des annotateurs qui capturent non seulement la compétence mais aussi les biais systématiques, l'expertise thématique et la fatigue.

7. **Évaluation de l'alignement :** Nous manquons de tests de vérité de terrain pour savoir si un modèle est aligné sur les valeurs humaines. Développer de tels tests — analogues aux exemples adversariaux pour la robustesse — est un problème ouvert.

8. **Travail équitable sur les données :** Des structures économiques et institutionnelles qui assurent que les travailleurs d'annotation sont équitablement rémunérés et protégés, tout en maintenant la rentabilité de l'annotation à grande échelle.

---

```{epigraph}
L'objectif n'est pas de remplacer le jugement humain par le jugement des machines,
mais de construire des systèmes où la combinaison des deux est meilleure que l'un ou l'autre seul.
```

Les outils et techniques de ce manuel — annotation, apprentissage actif, RLHF, apprentissage par préférences, et tout le reste — sont des moyens à cette fin. À mesure que le domaine évolue, les techniques spécifiques changeront. L'aspiration sous-jacente — construire des systèmes qui sont à la fois capables et genuinement alignés sur l'intention humaine — demeurera.

```{seealso}
Supervision évolutive et débat : {cite}`bowman2022measuring`. Supervision faible Snorkel : {cite}`ratner2017snorkel`. Pour l'avenir large de la collaboration humain-IA, voir {cite}`amershi2019software`.
```
