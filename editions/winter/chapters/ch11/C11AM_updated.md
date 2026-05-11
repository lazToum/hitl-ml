# Chapter 11 Solutions Guide: Computer Vision, Adversarial Examples, and HITL

*Complete solutions for all exercises, activities, and discussion questions*

---

## Discussion Question Solutions

### Introductory Level Solutions

#### Question 1: Adversarial Examples
**Prompt:** "A neural network sees a panda and classifies it correctly. You add imperceptible pixel noise and it classifies the image as a gibbon with 99% confidence. What does this tell you about how the neural network 'sees'?"

**Model Strong Answer:**

The adversarial example reveals that the neural network is not performing recognition in the way humans understand it — identifying a panda based on its shape, coloring, body posture, and characteristic features. Instead, the network is detecting statistical patterns in the pixel values that correlate with the label "panda" in its training data.

These statistical patterns are not the semantic features humans use. Some of them involve high-frequency patterns (subtle spatial relationships between pixel values across the image) that are essentially invisible to human perception but are genuinely diagnostic for the network's classification. When you add adversarial noise, you are not changing anything humans consider meaningful, but you are changing exactly the statistical patterns the network relies on.

For the network to "see more like a human," it would need to build representations grounded in the conceptual structure of the visual world — representations of animal bodies, textures, characteristic markings — rather than representations built from statistical correlations in training images. This would require something closer to understanding than pattern matching, which current architectures do not provide.

**Student misconceptions to address:**
- "The network is being tricked" — the network is not being tricked; it's doing exactly what it learned to do. The adversarial noise changes inputs in ways the network's learned features are sensitive to.
- "Better training will fix this" — adversarial training helps but does not eliminate the vulnerability; the root cause is the statistical nature of pattern learning.

**Grading criteria:**
- **A:** Distinguishes statistical pattern detection from semantic understanding; explains why the vulnerability is structural; correctly identifies that human perception processes semantic features not captured by adversarial noise
- **B:** Understands that the network and human are using different features; less precise about why
- **C:** Notes that the network was "fooled" but doesn't explain the mechanism
- **D:** Attributes the failure to the specific network being "bad" or "outdated"

---

#### Question 2: Automation Bias in Radiology
**Prompt:** "Why might seeing an AI's 'all clear' make a radiologist less accurate at catching an abnormality the AI missed?"

**Model Answer:**

This is a manifestation of **automation bias** — the human tendency to over-rely on automated system outputs and reduce independent verification.

The mechanism works as follows: confidence is a social and epistemic signal. When the AI has "already checked" the scan and found nothing, the radiologist's mind updates toward the view that nothing is there. This is actually rational Bayesian behavior in most circumstances — if a good system tells you something is clean, you should increase your probability that it is clean.

The problem arises at the margin: the radiologist becomes less likely to carefully examine regions that the AI has certified as normal, precisely because the AI seems to have already done that work. In the case where the AI is wrong — where the abnormality is exactly in a region the AI missed — the radiologist is now less attentive than they would have been without the AI.

**This is not a failure of the radiologist.** It is a structural consequence of how confident AI systems interact with human attention allocation. The solution is design-based, not training-based:
- Present AI findings after the radiologist's initial read (preserving unbiased first inspection)
- Present regions of interest without confident diagnoses (triggering attention without anchoring conclusion)
- Present the AI's uncertainty as prominently as its findings (changing the epistemic signal)

**Key insight:** The five-dimension framework analysis shows this is an **Intervention Design** failure, not an AI accuracy failure. The AI's accuracy may be perfectly acceptable; how its findings are communicated determines whether it helps or hurts the human's performance.

---

#### Question 3: Autonomous Vehicle Timing
**Prompt:** "At 60 mph, a car travels 88 feet per second. Explain why this is a fundamental design constraint for human-in-the-loop autonomous vehicles."

**Model Answer:**

The arithmetic is simple but its implications are profound. At 60 mph = 88 ft/sec, with human reaction time ~1.5 seconds (recognition + decision + physical response), a car has traveled 132 feet — nearly half a football field — between when the AI identifies a problem and when the human has meaningfully responded.

This makes the naive "AI asks human when uncertain" model unworkable for real-time driving. The uncertainty the AI detects at second zero is a situation at a specific point in space. By the time the human has processed the alert, assessed the scene, and taken action, the vehicle has already passed that point and is encountering whatever comes next.

This constraint shapes the three different HITL architectures we discussed:

**Tesla's response (continuous supervision required):** Treat the human as continuously in the loop, not as an on-demand backup. The human must be engaged at all times, so there's no "handoff" delay. The tradeoff: humans habituate to the automation, and the "engaged supervisor" becomes an inattentive one.

**Waymo's response (remove the in-vehicle human):** If real-time human takeover is physically impossible, don't design for it. Instead, operate only in environments where the AI's confidence is high enough to avoid needing real-time human intervention. Human oversight happens at a different level: remote monitoring, which provides guidance rather than real-time takeover.

**The timing dimension of the Five Dimensions Framework** is at its most extreme in autonomous vehicles. The timing problem is a physics problem, not a software problem — and it forces fundamentally different architectural choices about where the human fits in the loop.

---

### Intermediate Level Solutions

#### Framework Application: Radiology HITL Analysis

**Sample strong answer — five-dimension analysis of AI-assisted chest CT reading:**

| Dimension | Current Implementation | Failure Mode | Improvement |
|-----------|----------------------|-------------|-------------|
| **Uncertainty Detection** | AI outputs confidence scores for each detected nodule | AI is overconfident on edge cases (unusual presentations, rare pathologies) | Calibrate confidence scores against radiologist agreement rates; implement MC Dropout for uncertainty estimation |
| **Intervention Design** | AI findings presented as overlay on scan, with confidence scores | Automation bias: AI findings shown before radiologist's initial read | Two-step workflow: initial unassisted read, then AI comparison ("double read" model) |
| **Timing** | AI findings available immediately when radiologist opens scan | No delay between opening scan and seeing AI findings | Implementation of deliberate sequential workflow; AI findings unlocked after radiologist records initial impression |
| **Stakes Calibration** | Single confidence threshold for all nodules | Does not distinguish routine screening from high-risk patients | Adjust display and thresholds based on patient risk profile, prior imaging history, clinical context |
| **Feedback Integration** | Radiologist override of AI is recorded; periodic model retraining | Feedback captured only when radiologist explicitly overrides, missing passive agreement with incorrect AI finding | Require active confirmation (not just passive acceptance) of AI-clear scans; track case outcomes longitudinally |

**Weakest dimension:** Intervention Design — the presentation format and timing of AI findings drives automation bias, which undermines otherwise adequate performance on the other dimensions.

---

#### Design Question: Automation Bias Minimization Workflow

**Sample strong solution:**

**Phase 1 (Unanchored initial read):**
- Radiologist opens scan
- No AI overlay visible
- Radiologist records: any regions of concern, provisional diagnoses, confidence in assessment
- This takes 3–5 minutes

**Phase 2 (Structured AI comparison):**
- System shows side-by-side: radiologist's annotations + AI findings
- For each AI finding not in radiologist's initial read: show the AI's confidence and the region, ask radiologist to confirm/reject
- For each radiologist finding not in AI's output: ask radiologist to confirm their finding given that AI did not flag it
- Required: explicit response (confirm/reject) for all discrepancies — no passive acceptance

**Phase 3 (Integrated report):**
- System generates report combining radiologist's confirmed findings
- Log all discrepancies for quality review

**Why this works:**
- Phase 1 preserves unanchored human perception (prevents automation bias on missed findings)
- Phase 2 requires explicit engagement with discrepancies (prevents automation bias through passive acceptance)
- The AI is used as a second reader, not as a first filter

**Limitation:** Adds time to workflow. Cost-benefit depends on AI accuracy and on the costs of missed diagnoses in the specific clinical context.

---

### Advanced Level Solutions

#### Active Learning Strategy for Rare Skin Conditions

**Problem:** 10,000 unlabeled images, 500 annotation budget, rare genetic skin conditions.

**Analysis of strategies:**

**Entropy sampling:** Select images where the model is most uncertain (highest entropy). This is fast to compute and generally effective. The problem for rare conditions: early in training, the model may be uncertain about common conditions it hasn't seen enough of, rather than about the rare conditions of greatest interest. Budget could be spent on easy cases just because they're also uncertain.

**BALD:** Selects images that are uncertain in a way that can be reduced by more data (epistemic uncertainty). Better than plain entropy for this task because it specifically targets model knowledge gaps. Still may not specifically target rare conditions.

**Core-set selection:** Selects images to maximize coverage of the feature space. For rare conditions, this is particularly valuable: it ensures that the rare-condition images, which occupy a small region of feature space, are included in proportion to their presence in the unlabeled pool. Downside: computationally expensive (requires computing distances in feature space for all 10,000 images).

**Recommended approach: Hybrid strategy:**

1. **Initial phase** (first 100 examples): Pure core-set selection to ensure coverage of the full feature space, including rare conditions.

2. **Main phase** (next 300 examples): BALD sampling to focus on epistemic uncertainties that can be resolved with more data.

3. **Targeted rare-condition phase** (final 100 examples): If class-imbalanced performance is detected after phase 2, use targeted sampling: select images from underperforming regions of feature space specifically.

```python
def hybrid_active_learning_strategy(model, unlabeled_pool, budget):
    # Phase 1: Coverage
    phase1_size = budget // 5
    phase1_batch = coreset_selection(model, unlabeled_pool, phase1_size)
    
    # Phase 2: Epistemic uncertainty
    phase2_size = (budget * 3) // 5
    phase2_batch = bald_selection(model, unlabeled_pool, phase2_size)
    
    # Phase 3: Targeted rebalancing
    phase3_size = budget - phase1_size - phase2_size
    class_performance = evaluate_per_class(model, validation_set)
    underperforming_classes = [c for c in class_performance 
                               if class_performance[c] < threshold]
    phase3_batch = targeted_selection(model, unlabeled_pool, 
                                      underperforming_classes, phase3_size)
    
    return phase1_batch + phase2_batch + phase3_batch
```

---

## Activity Solutions

### Activity 1: Adversarial Example Demo — Expected Findings

**What students typically observe:**
- Confidence drops with unusual angles more than with minor occlusion
- Color changes can significantly affect classification (models are more sensitive to color than humans for some objects)
- Adding high-contrast stickers or logos creates unpredictable classification shifts
- JPEG compression sometimes changes confidence dramatically, sometimes not at all

**Patterns to highlight:**
- The model's confidence is not monotonically related to how difficult the image is for humans
- Some modifications that are irrelevant to human recognition are highly impactful for the model
- The model can be very confident on images that humans would find ambiguous, and uncertain on images humans find obvious

**Connection to chapter content:** "You've just directly observed that the classifier is detecting different things than you are. Its confidence is tracking something other than the presence of the object. This is why the stop sign stickers work, and why it's not a fixable bug."

---

### Activity 2: Radiology Workflow Design — Sample Strong Deliverable

**Workflow diagram components:**
1. Patient scan loaded → radiologist reads unassisted → records initial impressions
2. AI processes scan → generates finding overlay (not yet shown to radiologist)
3. System presents side-by-side comparison
4. For each AI-only finding: radiologist explicitly confirms or rejects
5. For each radiologist-only finding: system notes and logs (radiologist continues regardless)
6. Final report generated with all confirmed findings and discrepancy log

**Five-dimension analysis:**
- Uncertainty Detection: 4/5 — AI outputs confidence scores; well-calibrated on in-distribution data
- Intervention Design: 5/5 — Sequential workflow prevents anchoring; explicit confirmation required
- Timing: 4/5 — Initial read before AI prevents timing failures; comparison happens when radiologist is already engaged
- Stakes Calibration: 3/5 — Single workflow regardless of patient risk profile; improvement opportunity
- Feedback Integration: 4/5 — All discrepancies logged; outcome tracking enables longitudinal calibration monitoring

---

### "Try This" Exercise — Sample Strong Student Responses

**Assignment:** Image recognition with modifications

**Sample A-grade response:**

"I photographed a coffee mug under three conditions using Google Lens:

1. Normal (straight-on, good lighting): 98% confidence 'coffee mug'
2. Extreme angle (looking down from above at 70°): 62% confidence 'bowl', 24% 'coffee mug'
3. With a small sticker (2cm square, high-contrast geometric pattern): 89% confidence 'measuring cup'

The angle result was expected — I looked at the overhead image myself and could see why it's ambiguous. The sticker result was surprising. The sticker didn't meaningfully change the shape or color of the mug. But the high-contrast geometric pattern apparently triggered something in the classifier that matched 'measuring cup' features.

What this tells me: the classifier is detecting a combination of features, some of which are very local (the sticker pattern) and some of which are more global (the cylindrical shape). Small local changes can outweigh large global features if the local features are strongly predictive in the training data.

For a safety-critical application — like classifying traffic signs, or detecting tumors in medical images — this sensitivity to local patterns is a serious concern. A human would dismiss the sticker as irrelevant context. The classifier incorporated it into its decision."

---

## Assessment Solution Keys

### Framework Analysis — Sample A-Grade Response (Medical Imaging)

**System analyzed:** FDA-authorized AI system for detecting diabetic retinopathy in fundus photographs, deployed in a primary care clinic.

**Framework analysis:**

*Uncertainty Detection (3/5):* The system outputs a binary classification (referable vs. non-referable diabetic retinopathy) with a confidence score. However, the published validation studies show the system is miscalibrated at the extremes — its "80% confidence" cases are actually correct only 71% of the time. There is no mechanism for detecting when a fundus image is outside the distribution the system was trained on (unusual imaging conditions, rare presentations).

*Intervention Design (4/5):* Non-referable cases are cleared automatically; referable cases are flagged for ophthalmologist review with the confidence score displayed. This prevents automation bias on the flagged cases (the flag is salient). However, the automatically cleared cases are not reviewed by any human at all, which means the automated system's false negatives produce zero human safety net.

*Timing (5/5):* The system processes images and provides findings before the primary care physician concludes the visit, allowing same-day referral for positive cases. The timing is well-matched to the clinical workflow.

*Stakes Calibration (3/5):* The system uses a single threshold for all patients. However, patients with long-standing poorly controlled diabetes face higher risk of rapid progression — for them, a lower-confidence positive should trigger referral rather than clearance. The system's stakes calibration does not incorporate clinical context.

*Feedback Integration (2/5):* Outcomes (did the referred patients actually have diabetic retinopathy? did the cleared patients develop it?) are not fed back systematically to the AI developer. Performance monitoring depends on voluntary incident reporting. There is no systematic mechanism for detecting distribution shift as patient populations or imaging equipment change.

**Weakest dimension:** Feedback Integration — the system is deployed without systematic outcome tracking, meaning silent performance degradation could occur without detection.

**Proposed improvement:** Implement a closed-loop monitoring system: (1) track 6-month ophthalmology outcomes for a random 10% sample of cleared cases; (2) compute monthly calibration error comparing predicted confidence with actual accuracy; (3) trigger human review of system performance when calibration error increases by more than 5 percentage points from baseline. This converts the deployed system from a locked device into a monitored one, addressing the most critical gap in the current design.

---

*This solutions guide provides technically rigorous model answers grounded in the chapter's content, with clear grade-differentiated criteria that allow consistent evaluation across sections.*
