# Τεχνικό Παράρτημα Κεφαλαίου 14: Μετρικές Δικαιοσύνης, Έλεγχος Μεροληψίας και Εργαλεία Αλγοριθμικής Λογοδοσίας

*Μαθηματικά θεμέλια και υλοποιήσεις σε Python για την οικοδόμηση και τον έλεγχο δίκαιων συστημάτων ΤΝ*

---

## A14.1 Επίσημοι Ορισμοί Δικαιοσύνης

Η δικαιοσύνη στη μηχανική μάθηση δεν είναι μια ενιαία ποσότητα. Είναι μια οικογένεια διακριτών μαθηματικών ιδιοτήτων, ορισμένες εκ των οποίων είναι αμοιβαία ασύμβατες. Αυτή η ενότητα επισημοποιεί τους κυριότερους ορισμούς και καθιστά σαφείς τους συμβιβασμούς μεταξύ τους.

Έστω:
- $\hat{Y}$ = πρόβλεψη μοντέλου (δυαδική: 0 ή 1)
- $Y$ = πραγματικό αποτέλεσμα
- $A$ = ευαίσθητο χαρακτηριστικό (π.χ. φυλή, φύλο, ηλικιακή ομάδα)
- $X$ = όλα τα άλλα χαρακτηριστικά

**Δημογραφική Ισοτιμία (Demographic Parity - Στατιστική Ισοτιμία):**

$$P(\hat{Y} = 1 \mid A = 0) = P(\hat{Y} = 1 \mid A = 1)$$

Η πιθανότητα μιας θετικής πρόβλεψης είναι ίση μεταξύ των ομάδων. Ένας αλγόριθμος προσλήψεων ικανοποιεί τη δημογραφική ισοτιμία εάν συνιστά υποψηφίους με ίσους ρυθμούς ανεξάρτητα από το προστατευόμενο χαρακτηριστικό.

**Εξισωμένες Πιθανότητες (Equalized Odds) (Hardt, Price & Srebro, 2016):**

$$P(\hat{Y} = 1 \mid Y = y, A = 0) = P(\hat{Y} = 1 \mid Y = y, A = 1) \quad \text{για } y \in \{0,1\}$$

Τόσο ο ρυθμός αληθώς θετικών (TPR) όσο και ο ρυθμός ψευδώς θετικών (FPR) είναι ίσοι μεταξύ των ομάδων. Ένα εργαλείο ιατρικού προληπτικού ελέγχου ικανοποιεί τις εξισωμένες πιθανότητες εάν προσδιορίζει σωστά τους ασθενείς — και επισημαίνει εσφαλμένα τους υγιείς — με ίσους ρυθμούς ανεξάρτητα από τη δημογραφική ομάδα.

**Ισότητα Ευκαιριών (Equal Opportunity)** (ασθενέστερη μορφή των εξισωμένων πιθανοτήτων): μόνο ο περιορισμός TPR:

$$P(\hat{Y} = 1 \mid Y = 1, A = 0) = P(\hat{Y} = 1 \mid Y = 1, A = 1)$$

**Βαθμονόμηση (Calibration - Ισοτιμία Προβλεπτικού Ρυθμού):**

$$P(Y = 1 \mid \hat{Y} = 1, A = 0) = P(Y = 1 \mid \hat{Y} = 1, A = 1)$$

Μεταξύ όλων των ατόμων για τα οποία η πρόβλεψη ήταν θετική, το κλάσμα εκείνων που είναι όντως θετικοί είναι ίσο μεταξύ των ομάδων.

---

## A14.2 Το Θεώρημα Αδυναμίας Δικαιοσύνης

Η Chouldechova (2017) απέδειξε ότι η βαθμονόμηση και ο ίσος FPR δεν μπορούν να ισχύουν ταυτόχρονα όταν οι βασικοί ρυθμοί διαφέρουν μεταξύ των ομάδων. Ακολουθεί η επίσημη διατύπωση και ένα διαισθητικό σκίτσο της απόδειξης.

**Πλαίσιο:** Έστω $b_A = P(Y = 1 \mid A)$ ο βασικός ρυθμός του αποτελέσματος για την ομάδα $A$.

**Θεώρημα (Chouldechova, 2017):** Εάν $b_0 \neq b_1$ (οι βασικοί ρυθμοί διαφέρουν), τότε οποιοδήποτε σκορ $s$ δεν μπορεί να ικανοποιεί ταυτόχρονα:

1. **Βαθμονόμηση:** $P(Y=1 \mid s, A) = s$ για όλες τις ομάδες
2. **Ίσο FPR:** $P(\hat{Y}=1 \mid Y=0, A=0) = P(\hat{Y}=1 \mid Y=0, A=1)$
3. **Ίσο FNR:** $P(\hat{Y}=0 \mid Y=1, A=0) = P(\hat{Y}=0 \mid Y=1, A=1)$

**Διαισθητική απόδειξη:** Για ένα βαθμονομημένο μοντέλο στο όριο $\tau$:

$$FPR_A = \frac{(1-\text{PPV}_A) \cdot \text{PR}_A}{1 - b_A}$$

όπου $\text{PPV}_A$ είναι η θετική προβλεπτική αξία και $\text{PR}_A$ είναι ο ρυθμός πρόβλεψης για την ομάδα $A$. Εάν $b_0 \neq b_1$ και το $\text{PPV}$ είναι εξισωμένο (βαθμονόμηση), τότε η ισότητα FPR απαιτεί το $\text{PR}_A$ να προσαρμοστεί με τρόπο που αναπόφευκτα παραβιάζει την ισότητα FNR. Και τα τρία δεν μπορούν να ισχύουν ταυτόχρονα.

**Απεικόνιση της αδυναμίας σε Python:**

```python
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import confusion_matrix

def compute_fairness_metrics(y_true, y_pred, groups):
    """
    Υπολογισμός μετρικών δικαιοσύνης σε δύο δημογραφικές ομάδες.
    Επιστρέφει λεξικό {metric: {group_0: value, group_1: value}}.
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
    Προσομοίωση της αδυναμίας δικαιοσύνης: όταν οι βασικοί ρυθμοί διαφέρουν,
    ένα βαθμονομημένο μοντέλο δεν μπορεί να εξισώσει τόσο το TPR όσο και το FPR.
    """
    np.random.seed(42)

    # Δημιουργία δύο ομάδων με διαφορετικούς βασικούς ρυθμούς
    y0 = np.random.binomial(1, base_rate_0, n // 2)
    y1 = np.random.binomial(1, base_rate_1, n // 2)
    y = np.concatenate([y0, y1])
    groups = np.concatenate([np.zeros(n // 2), np.ones(n // 2)])

    # Δημιουργία ενός βαθμονομημένου σκορ (Bayes-βέλτιστο για κάθε ομάδα ξεχωριστά)
    # Χρησιμοποιεί ένα ενιαίο όριο σε όλες τις ομάδες — αυτός είναι ο περιορισμός
    scores = np.where(
        groups == 0,
        np.random.beta(2, 8, n),   # χαμηλές τιμές για χαμηλό βασικό ρυθμό
        np.random.beta(4, 6, n)    # υψηλότερες τιμές για υψηλό βασικό ρυθμό
    )
    # Προσαρμογή σκορ ώστε οι προβλέψεις να είναι βαθμονομημένες
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

    # Ανάδειξη του ότι η ικανοποίηση της βαθμονόμησης σπάει τον ίσο FPR
    fpr_gap = abs(metrics['group_0']['FPR'] - metrics['group_1']['FPR'])
    tpr_gap = abs(metrics['group_0']['TPR'] - metrics['group_1']['TPR'])
    ppv_gap = abs(metrics['group_0']['PPV'] - metrics['group_1']['PPV'])

    print(f"\nFPR gap: {fpr_gap:.3f} | TPR gap: {tpr_gap:.3f} | "
          f"PPV gap (calibration): {ppv_gap:.3f}")
    print("Note: Minimizing PPV gap (calibration) cannot prevent FPR gap "
          "when base rates differ.")
```

---

## A14.3 Ανίχνευση Μεροληψίας με το Fairlearn

Η βιβλιοθήκη Fairlearn της Microsoft παρέχει πίνακες ελέγχου (dashboards) και αλγορίθμους μετριασμού.

```python
from fairlearn.metrics import (
    MetricFrame, demographic_parity_difference,
    equalized_odds_difference, selection_rate
)
from sklearn.metrics import accuracy_score, precision_score, recall_score
import pandas as pd

def full_fairness_audit(y_true, y_pred, sensitive_features, feature_name):
    """
    Εκτέλεση πλήρους ελέγχου δικαιοσύνης στις προβλέψεις ενός δυαδικού ταξινομητή.

    Παράμετροι:
    -----------
    y_true : array-like, πραγματικές ετικέτες
    y_pred : array-like, προβλεπόμενες ετικέτες
    sensitive_features : array-like, ετικέτες δημογραφικών ομάδων
    feature_name : str, όνομα του ευαίσθητου χαρακτηριστικού

    Επιστρέφει:
    --------
    λεξικό με MetricFrame και βαθμωτές μετρικές ανισότητας
    """
    # Το MetricFrame υπολογίζει πολλαπλές μετρικές σε όλες τις ομάδες ταυτόχρονα
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

    # Βαθμωτές μετρικές ανισότητας
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

    # Επισήμανση εάν ξεπεραστούν τα όρια
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

## A14.4 Τεχνικές Μετριασμού Μεροληψίας

Τρεις κατηγορίες μετριασμού αντιστοιχούν σε τρία στάδια της ροής εργασίας ML:

**Προ-επεξεργασία (Pre-processing):** Τροποποίηση των δεδομένων εκπαίδευσης πριν από την εκπαίδευση του μοντέλου.
**Ενδιάμεση επεξεργασία (In-processing):** Προσθήκη περιορισμών δικαιοσύνης στον στόχο μάθησης.
**Μετα-επεξεργασία (Post-processing):** Προσαρμογή των προβλέψεων του μοντέλου μετά την εκπαίδευση.

```python
from fairlearn.reductions import ExponentiatedGradient, DemographicParity
from fairlearn.postprocessing import ThresholdOptimizer
from sklearn.linear_model import LogisticRegression

# ── Ενδιάμεση επεξεργασία: Exponentiated Gradient ─────────────────────────────────────
def train_fair_classifier_inprocessing(X_train, y_train, sensitive_train):
    """
    Εκπαίδευση με περιορισμούς δικαιοσύνης μέσω Exponentiated Gradient.
    Ανταλλάσσει κάποια ακρίβεια για την ικανοποίηση της δημογραφικής ισοτιμίας.
    """
    base_estimator = LogisticRegression(max_iter=500)
    constraint = DemographicParity()

    mitigator = ExponentiatedGradient(
        estimator=base_estimator,
        constraints=constraint,
        eps=0.01   # Μέγιστη επιτρεπόμενη διαφορά δημογραφικής ισοτιμίας
    )
    mitigator.fit(
        X_train, y_train,
        sensitive_features=sensitive_train
    )
    return mitigator


# ── Μετα-επεξεργασία: Threshold Optimizer ──────────────────────────────────────
def train_fair_classifier_postprocessing(estimator, X_train, y_train,
                                          sensitive_train, constraint='equalized_odds'):
    """
    Μετα-επεξεργασία προβλέψεων επιλέγοντας όρια ειδικά για κάθε ομάδα
    που ικανοποιούν τις εξισωμένες πιθανότητες ή τη δημογραφική ισοτιμία.
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


# ── Προ-επεξεργασία: Επαναστάθμιση (Reweighing) ─────────────────────────────────────────────────
def compute_reweighing_weights(y_train, sensitive_train):
    """
    Υπολογισμός βαρών περιπτώσεων έτσι ώστε κάθε συνδυασμός (ομάδα, ετικέτα)
    να έχει ίσο βάρος στην εκπαίδευση. Μειώνει τη δημογραφική ανισότητα αφαιρώντας
    τη συσχέτιση μεταξύ της συμμετοχής σε ομάδα και της ετικέτας στο σταθμισμένο σύνολο δεδομένων.

    Επιστρέφει πίνακα sample_weight για χρήση στο model.fit(sample_weight=...).
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

## A14.5 IBM AI Fairness 360 — Λόγος Ανισόρροπου Αντικτύπου

Ο λόγος ανισόρροπου αντικτύπου (disparate impact ratio - DIR) είναι η τυπική μετρική που χρησιμοποιείται στο δίκαιο των ΗΠΑ για τις διακρίσεις στην απασχόληση (ο "κανόνας των 4/5"):

$$DIR = \frac{P(\hat{Y}=1 \mid A=\text{μειονότητα})}{P(\hat{Y}=1 \mid A=\text{πλειονότητα})}$$

Ένα DIR κάτω από 0,8 (η μειονοτική ομάδα λαμβάνει θετικές προβλέψεις με ρυθμό μικρότερο από το 80% του ρυθμού της πλειονοτικής ομάδας) αποτελεί νομικό όριο για ανισόρροπο αντίκτυπο σε πλαίσια απασχόλησης.

```python
from aif360.datasets import BinaryLabelDataset
from aif360.metrics import BinaryLabelDatasetMetric, ClassificationMetric
import pandas as pd

def compute_disparate_impact_aif360(df, label_col, sensitive_col,
                                     privileged_val, unprivileged_val,
                                     prediction_col=None):
    """
    Υπολογισμός ανισόρροπου αντικτύπου και άλλων μετρικών δικαιοσύνης χρησιμοποιώντας το AIF360.

    Εάν το prediction_col είναι None, αξιολογεί την ίδια την κατανομή των ετικετών
    (δικαιοσύνη των δεδομένων εκπαίδευσης πριν από το μοντέλο).
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

## A14.6 Αντιπαραδειγματική Δικαιοσύνη (Counterfactual Fairness)

Η αντιπαραδειγματική δικαιοσύνη (Kusner et al., 2017) ρωτά: θα άλλαζε η πρόβλεψη εάν το άτομο ανήκε σε διαφορετική δημογραφική ομάδα, διατηρώντας σταθερά όλα τα αιτιωδώς ανεξάρτητα χαρακτηριστικά;

$$P(\hat{Y}_{A \leftarrow a}(U) = y \mid X=x, A=a) = P(\hat{Y}_{A \leftarrow a'}(U) = y \mid X=x, A=a)$$

Αυτό απαιτεί ένα αιτιακό μοντέλο της διαδικασίας παραγωγής δεδομένων. Η υλοποίηση μέσω do-calculus ή δομικών εξισώσεων εξαρτάται από τον τομέα, αλλά η αρχή του ελέγχου μπορεί να προσεγγιστεί:

```python
def counterfactual_fairness_test(model, X_test, sensitive_col,
                                  group_a_val, group_b_val,
                                  non_sensitive_cols):
    """
    Προσέγγιση ελέγχου αντιπαραδειγματικής δικαιοσύνης αλλάζοντας το ευαίσθητο χαρακτηριστικό
    και μετρώντας την αλλαγή στην πρόβλεψη. Δεν είναι μια πραγματική αιτιακή παρέμβαση
    (η οποία απαιτεί ένα δομικό αιτιακό μοντέλο), αλλά είναι χρήσιμο ως έλεγχος συνέπειας.

    Επιστρέφει το κλάσμα των δειγμάτων δοκιμής όπου η πρόβλεψη αλλάζει όταν
    το ευαίσθητο χαρακτηριστικό εναλλάσσεται.
    """
    import pandas as pd
    import numpy as np

    X_a = X_test[X_test[sensitive_col] == group_a_val].copy()

    # Δημιουργία αντιπαραδείγματος: ίδια χαρακτηριστικά, αντίθετη ομάδα
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

## A14.7 Ανίχνευση Βρόχου Ανάδρασης

Η ανίχνευση του αν ένα αναπτυγμένο μοντέλο ενισχύει τις ανισότητες με την πάροδο του χρόνου απαιτεί την παρακολούθηση της συσχέτισης μεταξύ προβλέψεων και αποτελεσμάτων κατά τη διάρκεια των κύκλων επανεκπαίδευσης.

```python
import numpy as np
import pandas as pd
from scipy import stats

def detect_feedback_amplification(predictions_history, outcomes_history,
                                    group_labels, n_cycles=5):
    """
    Έλεγχος αν οι προβλέψεις ενός μοντέλου γίνονται πιο ανισόρροπες σε
    διαδοχικούς κύκλους επανεκπαίδευσης — ένα σημάδι ενίσχυσης βρόχου ανάδρασης.

    predictions_history: λίστα πινάκων, ένας ανά κύκλο εκπαίδευσης
    outcomes_history:    λίστα πινάκων, ένας ανά κύκλο
    group_labels:        λίστα πινάκων, συμμετοχή σε ομάδα ανά κύκλο
    n_cycles:            αριθμός κύκλων προς ανάλυση
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

    # Έλεγχος για τάση: αυξάνεται η ανισότητα κατά τη διάρκεια των κύκλων;
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

## A14.8 Αλγοριθμική Δικαιοσύνη στην Πράξη: Η Λίστα Ελέγχου

Μια δομημένη λίστα ελέγχου πριν από την ανάπτυξη και για συνεχή έλεγχο, η οποία προκύπτει από το NIST AI RMF (2023) και τις απαιτήσεις της Πράξης της ΕΕ για την ΤΝ (EU AI Act):

| Στάδιο | Έλεγχος | Εργαλείο | Όριο |
|-------|-------|------|-----------|
| **Δεδομένα** | Δημογραφική εκπροσώπηση στο σύνολο εκπαίδευσης | EDA + στατιστικά δειγματοληψίας | Καμία ομάδα < 5% του N |
| **Δεδομένα** | Κατανομή ετικετών ανά ομάδα | MetricFrame | Διαφορά ισοτιμίας < 0.10 |
| **Μοντέλο** | Δημογραφική ισοτιμία στο όριο ανάπτυξης | Fairlearn | Διαφορά < 0.10 |
| **Μοντέλο** | Εξισωμένες πιθανότητες | Fairlearn | Διαφορά < 0.10 |
| **Μοντέλο** | Βαθμονόμηση ανά ομάδα | ECE ανά ομάδα | ECE ανά ομάδα < 0.05 |
| **Μοντέλο** | Λόγος ανισόρροπου αντικτύπου | AIF360 | DIR ≥ 0.80 |
| **Ανάπτυξη** | Παρακολούθηση βάσει τμημάτων (μηνιαία) | SliceFinder | Ειδοποίηση σε υποβάθμιση 5% |
| **Ανάπτυξη** | Έλεγχος συσχέτισης βρόχου ανάδρασης | Custom | Κλίση p < 0.05 → διακοπή |
| **Διαδικασία** | Δημογραφική ποικιλομορφία ανθρώπινων αξιολογητών | Αρχείο καταγραφής | Τεκμηρίωση + αξιολόγηση |
| **Διαδικασία** | Μηχανισμός αμφισβήτησης λειτουργικός | Έλεγχος διαδικασίας | 100% των περιπτώσεων έχουν διαδρομή |

---

## A14.9 Περαιτέρω Ανάγνωση

- Chouldechova, A. (2017). Fair prediction with disparate impact. *Big Data, 5*(2).
- Hardt, M., Price, E., & Srebro, N. (2016). Equality of opportunity in supervised learning. *NeurIPS 29*.
- Kusner, M. J., Loftus, J., Russell, C., & Silva, R. (2017). Counterfactual fairness. *NeurIPS 30*.
- Wachter, S., Mittelstadt, B., & Russell, C. (2017). Counterfactual explanations without opening the black box. *HJLT, 31*(2).
- Bird, S., et al. (2020). Fairlearn: A toolkit for assessing and improving fairness in AI. *Microsoft Research*.
