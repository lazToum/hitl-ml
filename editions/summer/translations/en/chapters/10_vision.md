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

# HITL in Computer Vision

Computer vision provides some of the most visually intuitive examples of HITL ML. The ImageNet challenge, built on 14 million human-labeled images, launched the deep learning era. Medical imaging annotation by radiologists powers diagnostic AI. Autonomous vehicles depend on millions of human-labeled frames to learn to perceive the world.

What is easy to miss: these are not simply cases of humans providing ground truth. They are cases of humans constructing datasets that embed specific perceptual, cultural, and operational choices — choices that become visible only later, when models fail in predictable ways.

---

## How Annotation Choices Become Model Biases

The standard framing treats annotation as data collection: humans observe the world and record what they see. The more accurate framing is that annotation is *dataset design*: humans decide what categories to use, where to draw boundaries, which edge cases to include, and how to resolve ambiguity — and all of those decisions shape what the trained model will perceive.

### The ImageNet Case

ImageNet {cite}`russakovsky2015imagenet` is the most consequential dataset in computer vision history. Its label set derives from WordNet synsets, chosen primarily for being numerous and semantically distinct. Several consequences of this design choice emerged years later:

- **Person categories encoded demographic associations.** Early versions of ImageNet's synset labels for people included many that would now be considered derogatory or biased, reflecting both the historical WordNet source and the annotation workforce's implicit decisions about which labels to apply to which images {cite}`yang2020towards`. Labels applied to images of people encoded race, gender, and class associations that propagated directly into model embeddings.

- **Fine-grained species taxonomy, coarse-grained of almost everything else.** ImageNet can distinguish 120 dog breeds but collapses enormous variation in tools, vehicles, food, and furniture into single categories. This was a consequence of following WordNet's structure, not a deliberate choice about what matters. Models trained on ImageNet exhibit the same asymmetric precision.

- **Western, English-speaking visual defaults.** The images were collected primarily from Flickr and Internet searches using English-language queries. The resulting distribution skews heavily toward the visual environment and cultural objects of wealthy, English-speaking countries.

None of these were errors. They were annotation design choices made quickly at scale, often by people who did not anticipate how the dataset would be used. The lesson is not that ImageNet should have been built differently (though it should have), but that **annotation design is model design**, and it should be treated with the same care.

:::{admonition} Annotation schema is a theory of the world
:class: note

Every label taxonomy makes claims about what distinctions matter. Choosing to separate "car" from "truck" while collapsing all sedans into one class is a theoretical claim about which distinctions are semantically relevant. Choosing to annotate "person" as a single class regardless of pose, clothing, or activity is a different theoretical claim. Models trained on these schemas will make the same distinctions, and no more — they will not generalize beyond the categories they were trained to distinguish.
:::

---

## Image Classification Annotation

The simplest CV annotation task is assigning one or more labels to an entire image.

**Label hierarchy.** The label "dog" is a child of "animal" in a semantic hierarchy. Models trained on flat taxonomies may not generalize well across levels of abstraction. ImageNet uses a synset-based hierarchy that allows evaluation at multiple levels of specificity.

**Multi-label ambiguity.** A street scene may contain a car, a person, a bicycle, and a traffic light simultaneously. Deciding which labels to include requires clear guidelines about relevance thresholds.

**Long-tail distributions.** Natural image datasets follow a power law: a few categories are extremely common; most are rare. Active learning is particularly valuable for long-tail categories where random sampling yields only a handful of examples.

---

## Object Detection: Bounding Box Annotation

Object detection requires annotators to draw axis-aligned bounding boxes around instances of each object class. This introduces geometric precision requirements and significant edge cases.

**Annotation quality metrics:**

*IoU (Intersection over Union)* measures the overlap between an annotated box and a reference box:

$$
\text{IoU}(A, B) = \frac{|A \cap B|}{|A \cup B|}
$$

$\text{IoU} \geq 0.5$ is the standard threshold for a "correct" detection in PASCAL VOC; COCO {cite}`lin2014microsoft` uses a range of thresholds from 0.5 to 0.95, which is considerably more demanding and more informative.

**Annotation edge cases that must be resolved in guidelines:**
- Occluded objects: annotate visible portion or extrapolate full extent?
- Truncated objects (partially outside the frame): include or exclude?
- Crowd regions: use a special "crowd" annotation or annotate individual instances?

Each of these decisions changes what "correct detection" means — and therefore changes what the model is trained to do.

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

## Semantic and Instance Segmentation

Segmentation annotation requires assigning a class label to every pixel in an image — among the most expensive annotation types.

**Semantic segmentation:** Each pixel belongs to a semantic class (road, sky, person, car). All pixels of the same class share the same label, regardless of which individual object they belong to.

**Instance segmentation:** Each individual object instance gets a unique label. A crowd of 20 people becomes 20 distinct masks.

**Panoptic segmentation:** Combines both: "thing" classes (countable objects) have instance masks; "stuff" classes (road, sky) have semantic masks.

**SAM-assisted annotation:** Meta's Segment Anything Model {cite}`kirillov2023segment` generates high-quality segmentation masks from a single point click. Annotators click the center of an object; SAM proposes a mask; the annotator accepts or corrects. The SAM authors report annotation engine speedups of roughly 6.5× over polygon-based labelling; gains vary across scene types and annotation tools.

SAM represents a broader shift: **the annotator's role changes from drawing to reviewing**. This has implications for annotation quality beyond speed. When annotators draw, their attention is engaged throughout the process. When annotators review and click "accept," there is evidence that they miss errors more readily — a version of automation bias specific to the annotation context.

---

## Active Learning for Computer Vision

Active learning is particularly valuable in CV because:
1. Images are high-dimensional and feature-rich — embeddings from pre-trained models carry strong signals for uncertainty estimation
2. Large unlabeled pools are cheap (photos, video frames)
3. Annotation (especially segmentation) is expensive and cannot be easily crowdsourced for specialized domains

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

## Semi-Supervised Learning with Human Guidance

The large quantity of unlabeled visual data available makes semi-supervised learning particularly attractive for CV.

**Self-training / pseudo-labeling:** Train a model on labeled data; use high-confidence predictions on unlabeled data as pseudo-labels; retrain. The critical design question is the confidence threshold. A low threshold brings in more examples but introduces noise; a high threshold leaves most of the unlabeled pool unused. Human involvement can guide this threshold — annotators spot-check a sample of pseudo-labeled examples to calibrate it.

**FixMatch and consistency regularization:** These methods train models to produce consistent predictions under augmentation. The key HITL insight: humans are consulted not just for labels but for **augmentation design** — which invariances should the model learn? A model for medical imaging should be invariant to rotation and brightness but not to scale; a model for text detection should not be made invariant to perspective distortion. These domain-specific choices require human expertise, and getting them wrong degrades semi-supervised learning substantially.

**Active semi-supervised learning:** The most efficient combination: active learning concentrates human labels where model uncertainty is highest; self-training auto-labels the high-confidence tail. The human effort concentrates where it is most valuable, and the model bootstraps on the rest. At each cycle, a human audit of a random sample of pseudo-labels provides a quality check without requiring full review.

---

## Video Annotation

Video annotation multiplies the challenges of image annotation by time:

- **Tracking:** Objects must be identified across frames. Annotators label keyframes; tracking algorithms interpolate between them. Tracking failures — occlusion, re-entry, rapid motion — require human re-labeling at higher rates than steady-state tracking.
- **Temporal consistency:** Boundaries drawn in frame $t$ should be spatially consistent with frame $t+1$. Inconsistent annotations are a training signal telling the model that objects jump discontinuously — a form of annotation noise that is particularly damaging for detection models.
- **Scalability:** A 1-hour video at 30fps is 108,000 frames. Full annotation is impractical; sampling strategies must be designed carefully to ensure that rare events (edge cases, near-misses, failure scenarios) are not systematically excluded.

Modern video annotation tools support **smart tracking** that propagates annotations across frames and flags frames where tracking confidence drops below a threshold, prompting the annotator to re-check. This is a direct application of the active learning idea to the annotation pipeline itself: the tool queries the annotator exactly where its interpolation is uncertain.

**The rare event problem in autonomous systems.** For applications where the consequences of rare events are catastrophic — autonomous driving, UAV navigation — the distribution of frames seen in normal operation is badly mismatched with the distribution of frames that matter most. A dataset built by uniformly sampling driving footage will contain millions of "nothing interesting is happening" frames and a handful of the near-accident, unusual-lighting, and degraded-sensor frames that actually matter for safety. HITL active learning that identifies and prioritizes such frames is not an efficiency hack — it is a safety requirement.

```{seealso}
ImageNet dataset: {cite}`russakovsky2015imagenet`. Label bias in ImageNet: {cite}`yang2020towards`. COCO benchmark: {cite}`lin2014microsoft`. SAM (Segment Anything): {cite}`kirillov2023segment`. Core-set active learning for CV: {cite}`sener2018active`.
```
