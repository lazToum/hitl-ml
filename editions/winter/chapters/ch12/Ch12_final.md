# Chapter 12: Measuring Success

*What "good HITL" actually looks like when you pull out a ruler*

---

## The 400-Reviews-Per-Hour Problem

In 2019, a mid-sized e-commerce platform deployed a content moderation system to screen product listings for policy violations. The algorithm handled roughly 85 percent of listings automatically. The rest — borderline cases involving possibly counterfeit goods, prohibited items, or ambiguous descriptions — got routed to a team of human reviewers.

Management wanted to know: is this working?

They chose a simple metric to answer that question: reviews completed per hour. Reviewers who processed more cases were rated higher. Reviewers who lagged got performance improvement conversations. Within six weeks, average throughput climbed from about 40 reviews per hour to over 400.

Impressive. And catastrophically wrong.

What had actually happened was that reviewers, under pressure to move faster, had learned to approve most borderline cases with a glance. The algorithm was routing them uncertain cases — exactly the cases that *needed* careful human attention. But "careful attention" doesn't score well when the metric is speed. So reviewers pattern-matched the easy ones, skimmed past the hard ones, and clicked approve.

The model, which was designed to learn from reviewer decisions, dutifully incorporated these rubber-stamp approvals as ground truth. Over several months, its threshold for flagging violations drifted upward. More borderline cases were auto-approved. Fewer were sent to humans. The feedback loop tightened.

By the time anyone noticed — when a journalist published a story about the platform's counterfeit problem — the model was worse than it had been before the HITL system was introduced. The reviewers, optimizing for the metric they were actually measured on, had broken the system entirely.

This is the Goodhart problem in HITL systems: when a measure becomes a target, it ceases to be a good measure. And in human-AI collaboration, the consequences of measuring the wrong thing are particularly severe because the feedback loops are tight, the mistakes are invisible, and the model gets smarter — in exactly the wrong direction.

## Why Accuracy Alone Is Never Enough

The most natural question to ask of any AI system is: how often is it right? For a medical imaging algorithm, how frequently does it correctly identify tumors? For a fraud detection model, what percentage of fraudulent transactions does it catch?

Accuracy is necessary. But it is not sufficient — and in HITL systems, it can be actively misleading.

Consider a fraud detection system applied to a dataset where 1 percent of transactions are fraudulent. A model that labels every single transaction "legitimate" achieves 99 percent accuracy. It also catches zero fraud. An accuracy-first evaluation would call this a good model. Anyone whose credit card gets stolen would disagree.

This is why real measurement requires looking at the full picture: precision (when the model says "flag this," how often is it actually a problem?), recall (of all the real problems, how many did the model catch?), and the F1 score that balances these two. For HITL systems specifically, you need to track these metrics *separately* for the cases the model handles autonomously and the cases it routes to humans.

A system where the auto-processed cases have 98 percent accuracy and the human-reviewed cases have 94 percent accuracy might look fine on aggregate. But it's telling you something important: the cases humans are reviewing — the hard, uncertain ones — are harder for humans too. That's expected. The question is whether the human review is adding value, or whether the system is routing the wrong cases, or whether the reviewers are fatigued and not giving the hard cases the attention they deserve.

## A Complete Measurement Framework

Good HITL measurement covers seven distinct dimensions. Each illuminates something the others miss.

**Model accuracy and calibration.** Accuracy captures raw performance. Calibration captures something subtler: does the model's expressed confidence correspond to its actual reliability? A well-calibrated model that says it's 80 percent confident should be right about 80 percent of the time. A poorly calibrated model that says it's 90 percent confident but is only right 70 percent of the time is sending the wrong cases to humans — it's keeping the cases where it's actually uncertain and routing the ones it happens to be wrong about.

This matters enormously for HITL design because routing decisions depend on confidence scores. If those scores don't mean what you think they mean, the whole intervention design breaks down.

**Human workload.** How many cases per hour is each reviewer handling? How does this change over the course of a shift? Research on human performance consistently shows a fatigue curve: most people can sustain high attention for roughly 20–30 minutes, after which their error rate climbs. A HITL system that routes 500 cases per hour to a reviewer team of five is implicitly assuming each reviewer can handle 100 per hour with consistent quality. That assumption is almost certainly wrong for anything requiring genuine judgment.

The 400-reviews-per-hour story is an extreme case of workload measurement going wrong. But even subtler versions occur in systems where reviewers aren't visibly exhausted — their throughput looks stable, but the quality of their decisions has quietly declined.

**Time-to-decision.** How long does it take from the moment a case is flagged until a decision is made? In fraud detection, this might matter in seconds — a transaction is either approved or blocked. In medical imaging, hours might be acceptable. In content moderation, the answer depends on whether the content is actively being viewed. Time-to-decision is a system-level metric that captures bottlenecks no amount of model accuracy data will reveal.

**Cost per decision.** Human review is expensive. A radiologist reviewing a scan costs far more per case than an automated decision. This isn't an argument against human review — in some domains, the cost is trivially justified. But it needs to be measured explicitly, because cost shapes every design tradeoff. A system that routes 40 percent of cases to human review when 5 percent would achieve similar accuracy at a fraction of the cost is wasting resources that could be spent on better interventions elsewhere.

**Error rates by pathway.** Track error rates separately for auto-processed cases and human-reviewed cases. Then ask: are they moving in the right direction over time? If the model improves, the error rate on auto-processed cases should decline. If reviewer training improves, the error rate on human-reviewed cases should decline. If reviewers are gaming the metric, error rates may look stable while underlying quality deteriorates.

**Reviewer agreement rate.** When the same uncertain case is reviewed by two different reviewers, how often do they agree? Low agreement on borderline cases is not necessarily a system failure — some cases are genuinely ambiguous, and reasonable reviewers will disagree. But tracking agreement rates over time reveals something important: if agreement suddenly drops, it might mean the model is routing cases that were once clearly handled by the algorithm, or that reviewer training has diverged, or that reviewer fatigue is introducing random noise into decisions.

**Feedback loop latency.** How long does it take for a human decision to improve the model? If reviewers make corrections on Monday and the model incorporates those corrections in Tuesday's predictions, the feedback loop latency is roughly one day. If corrections take two weeks to cycle through the training pipeline, there's a substantial lag between what reviewers are seeing in the world and what the model has learned. During that lag, reviewers are manually compensating for model errors that the model doesn't yet know it's making.

Short latency is better, but it comes with its own risks: if reviewers are making systematic errors, short latency means the model learns those errors faster.

## The A/B Testing Mindset

Here's something many HITL practitioners overlook: you can run a controlled experiment on your HITL design.

Want to know whether your current confidence threshold for routing cases to humans is optimal? Randomly assign incoming cases to two groups: one gets the current threshold, one gets a slightly lower threshold (routing more cases to humans). Compare outcomes across every metric in your measurement framework — accuracy, cost, time-to-decision, reviewer agreement. The group whose threshold produces better outcomes at acceptable cost tells you which direction to move.

This is standard experimental methodology applied to what people often treat as a single-shot design decision. Most organizations set their routing thresholds once, at system launch, based on intuition or informal testing, and then never revisit them. Meanwhile, the distribution of incoming cases shifts, reviewer expertise changes, and the model's calibration drifts — all of which can make the original threshold obsolete.

A/B testing in HITL systems requires a few adaptations from standard experimental design. The human reviewers in each arm of the test must not know they're being observed, or they'll change their behavior. Cases need to be assigned to arms in a way that's statistically sound — not, for example, one group getting Monday's cases and another getting Friday's cases, because time-of-week effects on reviewer attention are real and will confound your results. And you need to hold out a representative test set that neither arm touches, to evaluate both against a stable ground truth.

The payoff is large: an experiment-driven organization can continuously improve its HITL design based on evidence rather than intuition.

## The Divergence Trap

There is a particular failure mode in HITL measurement that deserves its own name: optimizing short-term accuracy at the cost of long-term calibration.

Imagine a medical imaging HITL system where the model flags uncertain scans for radiologist review. The radiologists, experienced and well-trained, are good at catching the cases the model misses. Short-term accuracy looks excellent. But the model is learning from the radiologists' decisions — including their decisions on cases the model was uncertain about.

Here's the problem: the model tends to be uncertain about unusual cases. Rare tumor morphologies. Unusual patient presentations. Edge cases it hasn't seen often. The radiologists handle these well. But over time, as the model learns from these corrections, it becomes better at the common cases and more confident about them — and continues to route the unusual ones to humans.

The apparent accuracy improves. The confidence scores on auto-processed cases look better. The calibration metrics look better. But the feedback loop has quietly narrowed the model's effective coverage: it's handling more of the easy cases autonomously and pushing the unusual ones — the cases with the most to teach it — into the human review queue.

Eventually, if the human review queue becomes overwhelmed or the humans themselves lose familiarity with the common cases (because they never review them anymore), the system becomes brittle. A change in the patient population, or a new disease variant, falls outside what the model handles and outside what the reviewers regularly encounter.

The divergence trap is visible only if you track long-term calibration, not just short-term accuracy. It's an argument for periodically injecting known cases — including cases the model is confident about — into the human review queue, just to keep reviewers calibrated and to monitor for drift.

## Goodhart's Law and the Metric You Choose

Charles Goodhart, a British economist, observed in 1975 that "when a measure becomes a target, it ceases to be a good measure." The principle has been rediscovered repeatedly in fields from healthcare to education to software development, because it describes something fundamental about how people respond to measurement.

In HITL systems, Goodhart's law operates on multiple levels simultaneously.

Reviewers optimize for whatever metric they're measured on. If it's throughput, they go fast. If it's agreement with the algorithm, they defer to the algorithm. If it's accuracy on a held-out test set they know about, they learn the test set. The only way to measure reviewer quality accurately is to measure it on cases they don't know are being evaluated — which is both the right approach and operationally awkward.

Organizations optimize for whatever metric they report to leadership. If that metric is "percentage of cases auto-processed," there's organizational pressure to lower the routing threshold and push more cases through without human review. If the metric is "reviewer utilization," there's pressure to keep reviewers busy, which may mean routing more cases than optimal.

And models optimize for whatever they're trained on. If they're trained on reviewer decisions, they incorporate reviewer biases and errors. If reviewer quality is declining due to fatigue or gaming, the model silently absorbs that degradation.

The only real protection against Goodhart's law in HITL systems is to measure multiple things simultaneously and to hold some things sacred — particularly, a periodic human audit of a random sample of all decisions (not just the flagged ones), evaluated by reviewers who don't know the original decisions.

## What Good Measurement Looks Like

The 400-reviews-per-hour story had a preventable outcome. The organization was measuring exactly one thing (throughput) and nothing else. A complete measurement framework would have caught the problem in weeks rather than months.

Here's what that framework looks like in practice.

A dashboard that tracks accuracy, calibration error, throughput, and reviewer agreement at weekly intervals. A separate track that compares error rates on auto-processed versus human-reviewed cases, watching for the two lines to move apart. An automatic alert when reviewer agreement on borderline cases drops below a historical baseline. A quarterly audit where a sample of cases from *all* pathways — including auto-approved — is reviewed by senior reviewers who don't know the original decisions.

And critically: a metric that measures *model improvement over time*. If the model isn't getting better from human feedback, either the feedback loop is broken, or the feedback isn't good enough to learn from, or the cases being reviewed are too hard to yield useful training signal. That last possibility is an argument for routing some easy, clearly-resolved cases into the review queue just to provide the model with strong signal.

Measurement in HITL systems isn't about surveillance. It's about creating the visibility necessary to improve. The Netflix approach, the fraud detection system, the medical AI — all of them work because someone, somewhere, is looking at the numbers that actually matter.

---

> **Try This:** Think of a decision-making system you interact with regularly — a spam filter, a content recommendation engine, a loan approval process. What single metric would you guess the organization tracks to evaluate it? Now think of two other metrics that single measure might be hiding. What would you need to see to know if the system was actually working well?

---

## Chapter Summary

**Key Concepts:**
- Accuracy is necessary but not sufficient — a model that labels everything "legitimate" on a 99/1 class-imbalanced dataset achieves 99% accuracy while being useless
- A complete HITL measurement framework covers seven dimensions: model accuracy, calibration quality, human workload, time-to-decision, cost per decision, error rates by pathway, reviewer agreement, and feedback loop latency
- The Goodhart problem: when a measure becomes a target, it ceases to be a good measure — reviewers optimized for throughput will break the model
- The divergence trap: optimizing short-term accuracy can create long-term brittleness by narrowing the cases the model learns from
- A/B testing applied to HITL design can continuously improve routing thresholds based on evidence rather than intuition

**Key Examples:**
- **400-reviews-per-hour case:** Throughput metric incentivized rubber-stamping, training the model on bad labels
- **Class imbalance and accuracy:** Why a 99% accurate model can be useless
- **Feedback loop latency:** The lag between human correction and model improvement matters for system design
- **Periodic quality audits:** Random samples of auto-processed cases, not just human-reviewed ones, are required to detect drift

**Key Principles:**
- Measure multiple things simultaneously; single metrics invite gaming
- Track metrics separately by pathway (auto-processed vs. human-reviewed)
- Hold periodic audits on cases the system handles autonomously, not just the ones it flags
- Treat measurement itself as an intervention-design problem: what you measure shapes what reviewers and organizations optimize for

---

## References

### Goodhart's Law
- Goodhart, C. (1975). Problems of monetary management: The U.K. experience. *Papers in Monetary Economics*, Reserve Bank of Australia.
- Strathern, M. (1997). 'Improving ratings': Audit in the British University system. *European Journal of Education, 32*(3), 305–321.

### Calibration in Machine Learning
- Guo, C., Pleiss, G., Sun, Y., & Weinberger, K. Q. (2017). On calibration of modern neural networks. *ICML*.
- Niculescu-Mizil, A., & Caruana, R. (2005). Predicting good probabilities with supervised learning. *ICML*.

### Measurement in Human-AI Systems
- Amershi, S., et al. (2019). Software engineering for machine learning: A case study. *ICSE*.
- Jacobs, A. Z., & Wallach, H. (2021). Measurement and fairness. *FAccT*.

### Alert Fatigue and Human Performance
- Ancker, J. S., et al. (2017). Effects of workload, work complexity, and repeated alerts on alert fatigue in a clinical decision support system. *BMC Medical Informatics and Decision Making, 17*, 36.
- Baysari, M. T., et al. (2011). Interface design contributes to alert fatigue. *AMIA Annual Symposium Proceedings*.

### A/B Testing Methodology
- Kohavi, R., Tang, D., & Xu, Y. (2020). *Trustworthy Online Controlled Experiments: A Practical Guide to A/B Testing*. Cambridge University Press.
