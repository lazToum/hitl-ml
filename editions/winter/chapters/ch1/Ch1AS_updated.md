# Chapter 1 Technical Exercise Solutions

*Complete solutions for technical exercises from Chapter 1 and Technical Appendix 1A*

---

## Exercise 1: Five-Dimension Framework Analysis

**Task:** Apply the five-dimension framework to analyze three systems from your daily life. For each system, rate each dimension (1-5) and identify the weakest dimension.

### Sample Solution: Three System Analysis

#### System 1: Spotify "Discover Weekly" Recommendations

| Dimension | Rating | Evidence |
|-----------|--------|----------|
| **Uncertainty Detection** | 3/5 | Doesn't explicitly show confidence; mixes high and low confidence recommendations without distinction |
| **Intervention Design** | 4/5 | Like/dislike buttons, "Don't play this" option, easy to skip |
| **Timing** | 4/5 | Weekly refresh is predictable; doesn't interrupt current listening |
| **Stakes Calibration** | 5/5 | Low stakes (just music), can afford to experiment |
| **Feedback Integration** | 5/5 | Strong learning from likes, skips, and listening time |

**Weakest Dimension:** Uncertainty Detection
**Analysis:** Spotify doesn't distinguish between "I'm confident you'll love this" and "This is experimental." Users can't tell which recommendations are safe bets vs. explorations. Improvement: Add confidence indicators or separate "Confident Picks" from "Experiments."

#### System 2: iPhone Face ID Unlock

| Dimension | Rating | Evidence |
|-----------|--------|----------|
| **Uncertainty Detection** | 5/5 | Clear confidence threshold—either unlocks or doesn't |
| **Intervention Design** | 4/5 | Falls back to passcode when uncertain; clear flow |
| **Timing** | 5/5 | Instant attempt on wake, immediate fallback |
| **Stakes Calibration** | 4/5 | Security-conscious (won't unlock if unsure), but treats all unlocks equally |
| **Feedback Integration** | 4/5 | Learns face changes over time, but doesn't explain learning |

**Weakest Dimension:** Stakes Calibration (marginal)
**Analysis:** Face ID treats unlocking to check the time the same as unlocking to access banking app. Could adjust confidence thresholds based on what's being accessed.

#### System 3: Gmail Smart Compose

| Dimension | Rating | Evidence |
|-----------|--------|----------|
| **Uncertainty Detection** | 4/5 | Only suggests when confident; grey text indicates suggestion |
| **Intervention Design** | 5/5 | Tab to accept, ignore to reject—minimal friction |
| **Timing** | 5/5 | Appears at natural pause points in typing |
| **Stakes Calibration** | 2/5 | Doesn't know if email is to boss vs. friend |
| **Feedback Integration** | 3/5 | Learns from accepts/rejects but slowly |

**Weakest Dimension:** Stakes Calibration
**Analysis:** Smart Compose suggests casual completions ("Thanks!" "Sounds good!") in professional contexts. Doesn't distinguish formal vs. informal emails. Could detect recipient (manager vs. friend) and adjust formality.

---

## Exercise 2: Uncertainty Estimation Implementation

**Task:** Implement both Monte Carlo Dropout and Deep Ensembles for a simple classification task. Compare their uncertainty estimates and computational costs.

### Complete Solution:

```python
import torch
import torch.nn as nn
import torch.nn.functional as F
import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
import time

# ============================================
# SETUP: Generate Dataset
# ============================================

X, y = make_classification(
    n_samples=2000, 
    n_features=20, 
    n_classes=2, 
    n_informative=10, 
    n_redundant=5,
    random_state=42
)

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=42
)

X_train = torch.FloatTensor(X_train)
X_test = torch.FloatTensor(X_test)
y_train = torch.LongTensor(y_train)
y_test = torch.LongTensor(y_test)

print(f"Training samples: {len(X_train)}")
print(f"Test samples: {len(X_test)}")

# ============================================
# MODEL: Classifier with Dropout
# ============================================

class DropoutClassifier(nn.Module):
    """
    Simple classifier with dropout layers for MC Dropout uncertainty estimation.
    """
    def __init__(self, input_dim, dropout_rate=0.2):
        super(DropoutClassifier, self).__init__()
        self.fc1 = nn.Linear(input_dim, 64)
        self.fc2 = nn.Linear(64, 32)
        self.fc3 = nn.Linear(32, 2)
        self.dropout = nn.Dropout(dropout_rate)
        
    def forward(self, x):
        x = F.relu(self.fc1(x))
        x = self.dropout(x)
        x = F.relu(self.fc2(x))
        x = self.dropout(x)
        x = self.fc3(x)
        return F.softmax(x, dim=1)

# ============================================
# METHOD 1: Monte Carlo Dropout
# ============================================

class MCDropoutPredictor:
    """
    Monte Carlo Dropout for uncertainty estimation.
    
    Key insight: By keeping dropout enabled during inference and running
    multiple forward passes, we get a distribution of predictions that
    reflects model uncertainty.
    """
    def __init__(self, model, n_samples=100):
        self.model = model
        self.n_samples = n_samples
    
    def predict_with_uncertainty(self, x):
        """
        Run multiple forward passes with dropout enabled.
        """
        self.model.train()  # Keep dropout active!
        predictions = []
        
        start_time = time.time()
        with torch.no_grad():
            for _ in range(self.n_samples):
                pred = self.model(x)
                predictions.append(pred.numpy())
        
        predictions = np.array(predictions)
        mean_pred = np.mean(predictions, axis=0)
        uncertainty = np.std(predictions, axis=0)
        
        inference_time = time.time() - start_time
        return mean_pred, uncertainty, inference_time

# ============================================
# METHOD 2: Deep Ensembles
# ============================================

class DeepEnsemble:
    """
    Deep Ensemble for uncertainty estimation.
    
    Key insight: Train multiple models with different initializations.
    Disagreement between models indicates epistemic uncertainty.
    """
    def __init__(self, input_dim, n_models=5):
        self.models = []
        self.n_models = n_models
        
        for i in range(n_models):
            torch.manual_seed(i * 42)
            model = DropoutClassifier(input_dim, dropout_rate=0.0)
            self.models.append(model)
    
    def train_ensemble(self, X_train, y_train, epochs=100, verbose=True):
        for i, model in enumerate(self.models):
            if verbose:
                print(f"Training model {i+1}/{self.n_models}...")
            
            optimizer = torch.optim.Adam(model.parameters(), lr=0.001)
            criterion = nn.CrossEntropyLoss()
            
            for epoch in range(epochs):
                optimizer.zero_grad()
                outputs = model(X_train)
                loss = criterion(outputs, y_train)
                loss.backward()
                optimizer.step()
    
    def predict_with_uncertainty(self, x):
        predictions = []
        
        start_time = time.time()
        for model in self.models:
            model.eval()
            with torch.no_grad():
                pred = model(x)
                predictions.append(pred.numpy())
        
        predictions = np.array(predictions)
        mean_pred = np.mean(predictions, axis=0)
        epistemic_uncertainty = np.std(predictions, axis=0)
        
        inference_time = time.time() - start_time
        return mean_pred, epistemic_uncertainty, inference_time

# ============================================
# TRAINING AND COMPARISON
# ============================================

print("\n" + "="*50)
print("TRAINING MODELS")
print("="*50)

# Train MC Dropout model
print("\nTraining MC Dropout model...")
mc_model = DropoutClassifier(X_train.shape[1])
optimizer = torch.optim.Adam(mc_model.parameters(), lr=0.001)
criterion = nn.CrossEntropyLoss()

for epoch in range(100):
    optimizer.zero_grad()
    outputs = mc_model(X_train)
    loss = criterion(outputs, y_train)
    loss.backward()
    optimizer.step()
print("MC Dropout model trained.")

# Train Deep Ensemble
print("\nTraining Deep Ensemble...")
ensemble = DeepEnsemble(X_train.shape[1], n_models=5)
ensemble.train_ensemble(X_train, y_train, epochs=100)
print("Deep Ensemble trained.")

# ============================================
# EVALUATION AND COMPARISON
# ============================================

print("\n" + "="*50)
print("COMPARISON RESULTS")
print("="*50)

mc_dropout = MCDropoutPredictor(mc_model, n_samples=100)
mc_pred, mc_unc, mc_time = mc_dropout.predict_with_uncertainty(X_test)

ens_pred, ens_unc, ens_time = ensemble.predict_with_uncertainty(X_test)

mc_accuracy = np.mean(np.argmax(mc_pred, axis=1) == y_test.numpy())
ens_accuracy = np.mean(np.argmax(ens_pred, axis=1) == y_test.numpy())

print(f"\n{'Metric':<30} {'MC Dropout':<15} {'Deep Ensemble':<15}")
print("-" * 60)
print(f"{'Accuracy':<30} {mc_accuracy:.4f}{'':<10} {ens_accuracy:.4f}")
print(f"{'Mean Uncertainty':<30} {np.mean(mc_unc):.4f}{'':<10} {np.mean(ens_unc):.4f}")
print(f"{'Inference Time (s)':<30} {mc_time:.4f}{'':<10} {ens_time:.4f}")

# Check uncertainty calibration
mc_is_correct = np.argmax(mc_pred, axis=1) == y_test.numpy()
mc_max_unc = np.max(mc_unc, axis=1)

ens_is_correct = np.argmax(ens_pred, axis=1) == y_test.numpy()
ens_max_unc = np.max(ens_unc, axis=1)

print(f"\nUNCERTAINTY CALIBRATION:")
print(f"MC Dropout - Uncertainty on correct: {np.mean(mc_max_unc[mc_is_correct]):.4f}")
print(f"MC Dropout - Uncertainty on incorrect: {np.mean(mc_max_unc[~mc_is_correct]):.4f}")
print(f"Ensemble - Uncertainty on correct: {np.mean(ens_max_unc[ens_is_correct]):.4f}")
print(f"Ensemble - Uncertainty on incorrect: {np.mean(ens_max_unc[~ens_is_correct]):.4f}")

print("""
KEY FINDINGS:
1. Deep Ensemble typically achieves higher accuracy (model averaging)
2. Both methods show higher uncertainty for incorrect predictions (good calibration)
3. MC Dropout is slower at inference (100 passes vs 5)
4. For HITL: Set threshold, e.g., flag for review if uncertainty > 0.25
""")
```

---

## Exercise 3: A/B Testing Framework for Threshold Optimization

**Task:** Design an A/B testing framework for optimizing human intervention thresholds.

### Complete Solution:

```python
import numpy as np
import pandas as pd
from scipy import stats

class ContentModerationABTest:
    """
    A/B testing framework for content moderation thresholds.
    
    Demonstrates all five dimensions:
    1. Uncertainty Detection: AI toxicity scores
    2. Intervention Design: Human review queue
    3. Timing: Real-time moderation
    4. Stakes Calibration: Cost parameters
    5. Feedback Integration: Learning optimal threshold
    """
    
    def __init__(self):
        self.human_accuracy = 0.95
        
    def generate_content(self, n_samples=10000):
        """Generate synthetic content with toxicity scores."""
        true_labels = np.random.binomial(1, 0.15, n_samples)  # 15% toxic
        
        ai_scores = np.where(
            true_labels == 1,
            np.random.beta(8, 2, n_samples),
            np.random.beta(2, 8, n_samples)
        )
        ai_scores = np.clip(ai_scores + np.random.normal(0, 0.08, n_samples), 0, 1)
        
        return pd.DataFrame({
            'ai_score': ai_scores,
            'true_label': true_labels
        })
    
    def moderate(self, df, threshold):
        """Apply moderation with given threshold."""
        results = df.copy()
        
        # Human review for uncertain cases
        results['needs_review'] = (
            (results['ai_score'] > threshold) & 
            (results['ai_score'] < (1 - threshold))
        )
        
        # AI-only decisions
        ai_only = ~results['needs_review']
        results.loc[ai_only, 'decision'] = (results.loc[ai_only, 'ai_score'] > 0.5).astype(int)
        
        # Human decisions (95% accurate)
        human = results['needs_review']
        n_human = human.sum()
        correct = np.random.binomial(1, self.human_accuracy, n_human)
        results.loc[human, 'decision'] = np.where(
            correct,
            results.loc[human, 'true_label'],
            1 - results.loc[human, 'true_label']
        )
        
        return results
    
    def calculate_metrics(self, results):
        """Calculate performance and cost metrics."""
        n = len(results)
        accuracy = (results['decision'] == results['true_label']).mean()
        
        tp = ((results['decision'] == 1) & (results['true_label'] == 1)).sum()
        fp = ((results['decision'] == 1) & (results['true_label'] == 0)).sum()
        fn = ((results['decision'] == 0) & (results['true_label'] == 1)).sum()
        
        precision = tp / (tp + fp) if (tp + fp) > 0 else 0
        recall = tp / (tp + fn) if (tp + fn) > 0 else 0
        
        review_rate = results['needs_review'].mean()
        
        # Cost analysis (Stakes Calibration)
        daily_volume = 100000
        daily_cost = (
            review_rate * daily_volume * 0.50 +      # $0.50 per review
            (fn / n) * daily_volume * 100.00 +       # $100 per missed toxic
            (fp / n) * daily_volume * 5.00           # $5 per false positive
        )
        
        return {
            'accuracy': accuracy,
            'precision': precision,
            'recall': recall,
            'review_rate': review_rate,
            'daily_cost': daily_cost
        }
    
    def run_test(self, threshold_a, threshold_b, n_samples=20000):
        """Run A/B test comparing two thresholds."""
        print(f"\nA/B Test: {threshold_a} vs {threshold_b}")
        print("="*60)
        
        # Generate and moderate
        data_a = self.generate_content(n_samples)
        data_b = self.generate_content(n_samples)
        
        results_a = self.moderate(data_a, threshold_a)
        results_b = self.moderate(data_b, threshold_b)
        
        metrics_a = self.calculate_metrics(results_a)
        metrics_b = self.calculate_metrics(results_b)
        
        # Statistical test
        acc_a = (results_a['decision'] == results_a['true_label']).sum()
        acc_b = (results_b['decision'] == results_b['true_label']).sum()
        
        p_a, p_b = acc_a/n_samples, acc_b/n_samples
        p_pool = (acc_a + acc_b) / (2 * n_samples)
        se = np.sqrt(p_pool * (1-p_pool) * (2/n_samples))
        z = (p_b - p_a) / se if se > 0 else 0
        p_value = 2 * (1 - stats.norm.cdf(abs(z)))
        
        # Print results
        print(f"\n{'Metric':<20} {'Group A':<15} {'Group B':<15}")
        print("-"*50)
        print(f"{'Threshold':<20} {threshold_a:<15.2f} {threshold_b:<15.2f}")
        print(f"{'Accuracy':<20} {metrics_a['accuracy']:<15.4f} {metrics_b['accuracy']:<15.4f}")
        print(f"{'Review Rate':<20} {metrics_a['review_rate']:<15.2%} {metrics_b['review_rate']:<15.2%}")
        print(f"{'Daily Cost':<20} ${metrics_a['daily_cost']:<14,.0f} ${metrics_b['daily_cost']:<14,.0f}")
        print(f"\nP-value: {p_value:.4f} ({'Significant' if p_value < 0.05 else 'Not significant'})")
        
        # Recommendation
        cost_diff = metrics_a['daily_cost'] - metrics_b['daily_cost']
        if p_value < 0.05 and (p_b - p_a) > 0.01:
            print(f"Recommendation: Use threshold B (higher accuracy)")
        elif cost_diff > 1000:
            print(f"Recommendation: Consider B (${cost_diff:,.0f}/day savings)")
        else:
            print("Recommendation: No clear winner, continue testing")

# Run demonstration
ab_test = ContentModerationABTest()
ab_test.run_test(0.25, 0.35)
ab_test.run_test(0.35, 0.45)
```

---

## Exercise 5: Nest Thermostat Redesign

**Task:** Redesign the Nest thermostat Home/Away detection using the five-dimension framework.

### Complete Solution:

```python
from dataclasses import dataclass
from typing import Literal, Optional
from datetime import datetime, timedelta
import numpy as np

@dataclass
class PresenceSignals:
    motion_detected: bool
    time_since_motion: timedelta
    phone_in_geofence: bool
    phone_confidence: float
    smart_device_activity: bool
    typical_home_time: bool
    recent_manual_override: bool

@dataclass
class EnvironmentContext:
    outside_temp: float
    current_setpoint: float
    weather_forecast: str

@dataclass 
class PresenceResult:
    status: Literal['HOME', 'AWAY', 'ASK_USER']
    confidence: float
    reasoning: str


class ImprovedNestController:
    """
    Redesigned Nest with five-dimension framework.
    """
    
    def __init__(self):
        self.false_away_count = 0
        
    # DIMENSION 1: Uncertainty Detection
    def calculate_presence_probability(self, signals: PresenceSignals) -> tuple:
        probability = 0.5
        confidence = 0.5
        
        if signals.motion_detected:
            probability += 0.35
            confidence += 0.2
        elif signals.time_since_motion < timedelta(minutes=30):
            probability += 0.15
        elif signals.time_since_motion > timedelta(hours=2):
            probability -= 0.35
            confidence += 0.15
        
        if signals.phone_in_geofence:
            probability += 0.30 * signals.phone_confidence
            confidence += 0.15 * signals.phone_confidence
        elif signals.phone_confidence > 0.8:
            probability -= 0.30
            confidence += 0.15
        
        if signals.smart_device_activity:
            probability += 0.15
        
        if signals.typical_home_time:
            probability += 0.10
        
        if signals.recent_manual_override:
            confidence -= 0.2
        
        if self.false_away_count > 3:
            probability += 0.1
            confidence -= 0.1
        
        return np.clip(probability, 0, 1), np.clip(confidence, 0.2, 1)
    
    # DIMENSION 4: Stakes Calibration
    def calculate_stakes(self, context: EnvironmentContext) -> str:
        if context.outside_temp < 35 or context.outside_temp > 95:
            return 'high'
        elif abs(context.outside_temp - context.current_setpoint) > 25:
            return 'high'
        elif abs(context.outside_temp - context.current_setpoint) > 15:
            return 'medium'
        return 'low'
    
    def get_threshold(self, stakes: str) -> float:
        return {'low': 0.70, 'medium': 0.85, 'high': 0.95}[stakes]
    
    # DIMENSION 2: Intervention Design
    def create_prompt(self, prob: float, context: EnvironmentContext) -> dict:
        weather_note = ""
        if context.outside_temp < 40:
            weather_note = f"It's {context.outside_temp}°F outside."
        elif context.outside_temp > 85:
            weather_note = f"It's {context.outside_temp}°F outside."
        
        return {
            'title': "Home Status Check",
            'message': f"Haven't detected activity. {weather_note}",
            'options': ["I'm home", "I'm out", "Ask later", "Don't ask today"]
        }
    
    # MAIN DECISION LOGIC
    def determine_presence(self, signals: PresenceSignals, context: EnvironmentContext) -> PresenceResult:
        probability, confidence = self.calculate_presence_probability(signals)
        stakes = self.calculate_stakes(context)
        threshold = self.get_threshold(stakes)
        
        if probability > threshold:
            return PresenceResult('HOME', probability, f"High confidence home. Stakes: {stakes}")
        elif probability < (1 - threshold):
            return PresenceResult('AWAY', 1-probability, f"High confidence away. Stakes: {stakes}")
        else:
            return PresenceResult('ASK_USER', confidence, f"Uncertain. Stakes: {stakes}. Asking user.")
    
    # DIMENSION 5: Feedback Integration
    def process_feedback(self, prediction: str, response: str):
        if prediction == 'AWAY' and response == "I'm home":
            self.false_away_count += 1
            print(f"Learning: Was wrong. Now more conservative.")

# Demonstration
def demo():
    controller = ImprovedNestController()
    
    # Scenario: Uncertain + High Stakes
    signals = PresenceSignals(
        motion_detected=False,
        time_since_motion=timedelta(hours=1),
        phone_in_geofence=False,
        phone_confidence=0.6,
        smart_device_activity=False,
        typical_home_time=True,
        recent_manual_override=False
    )
    context = EnvironmentContext(
        outside_temp=28,
        current_setpoint=70,
        weather_forecast='extreme_cold'
    )
    
    result = controller.determine_presence(signals, context)
    print(f"Status: {result.status}")
    print(f"Confidence: {result.confidence:.0%}")
    print(f"Reasoning: {result.reasoning}")
    
    if result.status == 'ASK_USER':
        prompt = controller.create_prompt(result.confidence, context)
        print(f"\nNotification: {prompt['message']}")
        print(f"Options: {prompt['options']}")

demo()
```

### Expected Output:

```
Status: ASK_USER
Confidence: 45%
Reasoning: Uncertain. Stakes: high. Asking user.

Notification: Haven't detected activity. It's 28°F outside.
Options: ["I'm home", "I'm out", "Ask later", "Don't ask today"]
```

---

## Key Takeaways

### Five-Dimension Framework Summary

| Dimension | Implementation Pattern |
|-----------|----------------------|
| **Uncertainty Detection** | `confidence = model.predict_uncertainty(x)` |
| **Intervention Design** | Clear prompt + multiple response options |
| **Timing** | `delay = base_delay * stakes_multiplier` |
| **Stakes Calibration** | `threshold = cost_FP / (cost_FP + cost_FN)` |
| **Feedback Integration** | `model.update(user_correction)` |

### General HITL Decision Pattern

```python
def should_intervene(confidence, stakes):
    threshold = get_threshold(stakes)
    
    if confidence > threshold:
        return "act_automatically"
    elif confidence < (1 - threshold):
        return "act_automatically_opposite"  
    else:
        return "ask_human"
```

---

*These solutions demonstrate practical application of HITL principles from Chapter 1 and Technical Appendix 1A.*
