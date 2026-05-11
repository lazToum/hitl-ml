# Chapter 16 Teacher's Manual: Beyond Text and Images

*Complete instructional guide for teaching HITL in audio, time-series, scientific discovery, and physical systems*

---

## Course Integration Guide

### Learning Objectives

By the end of this chapter, students will be able to:

**Knowledge:**
- Identify the four HITL domains covered in Chapter 16 and name key examples in each
- Explain the "prosody gap" in speech-based HITL and its significance for crisis applications
- Define the triage challenge in time-series HITL (the 0.1% problem)
- Describe AlphaFold's pLDDT scores as a HITL interface
- Explain shared autonomy as a HITL design philosophy

**Application:**
- Apply the Five Dimensions framework to a novel domain not covered in Chapter 16
- Analyze the cost-asymmetry implications of physical-world HITL vs. digital-domain HITL
- Design an escalation protocol for a described time-series monitoring system
- Compare the HITL design requirements of static vs. streaming data

**Synthesis:**
- Argue why physical-world consequences change HITL design requirements
- Design a HITL protocol for a domain that combines multiple modalities
- Evaluate the co-adaptation concept and its implications for system design

### Prerequisites

- Chapters 1–15 of this book
- Basic familiarity with audio signal processing (optional but helpful)
- No specific programming prerequisites, though the technical appendix assumes Python

### Course Positioning

Chapter 16 is best positioned after students have internalized the core HITL principles from earlier chapters and are ready to apply them in non-standard domains. It serves as a "stress test" for their understanding: if the Five Dimensions framework is robust, it should apply in all four domains. If students find it breaking down, that's a valuable discussion about the framework's limits.

---

## Key Concepts for Instruction

### The Prosody Gap

The Marcus opening story is specifically designed to surface a concept that is non-obvious: **the gap between what a model can be trained on and what a human expert perceives**.

In speech-based systems, this gap manifests as the difference between semantic content (what was said) and prosodic content (how it was said). Current NLP models are very good at the former and limited on the latter.

**Teaching Tip:** Play audio examples where the words say one thing and the voice says another. This doesn't require real crisis recordings — any good actor can demonstrate flat affect, tremor, or the pause that transforms "okay" from agreement to capitulation. Students should recognize immediately why a text-only model would miss this.

**Connection to Five Dimensions:**
- The prosody gap is an **Uncertainty Detection** failure: the model cannot detect its own uncertainty about the prosodic channel it's ignoring.
- The Marcus solution is an **Intervention Design** achievement: the routing system correctly places the human reviewer in a position to apply the perception the model lacks.

### The 0.1% Problem

The industrial IoT section introduces a central challenge in time-series HITL: **when the signal-to-noise ratio is extremely low, how do you preserve human attention for the signal?**

**Teaching Tip:** The framing of "6 million data points, 12 anomalies per month" resonates viscerally. Ask students: "If you were the operator, what would your attention strategy be?" The answer usually involves some form of the model's job — pre-filtering — and the human's job — handling the edge cases. This is a natural derivation of the HITL motivation.

**Alert Fatigue Connection:** The ICU alarm story (700 alarms per patient per day, 72–99% false positive rate) is among the most extreme documented cases of alert fatigue. This is useful as an existence proof: systems can fail entirely in the alert fatigue direction while their individual components (sensors) work perfectly.

### Co-Adaptation

The prosthetics section introduces a concept that transforms how students think about HITL: **the human adapts to the system, and the system adapts to the human**. Neither is static.

This is philosophically significant because it challenges the implicit model in much HITL discourse, which treats the human as a fixed component that the AI system must serve. Co-adaptation suggests a more dynamic model: the human-AI system as a whole is learning, and the human's contributions to that learning include both explicit feedback and implicit adaptation of their own behavior.

**Teaching Tip:** Ask students: "Is co-adaptation desirable?" The answer is nuanced. If a user adapts to compensate for a system's limitations, is that a success (the system works) or a failure (the burden shifted to the human)? The best answer involves measuring task performance from the user's goal, not the system's design.

---

## Lecture Planning Guide

### 50-Minute Lecture Structure

#### Opening: The Marcus Story (7 minutes)
- Tell the story cold, before any framing
- Ask students: "What did the model fail to detect? What did Marcus detect that the model didn't?"
- Reveal: this is the prosody gap. Build to the broader principle: in multimodal situations, the model's uncertainty is not the only relevant uncertainty.

#### Part 1: Audio and Speech (12 minutes)
- Prosody gap: what's in the voice that transcripts don't capture
- Transcription bias: the annotation failure specific to dialect
- Speaker diarization: the attribution problem
- Crisis detection: multimodal disagreement as escalation

#### Part 2: Time-Series and Sensor Data (12 minutes)
- Industrial IoT: the 0.1% that matters
- ICU alarms: the extreme case of alert fatigue
- Earthquake early warning: oversight, not decision-making
- Key insight: in streaming data, human role may be oversight/calibration rather than case-by-case review

#### Part 3: Scientific Discovery (10 minutes)
- AlphaFold + confidence scores as HITL interface
- Bayesian optimization: human as experimental designer
- Drug interactions: active learning in a slow, expensive domain

#### Part 4: Robotics and Physical Systems (9 minutes)
- Teleoperation: the latency problem
- Shared autonomy: uncertainty-driven handoff
- Prosthetics and BCIs: co-adaptation
- Stakes difference: physical consequences

### 75-Minute Extended Session

**Add these components:**

#### Comparative Analysis Activity (15 minutes)
Groups analyze the Five Dimensions for two of the four domains and compare. Where does the framework apply cleanly? Where does it strain? What does this reveal about the framework's limits?

#### Domain Design Challenge (10 minutes)
Pose a new domain not covered in the chapter (e.g., drone traffic management, autonomous surgical systems, climate sensor networks). Groups have 8 minutes to sketch a HITL design and present the key challenge.

---

## Discussion Questions by Level

### Introductory Level

1. **Prosody Gap**: "A customer service AI analyzes the words of customer complaints to determine urgency. What is it missing? What would a human customer service representative notice that the AI might not? How would you design a HITL system that addresses this?"

2. **The 0.1% Problem**: "Explain the tradeoff in industrial alarm systems. Why can't you just alert the human about everything? Why can't you just trust the AI to handle everything? What does this tell you about the purpose of HITL in high-volume monitoring?"

3. **Physical Consequences**: "A self-driving car and an email spam filter are both AI systems that make automated decisions. How are their HITL design requirements different? What specifically changes when the consequences are physical?"

4. **Scientific Discovery**: "How is AlphaFold's use in protein structure prediction an example of HITL design? What is the AI's role? What is the human's role? Where is the uncertainty interface?"

### Intermediate Level

1. **Multimodal Disagreement**: "Design a HITL escalation protocol for a system that monitors video, audio, and physiological sensors simultaneously. How should you handle cases where the sensors disagree? What threshold for disagreement should trigger human review?"

2. **Streaming vs. Static**: "A text classification model and an industrial sensor monitoring system are both deployed as HITL systems. Explain three specific ways their HITL design requirements differ because one operates on static data and one on streaming data."

3. **Shared Autonomy Framework**: "Apply the shared autonomy framework from robotics to another domain not mentioned in the chapter. What does 'the robot handles low-level, human handles high-level' translate to in your domain? When would the human be pulled back into the loop?"

4. **Co-Adaptation**: "A medical professional uses an AI-assisted diagnostic system every day for two years. Over that time, both the AI and the professional change. Describe what changes you would expect in: (a) the AI's model, (b) the professional's diagnostic behavior, (c) the performance of the combined system. Is this co-adaptation desirable?"

5. **Crisis Detection Design**: "Design the complete HITL protocol for a crisis detection system for a text-based mental health support chat service. Include: what the AI analyzes, what triggers escalation to a human counselor, what information the counselor sees, and how the human's intervention feeds back into the system."

### Advanced Level

1. **Framework Stress Test**: "The Five Dimensions framework was developed primarily with text classification and image labeling in mind. Identify one dimension that applies cleanly to all four domains in Chapter 16, one that applies with modification, and one that requires the most adaptation. Defend your choices."

2. **Alarm Fatigue System Design**: "Design a patient monitoring system for a 20-bed ICU that achieves: (a) < 5 alarms per nurse per hour, (b) < 1% critical event miss rate, (c) actionability rate > 60%. What ML methods would you use? How would you validate performance before deployment?"

3. **BCI Ethics and HITL**: "In a motor BCI, the human's neural signals are directly in the feedback loop. This creates HITL challenges unlike any other domain: the human cannot always 'opt out,' feedback is implicit rather than explicit, and co-adaptation may change the user's neural patterns over time. What specific ethical obligations does this create for BCI designers? How should uncertainty be communicated to a BCI user?"

4. **Bayesian Optimization Integration**: "A pharmaceutical company uses a Bayesian optimization loop for lead compound optimization. Over 200 experimental iterations, researchers have overridden the model's suggestion 45 times. Analysis shows these overrides improved outcomes 60% of the time. Design a system for incorporating researcher expertise into the acquisition function. When should the model weight researcher priors more heavily vs. the empirical data?"

---

## Hands-On Activities

### Activity 1: Prosody Detection Exercise (15 minutes)

**Setup:** Access to audio examples (instructor-selected recordings, or use text-to-speech tools to generate examples with different prosodic qualities).

**Task:** Students listen to audio clips and analyze:
1. What does the transcript contain?
2. What additional information does the audio provide?
3. Which would be missed by a text-only model?
4. Design a three-question human review checklist that captures what the text model misses.

**Debrief:** Which prosodic features were easiest to detect? Hardest? What does this imply for the difficulty of training an automated prosody model?

### Activity 2: Alarm System Design Challenge (25 minutes)

**Setup:** Groups of 3–4. Scenario:

*You are designing the alarm management system for a 20-bed ICU. Each patient has 8 monitoring parameters (heart rate, oxygen saturation, blood pressure, respiratory rate, temperature, 2 IV infusion rates, and mechanical ventilator settings). Each monitoring parameter can generate alarms at up to 5 different threshold levels. There are 3 nurses per shift.*

**Task:**
1. Calculate the worst-case alarm burden without any filtering.
2. Design a triage strategy that reduces burden to < 6 alarms per nurse per hour.
3. Identify which alarms should NEVER be filtered automatically.
4. Describe the feedback mechanism for improving alarm accuracy over time.

**Deliverable:** Alarm management specification (one page) + burden calculation.

### Activity 3: Domain Extension Exercise (20 minutes)

**Setup:** Individual or pairs. Select one new domain from the list below:
- Autonomous underwater vehicle operations
- Smart grid power management
- AI-assisted surgical systems
- Air traffic control
- Wildfire detection from satellite imagery

**Task:** Apply the Five Dimensions framework to design a HITL system for your domain:
1. Uncertainty Detection: what signals indicate the AI needs human input?
2. Intervention Design: how does the AI communicate uncertainty to the human?
3. Timing: when in the decision process does human input occur?
4. Stakes Calibration: what are the asymmetric costs, and how do they affect thresholds?
5. Feedback Integration: how do human decisions improve the model?

**Key question to address:** Does this domain require case-by-case review, or oversight/calibration? Why?

### Activity 4: Co-Adaptation Mapping (20 minutes)

**Setup:** Pairs. Each pair selects one system from the chapter or a personal experience with a system they use regularly.

**Task:** Map the co-adaptation over time:
1. What does the AI learn about the human over time?
2. What does the human learn about (or adapt to) the AI over time?
3. Is this co-adaptation desirable or problematic?
4. What is the "right" end state: the human fully adapted to the AI, the AI fully adapted to the human, or something in between?
5. What would the system look like at Year 5 vs. Day 1?

---

## Assessment Strategies

### Formative Assessment

**Quick Polls:**
- "Which domain in Chapter 16 has the most different HITL design requirements from text classification? Why?"
- "True or false: In streaming data systems, the human's role is usually to review individual cases in real-time."
- "The Marcus scenario is primarily which failure mode from Chapter 15?"

**Exit Ticket:**
- Name one domain from Chapter 16 where human oversight should be continuous (calibration) rather than case-by-case
- Name one domain where physical consequences change the cost-asymmetry calculation
- Describe what co-adaptation means in one sentence

### Summative Assessment Options

**Option 1: Domain Extension Paper (800 words)**
Select a domain not covered in Chapter 16. Apply the Five Dimensions framework and identify the key HITL design challenges specific to that domain. Address: how is it similar to and different from the domains in the chapter? What is the most important HITL design decision?

**Option 2: System Design — Alarm Management**
Full design specification for an alarm management system in a domain of your choice (ICU, industrial plant, financial system, transportation). Include: alarm generation, triage logic, human interface design, feedback mechanism, and evaluation plan. Address the 0.1% problem explicitly.

**Option 3: Comparative Analysis**
Compare two of the four domains from Chapter 16 on three dimensions: nature of uncertainty, human role (triage vs. oversight), and cost asymmetry. Conclude with a synthesis about what drives the variation in HITL design across domains.

---

## Common Misconceptions

### "Audio HITL is just text HITL with a transcription step"

**Correction:** The transcription step loses information. In many audio-first applications (crisis detection, medical voice analysis, speaker verification), the lost information is precisely what matters. HITL design for audio must account for what transcription erases.

### "More data solves the 0.1% problem"

**Correction:** The 0.1% problem is not a data scarcity problem — it's a signal-to-noise design problem. More sensors does not solve alarm fatigue; it often makes it worse. The solution is smarter filtering and triage, not more data.

### "Scientific AI replaces the scientist"

**Correction:** In every scientific discovery application covered, the AI's role is hypothesis narrowing and experimental suggestion — not experimental execution or result interpretation. The scientist's role evolves but remains essential. AlphaFold accelerates structural biology; it does not replace the structural biologist.

### "Shared autonomy means the robot is in charge"

**Correction:** In shared autonomy, authority is distributed based on context and confidence. The robot handles what it handles well; the human retains final authority over goal specification and handles what the robot can't. Neither is simply "in charge."

---

*Next: Chapter 17 explores the frontier of proactive HITL — systems that learn to anticipate uncertainty before it arrives.*
