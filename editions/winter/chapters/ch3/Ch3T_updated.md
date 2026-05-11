# Chapter 3 Teacher's Manual: How Computers Learn (The Simple Version)

*Complete instructional guide*

---

## Learning Objectives

By the end of this chapter, students will be able to:

**Knowledge:**
- Describe the three steps of supervised machine learning (data, training, generalization)
- Define overfitting and underfitting and identify which is more dangerous for HITL
- Explain the generalization gap and why it is permanent for any learnable system
- Describe the train/test split and its relationship to deployment performance

**Application & Analysis:**
- Identify which cases in a deployment scenario are most likely to be near the distribution edge
- Evaluate whether a model's poor performance is due to overfitting or underfitting
- Predict which types of inputs will most benefit from human review, given knowledge of training data

**Synthesis:**
- Design a data collection strategy to reduce epistemic uncertainty in a specific domain
- Propose HITL routing criteria based on knowledge of the training distribution
- Critique AI system claims that "more data" or "better architecture" eliminates the need for human oversight

---

## Prerequisites

- Chapters 1 and 2 (required): HITL framework, uncertainty types
- No mathematical background required for main chapter; Appendix 3A requires linear algebra and statistics

---

## Suggested 50-Minute Lecture Structure

### Minutes 0-7: Opening — The Teacher with the Folder
Open with the cat/dog teacher metaphor. Work through it slowly:
- The training set is the folder of labeled photographs
- Learning = noticing patterns in the folder
- Generalization = applying those patterns to new photographs

Ask students: "Has this ever happened to you — you learned a rule from limited examples and then it failed when you encountered something different?" Draw the parallel to machine learning systems.

### Minutes 7-17: The Three Steps
Walk through Gather → Learn → Generalize with concrete examples from each step:
- Gather: Gmail spam folder (your clicks are labeling data); ImageNet (millions of labeled images); Wikipedia (unlabeled text for language models)
- Learn: the model adjusts weights until patterns match (don't need the math — use the analogy of a dimmer switch adjusting until the room is the right brightness)
- Generalize: the new email it has never seen

**Key question to pose:** "What happens when the new email is very different from anything in the training set?" (Leads into distribution edges)

### Minutes 17-27: Overfitting vs. Underfitting
Use the blue-background cat example for overfitting. Make it vivid:
- Draw a scatter plot on the board with two classes
- Show a simple decision boundary (underfitting — misses the structure)
- Show a wiggly boundary that fits every point perfectly (overfitting — fits noise)
- Ask: which boundary would you trust on new data?

**The HITL connection:** Overfit models are confident but wrong on novel inputs. This creates the danger of silent errors — bad outputs that don't trigger uncertainty flags.

### Minutes 27-37: The Generalization Gap
Central argument: **even a perfect learner has edges**. This is not a temporary problem. It is a property of learning from finite data.

Use the "new situation" examples:
- Model trained on 2020 data deployed in 2025 (language change, new topics, new technologies)
- Model trained on US patients deployed in a Nigerian clinic
- Model trained on clear weather images deployed during fog season

The generalization gap = the distance between what the model has seen and what the world shows it.

**Crucial pedagogical moment:** Many students will object "but can't you just train on more data?" The answer is yes — and you should — but more data from the same distribution doesn't help with out-of-distribution inputs. The edges move but they don't disappear.

### Minutes 37-44: The Train/Test Gap as HITL Metaphor
The test set is the lab. Deployment is the field. The field is harder.

Draw on the board:
```
Training distribution → Test distribution → Deployment distribution
(same source)          (same source)        (real world: wider, weirder)
```

This three-way distinction is often missing from ML education. Test performance does not predict deployment performance on edge cases. This is why HITL exists.

### Minutes 44-50: Try This + Discussion
Set up the Try This exercise. Close with the key takeaway: "The need for human help at the edges of machine learning is not a bug in the current technology. It is a structural feature of learning from data. The question is not whether to involve humans — it's how to do it well."

---

## Discussion Questions by Level

### Introductory
1. Describe a time you "overfitted" to a limited set of examples in your own life — drew a rule from too few cases that failed when you encountered something new. How does this relate to machine learning?
2. A spam filter is trained on business email from 2018. In what ways might emails from 2025 be different? Which differences would be likely to create distribution edge cases?
3. Why is it not sufficient to just test a machine learning system on a test set before deploying it? What does the test set miss?

### Intermediate
4. A medical AI trained on data from five major U.S. hospitals is deployed in rural health clinics in Kenya. Identify three specific types of distribution shift you would expect, and for each, predict what kind of errors the model would make.
5. A model achieves 98% accuracy on its training set and 87% accuracy on a held-out test set drawn from the same distribution. What do these numbers suggest? Now it achieves 72% accuracy in deployment. What does the deployment gap suggest?
6. Explain how overfitting creates a particular challenge for uncertainty-based HITL routing: why might an overfit model fail to flag the cases it most needs help with?

### Advanced
7. Using the bias-variance decomposition (from Appendix 3A), explain why the human-in-the-loop value is highest for high-variance models and lowest for high-bias models. What does this imply about when to invest in HITL vs. when to invest in data collection?
8. PAC learning theory provides sample complexity bounds: the number of examples needed to achieve a given error rate with given probability. How does this framework explain why rare-category detection requires disproportionately large amounts of labeled human feedback?

---

## Common Misconceptions

**"More data solves the generalization problem."**
More data helps with epistemic uncertainty within the training distribution. It does not help with genuinely novel inputs (aleatoric uncertainty or wildcard distribution shift). The edges of the distribution shift but do not disappear. Correct this carefully — "more data" is good but not sufficient.

**"Overfitting means the model is wrong about everything."**
Overfitting means the model is wrong about inputs that differ from the training distribution in the ways the model overfit to. It may be very accurate on typical inputs. The problem is that the wrong predictions often occur with false confidence.

**"The test set tells you how the model will perform in the real world."**
Only if the deployment distribution matches the test distribution. This is often not true in practice. The test set is usually cleaner, more balanced, and more similar to training than real-world deployment.

**"Neural networks learn rules."**
They learn weights. The "rule" is not extractable in human-readable form. This has direct implications for oversight: you cannot audit a neural network's reasoning by reading its rules.

---

## In-Class Activities

### Activity: Distribution Edge Map (15 min)
Give students a scenario: "A content moderation AI is trained on social media posts from English-speaking users in the US, UK, and Australia from 2019-2022." Students identify five categories of cases that would be at or beyond the distribution edge, and predict what kind of errors the model would make on each. Share and discuss.

### Activity: Overfit/Underfit Diagnosis (10 min)
Present three systems with their train/test/deployment accuracy numbers:
- System A: 99% train, 98% test, 91% deployment
- System B: 77% train, 76% test, 73% deployment
- System C: 98% train, 71% test, 65% deployment

For each: is this more consistent with overfitting, underfitting, or deployment distribution shift? What HITL intervention would most help?

### Activity: What Was the Training Data? (10 min)
Show students AI failure examples and ask them to reverse-engineer what the training data likely contained and what it lacked. Examples: autocorrect failures on unusual names; translation errors on informal text; image classifiers failing on skin tones.

---

## Assessment

**Short Answer:** "Explain the generalization gap and give one example of a real AI deployment where it has caused problems. What human-in-the-loop mechanism would help in your example?"

**Essay:** "Some argue that with enough data and compute, AI systems will eventually generalize well enough that human oversight becomes unnecessary. Using concepts from this chapter, argue why this claim is incorrect in principle. Your argument should use at least two of the following: distribution shift, overfitting, aleatoric uncertainty, rare categories."

---
