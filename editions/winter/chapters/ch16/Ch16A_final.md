# Chapter 16 Technical Appendix: Domain-Specific HITL Metrics

*Measurement frameworks for audio, time-series, scientific discovery, and physical systems*

---

## Overview

Standard HITL metrics — precision, recall, review rate, reviewer agreement — are designed for static text/image classification. This appendix develops metric frameworks for each of the four domains covered in Chapter 16. Each domain has failure modes and evaluation requirements that standard metrics do not capture.

---

## 1. Audio and Speech HITL Metrics

### 1.1 Transcription Quality with Demographic Slicing

**Word Error Rate (WER)** is the standard transcription metric:

$$WER = \frac{S + D + I}{N}$$

where $S$ is substitutions, $D$ is deletions, $I$ is insertions, and $N$ is the number of words in the reference transcript.

For HITL audit purposes, WER must be computed by **speaker demographics** (not just in aggregate). Differential WER by dialect, accent, or demographic group is the key signal for annotation bias in transcription systems.

```python
def differential_wer_analysis(transcription_log, demographic_col):
    """
    Compute WER by demographic group.
    Flag groups where WER exceeds overall WER by > threshold.
    """
    results = {}
    overall_wer = compute_wer(
        transcription_log['reference'], 
        transcription_log['hypothesis']
    )
    
    for group in transcription_log[demographic_col].unique():
        group_df = transcription_log[transcription_log[demographic_col] == group]
        group_wer = compute_wer(group_df['reference'], group_df['hypothesis'])
        results[group] = {
            'wer': group_wer,
            'gap_from_overall': group_wer - overall_wer,
            'n': len(group_df),
            'flag': group_wer > overall_wer * 1.3  # 30% worse than average
        }
    
    return results
```

### 1.2 Annotation Correction Drift

For detecting dialect bias in reviewer corrections:

```python
def detect_correction_bias(correction_log, speaker_dialect_col):
    """
    Detect whether reviewers correct informal dialect features
    (gonna, wanna, ain't) to formal equivalents at different rates
    by speaker group.
    
    A correction is 'informal-to-formal' if it replaces a phonologically
    standard transcription with a formal alternative.
    """
    correction_log['is_style_correction'] = correction_log.apply(
        lambda row: row['correction_type'] == 'informal_to_formal',
        axis=1
    )
    
    style_correction_rates = correction_log.groupby(
        speaker_dialect_col
    )['is_style_correction'].mean()
    
    # Flag if any group has >2x the rate of another
    max_rate = style_correction_rates.max()
    min_rate = style_correction_rates.min()
    
    return {
        'rates': style_correction_rates.to_dict(),
        'disparity_ratio': max_rate / min_rate if min_rate > 0 else None,
        'bias_detected': max_rate / min_rate > 2.0 if min_rate > 0 else False
    }
```

### 1.3 Diarization Quality Metrics

Speaker diarization is evaluated with **Diarization Error Rate (DER)**:

$$DER = \frac{\text{Missed Speech} + \text{False Alarm Speech} + \text{Speaker Confusion}}{\text{Total Reference Speech Time}}$$

For HITL audit of legal and medical diarization:
- **Attribution precision**: For each attributed speaker segment, is the attribution correct?
- **Confidence-attribution correlation**: Do high-confidence attributions have higher precision than low-confidence ones? (Required for confidence-based routing to human review)

```python
def diarization_confidence_analysis(diarization_output, ground_truth):
    """
    Assess whether diarization confidence correlates with accuracy.
    If it doesn't, confidence cannot be used for HITL routing.
    """
    results = []
    for segment in diarization_output:
        is_correct = (
            segment['predicted_speaker'] == 
            ground_truth.get_speaker_at_time(segment['start'], segment['end'])
        )
        results.append({
            'confidence': segment['confidence'],
            'correct': is_correct
        })
    
    df = pd.DataFrame(results)
    
    # Bin by confidence and compute precision per bin
    df['confidence_bin'] = pd.cut(df['confidence'], bins=10)
    calibration = df.groupby('confidence_bin')['correct'].mean()
    
    # Compute correlation between confidence and correctness
    correlation = df['confidence'].corr(df['correct'].astype(float))
    
    return {
        'calibration_by_confidence': calibration.to_dict(),
        'confidence_accuracy_correlation': correlation,
        'usable_for_hitl_routing': correlation > 0.5
    }
```

### 1.4 Crisis Detection: Multimodal Disagreement as Escalation Signal

```python
def compute_escalation_signal(text_risk_score, prosody_risk_score,
                               disagreement_threshold=0.3):
    """
    When text and prosody models disagree by more than threshold,
    escalate to human review regardless of individual scores.
    
    This captures the 'Marcus scenario': text says safe, prosody says
    concerning.
    """
    disagreement = abs(text_risk_score - prosody_risk_score)
    
    # Combined risk (weighted by modality reliability)
    # Weights should be domain-tuned; this is illustrative
    combined_risk = 0.4 * text_risk_score + 0.6 * prosody_risk_score
    
    should_escalate = (
        combined_risk > 0.6 or
        disagreement > disagreement_threshold or
        prosody_risk_score > 0.7  # High prosodic risk always escalates
    )
    
    return {
        'combined_risk': combined_risk,
        'modality_disagreement': disagreement,
        'should_escalate': should_escalate,
        'escalation_reason': (
            'combined_risk' if combined_risk > 0.6 else
            'modality_disagreement' if disagreement > disagreement_threshold else
            'high_prosodic_risk' if prosody_risk_score > 0.7 else
            'none'
        )
    }
```

---

## 2. Time-Series and Sensor Data HITL Metrics

### 2.1 Alarm Quality Metrics

For industrial IoT and patient monitoring, the core metrics are:

**Alarm Precision**: Of all alarms generated, what fraction were genuine anomalies requiring human intervention?
$$\text{Alarm Precision} = \frac{\text{True Alarms}}{\text{True Alarms} + \text{False Alarms}}$$

**Actionability Rate**: Of alarms reviewed by a human, what fraction resulted in an actual intervention?

**Alarm Burden**: Average number of alarms per operator per hour. Industry standards suggest alarm burden above 6–12 per hour per operator leads to significant alarm fatigue in process industries.

**Critical Alarm Miss Rate**: Of genuine anomalies requiring intervention, what fraction did the system fail to alarm on?

```python
def compute_alarm_quality_metrics(alarm_log, operator_log):
    """
    Compute full alarm quality report for industrial HITL system.
    """
    total_alarms = len(alarm_log)
    true_alarms = alarm_log['requires_intervention'].sum()
    false_alarms = total_alarms - true_alarms
    
    # Alarm precision
    precision = true_alarms / total_alarms if total_alarms > 0 else 0
    
    # Actionability rate (human actually did something)
    actioned = operator_log['action_taken'].sum()
    actionability = actioned / len(operator_log) if len(operator_log) > 0 else 0
    
    # Alarm burden (per operator per hour)
    total_operator_hours = operator_log['shift_duration_hours'].sum()
    burden = total_alarms / total_operator_hours if total_operator_hours > 0 else 0
    
    # Critical miss rate
    all_incidents = get_actual_incidents(alarm_log.index.min(), 
                                         alarm_log.index.max())
    missed = len([i for i in all_incidents if not alarm_log_contains_alarm_near(i)])
    critical_miss_rate = missed / len(all_incidents) if len(all_incidents) > 0 else 0
    
    return {
        'alarm_precision': precision,
        'actionability_rate': actionability,
        'alarm_burden_per_operator_hour': burden,
        'critical_miss_rate': critical_miss_rate,
        'alarm_fatigue_risk': burden > 10,  # EEMUA 191 threshold
        'assessment': interpret_alarm_quality(precision, burden, critical_miss_rate)
    }
```

### 2.2 Temporal Uncertainty Quantification

For time-series anomaly detection, uncertainty must be estimated in the temporal domain:

```python
def temporal_uncertainty_estimate(model, time_series, 
                                   context_window=60,
                                   forecast_horizon=10,
                                   n_samples=100):
    """
    Monte Carlo estimate of uncertainty for time-series prediction.
    
    Uncertainty is higher:
    - At discontinuities in the input signal
    - When the context window contains unusual patterns
    - When multiple sensors show conflicting readings
    """
    # Collect predictions with dropout enabled (MC Dropout)
    predictions = []
    model.train()  # Enable dropout
    for _ in range(n_samples):
        pred = model(time_series[-context_window:])
        predictions.append(pred)
    model.eval()
    
    predictions = torch.stack(predictions)
    mean_pred = predictions.mean(dim=0)
    uncertainty = predictions.std(dim=0)
    
    # Time-specific context: higher uncertainty near recent changepoints
    changepoint_proximity = detect_recent_changepoints(
        time_series[-context_window:]
    )
    context_adjustment = 1 + 0.5 * changepoint_proximity
    
    return {
        'mean_prediction': mean_pred,
        'epistemic_uncertainty': uncertainty * context_adjustment,
        'escalation_threshold': mean_pred + 2.5 * uncertainty * context_adjustment
    }
```

### 2.3 Multi-Sensor Fusion and Disagreement Detection

```python
def multi_sensor_disagreement_score(sensor_readings: dict, 
                                    physical_model_predictions: dict):
    """
    Compute disagreement score across sensors and between sensors
    and physical model predictions.
    
    High disagreement -> escalate to human operator regardless of
    individual sensor confidence.
    """
    sensor_names = list(sensor_readings.keys())
    n_sensors = len(sensor_names)
    
    # Pairwise sensor disagreement (normalized)
    disagreements = []
    for i in range(n_sensors):
        for j in range(i + 1, n_sensors):
            s_i = sensor_readings[sensor_names[i]]
            s_j = sensor_readings[sensor_names[j]]
            # Normalize by expected correlation range
            disagreements.append(
                abs(s_i - s_j) / max(abs(s_i), abs(s_j), 1e-8)
            )
    
    sensor_disagreement = np.mean(disagreements) if disagreements else 0
    
    # Model vs. sensor disagreement
    model_disagreements = []
    for sensor_name, reading in sensor_readings.items():
        if sensor_name in physical_model_predictions:
            predicted = physical_model_predictions[sensor_name]
            model_disagreements.append(
                abs(reading - predicted) / max(abs(predicted), 1e-8)
            )
    
    model_disagreement = np.mean(model_disagreements) if model_disagreements else 0
    
    combined_score = 0.6 * sensor_disagreement + 0.4 * model_disagreement
    
    return {
        'sensor_disagreement': sensor_disagreement,
        'model_disagreement': model_disagreement,
        'combined_score': combined_score,
        'escalate_to_human': combined_score > 0.25
    }
```

---

## 3. Scientific Discovery HITL Metrics

### 3.1 AlphaFold Confidence Integration

For protein structure prediction workflows:

```python
def evaluate_alphafold_confidence_regions(plddt_scores, 
                                           confidence_thresholds=None):
    """
    Classify regions of a predicted protein structure by confidence.
    High: pLDDT > 90 — generally reliable
    Medium: 70-90 — backbone reliable, side chains uncertain  
    Low: 50-70 — may be correct, verify
    Very low: < 50 — likely disordered or unreliable
    
    Returns recommended experimental validation priority.
    """
    if confidence_thresholds is None:
        confidence_thresholds = {
            'high': 90, 'medium': 70, 'low': 50
        }
    
    residue_classifications = []
    for i, score in enumerate(plddt_scores):
        if score >= confidence_thresholds['high']:
            classification = 'high_confidence'
            validation_priority = 'low'
        elif score >= confidence_thresholds['medium']:
            classification = 'medium_confidence'
            validation_priority = 'medium'
        elif score >= confidence_thresholds['low']:
            classification = 'low_confidence'
            validation_priority = 'high'
        else:
            classification = 'very_low_confidence'
            validation_priority = 'critical'
        
        residue_classifications.append({
            'residue_index': i,
            'plddt': score,
            'classification': classification,
            'validation_priority': validation_priority
        })
    
    # Summary statistics
    df = pd.DataFrame(residue_classifications)
    
    return {
        'residue_details': df,
        'fraction_high_confidence': (df['classification'] == 'high_confidence').mean(),
        'critical_regions': df[df['validation_priority'] == 'critical']['residue_index'].tolist(),
        'hitl_recommendation': generate_validation_protocol(df)
    }


def generate_validation_protocol(classification_df):
    """
    Generate recommendation for experimental validation effort.
    """
    frac_critical = (classification_df['validation_priority'] == 'critical').mean()
    frac_high = (classification_df['validation_priority'] == 'high').mean()
    
    if frac_critical > 0.2:
        return "HIGH VALIDATION EFFORT: >20% of residues in critical regions. Crystallographic or cryo-EM validation recommended before drug design use."
    elif frac_high + frac_critical > 0.3:
        return "MEDIUM VALIDATION EFFORT: Significant uncertain regions. Validate active site residues experimentally."
    else:
        return "LOW VALIDATION EFFORT: High-confidence structure overall. Spot-check key functional residues."
```

### 3.2 Bayesian Optimization Loop Metrics

For materials science and drug discovery optimization:

```python
def evaluate_bayesian_optimization_loop(optimization_history):
    """
    Metrics for evaluating a Bayesian optimization HITL loop.
    """
    df = pd.DataFrame(optimization_history)
    
    # Regret: difference between best possible and what we found
    # (requires knowing the true optimum, use proxy if unavailable)
    best_found = df['objective'].max()
    
    # Convergence rate: how many iterations to reach 90% of best value?
    threshold = 0.9 * best_found
    convergence_iter = df[df['objective'] >= threshold].index.min()
    
    # Human override rate: how often did researchers deviate from
    # model suggestion?
    override_rate = (df['human_overrode_suggestion'] == True).mean()
    
    # Override quality: when humans overrode, was their choice better?
    overrides = df[df['human_overrode_suggestion'] == True]
    suggestions = df[df['human_overrode_suggestion'] == False]
    
    if len(overrides) > 0 and len(suggestions) > 0:
        override_avg_improvement = overrides['objective'].mean()
        suggestion_avg_improvement = suggestions['objective'].mean()
        human_value_add = override_avg_improvement - suggestion_avg_improvement
    else:
        human_value_add = None
    
    # Data quality issues flagged by human
    data_quality_flags = df['human_flagged_data_quality'].sum()
    
    return {
        'best_objective': best_found,
        'convergence_iteration': convergence_iter,
        'human_override_rate': override_rate,
        'human_value_add_vs_model': human_value_add,
        'data_quality_flags': data_quality_flags,
        'efficiency_assessment': (
            'High human value-add' if human_value_add and human_value_add > 0.1 
            else 'Model-driven' if human_value_add and human_value_add < -0.05
            else 'Comparable'
        )
    }
```

---

## 4. Robotics and Physical Systems HITL Metrics

### 4.1 Shared Autonomy Metrics

```python
def compute_shared_autonomy_metrics(session_log):
    """
    Metrics for shared autonomy systems (wheelchairs, robotic arms,
    semi-autonomous vehicles).
    """
    df = pd.DataFrame(session_log)
    
    # Task completion rate
    completion_rate = df['task_completed'].mean()
    
    # Human intervention rate: fraction of time where human overrides
    # autonomous component
    intervention_rate = df['human_intervened'].mean()
    
    # Intervention quality: did human interventions improve outcomes?
    interventions = df[df['human_intervened'] == True]
    non_interventions = df[df['human_intervened'] == False]
    
    if len(interventions) > 0:
        intervention_success = interventions['task_completed'].mean()
        baseline_success = non_interventions['task_completed'].mean()
        intervention_value = intervention_success - baseline_success
    else:
        intervention_value = None
    
    # Uncertainty-intervention correlation:
    # System should be asking for help on the right cases
    if 'system_uncertainty' in df.columns:
        correlation = df['system_uncertainty'].corr(
            df['human_intervened'].astype(float)
        )
    else:
        correlation = None
    
    return {
        'task_completion_rate': completion_rate,
        'human_intervention_rate': intervention_rate,
        'intervention_value': intervention_value,
        'uncertainty_intervention_correlation': correlation,
        'hitl_calibration': (
            'Well-calibrated' if correlation and correlation > 0.5
            else 'Needs review' if correlation and correlation < 0.3
            else 'Unknown'
        )
    }
```

### 4.2 Prosthetic Adaptation Metrics

```python
def evaluate_prosthetic_adaptation(session_logs: list, 
                                    baseline_session: dict):
    """
    Track adaptation progress of myoelectric prosthetic model
    over multiple sessions.
    """
    metrics_over_time = []
    
    for session in session_logs:
        # Classification accuracy for intended movements
        accuracy = session['correct_movements'] / session['total_movements']
        
        # Latency from signal to actuation (lower is better)
        latency = np.mean(session['actuation_latencies'])
        
        # User correction rate (how often user re-attempts due to wrong actuation)
        correction_rate = session['re_attempts'] / session['total_attempts']
        
        # Task-specific performance (e.g., pick-and-place tasks per minute)
        throughput = session['tasks_completed'] / session['session_minutes']
        
        metrics_over_time.append({
            'session': session['session_id'],
            'accuracy': accuracy,
            'latency_ms': latency,
            'correction_rate': correction_rate,
            'task_throughput': throughput
        })
    
    df = pd.DataFrame(metrics_over_time)
    
    # Compute improvement slopes
    from scipy.stats import linregress
    sessions = range(len(df))
    
    accuracy_slope, _, acc_r, _, _ = linregress(sessions, df['accuracy'])
    correction_slope, _, _, _, _ = linregress(sessions, df['correction_rate'])
    
    return {
        'final_accuracy': df['accuracy'].iloc[-1],
        'baseline_accuracy': baseline_session.get('accuracy', None),
        'accuracy_trend_per_session': accuracy_slope,
        'correction_rate_trend': correction_slope,
        'adaptation_converged': abs(accuracy_slope) < 0.005,  # < 0.5%/session
        'recommended_retrain': df['accuracy'].iloc[-3:].mean() < 0.80
    }
```

---

## 5. Universal HITL Metrics for Non-Static Systems

These metrics apply across all Chapter 16 domains:

### 5.1 Distribution Shift Detection

```python
def online_distribution_shift_detector(feature_stream, 
                                        reference_distribution,
                                        window_size=1000,
                                        alpha=0.05):
    """
    Detect when streaming data has shifted significantly from
    the reference distribution used for model training.
    
    Uses Maximum Mean Discrepancy (MMD) as the test statistic.
    """
    from scipy.stats import ks_2samp
    
    recent_window = list(feature_stream)[-window_size:]
    
    if len(recent_window) < window_size:
        return {'shift_detected': False, 'reason': 'insufficient_data'}
    
    # KS test for each feature dimension
    shift_signals = []
    for feature_idx in range(len(recent_window[0])):
        ref_values = reference_distribution[:, feature_idx]
        recent_values = np.array([x[feature_idx] for x in recent_window])
        
        stat, p_value = ks_2samp(ref_values, recent_values)
        shift_signals.append({
            'feature': feature_idx,
            'ks_statistic': stat,
            'p_value': p_value,
            'significant': p_value < alpha
        })
    
    n_shifted = sum(s['significant'] for s in shift_signals)
    
    return {
        'shift_detected': n_shifted > 0,
        'n_shifted_features': n_shifted,
        'fraction_shifted': n_shifted / len(shift_signals),
        'details': shift_signals,
        'recommendation': (
            'Trigger model retraining' if n_shifted / len(shift_signals) > 0.3
            else 'Increase human review rate' if n_shifted > 0
            else 'Distribution stable'
        )
    }
```

### 5.2 Real-Time HITL Health Dashboard

```python
class HITLHealthMonitor:
    """
    Continuous monitoring of HITL system health for streaming/real-time systems.
    """
    
    def __init__(self, config):
        self.config = config
        self.metrics_buffer = []
        self.alerts = []
    
    def update(self, prediction, human_decision, outcome, 
               timestamp, context=None):
        """
        Called after each HITL interaction.
        """
        self.metrics_buffer.append({
            'timestamp': timestamp,
            'model_confidence': prediction['confidence'],
            'sent_to_human': prediction['confidence'] < self.config['threshold'],
            'human_agreed': human_decision == prediction['label'],
            'outcome_correct': outcome == prediction['label'],
            'context': context
        })
        
        # Rolling window analysis every 100 events
        if len(self.metrics_buffer) % 100 == 0:
            self._check_system_health()
    
    def _check_system_health(self):
        """Check rolling metrics and fire alerts if thresholds exceeded."""
        recent = self.metrics_buffer[-500:]  # Last 500 interactions
        df = pd.DataFrame(recent)
        
        review_rate = df['sent_to_human'].mean()
        human_agreement = df[df['sent_to_human']]['human_agreed'].mean()
        
        # Alert: human agreement rate dropping (model degrading or threshold wrong)
        if human_agreement < 0.70:
            self.alerts.append({
                'type': 'model_degradation',
                'message': f'Human-model agreement rate: {human_agreement:.2f}. Consider retraining.',
                'severity': 'high'
            })
        
        # Alert: review rate too high (threshold too conservative or model degraded)
        if review_rate > self.config['max_review_rate']:
            self.alerts.append({
                'type': 'high_review_rate',
                'message': f'Review rate: {review_rate:.2f}. Alert fatigue risk.',
                'severity': 'medium'
            })
        
        return self.alerts
```

---

## References

Povey, D., et al. (2011). The Kaldi speech recognition toolkit. *Proceedings of ASRU Workshop.*

EEMUA Publication 191. (2013). *Alarm systems: A guide to design, management and procurement* (3rd ed.). Engineering Equipment and Materials Users Association.

Tibshirani, R. J., et al. (2019). Conformal prediction under covariate shift. *Advances in NeurIPS 32.*

Jumper, J., et al. (2021). Highly accurate protein structure prediction with AlphaFold. *Nature, 596*(7873), 583–589.

Shahriari, B., Swersky, K., Wang, Z., Adams, R. P., & de Freitas, N. (2016). Taking the human out of the loop: A review of Bayesian optimization. *Proceedings of the IEEE, 104*(1), 148–175.

Javdani, S., Srinivasa, S. S., & Bagnell, J. A. (2015). Shared autonomy via hindsight optimization. In *Robotics: Science and Systems XI.*

Shenoy, K. V., & Carmena, J. M. (2014). Combining decoder design and neural adaptation in brain-machine interfaces. *Neuron, 84*(4), 665–680.

Cvach, M. (2012). Monitor alarm fatigue: An integrative review. *Biomedical Instrumentation & Technology, 46*(4), 268–277.
