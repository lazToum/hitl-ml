# Human in the Loop: Summer Workbook Edition

### Activities, Puzzles, and Open Questions for the Curious Annotator

*Your guides for this workbook: Percy, Ray, Manny, Ash, Sage, Gen, and Maya.*

---

## Welcome

This is not a test. There are no grades. Some of the exercises have answer keys at the bottom. Some don't — because the point is the thinking, not the answer.

Grab something to write with. Work alone or with a team. Skip around if you want. Come back to the hard ones later.

---

## Part 1: Word Search

**Percy says:** *"Every field has a vocabulary. Learn the words and you start to see the ideas. Find them here first."*

Find the 15 words hidden in the grid below. Words run left-to-right or top-to-bottom only. Circle or underline each one as you find it.

**Words to find:**

```
UNCERTAINTY   CALIBRATION   FEEDBACK     THRESHOLD    ANNOTATION
ESCALATION    CONFIDENCE    ALIGNMENT    OVERSIGHT    AUTONOMY
LATENCY       ORACLE        BIAS         DRIFT        LABEL
```

**The Grid:**

```
    1  2  3  4  5  6  7  8  9  10 11 12 13 14 15
 1  U  N  C  E  R  T  A  I  N  T  Y  K  P  Q  M
 2  V  H  J  C  A  L  I  B  R  A  T  I  O  N  X
 3  F  E  E  D  B  A  C  K  Z  W  S  Q  L  G  T
 4  D  G  R  E  X  T  H  R  E  S  H  O  L  D  N
 5  A  N  N  O  T  A  T  I  O  N  P  V  K  F  Z
 6  B  M  W  S  E  S  C  A  L  A  T  I  O  N  Q
 7  C  O  N  F  I  D  E  N  C  E  H  R  J  X  Y
 8  L  Z  K  T  A  L  I  G  N  M  E  N  T  W  P
 9  O  V  E  R  S  I  G  H  T  B  Q  F  U  M  V
10  X  D  R  W  A  U  T  O  N  O  M  Y  Z  K  L
11  L  A  T  E  N  C  Y  H  J  P  S  Q  R  V  W
12  G  N  P  O  R  A  C  L  E  T  X  M  B  F  Z
13  B  I  A  S  K  V  W  D  Q  Y  U  J  N  H  C
14  E  Z  D  R  I  F  T  L  G  P  X  W  M  O  R
15  Q  K  V  W  L  A  B  E  L  S  T  N  F  Y  D
```

*Answer key on the last page of this workbook.*

---

## Part 2: Connect the Dots

**Manny says:** *"Real HITL cases are messy. No one tells you which principle applies. That's the exercise."*

Below are eight case study descriptions. On the right are eight HITL principles. Draw a line connecting each case to the principle it best illustrates. Some principles may feel like they fit more than one case — pick the best match and write a note if you disagree.

**Case Studies:**

**A.** A medical imaging system flags suspicious tissue in 3% of scans. Radiologists review all flagged scans and about 40% of the time they disagree with the flag — but they don't document why. They clear the case and move on.

**B.** A content moderation system is highly accurate in English but performs significantly worse on posts written in regional dialects. Annotators who speak those dialects are not consulted during system evaluation.

**C.** A loan approval model is retrained monthly using decisions previously approved by human reviewers — including those reviewers' errors and biases.

**D.** An annotation team is given a new task with a 30-second time limit per item. After one week, average review time has dropped to 18 seconds. Accuracy metrics are unchanged. Edge-case flags have declined by 60%.

**E.** A hiring-assist tool escalates "uncertain" candidates to human review, but the escalation rate has been declining steadily for eight months as the model becomes more confident — even as the candidate pool composition has shifted significantly.

**F.** A translation system adds a confidence score to each output, but annotators have noticed the scores cluster between 0.78 and 0.94 regardless of how clearly wrong the translation is.

**G.** A fraud detection system routes all high-stakes alerts to a single senior analyst. On days when that analyst is under time pressure, override rates drop to near zero — and later review shows those were often the cases most warranted for override.

**H.** An AI writing assistant has been in production for two years. The team considers removing the human review step because the AI's approval rate is 97%. A junior team member asks: "What exactly are we measuring that's at 97%?"

**Principles:**

**1. Feedback loop contamination** — human decisions re-enter training data and reinforce existing patterns, including errors.

**2. Confidence miscalibration** — a system's stated certainty does not reflect its actual reliability across cases.

**3. Escalation threshold drift** — the bar for referring cases to humans shifts over time in ways that may not reflect actual uncertainty.

**4. Time pressure and cognitive load** — review quality degrades when humans are constrained by speed requirements.

**5. Documentation gap** — human disagreements that go unrecorded cannot improve the system.

**6. Coverage bias** — the system's evaluation is not representative of all the populations it will encounter in deployment.

**7. Single-point-of-failure oversight** — critical review is concentrated in a person or process that creates bottlenecks under stress.

**8. Metric substitution** — the thing being measured is not the same as the thing that matters.

---

**Answer Key (Part 2):**

```
A → 5   (Documentation gap)
B → 6   (Coverage bias)
C → 1   (Feedback loop contamination)
D → 4   (Time pressure and cognitive load)
E → 3   (Escalation threshold drift)
F → 2   (Confidence miscalibration)
G → 7   (Single-point-of-failure oversight)
H → 8   (Metric substitution)
```

---

## Part 3: Crossroads

**Sage says:** *"There is no right answer here. Every path has costs. The exercise is to see them clearly before you choose."*

Each scenario presents a design fork — two different ways a HITL system could be built. Both directions are defensible. Neither is obviously correct. For each one, describe the trade-offs: what does each path gain, and what does it give up?

---

**Crossroads 1: How much do you show the human?**

A fraud detection system has two design options:

**Path A:** Show the human reviewer the full model reasoning — all features, weights, and contributing factors. The reviewer can see everything the AI considered.

**Path B:** Show the human reviewer only the case summary and the AI's recommendation. No reasoning visible. The review takes 40% less time.

*What does Path A gain? What does it give up? What does Path B gain? What does it give up? Which would you choose, and what would you need to know to be sure?*

---

**Crossroads 2: Who reviews the hard cases?**

An annotation team has reviewed 50,000 items. Analysis shows that 8% of reviewers produce 60% of the useful disagreement flags — flags that later correspond to real model failures.

**Path A:** Route difficult cases preferentially to the high-disagreement reviewers. Their expertise is concentrated where it matters most.

**Path B:** Continue random assignment. Routing cases to specific reviewers may introduce new biases and creates unequal workloads.

*What does Path A gain? What does it give up? What does Path B gain? What does it give up?*

---

**Crossroads 3: When should the system escalate?**

A medical triage AI has been given a confidence threshold: cases below 80% confidence are escalated to a human physician.

**Path A:** Lower the threshold to 70%. More cases go to humans. More physician time is required. The AI handles fewer ambiguous cases independently.

**Path B:** Raise the threshold to 90%. Fewer cases are escalated. Physician time is protected. The AI handles more ambiguous cases independently.

*What assumptions does each path make about where errors are most costly? What would you want to measure to know which threshold is right?*

---

**Crossroads 4: Do you tell the human the AI's answer first?**

Research suggests that when humans see the AI's recommendation before reviewing a case, they agree with it at a much higher rate — even when the AI is wrong.

**Path A:** Show the AI's recommendation upfront. Reviewers are faster and report feeling more confident.

**Path B:** Hide the AI's recommendation until after the human has formed an initial judgment. Slower. Reviewers report more uncertainty.

*What is gained and lost in each path? Does the right answer depend on what the review is actually for?*

---

**Crossroads 5: What do you do when annotators disagree?**

For a given batch, annotators are disagreeing at an unusually high rate — about 35% of items have no clear majority label.

**Path A:** Treat high disagreement as noise. Discard the contested items, retrain on the clear ones, and tighten task guidelines to reduce ambiguity.

**Path B:** Treat high disagreement as signal. Study the contested items to understand what makes them hard. Use the disagreement to surface ambiguities in the task definition rather than resolving them artificially.

*Which path produces a cleaner dataset? Which path produces a more honest one? Are those the same thing?*

---

## Part 4: Research Questions

**Gen says:** *"These questions don't have answers in the back of the book. They barely have answers in the research literature. That's what makes them worth asking."*

Read each question. Sit with it. If you're working in a group, pick one and talk for ten minutes. If you're working alone, write two sentences about what you think and two sentences about what you're still unsure of.

---

**Question 1:**
If a HITL system improves until it never needs to escalate a case to a human — did it succeed, or did it fail?

---

**Question 2:**
When an annotator flags a case as "unclear," is that data about the case, data about the annotator, or data about the task definition? Can you always tell which one it is?

---

**Question 3:**
A system shows 98% agreement between its AI outputs and human reviewers. Is that a sign the system is working well, or a sign the humans have stopped reviewing independently? How would you know?

---

**Question 4:**
If the people labeling data for a system are not representative of the people the system will affect — whose values does the system actually reflect? And can that be corrected after the fact?

---

**Question 5:**
Imagine a HITL system where the AI learns from human corrections, and eventually the AI's outputs start shaping what the humans think is correct. Is there still a meaningful sense in which the human is "in the loop"?

---

**Question 6:**
Is there a difference between a human who reviews 400 items per day carefully and a human who reviews 800 items per day hastily — from the system's point of view? From a governance point of view? From an ethical point of view?

---

**Question 7:**
When we say a human "approves" an AI decision, what level of understanding does that word require? Is clicking a button approval? Is reading a summary approval? Where is the threshold, and who sets it?

---

**Question 8:**
Some researchers argue the goal of HITL is to make itself unnecessary — to build systems that eventually don't need human oversight. Others argue HITL is permanent and structural, not a training phase. Which view do you find more compelling, and what hangs on the answer?

---

## Closing Note from Ray

*Ray is the reasoning agent in the companion comic series. Ray doesn't always have answers. Ray has better questions.*

---

I've been thinking about why these puzzles exist.

Not the word search — that one is vocabulary. But the Crossroads, and the Research Questions. Why give you problems with no right answer?

Here's my best guess: because the field is full of people who are very comfortable with the problems that have answers. The problems that don't have answers yet — or whose answers depend on values rather than data — those tend to get avoided, or deferred, or handed off to someone else's department.

The humans in the loop are often the first ones to notice when something is wrong. Not because they have access to the full system — they usually don't. But because they're doing the work, and the work has a texture the metrics don't capture. The hesitations. The frustrations. The cases that look fine but seem off. The feeling that a task is asking you to make a judgment you aren't equipped to make.

Those signals are data. The question is whether anyone is designed to receive them.

I don't know if the systems you work with are designed to receive them. I hope they are. If they're not, that's worth saying out loud.

You're not just in the loop. You're in a position to describe what the loop feels like from the inside. That description is harder to automate than any task I've encountered.

Keep noticing things.

— Ray

---

## Word Search Answer Key

All 15 words run left-to-right within their rows:

| Word | Row | Columns |
|---|---|---|
| UNCERTAINTY | 1 | 1–11 |
| CALIBRATION | 2 | 4–14 |
| FEEDBACK | 3 | 1–8 |
| THRESHOLD | 4 | 6–14 |
| ANNOTATION | 5 | 1–10 |
| ESCALATION | 6 | 5–14 |
| CONFIDENCE | 7 | 1–10 |
| ALIGNMENT | 8 | 5–13 |
| OVERSIGHT | 9 | 1–9 |
| AUTONOMY | 10 | 5–12 |
| LATENCY | 11 | 1–7 |
| ORACLE | 12 | 4–9 |
| BIAS | 13 | 1–4 |
| DRIFT | 14 | 3–7 |
| LABEL | 15 | 5–9 |

---

*Part of the "Human in the Loop: Misunderstood" companion series. Summer Edition.*
