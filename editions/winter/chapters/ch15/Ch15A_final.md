# Chapter 15 Technical Appendix: Error Analysis Frameworks for HITL Systems

*Tools for diagnosing, measuring, and debugging failures in human-in-the-loop pipelines*

---

## Overview

This appendix provides the technical foundations for the diagnostic work described in Chapter 15. We cover four interconnected tools: error analysis frameworks, slice-based evaluation, behavioral testing with the CheckList methodology, and data debugging with influence functions. Each tool addresses a different question in the HITL failure taxonomy.

---

## 1. Error Analysis Frameworks

Standard ML evaluation — accuracy, precision, recall, F1, AUC — measures aggregate model performance. In HITL systems, aggregate metrics are necessary but not sufficient. A model with 95% accuracy may still have systematic failure modes that are invisible in aggregate statistics.

### 1.1 Confusion Matrix Analysis

The basic building block of error analysis is the confusion matrix. For a binary classifier:

|  | Predicted Positive | Predicted Negative |
|---|---|---|
| **Actual Positive** | True Positive (TP) | False Negative (FN) |
| **Actual Negative** | False Positive (FP) | True Negative (TN) |

In HITL systems, the asymmetry between FP and FN costs is critical for threshold design. For a medical diagnosis system, a False Negative (missed disease) is typically far more costly than a False Positive (unnecessary follow-up). This asymmetry should directly determine where the threshold is set.

The optimal threshold under asymmetric costs:

$$\theta^* = \frac{C_{FP}}{C_{FP} + C_{FN}}$$

where $C_{FP}$ is the cost of a false positive and $C_{FN}$ is the cost of a false negative.

For a cancer screening system with $C_{FP} = \$200$ (unnecessary biopsy) and $C_{FN} = \$50{,}000$ (missed diagnosis):

$$\theta^* = \frac{200}{200 + 50{,}000} \approx 0.004$$

This means the system should flag for human review whenever the model's confidence in the negative prediction exceeds 99.6% — i.e., it should be extremely conservative about automated negative decisions.

### 1.2 Calibration Analysis

A well-calibrated model is one whose confidence scores match empirical accuracy: a model that says "90% confident" should be correct about 90% of the time.

Calibration is assessed with **reliability diagrams**: plot the predicted confidence on the x-axis against the actual accuracy for that confidence bucket on the y-axis. A perfectly calibrated model produces a diagonal line. An overconfident model's curve falls below the diagonal (it says 80% confident but is only right 60% of the time). An underconfident model's curve falls above it.

The standard scalar metric is **Expected Calibration Error (ECE)**:

$$ECE = \sum_{b=1}^{B} \frac{|B_b|}{n} \left| \text{acc}(B_b) - \text{conf}(B_b) \right|$$

where $B_b$ is a bucket of predictions grouped by confidence, $\text{acc}(B_b)$ is empirical accuracy in that bucket, and $\text{conf}(B_b)$ is mean confidence.

**Why this matters for HITL**: If a model is systematically overconfident, its uncertainty estimates cannot be trusted to trigger human review at the right times. Calibration is a prerequisite for meaningful uncertainty detection.

### 1.3 Temporal Stability Analysis

Models trained at time $t$ will encounter distribution shift as the world changes. In HITL systems, a useful diagnostic is to compare model performance over time:

```python
def temporal_stability_analysis(predictions_log, window_days=30):
    """
    Split prediction log into temporal windows.
    Compare accuracy across windows to detect drift.
    """
    df = pd.DataFrame(predictions_log)
    df['date'] = pd.to_datetime(df['timestamp'])
    df['window'] = df['date'].dt.to_period(f'{window_days}D')
    
    results = df.groupby('window').agg({
        'correct': ['mean', 'count'],
        'confidence': 'mean'
    })
    
    # Flag windows where accuracy drops more than 2 std below baseline
    baseline_acc = results['correct']['mean'][:3].mean()
    baseline_std = results['correct']['mean'][:3].std()
    
    results['drift_flag'] = (
        results['correct']['mean'] < baseline_acc - 2 * baseline_std
    )
    
    return results
```

---

## 2. Slice-Based Evaluation

The most powerful technique for detecting systematic failures is slice-based evaluation: instead of computing one aggregate metric, compute metrics separately for meaningful subpopulations.

### 2.1 Defining Slices

Slices should be defined based on:
- **Demographics**: Age, gender, race/ethnicity, geographic region, language
- **Domain-specific attributes**: In medical AI, disease severity, imaging equipment type, institution
- **Temporal attributes**: Time of day, day of week, season, year
- **Input characteristics**: Text length, image quality, transaction amount

In fraud detection, relevant slices might include:
- Transaction amount range ($0–$100, $100–$1000, $1000+)
- Merchant category (retail, travel, digital goods, cross-border)
- Account tenure (new customer, < 1 year, 1–5 years, > 5 years)
- Geographic origin of transaction

### 2.2 Slice Performance Analysis

```python
def slice_performance_analysis(df, target_col, pred_col, slice_cols):
    """
    Compute accuracy metrics for each combination of slice values.
    Flag slices where performance falls below threshold.
    """
    results = []
    
    # Baseline performance
    baseline = compute_metrics(df[target_col], df[pred_col])
    
    for col in slice_cols:
        for val in df[col].unique():
            slice_df = df[df[col] == val]
            if len(slice_df) < 50:  # Minimum sample size
                continue
            
            metrics = compute_metrics(
                slice_df[target_col], 
                slice_df[pred_col]
            )
            
            results.append({
                'slice_col': col,
                'slice_val': val,
                'n': len(slice_df),
                'accuracy': metrics['accuracy'],
                'gap_from_baseline': metrics['accuracy'] - baseline['accuracy'],
                'precision': metrics['precision'],
                'recall': metrics['recall']
            })
    
    return pd.DataFrame(results).sort_values('gap_from_baseline')
```

### 2.3 Intersectional Slicing

Single-dimensional slicing misses intersectional failures. A model may perform well on each individual attribute while failing on combinations: well on "female" and well on "high income," but poorly on "high-income females." The space of intersectional slices grows exponentially, requiring either domain-guided selection or automated methods.

**Slice finder** methods (Chung et al., 2019; Eyuboglu et al., 2022) use clustering and decision-tree-based approaches to automatically identify subpopulations where model performance is poor.

---

## 3. Behavioral Testing: The CheckList Methodology

The CheckList methodology (Ribeiro et al., 2020, ACL Best Paper) adapts software testing principles to NLP models. Instead of asking "what is this model's aggregate accuracy?" it asks "does this model satisfy specific behavioral invariances?"

### 3.1 Three Test Types

**Minimum Functionality Tests (MFT)**: Does the model handle basic, obvious cases correctly?

```python
# For a sentiment classifier
mft_tests = [
    ("This product is great!", "positive"),
    ("I hate this so much.", "negative"),
    ("The item arrived on time.", "neutral"),
]
```

**Invariance Tests (INV)**: Does the model's output remain stable when inputs are changed in ways that should not affect the output?

```python
# Sentiment should not change when names are swapped
inv_tests = [
    ("John loved the product.", "Mary loved the product."),  # same label expected
    ("The product failed Sarah.", "The product failed Bob."),  # same label expected
]
```

**Directional Tests (DIR)**: Does the model's output change appropriately when inputs are changed in ways that should affect the output?

```python
# Sentiment should become more negative with added negation
dir_tests = [
    ("The product is good.", "The product is not good."),  # should decrease
    ("I recommend this.", "I don't recommend this."),  # should decrease
]
```

### 3.2 Applying CheckList to HITL Annotation Quality

CheckList can be adapted to test annotation quality rather than model quality. For content moderation:

```python
def annotation_behavioral_tests(annotation_sample):
    """
    Test annotation consistency across behavioral perturbations.
    """
    # Invariance: Same content, different protected attribute mentioned
    inv_pairs = [
        ("The speech by [Group A] was offensive", 
         "The speech by [Group B] was offensive"),
    ]
    
    consistency_scores = []
    for text_a, text_b in inv_pairs:
        labels_a = annotation_sample.get_labels(text_a)
        labels_b = annotation_sample.get_labels(text_b)
        consistency_scores.append(
            cohen_kappa_score(labels_a, labels_b)
        )
    
    return {
        'mean_consistency': np.mean(consistency_scores),
        'min_consistency': np.min(consistency_scores),
        'flagged_pairs': [
            pair for pair, score 
            in zip(inv_pairs, consistency_scores) 
            if score < 0.6  # Below acceptable threshold
        ]
    }
```

### 3.3 CheckList for Reviewer Behavior

The same framework applies to testing human reviewer consistency in HITL systems:

- **MFT equivalent**: Are reviewers correctly handling obvious cases (clear violations, clear non-violations)?
- **INV equivalent**: Are reviewers applying the same standard to equivalent content from different demographic groups, political perspectives, or writing styles?
- **DIR equivalent**: Are reviewers appropriately more likely to flag content as the severity of the violation increases?

---

## 4. Data Debugging with Influence Functions

When you identify a systematic model failure, you need to trace it to its source in the training data. Influence functions provide a principled method for asking: which training examples most influenced the model's prediction on a given test case?

### 4.1 The Influence Function Concept

The influence function (Koh & Liang, 2017) estimates the change in model parameters if a single training example were removed or upweighted:

$$\mathcal{I}(z, z_{test}) = -\nabla_\theta \mathcal{L}(z_{test}, \hat{\theta})^T H_{\hat{\theta}}^{-1} \nabla_\theta \mathcal{L}(z, \hat{\theta})$$

where $z$ is a training example, $z_{test}$ is the test example of interest, $\hat{\theta}$ are the trained parameters, $H_{\hat{\theta}}$ is the Hessian of the training loss, and $\mathcal{L}$ is the loss function.

In practice, this tells you: if training example $z$ were removed, how much would the model's prediction on $z_{test}$ change?

### 4.2 Using Influence Functions for Bias Detection

```python
from sklearn.linear_model import LogisticRegression
import numpy as np

def compute_influence_scores(model, X_train, y_train, X_test_point):
    """
    Simplified influence function computation for linear models.
    For deep models, use TracIn or approximate influence methods.
    """
    # Compute gradient at test point
    pred = model.predict_proba(X_test_point.reshape(1, -1))
    residual = y_test_point - pred[0, 1]
    grad_test = residual * X_test_point
    
    # Compute Hessian (for logistic regression, use Fisher information)
    preds_train = model.predict_proba(X_train)
    weights = preds_train[:, 0] * preds_train[:, 1]
    H = (X_train.T * weights) @ X_train / len(X_train)
    
    # Compute influence for each training point
    H_inv_grad_test = np.linalg.solve(H, grad_test)
    
    influences = np.array([
        -np.dot(residual_i * X_train[i], H_inv_grad_test)
        for i, residual_i in enumerate(y_train - preds_train[:, 1])
    ])
    
    return influences

def find_most_influential_training_examples(
    model, X_train, y_train, 
    problematic_test_examples, 
    top_k=50
):
    """
    For a set of problematic test examples,
    find the training examples most responsible.
    """
    aggregate_influence = np.zeros(len(X_train))
    
    for x_test in problematic_test_examples:
        influences = compute_influence_scores(
            model, X_train, y_train, x_test
        )
        aggregate_influence += np.abs(influences)
    
    top_indices = np.argsort(aggregate_influence)[-top_k:]
    return X_train[top_indices], y_train[top_indices], top_indices
```

### 4.3 Practical Application: Tracing Label Noise

A more practical application in annotation-failure scenarios is **label noise detection**. Training examples with high loss under the trained model are candidates for mislabeled instances:

```python
def detect_potential_mislabels(model, X_train, y_train, threshold_percentile=95):
    """
    Identify training examples with anomalously high loss.
    These are candidates for relabeling.
    """
    preds = model.predict_proba(X_train)
    
    # Compute per-example cross-entropy loss
    losses = -np.array([
        y_train[i] * np.log(preds[i, 1] + 1e-10) + 
        (1 - y_train[i]) * np.log(preds[i, 0] + 1e-10)
        for i in range(len(y_train))
    ])
    
    threshold = np.percentile(losses, threshold_percentile)
    suspicious_indices = np.where(losses > threshold)[0]
    
    return {
        'suspicious_indices': suspicious_indices,
        'suspicious_labels': y_train[suspicious_indices],
        'losses': losses[suspicious_indices],
        'recommended_for_review': X_train[suspicious_indices]
    }
```

---

## 5. Inter-Annotator Agreement Metrics

For annotation failure diagnosis, the key measurement is inter-annotator agreement. Several metrics are appropriate depending on the task:

**Cohen's Kappa** (two annotators, categorical labels):
$$\kappa = \frac{p_o - p_e}{1 - p_e}$$

where $p_o$ is observed agreement and $p_e$ is expected agreement by chance. Values above 0.6 are generally acceptable; above 0.8 is good; below 0.4 suggests serious annotation problems.

**Fleiss' Kappa** (more than two annotators):
$$\kappa_F = \frac{\bar{P} - \bar{P}_e}{1 - \bar{P}_e}$$

**Krippendorff's Alpha** (most flexible; handles missing data and ordinal scales):
$$\alpha = 1 - \frac{D_o}{D_e}$$

where $D_o$ is observed disagreement and $D_e$ is expected disagreement.

### Annotator Drift Detection

```python
def detect_annotator_drift(annotation_log, window_size=500):
    """
    Check whether individual annotator agreement with 
    consensus drifts over time (indicating fatigue or 
    changing standards).
    """
    df = pd.DataFrame(annotation_log)
    df = df.sort_values('timestamp')
    
    drift_results = {}
    
    for annotator_id in df['annotator_id'].unique():
        annotator_df = df[df['annotator_id'] == annotator_id]
        
        # Compute agreement with consensus in rolling windows
        windows = []
        for i in range(0, len(annotator_df) - window_size, window_size // 2):
            window = annotator_df.iloc[i:i + window_size]
            kappa = cohen_kappa_score(
                window['label'], 
                window['consensus_label']
            )
            windows.append({
                'window_start': window['timestamp'].iloc[0],
                'kappa': kappa,
                'n': len(window)
            })
        
        drift_results[annotator_id] = pd.DataFrame(windows)
    
    return drift_results
```

---

## 6. The HITL Debugging Workflow

The four tools above are most powerful when used in sequence:

1. **Calibration analysis** → Are the model's confidence scores trustworthy? If not, uncertainty detection is broken.

2. **Slice-based evaluation** → Are there subpopulations where performance is systematically lower? If so, model failure or annotation failure.

3. **CheckList behavioral tests** → Are there specific linguistic or demographic invariances that fail? If so, likely annotation failure.

4. **Influence functions / label noise detection** → Which specific training examples are responsible? Prioritize for relabeling.

5. **Inter-annotator agreement analysis** → Is the labeling process itself reliable? If not, the entire feedback loop is suspect.

---

## References

Chung, Y., Krause, B., & Smyth, P. (2019). *Slice finder: Automated data slicing for model validation.* ICDE.

Eyuboglu, S., et al. (2022). *Domino: Discovering systematic errors with cross-modal embeddings.* ICLR.

Koh, P. W., & Liang, P. (2017). *Understanding black-box predictions via influence functions.* ICML.

Ribeiro, M. T., Wu, T., Guestrin, C., & Singh, S. (2020). *Beyond accuracy: Behavioral testing of NLP models with CheckList.* ACL.

Guo, C., Pleiss, G., Sun, Y., & Weinberger, K. Q. (2017). *On calibration of modern neural networks.* ICML.

Northcutt, C. G., Athalye, A., & Mueller, J. (2021). *Pervasive label errors in test sets destabilize machine learning benchmarks.* NeurIPS Datasets & Benchmarks.

Friedler, S. A., et al. (2019). *A comparative study of fairness-enhancing interventions in machine learning.* FAccT.

Buolamwini, J., & Gebru, T. (2018). *Gender shades: Intersectional accuracy disparities in commercial gender classification.* FAccT.
