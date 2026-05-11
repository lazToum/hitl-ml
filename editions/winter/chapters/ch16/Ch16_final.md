# Chapter 16: Beyond Text and Images

*How human-in-the-loop design changes when the data moves, the world pushes back, and the stakes are physical*

---

## The Voice That Doesn't Fit the Transcript

On a Tuesday evening in April 2017, a trained crisis counselor named Marcus was monitoring call quality for an anonymous crisis hotline when he noticed something odd in the AI-assisted transcription review queue. A call that the system had flagged as "resolved — no intervention needed" showed a transcript where the caller's words were fine: composed, measured, grateful. The AI had assigned it a low-risk score.

But the audio told a different story.

Marcus had worked crisis lines for eleven years. He'd learned to hear the things that transcripts can't capture: the catch in someone's breath between sentences, the millisecond pause before a word like "okay" that transforms it from an answer to a concession. He played the call. The words were exactly as transcribed. The voice was not the voice of someone who was fine.

He escalated. He was right.

The story illustrates something important about HITL design beyond the domains we've covered so far. Text-based AI can be tested on its text. Image AI can be evaluated on its images. But the caller's distress was in the prosody — the rhythm, pitch, and timing of speech — not in the semantic content. The model had been trained to read the words. The human was trained to hear the person.

This chapter is about what HITL looks like in domains that don't fit the standard model of text classification and image labeling. Four domains where the data takes unusual forms, where the intervention problems are structurally different, and where the stakes of getting it wrong sometimes include physical consequences.

---

## Domain 1: Audio and Speech

Speech is deceptive. It presents itself as text-with-a-channel, as if the sound were just a delivery mechanism for the words. But decades of research in linguistics and psychoacoustics make clear that the channel carries enormous information: speaker identity, emotional state, health status, engagement level, confidence, deception, fatigue. Strip away the channel and you strip away much of what humans actually respond to.

### The Transcription Feedback Loop

The most mature HITL application in speech is transcription correction: a speech recognition system produces a transcript, human reviewers correct errors, and those corrections feed back into model training. This is HITL as described in the book's earlier chapters — uncertainty detection triggers human review, corrections flow into the feedback loop.

The interesting complication in speech is that the correction is bidirectional. When a human corrects "they're gonna leave at three" to "they're going to leave at three," are they correcting an error, or are they imposing a style preference? The speech recognition system's job is to accurately transcribe what was said. If the speaker said "gonna," the correct transcription is "gonna." A reviewer who "corrects" it to "going to" is not fixing the model — they are injecting a dialect bias that will cause the model to systematically misrepresent speakers who use informal registers.

This is an annotation failure in audio transcription: the label that looks like a correction is actually a distortion. Building HITL systems for transcription requires explicit annotation guidelines that address this, and quality checks that can detect systematic correction patterns that correlate with demographic features of speakers.

The stakes are higher than they might seem. Court transcription, medical dictation, recorded business meetings: in all of these, systematic dialect bias in transcription can have material consequences for the people whose speech was transcribed.

### Speaker Diarization: The Attribution Problem

Speaker diarization — determining "who said what" in a multi-speaker recording — is one of the hardest problems in speech processing, and one of the most interesting HITL problems.

The difficulty is not just technical. A diarization model must segment an audio stream, cluster segments by speaker, and label each cluster with a speaker identity. Each of these steps has its own failure modes:

- **Segmentation errors**: The model splits a single utterance across two speaker segments, or merges two utterances from different speakers into one
- **Clustering errors**: The model assigns two speakers to the same cluster (they sound similar) or splits one speaker across multiple clusters (their voice changes due to fatigue, distance from the microphone, or emotional state)
- **Attribution errors**: Even when segmentation and clustering are correct, the speaker identities may be wrong if the reference audio is insufficient

The human-in-the-loop challenge is that these errors compound. A segmentation error can cause a clustering error, which causes an attribution error. By the time a reviewer sees the output, the errors may look like a simple wrong label when the root cause is three levels upstream.

In legal settings — depositions, recorded hearings, criminal investigations — correct attribution is not merely convenient; it determines what each person said and when. Diarization systems used in legal contexts require HITL designs that are unusually careful about error propagation and that maintain an audit trail (see Chapter 15) connecting each attributed segment to the model's confidence in that attribution.

### Crisis Detection and the Prosody Gap

The Marcus story at the opening of this chapter illustrates the hardest problem in speech-based HITL for mental health applications: the gap between what a model can process and what a human can perceive.

Modern natural language processing models can analyze the semantic content of transcribed speech. They can detect explicit expressions of suicidal ideation, self-harm, hopelessness. They are good at the words. They are much worse at the prosodic and paralinguistic features — the hesitations, the flat affect, the slight tremor — that experienced counselors learn to hear.

This creates a specific HITL design challenge. The model's uncertainty is not the only relevant signal. There may be cases where the model is confident (the words are fine) but the human expert would not be. The intervention trigger cannot rely solely on model uncertainty; it needs a mechanism for escalating cases where the model is confident but the human might disagree.

One design approach: a secondary model trained specifically on prosodic features that operates in parallel with the text-based model. The two models vote. When they disagree — text says low-risk, prosody says high-risk — the case escalates to human review. The disagreement between models is itself a signal of uncertainty even when neither individual model is uncertain.

This principle generalizes: in multimodal systems where different sensors capture different aspects of a phenomenon, model disagreement between modalities is often more informative than single-model confidence.

---

## Domain 2: Time-Series and Sensor Data

Text and images are static. A sentence doesn't change while you're reading it. A photograph doesn't evolve during classification. But much of the world's most important data is dynamic: streams of sensor readings, vital sign monitors, industrial process measurements, seismic instruments. Time-series HITL is structurally different from text/image HITL in ways that matter.

### Industrial IoT: The 0.1% That Matters

Consider a pressure sensor in a continuous chemical processing plant. It reads every 100 milliseconds, 24 hours a day. In a typical week, it generates approximately 6 million data points. Of those 6 million readings, the vast majority will be within normal operating range. Some will be outside normal range but within the expected variation that the process control system handles automatically. And then there will be a handful — perhaps a dozen per month, perhaps fewer — where the sensor reading is signaling something genuinely anomalous: a valve malfunction, an unexpected exothermic reaction, a blocked line.

The human operator's job in this system is not to watch 6 million numbers. It's to handle the 0.1% — maybe fewer — of alarms that represent genuine anomalies requiring human judgment. The AI system's job is to be the triage layer that distinguishes between the 99.9% of readings that the automatic control system can handle and the 0.1% that need a human.

This is a HITL design problem with several specific features:

**Context dependency**: Whether a pressure reading is anomalous depends on what the process has been doing for the last ten minutes, the last hour, and the last shift. An isolated reading means nothing; a reading in the context of a time series means a great deal. The model needs to operate on sequences, not individual points.

**Alert fatigue at industrial scale**: In a complex chemical plant, dozens of sensors may be monitoring dozens of process variables. A poorly calibrated alarm system can generate hundreds of alerts per operator per hour. Research on industrial control room operators shows that alarm flood — the term of art — is one of the most significant contributors to operator error and industrial incidents. The HITL design challenge is not just "flag anomalies" but "flag anomalies and suppress everything that looks like an anomaly but isn't, in a way that the operator can trust."

**The handoff problem**: When an anomaly is flagged and escalated to a human operator, the operator needs to understand not just "something is wrong" but "what kind of thing is wrong, and what are the plausible responses?" The intervention design needs to provide enough context for the human to act effectively in a time-pressured situation.

### Earthquake Early Warning: Seconds Matter

On September 19, 2017, a magnitude 7.1 earthquake struck central Mexico. Unlike the catastrophic 1985 Mexico City earthquake, this one was preceded by a working early warning system. When the system detected the seismic P-waves — the fast-moving, less destructive waves that precede the slower, more destructive S-waves — it broadcast a warning via radio and cell phone. In some locations, citizens had 30–90 seconds of warning before the shaking began.

Thirty to ninety seconds is not much. But it is enough to take shelter under a table, to stop a surgical procedure, to pull a train to a stop, to shut down a reactor.

The HITL design in earthquake early warning is unusually constrained. The human's job is not to make a decision — the relevant decision-maker is the automated system itself, which will broadcast the alert. The human's role is system-level oversight: monitoring for false alerts, which can damage public trust and cause secondary harms (car accidents, crowd injuries during evacuations) and checking for system failures that would prevent a true alert from broadcasting.

This is oversight, not decision-making. The humans in this loop are calibrating and supervising, not intervening. It's a different kind of HITL — closer to audit and governance than to the triage-and-review model we've described elsewhere.

### ICU Patient Monitoring: The False Alarm Crisis

In the modern intensive care unit, a patient may be connected to a cardiac monitor, a pulse oximeter, a blood pressure cuff, a ventilator alarm, and a medication infusion pump — each generating its own alerts. Studies have found that ICU alarm rates can exceed 700 alarms per patient per day in busy units. The false alarm rate in studies of cardiac monitors alone ranges from 72% to over 99%.

Nurses in high-alarm environments report the same phenomenon documented in clinical decision support systems: they stop hearing the alarms. The signal disappears into noise. And when the one genuine alarm — the one that signals a true arrhythmia, a true oxygen desaturation — fires, it sounds like the other 699. The nurse who has been habituating to false alarms for eight hours may not respond with the same urgency.

This is a Stakes Calibration failure at the system level. The HITL design has failed to distinguish between alarms that require immediate intervention and alarms that are information. The solution is not better sensors — the sensors are already excellent. The solution is a smarter filtering layer: a model that takes all the sensor streams, integrates them in context (what does the patient's history look like? what medications are they on? what has been happening in the last hour?), and produces not a list of individual alarms but a ranked assessment of patient state: stable, watch, concern, urgent.

This is active research in the field of multi-parameter patient monitoring, and it's a HITL design problem at its core: how do you create a system where the human reviewer can trust that the cases that reach them for review are the cases that genuinely require human attention?

---

## Domain 3: Scientific Discovery

The practice of science has always involved human judgment about which experiments to run, which hypotheses to pursue, which results to trust. AI is changing the mechanics of these decisions in ways that make HITL design newly important in the laboratory.

### AlphaFold and the Validation Problem

In 2020, DeepMind's AlphaFold2 achieved a stunning result in protein structure prediction: at the biennial CASP competition (Critical Assessment of Protein Structure Prediction), it predicted protein structures with accuracy comparable to experimental methods. For many proteins, AlphaFold's predictions were indistinguishable from structures determined by X-ray crystallography, the gold-standard method.

This was a genuine scientific achievement. It was also a HITL design challenge.

Protein structure prediction is not an end in itself. Researchers want to know a protein's structure because they want to understand its function, design drugs that bind to it, or engineer variants with different properties. A predicted structure that is accurate in its overall fold but wrong in its active site — the specific region where the protein does its job — may lead a researcher in the wrong direction.

AlphaFold provides per-residue confidence scores (pLDDT scores) that indicate how confident the model is about each part of the predicted structure. Regions with high confidence scores (above 90) are generally reliable. Regions with low confidence scores (below 50) may be genuinely disordered in the protein, or may be regions where the model is guessing.

The HITL challenge: how should experimental biologists integrate AlphaFold predictions into their research? The answer from the research community has gradually become clear: AlphaFold predictions are extremely useful for hypothesis generation and experimental planning, but must be validated experimentally for any application where an incorrect active site would have serious consequences. The confidence scores are the HITL interface — they tell the human researcher which parts of the prediction to trust and which parts to verify.

The deployment of AlphaFold in drug discovery illustrates a broader principle: in scientific HITL, the model's job is often to narrow the hypothesis space, not to provide final answers. The human's job is to select which hypotheses to test experimentally and to interpret the results.

### Bayesian Optimization in Materials Science

In materials science, a researcher might want to find the composition of a material — the specific combination of elements and processing conditions — that maximizes some desired property: hardness, conductivity, corrosion resistance. The search space is often enormous. A material with five elemental components, each varying over a continuous range, has an effectively infinite number of possible compositions.

Bayesian optimization is a technique for searching this space efficiently. It maintains a probabilistic model (typically a Gaussian process) of the relationship between composition and property. At each iteration, it suggests the composition most likely to produce new information — either because it's predicted to be excellent (exploitation) or because the model is uncertain about it and learning its value would reduce uncertainty across a wide region of the space (exploration).

The human researcher in this loop plays a specific role: they run the experiment, report the outcome, and — crucially — decide whether to trust the reported outcome. Experiments in materials science can fail for reasons unrelated to the composition: contaminated precursors, equipment failures, measurement errors. The researcher's judgment about whether a data point is reliable is part of the feedback signal to the Bayesian optimization model.

This is HITL in a domain where the experiments are real, slow (sometimes taking days per iteration), and expensive. The value of the human judgment about data quality is high: a corrupted data point that the model treats as reliable can push the optimization in a wasteful or harmful direction. The HITL design challenge is to provide the researcher with enough information about the model's current state — what has it learned, what is it uncertain about, why is it suggesting this next experiment — that they can make informed decisions about where to override the model's recommendation.

### Drug Interaction Prediction: When the Model Doesn't Know

The human body takes hundreds of approved medications, most of which have been tested in isolation but relatively few of which have been systematically studied in combination. Drug-drug interactions (DDIs) — situations where two drugs together produce effects neither would produce alone — are a significant source of adverse events. They are also a knowledge gap: there are millions of possible pairings, and most have not been experimentally characterized.

Machine learning models for DDI prediction use molecular graph representations of drug structures to predict whether two drugs are likely to interact. They can scan millions of pairs and flag candidates for experimental validation. But the models' confidence is calibrated on the pairs that have been characterized — the distribution of well-characterized interactions may differ systematically from the distribution of uncharacterized ones.

The HITL design here involves a tiered escalation: the model predicts a DDI probability for all uncharacterized pairs. High-confidence predictions (the model is certain there is or is not an interaction) go into a database for clinical reference. Low-confidence predictions (the model is uncertain) are routed to pharmacology experts who can bring domain knowledge to bear — structural considerations, mechanistic reasoning, related-compound analogy — that the model cannot access. The experts' assessments become additional training labels.

This is active learning in a domain where generating ground truth requires laboratory experiments, human expert judgment, or both. The model gets smarter by asking the right people to look at the right cases.

---

## Domain 4: Robotics and Physical Systems

When AI acts in the physical world, errors have physical consequences. A misclassified email can be recovered from. A robot arm that moves in the wrong direction may not be recoverable. HITL in robotics is not just about improving AI performance — it's about managing the risks of AI acting in domains where mistakes can cause injury, damage, or death.

### Teleoperation: The Human as Actuator

In hazardous environments — nuclear facilities, deep-sea operations, bomb disposal, space exploration — robots extend the human's reach into places humans cannot safely go. Teleoperation is the oldest form of human-in-the-loop robotics: a human operator controls a robot remotely, watching through cameras, manipulating arms or wheels through joysticks or haptic interfaces.

Modern teleoperation increasingly incorporates AI assistance: the robot handles low-level motor control (keeping balance, obstacle avoidance), while the human handles high-level task planning (which object to pick up, where to put it). This is shared autonomy — the human and the robot each contribute to the execution of a task, with the boundary of their contributions varying based on task difficulty, model confidence, and communication latency.

The HITL design challenge in teleoperation is latency. When a human on Earth is operating a robot on the Moon, communication delays can exceed a second. A human trying to control a robot arm in real-time with a one-second delay finds the task nearly impossible: every correction they make reflects the state of the system a second ago. The AI assistance layer needs to buffer the human's intentions, execute them smoothly in real-time at the robot's end, and alert the human when something unexpected happens that their command stream did not anticipate.

### Shared Autonomy: The Robot That Hands Back Control

The concept of shared autonomy has been developed most completely in the context of powered wheelchairs and robotic manipulation for users with motor impairments. A powered wheelchair that can navigate autonomously around obstacles — without requiring the user to execute each low-level steering correction — provides enormous benefit to users with limited motor control. But the wheelchair still needs to go where the user wants, not where the AI thinks they want to go.

Shared autonomy research (developed by groups at Carnegie Mellon, Stanford, and elsewhere) has produced a framework that applies directly to HITL design in physical systems: the robot estimates the probability distribution over the human's intended goal, executes actions that are consistent with the most likely goal while remaining consistent with other plausible goals, and asks for clarification when the distribution is too uncertain to act effectively.

This is uncertainty detection, intervention design, and stakes calibration all at once. The system acts autonomously in the region of high confidence about the human's intent. It asks or slows in the region of uncertainty. It errs toward safety in regions where the cost of a wrong action is high (navigating in a crowd vs. navigating in an empty corridor).

### Prosthetics and BCIs: The Most Intimate HITL Systems

At the furthest boundary of HITL in physical systems are prosthetics and brain-computer interfaces (BCIs). Here, the human is not simply in the loop — the human's nervous system is the loop.

A modern myoelectric prosthetic hand uses surface electrodes on the residual limb to read the electrical signals from the user's remaining muscles. A machine learning model interprets those signals as intended hand movements: open, close, pinch, grip. The user's brain sends a signal; muscles contract; electrodes read the contraction; the model predicts the intended movement; the prosthetic actuates.

The feedback loop is incomplete in ways that shape HITL design. Unlike a biological hand, the prosthetic provides limited tactile feedback: the user cannot feel what the hand is gripping or how hard. The model may misclassify a muscle signal, and the user may not realize the hand has done the wrong thing until they see it. The HITL design must compensate for this missing channel: visual feedback (cameras integrated into the prosthetic), auditory feedback (tones indicating grip strength), or haptic feedback (vibration patterns) can substitute partially for the absent tactile channel.

The calibration problem is unusually personal. Every user's residual muscle patterns are different. A model trained on one user's data will perform poorly on another. Personalization — continuous adaptation of the model to the individual user's patterns over time — is not optional; it's the core design requirement. This is Feedback Integration as an intimate, embodied process: the user's responses, corrections, and patterns of use are continuously shaping the model that is shaping their interface to the physical world.

BCIs push this intimacy further. In motor BCIs, electrodes placed on or in the brain read neural signals associated with imagined movement, which a decoder translates into control signals for a cursor, a robotic arm, or a speech synthesizer. The model here is translating thought — or something close enough to thought to be indistinguishable in practice — into action.

The HITL design challenges in BCIs are profound: the signal is noisy and changes over time as the brain adapts to the interface. The user's ability to provide explicit feedback about model errors is limited — they cannot easily say "that wasn't what I intended" in the same way a desktop user can click Undo. Feedback is implicit: the user tries again, using the model's error as information about how to modify their neural signal. Over time, a skilled BCI user and a well-designed model converge on a shared language — the user adapts to the model, and the model adapts to the user.

This is co-adaptation: the most intimate form of human-AI collaboration we have yet developed.

---

## What Changes When Data Is Not Static

Across all four domains, a common thread emerges: when data is not static, the design of HITL systems must change in specific ways.

**Streaming data requires continuous evaluation.** A static text classification system can be evaluated on a held-out test set before deployment. A streaming anomaly detection system is always encountering new data. Performance must be monitored continuously, with alarms for drift and degradation.

**Real-time decisions compress the intervention window.** The Flash Crash (Chapter 15) illustrated the extreme case: a system operating faster than humans can intervene. In earthquake early warning, in ICU alarms, in teleoperation, the window for human intervention is measured in seconds or less. HITL design must account for this: either slow the system to create a meaningful intervention window, or design the human's role as oversight and calibration rather than case-by-case review.

**Physical-world consequences change the asymmetry.** In text classification, the cost of an incorrect automated decision is usually recoverable. In robotics, in patient monitoring, in industrial control, incorrect automated decisions can have consequences that are not recoverable. This shifts the cost-asymmetry calculation dramatically toward caution, toward more conservative thresholds for human review, and toward graceful degradation when the system encounters situations outside its training distribution.

**Multimodal data surfaces disagreements between sensors.** When a system integrates audio, video, and text — or pressure, temperature, and flow rate — disagreements between modalities often signal conditions outside the model's training distribution. Model disagreement as an uncertainty signal is a powerful design principle in multimodal HITL systems.

---

## Chapter Summary

**Key Concepts:**
- HITL design takes structurally different forms across domains: audio/speech, time-series/sensor data, scientific discovery, and robotics.
- In audio, the prosody gap — the information in the voice that transcripts don't capture — requires human oversight that model confidence scores alone cannot substitute for.
- In time-series, the challenge is triage at scale: distinguishing the 0.1% of alarms that matter from the 99.9% that don't.
- In scientific discovery, AI narrows hypothesis spaces and suggests next experiments; humans provide experimental judgment and validate results.
- In robotics and physical systems, the consequences of errors are often not recoverable, which changes the stakes calibration for autonomous action.
- Co-adaptation — the mutual adaptation of human and AI system over time — is most visible in prosthetics and BCIs, but operates in all HITL systems.

**Key Examples:**
- **Crisis hotline prosody detection**: Human counselor detects what transcription system misses — the voice behind the words.
- **Industrial IoT anomaly detection**: 6 million data points per week; the human handles the 0.1% that the control system can't.
- **AlphaFold + experimental validation**: Confidence scores as HITL interface between AI prediction and experimental verification.
- **Shared autonomy wheelchair**: Robot handles low-level navigation; human retains high-level goal control; system asks when uncertain.
- **Myoelectric prosthetics**: Co-adaptation as the design requirement, not an optimization.

---

> **Try This:** Think of a device or system that monitors something over time — your smartwatch, a weather app, a fitness tracker, a home security system. How does it handle uncertainty in its sensor data? When does it alert you, and when does it act automatically? What would a good HITL design look like for the cases where it's most likely to be wrong?

---

*In the next chapter, we explore the frontier: systems that get better at knowing what they don't know — and the progression from passive HITL to proactive AI collaboration.*
