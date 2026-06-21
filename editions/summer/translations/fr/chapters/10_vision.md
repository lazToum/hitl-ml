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

# L'humain dans la boucle en vision par ordinateur

La vision par ordinateur fournit certains des exemples les plus visuellement intuitifs du HITL ML. Le défi ImageNet, construit sur 14 millions d'images étiquetées par des humains, a lancé l'ère de l'apprentissage profond. L'annotation d'images médicales par des radiologues alimente le diagnostic par IA. Les véhicules autonomes dépendent de millions de images étiquetées par des humains pour apprendre à percevoir le monde.

Ce qu'il est facile de négliger : ce ne sont pas simplement des cas où les humains fournissent une vérité de terrain. Ce sont des cas où les humains construisent des jeux de données qui incorporent des choix perceptuels, culturels et opérationnels spécifiques — des choix qui ne deviennent visibles que plus tard, quand les modèles échouent de manières prévisibles.

---

## Comment les choix d'annotation deviennent des biais du modèle

La présentation standard traite l'annotation comme une collecte de données : les humains observent le monde et enregistrent ce qu'ils voient. La présentation plus précise est que l'annotation est de la *conception de jeu de données* : les humains décident quelles catégories utiliser, où tracer les frontières, quels cas limites inclure et comment résoudre l'ambiguïté — et toutes ces décisions façonnent ce que le modèle entraîné percevra.

### Le cas ImageNet

ImageNet {cite}`russakovsky2015imagenet` est le jeu de données le plus important de l'histoire de la vision par ordinateur. Son ensemble d'étiquettes dérive des synsets WordNet, choisis principalement pour être nombreux et sémantiquement distincts. Plusieurs conséquences de ce choix de conception sont apparues des années plus tard :

- **Les catégories de personnes encodaient des associations démographiques.** Les premières versions des étiquettes de synsets pour les personnes dans ImageNet incluaient beaucoup de termes qui seraient aujourd'hui considérés comme dégradants ou biaisés, reflétant à la fois la source historique de WordNet et les décisions implicites de la main-d'œuvre d'annotation sur les étiquettes à appliquer à quelles images {cite}`yang2020towards`. Les étiquettes appliquées aux images de personnes encodaient des associations de race, de genre et de classe qui se sont directement propagées dans les plongements des modèles.

- **Taxonomie fine des espèces, grossière pour presque tout le reste.** ImageNet peut distinguer 120 races de chiens mais regroupe une énorme variation en outils, véhicules, nourriture et mobilier en catégories uniques. C'était une conséquence du suivi de la structure de WordNet, non un choix délibéré sur ce qui importe. Les modèles entraînés sur ImageNet présentent la même précision asymétrique.

- **Valeurs visuelles par défaut occidentales et anglophones.** Les images ont été principalement collectées depuis Flickr et des recherches Internet utilisant des requêtes en anglais. La distribution résultante est fortement orientée vers l'environnement visuel et les objets culturels des pays riches anglophones.

Aucune de ces décisions n'était une erreur. C'étaient des choix de conception d'annotation faits rapidement à grande échelle, souvent par des personnes qui n'anticipaient pas comment le jeu de données serait utilisé. La leçon n'est pas qu'ImageNet aurait dû être construit différemment (même si c'est le cas), mais que **la conception d'annotation est la conception du modèle**, et devrait être traitée avec le même soin.

:::{admonition} Le schéma d'annotation est une théorie du monde
:class: note

Toute taxonomie d'étiquettes formule des affirmations sur quelles distinctions importent. Choisir de séparer « voiture » de « camion » tout en regroupant toutes les berlines dans une classe est une affirmation théorique sur quelles distinctions sont sémantiquement pertinentes. Choisir d'annoter « personne » comme une classe unique quelle que soit la pose, les vêtements ou l'activité est une affirmation théorique différente. Les modèles entraînés sur ces schémas feront les mêmes distinctions, et pas plus — ils ne généraliseront pas au-delà des catégories qu'ils ont été entraînés à distinguer.
:::

---

## Annotation de classification d'images

La tâche d'annotation CV la plus simple est l'attribution d'une ou plusieurs étiquettes à une image entière.

**Hiérarchie d'étiquettes.** L'étiquette « chien » est un enfant de « animal » dans une hiérarchie sémantique. Les modèles entraînés sur des taxonomies plates peuvent ne pas bien généraliser à travers les niveaux d'abstraction. ImageNet utilise une hiérarchie basée sur les synsets qui permet l'évaluation à plusieurs niveaux de spécificité.

**Ambiguïté multi-étiquettes.** Une scène de rue peut contenir simultanément une voiture, une personne, un vélo et un feu de circulation. Décider quelles étiquettes inclure nécessite des consignes claires sur les seuils de pertinence.

**Distributions longue queue.** Les jeux de données d'images naturelles suivent une loi de puissance : quelques catégories sont extrêmement courantes ; la plupart sont rares. L'apprentissage actif est particulièrement précieux pour les catégories longue queue où l'échantillonnage aléatoire ne fournit qu'une poignée d'exemples.

---

## Détection d'objets : annotation de boîtes englobantes

La détection d'objets exige des annotateurs qu'ils dessinent des boîtes englobantes alignées sur les axes autour des instances de chaque classe d'objet. Cela introduit des exigences de précision géométrique et des cas limites significatifs.

**Métriques de qualité d'annotation :**

*L'IoU (Intersection sur Union)* mesure le chevauchement entre une boîte annotée et une boîte de référence :

$$
\text{IoU}(A, B) = \frac{|A \cap B|}{|A \cup B|}
$$

$\text{IoU} \geq 0{,}5$ est le seuil standard pour une « détection correcte » dans PASCAL VOC ; COCO {cite}`lin2014microsoft` utilise une gamme de seuils de 0,5 à 0,95, ce qui est considérablement plus exigeant et plus informatif.

**Cas limites d'annotation à résoudre dans les consignes :**
- Objets occultés : annoter la partie visible ou extrapoler l'étendue complète ?
- Objets tronqués (partiellement hors cadre) : inclure ou exclure ?
- Régions de foule : utiliser une annotation spéciale « foule » ou annoter les instances individuelles ?

Chacune de ces décisions change ce que signifie une « détection correcte » — et donc change ce que le modèle est entraîné à faire.

```{code-cell} python
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.patches as patches

def compute_iou(boxA, boxB):
    """Compute IoU between two boxes [x1, y1, x2, y2]."""
    xA = max(boxA[0], boxB[0])
    yA = max(boxA[1], boxB[1])
    xB = min(boxA[2], boxB[2])
    yB = min(boxA[3], boxB[3])
    inter_area = max(0, xB - xA) * max(0, yB - yA)
    boxA_area = (boxA[2] - boxA[0]) * (boxA[3] - boxA[1])
    boxB_area = (boxB[2] - boxB[0]) * (boxB[3] - boxB[1])
    union_area = boxA_area + boxB_area - inter_area
    return inter_area / (union_area + 1e-6)

ref_box  = [1.0, 1.0, 4.0, 4.0]
ann1_box = [1.1, 0.9, 4.1, 4.2]   # close
ann2_box = [0.5, 0.5, 3.5, 3.8]   # less precise

print(f"IoU (ann1 vs ref):  {compute_iou(ann1_box, ref_box):.3f}")
print(f"IoU (ann2 vs ref):  {compute_iou(ann2_box, ref_box):.3f}")
print(f"IoU (ann1 vs ann2): {compute_iou(ann1_box, ann2_box):.3f}")

fig, ax = plt.subplots(figsize=(5, 5))
ax.set_xlim(0, 5); ax.set_ylim(0, 5); ax.set_aspect('equal')
ax.add_patch(patches.Rectangle(
    (ref_box[0], ref_box[1]), ref_box[2]-ref_box[0], ref_box[3]-ref_box[1],
    linewidth=2.5, edgecolor='#2b3a8f', facecolor='none', label='Reference'))
ax.add_patch(patches.Rectangle(
    (ann1_box[0], ann1_box[1]), ann1_box[2]-ann1_box[0], ann1_box[3]-ann1_box[1],
    linewidth=2, edgecolor='#0d9e8e', facecolor='none', linestyle='--',
    label=f'Ann1 (IoU={compute_iou(ann1_box, ref_box):.2f})'))
ax.add_patch(patches.Rectangle(
    (ann2_box[0], ann2_box[1]), ann2_box[2]-ann2_box[0], ann2_box[3]-ann2_box[1],
    linewidth=2, edgecolor='#e05c5c', facecolor='none', linestyle=':',
    label=f'Ann2 (IoU={compute_iou(ann2_box, ref_box):.2f})'))
ax.legend(fontsize=10)
ax.set_title("Bounding Box Agreement (IoU)", fontsize=12)
plt.tight_layout()
plt.savefig('bbox_iou.png', dpi=150)
plt.show()
```

---

## Segmentation sémantique et d'instance

L'annotation de segmentation nécessite d'assigner une étiquette de classe à chaque pixel d'une image — parmi les types d'annotation les plus coûteux.

**Segmentation sémantique :** Chaque pixel appartient à une classe sémantique (route, ciel, personne, voiture). Tous les pixels de la même classe partagent la même étiquette, quel que soit l'objet individuel auquel ils appartiennent.

**Segmentation d'instance :** Chaque instance d'objet individuel reçoit une étiquette unique. Une foule de 20 personnes devient 20 masques distincts.

**Segmentation panoptique :** Combine les deux : les classes « chose » (objets dénombrables) ont des masques d'instance ; les classes « matière » (route, ciel) ont des masques sémantiques.

**Annotation assistée par SAM :** Le Modèle Segment Anything de Meta {cite}`kirillov2023segment` génère des masques de segmentation de haute qualité à partir d'un simple clic de point. Les annotateurs cliquent sur le centre d'un objet ; SAM propose un masque ; l'annotateur accepte ou corrige. Les auteurs de SAM rapportent des accélérations d'environ 6,5 fois par rapport à l'étiquetage basé sur des polygones ; les gains varient selon les types de scènes et les outils d'annotation.

SAM représente un changement plus large : **le rôle de l'annotateur passe du dessin à la révision**. Cela a des implications pour la qualité d'annotation au-delà de la vitesse. Quand les annotateurs dessinent, leur attention est mobilisée tout au long du processus. Quand les annotateurs révisent et cliquent sur « accepter », il y a des preuves qu'ils manquent plus facilement les erreurs — une version du biais d'automatisation spécifique au contexte d'annotation.

---

## Apprentissage actif pour la vision par ordinateur

L'apprentissage actif est particulièrement précieux en CV parce que :
1. Les images sont de haute dimension et riches en caractéristiques — les plongements des modèles pré-entraînés portent des signaux forts pour l'estimation de l'incertitude
2. Les grands pools non étiquetés sont bon marché (photos, images vidéo)
3. L'annotation (surtout la segmentation) est coûteuse et ne peut pas être facilement externalisée pour des domaines spécialisés

```{code-cell} python
import numpy as np
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
import matplotlib.pyplot as plt

rng = np.random.default_rng(42)

X, y = make_classification(n_samples=3000, n_features=50, n_informative=25,
                            n_classes=5, n_clusters_per_class=2, random_state=42)
X_train, y_train = X[:2500], y[:2500]
X_test,  y_test  = X[2500:], y[2500:]

def margin_uncertainty(model, X_pool):
    probs = model.predict_proba(X_pool)
    sorted_p = np.sort(probs, axis=1)
    return sorted_p[:, -2] - sorted_p[:, -1]  # most negative = most uncertain

n_init = 50
results = {'active': [], 'random': []}
label_counts = list(range(50, 401, 30))

for strategy in ['active', 'random']:
    labeled = list(rng.choice(len(X_train), n_init, replace=False))
    unlabeled = [i for i in range(len(X_train)) if i not in labeled]

    for target in label_counts:
        while len(labeled) < target and unlabeled:
            if strategy == 'active' and len(labeled) >= 10:
                model_temp = LogisticRegression(max_iter=300).fit(
                    X_train[labeled], y_train[labeled])
                margins = margin_uncertainty(model_temp, X_train[unlabeled])
                idx = int(np.argmin(margins))
            else:
                idx = rng.integers(0, len(unlabeled))
            labeled.append(unlabeled.pop(idx))

        clf = LogisticRegression(max_iter=300).fit(X_train[labeled], y_train[labeled])
        results[strategy].append(accuracy_score(y_test, clf.predict(X_test)))

plt.figure(figsize=(7, 4))
plt.plot(label_counts, results['active'], 'o-', color='#2b3a8f',
         linewidth=2, label='Active (margin sampling)')
plt.plot(label_counts, results['random'], 's--', color='#e05c5c',
         linewidth=2, label='Random baseline')
plt.xlabel("Labeled training images", fontsize=12)
plt.ylabel("Test accuracy", fontsize=12)
plt.title("Active Learning for 5-Class Image Classification", fontsize=13)
plt.legend(fontsize=11); plt.grid(alpha=0.3)
plt.tight_layout()
plt.savefig('cv_active_learning.png', dpi=150)
plt.show()
```

---

## Apprentissage semi-supervisé avec guidage humain

La grande quantité de données visuelles non étiquetées disponibles rend l'apprentissage semi-supervisé particulièrement attrayant pour la CV.

**Auto-entraînement / pseudo-étiquetage :** Entraîner un modèle sur des données étiquetées ; utiliser les prédictions à haute confiance sur des données non étiquetées comme pseudo-étiquettes ; ré-entraîner. La question de conception critique est le seuil de confiance. Un seuil bas apporte plus d'exemples mais introduit du bruit ; un seuil élevé laisse la plupart du pool non étiqueté inutilisé. L'implication humaine peut guider ce seuil — les annotateurs vérifient un échantillon d'exemples pseudo-étiquetés pour le calibrer.

**FixMatch et régularisation par cohérence :** Ces méthodes entraînent des modèles à produire des prédictions cohérentes sous augmentation. L'intuition HITL clé : les humains sont consultés non seulement pour les étiquettes mais pour la **conception d'augmentation** — quelles invariances le modèle devrait-il apprendre ? Un modèle pour l'imagerie médicale devrait être invariant à la rotation et à la luminosité mais pas à l'échelle ; un modèle pour la détection de texte ne devrait pas être rendu invariant à la distorsion perspective. Ces choix spécifiques au domaine nécessitent une expertise humaine, et les commettre à tort dégrade substantiellement l'apprentissage semi-supervisé.

**Apprentissage actif semi-supervisé :** La combinaison la plus efficace : l'apprentissage actif concentre les étiquettes humaines là où l'incertitude du modèle est la plus élevée ; l'auto-entraînement étiquette automatiquement la queue à haute confiance. L'effort humain se concentre là où il est le plus précieux, et le modèle bootstrap sur le reste. À chaque cycle, un audit humain d'un échantillon aléatoire de pseudo-étiquettes fournit une vérification de qualité sans nécessiter une révision complète.

---

## Annotation vidéo

L'annotation vidéo multiplie les défis de l'annotation d'images par le temps :

- **Suivi :** Les objets doivent être identifiés à travers les images. Les annotateurs étiquettent les images clés ; les algorithmes de suivi interpolent entre elles. Les échecs de suivi — occlusion, réentrée, mouvement rapide — nécessitent une ré-étiquetage humain à des taux plus élevés que le suivi en régime permanent.
- **Cohérence temporelle :** Les frontières dessinées à l'image $t$ devraient être spatialement cohérentes avec l'image $t+1$. Les annotations incohérentes sont un signal d'entraînement disant au modèle que les objets se déplacent de manière discontinue — une forme de bruit d'annotation particulièrement dommageable pour les modèles de détection.
- **Évolutivité :** Une vidéo d'une heure à 30 images par seconde représente 108 000 images. L'annotation complète est impraticable ; les stratégies d'échantillonnage doivent être conçues avec soin pour s'assurer que les événements rares (cas limites, quasi-accidents, scénarios de défaillance) ne sont pas systématiquement exclus.

Les outils d'annotation vidéo modernes prennent en charge le **suivi intelligent** qui propage les annotations à travers les images et signale les images où la confiance du suivi tombe en dessous d'un seuil, invitant l'annotateur à revérifier. C'est une application directe de l'idée d'apprentissage actif au pipeline d'annotation lui-même : l'outil interroge l'annotateur exactement là où son interpolation est incertaine.

**Le problème des événements rares dans les systèmes autonomes.** Pour les applications où les conséquences des événements rares sont catastrophiques — conduite autonome, navigation par drone — la distribution des images vues en fonctionnement normal est mal assortie à la distribution des images qui importent le plus. Un jeu de données construit par échantillonnage uniforme d'images de conduite contiendra des millions d'images « il ne se passe rien d'intéressant » et une poignée d'images de quasi-accident, d'éclairage inhabituel et de capteur dégradé qui importent réellement pour la sécurité. L'apprentissage actif HITL qui identifie et priorise de telles images n'est pas un hack d'efficacité — c'est une exigence de sécurité.

```{seealso}
Jeu de données ImageNet : {cite}`russakovsky2015imagenet`. Biais d'étiquettes dans ImageNet : {cite}`yang2020towards`. Référence COCO : {cite}`lin2014microsoft`. SAM (Segment Anything) : {cite}`kirillov2023segment`. Apprentissage actif par ensemble noyau pour la CV : {cite}`sener2018active`.
```
