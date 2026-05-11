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

# Étude de cas : Limen — Un humain dans la boucle de toute chose

:::{admonition} Note sur ce chapitre
:class: important
Ce chapitre est un **essai de conception spéculatif**, non une étude empirique ou une contribution soumise à évaluation par les pairs. Il décrit une architecture système envisagée — Limen, un système d'exploitation de bureau IA-natif prioritairement vocal — comme exemple travaillé de la façon dont les principes HITL des chapitres précédents pourraient se composer en un tout cohérent. Les affirmations ici sont des arguments de conception, non des résultats expérimentaux. Elles devraient être lues comme une justification de conception motivée, non comme des conclusions d'ingénierie validées.
:::

Chaque chapitre de ce manuel a décrit le HITL ML comme une philosophie de conception : un ensemble de principes pour rendre l'implication humaine dans les systèmes d'apprentissage délibérée, efficiente et honnête. Ce chapitre décrit à quoi ressemble l'application de cette philosophie comme premier principe — non pas à un seul système, mais à un environnement opérationnel entier.

**Limen** est un système d'exploitation de bureau prioritairement vocal, IA-natif, construit sur la prémisse que l'humain est toujours dans la boucle, non comme une contrainte à optimiser, mais comme le principe organisateur autour duquel chaque sous-système est conçu. Le nom est choisi délibérément : *limen* est le mot latin pour seuil. En psychologie perceptuelle, le limen est la frontière entre ce qui est perçu et ce qui ne l'est pas. Pour un système d'exploitation, le limen est la frontière entre l'intention humaine et l'action de la machine.

L'architecture décrite ici n'est pas propriétaire. C'est un ensemble de décisions de conception, dont chacune suit naturellement des principes HITL développés dans les chapitres précédents. L'objectif n'est pas de documenter un produit mais de montrer comment ces principes se composent — comment ils se renforcent mutuellement quand appliqués de manière cohérente, et quels types de systèmes deviennent possibles quand l'humain n'est pas une réflexion après coup.

---

## Le problème avec la conception traditionnelle des systèmes d'exploitation

Un système d'exploitation conventionnel n'est pas conçu pour les humains. Il est conçu pour les programmes. L'humain est accommodé à travers une couche d'abstraction — une interface graphique, un explorateur de fichiers, un terminal — qui repose sur un substrat construit pour les processus, les adresses mémoire et les descripteurs de fichiers.

Ce choix de conception est historiquement justifié. Quand les hypothèses qui l'ont produit ont été formulées, les ordinateurs étaient chers, les humains bon marché, et le goulot d'étranglement était le calcul. La bonne cible d'optimisation était la machine.

Ces hypothèses ne tiennent plus. Le goulot d'étranglement, pour la plupart des utilisateurs dans la plupart des tâches, n'est pas le calcul. C'est l'attention humaine : le coût du changement de contexte, de la recherche du bon fichier, de la construction de la bonne requête, du souvenir d'où se trouvait quelque chose. La machine est rapide. L'humain est lent. L'interface devrait optimiser pour le côté humain de la boucle.

Les systèmes d'exploitation conventionnels ne font pas cela. Ils sont optimisés pour les programmes, et le travail de l'humain est de parler le langage des programmes. Limen inverse cela. Les programmes parlent le langage de l'humain. L'humain est dans la boucle, et la boucle est conçue pour s'adapter à l'humain.

---

## Architecture au seuil

L'architecture de Limen est organisée autour d'un seul principe : **chaque interaction est un événement**, et chaque événement est une opportunité pour l'humain d'enseigner, de corriger ou de confirmer. Le système n'attend pas des sessions d'entraînement explicites. L'apprentissage est continu et ambiant.

### La couche d'événements : WID

À la fondation se trouve **WID** (le système Waldiez ID, adapté pour l'architecture locale-d'abord de Limen) — un système de suivi d'événements conscient de la causalité qui enregistre non seulement ce qui s'est passé, mais ce qui l'a causé, et ce qu'il a à son tour causé.

La journalisation conventionnelle demande : *que s'est-il passé ?* WID demande : *pourquoi est-ce arrivé, et qu'est-ce qui a suivi ?* Chaque événement porte une lignée causale — une chaîne depuis l'action humaine déclenchante à travers des états système intermédiaires jusqu'au résultat observé.

Cela est important pour l'apprentissage HITL parce que cela résout le **problème d'attribution de crédit** au niveau de l'interaction. Quand un utilisateur corrige le comportement du système, WID peut identifier non seulement la sortie immédiate qui était erronée, mais la chaîne de décisions qui l'a produite. Les corrections peuvent être appliquées au bon niveau d'abstraction : la sortie, la règle de décision, ou le signal en amont.

C'est l'équivalent au niveau du système d'exploitation de ce que le Chapitre 6 décrit pour le RLHF : la capacité de tracer un signal de récompense à travers une séquence de décisions. WID fournit ce traçage nativement, pour chaque interaction, sans exiger de l'utilisateur qu'il le comprenne.

:::{admonition} Le suivi causal d'événements comme infrastructure HITL
:class: note
La conception de WID reflète un principe plus large : l'infrastructure HITL devrait faciliter la question « pourquoi le système a-t-il fait cela ? » — pas seulement « qu'a-t-il fait ? » Sans traçage causal, les corrections réparent des symptômes. Avec lui, elles peuvent réparer des causes. La différence entre un correctif et une leçon.
:::

### La couche de perception : Priorité vocale

La modalité d'entrée principale de Limen est la voix, traitée localement à l'aide d'un pipeline d'inférence Whisper ONNX. Les raisons de ce choix méritent d'être explicitement énoncées :

**La voix est le canal de sortie humain le plus naturel pour la plupart des gens.** Elle ne nécessite ni formation, ni dextérité physique au-delà de la parole ordinaire, ni connaissance de l'organisation interne du système. Un utilisateur qui ne peut pas trouver un fichier dans une hiérarchie de répertoires peut décrire ce qu'il cherche.

**Le traitement local préserve la vie privée.** Les données vocales ne quittent pas le dispositif. Cela importe éthiquement — la voix est une donnée biométrique, et sa collecte à grande échelle par des fournisseurs cloud est un préjudice documenté — et pratiquement : le fonctionnement hors ligne signifie que le système reste fonctionnel sans connexion réseau.

**La voix crée une boucle de retour naturelle.** Quand le système répond, la réaction de l'utilisateur — continuer à parler, reformuler, dire « non, ce n'est pas ça » — est elle-même un signal. Limen traite ces réactions comme un retour HITL : des preuves sur la correction ou non de l'interprétation du système de l'énoncé précédent.

La chaîne de repli est aussi importante que la modalité principale. Quand la voix échoue — dans un environnement bruyant, pour un utilisateur avec une déficience de la parole, pour une entrée bénéficiant de précision — Limen se dégrade gracieusement vers une interface clavier puis vers une interface textuelle structurée. Le Test de la grand-mère (voir le Chapitre 5) n'est pas un ajout d'accessibilité ; c'est une contrainte architecturale de première classe.

### La couche d'intelligence : Routage multi-LLM

Limen ne repose pas sur un seul modèle de langage. Il achemine les requêtes à travers un arbre de décision structuré basé sur le type de tâche, la latence requise, les exigences de confidentialité et la confiance :

1. **Modèle local petit** (toujours en premier) : rapide, privé, gère les tâches routinières — « ouvrir le fichier que j'éditais hier », « mettre une minuterie », « quel temps fait-il »
2. **Modèle local grand** (quand la confiance du petit modèle est faible) : plus lent mais plus capable ; gère le raisonnement structuré, la génération de code, la récupération complexe
3. **Modèle distant** (quand le local échoue et que l'utilisateur a accordé la permission) : la sortie de secours ; géré de manière transparente avec une notification explicite de l'utilisateur

Cette structure n'est pas nouvelle — c'est l'équivalent au moment de l'inférence de la stratégie de requête d'apprentissage actif décrite au Chapitre 4. À chaque étape, le système demande : mon modèle actuel est-il suffisant pour répondre à cette requête avec une confiance acceptable ? Si non, escalader. L'escalade est un coût (latence, vie privée, calcul) ; il est engagé seulement quand nécessaire.

L'humain est dans la boucle à la frontière d'escalade. Un utilisateur qui a configuré Limen pour ne jamais escalader vers des modèles distants a pris une décision HITL — une décision que le système respecte et enregistre. Un utilisateur qui approuve une requête distante puis dit « ne me demande plus pour ce type de requête » a fourni une préférence qui met à jour la politique de routage.

---

## La conception de l'interaction

### Immédiateté

Limen est conçu pour l'immédiateté au sens que le Chapitre 5 définit : l'utilisateur perçoit l'effet de son retour. Quand l'utilisateur corrige une sortie du système, la correction est appliquée immédiatement et visiblement. Le modèle ne s'en va pas s'entraîner pendant vingt minutes. Il se met à jour dans la session courante.

Cela nécessite l'utilisation d'architectures de modèles prenant en charge la mise à jour en ligne efficace — adaptateurs, ajustement de préfixe et génération augmentée par récupération plutôt qu'un affinement complet. Le compromis est explicite : les mises à jour en ligne sont plus bruitées que l'entraînement par lots. Limen accepte ce compromis parce que l'immédiateté est l'exigence principale : l'humain peut toujours confirmer, rejeter ou affiner la mise à jour.

### Intelligibilité

Un thème récurrent dans la littérature IML est l'**exigence d'intelligibilité** : les humains ne peuvent guider qu'un modèle qu'ils comprennent, au moins approximativement. Limen reflète cela dans l'interface : quand le système prend une décision, il explique, brièvement, pourquoi. Non pas une trace de raisonnement complète — cela submergerait la plupart des utilisateurs — mais un résumé en langage naturel du facteur clé : « J'ouvre le projet sur lequel vous avez le plus récemment travaillé — est-ce correct ? »

Cette explication est aussi une question. Elle invite à la correction. Elle rend l'inférence du modèle visible pour que l'utilisateur puisse la rediriger si elle est erronée. L'explication n'est pas générée pour des raisons esthétiques ; c'est une infrastructure HITL fonctionnelle.

### Cohérence et dérive

Un problème qui se pose dans tout système interactif à long terme est la **dérive comportementale** : le comportement du système au temps $T+n$ est subtilement différent de son comportement au temps $T$, d'une manière que ni l'utilisateur ni le système n'ont explicitement choisie. Les corrections s'accumulent. Les cas limites s'aggravent. Le modèle qui était aligné sur les préférences de l'utilisateur le mois dernier peut ne plus l'être aujourd'hui.

Limen aborde cela à travers des vérifications de cohérence périodiques — l'équivalent au niveau du système d'exploitation de la technique de re-présentation décrite au Chapitre 13. Le système fait remonter des décisions historiques à l'utilisateur : « Il y a quelques semaines, vous m'avez demandé de faire X. Est-ce toujours ce que vous voudriez ? » Ces vérifications servent deux fonctions : elles détectent la dérive, et elles rappellent à l'utilisateur les préférences qu'il a peut-être oublié d'avoir spécifiées.

---

## Limen comme système HITL

En regardant l'architecture de Limen à travers le prisme de ce manuel, les décisions de conception se mappent directement sur les concepts développés dans chaque partie.

**Partie I (Fondements) :** Limen traite chaque interaction comme un événement d'interaction homme–machine. Il n'y a pas de « mode non-HITL » — le système apprend toujours, attribue toujours, attend toujours qu'un humain participe.

**Partie II (Techniques fondamentales) :** L'apprentissage actif se manifeste comme la chaîne d'escalade basée sur la confiance. L'apprentissage automatique interactif se manifeste dans le cycle de mise à jour en temps réel. L'annotation est implicite : chaque correction que l'utilisateur fait est une étiquette.

**Partie III (Apprentissage à partir du retour humain) :** L'apprentissage par préférences décrit au Chapitre 8 apparaît dans les mises à jour de la politique de routage. Quand un utilisateur préfère la réponse d'un modèle local à celle d'un modèle distant, cette préférence est enregistrée et se généralise. Le RLHF dans un OS personnel signifie que le modèle de récompense est privé, individuel et continuellement mis à jour.

**Partie IV (Applications) :** Limen est un environnement généraliste, mais sa conception est la plus visible dans les domaines où le jugement de l'humain est irremplaçable et le coût des erreurs est élevé — rédaction de documents, priorisation des tâches, travail créatif.

**Partie V (Systèmes et pratique) :** WID est la plateforme d'annotation de Limen. Elle est invisible pour l'utilisateur en fonctionnement normal, visible quand nécessaire pour le débogage ou la transparence. Les mécanismes de contrôle de qualité (vérifications de cohérence, seuils de confiance, journaux d'escalade) sont directement empruntés à la littérature sur la production participative.

**Partie VI (Éthique) :** La conception locale-d'abord et préservant la vie privée est un choix éthique, pas seulement technique. Les données de l'humain ne quittent pas son dispositif sans son consentement explicite. Le modèle qui apprend du comportement d'un utilisateur appartient à cet utilisateur.

---

## Le point le plus profond

Limen n'est pas un argumentaire produit. C'est un argument par construction.

L'argument est le suivant : si vous prenez au sérieux les principes du HITL ML — si vous croyez que le retour humain est un signal à comprendre plutôt qu'un coût à minimiser, que l'humain est toujours dans la boucle même quand les concepteurs prétendent le contraire, que l'alignement est un processus continu plutôt qu'un événement ponctuel — alors vous finissez par construire quelque chose qui ressemble à Limen.

Pas nécessairement Limen spécifiquement. La pile technologique spécifique (Tauri, Rust, Babylon.js, Whisper ONNX) est un choix parmi beaucoup. Mais l'architecture — suivi causal d'événements, traitement local-d'abord, dégradation gracieuse, apprentissage continu par préférences, transparence comme fonctionnalité de première classe — découle des principes.

Le domaine du HITL ML a consacré une énergie considérable à décrire comment mettre les humains dans la boucle de modèles spécifiques et de tâches spécifiques. La prochaine question est de savoir si nous pouvons concevoir des *environnements* entiers autour des mêmes principes : des environnements où l'humain est toujours au centre, la machine est toujours l'apprenant, et la boucle est toujours ouverte.

Limen est une réponse à cette question.

Le seuil n'est pas quelque chose que vous franchissez et laissez derrière vous. C'est là où vous vivez.

---

```{seealso}
Les principes IML sous-jacents à la conception de l'interaction de Limen sont développés au Chapitre 5. L'approche d'apprentissage par préférences derrière la politique de routage est formalisée au Chapitre 8. Le modèle de causalité de WID s'appuie sur la littérature d'attribution d'événements présentée au Chapitre 14. Le Test de la grand-mère, introduit au Chapitre 5, est la principale contrainte de conception d'interface de Limen.
```
