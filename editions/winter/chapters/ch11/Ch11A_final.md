# Chapter 11 Technical Appendix: The Mathematics of Computer Vision

*Convolutional networks, object detection metrics, uncertainty in vision, and active learning for image annotation*

---

## A.11.1 Convolutional Neural Networks: Mathematical Treatment

### The Convolution Operation

A convolutional layer applies a set of learned **filters** (also called kernels) to an input feature map. For a 2D input $X \in \mathbb{R}^{H \times W}$ and a filter $K \in \mathbb{R}^{k \times k}$, the convolution output at position $(i, j)$ is:

$$Z[i, j] = \sum_{m=0}^{k-1} \sum_{n=0}^{k-1} X[i+m,\; j+n] \cdot K[m, n] + b$$

where $b$ is a bias term. For color images with $C$ input channels and $F$ filters, the full operation produces an output volume $Z \in \mathbb{R}^{H' \times W' \times F}$:

$$Z[i, j, f] = \sum_{c=1}^{C} \sum_{m=0}^{k-1} \sum_{n=0}^{k-1} X[i+m,\; j+n,\; c] \cdot K[m, n, c, f] + b_f$$

The filter $K[m, n, c, f]$ learns a feature detector: for edge detection, the filter will have learned weights that respond strongly to intensity gradients; for more complex patterns, the filter encodes whatever local structure maximally discriminates between training classes.

### Pooling and Spatial Hierarchy

After a convolution + activation layer, a **pooling operation** reduces spatial resolution:

$$\text{MaxPool}(Z)[i, j] = \max_{m \in [0,k), n \in [0,k)} Z[i \cdot s + m,\; j \cdot s + n]$$

where $s$ is the stride. Max pooling selects the strongest activation in each local region, providing translation invariance: the network responds similarly whether an edge is at position $(100, 100)$ or $(101, 100)$.

Stacking convolution-activation-pooling layers creates the **spatial hierarchy**: lower layers detect edges and textures (receptive field covers a small image region); higher layers detect object parts and whole objects (receptive field covers large image regions).

### AlexNet Architecture (2012)

Krizhevsky et al.'s AlexNet had 5 convolutional layers followed by 3 fully connected layers:

| Layer | Operation | Output Size | Parameters |
|-------|-----------|------------|------------|
| Input | — | 224×224×3 | 0 |
| Conv1 | 96 filters, 11×11, stride 4 | 55×55×96 | 34,944 |
| MaxPool1 | 3×3, stride 2 | 27×27×96 | 0 |
| Conv2 | 256 filters, 5×5 | 27×27×256 | 614,656 |
| MaxPool2 | 3×3, stride 2 | 13×13×256 | 0 |
| Conv3–5 | 384, 384, 256 filters | various | ~3.7M |
| FC1–3 | Fully connected | 4096, 4096, 1000 | ~58M |

Total: ~62M parameters. Trained on 1.2M ImageNet images with two NVIDIA GTX 580 GPUs. Top-5 error on ImageNet validation set: 15.3%, versus 26.2% for the next best entry.

### Modern Architectures

**ResNet** (He et al., 2016) introduced **residual connections** that allow gradients to flow directly across layers, enabling networks 50–152 layers deep:

$$\mathbf{h}^{(l+1)} = F(\mathbf{h}^{(l)}) + \mathbf{h}^{(l)}$$

where $F(\mathbf{h}^{(l)})$ is the learned residual. This prevents the vanishing gradient problem in very deep networks.

**Vision Transformers** (ViT, Dosovitskiy et al., 2021) apply the transformer's self-attention mechanism directly to image patches, treating an image as a sequence of 16×16 pixel patches processed by standard transformer layers. ViT outperforms CNNs on ImageNet-scale datasets when sufficient training data is available.

---

## A.11.2 Intersection over Union (IoU) for Object Detection

Object detection requires not just classifying what objects are present but localizing them — predicting bounding boxes around each object. The standard metric for evaluating localization quality is **Intersection over Union (IoU)**:

$$\text{IoU}(B_{\text{pred}}, B_{\text{gt}}) = \frac{\text{Area}(B_{\text{pred}} \cap B_{\text{gt}})}{\text{Area}(B_{\text{pred}} \cup B_{\text{gt}})}$$

For two axis-aligned rectangles with coordinates $(x_1^p, y_1^p, x_2^p, y_2^p)$ (predicted) and $(x_1^g, y_1^g, x_2^g, y_2^g)$ (ground truth):

$$x_{\text{inter}} = \max(0,\; \min(x_2^p, x_2^g) - \max(x_1^p, x_1^g))$$
$$y_{\text{inter}} = \max(0,\; \min(y_2^p, y_2^g) - \max(y_1^p, y_1^g))$$
$$\text{Area}_{\text{inter}} = x_{\text{inter}} \cdot y_{\text{inter}}$$
$$\text{IoU} = \frac{\text{Area}_{\text{inter}}}{\text{Area}(B_{\text{pred}}) + \text{Area}(B_{\text{gt}}) - \text{Area}_{\text{inter}}}$$

$\text{IoU} \in [0, 1]$:
- $\text{IoU} = 1$: perfect overlap (prediction exactly matches ground truth)
- $\text{IoU} = 0$: no overlap
- Common threshold for "correct detection": $\text{IoU} \geq 0.5$

### Mean Average Precision (mAP)

For a detection system evaluated across $N$ object classes, the standard metric is **mean Average Precision (mAP)**:

$$\text{mAP} = \frac{1}{N} \sum_{c=1}^{N} \text{AP}_c$$

where $\text{AP}_c$ is the area under the precision-recall curve for class $c$. For each class:
- A detected box is a **true positive** if $\text{IoU} \geq \tau$ (threshold $\tau$, typically 0.5) with a ground truth box of that class
- Otherwise it's a **false positive**
- Ground truth boxes not matched by any detection are **false negatives**

The precision-recall curve is computed by ranking detections by confidence score, and mAP at IoU threshold $\tau$ is written as mAP@$\tau$ (e.g., mAP@0.5 or mAP@0.75).

---

## A.11.3 MC Dropout for Uncertainty Estimation in Vision

**Monte Carlo (MC) Dropout** applies the uncertainty estimation method of Gal & Ghahramani (2016) to vision models. Rather than disabling dropout at test time (standard practice), MC Dropout keeps dropout active and makes $T$ stochastic forward passes:

```python
def mc_dropout_predict(model, image, T=50):
    model.train()  # Keep dropout active
    predictions = []
    for _ in range(T):
        with torch.no_grad():
            logits = model(image)
            probs = F.softmax(logits, dim=-1)
            predictions.append(probs)
    
    predictions = torch.stack(predictions)  # Shape: (T, num_classes)
    mean_pred = predictions.mean(dim=0)     # Mean class probabilities
    uncertainty = predictions.std(dim=0)    # Std across passes
    return mean_pred, uncertainty
```

Each forward pass with active dropout samples a different sub-network from the full network. This approximates Bayesian inference over the network's weights, treating the $T$ predictions as approximate samples from the posterior predictive distribution.

**Epistemic uncertainty** (model uncertainty, reducible with more data) can be estimated as the variance across the $T$ predictions:

$$\hat{\sigma}^2_{\text{epistemic}} = \frac{1}{T-1} \sum_{t=1}^{T} (f_t(x) - \bar{f}(x))^2$$

**Aleatoric uncertainty** (inherent data uncertainty, irreducible) can be estimated by having the model output both mean predictions and variance predictions:

$$\hat{\sigma}^2_{\text{aleatoric}} = \frac{1}{T} \sum_{t=1}^T \sigma_t^2(x)$$

**Total uncertainty** (predictive uncertainty):

$$\hat{\sigma}^2_{\text{total}} = \hat{\sigma}^2_{\text{epistemic}} + \hat{\sigma}^2_{\text{aleatoric}}$$

For a vision AI in medical imaging, epistemic uncertainty is actionable — it suggests the model has seen few training examples like this image, and a radiologist should be engaged. Aleatoric uncertainty reflects inherent image ambiguity (poor contrast, unusual presentation) that more training data cannot resolve — also worth flagging for human review, but for different reasons.

### Deep Ensembles

An alternative to MC Dropout for uncertainty estimation is **deep ensembles** (Lakshminarayanan et al., 2017): train $M$ models with different random initializations, and combine their predictions:

$$\bar{p}(y | x) = \frac{1}{M} \sum_{m=1}^{M} p_m(y | x)$$

$$\hat{\sigma}^2 = \frac{1}{M-1} \sum_{m=1}^{M} \left(p_m(y|x) - \bar{p}(y|x)\right)^2$$

Deep ensembles produce better-calibrated uncertainties than MC Dropout but require $M$ times the training compute and storage.

---

## A.11.4 Confusion Matrix for Object Detection

For a classification system, the confusion matrix entry $C_{ij}$ counts how many objects of true class $i$ were predicted as class $j$.

For object detection, the confusion matrix must additionally account for **missed detections** (false negatives — objects present but not detected) and **spurious detections** (false positives — detections with no corresponding ground truth object). An extended confusion matrix for $N$ classes plus a "background" class has shape $(N+1) \times (N+1)$:

| | Pred: Class 1 | Pred: Class 2 | ... | Pred: Background |
|--|--|--|--|--|
| **True: Class 1** | TP₁ | Conf(1→2) | | FN₁ |
| **True: Class 2** | Conf(2→1) | TP₂ | | FN₂ |
| ... | | | ... | |
| **True: Background** | FP₁ | FP₂ | | TN |

Where:
- **TP_c**: objects of class $c$ correctly detected with correct class label and sufficient IoU
- **Conf(i→j)**: objects of class $i$ detected with class label $j$ (classification error but correct localization)
- **FN_c**: objects of class $c$ present but not detected (missed detections)
- **FP_c**: detections labeled as class $c$ with no corresponding ground truth (spurious detections)

In medical imaging, the confusion matrix structure has direct clinical interpretation. For a lung nodule detector:
- FN (missed nodules) = missed cancer diagnoses → the highest-consequence error
- FP (spurious nodules) = unnecessary follow-up procedures → significant but less critical error
- This asymmetry in error costs justifies operating the system at a threshold where FN rate is minimized, even at the expense of higher FP rate

### Per-Class Performance and the Long Tail

In real-world object detection datasets, class distribution is heavily skewed — common objects appear thousands of times, rare objects appear dozens of times. Standard mAP aggregates performance equally across all classes, which can mask poor performance on rare classes.

For safety-critical systems (autonomous vehicles, medical imaging), rare-class performance often matters most. A pedestrian detection system that performs well overall but poorly on cyclists in unusual positions is still a safety risk. Reporting per-class AP and specifically monitoring performance on underrepresented conditions is part of responsible HITL deployment.

---

## A.11.5 Active Learning for Image Annotation

Human annotation of image data is expensive. Active learning strategies minimize annotation cost by selecting the most informative images for human labeling.

### Uncertainty Sampling for Classification

Given a pool of unlabeled images $\mathcal{U}$ and a current model, select the image with highest **predictive entropy**:

$$x^* = \arg\max_{x \in \mathcal{U}} \mathbb{H}[p(y | x)] = -\sum_c p(y=c | x) \log p(y=c | x)$$

Or using **BALD** (Bayesian Active Learning by Disagreement), which specifically selects images where the model is uncertain in a way that can be reduced by more data (epistemic uncertainty):

$$x^* = \arg\max_{x \in \mathcal{U}} \mathbb{I}[y; \theta | x, \mathcal{D}] = \mathbb{H}[p(y|x)] - \mathbb{E}_{\theta}[\mathbb{H}[p(y|x,\theta)]]$$

This selects images where the expected entropy under the posterior is low (the model would be confident if we knew the true weights) but the predictive entropy is high (we're uncertain because we're uncertain about the weights).

### Uncertainty Sampling for Bounding Box Annotation

Bounding box annotation is more complex — each image may contain multiple objects, and uncertainty may be localized to specific regions. Strategies include:

**Localization uncertainty:** Measure the variance in bounding box coordinates across MC Dropout samples. Images where predicted box coordinates have high variance indicate localization uncertainty — the model is unsure exactly where the object boundary is.

$$\text{loc\_uncertainty}(x) = \frac{1}{T-1} \sum_{t=1}^{T} \left\| \mathbf{b}_t(x) - \bar{\mathbf{b}}(x) \right\|_2^2$$

**Object count uncertainty:** Images where different dropout masks predict different numbers of objects in the scene have high uncertainty about what objects are present.

**Core-set selection (greedy farthest-first):** Select a set of images $S$ from $\mathcal{U}$ that maximally covers the feature space, minimizing the maximum distance between any unlabeled point and the nearest selected point:

$$S^* = \arg\min_{S \subseteq \mathcal{U}, |S|=n} \max_{x \in \mathcal{U}} \min_{s \in S} d(x, s)$$

where $d(x, s)$ is a distance in feature space (e.g., cosine distance of penultimate layer features). This ensures the annotation budget covers the diversity of the unlabeled pool rather than clustering around already-well-represented examples.

### Active Learning Loop Pseudocode

```python
def active_learning_loop(model, labeled_pool, unlabeled_pool, 
                          annotation_budget, query_strategy):
    """
    Active learning loop for image annotation.
    
    Args:
        model: current vision model
        labeled_pool: (images, labels) already annotated
        unlabeled_pool: images awaiting annotation
        annotation_budget: total images we can afford to annotate
        query_strategy: 'entropy', 'bald', 'coreset'
    """
    while annotation_budget > 0:
        # Train model on current labeled pool
        model.fit(labeled_pool)
        
        # Score each unlabeled image by informativeness
        scores = query_strategy.score(model, unlabeled_pool)
        
        # Select batch of highest-scoring images
        batch_size = min(BATCH_SIZE, annotation_budget)
        to_annotate = select_top_k(unlabeled_pool, scores, batch_size)
        
        # Human annotation step (the HITL intervention)
        new_labels = human_annotator.annotate(to_annotate)
        
        # Update pools
        labeled_pool.add(to_annotate, new_labels)
        unlabeled_pool.remove(to_annotate)
        annotation_budget -= batch_size
        
        # Evaluate performance on held-out validation set
        val_performance = model.evaluate(validation_set)
        log_performance(val_performance, len(labeled_pool))
    
    return model, labeled_pool
```

The `human_annotator.annotate()` call represents the HITL intervention — the step where human judgment is injected into the machine learning pipeline. The quality of the final model depends on both the quality of the query strategy (selecting informative images) and the quality of the human annotation (correctly labeling them).

### Expected Value of Including Each Example

For a rigorous cost-benefit analysis, the **expected value** of annotating image $x$ combines its informativeness with the cost of human annotation and the expected improvement in model performance:

$$V(x) = \mathbb{E}\!\left[\text{Performance}_{\text{new}}(\mathcal{D} \cup \{x, \hat{y}\})\right] - \text{Performance}_{\text{current}}(\mathcal{D}) - C_{\text{annotate}}$$

In practice, this exact computation is intractable, and active learning heuristics (entropy, BALD, core-set) are practical approximations. The key insight remains: not all images are equally informative, and the human annotator's time should be concentrated on the images where their input will most change the model.

---

*This appendix provides the mathematical foundations for understanding how machines see, how we measure their seeing, and how humans remain essential in the loop of teaching machines to see better.*
