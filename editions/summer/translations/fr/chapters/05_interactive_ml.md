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

# Apprentissage automatique interactif

L'apprentissage actif pose une question ciblée : étant donné un budget, quels exemples étiqueter ? L'apprentissage automatique interactif (IML) pose une question plus large : comment concevoir *l'ensemble de l'interaction* entre un humain et un système d'apprentissage pour qu'elle soit au maximum productive, agréable et correcte ?

L'IML se distingue par **l'immédiateté** et la **directité** de la boucle de retour humain–modèle. Là où l'apprentissage automatique traditionnel implique qu'un humain transmette des données et attende la fin de l'entraînement, l'IML permet aux humains d'observer le comportement du modèle, de fournir un retour et de voir le modèle répondre — souvent en quelques secondes.

---

## Principes de l'apprentissage automatique interactif

Amershi et al. {cite}`amershi2014power` identifient trois caractéristiques définissant l'IML :

**1. Retour rapide :** Le modèle se met à jour assez rapidement pour que les humains perçoivent l'effet de leur retour. Dans la limite, les mises à jour du modèle se produisent en temps réel.

**2. Manipulation directe :** L'humain interagit avec le modèle via les données ou via les prédictions du modèle — non via des fichiers de configuration ou du réglage d'hyperparamètres.

**3. Raffinement itératif :** Le processus est véritablement itératif : l'action suivante de l'humain est informée par le comportement actuel du modèle, qui a été façonné par les actions précédentes de l'humain.

Cela crée une **boucle de co-adaptation** étroite : tant l'humain que le modèle changent dans le temps en réponse l'un à l'autre. L'humain apprend ce que le modèle comprend ; le modèle apprend ce qui importe à l'humain.

---

## Comparaison avec l'apprentissage actif

L'IML et l'apprentissage actif se recoupent considérablement mais ne sont pas identiques :

| Propriété                     | Apprentissage actif              | Apprentissage automatique interactif |
|-------------------------------|----------------------------------|---------------------------------------|
| Question principale           | Quoi étiqueter ?                 | Comment interagir ?                   |
| Latence du retour             | Peut être par lots (jours)       | Typiquement temps réel ou quasi       |
| Fréquence de mise à jour      | Par tour (lots)                  | Par interaction (en ligne)            |
| Initiative humaine            | Répond aux questions du modèle   | Peut proactivement enseigner au modèle |
| Conception d'interface        | Préoccupation secondaire         | Préoccupation centrale                |
| Charge cognitive de l'humain  | Non explicitement modélisée      | Explicitement considérée              |

En apprentissage actif, c'est la machine qui dirige l'interaction. En IML, l'humain peut aussi prendre l'initiative — en fournissant des exemples, des corrections ou un retour sur l'aspect du comportement du modèle qui semble le plus problématique.

---

## Interaction à initiative mixte

Les systèmes à **initiative mixte** permettent à la fois à l'humain et à la machine de prendre les devants à différents moments {cite}`allen1999mixed`. Un système purement dirigé par la machine pose des questions et l'humain répond. Un système purement dirigé par l'humain laisse l'humain décider de tout. Les systèmes à initiative mixte équilibrent les deux.

En pratique, les meilleurs systèmes IML combinent :
- **Initiative de la machine :** « Je ne suis pas sûr de ces exemples — pouvez-vous les étiqueter ? »
- **Initiative humaine :** « Je remarque que le modèle se trompe constamment sur cette catégorie — laissez-moi lui fournir plus d'exemples »
- **Confirmation :** Le modèle fait ressortir sa compréhension actuelle ; l'humain confirme ou corrige

Les bonnes interfaces IML rendent la compréhension actuelle du modèle visible et corrigeable. C'est l'exigence **d'intelligibilité** : les humains ne peuvent guider qu'un modèle qu'ils comprennent, au moins approximativement.

---

## Facteurs humains dans l'IML

L'IML introduit des facteurs humains — charge cognitive, fatigue, cohérence et confiance — directement dans la boucle d'apprentissage. Une mauvaise conception IML conduit à :

**La fatigue d'annotation :** Les humains prennent des décisions plus rapides et moins soignées à mesure que les sessions s'allongent. Les erreurs entrent dans les données d'entraînement.

**Le biais d'ancrage :** Les humains qui s'appuient excessivement sur les suggestions actuelles du modèle. Si une interface pré-remplit la prédiction du modèle, les annotateurs sont moins susceptibles de la corriger même quand elle est erronée — une source systématique de bruit d'étiquetage qui se cumule sur les tours d'annotation {cite}`geva2019annotator`. La pré-annotation peut accélérer le débit {cite}`lingren2014evaluating` tout en réduisant simultanément le taux auquel les annotateurs détectent les erreurs du modèle ; ces deux effets doivent être mis en balance dans la conception d'interfaces IML.

**La mauvaise calibration de la confiance :** Les humains font soit une confiance excessive (acceptant des sorties erronées du modèle) soit une méfiance excessive (ignorant des suggestions correctes). Les deux schémas réduisent la valeur de la collaboration humain–modèle.

**La cohérence de session :** Les humains peuvent prendre des décisions différentes sur le même exemple à des moments différents, surtout après de longues sessions. Des vérifications de cohérence (re-présentation d'exemples antérieurs) peuvent détecter et corriger ce phénomène.

Une bonne conception IML atténue ces problèmes par des choix d'interface : présenter explicitement la confiance du modèle, randomiser l'ordre d'affichage, limiter la durée des sessions et intégrer des vérifications de cohérence.

---

## Les types de retour IML en pratique

### Retour au niveau de l'exemple

L'humain fournit une étiquette ou une correction pour un exemple spécifique. C'est la forme la plus courante et directement compatible avec l'apprentissage supervisé.

### Retour au niveau des caractéristiques

L'humain indique quelles caractéristiques sont pertinentes ou non pertinentes. « Le modèle devrait faire attention aux mots "urgent" et "délai" pour cette catégorie. » C'est plus expressif que le retour au niveau de l'exemple et peut être plus efficace pour certaines tâches.

**TFIDF Interactive** et systèmes similaires permettent aux annotateurs de surligner des mots pertinents dans des documents textuels. Ces surlignages sont convertis en contraintes ou en supervision supplémentaire sur l'attention du modèle.

### Retour au niveau du modèle

L'humain corrige directement le comportement du modèle sur une classe d'entrées : « Chaque fois que l'entrée contient [X], la sortie devrait être [Y]. » Cela correspond à des règles logiques ou des contraintes dans des approches comme la Régularisation Postérieure {cite}`ganchev2010posterior` ou l'apprentissage guidé par contraintes.

---

## Étude de cas : Google Teachable Machine

Teachable Machine est un système IML accessible basé sur le web qui permet à des utilisateurs non techniques d'entraîner des classificateurs d'images dans le navigateur. L'utilisateur :

1. Enregistre des exemples de chaque classe via sa webcam
2. Entraîne le modèle d'un seul clic (affinement d'un MobileNet dans le navigateur)
3. Observe immédiatement les prédictions du modèle sur la vidéo en direct
4. Ajoute des exemples pour les classes où le modèle se trompe

Cela illustre la boucle IML fondamentale : fournir des exemples → observer le modèle → identifier l'échec → fournir des exemples plus ciblés. Le retour en temps réel (les sorties du modèle se mettent à jour en temps réel, typiquement à des fréquences d'images interactives sur le matériel moderne) rend la boucle de co-adaptation viscéralement immédiate.

---

## Implémentation d'une boucle IML simple

```{code-cell} python
import numpy as np
from sklearn.linear_model import SGDClassifier
from sklearn.preprocessing import StandardScaler
import warnings
warnings.filterwarnings('ignore')

class SimpleIMLSystem:
    """
    Minimal IML system that allows online feedback and displays
    model state after each annotation.
    """

    def __init__(self, n_features=10, n_classes=2):
        self.model = SGDClassifier(loss='log_loss', max_iter=1, warm_start=True,
                                   random_state=42)
        self.scaler = StandardScaler()
        self.X_seen = []
        self.y_seen = []
        self.n_classes = n_classes
        self.initialized = False

    def update(self, x, y_true):
        """Receive a single labeled example and update the model."""
        self.X_seen.append(x)
        self.y_seen.append(y_true)

        if len(self.X_seen) >= 2 * self.n_classes:
            X_arr = np.array(self.X_seen)
            y_arr = np.array(self.y_seen)
            X_scaled = self.scaler.fit_transform(X_arr)
            self.model.partial_fit(X_scaled[-1:], y_arr[-1:],
                                   classes=list(range(self.n_classes)))
            self.initialized = True

        return self

    def predict_with_confidence(self, x):
        """Predict label and return confidence."""
        if not self.initialized:
            return None, 0.0
        x_scaled = self.scaler.transform(x.reshape(1, -1))
        probs = self.model.predict_proba(x_scaled)[0]
        return self.model.predict(x_scaled)[0], probs.max()

    def current_accuracy(self, X_val, y_val):
        if not self.initialized:
            return None
        X_scaled = self.scaler.transform(X_val)
        return (self.model.predict(X_scaled) == y_val).mean()


# Simulate an IML session
rng = np.random.default_rng(42)
X_all, y_all = np.random.default_rng(0).random((500, 10)), np.random.default_rng(0).integers(0,2,500)
X_val, y_val = X_all[400:], y_all[400:]

system = SimpleIMLSystem(n_features=10, n_classes=2)
accs, confidences = [], []

print("Step | Labels | Accuracy | Example confidence")
print("-" * 50)

for step in range(100):
    x, y = X_all[step], y_all[step]
    pred, conf = system.predict_with_confidence(x)
    system.update(x, y)

    if (step + 1) % 10 == 0:
        acc = system.current_accuracy(X_val, y_val)
        if acc is not None:
            accs.append(acc)
            print(f"  {step+1:3d} |  {step+1:4d}  |  {acc:.3f}   | {conf:.3f}")
```

---

## Le test de la grand-mère

L'une des heuristiques utiles pour évaluer la conception d'interfaces IML — et plus généralement la conception de systèmes HITL — est ce que nous appellerons le **Test de la grand-mère** (une formulation originale introduite ici comme contrainte de conception, non comme référence à des travaux antérieurs) :

> *Une femme née en 1930 devrait pouvoir utiliser ce dispositif par la voix, et en cas de frustration, se replier gracieusement sur une interface clavier ou textuelle.*

Le test ne porte pas principalement sur l'accessibilité, bien qu'il le soit aussi. Il porte sur la **conception pour la friction**. Si un système exige un modèle mental des réseaux de neurones, des boucles d'entraînement ou des distributions de probabilité pour être utilisé efficacement, il a échoué au Test de la grand-mère. L'humain dans la boucle devrait pouvoir participer sans comprendre le côté machine de la boucle.

Les implications pour la conception IML sont concrètes :

**Repli vers la voix :** La modalité d'interaction principale devrait être le langage naturel ou le geste — non des curseurs de paramètres ou des seuils de confiance. Les experts peuvent vouloir des curseurs ; tout le monde devrait pouvoir dire « c'est faux ».

**Dégradation gracieuse :** Quand la modalité préférée de l'utilisateur échoue ou frustre, le système devrait proposer une alternative — non un écran blanc ou un message d'erreur. L'interface fait partie du système d'apprentissage ; un utilisateur qui ne peut pas interagir ne peut pas enseigner.

**État du modèle lisible :** La compréhension actuelle du modèle devrait être visible en termes humains. Non pas « confiance : 0,73 » mais « Je suis assez sûr que c'est [X], mais j'ai vu des exemples comme celui-ci aller dans les deux sens. » L'incertitude devrait être communiquée dans un langage qui invite à la correction.

**Tolérance à l'ambiguïté :** Un utilisateur de 93 ans et un ingénieur en apprentissage automatique de 23 ans interagiront différemment avec le même système. Le Test de la grand-mère demande si le système peut accommoder les deux — non en détectant l'âge de l'utilisateur, mais en concevant des interactions qui fonctionnent pour une gamme d'expertises et d'aisances.

Le test prend une importance particulière à mesure que les systèmes d'apprentissage automatique passent d'outils de recherche à une infrastructure quotidienne. Un assistant d'imagerie médicale utilisé par des radiologues, un classificateur de documents juridiques utilisé par des greffiers, un système de retour éducatif utilisé par des enseignants — chacun implique des humains dans la boucle qui ne se sont pas portés volontaires pour être des entraîneurs d'IA. Concevoir pour eux n'est pas une concession ; c'est le propos.

:::{admonition} Principe de conception
:class: tip
Le Test de la grand-mère est une contrainte de conception, non une démographie cible. Les systèmes qui le réussissent sont plus robustes à la diversité des utilisateurs, plus indulgents face aux écarts d'expertise, et plus honnêtes sur ce qu'ils attendent des humains dans la boucle. Si un système nécessite une explication avant utilisation, il demande à l'humain de faire un travail supplémentaire. Ce travail devrait être justifié par un bénéfice proportionné.
:::

---

## IML et modèles de fondation

L'IML moderne s'appuie de plus en plus sur des **modèles de fondation pré-entraînés** {cite}`bommasani2021opportunities` comme base. Au lieu de partir de zéro, les utilisateurs affinent un grand modèle pré-entraîné avec un petit nombre d'exemples interactifs. Cela peut réduire considérablement le nombre d'exemples nécessaires pour atteindre des performances utiles — dans des cas favorables, aussi peu que 5 à 50 exemples plutôt que des milliers, selon la qualité de correspondance entre les représentations pré-entraînées et la tâche cible {cite}`bommasani2021opportunities`.

Les techniques permettant cela incluent :
- **Le prompting en quelques exemples :** Fournir des exemples dans la fenêtre contextuelle du grand modèle de langage
- **L'affinement par adaptateurs :** Mettre à jour de petits modules adaptateurs tout en gelant le modèle de base
- **L'affinement efficace en paramètres (PEFT) :** LoRA, ajustement de préfixe et méthodes similaires permettant des mises à jour rapides et peu gourmandes en ressources

Les modèles de fondation modifient la dynamique IML : les humains n'enseignent plus à un modèle vierge depuis zéro, mais *orientent* un modèle qui sait déjà beaucoup. Le défi passe de « comment fournir suffisamment d'exemples » à « comment spécifier exactement ce que nous voulons de différent par rapport à ce que le modèle fait déjà ».

```{seealso}
La revue de {cite}`amershi2014power` reste le meilleur aperçu des principes IML. Pour les systèmes à initiative mixte spécifiquement, voir {cite}`allen1999mixed`. Pour les effets d'ancrage dans l'annotation, voir {cite}`geva2019annotator` et {cite}`lingren2014evaluating`.
```
