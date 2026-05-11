# Technical Exercise Solutions 8A: HITL System Architecture Patterns

*Worked solutions for all Appendix 8A exercises*

---

## Exercise 8A.1 — Feedback Integration Layer with Quality Filtering

**Problem:** Implement a feedback integration layer that ingests human labels, quality-filters using inter-annotator agreement scores, and triggers retraining at a label accumulation threshold. Identify safeguards against bad labels.

### Full Implementation

```python
from dataclasses import dataclass, field
from typing import List, Dict, Optional, Tuple
from datetime import datetime
import numpy as np
from collections import defaultdict

@dataclass
class HumanLabel:
    """A single human label from the review queue."""
    case_id: str
    label: int                    # 0 or 1
    reviewer_id: str
    confidence: float             # Reviewer's self-reported confidence [0,1]
    timestamp: datetime
    review_time_seconds: float    # Time taken to review
    
    # Optional agreement context (populated if multiple reviewers)
    agreement_score: Optional[float] = None


class FeedbackIntegrationLayer:
    """
    Manages the flow from human review decisions to model retraining.
    
    Pipeline:
    1. Ingest labels from the review queue
    2. Quality-filter by inter-annotator agreement and reviewer history
    3. Accumulate until retraining threshold is reached
    4. Trigger retraining with quality-filtered labels
    """
    
    def __init__(
        self,
        retraining_threshold: int = 500,
        min_agreement_score: float = 0.70,
        min_reviewer_confidence: float = 0.50,
        max_review_speed: float = 5.0,      # seconds — too fast = likely not reading
        min_reviewer_track_record: float = 0.75,  # Historical accuracy
        retraining_callback=None,
    ):
        self.retraining_threshold = retraining_threshold
        self.min_agreement_score = min_agreement_score
        self.min_reviewer_confidence = min_reviewer_confidence
        self.max_review_speed = max_review_speed
        self.min_reviewer_track_record = min_reviewer_track_record
        self.retraining_callback = retraining_callback
        
        # Storage
        self.pending_labels: List[HumanLabel] = []        # Awaiting quality check
        self.approved_labels: List[HumanLabel] = []       # Quality-passed labels
        self.rejected_labels: List[HumanLabel] = []       # Failed quality check
        
        # Reviewer performance tracking
        self.reviewer_history: Dict[str, List[bool]] = defaultdict(list)
        self.reviewer_accuracy: Dict[str, float] = {}
        
        # Audit log
        self.audit_log: List[Dict] = []
        
    def ingest(self, label: HumanLabel):
        """Accept a new label from the review queue."""
        self.pending_labels.append(label)
        self._log_event('label_ingested', label.case_id, label.reviewer_id)
        
        # Check if we should process and potentially retrain
        if len(self.pending_labels) >= self.retraining_threshold // 2:
            self._process_pending_labels()
    
    def _quality_check(self, label: HumanLabel) -> Tuple[bool, str]:
        """
        Run quality checks on a single label.
        Returns (passes_check, reason).
        
        Safeguards:
        1. Agreement score check - reject if below threshold
        2. Speed check - reject suspiciously fast reviews (label mills)
        3. Reviewer confidence - reject very low confidence labels
        4. Reviewer track record - downweight or reject poor-history reviewers
        """
        # Check 1: Inter-annotator agreement
        if (label.agreement_score is not None and 
                label.agreement_score < self.min_agreement_score):
            return False, f"low_agreement:{label.agreement_score:.2f}"
        
        # Check 2: Review speed (suspiciously fast = likely not reading)
        if label.review_time_seconds < self.max_review_speed:
            return False, f"too_fast:{label.review_time_seconds:.1f}s"
        
        # Check 3: Reviewer confidence
        if label.confidence < self.min_reviewer_confidence:
            return False, f"low_reviewer_confidence:{label.confidence:.2f}"
        
        # Check 4: Reviewer track record (if we have enough history)
        reviewer_acc = self.reviewer_accuracy.get(label.reviewer_id)
        if reviewer_acc is not None and reviewer_acc < self.min_reviewer_track_record:
            return False, f"poor_track_record:{reviewer_acc:.2f}"
        
        return True, "passed"
    
    def _process_pending_labels(self):
        """Quality-filter all pending labels and move to approved/rejected."""
        for label in self.pending_labels:
            passes, reason = self._quality_check(label)
            if passes:
                self.approved_labels.append(label)
                self._log_event('label_approved', label.case_id, label.reviewer_id)
            else:
                self.rejected_labels.append(label)
                self._log_event('label_rejected', label.case_id, 
                               label.reviewer_id, details=reason)
        
        self.pending_labels.clear()
        
        # Trigger retraining if we have enough approved labels
        if len(self.approved_labels) >= self.retraining_threshold:
            self._trigger_retraining()
    
    def _trigger_retraining(self):
        """Pass quality-filtered labels to model retraining pipeline."""
        training_batch = self.approved_labels[:self.retraining_threshold]
        remaining = self.approved_labels[self.retraining_threshold:]
        
        self._log_event('retraining_triggered', 
                       details=f"batch_size:{len(training_batch)}")
        
        if self.retraining_callback:
            self.retraining_callback(training_batch)
        
        # Keep remaining approved labels for next retraining cycle
        self.approved_labels = remaining
        
    def update_reviewer_accuracy(self, reviewer_id: str, 
                                  correct_decisions: List[bool]):
        """
        Update reviewer's historical accuracy after outcomes are known.
        Called when ground truth becomes available (e.g., fraud confirmed/denied).
        """
        self.reviewer_history[reviewer_id].extend(correct_decisions)
        recent = self.reviewer_history[reviewer_id][-200:]  # Last 200 decisions
        self.reviewer_accuracy[reviewer_id] = sum(recent) / len(recent)
        
    def get_quality_report(self) -> Dict:
        """Summary statistics on label quality."""
        total_processed = len(self.approved_labels) + len(self.rejected_labels)
        if total_processed == 0:
            return {'status': 'no_labels_processed'}
        
        rejection_reasons = defaultdict(int)
        for label in self.rejected_labels:
            # Parse reason from audit log
            pass  # Simplified for space
        
        return {
            'approved': len(self.approved_labels),
            'rejected': len(self.rejected_labels),
            'approval_rate': len(self.approved_labels) / total_processed,
            'reviewer_accuracy_summary': {
                rid: acc for rid, acc in self.reviewer_accuracy.items()
            }
        }
    
    def _log_event(self, event_type: str, case_id: str = None, 
                   reviewer_id: str = None, details: str = None):
        self.audit_log.append({
            'timestamp': datetime.utcnow().isoformat(),
            'event': event_type,
            'case_id': case_id,
            'reviewer_id': reviewer_id,
            'details': details,
        })
```

### Key safeguards analysis

**Speed check:** Review times below 5 seconds reliably flag "label mill" behavior — reviewers who click through without reading. Calibrate this threshold using a pilot study where you know the minimum reasonable reading time for the task.

**Reviewer track record:** Ground truth for most tasks is available with delay (fraud: confirmed or not; content violations: appealed/upheld). Once available, update `reviewer_accuracy`. Reviewers below 75% accuracy on verifiable cases should have their labels downweighted or rejected until accuracy recovers.

**Agreement score:** For tasks where multiple reviewers process the same item, low inter-annotator agreement is the strongest signal of label noise. Agreement below 0.70 Krippendorff's alpha indicates the task definition may also be unclear — a signal to audit the guidelines, not just reject the labels.

**What this system does NOT prevent:** Systematic bias in reviewer judgment — where all reviewers have the same mistaken belief. This is why audit samples reviewed by senior annotators or domain experts are a necessary complement to these automated safeguards.

---

## Exercise 8A.2 — Time-of-Day Threshold Adjustment

**Problem:** Extend the ThreeZoneRouter with time-of-day adjustment. Test whether it improves overall system performance.

### Implementation

```python
from datetime import datetime, time as dt_time
from typing import Optional
import numpy as np
from dataclasses import dataclass

# Assuming ThreeZoneRouter from 8A.2 is available

class TemporalThreeZoneRouter:
    """
    ThreeZoneRouter with time-of-day adjustment.
    
    Business hours: wider review band (more human capacity)
    Off-hours: narrower review band (protect reviewer availability)
    """
    
    # Time windows and their multipliers on the review band width
    TIME_WINDOWS = [
        (dt_time(8, 0),  dt_time(18, 0),  1.20),   # Business hours: +20% band
        (dt_time(18, 0), dt_time(22, 0),  0.90),   # Evening: -10% band
        (dt_time(22, 0), dt_time(8, 0),   0.60),   # Night: -40% band (weekend-like)
    ]
    
    def __init__(self, base_tau_low: float = 0.35, base_tau_high: float = 0.65,
                 weekend_factor: float = 0.70):
        self.base_tau_low = base_tau_low
        self.base_tau_high = base_tau_high
        self.weekend_factor = weekend_factor
        self._review_count = 0
        self._total_count = 0
        
    def _get_band_multiplier(self, now: Optional[datetime] = None) -> float:
        if now is None:
            now = datetime.now()
        
        current_time = now.time()
        is_weekend = now.weekday() >= 5
        
        # Find time window
        for start, end, multiplier in self.TIME_WINDOWS:
            if start <= end:  # Normal window (doesn't cross midnight)
                if start <= current_time < end:
                    base_mult = multiplier
                    break
            else:  # Night window crosses midnight
                if current_time >= start or current_time < end:
                    base_mult = multiplier
                    break
        else:
            base_mult = 1.0
        
        return base_mult * (self.weekend_factor if is_weekend else 1.0)
    
    def _get_effective_thresholds(self, now: Optional[datetime] = None):
        mult = self._get_band_multiplier(now)
        band_center = (self.base_tau_low + self.base_tau_high) / 2
        band_half_width = (self.base_tau_high - self.base_tau_low) / 2 * mult
        return (
            max(0.1, band_center - band_half_width),
            min(0.9, band_center + band_half_width),
        )
    
    def route(self, score: float, now: Optional[datetime] = None,
              stakes: Optional[float] = None) -> str:
        tau_low, tau_high = self._get_effective_thresholds(now)
        
        # High-stakes override narrows the band toward review
        if stakes is not None and stakes > 0.8:
            tau_high = tau_high * 0.75
            tau_low = tau_low * 0.75
        
        self._total_count += 1
        if tau_low < score < tau_high:
            self._review_count += 1
            return "human_review"
        elif score >= tau_high:
            return "auto_positive"
        else:
            return "auto_negative"
    
    def review_rate(self) -> float:
        if self._total_count == 0:
            return 0.0
        return self._review_count / self._total_count


def backtest_temporal_router(scores, timestamps, true_labels,
                              human_accuracy=0.92,
                              auto_accuracy_fn=None):
    """
    Backtest temporal vs. static router.
    
    Measures:
    - Review rate by hour of day
    - Total system accuracy (auto-decides + human reviews)
    - Reviewer queue depth over time (proxy for workload)
    """
    if auto_accuracy_fn is None:
        # Auto-accuracy increases with model confidence
        auto_accuracy_fn = lambda score: 0.5 + 0.5 * abs(2 * score - 1)
    
    temporal = TemporalThreeZoneRouter()
    static_tau_low, static_tau_high = 0.35, 0.65
    
    results = {'temporal': {'correct': 0, 'total': 0, 'reviews': 0},
               'static': {'correct': 0, 'total': 0, 'reviews': 0}}
    
    for score, ts, true_label in zip(scores, timestamps, true_labels):
        # Temporal router
        decision = temporal.route(score, now=ts)
        if decision == "human_review":
            results['temporal']['reviews'] += 1
            correct = np.random.random() < human_accuracy
        else:
            correct = np.random.random() < auto_accuracy_fn(score)
        results['temporal']['correct'] += correct
        results['temporal']['total'] += 1
        
        # Static router
        if static_tau_low < score < static_tau_high:
            results['static']['reviews'] += 1
            correct = np.random.random() < human_accuracy
        else:
            correct = np.random.random() < auto_accuracy_fn(score)
        results['static']['correct'] += correct
        results['static']['total'] += 1
    
    for key in results:
        r = results[key]
        r['accuracy'] = r['correct'] / r['total']
        r['review_rate'] = r['reviews'] / r['total']
    
    return results
```

### Performance testing strategy

To verify the adjustment improves performance:

1. **A/B test in production**: Route even-timestamp cases through temporal router, odd through static. Measure reviewer queue depth, response time, and decision quality over 30 days.

2. **Key metrics to compare:**
   - Queue depth during off-hours (temporal router should show lower depth, meaning reviewers are not overwhelmed on Monday morning by overnight accumulation)
   - Decision error rate by time-of-day (temporal router should show more consistent error rates across time windows)
   - Reviewer throughput and quality metrics (are reviewers making better decisions when queues are appropriate to their capacity?)

3. **Expected result**: The temporal router reduces off-hours queue buildup by auto-routing more conservatively, at the cost of a small increase in error rate for those marginal cases. The net effect is positive if reviewer quality degradation from queue overwhelm exceeds the marginal auto-decision error.

---

## Exercise 8A.3 — Ghost Reviewer Detection

**Problem:** Detect the "ghost reviewer" failure mode — a review queue accumulating items without being processed.

### Implementation

```python
from collections import deque
from dataclasses import dataclass
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import numpy as np

@dataclass
class QueueSnapshot:
    timestamp: datetime
    queue_depth: int
    items_processed_since_last: int
    oldest_item_age_hours: float


class GhostReviewerDetector:
    """
    Detects the ghost reviewer failure mode:
    - Queue depth grows without processing
    - Processing rate drops below a sustainable baseline
    - Oldest item age exceeds SLA
    
    Distinguished from legitimate queue growth by:
    - Processing rate (ghost: zero; legitimate: positive but slower than inflow)
    - Time-of-day pattern (ghost: processing stops; legitimate: may slow)
    - Oldest item age (ghost: grows unbounded; legitimate: bounded by throughput)
    """
    
    def __init__(
        self,
        sla_max_age_hours: float = 4.0,          # SLA: nothing older than 4 hours
        min_processing_rate: float = 5.0,         # Minimum items/hour to be active
        ghost_detection_window_hours: float = 2.0, # Look back 2 hours
        alert_depth_threshold: int = 100,          # Alert if queue > 100 items
    ):
        self.sla_max_age_hours = sla_max_age_hours
        self.min_processing_rate = min_processing_rate
        self.ghost_detection_window = ghost_detection_window_hours
        self.alert_depth_threshold = alert_depth_threshold
        
        self.snapshots: deque = deque(maxlen=288)  # 48 hours at 10-min intervals
        self.queue: Dict[str, datetime] = {}        # item_id -> time_entered
        self.processed_log: List[Dict] = []
        
    def record_item_entered(self, item_id: str, timestamp: Optional[datetime] = None):
        if timestamp is None:
            timestamp = datetime.utcnow()
        self.queue[item_id] = timestamp
    
    def record_item_processed(self, item_id: str, 
                               timestamp: Optional[datetime] = None):
        if timestamp is None:
            timestamp = datetime.utcnow()
        if item_id in self.queue:
            age = (timestamp - self.queue[item_id]).total_seconds() / 3600
            del self.queue[item_id]
            self.processed_log.append({
                'item_id': item_id,
                'processed_at': timestamp,
                'age_hours': age,
            })
    
    def take_snapshot(self, timestamp: Optional[datetime] = None) -> QueueSnapshot:
        if timestamp is None:
            timestamp = datetime.utcnow()
        
        # Items processed since last snapshot
        last_snap_time = self.snapshots[-1].timestamp if self.snapshots else (
            timestamp - timedelta(minutes=10))
        recent_processed = sum(
            1 for p in self.processed_log 
            if p['processed_at'] > last_snap_time
        )
        
        # Age of oldest item
        if self.queue:
            oldest_entry = min(self.queue.values())
            oldest_age = (timestamp - oldest_entry).total_seconds() / 3600
        else:
            oldest_age = 0.0
        
        snap = QueueSnapshot(
            timestamp=timestamp,
            queue_depth=len(self.queue),
            items_processed_since_last=recent_processed,
            oldest_item_age_hours=oldest_age,
        )
        self.snapshots.append(snap)
        return snap
    
    def check_for_ghost(self, now: Optional[datetime] = None) -> Dict:
        """
        Analyze recent snapshots for ghost reviewer pattern.
        Returns alert dict if ghost pattern detected.
        """
        if now is None:
            now = datetime.utcnow()
        if not self.snapshots:
            return {'status': 'insufficient_data'}
        
        cutoff = now - timedelta(hours=self.ghost_detection_window)
        recent_snaps = [s for s in self.snapshots if s.timestamp >= cutoff]
        
        if len(recent_snaps) < 3:
            return {'status': 'insufficient_data'}
        
        # Metric 1: Processing rate over window
        total_processed = sum(s.items_processed_since_last for s in recent_snaps)
        window_hours = (recent_snaps[-1].timestamp - recent_snaps[0].timestamp
                       ).total_seconds() / 3600
        processing_rate = total_processed / max(window_hours, 0.01)
        
        # Metric 2: Queue depth trend
        depths = [s.queue_depth for s in recent_snaps]
        depth_trend = (depths[-1] - depths[0]) / max(len(depths), 1)
        
        # Metric 3: Oldest item age
        current_snap = recent_snaps[-1]
        
        issues = []
        severity = 'OK'
        
        # Ghost reviewer: queue growing AND processing rate near zero
        if (processing_rate < self.min_processing_rate and 
                depth_trend > 0 and 
                current_snap.queue_depth > 20):
            issues.append({
                'type': 'ghost_reviewer',
                'processing_rate': round(processing_rate, 2),
                'queue_depth': current_snap.queue_depth,
                'depth_trend': round(depth_trend, 2),
            })
            severity = 'CRITICAL'
        
        # SLA breach
        if current_snap.oldest_item_age_hours > self.sla_max_age_hours:
            issues.append({
                'type': 'sla_breach',
                'oldest_item_hours': round(current_snap.oldest_item_age_hours, 1),
                'sla_limit_hours': self.sla_max_age_hours,
            })
            severity = 'HIGH' if severity != 'CRITICAL' else 'CRITICAL'
        
        # Legitimate slow queue (not ghost)
        elif (current_snap.queue_depth > self.alert_depth_threshold and
              processing_rate > self.min_processing_rate):
            issues.append({
                'type': 'high_load',
                'queue_depth': current_snap.queue_depth,
                'processing_rate': round(processing_rate, 2),
                'message': 'Queue growing but processing active — consider adding reviewer capacity',
            })
            severity = 'MEDIUM' if severity == 'OK' else severity
        
        return {
            'status': severity,
            'processing_rate_per_hour': round(processing_rate, 2),
            'current_queue_depth': current_snap.queue_depth,
            'oldest_item_age_hours': round(current_snap.oldest_item_age_hours, 1),
            'issues': issues,
        }
```

### Key distinction: Ghost vs. legitimate queue growth

| Metric | Ghost Reviewer | Legitimate High Load |
|--------|---------------|---------------------|
| Processing rate | ≈ 0 items/hour | Positive, below inflow rate |
| Queue depth trend | Monotonically increasing | Increasing but with deceleration |
| Oldest item age | Growing unbounded | Bounded by throughput |
| Time-of-day pattern | Processing stops at specific time | Slower uniformly |

The ghost pattern is distinguished by *zero processing rate combined with growing queue*. High load shows positive processing — just slower than inflow. This distinction matters for the response: ghost reviewer requires contacting the assigned reviewer or escalating to a manager; high load requires provisioning additional reviewers or temporarily narrowing the routing band.

---

## Exercise 8A.4 — KS Test Limitations and Alternative Monitoring

**Problem:** Analyze KS test limitations for high-dimensional spaces and propose an alternative.

### KS Test Limitations

The two-sample Kolmogorov-Smirnov test checks:
$$H_0: F_\text{reference} = F_\text{current}$$
using the statistic $D = \sup_x |F_n(x) - F_m(x)|$.

**Limitation 1 — Univariate only:** The standard KS test operates on 1D distributions. For the confidence score distribution (1D), it is appropriate. For high-dimensional feature spaces (e.g., text embeddings of dimension 768), the test cannot be applied directly. Confidence scores collapse this high-dimensional space, potentially masking shift in important directions.

**Limitation 2 — Sensitivity to irrelevant variance:** In high-dimensional spaces, the KS test on individual feature dimensions may fire alerts for benign seasonal variation while missing structured semantic shifts.

**Limitation 3 — No directional information:** The test detects *that* a shift occurred but not *where* in the feature space or *which* subpopulations are most affected.

### Alternative: Dimensionality Reduction + Monitoring

```python
import numpy as np
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
from scipy import stats
from typing import Optional

class DimensionalityReducedDriftMonitor:
    """
    Monitors distribution shift by:
    1. Projecting high-dimensional features to 2D via PCA
    2. Fitting a 2D KDE to the reference distribution
    3. Detecting shift using MMD (Maximum Mean Discrepancy)
    4. Providing directional information about which semantic axes shifted
    """
    
    def __init__(
        self,
        n_components: int = 10,     # PCA components before MMD
        mmd_kernel_sigma: float = 1.0,
        alert_threshold: float = 0.05,
        reference_size: int = 2000,
    ):
        self.n_components = n_components
        self.sigma = mmd_kernel_sigma
        self.alert_threshold = alert_threshold
        self.reference_size = reference_size
        
        self.pca = PCA(n_components=n_components)
        self.scaler = StandardScaler()
        self.reference_projected: Optional[np.ndarray] = None
        
    def fit_reference(self, reference_features: np.ndarray):
        """Fit PCA on reference distribution."""
        scaled = self.scaler.fit_transform(reference_features)
        self.reference_projected = self.pca.fit_transform(scaled)
        # Subsample for efficiency
        idx = np.random.choice(len(self.reference_projected), 
                               min(self.reference_size, len(self.reference_projected)),
                               replace=False)
        self.reference_projected = self.reference_projected[idx]
        
    def _rbf_kernel(self, X: np.ndarray, Y: np.ndarray) -> np.ndarray:
        """Radial basis function kernel."""
        XX = np.sum(X**2, axis=1)[:, np.newaxis]
        YY = np.sum(Y**2, axis=1)[np.newaxis, :]
        dist_sq = XX + YY - 2 * X @ Y.T
        return np.exp(-dist_sq / (2 * self.sigma**2))
    
    def mmd_squared(self, X: np.ndarray, Y: np.ndarray) -> float:
        """
        Compute unbiased MMD^2 estimate.
        MMD = 0 iff X and Y have the same distribution.
        """
        n, m = len(X), len(Y)
        Kxx = self._rbf_kernel(X, X)
        Kyy = self._rbf_kernel(Y, Y)
        Kxy = self._rbf_kernel(X, Y)
        
        # Unbiased estimator
        np.fill_diagonal(Kxx, 0)
        np.fill_diagonal(Kyy, 0)
        
        return (Kxx.sum() / (n * (n-1)) + 
                Kyy.sum() / (m * (m-1)) - 
                2 * Kxy.mean())
    
    def check_drift(self, current_features: np.ndarray) -> Dict:
        """Check for drift vs. reference distribution."""
        if self.reference_projected is None:
            raise RuntimeError("Must call fit_reference() first")
        
        scaled = self.scaler.transform(current_features)
        current_projected = self.pca.transform(scaled)
        
        # Subsample for efficiency
        idx = np.random.choice(len(current_projected),
                               min(self.reference_size, len(current_projected)),
                               replace=False)
        current_sub = current_projected[idx]
        
        mmd2 = self.mmd_squared(self.reference_projected, current_sub)
        
        # Per-component analysis: KS test on each PCA component
        component_drifts = []
        for i in range(self.n_components):
            ks_stat, p_val = stats.ks_2samp(
                self.reference_projected[:, i], current_sub[:, i])
            component_drifts.append({
                'component': i,
                'variance_explained': self.pca.explained_variance_ratio_[i],
                'ks_stat': round(ks_stat, 4),
                'p_value': round(p_val, 6),
            })
        
        # Sort by explained variance to identify most impactful drifts
        top_drift_component = max(
            component_drifts, 
            key=lambda x: x['ks_stat'] * x['variance_explained']
        )
        
        return {
            'mmd_squared': round(mmd2, 6),
            'drift_detected': mmd2 > self.alert_threshold,
            'most_affected_component': top_drift_component,
            'all_component_drifts': component_drifts[:3],  # Top 3
        }
```

### Why MMD over KS for high-dimensional data

**MMD (Maximum Mean Discrepancy)** captures distributional differences in a kernel-induced feature space. Its key advantages:

1. Operates on multivariate distributions natively — no dimension-by-dimension decomposition required.
2. Captures higher-order distributional differences (covariance shift, not just mean shift).
3. Has theoretical guarantees: MMD = 0 if and only if the two distributions are identical.

**The PCA dimensionality reduction step** is essential for computational tractability (MMD scales quadratically with sample size) and for interpretability — the top PCA components can often be correlated with semantic dimensions of the data, allowing practitioners to understand *what* changed, not just *that* it changed.

The `most_affected_component` output tells system operators which semantic dimension is drifting most — whether it's a change in language formality, topic distribution, or demographic composition — enabling targeted investigation rather than a general "something changed" alert.
