# Chapter 8 Teacher's Manual: The Blueprint for Smart Helper Systems

*Complete instructional guide*

---

## Learning Objectives

By the end of this chapter, students will be able to:
- Identify the seven components of a complete HITL system architecture
- Distinguish between HITL pipelines (no learning) and HITL loops (learning)
- Describe four feedback integration approaches and their tradeoffs
- Identify and diagnose common production failure modes
- Describe the HITL system lifecycle from prototype to monitoring-dominant

---

## Suggested 50-Minute Lecture Structure

### Minutes 0-8: Opening — The Uber Tempe Incident
Present the case clearly: the system detected uncertainty. It classified the object incorrectly. It did not escalate to the human in time. The human was present but not effectively in the loop. The architecture failed at the escalation layer.

Key argument: calling something "human-in-the-loop" doesn't make it so. The loop requires a working connection between uncertainty detection, human notification, and human capacity to act. Any broken link fails the whole loop.

### Minutes 8-18: Pipeline vs. Loop
Draw the distinction on the board. A pipeline: input → model → human review → output. Nothing flows back. The model is the same tomorrow as today.

A loop: same as pipeline, PLUS human labels flow back to model → model improves → uncertainty detection improves → routing improves → human labels get more targeted.

Ask: "What happens to a pipeline that processes incorrect cases? It keeps being incorrect. What happens to a loop?" This leads naturally into the seven components.

### Minutes 18-32: Seven Components
Walk through each:
1. Prediction: model output + confidence
2. Uncertainty quantification: calibrated scores
3. Routing: the three-zone system
4. Interface: Chapter 6's territory, but its role in the architecture
5. Feedback integration: the loop-closing layer
6. Monitoring: keeping the system honest over time
7. Audit: accountability and debugging

Emphasize: removing any one of these components breaks something important. Systems without #5 don't improve. Systems without #6 drift undetected. Systems without #7 cannot be debugged.

### Minutes 32-42: Feedback Integration Options
Batch retraining: simple, robust, slow. Good for stable tasks.
Online learning: fast, error-prone, requires quality monitoring.
Active learning: intelligent, requires engineering, high efficiency.
RLHF: preference-based, used in LLMs, captures complex human values.

Use a concrete example for each: spam filter (batch), live recommendation system (online), medical annotation (active), language model (RLHF).

### Minutes 42-48: Production Failure Modes
Work through the taxonomy: reviewer bottleneck, label quality degradation, feedback lag, distribution shift without detection, ghost reviewer, specification gaming. For each, ask: "Which component of the seven would detect this? Which prevents it?"

### Minutes 48-50: Close + Try This

---

## Discussion Questions by Level

### Introductory
1. What is the key difference between a HITL pipeline and a HITL loop? Give an example of each.
2. Why does the Uber Tempe incident qualify as an architecture failure rather than a sensor failure? What architectural component was missing?
3. Describe two failure modes that monitoring (Component 6) would detect. Why can't the other components detect these instead?

### Intermediate
4. A company builds a content moderation system with batch retraining: human labels collected, reviewed for quality, and fed into model retraining monthly. A new type of harmful content emerges in week 1 of a month. Describe the system's behavior from week 1 to week 5. What architecture change would reduce this lag?
5. Compare active learning and batch retraining on these dimensions: latency, label efficiency, implementation complexity, error propagation risk. For what use case would you choose each?
6. A HITL system's audit logs show that human reviewers have been overriding automated decisions at a rate of 40% over the past month. What does this indicate? How would you diagnose whether this represents model drift, changing human judgment standards, or a routing configuration problem?

### Advanced
7. Design the complete seven-component architecture for a system that detects potentially problematic emails in a legal department's inbox. Specify each component, including the feedback integration strategy, monitoring metrics, and escalation protocols. Identify the three highest-risk failure modes for your design.
8. The "specification gaming" failure mode occurs when the model learns to optimize the feedback metric rather than the underlying task. Describe a concrete scenario, identify which architectural component is responsible for catching it, and propose a design intervention.

---

## Common Misconceptions

**"Having a human review step means the system is a HITL loop."**
No — this is the pipeline mistake. The human review step must be connected to model improvement. If labels from human review are not incorporated into future model updates, the system is a pipeline with a human quality check, not a learning HITL loop.

**"Active learning is just uncertain-case routing."**
Active learning specifically optimizes the learning value of routed cases, not just their uncertainty. It considers both uncertainty and diversity. This matters because a system that routes only the uncertain cases doesn't explore the training distribution efficiently.

**"Monitoring should catch errors in real time."**
For some failure modes (reviewer bottleneck, high review rate), yes. For others (slow drift, specification gaming), monitoring must look at trend lines over weeks or months. Different monitoring timescales are needed for different failure modes.

---

## Assessment

**Architecture Design Exercise:** "You are designing the HITL architecture for a fraud detection system at a mid-sized bank. Describe each of the seven components, specify one key metric for each, and identify the most likely production failure mode in each."

**Case Analysis:** "Examine the Uber Tempe incident post-mortem report. Identify which of the seven architectural components was missing or deficient. Propose three specific architectural changes that could have prevented the incident."

---
