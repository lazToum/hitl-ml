# Chapter 5 Teacher's Manual: The Art of Asking for Help (Without Being Annoying)

*Complete instructional guide for teaching HITL intervention design*

---

## Course Integration Guide

### Learning Objectives

By the end of this chapter, students will be able to:

**Knowledge (Remembering & Understanding):**
- Name the three primary design levers for HITL asks: timing, frequency, format
- Define the trust-attention-response triangle and describe how each element can fail
- Explain the "Lazy User Assumption" and why it leads to bad intervention design
- Describe how question framing affects response quality, using the 911 dispatcher example

**Application & Analysis:**
- Evaluate existing alert designs using the trust-attention-response framework
- Identify when poor alert performance is due to timing, frequency, or format failures
- Apply cognitive load principles to assess query design choices
- Analyze fraud alert, 2FA, and content moderation examples using the chapter's framework

**Synthesis & Evaluation:**
- Design HITL interventions that respect timing, maintain frequency, and optimize format
- Critique real alert systems and propose specific improvements
- Argue for specific design choices using trust-attention-response reasoning
- Evaluate the information value of different query formats for a specific domain

### Prerequisites
- Chapters 1–4 (required): the Five Dimensions framework, uncertainty types, threshold decisions
- No technical background required for main chapter; Appendix 5A uses information theory and basic probability

---

## Key Concepts for Instruction

### The Central Design Insight

This chapter's core argument: **the moment of the ask is a design problem, not just an engineering trigger**. Even when the detection, routing, and threshold decisions are correct, the ask can fail if its design doesn't respect human psychology.

Use the 911 dispatcher story as the anchor. The word "personally" is memorable and vivid — one word, 40% improvement. This is not a marginal efficiency gain; it is the difference between a system that works and one that doesn't.

### The Three Levers: Mnemonic

**T-F-F: Timing, Frequency, Format.** Help students remember:
- *Timing*: when you ask
- *Frequency*: how often you ask
- *Format*: how you ask

These are not independent — a perfect format at the wrong time fails. All three must be optimized together.

### Trust-Attention-Response Triangle

Draw this on the board:

```
         TRUST
        /       \
    (signal     (signal
     value)     dismissed)
      /               \
ATTENTION ——————— RESPONSE
    |                   |
(must be            (must be
 available)          easy)
```

The triangle can fail at any vertex: trust failure → alerts dismissed; attention failure → alerts missed; response failure → useless or harmful responses.

---

## Lecture Planning Guide

### 50-Minute Lecture Structure

#### Opening: The 911 Story (7 minutes)
Tell the Louisville story slowly. Before revealing the improvement, ask students: "What would you change about the question 'Is there someone there who needs help?'" Then reveal the answer (one word: "personally" + "right now"). The concreteness of one word creating 40% improvement is visceral.

Ask: "Why did one word matter so much?" Lead students to: the question's framing changes what the caller searches for in their memory, and therefore what information they report.

#### Part 1: The Three Levers (10 minutes)

Walk through timing, frequency, format with vivid examples:

- **Timing failure:** Fraud alert at 3 AM for a morning charge. Who gets these at 3 AM? Why does it happen? (Batch processing, not real-time.) What does a half-awake approval actually contribute?
- **Frequency failure:** The iPhone update prompt (Chapter 1 example). How many of you have dismissed an update reminder without reading it? Why? What does that mean for the rare important update?
- **Format failure:** "Your account has been flagged for unusual activity" — compare to "Did you make this $47.23 purchase at Costa Coffee at 2:15 PM today? Reply YES or NO."

**Key question:** Why did the format failure example feel intuitively worse than the timing failure? (Because format failure destroys the information value of the response — it gets you a useless answer. Timing failure at least gets the right question at the wrong time.)

#### Part 2: The Trust-Attention-Response Triangle (12 minutes)

Introduce each vertex with a failure example:

- Trust failure: clinical alert fatigue — research showing physicians override 90%+ of alerts
- Attention failure: interruption mid-task — Bailey & Iqbal finding on task breakpoints
- Response failure: "Was this transaction legitimate?" when the user can't remember — what answer will they give?

**Class discussion (3 min):** "Which vertex of the triangle is hardest to recover from once lost? Which is most under the designer's control?"

Strong answer: Trust is hardest to recover (erodes fast, builds slowly; $\beta > \alpha$ in the model); Format is most under the designer's control (each question is a deliberate choice).

#### Part 3: The Lazy User Assumption (8 minutes)

State the assumption explicitly: most bad alert design implicitly assumes "if users don't engage, it's because they're lazy."

Then attack it:
1. Empirically wrong — research shows users engage when design respects their time
2. Fails on its own terms — friction doesn't select for motivated users, it just loses them
3. The right assumption: "users will try if the ask is worth their time"

Design implication: **What makes an ask worth the user's time?** Rare (surprising), timely (can respond), clear (understands what's being asked), consequential (feels like it matters).

#### Part 4: 2FA and Fraud Alerts Case Studies (8 minutes)

Quick comparative analysis of good vs. bad implementations of each:

**2FA:**
- Bad: Push notification, no context, tap to approve
- Good: Number matching, context about device/location, prominent "I didn't initiate this" option

**Fraud alerts:**
- Bad: Generic flagging, delayed, requires calling
- Good: Specific merchant/amount/time, immediate, binary reply

Tie both back to the T-F-F levers: identify which lever is well-designed in each case.

#### Wrap-Up: Feedback Integration (5 minutes)

Chapter's often-overlooked dimension: the ask is useless if the response disappears. The question's format determines what information is captured. The feedback loop determines whether that information improves the system.

Closes the five-chapter arc: from detection (Ch. 2) → learning (Ch. 3) → thresholds (Ch. 4) → asking (Ch. 5). Each chapter has answered a successively more specific question about the HITL moment.

---

## Discussion Questions by Level

### Introductory Level

1. **Recognition:** "The 911 dispatcher story shows that the *wording* of a question can dramatically change the response. Give two examples from your own experience where how you were asked a question changed how you answered it."

2. **Analysis:** "A mobile banking app sends you a notification that says: 'Unusual activity detected. Open the app to review.' Apply the T-F-F framework: what does this notification do well and do poorly?"

3. **Application:** "Redesign the banking notification from question 2 to be better on all three dimensions (timing, frequency, format). What information would you include? When would you send it? How would you prevent alert fatigue?"

4. **Comparison:** "Compare two-factor authentication implemented with push notifications (tap to approve) vs. number matching (see a number, confirm it in the notification). Which is better and why? Use the trust-attention-response triangle in your answer."

### Intermediate Level

1. **Framework Application:** "A hospital's clinical decision support system generates 500 alerts per doctor per day, and doctors override 95% of them. Diagnose this system using the trust-attention-response triangle. Which vertex is failing most critically? Propose three specific interventions."

2. **Design Challenge:** "Design a HITL intervention for a plagiarism detection system used by university professors. The system can flag assignments with varying confidence. Specify: what gets flagged, when the professor is notified, what format the notification takes, and how the professor's response feeds back to the system."

3. **Information Value Analysis:** "A fraud alert system can either send a specific alert ('Did you make this $23.45 purchase at Starbucks at 9:14 AM?') or a general alert ('A transaction may need your review'). Using the concept of information value from Appendix 5A, explain why the specific alert is better even though both ask the same underlying question."

### Advanced Level

1. **System Design:** "A content moderation platform employs 200 moderators who review 50,000 pieces of flagged content per day. Using all five dimensions of the HITL framework, design a complete intervention system including: routing criteria, interface design, cognitive load management, alert frequency management, and feedback integration."

2. **Research Design:** "Design an experiment to measure the information value of different fraud alert formats. What would you measure? How would you quantify 'information quality' from a human response? What confounds would you control for?"

3. **Dynamic Optimization:** "Using the RL formulation from Appendix 5A, explain why the optimal HITL policy should be context-dependent (different thresholds for different users, times, and situations) rather than a fixed rule. What data would you need to learn such a policy?"

---

## Common Student Misconceptions

### Misconception 1: "More information in the ask = better ask"
**Student thinking:** "A fraud alert should give you everything: the merchant, amount, time, location, device, and previous purchase history."
**Correction:** Cognitive load theory shows accuracy peaks when complexity matches working memory capacity. A comprehensive but overwhelming ask produces lower-quality responses than a well-focused simpler one. Good design finds the minimum sufficient information, not the maximum available information.

### Misconception 2: "Automated confirmation is fine for low-stakes asks"
**Student thinking:** "For routine things, it doesn't matter if people approve without reading."
**Correction:** The MFA fatigue attack exploits exactly this logic. Users who habitually approve notifications without reading become attack vectors. Moreover, habitual non-reading transfers across contexts — users who learn to dismiss "low-stakes" alerts start applying the same behavior to higher-stakes ones (trust erosion).

### Misconception 3: "The format problem is just a UX issue"
**Student thinking:** "This is about making things look nice, not about fundamental AI design."
**Correction:** The information the human provides is the primary input to the system's improvement loop. A badly formatted question gets a response that contains less useful information for model improvement. This is not UX polish — it is core ML pipeline engineering.

### Misconception 4: "Alert fatigue is an individual user problem"
**Student thinking:** "Some users are just lazy or have too many notifications."
**Correction:** Alert fatigue is a property of system design, not user character. Well-designed systems maintain engagement. The dynamic trust model from Appendix 5A shows that any system with low alert precision will degrade trust over time, regardless of user motivation.

---

## In-Class Activities

### Activity 1: Alert Triage (15 minutes)
Present students with 6 alert designs (varied quality on T-F-F dimensions). Students rank them and explain their ranking. Debrief reveals the systematic reasons for quality differences.

Sample alerts to compare:
1. "Your account requires your attention" [poor all dimensions]
2. "Did you make this $237.00 purchase at Best Buy at 4:47 PM today? Reply YES or NO" [good all dimensions]
3. Push notification: "New login detected — Tap to approve" [good timing, poor format]
4. Email 6 hours later: "We noticed a large purchase on your account" [poor timing, poor format]
5. Phone call from bank: "We're calling to verify a recent transaction..." [good format, bad attention management]
6. In-app banner: "Review 14 flagged items" [timing/format issues]

### Activity 2: HITL Intervention Redesign (20 minutes)
Groups of 3-4 redesign the intervention system for a specific scenario. Each group presents their design and receives critique.

Scenarios:
- A: Credit card company fraud alert for a premium customer
- B: University plagiarism detection notification to a professor
- C: A smart home security system (door left unlocked when nobody is home)
- D: A medical documentation AI (physician dictation transcription error detected)

### Activity 3: "Try This" Debrief (10 minutes)
In the second class session, students share their audit of alerts they experienced between classes. Facilitate discussion:
- Which was the worst-timed alert you received?
- Which format felt most respectful of your time?
- Did any alert feel like it was designed to extract your specific knowledge vs. just get an approval?

---

## Assessment

### Option 1: Alert Audit Report (500–750 words)
"Audit five alerts or HITL interventions you encountered this week. For each: (a) identify which of timing, frequency, format is best and worst; (b) apply the trust-attention-response triangle; (c) propose one specific improvement. Conclude with a pattern you noticed across the five."

### Option 2: HITL Design Document
"Design the complete human-AI collaboration interface for a domain of your choice. Include: trigger conditions, notification design (with mockup or detailed description), frequency controls, response options, and feedback integration mechanism. Justify each design decision using chapter concepts."

### Option 3: Case Analysis
"The chapter describes how professional content moderators' decision quality is affected by interface design, throughput pressure, and context availability. Analyze a content moderation platform you are familiar with (or based on published research). What would you change?"

---

## Connections to Other Chapters

### Backward Links
- Ch. 1: Alert fatigue first introduced; the Goldilocks problem; Nest thermostat as asking badly
- Ch. 2: Uncertainty signal must be surfaced before it can be asked about
- Ch. 3: The training signal from human responses depends on the quality of the question
- Ch. 4: The HITL band = the region where asking happens; format determines what's learned from each ask

### Forward Links
- Part II: Domain-specific chapters apply these principles in healthcare, law, content moderation
- Evaluation methods: how to measure whether the ask is working

---

## Sample Lesson Plan: 50-Minute Session

| Time | Activity | Materials |
|------|----------|-----------|
| 0:00–0:07 | Opening: 911 story + discussion | Ch. 5 opening |
| 0:07–0:17 | Three levers (T-F-F) with examples | Slides with real alert comparisons |
| 0:17–0:29 | Trust-attention-response triangle | Whiteboard diagram + failure examples |
| 0:29–0:37 | Lazy User Assumption + correction | Discussion |
| 0:37–0:44 | Case studies: 2FA and fraud alerts | Comparative slides |
| 0:44–0:49 | Feedback integration + chapter arc close | |
| 0:49–0:50 | Assign Try This; preview Part II | |
