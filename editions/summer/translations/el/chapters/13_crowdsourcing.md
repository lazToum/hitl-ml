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

# Crowdsourcing και Ποιοτικός Έλεγχος

Όταν οι εργασίες σχολιασμού είναι αρκετά απλές για να εκτελεστούν από μη ειδικούς, οι πλατφόρμες crowdsourcing προσφέρουν πρόσβαση σε μεγάλα, κατ' απαίτηση εργατικά δυναμικά σχολιασμού με χαμηλό κόστος ανά στοιχείο. Η δημιουργία συνόλων δεδομένων υψηλής ποιότητας με ετικέτες από πλήθη απαιτεί προσεκτικό σχεδιασμό εργασιών, στρατηγική πλεονασμό και αυστηρό ποιοτικό έλεγχο.

---

## Πλατφόρμες Crowdsourcing

Το **Amazon Mechanical Turk (MTurk)** είναι η πρωτότυπη αγορά crowdsourcing, που εγκαινιάστηκε το 2005. Οι εργαζόμενοι ("Turkers") ολοκληρώνουν μικρο-εργασίες (HITs) που αναρτούν οι αιτούντες. Μια μελέτη του 2018 βρήκε διάμεσες πραγματικές ωριαίες αποδοχές Turkers περίπου 2$/ώρα — πολύ κάτω από τον κατώτατο μισθό σε πολλές χώρες υψηλού εισοδήματος {cite}`hara2018data` — μια ηθική ανησυχία που αντιμετωπίζεται αργότερα στο Κεφάλαιο 15. Το MTurk είναι καλύτερο για απλές εργασίες με σαφή, επαληθεύσιμα κριτήρια.

Το **Prolific** είναι μια ακαδημαϊκή πλατφόρμα crowdsourcing που επιβάλλει ένα ελάχιστο πρότυπο αμοιβής (επί του παρόντος περίπου £9/ώρα, περίπου 11$/ώρα, όπως αναφέρεται στις δημοσιευμένες οδηγίες του Prolific), ελέγχει τους συμμετέχοντες κατά δημογραφικά, και διατηρεί ένα πάνελ εργαζομένων που έχουν επιλέξει να συμμετέχουν σε έρευνες. Προτιμάται για κοινωνικο-επιστημονική έρευνα και εργασίες που απαιτούν αντιπροσωπευτικότητα.

Η **Appen** (και παρόμοιες: Telus International, iMerit) παρέχει διαχειριζόμενα εργατικά δυναμικά σχολιασμού με διαχείριση ποιότητας, που χρησιμοποιείται για εργασίες υψηλότερης πολυπλοκότητας και εταιρικά έργα.

**Εξειδικευμένες κοινότητες.** Για τομεακές εργασίες, κοινότητες ενθουσιωδών του τομέα μπορούν να παρέχουν σχολιασμούς υψηλής ποιότητας: Galaxy Zoo για αστρονομία, eBird για είδη πτηνών, Chess Tempo για σχολιασμό θέσεων σκακιού.

---

## Σχεδιασμός Εργασιών για Crowdsourcing

### Αποσύνθεση Σύνθετων Εργασιών

Οι σύνθετες εργασίες πρέπει να αποσυντίθενται σε απλές, καλά ορισμένες μικρο-εργασίες. Αντί να ζητάτε από εργαζόμενους να σχολιάσουν ολοκληρωτικά ένα έγγραφο, ρωτήστε τους μία εστιασμένη ερώτηση κάθε φορά: "Περιέχει αυτή η πρόταση το όνομα ενός προσώπου;" ή "Βαθμολογήστε τη σαφήνεια αυτής της μετάφρασης σε κλίμακα 1–5."

**Πλεονεκτήματα της αποσύνθεσης:**
- Χαμηλότερη γνωστική απαίτηση ανά εργασία → λιγότερη κόπωση, υψηλότερη ποιότητα
- Κάθε μικρο-εργασία μπορεί να ελεγχθεί ξεχωριστά ως προς ποιότητα
- Ευκολότερος έλεγχος και αποσφαλμάτωση

### Η Σημασία των Οδηγιών

Ο μεγαλύτερος μεμονωμένος προβλεπτής ποιότητας crowdsourcing είναι η ποιότητα των οδηγιών. Καλές οδηγίες εργασίας:
- Εξηγούν τον *σκοπό* της εργασίας σε μία πρόταση
- Δίνουν σαφή, αναμφίβολο ορισμό κάθε κατηγορίας
- Παρέχουν 3–5 παραδείγματα εκτελεσμένων εργασιών (ειδικά οριακές περιπτώσεις)
- Δεν είναι μεγαλύτερες από ό,τι οι εργαζόμενοι θα διαβάσουν πραγματικά (< 300 λέξεις για απλές εργασίες)

Εκτελέστε μια **πιλοτική μελέτη** (10–50 εργαζόμενοι, 20–100 εργασίες) πριν κλιμακωθείτε. Αναλύστε τις διαφωνίες του πιλότου· οι περισσότερες δείχνουν σε ασάφειες οδηγιών που μπορούν να διορθωθούν.

### Ερωτήσεις Χρυσού Προτύπου

Ενσωματώστε **ερωτήσεις χρυσού προτύπου** — εργασίες με γνωστές σωστές απαντήσεις — σε όλη τη δέσμη εργασιών. Οι εργαζόμενοι που αποτυγχάνουν σε ερωτήσεις χρυσού κάτω από ένα κατώφλι αφαιρούνται από το έργο.

```{code-cell} python
import numpy as np
from scipy.stats import binom

rng = np.random.default_rng(42)

def simulate_gold_screening(n_workers=100, gold_per_batch=5,
                             p_good_worker=0.7, good_acc=0.92,
                             bad_acc=0.55, threshold=0.70):
    """
    Simulate quality screening via gold questions.
    Returns: precision and recall of identifying bad workers.
    """
    worker_quality = rng.choice(['good', 'bad'], size=n_workers,
                                 p=[p_good_worker, 1 - p_good_worker])
    results = {'tp': 0, 'fp': 0, 'tn': 0, 'fn': 0}

    for q in worker_quality:
        acc = good_acc if q == 'good' else bad_acc
        n_correct = rng.binomial(gold_per_batch, acc)
        passed = (n_correct / gold_per_batch) >= threshold
        if q == 'bad' and not passed:  results['tp'] += 1
        if q == 'good' and not passed: results['fp'] += 1
        if q == 'bad' and passed:      results['fn'] += 1
        if q == 'good' and passed:     results['tn'] += 1

    tp, fp, fn = results['tp'], results['fp'], results['fn']
    precision = tp / (tp + fp + 1e-6)
    recall    = tp / (tp + fn + 1e-6)
    return precision, recall

# Vary gold question count
gold_counts = [3, 5, 8, 10, 15, 20]
precisions, recalls = [], []
for g in gold_counts:
    p_list, r_list = [], []
    for _ in range(50):
        p, r = simulate_gold_screening(gold_per_batch=g)
        p_list.append(p); r_list.append(r)
    precisions.append(np.mean(p_list))
    recalls.append(np.mean(r_list))

import matplotlib.pyplot as plt
fig, ax = plt.subplots(figsize=(7, 4))
ax.plot(gold_counts, precisions, 'o-', color='#2b3a8f', label='Precision', linewidth=2)
ax.plot(gold_counts, recalls,    's--', color='#0d9e8e', label='Recall',    linewidth=2)
ax.set_xlabel("Gold questions per batch", fontsize=12)
ax.set_ylabel("Screening performance", fontsize=12)
ax.set_title("Worker Screening via Gold Standard Questions", fontsize=13)
ax.legend(fontsize=11); ax.grid(alpha=0.3)
plt.tight_layout()
plt.savefig('gold_screening.png', dpi=150)
plt.show()

p, r = simulate_gold_screening(gold_per_batch=5)
print(f"5 gold questions: Precision={p:.3f}, Recall={r:.3f}")
p, r = simulate_gold_screening(gold_per_batch=10)
print(f"10 gold questions: Precision={p:.3f}, Recall={r:.3f}")
```

---

## Στατιστικά Μοντέλα για Συνάθροιση Ετικετών

Η ψηφοφορία πλειοψηφίας είναι μια φυσική βασική γραμμή αλλά αγνοεί τις διαφορές στην ακρίβεια σχολιαστών. Τα στατιστικά μοντέλα μπορούν να κάνουν καλύτερα.

### Το Μοντέλο Dawid-Skene

Το **μοντέλο Dawid-Skene (DS)** {cite}`dawid1979maximum` εκτιμά από κοινού:
- Την **πραγματική ετικέτα** $z_i$ για κάθε στοιχείο $i$
- Τον **πίνακα σύγχυσης** $\pi_j^{(k,l)}$ για κάθε σχολιαστή $j$: η πιθανότητα ο σχολιαστής $j$ να επισημαίνει ένα στοιχείο με πραγματική κλάση $k$ ως κλάση $l$

Ο αλγόριθμος EM επαναλαμβάνει:
- **Βήμα Ε:** Δεδομένων των πινάκων σύγχυσης σχολιαστών, υπολογίστε την εκ των υστέρων πιθανότητα κάθε πραγματικής ετικέτας
- **Βήμα Μ:** Δεδομένων των εκτιμήσεων ετικετών στοιχείων, ενημερώστε τους πίνακες σύγχυσης σχολιαστών

```{code-cell} python
import numpy as np
from scipy.special import softmax

def dawid_skene_em(annotations, n_classes, n_iter=20):
    """
    Simplified Dawid-Skene EM for binary classification.
    annotations: dict {item_idx: [(annotator_idx, label), ...]}
    Returns: estimated true labels and annotator accuracies.
    """
    items = sorted(annotations.keys())
    n_items = len(items)
    annotators = sorted({a for anns in annotations.values() for a, _ in anns})
    n_annotators = len(annotators)
    ann_idx = {a: i for i, a in enumerate(annotators)}

    # Initialize: majority vote
    T = np.zeros((n_items, n_classes))  # soft label estimates
    for i, item in enumerate(items):
        for _, label in annotations[item]:
            T[i, label] += 1
        T[i] /= T[i].sum()

    # Confusion matrices: shape (n_annotators, n_classes, n_classes)
    PI = np.ones((n_annotators, n_classes, n_classes)) * 0.5

    for _ in range(n_iter):
        # M-step: update confusion matrices
        PI = np.zeros((n_annotators, n_classes, n_classes)) + 1e-6
        for i, item in enumerate(items):
            for ann, label in annotations[item]:
                a = ann_idx[ann]
                for k in range(n_classes):
                    PI[a, k, label] += T[i, k]
        PI /= PI.sum(axis=2, keepdims=True)

        # E-step: update soft label estimates
        T = np.zeros((n_items, n_classes))
        for i, item in enumerate(items):
            log_p = np.zeros(n_classes)
            for ann, label in annotations[item]:
                a = ann_idx[ann]
                log_p += np.log(PI[a, :, label] + 1e-10)
            T[i] = softmax(log_p)

    return {item: T[i] for i, item in enumerate(items)}, PI

# Simulate crowdsourcing scenario
rng = np.random.default_rng(42)
N_ITEMS, N_ANNOTATORS, ANNS_PER_ITEM = 200, 10, 3
true_labels = rng.integers(0, 2, N_ITEMS)
# Annotator accuracies: 3 good (0.9), 4 medium (0.75), 3 noisy (0.6)
accuracies = [0.90]*3 + [0.75]*4 + [0.60]*3

annotations = {}
for i in range(N_ITEMS):
    anns_for_item = []
    chosen = rng.choice(N_ANNOTATORS, ANNS_PER_ITEM, replace=False)
    for a in chosen:
        acc = accuracies[a]
        label = true_labels[i] if rng.random() < acc else 1 - true_labels[i]
        anns_for_item.append((a, int(label)))
    annotations[i] = anns_for_item

# Run Dawid-Skene
soft_labels, confusion = dawid_skene_em(annotations, n_classes=2, n_iter=30)
ds_preds = {i: int(np.argmax(soft_labels[i])) for i in range(N_ITEMS)}

# Compare with majority vote
mv_preds = {}
for i in range(N_ITEMS):
    votes = [l for _, l in annotations[i]]
    mv_preds[i] = int(np.round(np.mean(votes)))

ds_acc = np.mean([ds_preds[i] == true_labels[i] for i in range(N_ITEMS)])
mv_acc = np.mean([mv_preds[i] == true_labels[i] for i in range(N_ITEMS)])

print(f"Majority vote accuracy:  {mv_acc:.3f}")
print(f"Dawid-Skene accuracy:    {ds_acc:.3f}")
print(f"\nEstimated annotator accuracies (diagonal of confusion matrix):")
for a in range(N_ANNOTATORS):
    est_acc = np.mean([confusion[a, k, k] for k in range(2)])
    print(f"  Annotator {a}: estimated={est_acc:.3f}, true={accuracies[a]:.2f}")
```

### MACE

Το **MACE (Multi-Annotator Competence Estimation)** {cite}`hovy2013learning` είναι ένα εναλλακτικό πιθανολογικό μοντέλο που αντιπροσωπεύει ρητά την αποστολή ανεπιθύμητων μηνυμάτων από σχολιαστές (τυχαία επισήμανση) έναντι ικανής σχολίασης. Ένας σχολιαστής είτε παρέχει μια ουσιαστική ετικέτα (με πιθανότητα $1 - \text{spam}_j$) είτε μια τυχαία ετικέτα (με πιθανότητα $\text{spam}_j$). Αυτό το μοντέλο δύο συστατικών είναι συχνά καλύτερα βαθμονομημένο από το Dawid-Skene για σενάρια crowdsourcing όπου ορισμένοι σχολιαστές είναι καθαροί spammers.

---

## Στρατηγική Πλεονασμού και Συνάθροισης

Ο βέλτιστος αριθμός σχολιαστών ανά στοιχείο εξαρτάται από τη δυσκολία εργασίας και την ποιότητα σχολιαστή:

- **Εύκολες εργασίες με ειδικευμένους σχολιαστές:** 1–2 σχολιαστές ανά στοιχείο είναι συχνά επαρκείς
- **Μέτριες εργασίες με εκπαιδευμένους σχολιαστές:** 3 σχολιαστές + ψηφοφορία πλειοψηφίας
- **Δύσκολες/υποκειμενικές εργασίες με εργαζόμενους crowdsourcing:** 5–7 σχολιαστές + Dawid-Skene

Η βασική διορατικότητα: ο πλεονασμός είναι πιο πολύτιμος όταν η ακρίβεια σχολιαστή είναι χαμηλή. Για σχολιαστές με ακρίβεια $p$, η ακρίβεια ψηφοφορίας πλειοψηφίας με $n$ σχολιαστές είναι:

$$
P(\text{MV correct}) = \sum_{k > n/2}^{n} \binom{n}{k} p^k (1-p)^{n-k}
$$

Για $p = 0.70$, η προσθήκη τρίτου σχολιαστή αυξάνει την ακρίβεια ψηφοφορίας πλειοψηφίας από 70% σε 78%· για $p = 0.90$, το κέρδος από τρίτο σχολιαστή είναι αμελητέο (από 90% σε 97%).

```{seealso}
Μοντέλο Dawid-Skene: {cite}`dawid1979maximum`. MACE: {cite}`hovy2013learning`. Για μια ολοκληρωμένη ανασκόπηση crowdsourcing για NLP: {cite}`snow2008cheap`. Ηθική πλήθους και δίκαιη αμοιβή: βλ. Κεφάλαιο 15.
```
