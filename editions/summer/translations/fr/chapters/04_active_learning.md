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

# Apprentissage actif

Les données étiquetées sont coûteuses. L'idée centrale de l'apprentissage actif est que *tous les exemples non étiquetés ne sont pas également informatifs* — un modèle peut progresser plus rapidement s'il peut choisir quels exemples soumettre à l'annotation. Plutôt que d'étiqueter des données de manière aléatoire, un système d'apprentissage actif interroge un oracle (généralement un annotateur humain) sur les exemples les plus susceptibles d'améliorer le modèle.

Ce chapitre couvre la théorie et la pratique de l'apprentissage actif : les stratégies de requête, les cadres d'échantillonnage, les critères d'arrêt et les considérations pratiques pour les déploiements réels.

---

## Le cadre de l'apprentissage actif

Le cadre standard de **l'apprentissage actif basé sur un pool** implique :

- Un **ensemble étiqueté** $\mathcal{L} = \{(x_i, y_i)\}_{i=1}^n$ — initialement petit
- Un **pool non étiqueté** $\mathcal{U} = \{x_j\}_{j=1}^m$ — généralement bien plus grand que $\mathcal{L}$
- Un **oracle** $\mathcal{O}$ qui peut retourner $y = \mathcal{O}(x)$ pour tout $x$ interrogé
- Une **stratégie de requête** $\phi$ qui sélectionne la prochaine requête $x^* = \phi(\mathcal{L}, \mathcal{U}, f_\theta)$

La boucle d'apprentissage actif :

```text
    1. Initialiser : L = petit ensemble étiqueté d'amorçage, U = pool non étiqueté
    2. Entraîner : f_θ ← entraîner(L)
    3. Requêter : x* = argmax φ(x; f_θ) sur x ∈ U
    4. Étiqueter : y* = O(x*)
    5. Mettre à jour : L ← L ∪ {(x*, y*)}, U ← U \ {x*}
    → Répéter depuis 2 jusqu'à épuisement du budget
```

L'objectif est d'atteindre une qualité cible du modèle en utilisant le moins de requêtes d'oracle possible.

---

## Fondements théoriques

Une question naturelle est : dans quelle mesure l'apprentissage actif peut-il aider ? Dans le meilleur des cas, l'apprentissage actif peut permettre des réductions *exponentielles* de la complexité en termes d'étiquettes — atteindre une erreur $\epsilon$ avec $O(\log(1/\epsilon))$ étiquettes plutôt que les $O(1/\epsilon)$ nécessaires à l'apprentissage passif, du moins dans des cadres réalisables avec une bonne stratégie de requête {cite}`settles2009active`.

En pratique, les garanties sont plus difficiles à obtenir. **L'apprentissage actif agnostique** {cite}`balcan2006agnostic` montre que des économies d'étiquettes sont possibles même quand le concept cible n'est pas dans la classe d'hypothèses, mais ces économies dépendent fortement du coefficient de désaccord — une mesure de la vitesse à laquelle l'ensemble des hypothèses plausibles se réduit à mesure que les données s'accumulent.

L'implication pratique essentielle : l'avantage de l'apprentissage actif est le plus grand quand la **frontière de décision est simple et concentrée** (afin que les requêtes d'incertitude éliminent rapidement les hypothèses erronées), et le plus faible quand la classe d'hypothèses est large ou la frontière complexe.

---

## Stratégies de requête

### Échantillonnage par incertitude

La stratégie la plus simple et la plus utilisée : interroger l'exemple sur lequel le modèle est *le plus incertain* {cite}`lewis1994sequential`.

**La moindre confiance** interroge l'exemple pour lequel le modèle est le moins confiant dans sa prédiction principale :

$$
x^* = \argmax_{x \in \mathcal{U}} \left(1 - P_\theta(\hat{y} \mid x)\right)
$$

**L'échantillonnage par marge** considère l'écart entre les deux probabilités prédites les plus élevées :

$$
x^* = \argmin_{x \in \mathcal{U}} \left(P_\theta(\hat{y}_1 \mid x) - P_\theta(\hat{y}_2 \mid x)\right)
$$

**L'échantillonnage par entropie** utilise la distribution prédite complète :

$$
x^* = \argmax_{x \in \mathcal{U}} \left( -\sum_{k=1}^K P_\theta(y_k \mid x) \log P_\theta(y_k \mid x) \right)
$$

L'échantillonnage par entropie est le plus fondé théoriquement des trois — il prend en compte toutes les classes — et surpasse généralement les autres sur les problèmes multiclasses.

### Requête par comité (QbC)

Entraîner un **comité** de $C$ modèles (par ensachage, différentes initialisations ou différentes architectures). Interroger l'exemple sur lequel le comité est le plus en désaccord :

$$
x^* = \argmax_{x \in \mathcal{U}} \; \text{désaccord}(\{f_c(x)\}_{c=1}^C)
$$

Le désaccord peut être mesuré comme **l'entropie de vote** (entropie sur les votes majoritaires du comité) ou la **divergence KL** par rapport à la distribution de consensus.

La QbC fournit de meilleures estimations d'incertitude qu'un seul modèle, mais nécessite l'entraînement de plusieurs modèles, ce qui est coûteux en calcul.

### Changement de modèle attendu

Interroger l'exemple qui provoquerait le plus grand changement dans le modèle actuel s'il était étiqueté. Pour les modèles à base de gradients, cela correspond à l'exemple avec la plus grande magnitude de gradient attendue {cite}`settles2008analysis` :

$$
x^* = \argmax_{x \in \mathcal{U}} \sum_{y \in \mathcal{Y}} P_\theta(y \mid x) \left\| \nabla_\theta \mathcal{L}(f_\theta(x), y) \right\|
$$

Cette stratégie a une forte motivation théorique, mais nécessite de calculer les gradients pour chaque candidat, ce qui la rend coûteuse pour les grands modèles.

### Approches géométriques / par ensemble noyau

Les stratégies basées sur l'incertitude peuvent être **biaisées vers les valeurs aberrantes** : un exemple inhabituel peut être très incertain sans être représentatif de la distribution des données. Les méthodes par ensemble noyau abordent ce problème en cherchant un échantillon diversifié qui couvre l'espace des caractéristiques.

L'algorithme **k-center glouton** {cite}`sener2018active` trouve le plus petit ensemble de points tel que chaque point non étiqueté soit à moins de $\delta$ d'au moins un point interrogé :

$$
x^* = \argmax_{x \in \mathcal{U}} \min_{x' \in \mathcal{L}} d(x, x')
$$

c'est-à-dire, interroger le point le plus éloigné de tout point déjà étiqueté. Cela encourage un ensemble d'annotations bien réparti.

### BADGE

**L'apprentissage actif par lots via des plongements de gradients divers** (BADGE) {cite}`ash2020deep` combine incertitude et diversité : il sélectionne un lot d'exemples dont les plongements de gradients (par rapport à l'étiquette prédite) sont à la fois de grande magnitude (incertains) et divers (couvrant différentes régions de l'espace des gradients). C'est l'une des stratégies modernes les plus compétitives.

---

## Estimation d'incertitude pour les modèles profonds

Les stratégies ci-dessus supposent l'accès à des sorties de probabilité calibrées du modèle. Pour les modèles simples (régression logistique, classificateurs softmax), cela est direct. Pour les réseaux profonds, obtenir des estimations d'incertitude fiables nécessite des techniques supplémentaires.

### Deux types d'incertitude

Suivant Kendall et Gal {cite}`kendall2017uncertainties`, nous distinguons :

**L'incertitude aléatique** (incertitude des données) : bruit inhérent aux observations qui ne peut pas être réduit en collectant davantage de données. Une image floue est aléatoirement incertaine — aucune quantité de données d'entraînement supplémentaires issues de la même distribution ne rendra le modèle plus confiant à son sujet.

**L'incertitude épistémique** (incertitude du modèle) : incertitude due à des données d'entraînement limitées ou à un modèle qui n'a pas vu d'exemples similaires. L'incertitude épistémique *peut* être réduite en étiquetant davantage de données — et est donc la quantité pertinente pour la sélection des requêtes en apprentissage actif.

Pour l'apprentissage actif, nous voulons interroger les exemples à forte incertitude épistémique, pas à forte incertitude aléatique. Interroger un exemple fondamentalement ambigu gaspille l'effort de l'oracle : aucune étiquette qu'il fournit ne sera clairement correcte.

### Monte Carlo Dropout

Une approche pratique pour l'estimation de l'incertitude épistémique dans les réseaux de neurones est le **MC Dropout** {cite}`gal2016dropout` : appliquer le dropout lors de l'inférence et effectuer $T$ passes avant. La variance entre les prédictions est une estimation de l'incertitude épistémique.

```{code-cell} python
import numpy as np
import torch
import torch.nn as nn

torch.manual_seed(42)
rng = np.random.default_rng(42)

class MCDropoutNet(nn.Module):
    def __init__(self, input_dim=20, hidden=64, output_dim=2, p_drop=0.3):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(input_dim, hidden), nn.ReLU(), nn.Dropout(p_drop),
            nn.Linear(hidden, hidden),    nn.ReLU(), nn.Dropout(p_drop),
            nn.Linear(hidden, output_dim)
        )

    def forward(self, x):
        return self.net(x)

def mc_uncertainty(model, x, T=30):
    """
    Run T stochastic forward passes with dropout active.
    Returns mean prediction and epistemic uncertainty (predictive variance).
    """
    model.train()  # keep dropout active during inference
    with torch.no_grad():
        preds = torch.stack([
            torch.softmax(model(x), dim=-1) for _ in range(T)
        ])  # shape: (T, N, C)
    mean_pred = preds.mean(0)
    # Epistemic uncertainty: mean of variances across passes
    epistemic = preds.var(0).sum(-1)
    # Aleatoric uncertainty: entropy of mean prediction
    aleatoric = -(mean_pred * (mean_pred + 1e-9).log()).sum(-1)
    return mean_pred, epistemic, aleatoric

# Quick demonstration
model = MCDropoutNet(input_dim=20, output_dim=2)
# In-distribution example (simulated)
x_familiar   = torch.randn(1, 20) * 0.5
# Out-of-distribution example (far from training distribution)
x_unfamiliar = torch.randn(1, 20) * 3.0

for name, x in [("In-distribution ", x_familiar), ("Out-of-distribution", x_unfamiliar)]:
    _, ep, al = mc_uncertainty(model, x)
    print(f"{name} | epistemic: {ep.item():.4f} | aleatoric: {al.item():.4f}")
```

Dans le réseau non entraîné ci-dessus, les deux exemples présentent une incertitude similaire. Après entraînement, l'exemple hors distribution présentera une incertitude épistémique plus élevée — le modèle n'a pas appris de correspondance fiable pour les entrées éloignées de la distribution d'entraînement.

### Ensembles profonds

Entraîner $M$ modèles initialisés de manière indépendante et faire la moyenne de leurs prédictions fournit une estimation d'incertitude plus simple et souvent plus fiable que le MC Dropout {cite}`lakshminarayanan2017simple`. Le désaccord entre les membres de l'ensemble est le signal d'incertitude épistémique.

Pour l'apprentissage actif à grande échelle, le MC Dropout et les ensembles profonds ajoutent une surcharge proportionnelle à $T$ ou $M$ passes avant. En pratique, $T = 10$–$30$ pour le MC Dropout ou $M = 5$ membres d'ensemble est souvent suffisant pour classer les exemples par incertitude épistémique, même si les valeurs absolues ne sont pas bien calibrées.

---

## Une boucle d'apprentissage actif complète

```{code-cell} python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
from copy import deepcopy

rng = np.random.default_rng(42)

# Generate dataset
X, y = make_classification(
    n_samples=2000, n_features=20, n_informative=10,
    n_classes=3, n_clusters_per_class=1, random_state=42
)
X_train, y_train = X[:1500], y[:1500]
X_test,  y_test  = X[1500:], y[1500:]

def entropy_query(model, X_pool):
    """Return index of most uncertain sample (entropy)."""
    probs = model.predict_proba(X_pool)
    ent = -np.sum(probs * np.log(probs + 1e-9), axis=1)
    return np.argmax(ent)

def random_query(X_pool):
    """Random baseline."""
    return rng.integers(0, len(X_pool))

def run_active_learning(strategy='entropy', n_initial=30, n_queries=120, query_batch=5):
    labeled_idx = list(rng.choice(len(X_train), n_initial, replace=False))
    unlabeled_idx = [i for i in range(len(X_train)) if i not in labeled_idx]
    accs = []

    for step in range(n_queries // query_batch):
        model = LogisticRegression(max_iter=500, C=1.0)
        model.fit(X_train[labeled_idx], y_train[labeled_idx])
        accs.append(accuracy_score(y_test, model.predict(X_test)))

        # Query
        X_pool = X_train[unlabeled_idx]
        for _ in range(query_batch):
            if strategy == 'entropy':
                q = entropy_query(model, X_pool)
            else:
                q = random_query(X_pool)
            labeled_idx.append(unlabeled_idx.pop(q))
            X_pool = X_train[unlabeled_idx]

    return np.array(accs)

labels_used = np.arange(1, 25) * 5 + 30  # label counts at each step

accs_active = run_active_learning(strategy='entropy')
accs_random = run_active_learning(strategy='random')

plt.figure(figsize=(8, 5))
plt.plot(labels_used, accs_active, 'o-', label='Entropy sampling', color='#2b3a8f', linewidth=2)
plt.plot(labels_used, accs_random, 's--', label='Random baseline',  color='#e05c5c', linewidth=2)
plt.xlabel("Number of labeled examples", fontsize=12)
plt.ylabel("Test accuracy", fontsize=12)
plt.title("Active Learning vs. Random Sampling", fontsize=13)
plt.legend(fontsize=11)
plt.grid(alpha=0.3)
plt.tight_layout()
plt.savefig('active_learning_curve.png', dpi=150)
plt.show()

print(f"Active learning reaches {accs_active[-1]:.3f} accuracy")
print(f"Random sampling reaches {accs_random[-1]:.3f} accuracy")
print(f"Active learning saves ~{int((accs_random.tolist().index(min(accs_random, key=lambda a: abs(a-accs_active[-1]))) - len(accs_active) + 1) * 5)} labels to match random's final accuracy")
```

---

## Le problème du démarrage à froid

L'apprentissage actif nécessite un modèle entraîné pour évaluer les points non étiquetés — mais au début, vous n'avez pas (ou très peu) d'exemples étiquetés. C'est le **problème du démarrage à froid**.

Solutions pratiques :

1. **Initialisation aléatoire :** Étiqueter un petit ensemble d'amorçage aléatoire (20–100 exemples) avant de démarrer l'apprentissage actif.
2. **Initialisation par regroupement :** Utiliser k-means sur le pool non étiqueté ; étiqueter un exemple de chaque groupe. Cela garantit la diversité de l'ensemble étiqueté initial.
3. **Sélection basée sur les plongements :** Utiliser un encodeur pré-entraîné pour plonger les exemples ; sélectionner un sous-ensemble diversifié par ensemble noyau.

Pour la plupart des tâches, quelques dizaines d'étiquettes d'amorçage aléatoires sont généralement suffisantes pour démarrer l'apprentissage actif ; le nombre exact dépend de l'équilibre des classes, de la dimensionnalité des caractéristiques et de la complexité du modèle.

---

## Apprentissage actif par lots

En pratique, les annotateurs travaillent par lots — il est inefficace d'entraîner et de déployer un nouveau modèle après chaque étiquette individuelle. **L'apprentissage actif par lots** sélectionne un ensemble de $b$ exemples à étiqueter simultanément.

Sélectionner naïvement les $b$ exemples les plus incertains conduit à de la **redondance** : les exemples très incertains ont tendance à se regrouper (par exemple, des exemples proches de la frontière de décision dans la même région). De meilleures stratégies par lots optimisent à la fois l'incertitude *et* la diversité au sein du lot.

Les **Processus Ponctuels Déterminantiels (DPP)** fournissent un moyen fondé d'échantillonner des lots diversifiés : ils définissent une distribution sur les sous-ensembles qui pénalise les éléments similaires. La probabilité d'un sous-ensemble $S$ sous un DPP est proportionnelle à $\det(L_S)$ où $L$ est une matrice noyau encodant la similarité.

---

## Critères d'arrêt

Quand l'apprentissage actif devrait-il s'arrêter ? Critères courants :

- **Budget épuisé :** Le plus simple — s'arrêter quand le budget d'annotation est écoulé.
- **Plateau de performance :** S'arrêter quand la précision du modèle sur un ensemble de validation mis de côté ne s'est pas améliorée de plus de $\delta$ pendant $k$ tours consécutifs.
- **Seuil de confiance :** S'arrêter quand moins d'une certaine fraction des exemples non étiquetés ont une incertitude au-dessus d'un seuil.
- **Réduction maximale de la perte :** Estimer le gain maximal possible à partir d'étiquettes supplémentaires ; s'arrêter quand il tombe en dessous d'un seuil {cite}`bloodgood2009method`.

---

## Quand l'apprentissage actif fonctionne (et quand il ne fonctionne pas)

L'apprentissage actif tend à bien fonctionner quand :
- L'étiquetage est coûteux et le pool non étiqueté est grand
- Les données ont une structure claire que le modèle peut exploiter pour identifier des exemples informatifs
- La classe de modèles est appropriée pour la tâche

L'apprentissage actif performe mal quand :
- Le modèle initial est très mauvais (démarrage à froid) et ne peut pas classer significativement les exemples
- La stratégie de requête sélectionne des valeurs aberrantes ou des exemples mal étiquetés (la robustesse au bruit est importante)
- La distribution des données change entre le pool non étiqueté et la distribution de test

Une préoccupation pratique essentielle est le **décalage de distribution** : l'apprentissage actif tend à interroger les exemples proches de la frontière de décision, créant un ensemble étiqueté biaisé qui peut ne pas bien représenter la distribution de test. Cela peut conduire à des frontières de décision bien entraînées mais à une mauvaise calibration.

```{seealso}
La revue de référence est {cite}`settles2009active`. Fondements théoriques (complexité en étiquettes, bornes agnostiques) : {cite}`balcan2006agnostic`. Pour l'apprentissage actif spécifique à l'apprentissage profond, voir {cite}`ash2020deep` (BADGE) et {cite}`sener2018active` (ensemble noyau). Pour une évaluation critique de quand l'apprentissage actif aide réellement, voir {cite}`lowell2019practical`. Sur l'incertitude aléatique vs. épistémique pour les modèles profonds, voir {cite}`kendall2017uncertainties` ; pour les ensembles profonds comme estimateurs d'incertitude, voir {cite}`lakshminarayanan2017simple` ; pour le MC Dropout comme inférence bayésienne approchée, voir {cite}`gal2016dropout`.
```
