# Chapter 16 Solutions Guide: Exercise Solutions and Answer Keys

*Beyond Text and Images — model answers, grade bands, and discussion frameworks*

---

## Discussion Question Solutions

### Introductory Level Solutions

#### Question 1: Prosody Gap

**Prompt:** "A customer service AI analyzes the words of customer complaints to determine urgency. What is it missing?"

**Model Answer:**

A text-only system misses:
- **Vocal affect**: Raised voice, flat affect, emotional fatigue — all carry urgency information not encoded in words
- **Pace and rhythm**: Rapid speech may indicate agitation; long pauses may indicate confusion or distress
- **Intonation**: The same words with different intonation carry different meanings. "That's fine" said flatly is often the opposite of fine
- **Involuntary signals**: Tremor in the voice, crying, shallow breathing — signals of psychological or physical distress that words may not explicitly name

**HITL Design Response:**
A well-designed system would:
1. Run a parallel prosodic analysis model alongside the semantic model
2. Escalate to human review when the two models disagree (high semantic score + low prosodic distress, or vice versa)
3. Flag cases where prosodic signals indicate distress even if words do not
4. Provide the human reviewer with both the transcript and the audio

**Grade Bands:**
- **A:** Names 2+ specific prosodic features, explains why text misses them, proposes concrete HITL design element
- **B:** Names 1–2 features, connects to HITL escalation need
- **C:** Identifies the gap vaguely ("tone," "emotion") without specifics
- **D:** Does not identify a meaningful gap beyond what text captures

#### Question 2: The 0.1% Problem

**Model Answer:**

**Why you can't alert about everything:**
Alert fatigue (established in Chapters 1 and 15). When every signal triggers a human review, the human's finite attention is spread so thin that they begin ignoring all signals — including the critical ones. In the ICU data: 700 alarms/day, 98% false positive rate → nurses habituate to alarms → when the genuine alarm fires, it sounds like the other 699.

**Why you can't trust the AI to handle everything:**
The 0.1% that matters often consists of precisely the cases the AI is worst at: novel failure modes, compound failures, situations outside the training distribution. The cases that are genuinely uncertain to the AI are the cases that most need a human. Fully automated handling removes the safety net exactly where it's needed most.

**What this tells us about HITL:**
HITL in high-volume monitoring is primarily a *triage design* problem, not a *review design* problem. The AI's job is to compress 6 million data points to the 12 per month that warrant human attention. The human's job is to handle those 12 well. The design challenge is the compression step — achieving it without either missing genuine anomalies or overloading the human.

#### Question 3: Physical Consequences

**Model Answer:**

**Key differences in HITL design requirements:**

| Factor | Spam Filter | Self-Driving Car |
|---|---|---|
| Error recovery | User can retrieve from spam folder | Crash may be unrecoverable |
| Time window | Hours or days for human review | Milliseconds to seconds |
| Cost asymmetry | Low for both FP and FN | Very high for FN (missed hazard) |
| Stakes Calibration | Wide confidence range acceptable | Near-certainty required for autonomous action |
| Feedback loop | User corrections weekly | Real-time |
| Human role | Reviewer | Co-pilot or safety override |

**What specifically changes:**
1. **Threshold for autonomous action**: Far more conservative when errors are not recoverable
2. **Timing design**: Human must be maintainable at a timescale consistent with intervention; can't review individual decisions after the fact
3. **Graceful degradation**: The "safe" fallback state matters — spam filter fallback is "everything goes to inbox"; self-driving fallback is safe stop
4. **Verification before deployment**: Exhaustive scenario testing required because you cannot run a post-mortem on a fatal crash

---

### Intermediate Level Solutions

#### Question: Multimodal Disagreement Protocol

**Sample Strong Answer:**

**Escalation Protocol for Multi-Sensor System (video + audio + physiological):**

**Step 1: Define modality-specific confidence thresholds.**
Each modality produces a risk score [0,1]. Set per-modality thresholds:
- Video: escalate if pose/behavioral classifier score > 0.6
- Audio: escalate if prosodic distress score > 0.5
- Physiological: escalate if any vital sign leaves normal range by > 2 SD

**Step 2: Compute modality agreement.**
Disagreement score = max pairwise difference among risk scores. If disagreement > 0.3 (e.g., video=0.7, audio=0.2), escalate regardless of individual scores.

**Step 3: Combined decision logic.**
```
IF (any_single_score > HIGH_THRESHOLD) → immediate escalation
ELSE IF (modality_disagreement > 0.3) → escalation + flag reason
ELSE IF (combined_weighted_score > MEDIUM_THRESHOLD) → escalation
ELSE → auto-resolve as low risk
```

**Threshold for disagreement:** 0.3 is a starting point, calibrated on historical data. Key constraint: the threshold must be set so that the Marcus scenario (text=low risk, prosody=high risk) would always trigger escalation.

**Rationale for using disagreement as a standalone escalation trigger:** The physical models of each modality are independent. When they disagree, the disagreement itself is evidence that something in the situation doesn't fit the training distribution for at least one model — which is precisely the condition where human judgment is most valuable.

#### Question: Co-Adaptation Analysis

**Sample Strong Answer:**

**What the AI learns:**
- The user's specific movement patterns, vocabulary, decision style, or domain emphasis
- Which types of cases the user tends to override, and in what direction
- The user's risk tolerance and attention patterns (from interaction data)
- Distributional features of the user's environment (if inputs come from the user's context)

**What the human learns:**
- The AI's failure modes and areas of low confidence
- How to communicate with the AI more effectively (e.g., BCI users learn which motor imagery produces reliable signals)
- When to trust the AI's output and when to be skeptical
- Domain knowledge structured around the AI's categories and decision points

**Is this desirable?**
*Depends on what the human's adaptation looks like.* If the human learns that the AI is reliable on type-A cases and unreliable on type-B cases, and allocates their attention accordingly, this is desirable — the human's expertise is better calibrated. If the human learns to defer to the AI systematically (automation bias), this is undesirable — the human oversight value degrades over time.

*For the combined system:* If both AI and human are adapting well, the combined system should improve over time on most task dimensions. But co-adaptation can also produce brittle outcomes: a system where human and AI have co-adapted to each other's patterns may fail badly when either component changes (model retraining, staff turnover).

**Design implication:** Track both AI performance and human performance separately over time. If human performance (on cases not processed by AI) degrades as AI improves, co-adaptation is causing skill erosion. This is an organizational HITL concern as much as a technical one.

---

### Advanced Level Solutions

#### Question: Framework Stress Test

**Sample Strong Answer:**

**Applies cleanly to all domains: Stakes Calibration**

Stakes Calibration generalizes across all four domains without modification. In each domain, the cost asymmetry between false positives and false negatives drives threshold design. In crisis hotlines (false negative = missed intervention), in ICUs (false negative = missed deterioration), in AlphaFold validation (false negative = acting on a wrong structure), in prosthetics (false negative = wrong movement actuation) — the asymmetry is the core design parameter. The framework's question "does the system understand consequences?" is relevant everywhere.

**Applies with modification: Feedback Integration**

In static text/image HITL, Feedback Integration is relatively straightforward: human labels flow back into training data. In streaming systems (ICUs, industrial IoT), the feedback loop needs to operate continuously and incorporate temporal context. In scientific discovery, feedback is extremely slow (experiment turnaround time) and may require domain expert interpretation before it becomes training signal. In BCIs, feedback is implicit (the user's neural adaptation) rather than explicit labels. The concept is robust, but the mechanism varies significantly by domain.

**Requires most adaptation: Timing**

In static HITL, Timing asks "when in the decision process does human input occur?" In streaming systems, Timing becomes "how do you create a meaningful human intervention window in a system that operates faster than human reaction time?" In scientific discovery, the question inverts: experiments are so slow that the AI must ask well in advance. In BCIs, Timing is continuous and bidirectional — the human is always in the loop and the system is always adapting. The concept of a discrete "intervention moment" doesn't apply. This reveals a genuine limit of the framework: it was designed for discrete decision pipelines, not continuous feedback systems.

---

## Activity Solutions

### Activity 2: Alarm Management — Sample Strong Solution

**Worst-case burden calculation:**
- 20 patients × 8 parameters × 5 threshold levels = 800 possible alarms/shift
- Assume high alarm rate: 50% of parameters alarm at least once/hour = 400 alarms/hour
- 3 nurses: 133 alarms/nurse/hour — severely above the ~6/hour threshold for manageable attention

**Triage Strategy:**

*Level 1 — Automated response (no human required):*
- Single parameter, single threshold crossed, patient stable for > 2 hours
- Auto-acknowledge and log; escalate if persists > 10 minutes without improvement
- Examples: SpO2 briefly at 94% (threshold 95%), not trending down

*Level 2 — Nurse notification (non-urgent):*
- Two parameters trending unfavorably
- Single critical parameter crossed with patient at high acuity
- Present as dashboard flag, no alert sound
- Target: < 4/nurse/hour

*Level 3 — Immediate alarm:*
- Any critical threshold crossed AND trend is worsening
- Multi-parameter deterioration pattern
- Post-surgical patients within 2 hours of return from OR
- Target: < 2/nurse/hour

**Never-filter list:**
- Ventricular fibrillation / pulseless rhythm
- SpO2 < 85% (absolute threshold, not relative)
- Ventilator disconnect / apnea alarm
- Code blue trigger from any bedside monitor
- Any alarm where patient has been flagged "escalation plan active"

**Feedback mechanism:**
- Clinicians tag each alarm as "true positive," "false positive," or "clinically relevant but not urgent"
- Weekly model update on tagged data
- Monthly review of alarm rates per parameter and per patient population
- Quarterly calibration session with nursing staff to validate threshold appropriateness

---

## "Try This" Exercise — Sample Strong Response

**Prompt:** "Think of a device that monitors something over time. How does it handle uncertainty in its sensor data?"

**Sample Strong Response (smartwatch health monitoring):**

"My smartwatch monitors heart rate continuously using a photoplethysmography (PPG) sensor. It alerts me when heart rate exceeds a threshold (I set it to 150 bpm). Here's how it handles uncertainty:

**What it does well (Uncertainty Detection + Stakes Calibration):**
The watch knows when the PPG sensor signal quality is poor — typically during exercise involving arm movement, which interferes with the optical sensor. During those periods, it displays a 'degraded signal' icon rather than claiming to accurately measure my heart rate. This is good uncertainty communication: it doesn't give me a false reading, it tells me the measurement is unreliable.

**What it does poorly (Timing + Feedback Integration):**
The alert threshold is fixed. The watch doesn't know that my resting heart rate is 58 bpm, so a 140 bpm reading during intense exercise is normal for me, while 105 bpm reading while sitting still would be unusual. The system treats all heart rate alerts equally, regardless of context. I get alerted during hard runs but the alert would be the same if I were having a sudden cardiac event while at rest — there's no stakes calibration based on context.

**What good HITL design would look like:**
The system should learn my normal heart rate distribution across different activities (running, sleeping, sitting, walking). Alerts should trigger based on deviation from *context-appropriate baseline*, not absolute thresholds. High heart rate during recognized exercise should not alert; unusually high heart rate at recognized rest should alert immediately and offer escalation to emergency services. The five Dimensions framework analysis: Uncertainty Detection is good (sensor quality indicators); Stakes Calibration is poor (context-blind thresholds); Feedback Integration is poor (I can't teach it what's normal for me)."

**What makes this strong:** The student applies the Five Dimensions framework, identifies specific failure modes (not just "it's not very smart"), and proposes a concrete improvement that connects to the technical concepts in the chapter.
