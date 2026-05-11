# Chapter 14 Tech Exercise Solutions: Fairness Metrics and Bias Auditing

*Walkthroughs for all Python and algorithm exercises in Chapter 14 and its Technical Appendix*

---

## Exercise A14-1: Computing Fairness Metrics from Scratch

**Problem:** Given a dataset of loan decisions with demographic group labels, compute demographic parity difference, equalized odds difference, and calibration error for each group. Do not use any fairness library; implement from scratch.

**Complete Solution:**

```python
import numpy as np
import pandas as pd
from sklearn.metrics import accuracy_score

# ─── Step 1: Generate Synthetic Loan Decision Data ────────────────────────────
np.random.seed(2024)
n = 3000

# True loan repayment outcomes: group 0 has 30% default rate, group 1 has 45%
# (different base rates — key condition for impossibility theorem)
groups = np.random.randint(0, 2, n)
base_rates = np.where(groups == 0, 0.70, 0.55)   # repayment probability
y_true = np.random.binomial(1, base_rates)         # 1 = repaid, 0 = default

# Simulated classifier: probabilistic predictions correlated with true outcome
# but imperfect and slightly biased against group 1
noise = np.random.normal(0, 0.2, n)
raw_scores = base_rates + noise + np.where(groups == 1, -0.05, 0)  # bias term
raw_scores = np.clip(raw_scores, 0, 1)

threshold = 0.50
y_pred = (raw_scores >= threshold).astype(int)  # 1 = approved, 0 = denied

# ─── Step 2: Build the Core Metrics Function ─────────────────────────────────
def fairness_metrics_from_scratch(y_true, y_pred, y_scores, groups):
    """
    Compute a comprehensive set of fairness metrics without using
    any external fairness library.
    
    Returns dict with per-group and disparity metrics.
    """
    results = {}
    
    for g in [0, 1]:
        mask = groups == g
        yt = y_true[mask]
        yp = y_pred[mask]
        ys = y_scores[mask]
        
        # Confusion matrix components
        tp = np.sum((yp == 1) & (yt == 1))
        tn = np.sum((yp == 0) & (yt == 0))
        fp = np.sum((yp == 1) & (yt == 0))
        fn = np.sum((yp == 0) & (yt == 1))
        
        n_g = len(yt)
        
        # Core rates
        tpr = tp / (tp + fn) if (tp + fn) > 0 else np.nan   # sensitivity
        fpr = fp / (fp + tn) if (fp + tn) > 0 else np.nan   # fall-out
        tnr = tn / (tn + fp) if (tn + fp) > 0 else np.nan   # specificity
        fnr = fn / (tp + fn) if (tp + fn) > 0 else np.nan   # miss rate
        ppv = tp / (tp + fp) if (tp + fp) > 0 else np.nan   # precision
        
        selection_rate = (tp + fp) / n_g   # demographic parity metric
        base_rate = (tp + fn) / n_g
        
        # Calibration: Expected Calibration Error by group
        # Bin scores into deciles
        bins = np.linspace(0, 1, 11)
        ece = 0.0
        for i in range(len(bins) - 1):
            bin_mask = (ys >= bins[i]) & (ys < bins[i+1])
            if bin_mask.sum() > 0:
                bin_conf = ys[bin_mask].mean()
                bin_acc = yt[bin_mask].mean()
                ece += (bin_mask.sum() / n_g) * abs(bin_acc - bin_conf)
        
        results[g] = {
            'n': n_g,
            'base_rate': base_rate,
            'selection_rate': selection_rate,
            'TPR': tpr, 'FPR': fpr,
            'TNR': tnr, 'FNR': fnr,
            'PPV': ppv,
            'accuracy': accuracy_score(yt, yp),
            'ECE': ece,
        }
    
    # ─── Disparity metrics ────────────────────────────────────────────────────
    dp_diff = abs(results[0]['selection_rate'] - results[1]['selection_rate'])
    tpr_diff = abs(results[0]['TPR'] - results[1]['TPR'])
    fpr_diff = abs(results[0]['FPR'] - results[1]['FPR'])
    eo_diff = max(tpr_diff, fpr_diff)   # equalized odds = max of both gaps
    ppv_diff = abs(results[0]['PPV'] - results[1]['PPV'])
    
    dir_ratio = (results[1]['selection_rate'] / results[0]['selection_rate']
                 if results[0]['selection_rate'] > 0 else np.nan)
    
    disparities = {
        'demographic_parity_diff': dp_diff,
        'equalized_odds_diff': eo_diff,
        'TPR_diff': tpr_diff,
        'FPR_diff': fpr_diff,
        'PPV_diff': ppv_diff,
        'disparate_impact_ratio': dir_ratio,
    }
    
    return results, disparities


# ─── Step 3: Run and Interpret ────────────────────────────────────────────────
per_group, disparities = fairness_metrics_from_scratch(
    y_true, y_pred, raw_scores, groups
)

print("=" * 60)
print("PER-GROUP METRICS")
print("=" * 60)
for g in [0, 1]:
    m = per_group[g]
    print(f"\nGroup {g} (n={m['n']}):")
    print(f"  Base rate:      {m['base_rate']:.4f}")
    print(f"  Selection rate: {m['selection_rate']:.4f}")
    print(f"  TPR:            {m['TPR']:.4f}")
    print(f"  FPR:            {m['FPR']:.4f}")
    print(f"  PPV:            {m['PPV']:.4f}")
    print(f"  Accuracy:       {m['accuracy']:.4f}")
    print(f"  ECE:            {m['ECE']:.4f}")

print("\n" + "=" * 60)
print("DISPARITY METRICS")
print("=" * 60)
for k, v in disparities.items():
    flag = " ← EXCEEDS THRESHOLD" if (
        'diff' in k and v > 0.10
    ) or (
        k == 'disparate_impact_ratio' and v < 0.80
    ) else ""
    print(f"  {k:<35} {v:.4f}{flag}")
```

**Expected Output Discussion:**

With different base rates (group 0: 70% repayment; group 1: 55% repayment), we expect:
- The model to have similar PPV for both groups (calibration tends to hold)
- Different FPR for the groups (impossible theorem: calibration + different base rates → different FPR)
- Demographic parity difference likely > 0.10 (the model approves group 0 at a higher rate)

This is the impossibility theorem made concrete. Even with a model that tries to be accurate, the different base rates force a choice between calibration and equal error rates.

---

## Exercise A14-2: Implementing Reweighing Pre-Processing

**Problem:** Implement the reweighing mitigation from scratch and verify it reduces demographic parity without using Fairlearn.

```python
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

def reweighing_mitigation_demo(X, y, groups, test_size=0.3):
    """
    Demonstrate how reweighing affects model fairness.
    
    Reweighing assigns higher weights to under-represented
    (group, label) combinations so the weighted training distribution
    is balanced — removing the statistical association between group
    membership and label in the weighted data.
    """
    X_train, X_test, y_train, y_test, g_train, g_test = train_test_split(
        X, y, groups, test_size=test_size, random_state=42
    )
    
    scaler = StandardScaler()
    X_train_s = scaler.fit_transform(X_train)
    X_test_s  = scaler.transform(X_test)
    
    n = len(y_train)
    
    # ── Compute reweighing weights ─────────────────────────────────────────
    def compute_weights(y, g):
        weights = np.ones(len(y))
        for gval in np.unique(g):
            for yval in np.unique(y):
                mask = (g == gval) & (y == yval)
                n_gl = mask.sum()
                n_g  = (g == gval).sum()
                n_l  = (y == yval).sum()
                
                if n_gl > 0:
                    # Expected count if g and y were independent
                    expected = (n_g / n) * (n_l / n) * n
                    weights[mask] = expected / n_gl
        return weights
    
    weights = compute_weights(y_train, g_train)
    
    # ── Train without and with reweighing ─────────────────────────────────
    clf_unweighted = LogisticRegression(max_iter=500, random_state=42)
    clf_unweighted.fit(X_train_s, y_train)
    
    clf_weighted = LogisticRegression(max_iter=500, random_state=42)
    clf_weighted.fit(X_train_s, y_train, sample_weight=weights)
    
    # ── Evaluate both ─────────────────────────────────────────────────────
    print("Comparison: Unweighted vs. Reweighted Model")
    print("=" * 55)
    
    for label, clf in [("Unweighted", clf_unweighted),
                        ("Reweighted", clf_weighted)]:
        y_pred = clf.predict(X_test_s)
        scores = clf.predict_proba(X_test_s)[:, 1]
        
        _, disp = fairness_metrics_from_scratch(y_test, y_pred, scores, g_test)
        acc = accuracy_score(y_test, y_pred)
        
        print(f"\n{label}:")
        print(f"  Overall accuracy:        {acc:.4f}")
        print(f"  Demographic parity diff: {disp['demographic_parity_diff']:.4f}")
        print(f"  Equalized odds diff:     {disp['equalized_odds_diff']:.4f}")
        print(f"  Disparate impact ratio:  {disp['disparate_impact_ratio']:.4f}")
    
    return clf_unweighted, clf_weighted, scaler
```

**Interpretation notes for students:**

Reweighing typically reduces demographic parity difference and often improves disparate impact ratio, but at a cost to overall accuracy. The tradeoff between fairness and accuracy is a real one — and choosing where to accept this tradeoff is a normative decision, not a technical one. Notice also that reweighing does not fully resolve equalized odds violations when base rates differ: the impossibility theorem applies regardless of the mitigation technique.

---

## Exercise A14-3: Detecting Feedback Loop Amplification

**Problem:** Simulate three rounds of model retraining where the model's predictions influence future training data, and test whether disparity increases over time.

```python
import matplotlib
matplotlib.use('Agg')  # non-interactive backend for scripted use
import matplotlib.pyplot as plt
from scipy import stats

def simulate_feedback_loop(n_rounds=5, n_initial=1000, base_rate_0=0.4,
                            base_rate_1=0.6, deployment_effect=0.15):
    """
    Simulate a feedback loop where model predictions influence future
    training data. At each round, the predicted positive rate partly
    determines which cases generate positive outcomes in the next round
    (mimicking how predictions drive resource allocation, which changes
    measured outcomes).
    
    deployment_effect: how much the model's prediction rate for a group
    affects that group's actual outcome rate in the next round.
    """
    # Initial training data
    groups = np.random.randint(0, 2, n_initial)
    base = np.where(groups == 0, base_rate_0, base_rate_1)
    y = np.random.binomial(1, base)
    
    # Simple features: one informative, one noise
    X = np.column_stack([
        base + np.random.normal(0, 0.2, n_initial),
        np.random.normal(0, 1, n_initial)
    ])
    
    disparities_over_time = []
    selection_rates_g0 = []
    selection_rates_g1 = []
    
    current_br_0 = base_rate_0
    current_br_1 = base_rate_1
    
    for round_idx in range(n_rounds):
        # Train model on current data
        from sklearn.linear_model import LogisticRegression
        from sklearn.preprocessing import StandardScaler
        
        scaler = StandardScaler()
        X_s = scaler.fit_transform(X)
        
        clf = LogisticRegression(max_iter=500, random_state=round_idx)
        clf.fit(X_s, y)
        
        # Generate new round of data
        n_new = n_initial
        new_groups = np.random.randint(0, 2, n_new)
        
        # Outcomes influenced by current base rates (which have been affected
        # by previous round's predictions via deployment_effect)
        new_base = np.where(new_groups == 0, current_br_0, current_br_1)
        new_y = np.random.binomial(1, np.clip(new_base, 0, 1))
        new_X = np.column_stack([
            new_base + np.random.normal(0, 0.2, n_new),
            np.random.normal(0, 1, n_new)
        ])
        
        # Evaluate current model on new data
        new_X_s = scaler.transform(new_X)
        preds = clf.predict(new_X_s)
        
        sr_0 = preds[new_groups == 0].mean()
        sr_1 = preds[new_groups == 1].mean()
        disp = abs(sr_0 - sr_1)
        
        selection_rates_g0.append(sr_0)
        selection_rates_g1.append(sr_1)
        disparities_over_time.append(disp)
        
        print(f"Round {round_idx + 1}: SR_g0={sr_0:.3f}, SR_g1={sr_1:.3f}, "
              f"Disparity={disp:.3f}")
        
        # Update base rates: predictions drive resource allocation
        # which affects measured outcomes next round
        current_br_0 = base_rate_0 + deployment_effect * (sr_0 - 0.5)
        current_br_1 = base_rate_1 + deployment_effect * (sr_1 - 0.5)
        
        # Append new data for next training round
        X = np.vstack([X, new_X])
        y = np.concatenate([y, new_y])
        groups = np.concatenate([groups, new_groups])
    
    # Statistical test for trend
    rounds = np.arange(n_rounds)
    slope, _, r_val, p_val, _ = stats.linregress(rounds, disparities_over_time)
    
    print(f"\nDisparity trend: slope={slope:.4f}, R²={r_val**2:.3f}, "
          f"p={p_val:.4f}")
    
    if slope > 0 and p_val < 0.10:
        print("ALERT: Statistically significant feedback amplification detected.")
    
    return disparities_over_time, slope, p_val


# Run simulation
disparities, slope, pval = simulate_feedback_loop(
    n_rounds=6,
    deployment_effect=0.20   # strong feedback
)
```

**Understanding the output:**

In rounds with `deployment_effect > 0`, you should observe the disparity gradually increasing. This is the feedback loop: higher predictions for one group increase measured outcomes for that group (because resources follow predictions), which feeds into the next training cycle as "evidence" of higher base rates. The statistical test confirms whether the increase is significant.

The key insight: the model is becoming *more biased over time even though it is being retrained with new data*. New data is not a protection against feedback loops — it can be the mechanism through which feedback loops operate.

---

## Exercise A14-4: Building a Counterfactual Explanation System

**Problem:** Implement a simple counterfactual explanation generator for binary classification decisions. A counterfactual explanation answers: "What would need to change about this application to get a different decision?"

```python
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler

class CounterfactualExplainer:
    """
    Generates counterfactual explanations for binary classifier decisions.
    
    Uses a gradient-based approach to find the minimal feature change
    that would flip the prediction, subject to:
    - Feature value bounds (no impossible values)
    - Mutable features only (cannot change race, birth year, etc.)
    """
    
    def __init__(self, model, scaler, feature_names,
                 mutable_features=None, feature_bounds=None):
        self.model = model
        self.scaler = scaler
        self.feature_names = feature_names
        # Which features can actually change (e.g., not race, age at birth)
        self.mutable = mutable_features or list(range(len(feature_names)))
        self.bounds = feature_bounds or {}
    
    def explain(self, x_original, max_iter=500, lr=0.01,
                target_class=1, verbose=True):
        """
        Find the counterfactual: minimal change to x_original that
        causes the model to predict target_class.
        
        Uses projected gradient descent on the counterfactual loss.
        """
        x = x_original.copy().astype(float)
        x_scaled = self.scaler.transform([x])[0]
        
        original_pred = self.model.predict([x_scaled])[0]
        original_prob  = self.model.predict_proba([x_scaled])[0][1]
        
        if original_pred == target_class:
            print(f"Already predicted as class {target_class}.")
            return x_original, {}
        
        # Optimise: find counterfactual by gradient descent on
        # cross-entropy loss toward target_class + L2 regularization
        cf = x.copy()
        
        for iteration in range(max_iter):
            cf_scaled = self.scaler.transform([cf])[0]
            
            # Probability of target class
            prob = self.model.predict_proba([cf_scaled])[0][target_class]
            
            if prob > 0.5:
                break   # Counterfactual found
            
            # Gradient of logistic loss w.r.t. cf_scaled
            # For logistic regression: grad = (prob - target) * w
            # where w are the model coefficients
            coef = self.model.coef_[0]  # shape (n_features,)
            
            # Chain rule through scaler: dL/d(cf) = dL/d(cf_scaled) * (1/std)
            scale = self.scaler.scale_
            grad_cf_scaled = (prob - target_class) * coef
            grad_cf = grad_cf_scaled / scale
            
            # L2 regularization: pull counterfactual close to original
            reg_grad = 0.01 * (cf - x)
            
            # Projected gradient step: only update mutable features
            update = lr * (grad_cf + reg_grad)
            for i in range(len(cf)):
                if i in self.mutable:
                    cf[i] -= update[i]
                    # Apply bounds
                    if i in self.bounds:
                        cf[i] = np.clip(cf[i], *self.bounds[i])
        
        # Compute changes
        changes = {}
        for i, name in enumerate(self.feature_names):
            if abs(cf[i] - x[i]) > 0.001:
                changes[name] = {
                    'original': x[i],
                    'counterfactual': cf[i],
                    'change': cf[i] - x[i]
                }
        
        cf_scaled = self.scaler.transform([cf])[0]
        new_pred = self.model.predict([cf_scaled])[0]
        new_prob = self.model.predict_proba([cf_scaled])[0][1]
        
        if verbose:
            print(f"\nCounterfactual Explanation")
            print(f"Original prediction:     Class {original_pred} "
                  f"(prob={original_prob:.3f})")
            print(f"Counterfactual prediction: Class {new_pred} "
                  f"(prob={new_prob:.3f})")
            print(f"\nRequired changes:")
            for name, vals in sorted(changes.items(),
                                      key=lambda x: abs(x[1]['change']),
                                      reverse=True):
                direction = "increase" if vals['change'] > 0 else "decrease"
                print(f"  {name}: {vals['original']:.2f} → "
                      f"{vals['counterfactual']:.2f} "
                      f"({direction} by {abs(vals['change']):.2f})")
        
        return cf, changes


# ─── Demo usage ───────────────────────────────────────────────────────────────
# Simulate a loan scenario with two features: income ratio and credit history
np.random.seed(42)
n = 500

income_ratio = np.random.uniform(0.1, 0.9, n)   # debt-to-income ratio
credit_hist  = np.random.uniform(300, 850, n)    # credit score proxy
groups       = np.random.randint(0, 2, n)

# Approval: primarily income-based, with slight bias against group 1
# (in practice this would be historical discriminatory lending)
prob_approve = 1 / (1 + np.exp(
    5 * income_ratio - 0.004 * credit_hist + 0.3 * groups - 1
))
y = np.random.binomial(1, prob_approve)

X = np.column_stack([income_ratio, credit_hist])
feature_names = ['debt_to_income_ratio', 'credit_score']

scaler = StandardScaler()
X_s = scaler.fit_transform(X)
clf = LogisticRegression(max_iter=500, random_state=42)
clf.fit(X_s, y)

# Explain a denial
explainer = CounterfactualExplainer(
    model=clf,
    scaler=scaler,
    feature_names=feature_names,
    mutable_features=[0, 1],   # both features are mutable
    feature_bounds={
        0: (0.1, 0.9),    # debt ratio between 10% and 90%
        1: (300, 850),    # credit score range
    }
)

# Find an applicant who was denied
denied_indices = np.where(clf.predict(X_s) == 0)[0]
test_case = X[denied_indices[0]]

cf, changes = explainer.explain(test_case, target_class=1)
```

**Pedagogical note:** The output of this code illustrates *why* counterfactual explanations matter for fairness. If the minimal change to get approved requires changing a feature that is correlated with the protected attribute (e.g., "reduce debt-to-income ratio by 12 percentage points"), that tells you something about how the model is using group-correlated proxies. If the change is implausible (requiring impossible jumps in credit score), the contestability mechanism is meaningless — it describes a path that doesn't exist.

---

## Exercise A14-5: Implementing the Audit Trail

**Problem:** Build a simple audit logger for a binary classifier that records every prediction, its inputs, and the demographic group of the subject, in a format suitable for later fairness analysis.

```python
import sqlite3
import json
import hashlib
from datetime import datetime
import numpy as np

class HITLAuditLogger:
    """
    Lightweight audit trail for HITL deployment.
    
    Logs every model prediction to SQLite with sufficient metadata
    to reconstruct slice-based fairness analyses later.
    """
    
    def __init__(self, db_path='hitl_audit.db'):
        self.db_path = db_path
        self._init_db()
    
    def _init_db(self):
        conn = sqlite3.connect(self.db_path)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS predictions (
                prediction_id    TEXT PRIMARY KEY,
                timestamp        TEXT,
                input_hash       TEXT,
                model_version    TEXT,
                prediction       INTEGER,
                confidence       REAL,
                sensitive_group  TEXT,
                sent_to_review   INTEGER,
                human_decision   INTEGER,
                human_id         TEXT,
                final_outcome    INTEGER
            )
        """)
        conn.execute("""
            CREATE INDEX IF NOT EXISTS idx_group 
            ON predictions(sensitive_group)
        """)
        conn.execute("""
            CREATE INDEX IF NOT EXISTS idx_timestamp 
            ON predictions(timestamp)
        """)
        conn.commit()
        conn.close()
    
    def log_prediction(self, inputs, prediction, confidence, 
                        sensitive_group, model_version,
                        sent_to_review=False):
        """Log a model prediction. Returns prediction_id for later updates."""
        pred_id = hashlib.sha256(
            f"{json.dumps(inputs.tolist())}{datetime.utcnow().isoformat()}".encode()
        ).hexdigest()[:16]
        
        conn = sqlite3.connect(self.db_path)
        conn.execute("""
            INSERT INTO predictions 
            (prediction_id, timestamp, input_hash, model_version,
             prediction, confidence, sensitive_group, sent_to_review)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            pred_id,
            datetime.utcnow().isoformat(),
            hashlib.md5(str(inputs.tolist()).encode()).hexdigest(),
            model_version,
            int(prediction),
            float(confidence),
            str(sensitive_group),
            int(sent_to_review)
        ))
        conn.commit()
        conn.close()
        return pred_id
    
    def log_human_review(self, prediction_id, human_decision, human_id):
        """Record the outcome of human review for a flagged case."""
        conn = sqlite3.connect(self.db_path)
        conn.execute("""
            UPDATE predictions 
            SET human_decision=?, human_id=?
            WHERE prediction_id=?
        """, (int(human_decision), str(human_id), prediction_id))
        conn.commit()
        conn.close()
    
    def log_ground_truth(self, prediction_id, final_outcome):
        """Record the eventual true outcome for a case."""
        conn = sqlite3.connect(self.db_path)
        conn.execute("""
            UPDATE predictions SET final_outcome=?
            WHERE prediction_id=?
        """, (int(final_outcome), prediction_id))
        conn.commit()
        conn.close()
    
    def fairness_audit(self, start_date=None, end_date=None):
        """
        Run a fairness audit on logged predictions.
        Returns demographic parity difference and override rates by group.
        """
        conn = sqlite3.connect(self.db_path)
        
        query = "SELECT * FROM predictions"
        conditions = []
        if start_date:
            conditions.append(f"timestamp >= '{start_date}'")
        if end_date:
            conditions.append(f"timestamp <= '{end_date}'")
        if conditions:
            query += " WHERE " + " AND ".join(conditions)
        
        df = pd.read_sql_query(query, conn)
        conn.close()
        
        if df.empty:
            print("No predictions logged yet.")
            return {}
        
        print(f"\nFairness Audit: {len(df)} predictions")
        print("=" * 50)
        
        audit_results = {}
        for group in df['sensitive_group'].unique():
            gdf = df[df['sensitive_group'] == group]
            
            pred_rate = gdf['prediction'].mean()
            review_rate = gdf['sent_to_review'].mean()
            
            # Override rate: cases where human changed AI decision
            reviewed = gdf[gdf['sent_to_review'] == 1].dropna(
                subset=['human_decision']
            )
            if len(reviewed) > 0:
                override_rate = (
                    reviewed['prediction'] != reviewed['human_decision']
                ).mean()
            else:
                override_rate = np.nan
            
            audit_results[group] = {
                'n': len(gdf),
                'prediction_rate': pred_rate,
                'review_rate': review_rate,
                'override_rate': override_rate,
            }
            
            print(f"\nGroup {group} (n={len(gdf)}):")
            print(f"  Prediction rate:  {pred_rate:.4f}")
            print(f"  Review rate:      {review_rate:.4f}")
            print(f"  Override rate:    {override_rate:.4f}" 
                  if not np.isnan(override_rate) else "  Override rate: n/a")
        
        groups = list(audit_results.keys())
        if len(groups) >= 2:
            dp = abs(
                audit_results[groups[0]]['prediction_rate'] -
                audit_results[groups[1]]['prediction_rate']
            )
            print(f"\nDemographic parity difference: {dp:.4f}")
            if dp > 0.10:
                print("ALERT: Demographic parity gap exceeds 0.10 threshold.")
        
        return audit_results
```

This audit trail implementation produces the infrastructure the chapter describes as essential for both detecting and remediating fairness failures. A system without this logging cannot answer the question "has this system been producing disparate outcomes?" — and therefore cannot be held accountable when it has.
