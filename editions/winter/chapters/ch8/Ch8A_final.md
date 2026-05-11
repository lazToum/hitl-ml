# Technical Appendix 8A: HITL System Architecture Patterns

*Formal patterns, pseudocode, and implementation considerations for production HITL systems*

---

## 8A.1 The Pipeline vs. Loop Distinction

### Formal Definition

A **HITL Pipeline** is a directed acyclic graph G = (V, E) where:
- V includes exactly one human review node H
- H receives input from a model node M
- H produces output consumed by a downstream process
- No path exists from any downstream node back to M

A **HITL Loop** is a directed graph G = (V, E) where:
- V includes at least one human review node H
- A path exists from H back to some component that influences future model behavior

The loop property is necessary but not sufficient for learning HITL systems. The path from H back to the model must also satisfy:
1. Human labels are available for integration into training
2. Labels are quality-filtered before integration
3. The training process is actually triggered periodically

### 8A.2 The Three-Zone Router

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
    tau_low: float          # Below this: auto-negative
    tau_high: float         # Above this: auto-positive
    capacity_fn: Callable   # Returns current reviewer capacity (0-1)
    max_review_rate: float  # Max fraction of cases to send to review
    
    # Dynamic adjustment parameters
    overflow_narrowing: float = 0.05  # Reduce band by this when overloaded
    underflow_widening: float = 0.03  # Expand band by this when underutilized

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
        Route a case based on score, current thresholds, and optional stakes override.
        
        Args:
            score: Model confidence score [0, 1]
            stakes: Optional high-stakes flag; if provided, narrows band toward human review
        """
        effective_tau_high = self.tau_high
        effective_tau_low = self.tau_low
        
        # High-stakes override: lower the bar for human review
        if stakes is not None and stakes > 0.8:
            effective_tau_high = self.tau_high * 0.7  # More cases go to review
            effective_tau_low = self.tau_low * 0.7
        
        if score >= effective_tau_high:
            return Disposition.AUTO_POSITIVE
        elif score <= effective_tau_low:
            return Disposition.AUTO_NEGATIVE
        else:
            return Disposition.HUMAN_REVIEW
    
    def adjust_for_capacity(self):
        """
        Dynamically adjust thresholds based on reviewer capacity.
        Called periodically by a monitoring process.
        """
        capacity = self.config.capacity_fn()  # 0 = fully overloaded, 1 = fully available
        
        if capacity < 0.3:  # Overloaded: narrow the band
            self.tau_low = min(self.tau_low + self.config.overflow_narrowing, 0.45)
            self.tau_high = max(self.tau_high - self.config.overflow_narrowing, 0.55)
        elif capacity > 0.8:  # Underutilized: widen the band
            self.tau_low = max(self.tau_low - self.config.underflow_widening, 
                               self.base_tau_low - 0.15)
            self.tau_high = min(self.tau_high + self.config.underflow_widening,
                                self.base_tau_high + 0.15)
```

---

## 8A.3 Active Learning Queue Implementation

```python
from dataclasses import dataclass, field
from typing import List, Tuple
import numpy as np
from heapq import heappush, heappop

@dataclass(order=True)
class LearningQueueItem:
    """
    An item in the active learning queue, ordered by learning value.
    Higher learning value items are prioritized for human review.
    """
    learning_value: float         # Negative for max-heap simulation
    score: float = field(compare=False)
    case_id: str = field(compare=False)
    features: np.ndarray = field(compare=False)
    
    def __post_init__(self):
        # Use negative for max-heap (heapq is min-heap by default)
        object.__setattr__(self, 'learning_value', -abs(self.learning_value))

class ActiveLearningQueue:
    """
    Priority queue that orders cases by learning value, not just uncertainty.
    
    Combines:
    - Uncertainty score (cases near decision boundary)
    - Diversity bonus (cases unlike those already in queue or labeled)
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
        Score high near 0.5, low near 0 or 1.
        Maximum uncertainty at score=0.5.
        """
        return 1 - abs(2 * score - 1)
    
    def _diversity_score(self, features: np.ndarray) -> float:
        """
        Estimate how different this case is from already-queued labeled data.
        Uses minimum distance to existing labeled examples.
        """
        if not self._labeled_embeddings:
            return 1.0  # Everything is diverse when nothing is labeled
        
        labeled = np.array(self._labeled_embeddings)
        dists = np.linalg.norm(labeled - features, axis=1)
        # Normalize: higher distance = higher diversity
        min_dist = dists.min()
        return min(min_dist / (min_dist + 1.0), 1.0)  # Normalize to [0,1]
    
    def add(self, case_id: str, score: float, features: np.ndarray):
        """Add a case to the priority queue."""
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
        
        # Prune if too large
        if len(self.heap) > self.max_size:
            self.heap = sorted(self.heap)[:self.max_size]
    
    def pop_top_k(self, k: int) -> List[LearningQueueItem]:
        """Get the k highest-learning-value cases for human review."""
        results = []
        for _ in range(min(k, len(self.heap))):
            item = heappop(self.heap)
            results.append(item)
            # Track for diversity calculation
            self._labeled_embeddings.append(item.features)
        return results
```

---

## 8A.4 Monitoring System Architecture

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
    Production monitoring for HITL system health.
    Tracks confidence distribution, review rates, and drift indicators.
    """
    
    def __init__(
        self,
        reference_confidence_dist: np.ndarray,  # Baseline confidence scores
        window_size: int = 1000,
        alert_thresholds: Optional[Dict] = None
    ):
        self.reference = reference_confidence_dist
        self.window_size = window_size
        self.confidence_window = deque(maxlen=window_size)
        self.override_window = deque(maxlen=window_size)
        self.history: List[MetricsSnapshot] = []
        
        self.thresholds = alert_thresholds or {
            'drift_pvalue': 0.01,       # Alert if KS test p < 0.01
            'ece_degradation': 0.05,    # Alert if ECE increases by > 0.05
            'override_rate_high': 0.30, # Alert if humans override > 30% of auto decisions
            'review_rate_high': 0.60,   # Alert if > 60% goes to human review
        }
    
    def record_prediction(
        self, 
        score: float, 
        disposition: str,
        human_override: Optional[bool] = None
    ):
        """Record a prediction event."""
        self.confidence_window.append(score)
        if human_override is not None:
            self.override_window.append(int(human_override))
    
    def check_health(self) -> Dict:
        """
        Run health checks and return dict of issues.
        """
        if len(self.confidence_window) < self.window_size // 2:
            return {'status': 'insufficient_data'}
        
        current = np.array(self.confidence_window)
        
        # Distribution drift check
        ks_stat, p_value = stats.ks_2samp(self.reference, current)
        
        issues = {}
        
        if p_value < self.thresholds['drift_pvalue']:
            issues['distribution_drift'] = {
                'severity': 'HIGH',
                'ks_stat': round(ks_stat, 4),
                'p_value': round(p_value, 6),
                'message': 'Confidence score distribution has significantly shifted from baseline'
            }
        
        # Override rate check
        if len(self.override_window) >= 50:
            override_rate = np.mean(list(self.override_window))
            if override_rate > self.thresholds['override_rate_high']:
                issues['high_override_rate'] = {
                    'severity': 'MEDIUM',
                    'override_rate': round(override_rate, 3),
                    'message': 'Human reviewers are overriding automated decisions at high rate — model may be drifting'
                }
        
        # Review rate check
        review_rate = sum(1 for s in self.confidence_window 
                         if 0.3 <= s <= 0.7) / len(self.confidence_window)
        if review_rate > self.thresholds['review_rate_high']:
            issues['high_review_rate'] = {
                'severity': 'LOW',
                'review_rate': round(review_rate, 3),
                'message': 'High fraction of cases going to human review — check model calibration'
            }
        
        return {'status': 'issues_detected' if issues else 'healthy', 'issues': issues}
```

---

## 8A.5 Exercises

**Exercise 8A.1:** Implement a feedback integration layer that ingests human labels from the review queue, quality-filters them using inter-annotator agreement scores, and triggers retraining when accumulated new labels exceed a threshold. What safeguards prevent bad labels from degrading the model?

**Exercise 8A.2:** Extend the ThreeZoneRouter to implement time-of-day threshold adjustment: lower the review band during business hours (more capacity) and narrow it during nights and weekends. How would you test whether this adjustment improves overall system performance?

**Exercise 8A.3:** Implement a detector for the "ghost reviewer" failure mode: a review queue that has been accumulating items without being processed. What metrics would indicate this? How would you design an alert that distinguishes reviewer absence from legitimate queue growth?

**Exercise 8A.4:** The monitoring system checks for distribution drift using a KS test. What are the limitations of the KS test for high-dimensional feature spaces? Propose an alternative monitoring approach using dimensionality reduction.

---
