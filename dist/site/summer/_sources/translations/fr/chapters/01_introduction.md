# Qu'est-ce que l'apprentissage automatique avec l'humain dans la boucle ?

```{epigraph}
Une machine capable d'apprendre de l'expérience... mais seulement si on lui fournit les bonnes expériences.
-- paraphrase d'Alan Turing
```

## Le paradoxe de l'automatisation

Chaque nouvelle vague d'automatisation crée de nouvelles exigences sur l'attention humaine. Quand les compagnies aériennes ont introduit le pilote automatique, les pilotes sont devenus des superviseurs — responsables non plus du contrôle instant par instant, mais de la tâche plus difficile de savoir *quand* reprendre les commandes. Quand les supermarchés ont introduit les caisses automatiques, ils ont découvert que ces systèmes exigeaient davantage de supervision humaine par transaction que les caissiers traditionnels, et non moins. Et quand l'apprentissage automatique a commencé à prendre des décisions à grande échelle — en médecine, en finance, dans le recrutement et la modération de contenu — il a créé une demande considérable et permanente pour le jugement humain.

C'est le **paradoxe de l'automatisation** {cite}`bainbridge1983ironies` : plus un système automatisé devient capable, plus ses défaillances sont lourdes de conséquences, et plus une supervision humaine robuste devient nécessaire. L'apprentissage automatique ne fait pas exception.

L'apprentissage automatique avec l'humain dans la boucle (HITL ML) est le domaine qui prend ce paradoxe au sérieux et l'intègre dans la conception des systèmes dès le départ. Plutôt que de traiter l'implication humaine comme un échafaudage temporaire destiné à être finalement démantelé, le HITL ML traite l'interaction homme–machine comme une *fonctionnalité* — une source de signal, de correction et de guidage qui peut rendre les modèles plus précis, mieux alignés sur les valeurs humaines, et plus dignes de confiance.

---

## Définir l'apprentissage automatique avec l'humain dans la boucle

Il n'existe pas de définition unique et consensuelle du HITL ML, et le terme est utilisé de plusieurs façons qui se chevauchent dans la littérature. Pour ce manuel, nous adoptons une définition large mais précise :

:::{admonition} Définition
:class: important

**L'apprentissage automatique avec l'humain dans la boucle** désigne tout système ou toute méthodologie d'apprentissage automatique dans lequel le retour humain est incorporé dans le processus d'apprentissage de manière *délibérée, structurée et continue* — non seulement au moment de la création du jeu de données, mais tout au long de l'entraînement, de l'évaluation et du déploiement.

:::

Cette définition comporte trois clauses essentielles :

**Délibéré.** Le HITL ne désigne pas une influence humaine accidentelle (par exemple, le fait que les données d'entraînement aient été créées à l'origine par des humains). Il renvoie à des systèmes explicitement conçus pour solliciter, incorporer et bénéficier du retour humain.

**Structuré.** Le retour a une forme définie — une étiquette, une correction, un jugement de préférence, une démonstration — et un rôle défini dans l'algorithme d'apprentissage.

**Continu.** La boucle de retour se poursuit dans le temps, permettant au système de s'améliorer à mesure qu'il rencontre de nouvelles situations, commet des erreurs et reçoit des orientations humaines.

Cette définition inclut les pipelines d'annotation classiques, l'apprentissage actif, l'apprentissage automatique interactif, le RLHF et l'apprentissage par imitation. Elle exclut la collecte passive de données et l'apprentissage supervisé purement hors ligne (bien que la frontière soit floue, comme nous le verrons au Chapitre 2).

---

## Bref historique

### Les systèmes experts et l'ingénierie de la connaissance (années 1960–1980)

Les premiers systèmes d'IA étaient presque entièrement avec l'humain dans la boucle : des ingénieurs de la connaissance travaillaient avec des experts du domaine pendant des mois, encodant patiemment des règles dans des systèmes experts comme MYCIN et DENDRAL. Chaque fragment de connaissance était explicitement fourni par un humain. La machine était l'exécutant ; l'humain était l'oracle.

Ces systèmes fonctionnaient étonnamment bien dans des domaines restreints, mais étaient fragiles — incapables de généraliser au-delà de leurs règles artisanales et coûteux à maintenir.

### Le tournant statistique (années 1980–2000)

Le passage à l'apprentissage automatique statistique dans les années 1980 et 1990 a modifié la nature de l'implication humaine. Au lieu d'encoder la connaissance sous forme de règles, les humains fournissaient désormais des *exemples* — des jeux de données étiquetés permettant aux modèles d'inférer des schémas. Le rôle humain est devenu celui d'annotateur : étiqueter des documents, baliser des images, transcrire de la parole.

C'était un progrès majeur, mais il a créé un nouveau goulot d'étranglement : **les données étiquetées sont coûteuses**. Les chercheurs ont commencé à se demander comment tirer le meilleur parti de l'effort d'étiquetage humain. Cette question a donné naissance à **l'apprentissage actif**, formalisé pour la première fois au début des années 1990 {cite}`cohn1994improving`.

### L'ère de l'apprentissage profond (années 2010 à aujourd'hui)

La révolution de l'apprentissage profond a créé un nouveau régime : des modèles avec des milliards de paramètres capables d'apprendre des fonctions extraordinairement complexes à partir de données — mais nécessitant des jeux de données étiquetés d'une ampleur correspondante. ImageNet (14 millions d'images étiquetées) et les projets d'annotation à grande échelle qui ont suivi ont montré à la fois la puissance et le coût de cette mise à l'échelle.

Dans le même temps, le déploiement de l'apprentissage automatique à grande échelle a mis en évidence de nouveaux problèmes : des modèles précis en moyenne mais systématiquement erronés pour des groupes spécifiques, qui hallucinaient des faits avec assurance, qui optimisaient des substituts mesurables plutôt que les valeurs humaines. Ces défaillances ont motivé de nouvelles formes d'implication humaine : non plus seulement l'étiquetage, mais *l'alignement* — le projet de faire se comporter les modèles comme les humains le souhaitent réellement.

L'expression la plus claire de ce travail HITL orienté vers l'alignement est **l'apprentissage par renforcement à partir des retours humains (RLHF)** {cite}`christiano2017deep`, qui est devenu l'épine dorsale de systèmes comme InstructGPT {cite}`ouyang2022training` et les capacités de suivi d'instructions des modèles de langage modernes.

---

## Pourquoi le HITL ? Le plaidoyer pour le jugement humain

Qu'est-ce qui rend le jugement humain assez précieux pour être incorporé dans des systèmes d'apprentissage automatique ? Plusieurs propriétés :

### 1. Le sens commun et la connaissance du monde

Les humains apportent à toute tâche une vaste connaissance de fond. Quand un radiologue étiquette une radiographie, il fait appel à des années de formation, à une compréhension de l'anatomie et à une connaissance implicite de l'apparence des maladies — une connaissance extraordinairement difficile à spécifier complètement ou à acquérir à partir des données seules.

### 2. L'ancrage sémantique

Les étiquettes sont significatives parce que les humains comprennent ce qu'elles signifient. La classe « chat » dans ImageNet renvoie à un concept flou que les humains reconnaissent intuitivement mais qu'aucune définition formelle ne capture pleinement. Les modèles apprennent l'extension de l'étiquette (quelles images lui correspondent) mais peuvent ne pas apprendre le concept lui-même, conduisant à des échecs sur des cas limites qu'un humain quelconque traiterait correctement.

### 3. L'alignement sur les valeurs

Les humains ont des préférences, des valeurs et des jugements éthiques que les modèles d'apprentissage automatique ne peuvent pas dériver des données seules. Qu'un texte soit « utile » ou « nuisible » n'est pas une question purement empirique — cela dépend de valeurs humaines qui varient selon les individus et les contextes. Le HITL est le principal mécanisme par lequel ces valeurs peuvent être communiquées aux systèmes d'apprentissage automatique.

### 4. L'adaptabilité

Le jugement humain peut s'adapter à des situations nouvelles sans ré-entraînement. Un modèle entraîné sur des données historiques peut échouer de façon catastrophique quand le monde change ; un humain peut reconnaître la nouveauté et y répondre de manière appropriée.

### 5. La responsabilité

Dans les domaines à enjeux élevés — médecine, droit, finance — les décisions doivent être imputables à des êtres humains. Les systèmes HITL rendent cette responsabilité opérationnelle en maintenant les humains en position de comprendre, vérifier et outrepasser le comportement des machines.

---

## La boucle de retour

La structure centrale du HITL ML est une boucle de retour entre un modèle et un ou plusieurs humains :

```text
+---------------------------------------------+
|                                             |
|   Le modèle fait des prédictions / demande  |
|   ---------------------------------->       |
|                                   Humain    |
|   L'humain fournit un retour      <-------- |
|   ----------------------------------        |
|                                             |
|   Le modèle se met à jour sur le retour     |
|                                             |
+---------------------------------------------+
```

La nature du retour varie énormément selon les paradigmes HITL :

| Type de retour    | Exemple                                               | Paradigme principal          |
|-------------------|-------------------------------------------------------|------------------------------|
| Étiquette de classe | « Cet e-mail est du spam »                          | Apprentissage supervisé      |
| Correction        | « L'entité devrait être ORG, pas PER »               | Apprentissage actif / interactif |
| Préférence        | « La réponse A est meilleure que B »                 | RLHF / classement            |
| Démonstration     | Montrer au robot comment saisir un objet             | Apprentissage par imitation  |
| Langage naturel   | « Soyez plus concis dans vos réponses »              | Ajustement par instructions  |
| Signal implicite  | L'utilisateur a cliqué / n'a pas cliqué             | Retour implicite             |

---

## Ce que le HITL n'est pas

Il est utile de préciser ce qui se situe *en dehors* de notre définition.

**Le HITL n'est pas la même chose qu'un déploiement avec l'humain sur la boucle** (parfois appelé « human on the loop »), où les humains surveillent les décisions automatisées et peuvent les outrepasser, mais ne renvoient pas de corrections vers l'entraînement. Nous aborderons cette distinction au Chapitre 2.

**Le HITL n'est pas la supervision faible seule.** Les systèmes d'étiquetage programmatique comme Snorkel utilisent des fonctions d'étiquetage (souvent des règles rédigées par des humains) pour générer des étiquettes bruitées à grande échelle. C'est une forme d'apport humain structuré, mais le retour n'est pas itératif au sens où le HITL l'implique habituellement.

**Le HITL ne consiste pas simplement à utiliser des données étiquetées.** Chaque modèle d'apprentissage supervisé utilise des données étiquetées par des humains. Le HITL désigne spécifiquement les systèmes dans lesquels le retour humain est une partie *active et itérative* du processus d'apprentissage.

---

## L'économie du retour humain

Le retour humain est précieux mais coûteux. L'annotation d'images médicales peut coûter de plusieurs dizaines à plusieurs centaines de dollars par image lorsqu'elle est réalisée par un spécialiste, selon la sous-spécialité et la complexité de la tâche {cite}`monarch2021human`. Les étiquettes de travailleurs en production participative sur des plateformes comme Amazon Mechanical Turk peuvent coûter entre 0,01 et 0,10 $ par élément {cite}`hara2018data` avec une qualité nettement inférieure. Le défi fondamental du HITL ML est de **maximiser la valeur de chaque unité de retour humain**.

Cela conduit à une question unificatrice qui traverse la majeure partie de ce manuel :

:::{admonition} La question centrale du HITL ML
:class: tip

*Étant donné un budget fixe de temps et d'attention humaines, comment décider quoi demander aux humains, quand le demander, et comment incorporer leurs réponses dans l'entraînement du modèle ?*

:::

La réponse à cette question dépend du domaine, de la forme du retour, du coût d'annotation, du risque d'erreur et de l'état actuel du modèle — ce qui fait du HITL ML une discipline riche et encore en évolution.

---

## Présentation du manuel

Le reste de ce manuel est structuré comme suit. La **Partie II** couvre les trois piliers classiques du HITL : l'annotation, l'apprentissage actif et l'apprentissage automatique interactif. La **Partie III** aborde les paradigmes plus récents d'apprentissage à partir du retour — RLHF, apprentissage par imitation et apprentissage par préférences — qui sont devenus centraux dans l'IA moderne. La **Partie IV** examine le HITL à travers le prisme de domaines d'application spécifiques. La **Partie V** adopte une perspective praticienne sur les plateformes, la production participative et l'évaluation. La **Partie VI** traite de l'éthique et se projette dans l'avenir.

```{seealso}
Pour un aperçu pratique du domaine, voir {cite}`monarch2021human`. Pour l'article fondateur sur l'apprentissage actif qui a lancé une grande partie du traitement formel du HITL, voir {cite}`settles2009active`.
```
