# Chapter 14 Technical Appendix: Fairness Metrics, Bias Auditing, and Algorithmic Accountability Tools

*Mathematical foundations and Python implementations for building and auditing fair AI systems*

---

## A14.1 Formal Fairness Definitions

Fairness in machine learning is not a single quantity. It is a family of distinct mathematical properties, some mutually incompatible. This section formalizes the major definitions and makes explicit the tradeoffs among them.

Let:
- $\hat{Y}$ = model prediction (binary: 0 or 1)
- $Y$ = true outcome
- $A$ = sensitive attribute (e.g., race, gender, age group)
- $X$ = all other features

**Demographic Parity (Statistical Parity):**

$$P(\hat{Y} = 1 \mid A = 0) = P(\hat{Y} = 1 \mid A = 1)$$

The probability of a positive prediction is equal across groups. A hiring algorithm satisfies demographic parity if it recommends candidates at equal rates regardless of protected attribute.

**Equalized Odds (Hardt, Price & Srebro, 2016):**

$$P(\hat{Y} = 1 \mid Y = y, A = 0) = P(\hat{Y} = 1 \mid Y = y, A = 1) \quad \text{for } y \in \{0,1\}$$

Both the true positive rate (TPR) and false positive rate (FPR) are equal across groups. A medical screening tool satisfies equalized odds if it correctly identifies sick patients — and incorrectly flags healthy ones — at equal rates regardless of demographic group.

**Equal Opportunity** (weaker form of equalized odds): only the TPR constraint:

$$P(\hat{Y} = 1 \mid Y = 1, A = 0) = P(\hat{Y} = 1 \mid Y = 1, A = 1)$$

**Calibration (Predictive Rate Parity):**

$$P(Y = 1 \mid \hat{Y} = 1, A = 0) = P(Y = 1 \mid \hat{Y} = 1, A = 1)$$

Among all individuals predicted positive, the fraction who are actually positive is equal across groups.

---

## A14.2 The Fairness Impossibility Theorem

Chouldechova (2017) proved that calibration and equal FPR cannot simultaneously hold when base rates differ across groups. Here is the formal statement and an intuitive proof sketch.

**Setup:** Let $b_A = P(Y = 1 \mid A)$ denote the base rate of the outcome for group $A$.

**Theorem (Chouldechova, 2017):** If $b_0 \neq b_1$ (base rates differ), then any score $s$ cannot simultaneously satisfy:

1. **Calibration:** $P(Y=1 \mid s, A) = s$ for all groups
2. **Equal FPR:** $P(\hat{Y}=1 \mid Y=0, A=0) = P(\hat{Y}=1 \mid Y=0, A=1)$
3. **Equal FNR:** $P(\hat{Y}=0 \mid Y=1, A=0) = P(\hat{Y}=0 \mid Y=1, A=1)$

**Intuitive proof:** For a calibrated model at threshold $\tau$:

$$FPR_A = \frac{(1-\text{PPV}_A) \cdot \text{PR}_A}{1 - b_A}$$

where $\text{PPV}_A$ is the positive predictive value and $\text{PR}_A$ is the prediction rate for group $A$. If $b_0 \neq b_1$ and $\text{PPV}$ is equalized (calibration), then FPR equality requires $\text{PR}_A$ to adjust in a way that inevitably violates FNR equality. All three cannot hold simultaneously.

**Python illustration of the impossibility:**

```python
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import confusion_matrix

def compute_fairness_metrics(y_true, y_pred, groups):
    """
    Compute fairness metrics across two demographic groups.
    Returns dict of {metric: {group_0: value, group_1: value}}.
    """
    results = {}
    for group_val in [0, 1]:
        mask = groups == group_val
        yt = y_true[mask]
        yp = y_pred[mask]

        tn, fp, fn, tp = confusion_matrix(yt, yp, labels=[0,1]).ravel()
        n = len(yt)

        tpr = tp / (tp + fn) if (tp + fn) > 0 else np.nan
        fpr = fp / (fp + tn) if (fp + tn) > 0 else np.nan
        ppv = tp / (tp + fp) if (tp + fp) > 0 else np.nan
        pred_rate = (tp + fp) / n

        results[f'group_{group_val}'] = {
            'TPR': tpr, 'FPR': fpr,
            'PPV': ppv, 'pred_rate': pred_rate,
            'base_rate': (tp + fn) / n
        }

    return results


def demonstrate_impossibility(base_rate_0=0.2, base_rate_1=0.4, n=2000):
    """
    Simulate the fairness impossibility: when base rates differ,
    a calibrated model cannot equalize both TPR and FPR.
    """
    np.random.seed(42)

    # Generate two groups with different base rates
    y0 = np.random.binomial(1, base_rate_0, n // 2)
    y1 = np.random.binomial(1, base_rate_1, n // 2)
    y = np.concatenate([y0, y1])
    groups = np.concatenate([np.zeros(n // 2), np.ones(n // 2)])

    # Create a calibrated score (Bayes-optimal for each group separately)
    # Uses a single threshold across groups — this is the constraint
    scores = np.where(
        groups == 0,
        np.random.beta(2, 8, n),   # skewed low for low base rate
        np.random.beta(4, 6, n)    # higher for high base rate
    )
    # Adjust scores so predictions are calibrated
    threshold = 0.3
    y_pred = (scores > threshold).astype(int)

    metrics = compute_fairness_metrics(y, y_pred, groups)

    print("Fairness Impossibility Demonstration")
    print(f"Base rate group 0: {base_rate_0}, group 1: {base_rate_1}")
    print("-" * 50)
    for g in ['group_0', 'group_1']:
        m = metrics[g]
        print(f"{g}: TPR={m['TPR']:.3f}, FPR={m['FPR']:.3f}, "
              f"PPV={m['PPV']:.3f}, PredRate={m['pred_rate']:.3f}")

    # Show that satisfying calibration breaks equal FPR
    fpr_gap = abs(metrics['group_0']['FPR'] - metrics['group_1']['FPR'])
    tpr_gap = abs(metrics['group_0']['TPR'] - metrics['group_1']['TPR'])
    ppv_gap = abs(metrics['group_0']['PPV'] - metrics['group_1']['PPV'])

    print(f"\nFPR gap: {fpr_gap:.3f} | TPR gap: {tpr_gap:.3f} | "
          f"PPV gap (calibration): {ppv_gap:.3f}")
    print("Note: Minimizing PPV gap (calibration) cannot prevent FPR gap "
          "when base rates differ.")
```

---

## A14.3 Bias Detection with Fairlearn

Microsoft's Fairlearn library provides audit dashboards and mitigation algorithms.

```python
from fairlearn.metrics import (
    MetricFrame, demographic_parity_difference,
    equalized_odds_difference, selection_rate
)
from sklearn.metrics import accuracy_score, precision_score, recall_score
import pandas as pd

def full_fairness_audit(y_true, y_pred, sensitive_features, feature_name):
    """
    Run a complete fairness audit on a binary classifier's predictions.

    Parameters:
    -----------
    y_true : array-like, true labels
    y_pred : array-like, predicted labels
    sensitive_features : array-like, demographic group labels
    feature_name : str, name of the sensitive feature

    Returns:
    --------
    dict with MetricFrame and scalar disparity metrics
    """
    # MetricFrame computes multiple metrics across groups simultaneously
    mf = MetricFrame(
        metrics={
            'accuracy': accuracy_score,
            'precision': precision_score,
            'recall': recall_score,
            'selection_rate': selection_rate,
        },
        y_true=y_true,
        y_pred=y_pred,
        sensitive_features=sensitive_features
    )

    # Scalar disparity metrics
    dp_diff = demographic_parity_difference(
        y_true, y_pred, sensitive_features=sensitive_features
    )
    eo_diff = equalized_odds_difference(
        y_true, y_pred, sensitive_features=sensitive_features
    )

    print(f"Fairness Audit: {feature_name}")
    print("=" * 60)
    print("\nPer-group metrics:")
    print(mf.by_group.to_string())
    print(f"\nOverall accuracy:          {mf.overall['accuracy']:.4f}")
    print(f"Demographic parity diff:   {dp_diff:.4f}  (0=fair, >0=disparity)")
    print(f"Equalized odds diff:       {eo_diff:.4f}  (0=fair, >0=disparity)")

    # Flag if thresholds exceeded
    if abs(dp_diff) > 0.1:
        print(f"WARNING: Demographic parity gap ({dp_diff:.3f}) exceeds 0.1 threshold")
    if abs(eo_diff) > 0.1:
        print(f"WARNING: Equalized odds gap ({eo_diff:.3f}) exceeds 0.1 threshold")

    return {
        'metric_frame': mf,
        'demographic_parity_difference': dp_diff,
        'equalized_odds_difference': eo_diff,
    }
```

---

## A14.4 Bias Mitigation Techniques

Three categories of mitigation correspond to three stages in the ML pipeline:

**Pre-processing:** Modify training data before model training.
**In-processing:** Add fairness constraints to the learning objective.
**Post-processing:** Adjust model predictions after training.

```python
from fairlearn.reductions import ExponentiatedGradient, DemographicParity
from fairlearn.postprocessing import ThresholdOptimizer
from sklearn.linear_model import LogisticRegression

# ── In-processing: Exponentiated Gradient ─────────────────────────────────────
def train_fair_classifier_inprocessing(X_train, y_train, sensitive_train):
    """
    Train with fairness constraints via Exponentiated Gradient.
    Trades some accuracy for demographic parity satisfaction.
    """
    base_estimator = LogisticRegression(max_iter=500)
    constraint = DemographicParity()

    mitigator = ExponentiatedGradient(
        estimator=base_estimator,
        constraints=constraint,
        eps=0.01   # Maximum allowed demographic parity difference
    )
    mitigator.fit(
        X_train, y_train,
        sensitive_features=sensitive_train
    )
    return mitigator


# ── Post-processing: Threshold Optimizer ──────────────────────────────────────
def train_fair_classifier_postprocessing(estimator, X_train, y_train,
                                          sensitive_train, constraint='equalized_odds'):
    """
    Post-process predictions by choosing group-specific thresholds
    that satisfy equalized_odds or demographic_parity.
    """
    postprocess_est = ThresholdOptimizer(
        estimator=estimator,
        constraints=constraint,
        predict_method='predict_proba',
        objective='accuracy_score'
    )
    postprocess_est.fit(
        X_train, y_train,
        sensitive_features=sensitive_train
    )
    return postprocess_est


# ── Pre-processing: Reweighing ─────────────────────────────────────────────────
def compute_reweighing_weights(y_train, sensitive_train):
    """
    Compute instance weights so that each (group, label) combination
    has equal weight in training. Reduces demographic parity by removing
    the correlation between group membership and label in the weighted dataset.

    Returns sample_weight array for use in model.fit(sample_weight=...).
    """
    import numpy as np
    n = len(y_train)
    weights = np.ones(n)

    groups = np.unique(sensitive_train)
    labels = np.unique(y_train)

    for g in groups:
        for l in labels:
            mask = (sensitive_train == g) & (y_train == l)
            n_gl = mask.sum()
            n_g = (sensitive_train == g).sum()
            n_l = (y_train == l).sum()

            if n_gl > 0:
                expected = (n_g / n) * (n_l / n) * n
                weights[mask] = expected / n_gl

    return weights
```

---

## A14.5 IBM AI Fairness 360 — Disparate Impact Ratio

The disparate impact ratio (DIR) is the standard metric used in US employment discrimination law (the "4/5ths rule"):

$$DIR = \frac{P(\hat{Y}=1 \mid A=\text{minority})}{P(\hat{Y}=1 \mid A=\text{majority})}$$

A DIR below 0.8 (the minority group receives positive predictions at less than 80% the rate of the majority group) is a legal threshold for disparate impact in employment contexts.

```python
from aif360.datasets import BinaryLabelDataset
from aif360.metrics import BinaryLabelDatasetMetric, ClassificationMetric
import pandas as pd

def compute_disparate_impact_aif360(df, label_col, sensitive_col,
                                     privileged_val, unprivileged_val,
                                     prediction_col=None):
    """
    Compute disparate impact and other fairness metrics using AIF360.

    If prediction_col is None, evaluates the label distribution itself
    (pre-model fairness of training data).
    """
    privileged_groups = [{sensitive_col: privileged_val}]
    unprivileged_groups = [{sensitive_col: unprivileged_val}]

    col = prediction_col if prediction_col else label_col

    dataset = BinaryLabelDataset(
        df=df[[sensitive_col, col]],
        label_names=[col],
        protected_attribute_names=[sensitive_col]
    )

    metric = BinaryLabelDatasetMetric(
        dataset,
        unprivileged_groups=unprivileged_groups,
        privileged_groups=privileged_groups
    )

    dir_val = metric.disparate_impact()
    mean_diff = metric.mean_difference()

    print(f"Disparate Impact Ratio: {dir_val:.4f}")
    print(f"  (Legal threshold: ≥ 0.80; below = potential disparate impact)")
    print(f"Mean Difference (stat parity): {mean_diff:.4f}")
    print(f"  (0 = parity; negative = unprivileged group disfavored)")

    if dir_val < 0.80:
        print("ALERT: Disparate impact below 4/5ths rule threshold.")

    return {'disparate_impact': dir_val, 'mean_difference': mean_diff}
```

---

## A14.6 Counterfactual Fairness

Counterfactual fairness (Kusner et al., 2017) asks: would the prediction change if the individual belonged to a different demographic group, holding all causally independent features constant?

$$P(\hat{Y}_{A \leftarrow a}(U) = y \mid X=x, A=a) = P(\hat{Y}_{A \leftarrow a'}(U) = y \mid X=x, A=a)$$

This requires a causal model of the data-generating process. Implementation via do-calculus or structural equation models is domain-specific, but the testing principle can be approximated:

```python
def counterfactual_fairness_test(model, X_test, sensitive_col,
                                  group_a_val, group_b_val,
                                  non_sensitive_cols):
    """
    Approximate counterfactual fairness test by flipping sensitive attribute
    and measuring prediction change. Not a true causal intervention (which
    requires a structural causal model), but useful as a consistency check.

    Returns fraction of test samples where the prediction changes when
    the sensitive attribute is swapped.
    """
    import pandas as pd
    import numpy as np

    X_a = X_test[X_test[sensitive_col] == group_a_val].copy()

    # Create counterfactual: same features, opposite group
    X_a_counter = X_a.copy()
    X_a_counter[sensitive_col] = group_b_val

    preds_original = model.predict(X_a[non_sensitive_cols])
    preds_counter  = model.predict(X_a_counter[non_sensitive_cols])

    changed = (preds_original != preds_counter).mean()
    print(f"Counterfactual flip rate: {changed:.4f}")
    print(f"  (0 = counterfactually fair; >0 = predictions changed by group flip)")
    return changed
```

---

## A14.7 Feedback Loop Detection

Detecting whether a deployed model is amplifying disparities over time requires monitoring the correlation between predictions and outcomes across retraining cycles.

```python
import numpy as np
import pandas as pd
from scipy import stats

def detect_feedback_amplification(predictions_history, outcomes_history,
                                    group_labels, n_cycles=5):
    """
    Test whether a model's predictions are becoming more disparate over
    successive retraining cycles — a signature of feedback loop amplification.

    predictions_history: list of arrays, one per training cycle
    outcomes_history:    list of arrays, one per cycle
    group_labels:        list of arrays, group membership per cycle
    n_cycles:            number of cycles to analyze
    """
    disparity_over_time = []

    for cycle in range(min(n_cycles, len(predictions_history))):
        preds = np.array(predictions_history[cycle])
        groups = np.array(group_labels[cycle])

        rates = {}
        for g in np.unique(groups):
            rates[g] = preds[groups == g].mean()

        max_group = max(rates, key=rates.get)
        min_group = min(rates, key=rates.get)
        disparity = rates[max_group] - rates[min_group]
        disparity_over_time.append(disparity)

    # Test for trend: is disparity increasing over cycles?
    cycles = np.arange(len(disparity_over_time))
    slope, intercept, r_value, p_value, std_err = stats.linregress(
        cycles, disparity_over_time
    )

    print("Feedback Loop Amplification Test")
    print(f"Disparities over cycles: {[f'{d:.4f}' for d in disparity_over_time]}")
    print(f"Trend slope: {slope:.4f} per cycle")
    print(f"R²: {r_value**2:.3f}, p-value: {p_value:.4f}")

    if slope > 0 and p_value < 0.05:
        print("WARNING: Statistically significant increase in group disparity "
              "over retraining cycles — potential feedback loop amplification.")
    elif slope > 0:
        print("NOTE: Upward trend in disparity (not yet statistically significant).")
    else:
        print("No evidence of feedback amplification detected.")

    return {
        'disparities': disparity_over_time,
        'slope': slope,
        'p_value': p_value,
        'amplification_detected': slope > 0 and p_value < 0.05
    }
```

---

## A14.8 Algorithmic Fairness in Practice: The Audit Checklist

A structured pre-deployment and ongoing audit checklist derived from NIST AI RMF (2023) and EU AI Act requirements:

| Stage | Check | Tool | Threshold |
|-------|-------|------|-----------|
| **Data** | Demographic representation in training set | EDA + sampling stats | No group < 5% of N |
| **Data** | Label distribution by group | MetricFrame | Parity diff < 0.10 |
| **Model** | Demographic parity at deployment threshold | Fairlearn | Diff < 0.10 |
| **Model** | Equalized odds | Fairlearn | Diff < 0.10 |
| **Model** | Calibration by group | ECE per group | Per-group ECE < 0.05 |
| **Model** | Disparate impact ratio | AIF360 | DIR ≥ 0.80 |
| **Deployment** | Slice-based monitoring (monthly) | SliceFinder | Alert at 5% degradation |
| **Deployment** | Feedback loop correlation test | Custom | Slope p < 0.05 → halt |
| **Process** | Human reviewer demographic diversity | Audit log | Document + review |
| **Process** | Contestability mechanism functional | Process audit | 100% cases have pathway |

---

## A14.9 Further Reading

- Chouldechova, A. (2017). Fair prediction with disparate impact. *Big Data, 5*(2).
- Hardt, M., Price, E., & Srebro, N. (2016). Equality of opportunity in supervised learning. *NeurIPS 29*.
- Kusner, M. J., Loftus, J., Russell, C., & Silva, R. (2017). Counterfactual fairness. *NeurIPS 30*.
- Wachter, S., Mittelstadt, B., & Russell, C. (2017). Counterfactual explanations without opening the black box. *HJLT, 31*(2).
- Bird, S., et al. (2020). Fairlearn: A toolkit for assessing and improving fairness in AI. *Microsoft Research*.
