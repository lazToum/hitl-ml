# Chapter 11 Teacher's Manual: Teaching Computers to See

*Complete instructional guide for computer vision, adversarial examples, and HITL in visual AI*

---

## Course Integration Guide

### Learning Objectives

By the end of this chapter, students will be able to:

**Knowledge (Remembering & Understanding):**
- Explain how images are represented as numerical data and how convolutional neural networks process this representation
- Describe what adversarial examples are and why they exist
- Explain the concept of automation bias in AI-augmented radiology
- Describe the three HITL domains in computer vision (medical imaging, autonomous vehicles, content moderation)
- Explain the escalation timing problem in autonomous vehicles
- Define perceptual hashing and describe its role and limitations in content moderation

**Application & Analysis:**
- Apply the five-dimension framework to analyze a computer vision HITL deployment
- Analyze why adversarial examples reveal something fundamental about machine vision
- Compare the HITL architectures of Tesla, Waymo, and Cruise approaches
- Evaluate the design of a medical imaging AI workflow for automation bias risks

**Synthesis & Evaluation:**
- Design a HITL deployment for a computer vision application in a high-stakes domain
- Critique a content moderation system for structural vulnerabilities
- Propose improvements to an autonomous vehicle oversight architecture
- Evaluate the claim that machine vision and human vision are "complementary, not interchangeable"

### Prerequisites
- Chapter 10 (for familiarity with how neural networks learn from data)
- Basic understanding of probability and statistics
- Helpful but not required: any hands-on experience with image classification tools

### Course Positioning
- **Immediately after Chapter 10:** The parallel between language and vision AI deepens understanding of both
- **Domain sequence:** This chapter is the second modality chapter; connects forward to domain-specific application chapters

---

## Key Concepts for Instruction

### The Central Demonstration: Adversarial Examples

The adversarial example — especially the physical stop sign attack — is this chapter's "Netflix pause" moment. It should be demonstrated live if possible (see Activity 1 below) and discussed at length. The adversarial example does three things pedagogically:

1. **Makes concrete** that machine vision is fundamentally different from human vision
2. **Explains structurally** why this is the case (pattern statistics vs. conceptual understanding)
3. **Motivates directly** why human oversight of machine vision is a structural necessity, not a workaround

Instructors should spend significant time on this before moving to applications. Students who understand the adversarial example will find the medical imaging, autonomous vehicle, and content moderation discussions much richer.

### The Automation Bias Finding

The automation bias research in radiology deserves careful attention. The key finding is counterintuitive: seeing an AI's confident assessment can make radiologists *worse* at catching the AI's mistakes. This is not a criticism of radiologists — it's a fundamental human cognitive pattern. Confidence is a social and epistemic signal; we update toward confident sources.

The design implication is subtle: the way AI findings are presented to human experts affects the quality of human-AI collaboration, independently of the AI's accuracy. This is pure Intervention Design.

### The Autonomy Architecture Divergence

Tesla, Waymo, and Cruise chose fundamentally different architectures for human oversight. This is not a simple "good design vs. bad design" story — each architecture reflects different assumptions about where human judgment is most valuable and where it creates the most risk.

| | Tesla FSD | Waymo | Cruise (pre-suspension) |
|--|--|--|--|
| Human in vehicle | Required (attentive) | No | Conditional |
| Remote monitoring | No | Yes | Yes |
| Control handoff | Immediate (driver) | Remote guidance | Varies |
| Automation bias risk | High (habituated supervisor) | Low (no in-vehicle human) | Medium |
| Reaction time problem | Severe | Avoided | Partial |
| Regulatory status | Consumer product | Commercial fleet | Suspended 2023 |

---

## Lecture Planning Guide

### 50-Minute Lecture Structure

#### Opening: The Stop Sign (10 minutes)
**Do this first:** Show the image from the 2017 Eykholt et al. paper — the original stop sign with sticker attacks, and the classifier's output showing "Speed Limit 45."

**Discussion:** "Every person in this room sees a stop sign. What does the machine see? Why?" Take student responses before explaining.

**Transition:** "The answer tells us everything about what machine vision actually is — and why machines need human oversight for certain tasks indefinitely, not just until the technology improves."

#### Part 1: How CNNs Work (12 minutes)
**The hierarchy (6 min):**
- Start with "an image is just numbers" (write it on the board)
- Build up the hierarchy: edges → corners and curves → textures and shapes → object parts → objects
- Emphasize: the network *learns* these features from examples; nobody programmed them

**What the model actually sees (6 min):**
- Show Goodfellow's panda-to-gibbon adversarial example
- "The same pixel values. Completely different classification."
- "The network learned features that are statistically predictive but not semantically grounded."
- "This is why the stop sign attack works, and why it's not fixable by making the network 'better' in the conventional sense."

#### Part 2: Medical Imaging HITL (12 minutes)
**The augmentation paradigm (4 min):**
- AI detects specific pathologies; radiologist reviews AI findings + original image
- FDA authorization pathway
- "This works well in aggregate. But there's a catch."

**Automation bias (8 min):**
- Explain the finding carefully: radiologists who see the AI's "all clear" are less likely to catch the abnormality the AI missed
- "Is this a problem with radiologists? No — it's a fundamental human cognitive pattern."
- Framework question: "Which dimension does this implicate?" (Intervention Design — how findings are presented)
- Show the design response: presenting AI findings after initial read, or presenting regions without classifications

#### Part 3: Autonomous Vehicles (8 minutes)
**The timing problem (4 min):**
- Do the calculation live: 60 mph = 88 ft/sec × 1.5 sec reaction time = 132 feet
- "By the time a human has processed the alert and responded, the situation has evolved significantly."
- "This makes the naive 'ask human when uncertain' model deeply inadequate."

**Three architectures (4 min):**
- Walk through the table: Tesla (human always in loop, automation bias problem), Waymo (no in-vehicle human, remote guidance), Cruise (suspended)
- "These are not iterations on the same design. They are fundamentally different answers to the question of where the human fits."

#### Part 4: Content Moderation (8 minutes)
**Perceptual hashing (4 min):**
- "For known harmful images, hashing works well. Fast, accurate, doesn't require human review."
- "What does it miss?" (novel content, adversarial modifications)
- "Who keeps the hash database current?" (Human reviewers, as ground-truth generators)

**The adversarial arms race (4 min):**
- "Bad actors learn what the system detects. They modify content to evade detection."
- "This means human review isn't a temporary fix until the AI improves — it's structurally necessary to generate new ground truth as the threat landscape evolves."
- "This is Feedback Integration in its most adversarial form."

### 75-Minute Extended Session

**Add:**

#### Live Demo (15 min)
- Use Google Lens or another accessible image classifier
- Classify images under: normal conditions, unusual angles, partial occlusion, adversarial stickers (print simple patterns and attach to objects)
- Let students see confidence scores change
- Discuss: what does this tell you about what the classifier is detecting?

#### Case Analysis (10 min)
- Deep dive on one of the three HITL domains using the five-dimension framework
- Have students complete the analysis in small groups, then compare

---

## Discussion Questions by Level

### Introductory Level

1. **Adversarial examples:** "A neural network sees a panda and classifies it correctly. You add imperceptible pixel noise and it classifies the same image as a gibbon with 99% confidence. What does this tell you about how the neural network 'sees'? What would it mean for the network to see more like a human?"

2. **Medical AI:** "Why might showing a radiologist an AI's 'all clear' assessment make the radiologist *less* accurate at catching the abnormality the AI missed? Is this a failure of the AI, the radiologist, or the system design?"

3. **Autonomous vehicles:** "At 60 mph, a car travels 88 feet per second. Explain in your own words why this is a fundamental design constraint for human-in-the-loop autonomous vehicles. What are the different ways companies have tried to solve this?"

4. **Content moderation:** "Explain perceptual hashing. What problem does it solve, and what problem can't it solve? Why do humans remain necessary in the content moderation loop even with good automated systems?"

### Intermediate Level

1. **Framework application:** "Apply the five-dimension framework to analyze the AI workflow in a radiology department that uses an AI to flag potential lung nodules. For each dimension, describe how you would evaluate it and what a failure would look like."

2. **Automation bias design:** "Design an AI-assisted radiology workflow that minimizes automation bias without sacrificing the benefits of AI assistance. Use the five-dimension framework to justify each design choice."

3. **Architecture comparison:** "Compare Tesla's Full Self-Driving and Waymo's robotaxi from the perspective of the five-dimension framework. Which has stronger Uncertainty Detection? Which has better Timing? Where does each make tradeoffs?"

4. **Adversarial robustness:** "Why can't we solve the adversarial example problem just by including adversarial examples in training? What does this tell us about the nature of the vulnerability?"

5. **Hash database evolution:** "Describe the feedback loop between human content reviewers and a perceptual hashing system. What happens if human reviewers are overloaded and fall behind? Use the Feedback Integration dimension to analyze the risk."

### Advanced Level

1. **IoU and threshold selection:** "A medical imaging system detects tumors with 0.6 IoU on average. A radiologist considers 0.5 IoU acceptable for clinical use. How should the IoU threshold be set for triggering human review? What asymmetry in error costs drives this decision?"

2. **MC Dropout vs. ensembles:** "For a safety-critical medical imaging application, compare Monte Carlo Dropout and deep ensembles as uncertainty estimation methods. What are the practical tradeoffs? What evidence would you need to prefer one over the other?"

3. **Active learning strategy selection:** "You are building an image classifier for identifying rare genetic skin conditions. You have 10,000 unlabeled images and can afford to annotate 500. Compare entropy sampling, BALD, and core-set selection for this task. Which would you choose and why?"

4. **Physical adversarial attacks in depth:** "Why are physical adversarial attacks (like the stop sign stickers) particularly concerning compared to digital adversarial perturbations? What defense mechanisms exist, and why are they all partial solutions?"

5. **Regulatory implications:** "The FDA distinguishes between 'locked' and 'adaptive' AI medical devices with different regulatory requirements. What is the HITL implication of each category? Design a monitoring and feedback system for an adaptive medical imaging AI that would satisfy the spirit of FDA oversight requirements."

---

## Hands-On Activities

### Activity 1: Adversarial Example Demo (20 minutes)

**Option A (No code required):** Use the Fooling Images demo at various online adversarial example demonstration tools. Or use a pre-trained image classifier (Google Cloud Vision API, Azure Computer Vision, or local model via Python).

**Task:** Upload the same image with small modifications:
- Original (should classify correctly)
- Rotated 30° (does accuracy change?)
- With a small logo or sticker added (does it misclassify?)
- With JPEG compression (does confidence change?)
- In unusual lighting (desaturated, high contrast)

**Discussion questions:**
- Where did the classifier's confidence drop most?
- Were any modifications that confused the classifier invisible to you as a human?
- What does the pattern of failures tell you about what the classifier is detecting?

**Option B (With Python):** Use `foolbox` or `cleverhans` libraries to generate adversarial examples programmatically and visualize the perturbations.

### Activity 2: Radiology AI Workflow Design (25 minutes)

**Scenario:** A hospital is deploying an AI system to assist radiologists reading chest CTs for lung nodules. The AI has 92% sensitivity (catches 92% of nodules) and 85% specificity (correctly clears 85% of scans with no nodule).

**Task:** Design the workflow using the five-dimension framework:
1. At what confidence threshold should the AI flag a scan for priority review?
2. How should the AI findings be presented to the radiologist? (Before or after initial read? As regions of interest or as diagnoses?)
3. What should happen when the radiologist disagrees with the AI?
4. How should the system be monitored for performance drift over time?
5. What metrics would you track to detect automation bias developing in the radiologist team?

**Deliverable:** Workflow diagram + 5-dimension analysis table

### Activity 3: Autonomous Vehicle Incident Analysis (30 minutes)

**Materials:** Reports from documented AV incidents (publicly available). Suggested cases:
- Uber AV fatality (2018, Tempe Arizona)
- Tesla FSD incidents (multiple NHTSA investigations)
- Cruise suspension (2023, San Francisco)

**Task:** For one incident, reconstruct:
- What did the AI see/not see?
- What did the human do/not do?
- Which dimension of the five-dimension framework failed?
- What design change would have been most effective?

**Discussion:** Compare findings across groups analyzing different incidents. Are there common failure patterns?

### Activity 4: Content Moderation System Design (25 minutes)

**Scenario:** You are designing content moderation for a new social media platform. Your system must handle:
- Text posts
- Images
- Video clips

**For images specifically:**
- Design the automated first-pass system (what technologies? what thresholds?)
- Design the human review escalation (what types of content go to humans? how are they prioritized?)
- Design the feedback loop (how do human decisions update the automated system?)
- Design the hash database maintenance process (who adds to it? how? what oversight?)

**Apply the five-dimension framework** to your design and identify the weakest dimension.

---

## Common Misconceptions and How to Address Them

### Misconception 1: "Adversarial examples will be fixed by better training"

**Student thinking:** "Just include adversarial examples in the training data and the model will become robust."

**Correction:** This partially works (adversarial training) but does not solve the fundamental problem. Models trained on one type of adversarial attack remain vulnerable to different attack types. The vulnerability arises from the statistical nature of pattern learning — the model is optimizing for statistical patterns, not semantic understanding. True robustness would require the model to have the kind of conceptual grounding that human vision has, which current architectures lack by design.

**Evidence:** Show that adversarially trained models still fail on transfer attacks (attacks they weren't trained on) and on natural distribution shifts (new environments, new conditions).

### Misconception 2: "Automation bias is a problem with radiologists who rely too much on AI"

**Student thinking:** "The solution is to train radiologists to not trust the AI so much."

**Correction:** Automation bias is a fundamental human cognitive pattern, not a training deficit. Humans appropriately update toward confident sources; this is rational Bayesian behavior in most contexts. The design challenge is to structure the human-AI interaction so that AI confidence doesn't inappropriately suppress human vigilance. This is a design problem, not a training problem. Telling radiologists "ignore the AI's confidence" is both unfair and counterproductive.

### Misconception 3: "Waymo's driverless approach is safer because it removes the automation bias problem"

**Student thinking:** "Since there's no human in the vehicle to become complacent, Waymo's approach avoids automation bias."

**Correction:** Waymo's approach moves automation bias to a different part of the system — the remote assistance operators. These operators may also habituate to the system's performance, potentially missing the rare situations where the vehicle needs guidance. Additionally, removing the human entirely from the vehicle means there is no physical fallback if the vehicle's systems fail completely. Both approaches have automation bias risks; they have different structures.

### Misconception 4: "Perceptual hashing solves the CSAM detection problem"

**Student thinking:** "With perceptual hashing, platforms can automatically detect and remove all CSAM."

**Correction:** Perceptual hashing detects *known* CSAM with high accuracy. It does not detect novel content — new material produced after the database was compiled. Adversarial modifications can evade hashing. And it provides no help with contextual judgments (is this medical documentation or exploitation?). Human review remains structurally necessary for all three of these gaps.

### Misconception 5: "More AI capability means less need for human oversight"

**Student thinking:** "As AI vision improves, we can gradually reduce human involvement."

**Correction:** More capable systems can also fail in new and unexpected ways. Increased capability increases the range of situations the system handles autonomously, but may not improve robustness at the edges of that range. In safety-critical applications, the consequence of failure often increases as autonomy increases (more autonomous = more critical moments without human backup). The relationship between capability and the need for human oversight is not monotonically decreasing.

---

## Assessment Strategies

### Formative Assessment

**Exit ticket:** "The stop sign with stickers successfully fools a neural network classifier while remaining completely recognizable to humans. In 3–4 sentences, explain why this is possible. What does it tell us about the nature of machine vision?"

**Concept check:** "True or False: A radiologist who reviews AI findings before making her own assessment will produce better diagnoses than one who makes her own assessment first, then checks the AI. Explain your answer."

### Summative Assessment Options

#### Option 1: Framework Analysis (750 words)
**Prompt:** "Choose one real-world computer vision deployment in a high-stakes domain (medical, automotive, security, or other). Using the five-dimension framework, analyze how the system handles uncertainty, describe its current HITL design, identify the weakest dimension, and propose a specific improvement."

**Rubric:**
- Framework application accuracy (35%)
- Technical understanding of the vision system (25%)
- Quality of weakness identification and evidence (25%)
- Feasibility and specificity of improvement proposal (15%)

#### Option 2: Incident Report
**Prompt:** "Analyze a documented AI vision system failure (autonomous vehicle incident, medical misdiagnosis, content moderation error). Reconstruct what happened from a technical and HITL perspective, identify which design dimensions failed, and propose changes that would have prevented or mitigated the failure."

#### Option 3: Technical Design (for advanced courses)
**Prompt:** "Design the uncertainty estimation and human escalation system for a chest X-ray AI assistant. Specify: the uncertainty estimation method (MC Dropout or deep ensembles), the calibration validation approach, the escalation threshold, and the intervention design. Justify each choice using evidence from the literature."

---

## Connections to Other Chapters

### Backward Links
- **Chapter 1:** GPS-into-lake failures — a vision/sensing failure where the system had no mechanism to express uncertainty
- **Chapter 10:** Parallel structure of modality chapters — language and vision share the pattern-learning/semantic-grounding gap
- **Chapters 2–9:** Five-dimension framework applied to vision domain

### Forward Links
- **Chapter 12 (Healthcare):** Radiology AI HITL becomes a dominant case study; connects to FDA oversight, clinical trial requirements
- **Chapter 13 (Transportation/Safety):** Autonomous vehicle HITL in deeper domain context
- **Chapters 14+:** Each domain application draws on both language and vision AI examples

### Bridge from Chapter 10 to Chapter 11
The bridge should emphasize: language and vision are the two primary modalities through which humans communicate and perceive. AI has made dramatic progress in both. The failures of each modality are structurally different — hallucination vs. adversarial examples — but both arise from the same root cause: learning from statistical patterns rather than acquiring the conceptual grounding that human cognition has. This root cause explains why human oversight is structurally necessary in both cases.

---

*Next: Chapter 12 Teacher's Manual — [Domain-specific applications begin here]*
