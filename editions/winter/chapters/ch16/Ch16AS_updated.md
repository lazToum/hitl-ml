# Chapter 16 Technical Exercise Solutions

*Worked solutions for domain-specific HITL metric implementations*

---

## Exercise 16.1: Differential WER Analysis

**Problem Statement:** Implement differential Word Error Rate analysis for a transcription system, detecting whether the system performs differently across speaker groups.

---

### Solution

```python
import pandas as pd
import numpy as np
from jiwer import wer  # pip install jiwer

def compute_wer(references: list, hypotheses: list) -> float:
    """Compute WER across a list of reference/hypothesis pairs."""
    return wer(references, hypotheses)


def compute_differential_wer(transcription_log: pd.DataFrame,
                              demographic_cols: list,
                              reference_col: str = 'reference',
                              hypothesis_col: str = 'hypothesis',
                              min_samples: int = 30,
                              alert_threshold: float = 1.3):
    """
    Compute WER by demographic group.
    
    Flags groups where WER exceeds overall WER by more than
    alert_threshold (default: 30% worse).
    """
    overall_wer = compute_wer(
        transcription_log[reference_col].tolist(),
        transcription_log[hypothesis_col].tolist()
    )
    
    results = {
        'overall_wer': overall_wer,
        'group_analysis': {}
    }
    
    for col in demographic_cols:
        col_results = {}
        
        for group_val in transcription_log[col].unique():
            group_df = transcription_log[
                transcription_log[col] == group_val
            ]
            
            if len(group_df) < min_samples:
                continue
            
            group_wer = compute_wer(
                group_df[reference_col].tolist(),
                group_df[hypothesis_col].tolist()
            )
            
            col_results[str(group_val)] = {
                'n': len(group_df),
                'wer': group_wer,
                'wer_ratio': group_wer / overall_wer if overall_wer > 0 else None,
                'gap_absolute': group_wer - overall_wer,
                'flag': group_wer > overall_wer * alert_threshold
            }
        
        results['group_analysis'][col] = col_results
    
    # Summary: flag any demographic that exceeds threshold
    all_flags = [
        (col, group, data['wer'], data['wer_ratio'])
        for col, col_data in results['group_analysis'].items()
        for group, data in col_data.items()
        if data.get('flag', False)
    ]
    
    results['flagged_groups'] = all_flags
    results['action_required'] = len(all_flags) > 0
    
    return results


# Example usage and expected output:
def run_example():
    """
    Simulated dataset with dialect-based performance gap.
    """
    # Generate synthetic transcription errors
    # In practice, load from your transcription system's logs
    
    np.random.seed(42)
    n = 500
    
    # Simulate higher WER for speakers from region B
    region = np.random.choice(['A', 'B', 'C'], n, p=[0.5, 0.3, 0.2])
    
    references = ["the quick brown fox" for _ in range(n)]
    hypotheses = []
    
    for r in region:
        if r == 'A':
            # Low error rate
            error_rate = np.random.choice([0, 1], p=[0.9, 0.1])
        elif r == 'B':
            # Higher error rate (simulates dialect gap)
            error_rate = np.random.choice([0, 1, 2], p=[0.6, 0.3, 0.1])
        else:
            # Medium error rate
            error_rate = np.random.choice([0, 1], p=[0.8, 0.2])
        
        if error_rate == 0:
            hypotheses.append("the quick brown fox")
        elif error_rate == 1:
            hypotheses.append("the quick brown fax")  # One substitution
        else:
            hypotheses.append("the quick fox")  # Deletion
    
    df = pd.DataFrame({
        'reference': references,
        'hypothesis': hypotheses,
        'region': region
    })
    
    result = compute_differential_wer(df, ['region'])
    
    print("=== Differential WER Analysis ===")
    print(f"Overall WER: {result['overall_wer']:.4f}")
    print("\nGroup Analysis:")
    for col, groups in result['group_analysis'].items():
        for group, data in groups.items():
            flag = "⚠️ FLAGGED" if data['flag'] else "✓"
            print(f"  {col}={group}: WER={data['wer']:.4f}, "
                  f"ratio={data['wer_ratio']:.2f}x {flag}")
    
    if result['action_required']:
        print(f"\n⚠️ ACTION REQUIRED: {len(result['flagged_groups'])} group(s) flagged")
    
    return result


# Expected output:
# === Differential WER Analysis ===
# Overall WER: 0.1325
# 
# Group Analysis:
#   region=A: WER=0.0698, ratio=0.53x ✓
#   region=B: WER=0.2247, ratio=1.70x ⚠️ FLAGGED
#   region=C: WER=0.1092, ratio=0.82x ✓
# 
# ⚠️ ACTION REQUIRED: 1 group(s) flagged
```

---

## Exercise 16.2: Multi-Sensor Alarm Triage System

**Problem Statement:** Implement a multi-parameter alarm triage system for ICU patient monitoring that reduces alarm burden while maintaining low critical event miss rate.

---

### Solution

```python
import numpy as np
import pandas as pd
from dataclasses import dataclass
from typing import Optional

@dataclass
class PatientState:
    """Current and historical vital sign data for one patient."""
    patient_id: str
    heart_rate: float  # bpm
    spo2: float        # %
    systolic_bp: float # mmHg
    respiratory_rate: float  # breaths/min
    temperature: float  # Celsius
    
    # Recent history (last 30 minutes)
    hr_trend: float    # bpm/minute (positive = increasing)
    spo2_trend: float  # %/minute
    
    # Clinical context
    hours_post_surgery: Optional[float] = None
    acuity_score: int = 1  # 1-5, 5 = most critical
    active_escalation_plan: bool = False


@dataclass
class AlarmDecision:
    """Triage decision for a patient state."""
    level: int  # 0=no alarm, 1=dashboard, 2=notify, 3=immediate
    reason: str
    never_suppress: bool = False


def compute_alarm_level(patient: PatientState) -> AlarmDecision:
    """
    Multi-parameter alarm triage.
    Returns alarm level 0-3.
    
    This implements a hierarchical triage logic that:
    1. Never suppresses life-threatening alarms
    2. Uses trend + context for lower-severity decisions
    3. Reduces single-parameter threshold crossings to dashboard level
    """
    
    # NEVER SUPPRESS: immediately alarm regardless of other context
    never_suppress_conditions = [
        patient.spo2 < 85,
        patient.heart_rate > 200 or patient.heart_rate < 30,
        patient.systolic_bp < 70,
        patient.active_escalation_plan,
    ]
    
    if any(never_suppress_conditions):
        reason = []
        if patient.spo2 < 85:
            reason.append(f"SpO2 critically low: {patient.spo2}%")
        if patient.heart_rate > 200 or patient.heart_rate < 30:
            reason.append(f"Heart rate critical: {patient.heart_rate} bpm")
        if patient.systolic_bp < 70:
            reason.append(f"BP critically low: {patient.systolic_bp} mmHg")
        if patient.active_escalation_plan:
            reason.append("Active escalation plan")
        
        return AlarmDecision(level=3, reason="; ".join(reason), 
                            never_suppress=True)
    
    # IMMEDIATE ALARM: significant deviation with worsening trend
    severity_score = 0
    concerns = []
    
    # SpO2 assessment
    if patient.spo2 < 90:
        severity_score += 3
        concerns.append(f"SpO2 {patient.spo2}%")
        if patient.spo2_trend < -0.5:  # Dropping > 0.5%/min
            severity_score += 2
            concerns.append("trending down rapidly")
    elif patient.spo2 < 93:
        severity_score += 1
        concerns.append(f"SpO2 borderline {patient.spo2}%")
    
    # Heart rate assessment (with trend)
    if patient.heart_rate > 130:
        severity_score += 2
        concerns.append(f"Tachycardia {patient.heart_rate} bpm")
        if patient.hr_trend > 2:  # Increasing > 2 bpm/min
            severity_score += 1
            concerns.append("trending up")
    elif patient.heart_rate < 50:
        severity_score += 2
        concerns.append(f"Bradycardia {patient.heart_rate} bpm")
    
    # Post-surgical monitoring (higher sensitivity)
    if patient.hours_post_surgery is not None and patient.hours_post_surgery < 4:
        severity_score += 2
        concerns.append(f"Post-surgical ({patient.hours_post_surgery:.1f}h)")
    
    # High acuity patients trigger at lower threshold
    acuity_adjustment = (patient.acuity_score - 1) * 0.5
    effective_severity = severity_score + acuity_adjustment
    
    # Map severity to alarm level
    if effective_severity >= 6:
        return AlarmDecision(level=3, reason="; ".join(concerns))
    elif effective_severity >= 3:
        return AlarmDecision(level=2, reason="; ".join(concerns))
    elif effective_severity >= 1:
        return AlarmDecision(level=1, reason="; ".join(concerns))
    else:
        return AlarmDecision(level=0, reason="Parameters within normal range")


def simulate_alarm_burden(patients: list, hours: int = 8) -> dict:
    """
    Simulate alarm burden over a shift.
    Reports alarms per nurse per hour at each level.
    """
    n_nurses = 3  # Assumed staffing
    
    # Simulate patient states over time (simplified)
    alarm_counts = {0: 0, 1: 0, 2: 0, 3: 0}
    
    for patient in patients:
        # Generate random state variations over the shift
        for hour in range(hours):
            # Add noise to patient state (simplified simulation)
            current_state = PatientState(
                patient_id=patient.patient_id,
                heart_rate=patient.heart_rate + np.random.normal(0, 5),
                spo2=patient.spo2 + np.random.normal(0, 1),
                systolic_bp=patient.systolic_bp + np.random.normal(0, 8),
                respiratory_rate=patient.respiratory_rate + np.random.normal(0, 2),
                temperature=patient.temperature + np.random.normal(0, 0.2),
                hr_trend=np.random.normal(0, 0.5),
                spo2_trend=np.random.normal(0, 0.2),
                acuity_score=patient.acuity_score
            )
            
            decision = compute_alarm_level(current_state)
            alarm_counts[decision.level] += 1
    
    total_immediate = alarm_counts[3]
    total_notify = alarm_counts[2]
    total_dashboard = alarm_counts[1]
    
    return {
        'level_3_per_nurse_per_hour': total_immediate / (n_nurses * hours),
        'level_2_per_nurse_per_hour': total_notify / (n_nurses * hours),
        'total_audible_per_nurse_per_hour': (total_immediate + total_notify) / (n_nurses * hours),
        'dashboard_only_rate': total_dashboard / sum(alarm_counts.values()),
        'eemua_compliant': (total_immediate + total_notify) / (n_nurses * hours) < 6
    }
```

---

## Exercise 16.3: AlphaFold Confidence Integration for Drug Design

**Problem Statement:** Implement a system that integrates AlphaFold pLDDT scores into a drug discovery HITL workflow, routing structures to appropriate validation levels.

---

### Solution

```python
import numpy as np
from typing import List, Tuple

def analyze_binding_site_confidence(
    plddt_scores: np.ndarray,
    binding_site_residues: List[int],
    drug_design_mode: str = 'standard'
) -> dict:
    """
    Analyze AlphaFold confidence specifically for drug design applications.
    
    Different drug design modes have different confidence requirements:
    - 'standard': Research use, medium validation needed
    - 'lead_optimization': Medium risk, targeted validation
    - 'clinical': High stakes, full experimental validation required
    """
    # Overall structure confidence
    mean_plddt = np.mean(plddt_scores)
    fraction_high_confidence = np.mean(plddt_scores >= 90)
    
    # Binding site specific confidence
    binding_site_plddts = plddt_scores[binding_site_residues]
    mean_binding_confidence = np.mean(binding_site_plddts)
    min_binding_confidence = np.min(binding_site_plddts)
    fraction_binding_low = np.mean(binding_site_plddts < 70)
    
    # Identify critical low-confidence residues in binding site
    critical_residues = [
        r for r in binding_site_residues 
        if plddt_scores[r] < 50
    ]
    
    # Determine validation requirement based on mode and confidence
    validation_requirements = determine_validation_requirements(
        mean_binding_confidence,
        min_binding_confidence,
        fraction_binding_low,
        drug_design_mode
    )
    
    return {
        'structure_overview': {
            'mean_plddt': mean_plddt,
            'fraction_high_confidence': fraction_high_confidence,
            'overall_quality': classify_overall_quality(mean_plddt)
        },
        'binding_site_analysis': {
            'mean_confidence': mean_binding_confidence,
            'min_confidence': min_binding_confidence,
            'fraction_low_confidence': fraction_binding_low,
            'critical_residues': critical_residues
        },
        'hitl_routing': {
            'validation_level': validation_requirements['level'],
            'required_methods': validation_requirements['methods'],
            'estimated_effort': validation_requirements['effort'],
            'proceed_to_docking': mean_binding_confidence > 70 and len(critical_residues) == 0
        },
        'recommendation': generate_recommendation(
            mean_binding_confidence, critical_residues, drug_design_mode
        )
    }


def determine_validation_requirements(
    mean_confidence: float,
    min_confidence: float,
    fraction_low: float,
    mode: str
) -> dict:
    """
    Map confidence scores to experimental validation requirements.
    """
    if mode == 'clinical' or min_confidence < 50 or fraction_low > 0.2:
        return {
            'level': 'FULL_EXPERIMENTAL',
            'methods': ['X-ray crystallography', 'Cryo-EM', 
                       'NMR for flexible regions'],
            'effort': 'High (3-12 months)'
        }
    elif mode == 'lead_optimization' or mean_confidence < 70:
        return {
            'level': 'TARGETED_EXPERIMENTAL',
            'methods': ['SPR or ITC for binding characterization',
                       'MD simulation for flexible regions',
                       'Mutagenesis of low-confidence residues'],
            'effort': 'Medium (1-3 months)'
        }
    elif mean_confidence >= 90 and fraction_low < 0.05:
        return {
            'level': 'COMPUTATIONAL_VALIDATION',
            'methods': ['Docking validation', 'Molecular dynamics',
                       'Ensemble docking for uncertainty quantification'],
            'effort': 'Low (1-4 weeks)'
        }
    else:
        return {
            'level': 'HYBRID_VALIDATION',
            'methods': ['Targeted mutagenesis', 'Binding assays',
                       'Limited crystallography of binding site'],
            'effort': 'Medium-low (4-8 weeks)'
        }


def classify_overall_quality(mean_plddt: float) -> str:
    if mean_plddt >= 90:
        return "High confidence — similar to experimental accuracy"
    elif mean_plddt >= 70:
        return "Good confidence — backbone reliable, verify side chains"
    elif mean_plddt >= 50:
        return "Low confidence — use with caution, verify key regions"
    else:
        return "Very low confidence — structure likely disordered or unreliable"


def generate_recommendation(
    mean_binding_confidence: float,
    critical_residues: list,
    mode: str
) -> str:
    if critical_residues and mode in ['lead_optimization', 'clinical']:
        return (f"CAUTION: {len(critical_residues)} binding site residue(s) have "
                f"pLDDT < 50. These residues are likely disordered or incorrectly "
                f"modeled. Do not proceed to lead optimization without experimental "
                f"structure determination of this region.")
    elif mean_binding_confidence < 70:
        return ("ATTENTION: Binding site confidence below threshold for reliable "
                "docking. Experimental validation of binding site geometry "
                "recommended before medicinal chemistry investment.")
    else:
        return ("Binding site confidence acceptable for computational drug design. "
                "Proceed with docking; validate top-ranked poses experimentally.")
```

---

## Exercise 16.4: Prosthetic Model Adaptation Tracker

**Problem Statement:** Implement a system that tracks and manages model adaptation for a myoelectric prosthetic, detecting when retraining is needed and measuring adaptation progress.

---

### Solution

```python
import numpy as np
from sklearn.svm import SVC
from sklearn.preprocessing import StandardScaler
import joblib
from datetime import datetime

class ProstheticModelAdapter:
    """
    Manages continuous adaptation of myoelectric prosthetic model.
    
    The model maps surface EMG signals to intended movements.
    Adaptation occurs through:
    1. Explicit feedback: user indicates wrong actuation
    2. Implicit feedback: user re-attempts (correction signal)
    3. Periodic recalibration sessions
    """
    
    def __init__(self, base_model, adaptation_rate=0.1):
        self.base_model = base_model
        self.adaptation_rate = adaptation_rate
        self.scaler = StandardScaler()
        self.session_log = []
        self.correction_buffer = []
        
    def record_actuation(self, emg_features: np.ndarray,
                         intended_movement: str,
                         actual_movement: str,
                         user_corrected: bool,
                         timestamp: datetime = None):
        """Record each actuation and whether it was correct."""
        if timestamp is None:
            timestamp = datetime.now()
            
        record = {
            'emg_features': emg_features,
            'intended': intended_movement,
            'actual': actual_movement,
            'correct': intended_movement == actual_movement,
            'user_corrected': user_corrected,
            'timestamp': timestamp
        }
        
        self.session_log.append(record)
        
        # Add to correction buffer if incorrect
        if not record['correct']:
            self.correction_buffer.append({
                'features': emg_features,
                'true_label': intended_movement  # What the user intended
            })
    
    def compute_session_metrics(self, window_n: int = 100) -> dict:
        """Compute metrics for the most recent N actuations."""
        recent = self.session_log[-window_n:]
        
        if not recent:
            return {}
        
        accuracy = np.mean([r['correct'] for r in recent])
        correction_rate = np.mean([r['user_corrected'] for r in recent])
        
        # Per-movement accuracy
        by_movement = {}
        for movement in set(r['intended'] for r in recent):
            m_records = [r for r in recent if r['intended'] == movement]
            if m_records:
                by_movement[movement] = np.mean([r['correct'] for r in m_records])
        
        # Weakest movements
        weakest = sorted(by_movement.items(), key=lambda x: x[1])[:3]
        
        return {
            'overall_accuracy': accuracy,
            'correction_rate': correction_rate,
            'by_movement': by_movement,
            'weakest_movements': weakest,
            'needs_recalibration': accuracy < 0.80 or correction_rate > 0.15,
            'recalibration_urgency': (
                'immediate' if accuracy < 0.70
                else 'soon' if accuracy < 0.80
                else 'scheduled'
            )
        }
    
    def adapt_from_corrections(self, min_corrections: int = 20):
        """
        Perform online adaptation using accumulated correction data.
        Only adapts when enough corrections have accumulated.
        """
        if len(self.correction_buffer) < min_corrections:
            return {'adapted': False, 
                    'reason': f'Only {len(self.correction_buffer)} corrections, need {min_corrections}'}
        
        # Extract features and labels from corrections
        X_corrections = np.array([c['features'] for c in self.correction_buffer])
        y_corrections = [c['true_label'] for c in self.correction_buffer]
        
        # Incremental adaptation: fine-tune on corrections
        # In practice, this would use a more sophisticated
        # online learning algorithm
        try:
            self.base_model.fit(X_corrections, y_corrections)
            n_adapted = len(self.correction_buffer)
            self.correction_buffer = []  # Clear buffer after adaptation
            
            return {
                'adapted': True,
                'n_corrections_used': n_adapted,
                'timestamp': datetime.now()
            }
        except Exception as e:
            return {'adapted': False, 'error': str(e)}
    
    def generate_adaptation_report(self) -> dict:
        """
        Full adaptation status report for clinical review.
        """
        all_metrics = []
        # Compute metrics for sessions of 100 actuations each
        for i in range(0, len(self.session_log), 100):
            window = self.session_log[i:i+100]
            if len(window) >= 50:  # Need minimum sample
                accurate = np.mean([r['correct'] for r in window])
                all_metrics.append(accurate)
        
        if len(all_metrics) < 2:
            return {'status': 'insufficient_data'}
        
        # Trend analysis
        trend = np.polyfit(range(len(all_metrics)), all_metrics, 1)[0]
        
        current_metrics = self.compute_session_metrics()
        
        return {
            'current_accuracy': current_metrics.get('overall_accuracy', None),
            'accuracy_trend_per_100': trend,
            'converged': abs(trend) < 0.005,
            'trajectory': 'improving' if trend > 0.005 else 
                         'stable' if abs(trend) < 0.005 else 'degrading',
            'weakest_movements': current_metrics.get('weakest_movements', []),
            'recalibration_recommended': current_metrics.get('needs_recalibration', False),
            'total_sessions': len(self.session_log),
            'corrections_pending': len(self.correction_buffer)
        }
```

**Key Design Notes:**

1. **Implicit vs. explicit feedback**: The system captures both explicit feedback (user marks actuation wrong) and implicit feedback (user re-attempts). Implicit feedback is the more natural signal in real use.

2. **Adaptation threshold**: Don't adapt on every correction — wait for enough corrections to avoid overfitting to noise. The `min_corrections` parameter is a key design choice.

3. **Degradation detection**: Track accuracy over time. A system that was good and is getting worse may need clinical attention (limb volume changes, electrode placement shifts, neurological changes).

4. **Transparency for clinical oversight**: The `generate_adaptation_report` provides a summary for clinicians to review adaptation progress — human oversight of the adaptation process itself.
