# Chapter 18 Solutions Guide: Your Role in This Future

*Model answers to discussion questions*

---

## Discussion Question Solutions

### Q0: Course Synthesis

This question does not have a single correct answer. Strong responses identify a specific argument (not a general theme) and explain why it changed their thinking.

**Common strong answers:**
- **Calibration as a HITL property:** Students arrive thinking calibration is a technical model characteristic and leave understanding it as the foundation of the trust relationship between human and AI system.
- **The fairness impossibility:** Structural, not the result of insufficient technology or bad intentions.
- **Annotation encodes choices:** Students who thought of training data as neutral facts.
- **Compliance theater:** Students recognize most human oversight they've observed has been theatrical.

---

### Q1: AI-limitation vs. permanent role argument

**AI-limitation argument:** "Humans are irreplaceable because AI can't yet do X." This is contingent and empirical — each new capability narrows the human role. No durable basis.

**Permanent role argument:** "The human role is permanent because accountability, value judgment, and lived experience require a human agent — not because of technical limitations, but because of what these functions mean in social and moral life." This is structural.

The distinction matters for how we respond to AI capability advances. Under the limitation argument, each new capability is a threat. Under the permanent role argument, capability advances change the character of the human role — the cases requiring human judgment become harder and more consequential — but don't threaten its existence.

---

### Q2: Limits of AI accountability frameworks

The Air Canada framework (corporations accountable for AI they deploy) is workable but has limits:

**Attribution difficulty:** As AI involves multiple parties (deployer, vendor, data provider), attributing harm to a specific actor becomes harder.

**Diffuse harm:** Many AI harms are diffuse — a credit scoring bias affects thousands by a small amount. Traditional accountability frameworks handle discrete, causally attributable harms poorly.

**Speed:** AI systems are deployed, updated, and retired faster than legal accountability can track.

For AI to be accountable without a human intermediary would require: legal personhood equivalent (with assets and liability), ability to give explanations courts can evaluate, and mechanisms for sanction. None is straightforward. The chapter's claim that accountability requires a human agent reflects this structural difficulty.

---

### Q3: Model knowledge vs. community member knowledge

**A model has:** Statistical regularities in recorded behavior, correlations between observables and outcomes, whatever was selected for observation by whoever designed data collection.

**A community member has:** Situated knowledge of the gap between how community members present to external observers vs. how they actually live; historical context not encoded in any dataset; awareness of what is NOT represented; accountability to the community (they face social consequences of their judgment).

Could a model acquire lived experience? Current architectures cannot experience anything — they process patterns in training data. Even an embodied AI would face the question of whether interaction is sufficient for experience in the morally relevant sense. This is an open question in philosophy of mind and AI alignment.

---

### Q4: Conditions for responsibility internalization

**Design and organizational conditions that foster genuine internalization:**
- **Feedback on outcomes:** Reviewers who learn what happened to cases they reviewed develop a genuine sense of consequence
- **Meaningful authority to override:** Reviewers with real authority (and who aren't penalized for using it) experience their judgment as consequential
- **Appropriate pacing:** Tasks that don't require decisions faster than genuine judgment can operate
- **Accountability for systematic errors:** Organizations that track reviewer quality (not just throughput) create incentives for genuine engagement
- **Case diversity:** Systems routing genuinely varied cases preserve the reviewer's sense of decision-making

The implication: genuine presence requires the system to give the reviewer something real to do, real authority to act, and real feedback about whether they acted well.

---

### Q5: Hybrid skill requirements

**Most hybrid (cannot succeed with either alone):**
- AI auditors/fairness analysts: must understand statistical methods AND domain-specific fairness norms
- AI red teamers: must understand how AI systems fail AND domain-specific ways that failure matters
- AI policy specialists: must understand technical constraints AND policy process

**Domain expertise sufficient:** Annotation specialists for simple, well-defined tasks where labeling is mainly domain judgment.

**Technical expertise alone insufficient:** All roles with real-world impact — domain knowledge is required to recognize when model outputs are wrong in ways that matter.

---

### Q6: Domain-specific AI literacy

**Doctor:** What the model is actually measuring (pattern-matching to training data, not diagnosis); distribution shift across hospitals; confident-but-wrong output patterns; what wasn't represented in training data.

**Lawyer:** AI legal research tools extrapolate and can hallucinate citations; jurisdictional differences the model may not have represented; how to verify AI-generated case summaries against primary sources; recency limitations (training cutoffs).

**Journalist:** AI-generated factual claims require primary source verification; training data bias in information coverage; confidently stated errors; what AI-generated content signals about state of public information.

**Social worker:** Risk assessment tools encode historical patterns that may reflect past discriminatory interventions; risk scores are population-level predictions applied to individual cases; when a client's situation is genuinely outside the model's training distribution.

---

### Q7: Is adversarial thinking teachable?

Both the disposition (willingness to look for failure modes) and the skill (knowledge of where AI systems typically fail) are teachable.

**A course would include:** Real AI failure case studies with analysis of how failures could have been anticipated; practical red teaming exercises (given a system and docs, find three failure modes); understanding of common failure mode categories (distribution shift, proxy variables, feedback loops, confident errors, minority subgroup underperformance); domain-specific failure taxonomies.

**Students' existing domain knowledge:** Any domain in which students have expertise is a foundation. A student who knows legal citation formats can immediately identify when a legal AI has hallucinated a case.

---

### Q8: Micro-interaction consent

**Is this a problem?** Depends on consent theory. Consent-by-participation (implied by using the service) is common in platform business models. Informed consent (knowing your specific interaction will be used, for what, with what effect) is rarely present.

**What meaningful consent requires:** Understanding that interactions are aggregated as training signal; what the system learns from the specific interaction type; how to opt out without losing service access.

**Achievable at scale?** Probably not at the granularity of individual clicks. More realistic: periodic, meaningful disclosure about how aggregated interaction data is used, combined with genuine opt-out mechanisms.

---

### Q9: Technical vs. non-technical knowledge for AI governance

| Question | Technical knowledge needed | Non-technical equally important |
|----------|---------------------------|--------------------------------|
| Recidivism algorithms in sentencing | Base rates, calibration, fairness impossibility | Constitutional law (due process), criminology evidence, philosophy of punishment |
| Facial recognition in public spaces | False positive rates by demographic, accuracy conditions | Fourth Amendment doctrine, surveillance history, power dynamics |
| Who bears cost of AI errors | Error rate measurement, subgroup analysis | Insurance/liability theory, distributive justice, political economy of leverage |

---

### Q10: Barriers to civic participation

**Practical:** Time; regulatory portals are hard to navigate; low awareness that comment periods exist.

**Structural (more important):**
- Process design favors long-form written documents (advantages professional advocacy organizations)
- Individual comments are counted and summarized, not individually responded to — rewards organized campaigns
- Framing AI governance as "technical" issues requiring specialized expertise discourages non-expert participation even for normative questions

Structural barriers would persist even if awareness increased. Regulatory reform enabling shorter, more accessible comments and genuine responsiveness to individual perspectives would change the picture.

---

### Q11: Designing for genuine presence

**Design choices that promote genuine presence:**
- Frame review as judgment, not approval: "Review this recommendation and decide" vs. "Confirm this decision"
- Provide context that makes stakes real: reviewer should know something about what happens to the person affected
- Don't pre-commit reviewer before they've engaged (don't show AI recommendation before initial impression)
- Pacing that allows genuine engagement (not so many cases per hour that thoughtful review is impossible)
- Feedback mechanisms: reviewers who learn when they were right vs. wrong develop real investment

**Limits:** Some interactions are genuinely low-stakes. The goal is not to make every interaction maximally demanding — it's to design high-stakes interactions so that presence is possible and supported.

---

### Q12: Netflix to closing invitation — full synthesis

Netflix's "Are you still watching?" encodes the book's central argument in miniature: a system powerful enough to just keep playing, that chose instead to pause and ask. Not because it lacked confidence. Because it knew the limits of its confidence. And because it respected the human enough to check in.

The closing invitation — "your job is to be present" — is the human-facing corollary. The system that pauses to ask is useless without a human who actually answers.

**Across the five dimensions:**
- *Uncertainty Detection:* Netflix detects it doesn't know whether watching is still intentional. AI systems that know what they don't know are better collaborators.
- *Intervention Design:* Netflix asks in a way that's easy to answer and gives genuine control. Good design makes genuine presence easy.
- *Timing:* Netflix asks when the uncertainty is genuinely unresolved. Optimal timing creates conditions for genuine engagement.
- *Stakes Calibration:* "Are you still watching?" scales to stakes — less intrusive than a security challenge, less dismissible than a cookie banner.
- *Feedback Integration:* The answer informs Netflix how long you watch before needing prompting again. Feedback integration lets systems improve their asking over time.

**The book's arc:** The machines that ask well, and the humans who answer genuinely, make a better loop than either alone.
