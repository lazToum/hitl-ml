# Chapter 15 Technical Exercise Solutions

*Worked solutions for the technical appendix exercises*

---

## Exercise 15.1: Slice-Based Evaluation Implementation

**Problem Statement:** You are given a loan approval dataset with the following features: credit score, income, debt-to-income ratio, ZIP code, account age, and a binary approval outcome. A model trained on this data has 96.1% aggregate accuracy. Implement slice-based evaluation to determine whether the model has systematic disparities across geographic and account-age slices.

---

### Solution

```python
import pandas as pd
import numpy as np
from sklearn.metrics import accuracy_score, precision_score, recall_score
from sklearn.linear_model import LogisticRegression

def load_and_prepare_data():
    """
    Load loan application dataset.
    Assumes df has columns: credit_score, income, dti,
    zip_code, account_age_months, approval (0/1), predicted (0/1)
    """
    df = pd.read_csv('loan_applications.csv')
    
    # Create slice features
    df['income_bracket'] = pd.cut(
        df['income'], 
        bins=[0, 40000, 80000, 150000, np.inf],
        labels=['low', 'medium', 'high', 'very_high']
    )
    df['account_tenure'] = pd.cut(
        df['account_age_months'],
        bins=[0, 12, 36, 84, np.inf],
        labels=['new', 'recent', 'established', 'long-term']
    )
    
    return df


def compute_slice_metrics(df, slice_col, target_col='approval', 
                          pred_col='predicted', min_slice_size=50):
    """
    For each value of slice_col, compute accuracy, precision,
    recall, and gap from aggregate baseline.
    """
    baseline_acc = accuracy_score(df[target_col], df[pred_col])
    
    results = []
    for val in df[slice_col].unique():
        slice_df = df[df[slice_col] == val]
        
        if len(slice_df) < min_slice_size:
            continue
        
        acc = accuracy_score(slice_df[target_col], slice_df[pred_col])
        prec = precision_score(slice_df[target_col], slice_df[pred_col],
                               zero_division=0)
        rec = recall_score(slice_df[target_col], slice_df[pred_col],
                           zero_division=0)
        
        # False positive rate (over-denial rate for legitimate applicants)
        tn = ((slice_df[target_col] == 0) & (slice_df[pred_col] == 0)).sum()
        fp = ((slice_df[target_col] == 1) & (slice_df[pred_col] == 0)).sum()
        fn = ((slice_df[target_col] == 0) & (slice_df[pred_col] == 1)).sum()
        tp = ((slice_df[target_col] == 1) & (slice_df[pred_col] == 1)).sum()
        
        # For lending: false denial rate (FN as fraction of positives)
        fdr = fn / (fn + tp) if (fn + tp) > 0 else np.nan
        
        results.append({
            'slice_col': slice_col,
            'slice_val': str(val),
            'n': len(slice_df),
            'accuracy': acc,
            'precision': prec,
            'recall': rec,
            'false_denial_rate': fdr,
            'acc_gap': acc - baseline_acc
        })
    
    return pd.DataFrame(results).sort_values('acc_gap')


def run_full_analysis(df):
    """
    Run slice analysis across all relevant dimensions.
    Flag slices with significant gaps.
    """
    slice_cols = ['income_bracket', 'account_tenure', 'zip_prefix']
    
    if 'zip_code' in df.columns:
        df['zip_prefix'] = df['zip_code'].astype(str).str[:3]
    
    all_results = []
    for col in slice_cols:
        if col in df.columns:
            result = compute_slice_metrics(df, col)
            all_results.append(result)
    
    combined = pd.concat(all_results, ignore_index=True)
    
    # Flag slices with accuracy gap > 3 percentage points
    combined['flag'] = combined['acc_gap'] < -0.03
    
    flagged = combined[combined['flag']].sort_values('acc_gap')
    
    print("=== SLICE EVALUATION RESULTS ===")
    print(f"Baseline accuracy: {accuracy_score(df['approval'], df['predicted']):.4f}")
    print(f"\nFlagged slices (accuracy gap > 3%):")
    print(flagged[['slice_col', 'slice_val', 'n', 'accuracy', 
                    'false_denial_rate', 'acc_gap']].to_string())
    
    return combined

# Expected output (on sample dataset):
# Baseline accuracy: 0.9610
# Flagged slices:
#   zip_prefix  '943'  n=423  accuracy=0.891  fdr=0.204  gap=-0.070
#   zip_prefix  '948'  n=387  accuracy=0.899  fdr=0.189  gap=-0.062
#   account_tenure 'new'  n=1204  accuracy=0.931  fdr=0.098  gap=-0.030
```

**Interpretation of Results:**

If the analysis produces output showing ZIP code prefixes with false denial rates 3–4x higher than the baseline, this strongly suggests model failure (at minimum) and possible annotation failure. The next step is:

1. Check whether these ZIP codes are demographically distinct from the baseline
2. Examine which features are most predictive for these slices
3. Compare the model's confidence scores on these slices vs. baseline

**Key Insight:** The aggregate accuracy of 96.1% masks ZIP-code-level accuracy as low as 89.1% — a 7-percentage-point gap that translates to systematically higher denial rates for applicants from those areas.

---

## Exercise 15.2: Calibration Analysis

**Problem Statement:** A medical AI classifier produces confidence scores for each prediction. Implement calibration analysis to determine whether the model's confidence scores are reliable enough to use as thresholds for human review routing.

---

### Solution

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.calibration import calibration_curve

def plot_reliability_diagram(y_true, y_prob, n_bins=10, model_name="Model"):
    """
    Plot reliability diagram (calibration curve).
    A well-calibrated model produces points near the diagonal.
    """
    fraction_of_positives, mean_predicted_value = calibration_curve(
        y_true, y_prob, n_bins=n_bins
    )
    
    fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(8, 8))
    
    # Reliability diagram
    ax1.plot([0, 1], [0, 1], 'k--', label='Perfect calibration')
    ax1.plot(mean_predicted_value, fraction_of_positives, 
             's-', label=model_name)
    ax1.set_xlabel('Mean Predicted Value (Confidence)')
    ax1.set_ylabel('Fraction of Positives (Actual Accuracy)')
    ax1.set_title('Reliability Diagram')
    ax1.legend()
    
    # Confidence histogram
    ax2.hist(y_prob, bins=n_bins, density=True)
    ax2.set_xlabel('Predicted Probability')
    ax2.set_ylabel('Density')
    ax2.set_title('Confidence Distribution')
    
    plt.tight_layout()
    return fig


def compute_ece(y_true, y_prob, n_bins=10):
    """
    Compute Expected Calibration Error.
    Lower is better; < 0.05 is generally acceptable for HITL routing.
    """
    bins = np.linspace(0, 1, n_bins + 1)
    ece = 0.0
    
    for i in range(n_bins):
        bin_mask = (y_prob >= bins[i]) & (y_prob < bins[i + 1])
        if bin_mask.sum() == 0:
            continue
        
        bin_accuracy = y_true[bin_mask].mean()
        bin_confidence = y_prob[bin_mask].mean()
        bin_size = bin_mask.sum() / len(y_true)
        
        ece += bin_size * abs(bin_accuracy - bin_confidence)
    
    return ece


def calibration_analysis_report(y_true, y_prob):
    """
    Full calibration analysis with interpretation for HITL routing.
    """
    ece = compute_ece(y_true, y_prob)
    
    # Overconfidence analysis: 
    # What fraction of predictions at >90% confidence are actually correct?
    high_conf_mask = y_prob > 0.9
    if high_conf_mask.sum() > 0:
        high_conf_accuracy = y_true[high_conf_mask].mean()
    else:
        high_conf_accuracy = None
    
    # Find the confidence threshold where accuracy = 95%
    # (appropriate for auto-decision without human review)
    thresholds = np.arange(0.5, 1.0, 0.01)
    threshold_accuracies = []
    for t in thresholds:
        mask = y_prob >= t
        if mask.sum() >= 30:  # Need minimum sample size
            threshold_accuracies.append((t, y_true[mask].mean(), mask.sum()))
    
    # Find threshold where accuracy >= 0.95
    safe_threshold = None
    for t, acc, n in threshold_accuracies:
        if acc >= 0.95:
            safe_threshold = t
            break
    
    print(f"Expected Calibration Error (ECE): {ece:.4f}")
    print(f"  (< 0.05 is good; > 0.10 suggests calibration recalibration needed)")
    
    if high_conf_accuracy is not None:
        print(f"\nAccuracy at > 90% confidence: {high_conf_accuracy:.4f}")
        print(f"  (Should be > 0.90 for this to be a reliable threshold)")
    
    if safe_threshold is not None:
        print(f"\nThreshold for 95% auto-decision accuracy: {safe_threshold:.2f}")
        auto_fraction = (y_prob >= safe_threshold).mean()
        print(f"  Fraction of cases auto-decided at this threshold: {auto_fraction:.4f}")
        print(f"  Fraction requiring human review: {1 - auto_fraction:.4f}")
    else:
        print("\nNo threshold achieves 95% accuracy — all cases should route to human review")
    
    print("\nHITL Routing Recommendation:")
    if ece < 0.05 and safe_threshold is not None:
        print(f"  - Auto-decide cases with confidence >= {safe_threshold:.2f}")
        print(f"  - Route remaining {(1-auto_fraction)*100:.1f}% to human review")
    elif ece >= 0.05:
        print("  - Model requires temperature scaling or Platt calibration before")
        print("    confidence scores are reliable enough for routing decisions")
```

**Key finding:** An ECE above 0.10 means the model's stated confidence cannot be trusted for routing decisions. In this case, recalibration (temperature scaling or isotonic regression) is required before the model's confidence scores can serve as a reliable threshold for human review.

---

## Exercise 15.3: Annotator Agreement Analysis

**Problem Statement:** You have annotation data from six annotators who each labeled a set of 500 content moderation examples. Implement inter-annotator agreement analysis and annotator drift detection.

---

### Solution

```python
from sklearn.metrics import cohen_kappa_score
import pandas as pd
import numpy as np
from itertools import combinations

def pairwise_kappa_matrix(annotations_df, annotator_col='annotator_id',
                          item_col='item_id', label_col='label'):
    """
    Compute Cohen's kappa for all pairs of annotators.
    Items must be labeled by at least two annotators.
    """
    annotators = annotations_df[annotator_col].unique()
    n = len(annotators)
    kappa_matrix = np.zeros((n, n))
    
    for i, ann_a in enumerate(annotators):
        for j, ann_b in enumerate(annotators):
            if i >= j:
                continue
            
            # Get items labeled by both annotators
            labels_a = annotations_df[
                annotations_df[annotator_col] == ann_a
            ].set_index(item_col)[label_col]
            
            labels_b = annotations_df[
                annotations_df[annotator_col] == ann_b
            ].set_index(item_col)[label_col]
            
            common_items = labels_a.index.intersection(labels_b.index)
            
            if len(common_items) < 20:
                kappa = np.nan
            else:
                kappa = cohen_kappa_score(
                    labels_a.loc[common_items],
                    labels_b.loc[common_items]
                )
            
            kappa_matrix[i, j] = kappa
            kappa_matrix[j, i] = kappa
    
    return pd.DataFrame(
        kappa_matrix, 
        index=annotators, 
        columns=annotators
    )


def detect_annotation_drift(annotations_df, annotator_col='annotator_id',
                             item_col='item_id', label_col='label',
                             consensus_col='consensus_label',
                             window_size=100):
    """
    Detect whether individual annotators' agreement with consensus
    drifts over time.
    """
    results = {}
    
    for annotator in annotations_df[annotator_col].unique():
        ann_df = annotations_df[
            annotations_df[annotator_col] == annotator
        ].sort_values('annotation_timestamp').reset_index(drop=True)
        
        if len(ann_df) < window_size * 2:
            continue
        
        windows = []
        for start in range(0, len(ann_df) - window_size, window_size // 2):
            window = ann_df.iloc[start:start + window_size]
            
            if consensus_col in window.columns:
                kappa = cohen_kappa_score(
                    window[label_col],
                    window[consensus_col]
                )
            else:
                # If no consensus, use simple agreement rate
                kappa = None
            
            windows.append({
                'window_start': window['annotation_timestamp'].iloc[0],
                'window_end': window['annotation_timestamp'].iloc[-1],
                'kappa': kappa,
                'n': len(window),
                'positive_rate': window[label_col].mean()
            })
        
        df_windows = pd.DataFrame(windows)
        
        # Flag if kappa in last window is < 0.8 * first window kappa
        if len(df_windows) >= 2 and df_windows['kappa'].notna().any():
            first_kappa = df_windows['kappa'].dropna().iloc[0]
            last_kappa = df_windows['kappa'].dropna().iloc[-1]
            drift_flag = last_kappa < 0.8 * first_kappa
        else:
            drift_flag = False
        
        results[annotator] = {
            'windows': df_windows,
            'drift_detected': drift_flag,
            'first_kappa': df_windows['kappa'].dropna().iloc[0] 
                           if len(df_windows) > 0 else None,
            'last_kappa': df_windows['kappa'].dropna().iloc[-1] 
                          if len(df_windows) > 0 else None
        }
    
    return results


def annotation_quality_report(kappa_matrix, drift_results):
    """
    Summarize annotation quality findings.
    """
    print("=== ANNOTATION QUALITY REPORT ===\n")
    
    # Pairwise kappa summary
    upper_triangle = kappa_matrix.where(
        np.triu(np.ones(kappa_matrix.shape), k=1).astype(bool)
    )
    valid_kappas = upper_triangle.stack().dropna()
    
    print(f"Pairwise Kappa Summary (n={len(valid_kappas)} pairs):")
    print(f"  Mean kappa: {valid_kappas.mean():.3f}")
    print(f"  Min kappa:  {valid_kappas.min():.3f}")
    print(f"  Max kappa:  {valid_kappas.max():.3f}")
    
    # Interpretation
    mean_kappa = valid_kappas.mean()
    if mean_kappa >= 0.80:
        interp = "GOOD — annotation process is reliable"
    elif mean_kappa >= 0.60:
        interp = "ACCEPTABLE — annotation guidelines may need clarification"
    elif mean_kappa >= 0.40:
        interp = "MARGINAL — significant revision of guidelines and annotator training needed"
    else:
        interp = "POOR — annotation process requires fundamental redesign"
    print(f"  Interpretation: {interp}\n")
    
    # Drift summary
    drifted = [ann for ann, r in drift_results.items() if r['drift_detected']]
    if drifted:
        print(f"Annotator Drift Detected in {len(drifted)} annotators:")
        for ann in drifted:
            r = drift_results[ann]
            print(f"  Annotator {ann}: kappa {r['first_kappa']:.3f} → {r['last_kappa']:.3f}")
    else:
        print("No annotator drift detected.")
```

**Expected Interpretation:**

A pairwise kappa below 0.60 on political content categories, compared to kappa above 0.80 on other content categories, would directly confirm the annotation failure hypothesis from the political speech artifact case. The drift detection would reveal whether the low agreement is consistent (a guidelines problem) or increasing over time (a fatigue/context-contamination problem).

---

## Exercise 15.4: Influence Function Application

**Problem Statement:** Given a logistic regression model trained on loan application data and a set of denied applications from a specific ZIP code prefix, use influence functions to identify which training examples most influenced the high-risk scores for this subpopulation.

---

### Solution

```python
import numpy as np
from sklearn.linear_model import LogisticRegression

def logistic_influence_function(model, X_train, y_train, X_query):
    """
    Compute influence of each training point on a query prediction.
    
    This is the closed-form influence function for logistic regression.
    For neural networks, see TracIn (Pruthi et al., 2020) or
    the approximation methods in Koh & Liang (2017).
    """
    # Predicted probabilities on training set
    p_train = model.predict_proba(X_train)[:, 1]
    
    # Weights for Fisher information
    w_train = p_train * (1 - p_train)
    
    # Fisher information matrix (Hessian of log-likelihood)
    # H = X^T W X / n where W = diag(p(1-p))
    H = (X_train.T * w_train) @ X_train / len(X_train)
    H_inv = np.linalg.inv(H + 1e-6 * np.eye(H.shape[0]))  # Regularize
    
    # Gradient of loss at query point
    p_query = model.predict_proba(X_query.reshape(1, -1))[0, 1]
    # For a positive prediction at query, gradient wrt prediction:
    grad_query = p_query * X_query  # Simplified
    
    # H^{-1} grad_query
    H_inv_grad = H_inv @ grad_query
    
    # Influence of each training point
    grad_train = (y_train - p_train)[:, np.newaxis] * X_train
    influences = grad_train @ H_inv_grad / len(X_train)
    
    return influences


def find_most_influential_training_examples(
    model, X_train, y_train, 
    X_problematic, 
    top_k=20
):
    """
    For a set of problematic predictions,
    aggregate influence scores to find most responsible training examples.
    """
    aggregate_influence = np.zeros(len(X_train))
    
    for x in X_problematic:
        inf = logistic_influence_function(model, X_train, y_train, x)
        aggregate_influence += np.abs(inf)
    
    top_indices = np.argsort(aggregate_influence)[-top_k:][::-1]
    
    return {
        'top_indices': top_indices,
        'top_influences': aggregate_influence[top_indices],
        'top_labels': y_train[top_indices],
        'top_features': X_train[top_indices],
        'label_distribution': {
            'positive_rate': y_train[top_indices].mean(),
            'baseline_positive_rate': y_train.mean()
        }
    }


# Interpretation workflow:
# 1. Run find_most_influential_training_examples on denied applications 
#    from problematic ZIP prefixes
# 2. Examine the top-20 most influential training examples
# 3. If their label distribution differs significantly from baseline
#    (e.g., much lower approval rate), this confirms the training data
#    is skewed for this subpopulation
# 4. If the feature values of influential examples include ZIP-code proxies
#    (e.g., median neighborhood income), this traces the specific mechanism

# Expected output pattern:
# Top influential training examples:
#   - label distribution: 12% positive (vs. 58% baseline)
#   - geographic distribution: 87% from same ZIP prefix groups
#   - account tenure: 78% 'new' or 'recent'
# 
# Interpretation: The model's high-risk scores for this subpopulation
# are driven primarily by training examples from the same subpopulation
# that were historically denied at very high rates — confirming
# that historical discrimination is the root cause of the model failure.
```

---

## Exercise 15.5: Complete HITL Diagnostic Pipeline

**Problem Statement:** Integrate all previous tools into a complete diagnostic pipeline that runs automatically and generates a report.

```python
class HITLDiagnosticPipeline:
    """
    Complete diagnostic pipeline for HITL failure analysis.
    """
    
    def __init__(self, model, X_train, y_train, X_test, y_test,
                 y_pred, y_prob, slice_cols, 
                 annotations_df=None):
        self.model = model
        self.X_train = X_train
        self.y_train = y_train
        self.X_test = X_test
        self.y_test = y_test
        self.y_pred = y_pred
        self.y_prob = y_prob
        self.slice_cols = slice_cols
        self.annotations_df = annotations_df
        self.findings = []
    
    def run_calibration_check(self):
        ece = compute_ece(self.y_test, self.y_prob)
        finding = {
            'check': 'calibration',
            'ece': ece,
            'pass': ece < 0.05,
            'severity': 'high' if ece > 0.10 else 'medium' if ece > 0.05 else 'low',
            'recommendation': (
                'Recalibrate model before using confidence for HITL routing'
                if ece > 0.05 else 'Calibration acceptable'
            )
        }
        self.findings.append(finding)
        return finding
    
    def run_slice_analysis(self, gap_threshold=0.03):
        test_df = pd.DataFrame(self.X_test)
        test_df['y_true'] = self.y_test
        test_df['y_pred'] = self.y_pred
        
        flagged_slices = []
        for col in self.slice_cols:
            if col in test_df.columns:
                results = compute_slice_metrics(test_df, col)
                flagged = results[results['acc_gap'] < -gap_threshold]
                flagged_slices.extend(flagged.to_dict('records'))
        
        finding = {
            'check': 'slice_analysis',
            'n_flagged_slices': len(flagged_slices),
            'flagged_slices': flagged_slices,
            'pass': len(flagged_slices) == 0,
            'severity': 'high' if len(flagged_slices) > 2 else 
                        'medium' if len(flagged_slices) > 0 else 'low',
            'recommendation': (
                f'Investigate {len(flagged_slices)} slices with performance gaps > {gap_threshold*100:.0f}%'
                if flagged_slices else 'No significant performance disparities detected'
            )
        }
        self.findings.append(finding)
        return finding
    
    def run_annotation_check(self):
        if self.annotations_df is None:
            return None
        
        kappa_matrix = pairwise_kappa_matrix(self.annotations_df)
        upper = kappa_matrix.where(
            np.triu(np.ones(kappa_matrix.shape), k=1).astype(bool)
        )
        mean_kappa = upper.stack().dropna().mean()
        
        finding = {
            'check': 'annotation_agreement',
            'mean_kappa': mean_kappa,
            'pass': mean_kappa >= 0.60,
            'severity': 'high' if mean_kappa < 0.40 else 
                        'medium' if mean_kappa < 0.60 else 'low',
            'recommendation': (
                'Annotation process requires fundamental redesign'
                if mean_kappa < 0.40 else
                'Annotation guidelines need clarification'
                if mean_kappa < 0.60 else
                'Annotation quality acceptable'
            )
        }
        self.findings.append(finding)
        return finding
    
    def generate_report(self):
        print("=" * 60)
        print("HITL DIAGNOSTIC REPORT")
        print("=" * 60)
        
        high_severity = [f for f in self.findings if f['severity'] == 'high']
        medium_severity = [f for f in self.findings if f['severity'] == 'medium']
        
        if high_severity:
            print(f"\n🔴 HIGH SEVERITY FINDINGS ({len(high_severity)}):")
            for f in high_severity:
                print(f"  - {f['check'].upper()}: {f['recommendation']}")
        
        if medium_severity:
            print(f"\n🟡 MEDIUM SEVERITY FINDINGS ({len(medium_severity)}):")
            for f in medium_severity:
                print(f"  - {f['check'].upper()}: {f['recommendation']}")
        
        passed = [f for f in self.findings if f['pass']]
        print(f"\n✅ PASSED CHECKS ({len(passed)}):")
        for f in passed:
            print(f"  - {f['check'].upper()}")
        
        print("\nRECOMMENDED NEXT STEPS:")
        for i, f in enumerate(sorted(self.findings, 
                                     key=lambda x: {'high': 0, 'medium': 1, 'low': 2}[x['severity']]), 1):
            print(f"  {i}. {f['recommendation']}")
```

This pipeline encapsulates the full diagnostic workflow from Chapter 15. It should be run:
1. At initial model deployment
2. After any model update or retraining
3. Monthly as a routine monitoring check
4. Immediately upon receipt of any external complaint about systematic failures
