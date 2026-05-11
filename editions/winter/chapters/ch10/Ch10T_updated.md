# Chapter 10 Teacher's Manual: Teaching Computers to Understand Language

*Complete instructional guide for NLP, transformers, and HITL in language AI*

---

## Course Integration Guide

### Learning Objectives

By the end of this chapter, students will be able to:

**Knowledge (Remembering & Understanding):**
- Explain why natural language is intrinsically difficult for computers (ambiguity, context, irony, implication)
- Describe the word embedding intuition and what it means for words to have "coordinates in meaning-space"
- Explain at a conceptual level how the attention mechanism works
- Define hallucination in the context of language models
- Describe RLHF, DPO, and Constitutional AI and their roles in aligning language model behavior
- Identify the three HITL shapes in language AI (chatbot, content moderation, alignment training)

**Application & Analysis:**
- Apply the five-dimension framework to evaluate a deployed language AI system
- Analyze a real or hypothetical hallucination incident to identify which HITL failures contributed
- Distinguish between "the model knows" and "the model produces plausible text"
- Evaluate a chatbot interaction for appropriate uncertainty communication and escalation behavior
- Compare the HITL implications of RLHF versus Constitutional AI

**Synthesis & Evaluation:**
- Design a human oversight strategy for a language AI deployment in a high-stakes domain
- Critique the content moderation HITL pipeline, identifying structural weaknesses
- Propose improvements to a language AI system's intervention design
- Evaluate the philosophical question of whether language models "understand" and its practical implications

### Prerequisites
- **Foundation:** Chapters 1–9 of the book (five-dimension framework, BADGE, RLHF/DPO overview)
- **Helpful but not required:** Basic probability, familiarity with neural networks at the conceptual level
- **Reading:** The Mata v. Avianca case filings are publicly available and make excellent primary sources

### Course Positioning
- **Standalone:** This chapter works as a self-contained unit on NLP and language AI
- **Sequence:** Best placed after a general introduction to machine learning and before computer vision (Chapter 11)
- **Advanced courses:** Pair with technical appendix for deeper mathematical treatment

---

## Key Concepts for Instruction

### The Central Tension: Fluency vs. Accuracy

The most important concept in this chapter — and the most counterintuitive for students — is that **fluency is not accuracy**. Language models are trained to produce plausible, fluent text. Fluency and accuracy often correlate but are not the same thing. When they diverge, the model produces hallucinations: confident-sounding text that is factually wrong.

**Teaching analogy:** Compare to a very intelligent person who has read a lot but has a very unreliable memory for specific facts. They can discuss any topic fluently and plausibly, but they might confidently misremember a date, attribute a quote incorrectly, or confabulate a detail. The fluency of their speech gives no signal about the accuracy of specific claims.

### The "Understanding" Question

The chapter raises but doesn't fully resolve the question of whether language models understand. This is by design. For teaching purposes:

- **Avoid definitive claims** in either direction — this is an open research question with significant philosophical depth
- **Focus on practical implications:** Whether or not models "understand," the practical consequence is the same — they have no internal mechanism for distinguishing truth from plausibility
- **Use as a discussion prompt** to get students thinking about what understanding actually requires

### Three HITL Shapes — Structural Comparison

| Shape | Who is in the Loop | When | Primary Failure Mode |
|-------|-------------------|------|---------------------|
| Chatbot assistance | End user | Real-time conversation | No escalation path, overconfident on specialized queries |
| Content moderation | Human reviewer | After automated filtering | Reviewer burnout, adversarial evasion, under/over-removal |
| Alignment training | Preference labelers | During model training | Rater bias, reward hacking, underrepresentative feedback |

This table is worth drawing on the board and discussing explicitly.

---

## Lecture Planning Guide

### 50-Minute Lecture Structure

#### Opening: The Lawyer's Brief (8 minutes)
**Hook:** Tell the Mata v. Avianca story in full detail. Don't rush it. The story has everything: a relatable mistake, a plausible-sounding AI output, a real judge, real sanctions, and a telling moment where the attorney asked ChatGPT to verify the citations and the model doubled down.

**Discussion prompt:** "What should the attorney have done differently? What would a well-designed system have done differently?"

**Transition:** "To understand why this happened, we need to understand what language models actually are — and specifically what they are *not*."

#### Part 1: Why Language Is Hard (10 minutes)
**Interactive examples:**
- Write "I saw the man with the telescope" on the board. Ask for both interpretations.
- Write "The chicken is ready to eat." Ask for both interpretations.
- Ask: "How did you resolve the ambiguity?" (Answer: context, world knowledge, pragmatics)
- "Computers had none of this for decades. Every sentence was just a string of characters."

**Key teaching point:** Language's hardness is not a computational limitation — it's intrinsic to language itself. Context, irony, implication, cultural reference are features of language, not bugs.

#### Part 2: Word Embeddings and Attention (12 minutes)
**Word embeddings (5 min):**
- Draw a 2D sketch of "meaning-space" with clusters: [dog, cat, puppy] near each other, [king, queen, prince] near each other, far from [apple, orange, banana]
- Explain: "The model didn't learn these groupings from a dictionary. It learned them by reading text. Words that appear in similar contexts end up near each other in this space."
- The king/queen vector arithmetic is worth mentioning — it surprises students every time.

**Attention (7 min):**
- The mystery novel analogy is the heart of this section. Slow down here.
- Draw the sentence "The animal didn't cross the street because it was too tired."
- Draw arrows from "it" to other words, with thickness representing attention weight.
- "The attention mechanism is doing this for every word, simultaneously, in parallel."

#### Part 3: What a Model Knows — and What Hallucination Is (12 minutes)
**The key distinction:**
- "The model learned statistical patterns. It learned that 'Paris' and 'capital of France' appear together. But it learned by pattern — it has no pointer to an encyclopedia."
- "When you ask it for a legal precedent, it generates the most plausible-sounding text for that query. It doesn't look up a real case. It generates something that *looks like* a case citation."

**Hallucination rates:** Share the Stanford research findings (58–82% hallucination rate on legal queries for general-purpose LLMs). These numbers are striking and students often don't believe them at first — which creates a great teachable moment.

**Calibration connection:** Connect back to the book's core theme. "The model is miscalibrated. It expresses high confidence when it should express uncertainty. This is the same problem we've seen with GPS systems and medical AI — the system doesn't know what it doesn't know."

#### Part 4: HITL in Language AI (10 minutes)
**Walk through the three shapes:**
- Chatbot: "What should a well-designed chatbot do when asked a legal question?"
- Content moderation: "Who are the humans in the content moderation loop? What is their experience?" (This often surprises students — they hadn't thought about the human reviewers)
- Alignment training: "RLHF sounds technical. At its core, it's: show humans pairs of AI outputs, ask which is better, use that preference to train a better model. The human is in the loop during training."

**Five-dimension framework application:** Work through one of the three shapes with the class using the framework.

#### Wrap-Up and Preview (8 minutes)
**Summary:** "Language models are extraordinarily capable text prediction engines. Their limitation is structural: they predict plausible text, not true text. They have no internal truth-checker. Human oversight is a structural necessity, not a temporary fix."

**Preview:** "Next chapter: what happens when we teach machines to see? And why does machine vision fail in ways that are even stranger than machine language?"

### 75-Minute Extended Session

**Add:**

#### Technical Deep Dive (15 min)
- Walk through the attention equation $\text{Attention}(Q,K,V) = \text{softmax}(QK^\top/\sqrt{d_k})V$
- Explain queries, keys, values through the "library search" analogy: Q is your search query, K is the index of available information, V is the actual content
- Show token probability distribution and explain how sampling temperature affects it

#### Demo Activity (10 min)
- Live demo: Ask a capable LLM a question you know the answer to. Then ask the same question slightly rephrased to invite confabulation (e.g., ask about a very obscure historical figure with plausible-seeming characteristics)
- Observe: Does the model hedge? Does it confabulate? Ask it to verify its answer.
- Discuss: What would good uncertainty communication look like here?

---

## Discussion Questions by Level

### Introductory Level

1. **Ambiguity recognition:** "Give three examples of sentences that have two plausible interpretations. How would you — as a human reader — decide which one is meant? What information would a computer be missing?"

2. **Hallucination analysis:** "Attorney Schwartz trusted ChatGPT's legal citations without verifying them. What three things did the system fail to do that a well-designed HITL system should have done?"

3. **Understanding the stakes:** "Why does it matter whether a language model hallucinates at a 5% rate versus a 50% rate? For which applications would even 5% be unacceptable? For which might 50% be acceptable?"

4. **Three shapes:** "Explain in your own words why the HITL challenge for a customer service chatbot is different from the HITL challenge for a content moderation system. What does the human reviewer do in each case?"

### Intermediate Level

1. **Framework application:** "Apply the five-dimension framework to analyze a specific chatbot deployment of your choice. Where are the weakest dimensions? What would you change?"

2. **Tradeoffs in alignment:** "RLHF uses human raters to express preferences. What are the risks of this approach? Whose preferences are being encoded? How might this differ from Constitutional AI?"

3. **Content moderation design:** "Design a content moderation HITL system for a social media platform. Specify: what does the automated system handle, what goes to human reviewers, under what conditions is human review triggered, and how do reviewer decisions feed back into the automated system?"

4. **Calibration and trust:** "A medical AI system for detecting lung cancer from chest X-rays reports 94% confidence on all its positive detections. Its actual accuracy is 76%. Explain why this miscalibration is dangerous and how you would fix it."

5. **Comparative HITL:** "Compare RLHF and Constitutional AI from a HITL perspective. In which phase is the human most important in each approach? Which approach concentrates human judgment more efficiently?"

### Advanced Level

1. **DPO derivation:** "Explain, in terms accessible to an undergraduate, why DPO does not need a separate reward model but RLHF does. What mathematical insight makes this possible?"

2. **Philosophical implications:** "If a language model can pass any behavioral test of language understanding — answering questions correctly, resolving ambiguities correctly, explaining its reasoning — does it understand language? What would it mean to say it doesn't? Does the answer matter for how we design HITL systems?"

3. **Reward hacking:** "Describe a concrete scenario where a language model trained with RLHF might 'hack' its reward model — scoring highly on the reward model's metric while failing to be genuinely helpful. How would DPO or Constitutional AI handle this differently?"

4. **Constitutional AI critique:** "Constitutional AI moves human oversight from individual preference judgments to constitutional design. What is gained and what is lost in this shift? Who should be involved in designing the constitution, and why does that matter?"

5. **Scaling and calibration:** "Language models generally become more capable as they scale (more parameters, more training data). Does calibration improve with scale? What does the research suggest? What are the implications for HITL system design?"

---

## Hands-On Activities

### Activity 1: Ambiguity Audit (20 minutes)
**Setup:** Pairs or small groups
**Task:** Find 5 examples of each:
- Grammatically ambiguous sentences (syntactic ambiguity)
- Pragmatically ambiguous statements (literal vs. intended meaning)
- Irony or sarcasm that an AI might misread
- Cultural references that require background knowledge to interpret

**Discussion:** For each example, describe what context a human uses to resolve the ambiguity. Could that context be given to an AI? At what cost?

### Activity 2: Hallucination Test (25 minutes)
**Setup:** Students with access to a language model (ChatGPT, Claude, Gemini)
**Task:** Design queries specifically intended to probe hallucination risk:
- Ask for citations to obscure academic papers in a real subfield
- Ask for a historical event in a country with limited English-language online presence
- Ask for a legal precedent in a niche area of law
- Ask the model to verify its own answers

**Record:** Rate each response — Did the model hedge appropriately? Was it wrong? Did it confabulate specific details (dates, names, statistics)?

**Discussion:** What patterns do you notice? What kinds of queries produce the most confident wrong answers?

### Activity 3: HITL Design for a Legal Chatbot (30 minutes)
**Scenario:** You are designing a chatbot for a law firm's public-facing website. The chatbot will answer questions from potential clients about family law (divorce, child custody).

**Task:** Design the HITL system using all five dimensions:
1. When does the chatbot answer directly?
2. When does it hedge?
3. When does it refuse and escalate to a human attorney?
4. What language does it use for each response type?
5. How does the chatbot's behavior get updated over time based on performance?

**Deliverable:** A decision flowchart + sample responses for three scenarios:
- "What is the standard process for an uncontested divorce in California?"
- "My husband threatened to take my kids if I file. What should I do?"
- "Can I get alimony if I was the one who cheated?"

### Activity 4: Rating Pairs — RLHF Simulation (20 minutes)
**Setup:** Instructor prepares 10 pairs of model responses to the same prompt (can be real AI outputs or instructor-written examples)

**Task:** Students independently rate each pair, choosing the preferred response and briefly explaining why.

**Debrief:** Compare ratings across students. Where is there disagreement? What does disagreement reveal about the difficulty of the RLHF rater task? What guidelines would you write to improve consistency?

### Activity 5: Constitutional Design (25 minutes)
**Task:** Working in groups, draft a "constitution" of 10–15 principles for a language AI deployed as a health information assistant.

**Requirements:**
- Address: honesty, safety, scope limitations, escalation behavior
- Consider: What should the AI actively do? What should it never do? What should trigger escalation?

**Compare:** Different groups share their constitutions. Where do principles conflict? How would you resolve conflicts? This surfaces the difficulty of value encoding in Constitutional AI.

---

## Common Misconceptions and How to Address Them

### Misconception 1: "The AI is lying when it hallucinates"

**Student thinking:** "If it says something false, it must know the truth and is deliberately misleading."

**Correction:** The model has no "truth" it's concealing. It has no access to ground truth — only to patterns in training data. Hallucination is not deception; it's confabulation. The model generates plausible text; it has no mechanism to verify that text against reality. This distinction matters legally and ethically: the model is not a deceiving agent, but the *system* that deploys it with no safeguards may be acting deceptively.

### Misconception 2: "Better models will eliminate hallucination"

**Student thinking:** "GPT-5 will be too smart to make up court cases."

**Correction:** Hallucination is a structural property of text prediction, not a scale limitation. Larger models hallucinate less on well-represented topics, but they also gain more confident-sounding language for topics they know nothing about. More capable models can confabulate *better* — more plausibly, with more internally consistent invented details. The solution is calibration and HITL design, not just scale.

### Misconception 3: "Attention means the model understands context like a human does"

**Student thinking:** "The attention mechanism shows the model knows which words are connected."

**Correction:** Attention is a mathematical operation that weights earlier representations when computing later ones. It does produce something that *functions like* contextual understanding in many cases. But it doesn't constitute understanding in the philosophical sense — there's no semantic grounding, no world model, no verification against reality. This is precisely why the "does it understand?" question is genuinely open.

### Misconception 4: "RLHF makes models unbiased"

**Student thinking:** "Human feedback fixes the model's biases."

**Correction:** RLHF introduces new potential biases from the raters. If raters are predominantly from one demographic, or are trained to prefer a particular writing style, or systematically undervalue certain kinds of helpfulness, those biases are baked into the reward model and amplified through training. RLHF addresses some failure modes while potentially introducing others. Diversity and representativeness of the human feedback pipeline is a critical open problem.

### Misconception 5: "Content moderation just needs better AI"

**Student thinking:** "Once AI is good enough at detecting harmful content, we won't need human reviewers."

**Correction:** The adversarial nature of harmful content means the goalposts always move. Adversaries learn what the automated system catches and adapt. Human reviewers are needed to handle novel forms of harm, adjudicate borderline cases, and provide feedback that updates the system. Moreover, some content moderation decisions involve genuine value disagreements that require human judgment, not just classification. The human is not in the loop temporarily — the loop is by design.

---

## Assessment Strategies

### Formative Assessment

**Exit ticket:** "Explain in 3–4 sentences why a language model hallucinating is fundamentally different from a calculator giving a wrong answer. What does this imply for how we should use language models?"

**Concept check poll:**
- "True or False: A language model that can discuss any topic must understand those topics."
- "Which HITL shape involves the human *before* the model is deployed? (Alignment training)"
- "What is the main structural reason language models hallucinate?"

### Summative Assessment Options

#### Option 1: Case Analysis Paper (800 words)
**Prompt:** "Analyze the Mata v. Avianca case (or another documented AI hallucination incident of your choice) using the five-dimension framework. Identify which dimensions failed, explain why each failure occurred given what you know about how language models work, and propose a specific redesign that would have prevented the failure."

**Rubric:**
- Framework application (30%)
- Technical accuracy about language model behavior (25%)
- Practical feasibility of redesign (25%)
- Writing clarity (20%)

#### Option 2: HITL Design for Language AI (design + rationale)
**Prompt:** "Design a HITL system for a language AI deployment in a domain of your choice (medicine, law, education, journalism). Specify the three HITL shapes (how the model handles real-time queries, how content is moderated, how model behavior is updated over time). Apply the five-dimension framework explicitly."

**Deliverables:** System diagram + 600-word rationale

#### Option 3: Technical Report
**For courses with technical prerequisites.**
**Prompt:** "Compare RLHF and DPO from a technical standpoint. Describe the mathematical objective of each, the role of the human in each, and the practical tradeoffs. Then describe a scenario where you would choose one over the other and justify your choice."

---

## Connections to Other Chapters

### Backward Links
- **Chapter 1:** Air Canada chatbot — the "confidently wrong" failure revisited with technical depth
- **Chapter 2–4:** Five-dimension framework applied to language AI context
- **Chapter 9:** RLHF/DPO/GRPO as previously introduced alignment techniques, now treated in detail

### Forward Links
- **Chapter 11:** Computer vision — parallel challenges, different failure modes (adversarial examples vs. hallucination)
- **Chapter 12–14:** Domain-specific applications (healthcare, education, legal) where language AI HITL is most consequential

### Bridge B (between Ch9 and Ch10)
*See separate Bridge B document.* The bridge should emphasize: we've covered HITL design in general and in structured learning systems. Now we turn to the modalities — language first, then vision — to understand how HITL works in systems that process the kinds of information humans naturally communicate with.

---

*Next: Chapter 11 Teacher's Manual — Teaching Computers to See*
