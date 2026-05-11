# Human in the Loop: Autumn / Before You Ship
### A Field Guide for People Building HITL Systems

---

> *"The theory is clean. The production system is not. This guide is for the production system."*
> — Ray, somewhere between the third failed deployment and the post-mortem

---

## Why This Edition Exists

You know what a human-in-the-loop system is. You've done the exercises. You've read the case studies. You understand why GPS into a lake is a failure of uncertainty detection and why the Nest thermostat is a case of silent asking.

Now you are building one.

This edition is for that moment — the one where the framework has to meet the messy reality of annotation pipelines, confidence thresholds, feedback contamination, and the quiet organizational pressure to remove the human because they slow things down.

These are field notes. Structured around the practitioner's actual workflow: before you build, while you're building, after you ship, and before you take the human out.

**A word about voice:** Ray is writing this one. Less cheerful than Summer. More like someone who has made the mistakes and decided you shouldn't have to make all of them yourself.

---

## Section 1: Before You Build

*The decisions you skip here are the ones that bite you in production.*

---

### 1.1 The Routing Question

Before any architecture discussion, answer this in plain language:

**When does a case go to a human, and when does it not?**

Write it down. If you can't write it down in two sentences, you don't have an answer yet. You have a vague intention.

Routing logic is the spine of a HITL system. Everything else — the annotation tools, the feedback loop, the monitoring dashboard — serves this decision. Systems that fail in production usually fail because the routing logic was implicit, assumed, or decided later.

**The three routing failure modes:**

1. **Threshold arbitrariness** — "We'll send anything below 0.7 confidence to a human." Why 0.7? Because someone typed it. This is the Threshold Problem (see 1.4).
2. **Routing by cost, not by value** — Cases are routed to humans to reduce model liability, not because humans add decision value. This is automation theater with an annotation step.
3. **Routing logic that doesn't survive contact with data** — The routing rule makes sense on the distribution you designed for, not the distribution that arrives.

> *"The routing logic should be the first thing in the design document and the last thing you change. If it keeps shifting, you haven't decided what problem you're solving."*
> — Ray

---

### 1.2 Measuring Whether the Human Is Adding Value

This question is embarrassing to ask, so people don't ask it. They should ask it before they build, not after they've deployed.

**The Human Contribution Index (HCI):**

```
HCI = P(routed) × (Acc_human_routed − Acc_model_routed)
```

Where:
- **P(routed)** = the proportion of cases that actually reach a human
- **Acc_human_routed** = accuracy of the human decision on the routed subset
- **Acc_model_routed** = what accuracy the model alone would have achieved on that same subset

**What it tells you:**

| HCI | Interpretation |
|-----|---------------|
| High positive | Humans are adding real value on the cases they review |
| Near zero | Humans are seeing the hard cases and doing no better than the model would |
| Negative | Humans are performing worse than the model on the routed cases |
| Misleadingly high | P(routed) is very low — humans rarely see anything; your metric looks good because the sample is tiny |

**How to use it:**
- Measure HCI by category, not just overall. A system that adds value for rare categories and fails on common ones looks fine in aggregate until a common-category error causes an incident.
- HCI near zero is not a reason to remove humans. It may mean: cases being routed are too hard for anyone; the human interface is poorly designed; annotators lack the context to make good decisions. Diagnose before you act.
- HCI should be tracked over time. A declining HCI is a signal that something has drifted.

---

### 1.3 What Your Feedback Loop Actually Does

Every HITL system has a feedback loop in the design document. Most of them don't work in production.

Ask these questions explicitly before you build:

**Does the feedback loop close?**
- Human reviews a case → where does that decision go?
- Is it stored? Is it stored in a way the model can learn from?
- How long until a human decision affects model behavior? A week? Six months? Never?

**What exactly is fed back?**
- The override decision only? Or the full context the human saw?
- If an annotator changes a label, do you store the original label, the changed label, and the reason for the change? Or just the final label?

**Who controls the feedback?**
- Can annotators introduce systematic bias through the feedback loop?
- Is there a review layer before human decisions enter training data?

**Does the loop have a delay pathology?**
If the loop closes too slowly, the model keeps routing old-distribution errors to humans long after the humans have corrected them. The system learns slowly. This is not just inefficient — it is a trust problem. Annotators who see the same errors repeatedly believe the loop is broken. Sometimes they are right.

> *"The feedback loop diagram in the architecture doc is always beautiful. The actual latency between annotation and model behavior is something nobody wants to put in the diagram."*
> — Ray

---

### 1.4 The Threshold Problem

Confidence thresholds are where good intentions become arbitrary numbers.

The question "when should we route to a human?" deserves a real answer, not a default.

**Why 0.7 is almost always wrong:**

A threshold is a tradeoff between two costs: the cost of wrongly handling an edge case automatically (false confidence) and the cost of routing too many cases to humans (false uncertainty). These costs are not symmetric, and they are not constant across categories.

**The right way to set thresholds:**

**Step 1 — Measure, don't assume.** Plot your model's calibration curve. Find the confidence range where accuracy actually drops. Set thresholds based on that range, not on intuition.

**Step 2 — Make costs explicit.** For each category:
- What is the cost of an automated error?
- What is the cost of unnecessary human review?
- What is the relative magnitude of those costs?

**Step 3 — Threshold by category.** A 0.85 threshold might be correct for low-stakes decisions and far too lenient for high-stakes ones. One global threshold is almost never the right answer.

**Step 4 — Validate on production distribution, not test set.** The test set you used to choose the threshold may not represent what arrives after deployment. Sample production data within the first two weeks and recalibrate.

**The minimum threshold documentation:**
Before shipping, you should be able to state:
- What the threshold is, per category
- What data it was set on
- What the expected routing rate is at that threshold
- Who owns threshold adjustment after deployment

---

## Section 2: The Annotation Pipeline

*Running annotation at scale means making decisions about disagreement, quality, and what the labels are actually for.*

---

### 2.1 Tool Selection

The right annotation tool depends on task type, data volume, team structure, and whether you need active learning integration. Here is a practical decision matrix:

| Tool | Best for | Strengths | Limitations |
|------|----------|-----------|-------------|
| **Label Studio** | Multi-modal tasks, flexible schema, self-hosted need | Open source, flexible data types, integrates with most ML stacks | UI can be slow at scale; setup overhead |
| **Scale AI** | High-volume production annotation with managed workforce | Speed, workforce, QC built in, API-first | Cost, less control over annotator selection, external data |
| **Prodigy** | Tight active learning loops, developer-facing, small teams | Scriptable, fast to customize, excellent active learning | Per-seat license, steeper learning curve, not a managed workforce |
| **Argilla** | NLP tasks, LLM feedback collection, preference annotation | Strong LLM integration, open source, good for RLHF pipelines | Less mature for non-NLP data types |

**When to combine tools:** Use Argilla or Prodigy for the active learning selection layer (deciding what to label), and Scale AI or a managed workforce for the actual annotation throughput. The tools are not mutually exclusive.

**What the tool cannot solve:** No annotation platform fixes a poorly defined task. Before you pick a tool, write the annotation guidelines. If the guidelines are ambiguous, annotation will be too — regardless of tool.

---

### 2.2 Inter-Annotator Agreement: When to Resolve and When to Preserve

**Measuring agreement:**

| Task Type | Appropriate Metric | Acceptable Threshold |
|-----------|-------------------|---------------------|
| Binary classification | Cohen's κ | κ > 0.6 (substantial) |
| Multi-class classification | Fleiss' κ | κ > 0.6 |
| Ordinal (ratings, scales) | Krippendorff's α | α > 0.67 |
| Sequence labeling (NER, spans) | F1 over annotated spans | F1 > 0.8 for common entities |
| Preference ranking (RLHF) | Agreement rate + Krippendorff's α | Context-dependent |

**When to resolve disagreement:**
- Training data for a discriminative model typically needs a single ground truth label
- When disagreement is caused by ambiguous guidelines (fix the guidelines, then re-annotate)
- When one annotator is systematically wrong (calibration or expertise issue — flag and investigate)

**When to preserve disagreement:**
- When annotators are genuinely seeing different things because different interpretations are valid
- For subjective tasks (toxicity, sentiment, offensiveness), the distribution of labels is informative — collapsing it loses information
- For uncertainty quantification — multiple labels allow you to model label noise, which trains better-calibrated models than forcing consensus
- When building contestability data: cases with high disagreement are often exactly where future users will contest the system's decisions

**The honest label problem:**

A gold label is the label assigned after adjudication or expert review. It is the "correct" answer for training purposes. An honest label is what an annotator actually believed, before knowing anyone else's answer.

These are not always the same, and the difference matters:

- Gold labels anchor training to consensus; honest labels capture genuine uncertainty
- Systems trained only on gold labels learn to mimic consensus — they may perform poorly on the contested cases where honest disagreement existed
- For HITL systems specifically: the cases your annotators disagreed most about are often the exact cases that should trigger human review in deployment. Preserve that signal.

---

### 2.3 Quality Control: Overlap Sampling and Calibration Batches

**Overlap sampling:**

Route a fixed percentage of annotation tasks (typically 5–15%) to two or more annotators. Use this to:
- Monitor inter-annotator agreement over time (not just at project start)
- Detect annotator drift (quality changes as annotators fatigue or adapt)
- Catch tool or task definition bugs before they contaminate the full dataset

A common mistake: doing overlap sampling only at project start to "validate annotators," then stopping. Agreement can degrade significantly over weeks or months. Maintain overlap throughout.

**Calibration batches:**

A calibration batch is a set of cases with known correct answers, inserted into the annotation queue without annotators knowing they are calibration items. They serve as a running quality signal.

How to build a calibration batch:
1. Select cases where you have high-confidence ground truth (expert adjudication, verifiable external source)
2. Insert at regular intervals — not as a block at the start
3. Track per-annotator accuracy on calibration items separately from production items
4. Use calibration scores to weight annotator contributions in multi-annotator setups

**What to do when calibration scores drop:**
- First, check if the task has drifted (new data distribution, new edge cases not covered by guidelines)
- Then, check if the guidelines need updating
- Then, check if annotators need refresher sessions
- Only after ruling out systemic causes: address individual annotator performance

---

## Section 3: The Loop in Production

*Shipping is not the end of the design process. It is the beginning of a different one.*

---

### 3.1 Monitoring for Drift

Distribution drift is the most common cause of silent HITL failure in production. The model was calibrated on your training distribution. Production data drifts. The model's confidence scores stop meaning what they meant.

**Three types of drift to monitor:**

| Type | What it means | How to detect |
|------|--------------|---------------|
| **Input drift** | The data arriving at inference looks different from training data | Monitor input feature statistics; track embedding distance from training distribution |
| **Concept drift** | The relationship between input and correct output has changed | Track human override rate; monitor accuracy on held-out gold set |
| **Label drift** | The distribution of correct labels has shifted (e.g., seasonal effects) | Monitor label distribution of model predictions; compare to historical |

**Minimum monitoring stack:**
- Confidence score distribution (track the histogram weekly — a shift means something changed)
- Override rate (see 3.4)
- Human agreement with model on routed cases (HCI over time)
- Error rate on rolling calibration set

You do not need a sophisticated drift detection system to get started. You need someone whose job it is to look at these numbers weekly.

---

### 3.2 Signs the Loop Has Stopped Working

These are not alarms. They are patterns that accumulate quietly until something breaks loudly.

**Warning signs:**

- **Annotator completion rate drops** without explanation. Annotators are de facto signaling the task has become harder or less tractable. Ask them before assuming it is a motivation problem.
- **Override rate changes significantly.** A sudden drop means annotators stopped overriding things they should override. A sudden rise means confidence thresholds are no longer calibrated to difficulty.
- **Calibration batch accuracy declines** across multiple annotators simultaneously. This points to task drift, not individual performance.
- **Feedback latency increases.** The gap between annotation and model update grows. The loop is backing up. Usually organizational, not technical.
- **The same type of error recurs in production** despite being in the training data. The feedback loop is not closing, or the data volume for that error type is insufficient.
- **Annotators stop adding comments.** Comment fields are an informal signal. When they go quiet, annotators either have nothing to say or have stopped engaging. Both are worth investigating.

> *"The loop doesn't fail all at once. It fails the way a conversation dies — gradually, then obviously."*
> — Ray

---

### 3.3 The Feedback Contamination Problem

This is the one nobody talks about until it causes an incident.

**The mechanism:**

Human decisions feed into training data. Training data shapes the model. The model shapes what gets routed to humans. If humans have systematic biases — and they do — those biases enter the model. The model then routes cases that confirm those biases to humans, who confirm them again. The loop amplifies rather than corrects.

**Common contamination patterns:**

1. **Annotator anchoring** — annotators are shown the model's prediction before labeling. They adjust toward the model's answer even when they would have labeled differently. The model learns its own predictions, not ground truth.

2. **Workflow-induced shortcutting** — annotation interfaces that make certain labels faster encourage those labels. Over time, the training data reflects interface design, not true label distribution.

3. **Systematic annotator demographic mismatch** — annotation teams with limited demographic diversity produce labels that reflect that composition. For tasks with social content, this is a fairness issue that compounds over retraining cycles.

4. **Temporal drift contamination** — production data from an anomalous period (seasonal spike, news event, system outage) enters training without being flagged as anomalous. The next model learns the anomaly as normal.

**How to reduce contamination risk:**
- Show model confidence to annotators, not model predictions where avoidable
- Rotate annotators across task types to reduce systematic anchoring
- Date-stamp production annotation batches and flag anomalous periods
- Maintain a held-out validation set that is never used in training, drawn from the same production distribution

---

### 3.4 Override Rate as a Signal

Override rate is the proportion of human reviews that result in a different decision from the model's recommendation.

**What a healthy override rate looks like:**

There is no universal answer. A system routing high-uncertainty cases to expert reviewers might have a 40% override rate and be working perfectly. A system routing cases to rubber-stamp reviewers might have a 2% override rate and be failing silently.

The question is not the number. The question is whether it makes sense given the task.

**Why a very low override rate is often a warning:**

- Annotators may have learned that overrides generate extra work (justification required, re-review queued) and have stopped making them
- The routing logic may have shifted to only send obvious cases — cases so clear the model was right anyway
- Annotators may not have the context, expertise, or time to disagree with the model meaningfully
- The interface may not make it easy enough to override

**Tracking override rate correctly:**

- Track per-annotator, not just aggregate (individual variance reveals interface problems and expertise gaps)
- Track per-category (a low aggregate rate may hide a zero override rate in a critical category)
- Track over time, not just as a snapshot
- Correlate with calibration batch accuracy — low override rates from low-accuracy annotators is not reassurance

---

## Section 4: Fairness and the Loop

*Fairness in HITL systems is not a compliance check. It is a systems problem.*

---

### 4.1 Demographic Slice Monitoring

Aggregate accuracy metrics hide differential performance across demographic groups. A model that is 92% accurate overall may be 78% accurate for a minority population — acceptable average, unacceptable disparity.

**Minimum slice monitoring:**

Define the demographic dimensions relevant to your task before deployment. For each dimension, track:
- Accuracy (or relevant performance metric)
- Routing rate (does the system route certain groups to human review more often? Why?)
- Override rate (do human reviewers disagree with model predictions more or less for certain groups?)
- Human accuracy on routed cases (are human reviewers less accurate for certain groups on the routed cases?)

**The routing rate question matters more than people realize:**

If your model routes Group A cases to human review at twice the rate of Group B cases, that is not automatically fair treatment of Group A. It may mean:
- The model is less confident for Group A (plausible, especially if Group A was underrepresented in training)
- Group A cases are systematically harder (may be true, may also reflect data quality issues)
- Group A is being subjected to more scrutiny for non-performance reasons

Differential routing deserves investigation before it is accepted as normal.

---

### 4.2 The Feedback Loop Fairness Failure Pattern

This pattern occurs frequently in HITL systems deployed at scale:

1. Model is less accurate for minority group due to underrepresentation in training data
2. Lower accuracy → more cases from minority group routed to human review
3. Human review has its own biases (annotator demographic mismatch, anchoring on model predictions)
4. Biased human decisions enter training data
5. Next model inherits both original underrepresentation bias and human annotator bias
6. Minority group accuracy degrades further, or improves only for the majority subpopulation of the minority group

**Breaking the pattern requires intervention at multiple points:**

- Oversample minority group annotation and have it reviewed by annotators with relevant expertise or lived experience
- Use separate calibration batches for high-disparity groups
- Flag retraining cycles where minority group accuracy drops even slightly — this signal is easily dismissed as noise
- Do not close the feedback loop on cases where human-model agreement was low in high-disparity categories

---

### 4.3 Contestability in Practice

Contestability means a user can challenge the system's decision and have that challenge meaningfully evaluated.

Most HITL systems that claim contestability do not have it. They have a feedback button.

**What a real contestability pathway requires:**

| Component | What it means in practice |
|-----------|--------------------------|
| **Accessible entry point** | User can submit a contest without navigating five menus or calling a phone number |
| **Routed to a qualified human** | Contest goes to someone with authority to change the decision and expertise to evaluate it, not to a queue that closes unread |
| **Substantive review** | The human reviewer sees: original input, model output, user's contest reason, and the user's context — not just the decision |
| **Timely response** | Response within a defined window. Weeks is not timely for decisions that affect access to services |
| **Feedback to the system** | Successful contests trigger review of similar cases (not just the individual case) |
| **Non-adversarial framing** | Contesting does not penalize the user or trigger additional scrutiny |

**Why most "contestability" is theater:**

The feedback button exists in the UI. Nobody checks it. Or someone checks it and has no authority to change the decision. Or the review process requires the user to provide documentation that is impossible to obtain. Or the contest is processed in eight weeks after the decision had consequences that cannot be undone.

Design the contestability pathway with the same rigor as the core decision pathway. Then test it: have someone from outside the team actually attempt to contest a real decision.

---

### 4.4 The Compliance Theater Problem

Compliance theater is when a HITL system is designed to demonstrate that a human is involved, rather than to ensure that a human is meaningfully involved.

**Signs of compliance theater:**

- The human "review" step has a target time of under 30 seconds per case
- Human reviewers are not given context they would need to disagree with the model
- Override data is collected but never reviewed or acted upon
- The "human in the loop" is a formality that approves at a rate above 98%
- HITL is mentioned prominently in external communications but treated as a bottleneck internally

**Why it happens:**

Compliance theater emerges when the pressure to ship and scale conflicts with the design overhead of genuine human involvement. The HITL label provides legitimacy; the actual workflow minimizes human influence.

**Why it matters:**

A system with compliance theater is, in most material ways, a fully automated system. It carries additional risks: the appearance of human oversight provides false assurance to users, regulators, and the organization. The actual errors are the same as a fully automated system. The liability framing may be worse.

If your HITL is theater, either make it genuine or remove it and be honest about what you have.

---

## Section 5: Making the Human Genuine

*The design and organizational conditions for review that is not rubber-stamping.*

---

### 5.1 What "Genuine Presence" Means in Practice

A human is genuinely present in a review loop when:

1. They have sufficient **context** to evaluate the case on its merits
2. They have sufficient **authority** to act on their judgment
3. They have sufficient **time** to form an actual judgment
4. Their decision has a **real effect** on outcomes
5. Their disagreement with the model is **welcomed**, not penalized

Genuine presence is not about whether a human is in the workflow. It is about whether the human's judgment is actually being consulted.

A common failure: the review interface shows the model's recommendation prominently, the case data below it in a smaller font, and the override button requires an additional confirmation step. The design communicates: "default to the model." This is not an accident. It is a choice that reduces genuine presence.

---

### 5.2 Design Patterns That Foster Real Engagement

**Show the model's uncertainty, not just its recommendation.**

"85% confident: Approve" is more useful to a reviewer than "Approve." The confidence score tells the reviewer how much weight to give the model. Without it, reviewers cannot calibrate their own attention.

**Present the case before the model's decision.**

When possible, ask the reviewer what they think before showing the model's output. This reduces anchoring. It takes discipline to implement against interface design conventions, but the annotation quality improvement is measurable.

**Make disagreement the same number of clicks as agreement.**

If approving a model recommendation takes one click and overriding takes three clicks plus a text justification, you have designed a system that discourages overrides. Count the clicks. Make them symmetric.

**Use structured disagreement.**

Instead of a free-text override reason, offer a structured set of options for why the reviewer disagrees. This produces actionable training signal and reduces the friction of override. Options like "Model missed context visible in the image" or "This is a borderline case I'd classify differently" are more useful than "other."

**Rotate case types within sessions.**

Reviewing the same category of case for four consecutive hours creates habituation. Accuracy drops, overrides cluster, variability decreases. Mix case types within annotation sessions where task complexity allows.

---

### 5.3 Pacing and Cognitive Load

Annotation accuracy is not constant over a session. It follows a predictable arc:

- **Opening period:** Higher variance, lower speed, higher accuracy on genuinely hard cases
- **Warm-up period:** Increasing speed, stable accuracy
- **Sustained performance window:** Optimal
- **Fatigue onset:** Speed stays constant or increases; accuracy on hard cases drops; override rate drops
- **Late fatigue:** Errors on cases that were correctly handled earlier in the session

**Practical implications:**

- Do not front-load the most consequential cases. Put calibration items across the whole session, not just the beginning.
- Track per-annotator accuracy over session time, not just overall. You will see the fatigue curve.
- Set realistic session lengths with breaks. Most annotation QC research points to cognitive fatigue setting in after 45–90 minutes of uninterrupted work, depending on task complexity.
- For high-stakes review tasks, shorter sessions with documented breaks are not overhead — they are quality control.

---

### 5.4 The Five Design Principles for Genuine Human Review

These are not theory. They are the minimum checklist for designing a review interface that will actually produce human judgment rather than human rubber-stamping.

**Principle 1 — Give reviewers what they need to disagree.**
The interface should include everything a reasonably informed person would need to form an independent opinion. Not just the data the model used. The context around it.

**Principle 2 — Make the model's confidence visible and meaningful.**
Calibrate confidence displays to actual model accuracy. A confidence score that is not calibrated is misleading. Reviewers should be able to trust that "high confidence" means something.

**Principle 3 — Structure the feedback so it is learnable.**
Override reasons, agreement ratings, and flag categories should be designed for downstream use. "I disagreed" is not training signal. "The model missed the negation in the second sentence" is.

**Principle 4 — Protect cognitive capacity.**
Pacing, session length, break structure, and case variety are design decisions, not HR decisions. The annotation system designer is responsible for the cognitive conditions of the reviewers.

**Principle 5 — Close the loop visibly.**
Show annotators, over time, what happened to their decisions. Did the model improve in areas where they flagged errors? Visible feedback loop closure is the organizational signal that the work matters. Without it, engagement declines.

---

## Section 6: The Handoff Checklist

*Before you ship. Before you scale. Before you remove a human.*

---

### 6.1 The 12-Question Checklist

This checklist is not bureaucracy. It is a structured way to surface the decisions you made implicitly and ask whether they were the right ones.

Answer each question in writing. If you cannot answer it in writing, you have work to do before you ship.

---

**Before you ship:**

**Q1. Can you state the routing logic in two sentences?**
If not: you do not have a routing logic. You have an assumption. Stop and write the logic down.

**Q2. Has the confidence threshold been set on data representative of your production distribution?**
If not: recalibrate. The test set you used to choose the threshold may not be the distribution that arrives.

**Q3. Do you have a baseline measurement of human accuracy on the cases that will be routed to humans?**
If not: you will have no way to know, post-launch, whether the human is adding value or degrading it.

**Q4. Is the feedback loop closed with a defined latency?**
If not: establish the expected time between human annotation and model update. Document who is responsible for closing it.

**Q5. Have you tested the annotation interface for override symmetry?**
Count clicks to agree with the model. Count clicks to override. If they are not equal, redesign.

**Q6. Is there a contestability pathway for end users?**
If your system makes decisions that affect users, define how a user can challenge a decision and have it reviewed by a human with authority to change it.

---

**Before you scale:**

**Q7. Does your HCI stay positive at higher routing volumes?**
HCI can look healthy at pilot scale and collapse when annotator-to-case ratio drops. Measure it under the projected scaled load before scaling.

**Q8. Have you characterized the fairness profile across demographic slices?**
If accuracy is meaningfully different across groups, know why before you scale. Scaling amplifies disparities.

**Q9. Is your calibration batch large enough to detect drift at production volume?**
A calibration batch that worked at 100 cases/day may be statistically underpowered at 10,000 cases/day. Recalculate.

**Q10. Do you have a mechanism to detect feedback contamination?**
Specifically: are model predictions shown to annotators before annotation? Is there a procedure for flagging anomalous time periods in the training data?

---

**Before you remove a human:**

**Q11. Has HCI been positive and stable for a defined period under production conditions?**
The model performing better than humans on the held-out test set is not sufficient justification for removing humans. The comparison must happen on the actual routed distribution.

**Q12. Is there a reintroduction plan?**
If you remove human review and model accuracy degrades, what is the trigger for reintroduction, and can you actually reintroduce at scale quickly? If not, the decision to remove is irreversible in practice. Treat it accordingly.

---

### 6.2 The Five Questions Your Model Can't Answer About Itself

These questions require human judgment. They are not answerable by examining model outputs, accuracy metrics, or loss curves. They require someone who knows the operational context, the users, and the consequences.

**1. Is the thing the model is optimizing for the thing that should be optimized for?**
Proxy metrics drift from the intended outcome. This is not detectable by the model.

**2. Which errors are acceptable and which are not?**
Error cost is a human values judgment. A model can be told a cost function but cannot evaluate whether that cost function correctly represents the stakes.

**3. Are there categories of users for whom this system should not be deployed at all?**
The model was trained on a distribution. Deployment populations may include people for whom that distribution was never representative.

**4. What is the second-order effect of the system's decisions on its own future input distribution?**
If the system denies a population access to a service, that population stops appearing in the training data for the next model. The loop amplifies the denial.

**5. When is good enough, good enough?**
Optimization has no natural stopping point. The decision to stop improving and ship is a human judgment about what the system is for.

---

## Ray's Closing Note

> I started writing this because I kept having the same conversations. Someone would show me a HITL system and I'd ask about the routing logic and they'd describe a threshold they couldn't justify. Or I'd ask about the feedback loop and they'd show me a diagram that bore no relationship to actual latency. Or the override rate would be 1.3% and nobody found that suspicious.
>
> The theory is clean. The production system is not. The annotation team is fatigued on Fridays. The feedback loop closes in six weeks because the ML team is under-resourced. The override button requires a justification because someone got burned once. The threshold is 0.7 because that's what was in the tutorial.
>
> None of these are reasons to give up on genuine human involvement. They are reasons to treat the human part of the loop with the same engineering seriousness as the model part.
>
> The checklist in Section 6 is not there to slow you down. It is there because the questions are asked eventually — either before you ship or after something breaks. Before is cheaper.
>
> Build the system you would want to be on the receiving end of. Ship when it's ready, not when the deadline says so. And when you take the human out of the loop, be honest with yourself about what you're doing and why.
>
> — Ray

---

## Quick Reference: The Frameworks

**The Five Dimensions:**
Uncertainty Detection — Intervention Design — Timing — Stakes Calibration — Feedback Integration

**The Three HITL Failure Modes:**
Overconfident silence | Alert fatigue | Silent asking

**The Human Contribution Index:**
`HCI = P(routed) × (Acc_human_routed − Acc_model_routed)`

**The Five Design Principles:**
Give reviewers what they need to disagree | Make confidence visible and meaningful | Structure feedback for learning | Protect cognitive capacity | Close the loop visibly

**The Threshold Checklist:**
Measured on production distribution | Set per category | Costs made explicit | Owner defined | Review cadence scheduled

**Warning Signs the Loop Has Stopped Working:**
Annotator drop-off | Unusual override rate movement | Calibration batch decline | Feedback latency increase | Recurring error types | Annotator comments going silent

---

*Part of the "Human in the Loop" series*
*Previous editions: Misunderstood | Misunderstood: Summer Edition | Before You Ship*
*Next: Winter is Coming*
