# Chapter 1 Solutions Guide: Exercise Solutions & Answer Keys

*Complete solutions for all exercises, activities, and discussion questions*

---

## Discussion Question Solutions

### Introductory Level Solutions

#### Question 1: Recognition Examples
**Prompt:** "Give three examples of technology asking you for help. Why do you think it asks instead of just making a decision?"

**Sample Strong Answers:**
1. **Banking app asking to confirm unusual purchases**
   - *Why:* High cost of false positives (blocking legitimate transactions) vs. low cost of asking
   - *Uncertainty type:* Unusual pattern detection with high stakes
   - *Framework dimension:* Stakes Calibration—financial impact justifies interruption

2. **Voice assistant saying "I found this on the web"**
   - *Why:* Low confidence in ability to directly answer; safer to provide source than guess
   - *Uncertainty type:* Knowledge boundary recognition
   - *Framework dimension:* Uncertainty Detection—recognizes it doesn't "know" the answer

3. **Photo app asking "Is this [person's name]?"**
   - *Why:* Facial recognition confidence below threshold; privacy implications of wrong tagging
   - *Uncertainty type:* Aleatoric uncertainty due to image quality/angle
   - *Framework dimension:* Intervention Design—simple yes/no reduces cognitive load

**Grading Criteria:**
- **Excellent:** Three clear examples with accurate analysis of why the system asks, references to framework dimensions
- **Good:** Three examples with basic understanding of uncertainty concepts
- **Satisfactory:** Three examples but limited analysis
- **Needs Improvement:** Fewer than three examples or misunderstands the concept

#### Question 2: Netflix Analysis
**Prompt:** "Netflix could easily keep playing episodes forever. Why doesn't it? What are the costs and benefits?"

**Model Answer:**

**Costs of asking:**
- User annoyance/interruption
- Potential for users to stop watching when they would have continued
- Development and maintenance of detection algorithms

**Benefits of asking:**
- Bandwidth savings (significant operational cost)
- Better user experience (don't lose place in series)
- Reduced server load
- More accurate viewing analytics
- Regulatory compliance (data usage transparency)

**Framework Analysis:**
- **Uncertainty Detection:** Netflix monitors engagement signals (interaction, time)
- **Timing:** After 3 episodes or 90 minutes—rules-based, predictable
- **Stakes Calibration:** Low stakes (minor annoyance) justify asking even when uncertain
- **Intervention Design:** Simple yes/no—minimal cognitive load
- **Feedback Integration:** User response informs future thresholds

**Why they ask:** Cost-benefit analysis shows savings outweigh interruption costs. The Stakes Calibration dimension tells us: when stakes are low and uncertainty is moderate, asking is almost always the right choice.

**Student Misconceptions to Address:**
- "It's just about bandwidth" (ignores user experience benefits)
- "They should detect activity differently" (explain current detection limitations)
- "It's always annoying" (help students recognize when they appreciate it)

#### Question 3: Netflix vs. Nest Comparison
**Prompt:** "Compare the Netflix 'Are you still watching?' prompt to the Nest thermostat's Home/Away detection. One asks for help, one doesn't. What are the consequences of each approach?"

**Model Answer:**

| Aspect | Netflix | Nest Thermostat |
|--------|---------|-----------------|
| **Uncertainty Detection** | ✓ Monitors engagement signals | ✗ Binary decision from sensors |
| **Intervention Design** | ✓ Simple yes/no button | ✗ No intervention mechanism |
| **Timing** | ✓ Clear rules (3 episodes/90 min) | ⚠ Variable (30 min to 2 hours) |
| **Stakes Calibration** | ✓ Low stakes, can afford to ask | ✗ Doesn't distinguish mild discomfort from pipes freezing |
| **Feedback Integration** | ✓ Learns from responses | ⚠ Limited—requires manual override |

**Consequences:**

**Netflix (asks):**
- Occasional minor annoyance
- Saves bandwidth when users are actually away
- Users feel respected ("it asked instead of assuming")
- Rare failures (interrupts engaged user) are low-cost

**Nest (doesn't ask):**
- Users wake up freezing: "I woke up to a cold house because it thought I was away"
- Forum complaints: "Nest keeps saying I'm away when I'm home"
- Trust erosion: Users disable "smart" features, defeating the purpose
- High-cost failures when the system is wrong

**Key Insight:** The system that asks is perceived as "smarter" even though it might seem less autonomous. The system that acts confidently without asking creates more user frustration.

#### Question 4: Nest Thermostat Redesign
**Prompt:** "If you were redesigning the Nest thermostat, when would you want it to ask the human for input versus making decisions automatically?"

**Sample Solution Framework:**

**Automatic Decisions (High Confidence):**
- Small temperature adjustments (±2°F) within comfortable range
- Schedule-based changes when pattern is well-established
- Energy-saving mode during confirmed long absences (e.g., vacation mode)
- Weather-based preemptive adjustments (heating before cold front)

**Ask for Input (Uncertainty Scenarios):**
- First detection of "Away" after long presence period
- Unusual occupancy patterns detected
- Extreme outside temperature conditions (higher stakes)
- Conflicting signals (motion but no phone, or phone but no motion)
- First-time seasonal transitions
- Manual override patterns suggest dissatisfaction

**Implementation Strategy (Five-Dimension Framework):**

```python
def should_ask_or_act(presence_confidence, stakes, recent_overrides):
    # Stakes Calibration
    if extreme_weather():
        required_confidence = 0.95  # High stakes = need high confidence
    else:
        required_confidence = 0.70  # Lower stakes = can act with less certainty
    
    # Uncertainty Detection + Feedback Integration
    if recent_overrides > 2:
        required_confidence += 0.15  # User has been correcting us
    
    # Intervention Decision
    if presence_confidence > required_confidence:
        return "act_automatically"
    elif presence_confidence < (1 - required_confidence):
        return "act_automatically"  # Very confident they're away
    else:
        return "ask_user"
```

**Interface Design (Intervention Design dimension):**
```
Notification: "Haven't seen activity for 2 hours. 
Should I switch to energy-saving mode? 
[Yes, I'm out] [No, I'm home] [Ask me in 1 hour]"
```

### Intermediate Level Solutions

#### Framework Application: Uber Surge Pricing
**Prompt:** "Apply the five-dimension framework to analyze Uber's surge pricing notifications."

**Sample Strong Answer:**

| Dimension | Rating | Analysis |
|-----------|--------|----------|
| **Uncertainty Detection** | 4/5 | System knows demand/supply imbalance with high confidence; uncertainty is in user's willingness to pay |
| **Intervention Design** | 4/5 | Clear notification with exact multiplier, requires explicit acceptance ("Accept 2.3x surge") |
| **Timing** | 5/5 | Asks at exactly the right moment—before booking, when decision matters |
| **Stakes Calibration** | 3/5 | Treats all rides similarly; doesn't distinguish urgent medical need from casual trip |
| **Feedback Integration** | 4/5 | User acceptance/rejection directly affects future pricing algorithms |

**Weakest Dimension:** Stakes Calibration. The system doesn't know *why* you need a ride. A 3x surge for a bar-to-home trip is different from 3x surge for a hospital emergency.

**Improvement Suggestion:** Allow users to indicate "urgent" rides that bypass surge (perhaps with post-ride verification) or at least provide context ("High demand due to rain" helps users decide).

#### Design Question: AI Essay Grading
**Prompt:** "Design the 'asking for help' strategy for an AI system that helps teachers grade student essays."

**Comprehensive Solution:**

**Uncertainty Triggers (Uncertainty Detection):**
1. **Content Analysis Uncertainty:**
   - Unusual writing style for known student (possible plagiarism or growth)
   - Topic drift or unclear thesis
   - Creative/artistic responses to structured prompts
   - Potential plagiarism flags with low confidence

2. **Technical Quality Uncertainty:**
   - Borderline grammar/spelling issues
   - Complex sentence structures difficult to parse
   - Non-standard English dialects or ESL patterns

3. **Subjective Assessment Uncertainty:**
   - Responses near grade boundaries (B+/A- borderline)
   - Creative interpretations of assignment requirements
   - Evidence of exceptional insight that doesn't fit rubric

**Human Intervention Strategy (Timing + Stakes Calibration):**

```
High Priority (Immediate Review):
├─ Potential academic integrity violations (high stakes)
├─ Grades >1 letter different from student's historical average
└─ Responses AI cannot categorize at all

Medium Priority (Batch Review):
├─ Borderline grades (within 5 points of cutoff)
├─ Technical issues affecting readability
└─ Unusual but potentially valuable creative responses

Low Priority (Optional Review):
├─ Random sample for calibration (maintains system accuracy)
└─ Review AI reasoning for transparent grading
```

**Interface Design (Intervention Design):**
- Show AI confidence scores to teacher
- Highlight specific sentences/phrases causing uncertainty
- Provide suggested grade *ranges* rather than point values
- Include links to similar essays for comparison
- Offer "quick confirm" vs. "full review" options

**Feedback Integration:**
- Teacher corrections update model understanding
- Track which types of essays cause most uncertainty
- Adjust confidence thresholds based on teacher override patterns

### Advanced Level Solutions

#### Technical Implementation Question
**Prompt:** "How would you implement an optimal intervention threshold for a medical diagnosis system?"

**Solution Framework:**

**1. Data Collection:**
```python
training_data = {
    'medical_images': preprocessed_scans,
    'expert_diagnoses': ground_truth_labels,
    'confidence_scores': model_uncertainty_estimates,
    'human_review_outcomes': expert_corrections,
    'cost_parameters': {
        'false_positive_cost': delayed_treatment_cost,  # ~$200
        'false_negative_cost': missed_diagnosis_cost,   # ~$50,000+
        'human_review_cost': radiologist_time_cost      # ~$50
    }
}
```

**2. Stakes-Calibrated Threshold:**
```python
def calculate_optimal_threshold(costs):
    """
    Using the Stakes Calibration dimension:
    θ* = C_FP / (C_FP + C_FN)
    
    For medical diagnosis with high FN costs:
    θ* = 200 / (200 + 50000) = 0.004
    
    This means: flag for review if confidence < 99.6%
    """
    threshold = costs['false_positive_cost'] / (
        costs['false_positive_cost'] + costs['false_negative_cost']
    )
    return threshold
```

**3. Uncertainty Estimation:**
```python
def estimate_uncertainty(model, input_image, method='ensemble'):
    if method == 'ensemble':
        predictions = [model_i(input_image) for model_i in ensemble]
        mean_pred = np.mean(predictions, axis=0)
        uncertainty = np.std(predictions, axis=0)
        
    elif method == 'mc_dropout':
        predictions = []
        for _ in range(n_samples):
            model.train()  # Enable dropout
            pred = model(input_image)
            predictions.append(pred)
        
        mean_pred = torch.mean(torch.stack(predictions), dim=0)
        uncertainty = torch.std(torch.stack(predictions), dim=0)
    
    return mean_pred, uncertainty
```

**4. Evaluation Metrics (Five-Dimension Assessment):**
```python
def evaluate_hitl_system(threshold, test_data):
    metrics = {
        # Uncertainty Detection quality
        'calibration_error': expected_calibration_error(confidences, accuracies),
        
        # Intervention quality
        'precision_intervention': tp_interventions / (tp_interventions + fp_interventions),
        'recall_intervention': tp_interventions / (tp_interventions + fn_interventions),
        
        # System-level performance
        'system_accuracy': correct_predictions / total_predictions,
        
        # Cost-effectiveness (Stakes Calibration)
        'cost_effectiveness': total_benefit / total_cost,
        
        # Human factors
        'human_workload': interventions_per_hour,
    }
    return metrics
```

---

## Activity Solutions

### Activity 1: HITL Detection Hunt - Solution Guide

**Setup:** Students find 5 examples of systems asking for human input

**Sample Student Findings with Framework Analysis:**

#### Strong Example: Two-Factor Authentication
- **System:** Banking/email login
- **Uncertainty Detection:** Unusual login location/device detected
- **Intervention Design:** Code sent via SMS, simple entry
- **Timing:** At moment of login attempt (synchronous)
- **Stakes Calibration:** High (security breach) justifies interruption
- **Feedback Integration:** Successful logins from new device update trust

#### Strong Example: "Did you mean?" Search Suggestions
- **System:** Google/search engines
- **Uncertainty Detection:** Typo probability calculated
- **Intervention Design:** Shows both original and suggestions (low commitment)
- **Timing:** After search, before results (perfect timing)
- **Stakes Calibration:** Low stakes, can afford to suggest
- **Feedback Integration:** Click on suggestion = confirmation

#### Framework Classification Exercise:
Have students sort their findings by weakest dimension:

| Example | Weakest Dimension | Why |
|---------|------------------|-----|
| Cookie consent banners | Timing | Asks before user engagement |
| App permission requests | Stakes Calibration | Treats all permissions equally |
| Voice assistant "I don't understand" | Intervention Design | Doesn't explain *why* confused |

### Activity 2: Nest Thermostat Redesign - Solution Guide

**Scenario:** Redesign Nest Home/Away detection using the five-dimension framework

**Sample Strong Solution:**

#### Problem Analysis:
Current Nest fails on multiple dimensions:
- **Uncertainty Detection:** Binary home/away, no confidence expression
- **Intervention Design:** Never asks
- **Stakes Calibration:** Doesn't adjust for weather conditions
- **Feedback Integration:** Manual overrides don't improve future predictions

#### Redesign Solution:

**1. Uncertainty Detection Enhancement:**
```python
def calculate_presence_confidence(signals):
    confidence_score = 0.5  # Start neutral
    
    if motion_detected_recently:
        confidence_score += 0.3
    if phone_in_geofence:
        confidence_score += 0.25
    if typical_home_time:
        confidence_score += 0.15
    if smart_device_activity:  # TV, lights, etc.
        confidence_score += 0.1
        
    return min(confidence_score, 1.0)
```

**2. Stakes-Adjusted Thresholds:**
```python
def get_threshold(weather, current_setting):
    base_threshold = 0.7
    
    # Higher stakes = need more confidence
    if outside_temp < 32:  # Freezing
        return 0.95
    elif outside_temp > 90:  # Very hot
        return 0.90
    elif abs(outside_temp - current_setting) > 20:
        return 0.85
    else:
        return base_threshold
```

**3. Intervention Design:**
```
┌─────────────────────────────────────────┐
│  🏠 Nest Home Status                    │
│                                         │
│  I haven't detected activity for        │
│  2 hours. It's 28°F outside.            │
│                                         │
│  Should I switch to Away mode?          │
│                                         │
│  [Yes, I'm out]  [No, I'm home]        │
│  [Snooze 1 hour] [Don't ask today]     │
└─────────────────────────────────────────┘
```

**4. Feedback Integration:**
```python
def update_model(user_response, context):
    if response == "no_im_home":
        # We were wrong - lower confidence in similar situations
        adjust_presence_model(context, direction="more_conservative")
        
    if response == "dont_ask_today":
        # User is working from home - learn this pattern
        learn_wfh_pattern(context.day_of_week)
```

### Activity 3: Cost-Benefit Analysis - Solution Guide

**Scenario:** Email spam filter intervention frequency

**Given Parameters:**
- Spam detection accuracy: 95% without human intervention
- Human review accuracy: 99%
- Cost of missed spam: $2 (user time + annoyance)
- Cost of blocked legitimate email: $50 (business impact)
- Cost of human review: $0.10 per email
- Spam rate: 40%

**Mathematical Solution:**

#### Without Human Review:
```
Expected cost per email = 
  P(spam) × P(miss|spam) × C_miss + 
  P(not_spam) × P(block|not_spam) × C_block
  
= 0.40 × 0.05 × $2 + 0.60 × 0.05 × $50
= $0.04 + $1.50 = $1.54 per email
```

#### With Optimal Human Review:
```python
def calculate_optimal_threshold():
    best_cost = float('inf')
    best_threshold = 0
    
    for review_rate in np.linspace(0, 1, 100):
        # Assume we review emails where confidence is lowest
        # Review improves accuracy to 99%
        
        auto_cost = (1 - review_rate) * 1.54  # Unreviewed emails
        review_cost = review_rate * (
            0.01 * 0.40 * 2 +      # Reviewed, still miss spam
            0.01 * 0.60 * 50 +     # Reviewed, still block legitimate
            0.10                    # Review cost
        )
        
        total_cost = auto_cost + review_cost
        
        if total_cost < best_cost:
            best_cost = total_cost
            best_threshold = review_rate
    
    return best_threshold, best_cost

# Result: Review ~30% of emails (lowest confidence ones)
# Expected cost drops from $1.54 to ~$0.95 per email
```

**Key Insight:** Stakes Calibration matters—the high cost of blocking legitimate email ($50 vs $2 for spam) means we should be more aggressive about reviewing emails the system thinks are spam.

---

## "Try This" Exercise - Sample Student Responses

**Assignment:** Count HITL moments over 24 hours

**Sample Strong Response:**

"I counted 23 HITL moments in 24 hours. Here are the most interesting:

1. **Bank app fraud alert** (morning coffee purchase at new location)
   - Timing: Perfect—immediate, while I still had context
   - Intervention: Simple "Yes/No" text response
   - Would improve: Tell me *why* it flagged (was it the location or amount?)

2. **Google Maps "Faster route available"** (during commute)
   - Timing: Good—offered alternative without forcing change
   - Stakes awareness: High traffic = more aggressive about suggesting
   - Weakness: Didn't explain *how much* faster (2 min vs 20 min matters)

3. **iPhone asking to update** (6th time this week)
   - Timing: TERRIBLE—asked during video call
   - Clear alert fatigue—I've started ignoring these
   - Framework failure: No Stakes Calibration (treats all moments equally)

4. **Nest thermostat switched to Away** (while I was reading quietly)
   - This is the example from the chapter! It DIDN'T ask.
   - I was home but hadn't walked past the sensor.
   - Came back to a 62°F house.

**Patterns I noticed:**
- Systems that ask are generally more trustworthy
- Financial apps have the best intervention timing
- Smart home devices have the worst (or no) intervention design
- The more a system asks unnecessarily, the more I ignore it"

---

## Quick Reference: Common Student Questions & Answers

### "Why don't they just make the AI better instead of asking humans?"

**Answer:** There are fundamental limits to what any system can know with certainty. Even perfect AI will encounter:
- Situations not in training data (epistemic uncertainty)
- Inherently random events (aleatoric uncertainty)
- Changing environments and user preferences
- Edge cases where stakes are too high for any uncertainty

**Framework connection:** The Uncertainty Detection dimension isn't about eliminating uncertainty—it's about *recognizing* it. Even a perfect AI would still need to know when to ask.

### "Isn't asking just an excuse for lazy programming?"

**Answer:** Actually the opposite—implementing good uncertainty quantification requires sophisticated engineering:
- Confidence estimation algorithms
- Calibration methods
- User interface design (Intervention Design)
- Cost-benefit optimization (Stakes Calibration)
- A/B testing frameworks
- Feedback integration systems

**Teaching moment:** Show the Technical Appendix complexity. Asking well is harder than not asking at all.

### "How do you know when the human is wrong?"

**Answer:** 
- Humans aren't always right, but they're right about *different things* than AI
- Multiple human opinions can be aggregated
- Domain expertise matters (radiologist vs. random person)
- Systems can learn from patterns in human corrections (Feedback Integration)
- The goal is better *joint* performance, not perfect individual performance

**Framework connection:** The Feedback Integration dimension handles this—good systems learn from human responses over time, even when humans are occasionally wrong.

### "Why did the Air Canada chatbot case matter legally?"

**Answer:**
- Tribunal explicitly rejected "the chatbot is a separate entity" argument
- Companies are responsible for ALL information on their website, including AI-generated content
- Sets precedent: You can't blame your tools for your failures
- Implies companies MUST build uncertainty detection into customer-facing AI

**Framework connection:** Air Canada's chatbot failed on Uncertainty Detection (didn't know it was wrong) AND Intervention Design (no escalation path). This wasn't just bad UX—it was legally liable.

---

## Assessment Solution Keys

### Framework Analysis Paper - Sample A-Grade Response

**Technology Analyzed:** Google Maps Navigation

**Framework Application:**

| Dimension | Rating | Evidence |
|-----------|--------|----------|
| Uncertainty Detection | 5/5 | Displays confidence in ETA as range ("15-22 min"), acknowledges traffic uncertainty |
| Intervention Design | 4/5 | Offers alternatives clearly, but sometimes too many options overwhelm |
| Timing | 5/5 | Re-routing suggestions come at decision points (intersections), not mid-highway |
| Stakes Calibration | 3/5 | Doesn't distinguish "running late for flight" from "casual drive" |
| Feedback Integration | 5/5 | User route choices improve future suggestions; traffic reports integrated |

**Weakest Dimension Analysis:**
Stakes Calibration is the weakest dimension. Google Maps treats all trips equally—a 5-minute delay is presented the same way whether I'm leisurely exploring or racing to catch a flight. This could be improved by:
1. Allowing users to mark "time-sensitive" trips
2. Learning from calendar integration (meeting in 20 min = higher stakes)
3. Adjusting notification urgency based on buffer time

**Improvement Proposal:**
Add a "Priority Mode" that:
- Asks users to indicate urgency before starting navigation
- Adjusts re-routing aggressiveness based on stakes
- Provides proactive delays warnings for time-sensitive trips
- Learns which trips are typically time-sensitive (work commute vs. weekend drive)

This would strengthen the Stakes Calibration dimension without sacrificing the strong Uncertainty Detection and Timing that already exist.

---

This solutions guide provides instructors with:
✅ **Confidence** in facilitating discussions
✅ **Consistency** in grading across sections  
✅ **Depth** to handle advanced student questions
✅ **Framework alignment** throughout all answers
✅ **Flexibility** to adapt answers to specific contexts

The solutions demonstrate learning objectives while teaching students to apply the five-dimension framework systematically.
