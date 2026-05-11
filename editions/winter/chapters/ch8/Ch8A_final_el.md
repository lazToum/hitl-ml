# Τεχνικό Παράρτημα 8A: Πρότυπα Αρχιτεκτονικής Συστημάτων HITL

*Επίσημα πρότυπα, ψευδοκώδικας και ζητήματα υλοποίησης για συστήματα HITL παραγωγής*

---

## 8A.1 Η Διάκριση μεταξύ Διοχέτευσης και Βρόχου

### Επίσημος Ορισμός

Μια **Διοχέτευση HITL (HITL Pipeline)** είναι ένας κατευθυνόμενος άκυκλος γράφος G = (V, E) όπου:
- Το V περιλαμβάνει ακριβώς έναν κόμβο ανθρώπινου ελέγχου H.
- Ο H λαμβάνει είσοδο από έναν κόμβο μοντέλου M.
- Ο H παράγει έξοδο που καταναλώνεται από μια κατάντη (downstream) διεργασία.
- Δεν υπάρχει μονοπάτι από οποιονδήποτε κατάντη κόμβο πίσω στον M.

Ένας **Βρόχος HITL (HITL Loop)** είναι ένας κατευθυνόμενος γράφος G = (V, E) όπου:
- Το V περιλαμβάνει τουλάχιστον έναν κόμβο ανθρώπινου ελέγχου H.
- Υπάρχει ένα μονοπάτι από τον H πίσω σε κάποιο στοιχείο που επηρεάζει τη μελλοντική συμπεριφορά του μοντέλου.

Η ιδιότητα του βρόχου είναι απαραίτητη αλλά όχι επαρκής για συστήματα HITL που μαθαίνουν. Το μονοπάτι από τον H πίσω στο μοντέλο πρέπει επίσης να ικανοποιεί τα εξής:
1. Οι ανθρώπινες ετικέτες είναι διαθέσιμες για ενσωμάτωση στην εκπαίδευση.
2. Οι ετικέτες φιλτράρονται ποιοτικά πριν από την ενσωμάτωση.
3. Η διαδικασία εκπαίδευσης ενεργοποιείται όντως περιοδικά.

### 8A.2 Ο Δρομολογητής Τριών Ζωνών (Three-Zone Router)

```python
from dataclasses import dataclass
from enum import Enum
from typing import Optional, Callable
import numpy as np

class Disposition(Enum):
    AUTO_POSITIVE = "auto_positive"
    AUTO_NEGATIVE = "auto_negative"
    HUMAN_REVIEW = "human_review"

@dataclass
class RoutingConfig:
    tau_low: float          # Κάτω από αυτό: αυτόματη-αρνητική
    tau_high: float         # Πάνω από αυτό: αυτόματη-θετική
    capacity_fn: Callable   # Επιστρέφει την τρέχουσα χωρητικότητα σχολιαστών (0-1)
    max_review_rate: float  # Μέγιστο κλάσμα περιπτώσεων που στέλνονται για έλεγχο
    
    # Παράμετροι δυναμικής προσαρμογής
    overflow_narrowing: float = 0.05  # Μείωση ζώνης κατά αυτό όταν υπάρχει υπερφόρτωση
    underflow_widening: float = 0.03  # Διεύρυνση ζώνης κατά αυτό όταν υπάρχει υποχρησιμοποίηση

class ThreeZoneRouter:
    def __init__(self, config: RoutingConfig):
        self.config = config
        self.base_tau_low = config.tau_low
        self.base_tau_high = config.tau_high
        self.tau_low = config.tau_low
        self.tau_high = config.tau_high
        self._review_buffer = []
    
    def route(self, score: float, stakes: Optional[float] = None) -> Disposition:
        """
        Δρομολόγηση περίπτωσης με βάση το σκορ, τα τρέχοντα όρια και την προαιρετική παράκαμψη διακυβεύματος.
        
        Args:
            score: Σκορ εμπιστοσύνης μοντέλου [0, 1]
            stakes: Προαιρετική σημαία υψηλού διακυβεύματος· εάν παρέχεται, στενεύει τη ζώνη προς τον ανθρώπινο έλεγχο
        """
        effective_tau_high = self.tau_high
        effective_tau_low = self.tau_low
        
        # Παράκαμψη υψηλού διακυβεύματος: χαμηλώνει ο πήχης για ανθρώπινο έλεγχο
        if stakes is not None and stakes > 0.8:
            effective_tau_high = self.tau_high * 0.7  # Περισσότερες περιπτώσεις πάνε για έλεγχο
            effective_tau_low = self.tau_low * 0.7
        
        if score >= effective_tau_high:
            return Disposition.AUTO_POSITIVE
        elif score <= effective_tau_low:
            return Disposition.AUTO_NEGATIVE
        else:
            return Disposition.HUMAN_REVIEW
    
    def adjust_for_capacity(self):
        """
        Δυναμική προσαρμογή ορίων με βάση τη χωρητικότητα των σχολιαστών.
        Καλείται περιοδικά από μια διαδικασία παρακολούθησης.
        """
        capacity = self.config.capacity_fn()  # 0 = πλήρης υπερφόρτωση, 1 = πλήρως διαθέσιμοι
        
        if capacity < 0.3:  # Υπερφόρτωση: στένωση της ζώνης
            self.tau_low = min(self.tau_low + self.config.overflow_narrowing, 0.45)
            self.tau_high = max(self.tau_high - self.config.overflow_narrowing, 0.55)
        elif capacity > 0.8:  # Υποχρησιμοποίηση: διεύρυνση της ζώνης
            self.tau_low = max(self.tau_low - self.config.underflow_widening, 
                               self.base_tau_low - 0.15)
            self.tau_high = min(self.tau_high + self.config.underflow_widening,
                                self.base_tau_high + 0.15)
```

---

## 8A.3 Υλοποίηση Ουράς Ενεργού Μάθησης

```python
from dataclasses import dataclass, field
from typing import List, Tuple
import numpy as np
from heapq import heappush, heappop

@dataclass(order=True)
class LearningQueueItem:
    """
    Ένα αντικείμενο στην ουρά ενεργού μάθησης, ταξινομημένο κατά αξία μάθησης.
    Τα αντικείμενα με υψηλότερη αξία μάθησης έχουν προτεραιότητα για ανθρώπινο έλεγχο.
    """
    learning_value: float         # Αρνητικό για προσομοίωση max-heap
    score: float = field(compare=False)
    case_id: str = field(compare=False)
    features: np.ndarray = field(compare=False)
    
    def __post_init__(self):
        # Χρήση αρνητικού για max-heap (το heapq είναι min-heap από προεπιλογή)
        object.__setattr__(self, 'learning_value', -abs(self.learning_value))

class ActiveLearningQueue:
    """
    Ουρά προτεραιότητας που ταξινομεί τις περιπτώσεις κατά αξία μάθησης, όχι μόνο κατά αβεβαιότητα.
    
    Συνδυάζει:
    - Σκορ αβεβαιότητας (περιπτώσεις κοντά στο όριο απόφασης)
    - Μπόνους διαφορετικότητας (περιπτώσεις που δεν μοιάζουν με αυτές που βρίσκονται ήδη στην ουρά ή έχουν επισημανθεί)
    """
    
    def __init__(
        self, 
        uncertainty_weight: float = 0.7,
        diversity_weight: float = 0.3,
        max_size: int = 1000
    ):
        self.heap = []
        self.uncertainty_weight = uncertainty_weight
        self.diversity_weight = diversity_weight
        self.max_size = max_size
        self._labeled_embeddings = []
    
    def _uncertainty_score(self, score: float) -> float:
        """
        Υψηλό σκορ κοντά στο 0.5, χαμηλό κοντά στο 0 ή 1.
        Μέγιστη αβεβαιότητα στο score=0.5.
        """
        return 1 - abs(2 * score - 1)
    
    def _diversity_score(self, features: np.ndarray) -> float:
        """
        Εκτίμηση του πόσο διαφορετική είναι αυτή η περίπτωση από τα ήδη καταγεγραμμένα δεδομένα με ετικέτα.
        Χρησιμοποιεί την ελάχιστη απόσταση από υπάρχοντα παραδείγματα με ετικέτα.
        """
        if not self._labeled_embeddings:
            return 1.0  # Όλα είναι διαφορετικά όταν τίποτα δεν έχει ετικέτα
        
        labeled = np.array(self._labeled_embeddings)
        dists = np.linalg.norm(labeled - features, axis=1)
        # Κανονικοποίηση: υψηλότερη απόσταση = υψηλότερη διαφορετικότητα
        min_dist = dists.min()
        return min(min_dist / (min_dist + 1.0), 1.0)  # Κανονικοποίηση στο [0,1]
    
    def add(self, case_id: str, score: float, features: np.ndarray):
        """Προσθήκη περίπτωσης στην ουρά προτεραιότητας."""
        uncertainty = self._uncertainty_score(score)
        diversity = self._diversity_score(features)
        
        learning_value = (
            self.uncertainty_weight * uncertainty + 
            self.diversity_weight * diversity
        )
        
        item = LearningQueueItem(
            learning_value=learning_value,
            score=score,
            case_id=case_id,
            features=features
        )
        
        heappush(self.heap, item)
        
        # Περικοπή εάν είναι πολύ μεγάλη
        if len(self.heap) > self.max_size:
            self.heap = sorted(self.heap)[:self.max_size]
    
    def pop_top_k(self, k: int) -> List[LearningQueueItem]:
        """Λήψη των k περιπτώσεων με την υψηλότερη αξία μάθησης για ανθρώπινο έλεγχο."""
        results = []
        for _ in range(min(k, len(self.heap))):
            item = heappop(self.heap)
            results.append(item)
            # Καταγραφή για υπολογισμό διαφορετικότητας
            self._labeled_embeddings.append(item.features)
        return results
```

---

## 8A.4 Αρχιτεκτονική Συστήματος Παρακολούθησης

```python
from collections import deque
from dataclasses import dataclass, field
from datetime import datetime
from typing import Dict, List, Optional
import numpy as np
from scipy import stats

@dataclass
class MetricsSnapshot:
    timestamp: datetime
    mean_confidence: float
    std_confidence: float
    review_rate: float
    human_override_rate: float
    calibration_ece: float
    distribution_shift_stat: float

class HITLMonitor:
    """
    Παρακολούθηση παραγωγής για την υγεία του συστήματος HITL.
    Παρακολουθεί την κατανομή εμπιστοσύνης, τα ποσοστά ελέγχου και τους δείκτες διολίσθησης.
    """
    
    def __init__(
        self,
        reference_confidence_dist: np.ndarray,  # Βασικά σκορ εμπιστοσύνης (baseline)
        window_size: int = 1000,
        alert_thresholds: Optional[Dict] = None
    ):
        self.reference = reference_confidence_dist
        self.window_size = window_size
        self.confidence_window = deque(maxlen=window_size)
        self.override_window = deque(maxlen=window_size)
        self.history: List[MetricsSnapshot] = []
        
        self.thresholds = alert_thresholds or {
            'drift_pvalue': 0.01,       # Ειδοποίηση εάν KS test p < 0.01
            'ece_degradation': 0.05,    # Ειδοποίηση εάν το ECE αυξηθεί κατά > 0.05
            'override_rate_high': 0.30, # Ειδοποίηση εάν οι άνθρωποι παρακάμπτουν > 30% των αυτόματων αποφάσεων
            'review_rate_high': 0.60,   # Ειδοποίηση εάν > 60% πηγαίνει για ανθρώπινο έλεγχο
        }
    
    def record_prediction(
        self, 
        score: float, 
        disposition: str,
        human_override: Optional[bool] = None
    ):
        """Καταγραφή ενός γεγονότος πρόβλεψης."""
        self.confidence_window.append(score)
        if human_override is not None:
            self.override_window.append(int(human_override))
    
    def check_health(self) -> Dict:
        """
        Εκτέλεση ελέγχων υγείας και επιστροφή λεξικού με ζητήματα.
        """
        if len(self.confidence_window) < self.window_size // 2:
            return {'status': 'insufficient_data'}
        
        current = np.array(self.confidence_window)
        
        # Έλεγχος διολίσθησης κατανομής
        ks_stat, p_value = stats.ks_2samp(self.reference, current)
        
        issues = {}
        
        if p_value < self.thresholds['drift_pvalue']:
            issues['distribution_drift'] = {
                'severity': 'HIGH',
                'ks_stat': round(ks_stat, 4),
                'p_value': round(p_value, 6),
                'message': 'Η κατανομή του σκορ εμπιστοσύνης έχει μετατοπιστεί σημαντικά από τη βάση αναφοράς'
            }
        
        # Έλεγχος ποσοστού παράκαμψης
        if len(self.override_window) >= 50:
            override_rate = np.mean(list(self.override_window))
            if override_rate > self.thresholds['override_rate_high']:
                issues['high_override_rate'] = {
                    'severity': 'MEDIUM',
                    'override_rate': round(override_rate, 3),
                    'message': 'Οι ανθρώπινοι σχολιαστές παρακάμπτουν τις αυτόματες αποφάσεις με υψηλό ρυθμό — το μοντέλο μπορεί να διολισθαίνει'
                }
        
        # Έλεγχος ποσοστού ελέγχου
        review_rate = sum(1 for s in self.confidence_window 
                         if 0.3 <= s <= 0.7) / len(self.confidence_window)
        if review_rate > self.thresholds['review_rate_high']:
            issues['high_review_rate'] = {
                'severity': 'LOW',
                'review_rate': round(review_rate, 3),
                'message': 'Υψηλό κλάσμα περιπτώσεων που πηγαίνουν για ανθρώπινο έλεγχο — ελέγξτε τη βαθμονόμηση του μοντέλου'
            }
        
        return {'status': 'issues_detected' if issues else 'healthy', 'issues': issues}
```

---

## 8A.5 Ασκήσεις

**Άσκηση 8A.1:** Υλοποιήστε ένα επίπεδο ενσωμάτωσης ανατροφοδότησης που λαμβάνει ανθρώπινες ετικέτες από την ουρά ελέγχου, τις φιλτράρει ποιοτικά χρησιμοποιώντας βαθμολογίες συμφωνίας μεταξύ σχολιαστών (inter-annotator agreement) και ενεργοποιεί την επανεκπαίδευση όταν οι συσσωρευμένες νέες ετικέτες υπερβούν ένα όριο. Ποιες δικλείδες ασφαλείας εμποδίζουν τις κακές ετικέτες να υποβαθμίσουν το μοντέλο;

**Άσκηση 8A.2:** Επεκτείνετε τον ThreeZoneRouter για να υλοποιήσετε προσαρμογή ορίων ανάλογα με την ώρα της ημέρας: χαμηλώστε τη ζώνη ελέγχου κατά τις εργάσιμες ώρες (περισσότερη χωρητικότητα) και στενέψτε την κατά τις νύχτες και τα Σαββατοκύριακα. Πώς θα ελέγχατε εάν αυτή η προσαρμογή βελτιώνει τη συνολική απόδοση του συστήματος;

**Άσκηση 8A.3:** Υλοποιήστε έναν ανιχνευτή για τον τρόπο αποτυχίας του "σχολιαστή-φάντασμα": μια ουρά ελέγχου που συσσωρεύει αντικείμενα χωρίς να υποβάλλονται σε επεξεργασία. Ποιες μετρικές θα το υποδείκνυαν αυτό; Πώς θα σχεδιάζατε μια ειδοποίηση που να διακρίνει την απουσία σχολιαστή από τη νόμιμη αύξηση της ουράς;

**Άσκηση 8A.4:** Το σύστημα παρακολούθησης ελέγχει για διολίσθηση κατανομής χρησιμοποιώντας ένα τεστ KS. Ποιοι είναι οι περιορισμοί του τεστ KS για χώρους χαρακτηριστικών υψηλών διαστάσεων; Προτείνετε μια εναλλακτική προσέγγιση παρακολούθησης χρησιμοποιώντας μείωση διαστάσεων.

---
