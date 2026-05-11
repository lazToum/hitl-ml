# Chapter 2 Solutions Guide: When Smart Systems Get Confused

*Model answers for all discussion questions, activities, and exercises*

---

## Discussion Question Solutions

### Introductory Level Solutions

#### Question 1: The Radiologist Story
**Prompt:** "Dr. Anand's AI didn't give the right diagnosis but still saved the patient. How? What exactly did the AI do correctly?"

**Model Answer:**

The AI performed its most important function correctly: it expressed calibrated uncertainty. The system output a confidence score of 51% — essentially a coin flip — rather than a confident-but-wrong diagnosis.

By expressing uncertainty, the system:
1. Triggered human review (Dr. Anand looked more carefully)
2. Communicated that the case was at the boundary of its knowledge
3. Avoided the most dangerous failure mode: confidently wrong output

**What the AI did right:**
- Detected that it didn't know (Uncertainty Detection, Dimension 1)
- Surfaced that uncertainty explicitly rather than burying it
- Routed the case appropriately to the expert

**What the AI did not do (and didn't need to):**
- Diagnose correctly — this was beyond its knowledge
- Explain *why* it was uncertain — though this would have been additional value

**Grade Band Examples:**

*A-grade response:* "The AI correctly implemented the Uncertainty Detection dimension of the HITL framework. By outputting 51% confidence rather than a confident diagnosis, it signaled to Dr. Anand that the case was at the edge of its training. This is the system working as designed — the AI's value wasn't in diagnosing the fungal infection but in flagging that something unusual was happening. This is better than a confidently wrong 90% score would have been, because confident errors are invisible. The 51% made the uncertainty visible and actionable."

*B-grade response:* "The AI flagged that it wasn't confident, which made the doctor look more carefully. Without that flag, she might have glanced at a routine-looking image and missed the rare infection. So the AI's value was in its honest uncertainty, not its diagnosis."

*C-grade response:* "The AI said it wasn't sure, so the doctor checked again and found the real problem."

*Common wrong answers:*
- "The AI found the cancer" — No, the CT scan found it. The AI triggered the CT.
- "The AI failed and the doctor succeeded" — Partially right, but misses that the AI's uncertainty expression was itself a success.

---

#### Question 2: Aleatoric vs. Epistemic
**Prompt:** "Explain the difference between aleatoric and epistemic uncertainty in your own words. Give one example of each."

**Model Answer:**

**Aleatoric uncertainty** is uncertainty baked into the situation itself. No matter how good the system is or how much it learns, some ambiguity remains because the signal simply isn't there. A blurry photograph will always be blurry; a recording in a thunderstorm will always be noisy; a medical test with a 15% false positive rate will always have that false positive rate. More training doesn't fix it.

**Epistemic uncertainty** is uncertainty from incomplete knowledge. The system doesn't know something that *could* be known — by a human expert, by a different model, or by the same model after more training. It's the difference between "no one could know this" and "I haven't learned this yet."

*Personal examples students should be able to generate:*
- Weather forecast for 10 days from now: mostly aleatoric (chaos in atmospheric systems)
- Voice recognition for a language the app doesn't support: epistemic (training gap)
- Spell-checker flagging a name from a culture not in its dictionary: epistemic
- Autocorrect failing on a poorly handwritten screenshot: aleatoric

**HITL Implication to Include:** Human review reliably helps with epistemic uncertainty (the human knows what the model doesn't). Human review doesn't reliably help with aleatoric uncertainty (the human faces the same fog).

---

#### Question 3: Medical AI vs. Air Canada Chatbot Comparison
**Prompt:** "Compare how the medical imaging AI and the Air Canada chatbot handled their uncertainties."

**Model Answer:**

| Dimension | Medical AI | Air Canada Chatbot |
|-----------|-----------|-------------------|
| Was the system uncertain? | Yes (epistemic — rare condition) | Yes (missing/wrong training) |
| Did it express uncertainty? | Yes — 51% confidence score | No — confident-sounding answer |
| Type of failure mode | None — signaled correctly | Silent failure |
| Human response possible? | Yes — radiologist reviewed | No — user had no signal |
| Outcome | Rare infection caught | Patient given wrong policy, financial loss |

**Key insight:** Both systems encountered something outside their reliable knowledge. The medical AI surfaced that uncertainty; the chatbot buried it. The difference is not in capability but in design philosophy. The chatbot was built to appear knowledgeable; the AI was built to be honest about its knowledge limits.

---

#### Question 4: Voice Recognition Accents
**Prompt:** "A voice recognition system has 40% word error rate on Scottish accents but 5% on Midwestern American accents. What type of uncertainty? Should it flag its output differently?"

**Model Answer:**

**Type:** Epistemic uncertainty — the model was trained primarily on Midwestern American English and lacks sufficient Scottish accent examples. The accent is clear to any human listener; the model simply hasn't learned to process it.

**Should it flag differently?** Yes, for several reasons:

1. The accuracy difference is dramatic (8x higher error rate), which changes the HITL calculus.
2. Users of a system with 40% error rate but no uncertainty signal will over-trust incorrect transcriptions.
3. For high-stakes applications (court transcription, medical documentation), the difference is critical.

**Recommended design:**
- Detect input accent/dialect and estimate accuracy accordingly
- Apply lower confidence scores to accents underrepresented in training data
- Flag transcriptions with high modeled error probability for human review
- In the interface: "Transcription confidence: Low — please review carefully"

**Broader point:** The system should not present a Scottish-accented input transcript with the same visual confidence as a Midwestern input. The system *knows* (or can learn) that its performance is degraded. Presenting both with equal confidence is a design choice to hide epistemic uncertainty — the Nest thermostat problem applied to speech.

---

### Intermediate Level Solutions

#### Framework Application: Radiology AI, Five Dimensions
**Prompt:** "Apply the Five Dimensions framework to the radiology AI scenario."

**Model Answer:**

| Dimension | Assessment | Evidence |
|-----------|-----------|---------|
| Uncertainty Detection | Strong (5/5) | Outputs 51% confidence score; system knows it's uncertain |
| Intervention Design | Good (4/5) | Flags as "recommend clinical review" — clear action signal; could include *why* uncertain |
| Timing | Good (4/5) | Flags before radiologist's review, not after — appropriate |
| Stakes Calibration | Strong (5/5) | Medical setting — presumably high threshold for auto-diagnosis |
| Feedback Integration | Unknown (?) | Does Dr. Anand's correct diagnosis improve the model? Not described |

**Weakest Dimension:** Feedback Integration. The story describes a one-time interaction; we don't know whether the radiologist's correction (the confirmed diagnosis) was fed back to improve the model. In many deployed medical AI systems, human corrections are logged but not used in real-time learning. This is a missed opportunity.

**Strongest Dimension:** Uncertainty Detection. The 51% output is precisely calibrated — the model genuinely was nearly equivocal between two diagnoses. It knew what it didn't know.

---

#### Design Challenge: College Admissions Essay AI
**Prompt:** "A college uses an AI to score admissions essays. Accuracy drops from 85% to 62% for non-standard essays. Design an uncertainty system."

**Model Answer:**

**Step 1: Identify uncertainty type**
- Non-standard essays (highly creative, non-native English, unusual backgrounds) represent epistemic uncertainty — the model hasn't been trained on diverse essay styles.
- Human admissions readers typically can evaluate these well, confirming it's epistemic.

**Step 2: Uncertainty signaling strategy**

```
High confidence (>0.85): Auto-score, no flag needed (~70% of essays)
Medium confidence (0.65–0.85): Score + soft flag: "Reviewer attention recommended" (~15%)
Low confidence (<0.65): Score + hard flag: "Human review required" (~15%)
```

**Step 3: Routing threshold**
- With 20% human review capacity:
  - Route the lowest 20% of confidence scores to human review
  - This captures most of the high-uncertainty essays without exceeding capacity
  - Do *not* simply route all essays with scores in a certain range — route by confidence, not score value

**Step 4: Reviewer interface**
- Show AI score + confidence interval, not just the point estimate
- Highlight which scoring rubric dimensions drove the uncertainty
- Show similar essays (nearest training examples) for calibration
- Allow quick "confirm/override/send back for more review" options

**Step 5: Alert fatigue prevention**
- Calibrate so that flagged essays are genuinely uncertain — not just unusual
- Track reviewer override rates; if reviewers rarely change AI scores even on flagged essays, the threshold is too low

---

### Advanced Level Solutions

#### Calibration Strategy: Cross-Hospital Deployment
**Prompt:** "A model trained on one hospital's population is deployed at another. How does calibration change? What corrections apply?"

**Model Answer:**

**Expected calibration change:** Under dataset shift (training and deployment populations differ), calibration typically degrades — the model's confidence scores no longer accurately predict accuracy on the new population. Direction of change depends on the shift:
- If the new hospital serves a sicker population (more rare conditions), the model may be overconfident on unusual presentations it hasn't seen.
- If demographic differences change image quality or disease prevalence, calibration gaps open up.

**Correction approaches:**

1. **Collect a new calibration set from the deployment hospital** — ideally 1,000+ labeled cases.
2. **Refit temperature scaling** on the new calibration set. This is a single parameter, fast to fit, and handles systematic overconfidence.
3. **If accuracy drops significantly (not just calibration), consider fine-tuning** on the deployment hospital's data — recalibration alone cannot fix genuine accuracy gaps.
4. **Monitor calibration continuously** as deployment continues — early patient populations may not represent the full deployment distribution.

**What not to do:** Simply apply the training hospital's temperature parameter to the new hospital — this assumes the same calibration relationship holds, which it may not.

---

## Activity Solutions

### Activity 1: Uncertainty Type Sorting — Instructor Key

| Scenario | Type | Human Review Helps? |
|----------|------|-------------------|
| Speech in storm | Aleatoric | Marginally — same noise affects human |
| New product category | Epistemic | Yes — human recognizes new category |
| Sarcasm detection | Epistemic | Yes — humans recognize sarcasm (usually) |
| Two simultaneous rare conditions | Mixed | Yes for epistemic component |
| Untranslatable word | Epistemic | Yes — human translator can handle |
| Legitimate-but-unusual transaction | Aleatoric | Marginally — cardholder has context |

**Debrief insight:** There are few pure aleatoric cases — most real-world AI uncertainty has an epistemic component. But for cases with a strong aleatoric component, human review should be designed to provide *additional context* (cardholder knows they were traveling), not just a second opinion on the same evidence.

### Activity 2: Calibration Intuition — Solutions

| System | Calibration Gap | Assessment |
|--------|----------------|-----------|
| Weather (90% stated, 85% actual) | 5% gap | Slightly overconfident, acceptable |
| Spam filter (95% stated, 95% actual) | 0% gap | Well calibrated |
| Medical chatbot (99% stated, 72% actual) | 27% gap | Dangerously overconfident |
| Navigation (95% stated, 70% actual) | 25% gap | Significantly overconfident |

**Most dangerous:** The medical chatbot — highest-stakes application with the largest calibration gap. Users trust it far more than they should.

**Teaching point:** In high-stakes domains, overconfidence is more dangerous than underconfidence. A medical chatbot that said "I'm 72% confident" would enable appropriate HITL (users would verify before acting). A chatbot that says "I'm 99% confident" trains users to skip verification.

### Activity 3: Design Challenge — Sample Strong Solution

**Admissions AI Uncertainty Design:**

*Uncertainty signals:*
1. Confidence score (displayed as percentage to admissions officers)
2. "Flagged for review" indicator at <70% confidence
3. Specific uncertainty reasons: "Essay structure differs significantly from training examples" / "Syntax patterns suggest non-native writer — accuracy may vary"

*Review routing:*
- 80% auto-scored; 20% flagged
- Within flagged: sort by confidence ascending (most uncertain first)
- Priority flag: essays near score thresholds (accept/waitlist/reject boundaries) + low confidence

*Reviewer interface design:*
- Show AI score range, not point estimate: "65–75" rather than "70"
- Show which rubric categories are most uncertain
- 3 reviewer actions: Confirm / Modify / Escalate (to senior reviewer)
- Estimated review time: 3 minutes per essay

*Feedback integration:*
- Track reviewer overrides; high override rate on certain essay types = recalibrate model for those types
- Annual retraining with confirmed-correct scores from all reviewed essays

---

## "Try This" Exercise — Model Student Responses

**Sample Strong Response:**

"I tracked uncertainty signals for a week. Most interesting findings:

1. **Google Maps** showed a range ('15–22 minutes') during heavy traffic — this is honest uncertainty communication. I found it useful and adjusted my departure time.

2. **Email spam folder** — I noticed several legitimate cold emails had been filtered. The system gave no indication of *why* or how confident it was. I would have found 'Possible spam — marketing language' much more useful than silent filtering.

3. **iPhone autocorrect** — one correction was clearly wrong (changed a proper noun I'd typed correctly). No uncertainty flag. This is the Air Canada problem at tiny scale.

4. **Weather app** — always showed probability of rain percentage. I trusted the 80% forecasts more than the 90%+ ones because I noticed they were actually right more often.

**Pattern:** Apps with confidence signals (Maps, Weather) let me make better decisions. Apps without confidence signals (Autocorrect, Spam filter) occasionally misled me without warning. The absence of an uncertainty signal is itself a kind of overconfidence."

---

## Quick Reference: Common Questions

### "Why can't we just ask a human to review everything?"
Human review costs time, attention, and money. At scale: a spam filter processing 100 million emails per day cannot route all 100 million to human reviewers. Even at 1 second per email, full review would require 3,000 person-years of work per day. Calibrated routing selects the cases where human judgment adds the most value.

### "Isn't all AI uncertainty epistemic, since models can always be improved?"
In principle yes — with infinite data and perfect models, all uncertainty could be eliminated. But in practice, the timescales differ enormously. Aleatoric uncertainty (blurry photo) is irreducible with current data; epistemic uncertainty (missing training class) is reducible with targeted data collection. For HITL design purposes, the operational distinction is: "Would a human expert looking at the same input be uncertain?" Yes → aleatoric component. No → epistemic.

### "What if the human reviewer is also wrong?"
Human expertise isn't infinite, and human errors are real. The HITL argument isn't that humans are infallible — it's that:
1. Human and AI errors are often *different* errors (they fail on different cases)
2. The combination is stronger than either alone (complementarity)
3. For epistemic uncertainty specifically, domain expertise typically exceeds model knowledge in edge cases

Chapter 4 will address this further with the discussion of error costs and threshold optimization.
