# Τεχνικό Παράρτημα Κεφαλαίου 16: Μετρικές HITL ειδικές για τον Τομέα

*Πλαίσια μέτρησης για ήχο, χρονοσειρές, επιστημονική ανακάλυψη και φυσικά συστήματα*

---

## Επισκόπηση

Οι τυπικές μετρικές HITL — πιστότητα, ανάκληση, ρυθμός αξιολόγησης, συμφωνία αξιολογητών — έχουν σχεδιαστεί για στατική ταξινόμηση κειμένου/εικόνας. Αυτό το παράρτημα αναπτύσσει πλαίσια μετρικών για καθέναν από τους τέσσερις τομείς που καλύπτονται στο Κεφάλαιο 16. Κάθε τομέας έχει μορφές αποτυχίας και απαιτήσεις αξιολόγησης που οι τυπικές μετρικές δεν καταγράφουν.

---

## 1. Μετρικές HITL Ήχου και Ομιλίας

### 1.1 Ποιότητα Μεταγραφής με Δημογραφική Τμηματοποίηση

Ο **Ρυθμός Σφάλματος Λέξεων (Word Error Rate - WER)** είναι η τυπική μετρική μεταγραφής:

$$WER = \frac{S + D + I}{N}$$

όπου $S$ είναι οι αντικαταστάσεις (substitutions), $D$ είναι οι διαγραφές (deletions), $I$ είναι οι εισαγωγές (insertions) και $N$ είναι ο αριθμός των λέξεων στη μεταγραφή αναφοράς.

Για σκοπούς ελέγχου HITL, ο WER πρέπει να υπολογίζεται ανά **δημογραφικά στοιχεία ομιλητή** (όχι μόνο συνολικά). Ο διαφορικός WER ανά διάλεκτο, προφορά ή δημογραφική ομάδα είναι το βασικό σήμα για τη μεροληψία σχολιασμού στα συστήματα μεταγραφής.

```python
def differential_wer_analysis(transcription_log, demographic_col):
    """
    Υπολογισμός WER ανά δημογραφική ομάδα.
    Επισήμανση ομάδων όπου ο WER υπερβαίνει τον συνολικό WER κατά > όριο.
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
            'flag': group_wer > overall_wer * 1.3  # 30% χειρότερα από τον μέσο όρο
        }
    
    return results
```

### 1.2 Διολίσθηση Διόρθωσης Σχολιασμού

Για την ανίχνευση διαλεκτικής μεροληψίας στις διορθώσεις των αξιολογητών:

```python
def detect_correction_bias(correction_log, speaker_dialect_col):
    """
    Ανίχνευση του αν οι αξιολογητές διορθώνουν χαρακτηριστικά ανεπίσημης διαλέκτου
    σε επίσημα ισοδύναμα με διαφορετικούς ρυθμούς ανά ομάδα ομιλητών.
    
    Μια διόρθωση είναι 'ανεπίσημη-προς-επίσημη' εάν αντικαθιστά μια φωνολογικά
    τυπική μεταγραφή με μια επίσημη εναλλακτική.
    """
    correction_log['is_style_correction'] = correction_log.apply(
        lambda row: row['correction_type'] == 'informal_to_formal',
        axis=1
    )
    
    style_correction_rates = correction_log.groupby(
        speaker_dialect_col
    )['is_style_correction'].mean()
    
    # Επισήμανση εάν οποιαδήποτε ομάδα έχει >2x τον ρυθμό μιας άλλης
    max_rate = style_correction_rates.max()
    min_rate = style_correction_rates.min()
    
    return {
        'rates': style_correction_rates.to_dict(),
        'disparity_ratio': max_rate / min_rate if min_rate > 0 else None,
        'bias_detected': max_rate / min_rate > 2.0 if min_rate > 0 else False
    }
```

### 1.3 Μετρικές Ποιότητας Διαχωρισμού (Diarization)

Ο διαχωρισμός ομιλητών (Speaker diarization) αξιολογείται με τον **Ρυθμό Σφάλματος Διαχωρισμού (Diarization Error Rate - DER)**:

$$DER = \frac{\text{Παραλειφθείσα Ομιλία} + \text{Ομιλία Ψευδούς Συναγερμού} + \text{Σύγχυση Ομιλητών}}{\text{Συνολικός Χρόνος Ομιλίας Αναφοράς}}$$

Για τον έλεγχο HITL σε νομικό και ιατρικό διαχωρισμό:
- **Πιστότητα απόδοσης**: Για κάθε αποδιδόμενο τμήμα ομιλητή, είναι η απόδοση σωστή;
- **Συσχέτιση εμπιστοσύνης-απόδοσης**: Έχουν οι αποδόσεις υψηλής εμπιστοσύνης υψηλότερη πιστότητα από εκείνες χαμηλής εμπιστοσύνης; (Απαιτείται για τη δρομολόγηση βάσει εμπιστοσύνης στην ανθρώπινη αξιολόγηση)

```python
def diarization_confidence_analysis(diarization_output, ground_truth):
    """
    Αξιολόγηση του αν η εμπιστοσύνη του διαχωρισμού συσχετίζεται με την ακρίβεια.
    Εάν όχι, η εμπιστοσύνη δεν μπορεί να χρησιμοποιηθεί για δρομολόγηση HITL.
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
    
    # Ομαδοποίηση κατά εμπιστοσύνη και υπολογισμός πιστότητας ανά δοχείο
    df['confidence_bin'] = pd.cut(df['confidence'], bins=10)
    calibration = df.groupby('confidence_bin')['correct'].mean()
    
    # Υπολογισμός συσχέτισης μεταξύ εμπιστοσύνης και ορθότητας
    correlation = df['confidence'].corr(df['correct'].astype(float))
    
    return {
        'calibration_by_confidence': calibration.to_dict(),
        'confidence_accuracy_correlation': correlation,
        'usable_for_hitl_routing': correlation > 0.5
    }
```

### 1.4 Ανίχνευση Κρίσεων: Πολυτροπική Διαφωνία ως Σήμα Κλιμάκωσης

```python
def compute_escalation_signal(text_risk_score, prosody_risk_score,
                               disagreement_threshold=0.3):
    """
    Όταν τα μοντέλα κειμένου και προσωδίας διαφωνούν περισσότερο από το όριο,
    κλιμάκωση σε ανθρώπινη αξιολόγηση ανεξάρτητα από τα μεμονωμένα σκορ.
    
    Αυτό καταγράφει το 'σενάριο του Μάρκου': το κείμενο λέει ασφαλές, η προσωδία λέει
    ανησυχητικό.
    """
    disagreement = abs(text_risk_score - prosody_risk_score)
    
    # Συνδυασμένος κίνδυνος (σταθμισμένος με βάση την αξιοπιστία του τρόπου)
    # Τα βάρη θα πρέπει να είναι συντονισμένα με τον τομέα· αυτό είναι ενδεικτικό
    combined_risk = 0.4 * text_risk_score + 0.6 * prosody_risk_score
    
    should_escalate = (
        combined_risk > 0.6 or
        disagreement > disagreement_threshold or
        prosody_risk_score > 0.7  # Ο υψηλός προσωδιακός κίνδυνος κλιμακώνεται πάντα
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

## 2. Μετρικές HITL Χρονοσειρών και Δεδομένων Αισθητήρων

### 2.1 Μετρικές Ποιότητας Συναγερμού

Για το βιομηχανικό IoT και την παρακολούθηση ασθενών, οι βασικές μετρικές είναι:

**Πιστότητα Συναγερμού (Alarm Precision)**: Από όλους τους συναγερμούς που παρήχθησαν, ποιο κλάσμα ήταν γνήσιες ανωμαλίες που απαιτούσαν ανθρώπινη παρέμβαση;
$$\text{Alarm Precision} = \frac{\text{Αληθείς Συναγερμοί}}{\text{Αληθείς Συναγερμοί} + \text{Ψευδείς Συναγερμοί}}$$

**Ρυθμός Δυνατότητας Δράσης (Actionability Rate)**: Από τους συναγερμούς που αξιολογήθηκαν από άνθρωπο, ποιο κλάσμα οδήγησε σε πραγματική παρέμβαση;

**Φόρτος Συναγερμών (Alarm Burden)**: Μέσος αριθμός συναγερμών ανά χειριστή ανά ώρα. Τα βιομηχανικά πρότυπα υποδηλώνουν ότι φόρτος συναγερμών πάνω από 6-12 ανά ώρα ανά χειριστή οδηγεί σε σημαντική κόπωση συναγερμών στις βιομηχανίες επεξεργασίας.

**Ρυθμός Παράλειψης Κρίσιμου Συναγερμού**: Από τις γνήσιες ανωμαλίες που απαιτούν παρέμβαση, ποιο κλάσμα το σύστημα απέτυχε να επισημάνει;

```python
def compute_alarm_quality_metrics(alarm_log, operator_log):
    """
    Υπολογισμός πλήρους έκθεσης ποιότητας συναγερμού για βιομηχανικό σύστημα HITL.
    """
    total_alarms = len(alarm_log)
    true_alarms = alarm_log['requires_intervention'].sum()
    false_alarms = total_alarms - true_alarms
    
    # Πιστότητα συναγερμού
    precision = true_alarms / total_alarms if total_alarms > 0 else 0
    
    # Ρυθμός δυνατότητας δράσης (ο άνθρωπος όντως έκανε κάτι)
    actioned = operator_log['action_taken'].sum()
    actionability = actioned / len(operator_log) if len(operator_log) > 0 else 0
    
    # Φόρτος συναγερμών (ανά χειριστή ανά ώρα)
    total_operator_hours = operator_log['shift_duration_hours'].sum()
    burden = total_alarms / total_operator_hours if total_operator_hours > 0 else 0
    
    # Ρυθμός κρίσιμης παράλειψης
    all_incidents = get_actual_incidents(alarm_log.index.min(), 
                                         alarm_log.index.max())
    missed = len([i for i in all_incidents if not alarm_log_contains_alarm_near(i)])
    critical_miss_rate = missed / len(all_incidents) if len(all_incidents) > 0 else 0
    
    return {
        'alarm_precision': precision,
        'actionability_rate': actionability,
        'alarm_burden_per_operator_hour': burden,
        'critical_miss_rate': critical_miss_rate,
        'alarm_fatigue_risk': burden > 10,  # Όριο EEMUA 191
        'assessment': interpret_alarm_quality(precision, burden, critical_miss_rate)
    }
```

### 2.2 Ποσοτικοποίηση Χρονικής Αβεβαιότητας

Για την ανίχνευση ανωμαλιών σε χρονοσειρές, η αβεβαιότητα πρέπει να εκτιμάται στον χρονικό τομέα:

```python
def temporal_uncertainty_estimate(model, time_series, 
                                   context_window=60,
                                   forecast_horizon=10,
                                   n_samples=100):
    """
    Εκτίμηση αβεβαιότητας Monte Carlo για πρόβλεψη χρονοσειρών.
    
    Η αβεβαιότητα είναι υψηλότερη:
    - Σε ασυνέχειες του σήματος εισόδου
    - Όταν το παράθυρο πλαισίου περιέχει ασυνήθιστα μοτίβα
    - Όταν πολλαπλοί αισθητήρες δείχνουν αντικρουόμενες ενδείξεις
    """
    # Συλλογή προβλέψεων με ενεργοποιημένο το dropout (MC Dropout)
    predictions = []
    model.train()  # Ενεργοποίηση dropout
    for _ in range(n_samples):
        pred = model(time_series[-context_window:])
        predictions.append(pred)
    model.eval()
    
    predictions = torch.stack(predictions)
    mean_pred = predictions.mean(dim=0)
    uncertainty = predictions.std(dim=0)
    
    # Πλαίσιο ειδικά για τον χρόνο: υψηλότερη αβεβαιότητα κοντά σε πρόσφατα σημεία αλλαγής
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

### 2.3 Σύντηξη Πολλαπλών Αισθητήρων και Ανίχνευση Διαφωνίας

```python
def multi_sensor_disagreement_score(sensor_readings: dict, 
                                    physical_model_predictions: dict):
    """
    Υπολογισμός σκορ διαφωνίας μεταξύ αισθητήρων και μεταξύ αισθητήρων
    και προβλέψεων φυσικού μοντέλου.
    
    Υψηλή διαφωνία -> κλιμάκωση σε άνθρωπο χειριστή ανεξάρτητα από την
    εμπιστοσύνη του μεμονωμένου αισθητήρα.
    """
    sensor_names = list(sensor_readings.keys())
    n_sensors = len(sensor_names)
    
    # Διαφωνία αισθητήρων ανά ζεύγη (κανονικοποιημένη)
    disagreements = []
    for i in range(n_sensors):
        for j in range(i + 1, n_sensors):
            s_i = sensor_readings[sensor_names[i]]
            s_j = sensor_readings[sensor_names[j]]
            # Κανονικοποίηση με βάση το αναμενόμενο εύρος συσχέτισης
            disagreements.append(
                abs(s_i - s_j) / max(abs(s_i), abs(s_j), 1e-8)
            )
    
    sensor_disagreement = np.mean(disagreements) if disagreements else 0
    
    # Διαφωνία μοντέλου έναντι αισθητήρα
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

## 3. Μετρικές HITL Επιστημονικής Ανακάλυψης

### 3.1 Ενσωμάτωση Εμπιστοσύνης AlphaFold

Για ροές εργασίας πρόβλεψης πρωτεϊνικής δομής:

```python
def evaluate_alphafold_confidence_regions(plddt_scores, 
                                           confidence_thresholds=None):
    """
    Ταξινόμηση περιοχών μιας προβλεπόμενης πρωτεϊνικής δομής ανά εμπιστοσύνη.
    Υψηλή: pLDDT > 90 — γενικά αξιόπιστη
    Μέτρια: 70-90 — σκελετός αξιόπιστος, πλευρικές αλυσίδες αβέβαιες
    Χαμηλή: 50-70 — μπορεί να είναι σωστή, επαληθεύστε
    Πολύ χαμηλή: < 50 — πιθανώς άτακτη ή αναξιόπιστη
    
    Επιστρέφει συνιστώμενη προτεραιότητα πειραματικής επικύρωσης.
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
    
    # Συνοπτικά στατιστικά
    df = pd.DataFrame(residue_classifications)
    
    return {
        'residue_details': df,
        'fraction_high_confidence': (df['classification'] == 'high_confidence').mean(),
        'critical_regions': df[df['validation_priority'] == 'critical']['residue_index'].tolist(),
        'hitl_recommendation': generate_validation_protocol(df)
    }


def generate_validation_protocol(classification_df):
    """
    Δημιουργία σύστασης για προσπάθεια πειραματικής επικύρωσης.
    """
    frac_critical = (classification_df['validation_priority'] == 'critical').mean()
    frac_high = (classification_df['validation_priority'] == 'high').mean()
    
    if frac_critical > 0.2:
        return "HIGH VALIDATION EFFORT: >20% των καταλοίπων σε κρίσιμες περιοχές. Συνιστάται κρυσταλλογραφική ή cryo-EM επικύρωση πριν από τη χρήση σε σχεδιασμό φαρμάκων."
    elif frac_high + frac_critical > 0.3:
        return "MEDIUM VALIDATION EFFORT: Σημαντικές αβέβαιες περιοχές. Επικυρώστε πειραματικά τα κατάλοιπα του ενεργού κέντρου."
    else:
        return "LOW VALIDATION EFFORT: Συνολικά δομή υψηλής εμπιστοσύνης. Δειγματοληπτικός έλεγχος βασικών λειτουργικών καταλοίπων."
```

### 3.2 Μετρικές Βρόχου Βαϊεσιανής Βελτιστοποίησης

Για βελτιστοποίηση στην επιστήμη των υλικών και στην ανακάλυψη φαρμάκων:

```python
def evaluate_bayesian_optimization_loop(optimization_history):
    """
    Μετρικές για την αξιολόγηση ενός βρόχου HITL Βαϊεσιανής βελτιστοποίησης.
    """
    df = pd.DataFrame(optimization_history)
    
    # Μεταμέλεια (Regret): διαφορά μεταξύ του καλύτερου δυνατού και αυτού που βρήκαμε
    # (απαιτεί γνώση του πραγματικού βέλτιστου, χρησιμοποιήστε υποκατάστατο αν δεν είναι διαθέσιμο)
    best_found = df['objective'].max()
    
    # Ρυθμός σύγκλισης: πόσες επαναλήψεις για να φτάσουμε στο 90% της καλύτερης τιμής;
    threshold = 0.9 * best_found
    convergence_iter = df[df['objective'] >= threshold].index.min()
    
    # Ρυθμός ανθρώπινης παράκαμψης: πόσο συχνά οι ερευνητές παρέκκλιναν από τη σύσταση του μοντέλου;
    override_rate = (df['human_overrode_suggestion'] == True).mean()
    
    # Ποιότητα παράκαμψης: όταν οι άνθρωποι παρέκαμψαν, ήταν η επιλογή τους καλύτερη;
    overrides = df[df['human_overrode_suggestion'] == True]
    suggestions = df[df['human_overrode_suggestion'] == False]
    
    if len(overrides) > 0 and len(suggestions) > 0:
        override_avg_improvement = overrides['objective'].mean()
        suggestion_avg_improvement = suggestions['objective'].mean()
        human_value_add = override_avg_improvement - suggestion_avg_improvement
    else:
        human_value_add = None
    
    # Ζητήματα ποιότητας δεδομένων που επισημάνθηκαν από τον άνθρωπο
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

## 4. Μετρικές HITL Ρομποτικής και Φυσικών Συστημάτων

### 4.1 Μετρικές Κοινής Αυτονομίας

```python
def compute_shared_autonomy_metrics(session_log):
    """
    Μετρικές για συστήματα κοινής αυτονομίας (αμαξίδια, ρομποτικοί βραχίονες,
    ημι-αυτόνομα οχήματα).
    """
    df = pd.DataFrame(session_log)
    
    # Ρυθμός ολοκλήρωσης εργασιών
    completion_rate = df['task_completed'].mean()
    
    # Ρυθμός ανθρώπινης παρέμβασης: κλάσμα του χρόνου όπου ο άνθρωπος παρακάμπτει
    # το αυτόνομο στοιχείο
    intervention_rate = df['human_intervened'].mean()
    
    # Ποιότητα παρέμβασης: βελτίωσαν οι ανθρώπινες παρεμβάσεις τα αποτελέσματα;
    interventions = df[df['human_intervened'] == True]
    non_interventions = df[df['human_intervened'] == False]
    
    if len(interventions) > 0:
        intervention_success = interventions['task_completed'].mean()
        baseline_success = non_interventions['task_completed'].mean()
        intervention_value = intervention_success - baseline_success
    else:
        intervention_value = None
    
    # Συσχέτιση αβεβαιότητας-παρέμβασης:
    # Το σύστημα θα πρέπει να ζητά βοήθεια στις σωστές περιπτώσεις
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

### 4.2 Μετρικές Προσαρμογής Προσθετικού

```python
def evaluate_prosthetic_adaptation(session_logs: list, 
                                    baseline_session: dict):
    """
    Παρακολούθηση της προόδου προσαρμογής του μυοηλεκτρικού προσθετικού μοντέλου
    σε πολλαπλές συνεδρίες.
    """
    metrics_over_time = []
    
    for session in session_logs:
        # Ακρίβεια ταξινόμησης για τις επιδιωκόμενες κινήσεις
        accuracy = session['correct_movements'] / session['total_movements']
        
        # Καθυστέρηση από το σήμα στην ενεργοποίηση (χαμηλότερη είναι καλύτερη)
        latency = np.mean(session['actuation_latencies'])
        
        # Ρυθμός διόρθωσης χρήστη (πόσο συχνά ο χρήστης ξαναπροσπαθεί λόγω λάθος ενεργοποίησης)
        correction_rate = session['re_attempts'] / session['total_attempts']
        
        # Απόδοση ειδικά για την εργασία (π.χ. εργασίες μετακίνησης αντικειμένων ανά λεπτό)
        throughput = session['tasks_completed'] / session['session_minutes']
        
        metrics_over_time.append({
            'session': session['session_id'],
            'accuracy': accuracy,
            'latency_ms': latency,
            'correction_rate': correction_rate,
            'task_throughput': throughput
        })
    
    df = pd.DataFrame(metrics_over_time)
    
    # Υπολογισμός κλίσεων βελτίωσης
    from scipy.stats import linregress
    sessions = range(len(df))
    
    accuracy_slope, _, acc_r, _, _ = linregress(sessions, df['accuracy'])
    correction_slope, _, _, _, _ = linregress(sessions, df['correction_rate'])
    
    return {
        'final_accuracy': df['accuracy'].iloc[-1],
        'baseline_accuracy': baseline_session.get('accuracy', None),
        'accuracy_trend_per_session': accuracy_slope,
        'correction_rate_trend': correction_slope,
        'adaptation_converged': abs(accuracy_slope) < 0.005,  # < 0,5%/συνεδρία
        'recommended_retrain': df['accuracy'].iloc[-3:].mean() < 0.80
    }
```

---

## 5. Παγκόσμιες Μετρικές HITL για Μη Στατικά Συστήματα

Αυτές οι μετρικές εφαρμόζονται σε όλους τους τομείς του Κεφαλαίου 16:

### 5.1 Ανίχνευση Μετατόπισης Κατανομής

```python
def online_distribution_shift_detector(feature_stream, 
                                        reference_distribution,
                                        window_size=1000,
                                        alpha=0.05):
    """
    Ανίχνευση του πότε τα δεδομένα ροής έχουν μετατοπιστεί σημαντικά από
    την κατανομή αναφοράς που χρησιμοποιήθηκε για την εκπαίδευση του μοντέλου.
    
    Χρησιμοποιεί το Maximum Mean Discrepancy (MMD) ως στατιστική ελέγχου.
    """
    from scipy.stats import ks_2samp
    
    recent_window = list(feature_stream)[-window_size:]
    
    if len(recent_window) < window_size:
        return {'shift_detected': False, 'reason': 'insufficient_data'}
    
    # Έλεγχος KS για κάθε διάσταση χαρακτηριστικού
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

### 5.2 Πίνακας Ελέγχου Υγείας HITL σε Πραγματικό Χρόνο

```python
class HITLHealthMonitor:
    """
    Συνεχής παρακολούθηση της υγείας του συστήματος HITL για συστήματα ροής/πραγματικού χρόνου.
    """
    
    def __init__(self, config):
        self.config = config
        self.metrics_buffer = []
        self.alerts = []
    
    def update(self, prediction, human_decision, outcome, 
               timestamp, context=None):
        """
        Καλείται μετά από κάθε αλληλεπίδραση HITL.
        """
        self.metrics_buffer.append({
            'timestamp': timestamp,
            'model_confidence': prediction['confidence'],
            'sent_to_human': prediction['confidence'] < self.config['threshold'],
            'human_agreed': human_decision == prediction['label'],
            'outcome_correct': outcome == prediction['label'],
            'context': context
        })
        
        # Ανάλυση κυλιόμενου παραθύρου κάθε 100 συμβάντα
        if len(self.metrics_buffer) % 100 == 0:
            self._check_system_health()
    
    def _check_system_health(self):
        """Έλεγχος κυλιόμενων μετρικών και έκδοση ειδοποιήσεων εάν ξεπεραστούν τα όρια."""
        recent = self.metrics_buffer[-500:]  # Τελευταίες 500 αλληλεπιδράσεις
        df = pd.DataFrame(recent)
        
        review_rate = df['sent_to_human'].mean()
        human_agreement = df[df['sent_to_human']]['human_agreed'].mean()
        
        # Ειδοποίηση: ο ρυθμός ανθρώπινης συμφωνίας πέφτει (το μοντέλο υποβαθμίζεται ή το όριο είναι λάθος)
        if human_agreement < 0.70:
            self.alerts.append({
                'type': 'model_degradation',
                'message': f'Human-model agreement rate: {human_agreement:.2f}. Consider retraining.',
                'severity': 'high'
            })
        
        # Ειδοποίηση: ο ρυθμός αξιολόγησης είναι πολύ υψηλός (το όριο είναι πολύ συντηρητικό ή το μοντέλο υποβαθμίστηκε)
        if review_rate > self.config['max_review_rate']:
            self.alerts.append({
                'type': 'high_review_rate',
                'message': f'Review rate: {review_rate:.2f}. Alert fatigue risk.',
                'severity': 'medium'
            })
        
        return self.alerts
```

---

## Βιβλιογραφία

Povey, D., et al. (2011). The Kaldi speech recognition toolkit. *Proceedings of ASRU Workshop.*

EEMUA Publication 191. (2013). *Alarm systems: A guide to design, management and procurement* (3rd ed.). Engineering Equipment and Materials Users Association.

Tibshirani, R. J., et al. (2019). Conformal prediction under covariate shift. *Advances in NeurIPS 32.*

Jumper, J., et al. (2021). Highly accurate protein structure prediction with AlphaFold. *Nature, 596*(7873), 583–589.

Shahriari, B., Swersky, K., Wang, Z., Adams, R. P., & de Freitas, N. (2016). Taking the human out of the loop: A review of Bayesian optimization. *Proceedings of the IEEE, 104*(1), 148–175.

Javdani, S., Srinivasa, S. S., & Bagnell, J. A. (2015). Shared autonomy via hindsight optimization. In *Robotics: Science and Systems XI.*

Shenoy, K. V., & Carmena, J. M. (2014). Combining decoder design and neural adaptation in brain-machine interfaces. *Neuron, 84*(4), 665–680.

Cvach, M. (2012). Monitor alarm fatigue: An integrative review. *Biomedical Instrumentation & Technology, 46*(4), 268–277.
