# Chapter 13: The Psychology of Human-AI Teams

*Why the human in the loop is not a neutral input device*

---

## The Night the Computers Went Silent

At 2 hours and 10 minutes past midnight on June 1, 2009, Air France Flight 447 disappeared into the South Atlantic Ocean. All 228 people aboard were killed. It remains the deadliest aviation accident in Air France's history.

The plane — an Airbus A330 equipped with some of the most sophisticated autopilot systems in the world — had flown into an area of severe turbulence over the Intertropical Convergence Zone. Ice crystals formed in the pitot tubes, the sensors that measure airspeed. The autopilot, suddenly unable to trust its airspeed data, did exactly what it was designed to do in this situation: it disengaged.

It handed control to the pilots.

The crew had, for the previous several hours, been managing a comfortable, mostly automated flight. The autopilot was handling the aircraft. The pilots were monitoring. Then, in the space of a few seconds, they were thrust into a rapidly deteriorating emergency situation with faulty and conflicting sensor data — a situation that required immediate, accurate action on the aircraft's manual controls.

What the flight data recorders later revealed was devastating: the pilots were confused. They made inputs that worsened the situation. One pilot pulled back on the stick — increasing the plane's angle of attack, which was already too high — even as the aircraft stalled. The confusion lasted four minutes and twenty-some seconds, from the autopilot disengagement to impact with the ocean.

The BEA, the French aviation accident investigation authority, was careful in how it described what happened. The pilots were not blamed as incompetent. What the investigators concluded, more precisely, was this: the crew had not been sufficiently trained in high-altitude manual flight, and they had lost situational awareness during the period of automation. When the system handed control back to them, they were not ready for it.

They had been in the loop, in the sense that they were physically present in the cockpit and nominally responsible. They were not in the loop in any meaningful operational sense — not prepared to exercise judgment under the exact conditions where judgment was most urgently needed.

Air France 447 is not a story about bad pilots or bad technology. It is a story about what happens when the human is in the loop for so long without actually needing to exercise skill that the skill quietly atrophies — and then suddenly, catastrophically, the skill is required.

## The Paradox of Reliable Systems

There is something counterintuitive at the heart of automation design: the better the automation, the more dangerous the gap when it fails.

A poor autopilot that disengages frequently keeps pilots sharp. They are regularly called to exercise manual control, regularly reminded of their role, regularly practicing the skills that will save them when the system truly fails. An excellent autopilot that almost never disengages — that handles 99.97% of situations without human intervention — produces pilots who have far less practice with the 0.03%.

This is called **automation complacency**, and it has been documented in aviation, nuclear power operations, industrial process control, and most recently in the growing literature on AI-assisted medical diagnosis. The pattern is consistent: as system reliability increases, human operators become less vigilant, less practiced, and less prepared for the moments when the system fails — precisely the moments when human judgment is most critical.

The paradox runs deeper than just practice. When a system is highly reliable, there is a rational case for trusting it. If an AI flagging system has a 98% precision rate, a reasonable reviewer should be skeptical when their own judgment conflicts with the AI's recommendation. This is not irrationality or laziness — it's sensible Bayesian updating. A conflict between my opinion and a 98%-accurate system is most likely explained by my being wrong.

The problem is that this rational deference, taken too far, becomes what psychologists call **automation bias**: the tendency to over-rely on automated systems and to fail to notice, or to discount, evidence that the system is making an error.

## Automation Bias: The Research Record

The term "automation bias" was formalized by Linda Skitka and colleagues in a 1999 paper that described something troubling. Pilots shown automated recommendations became statistically less likely to notice when the automation was wrong — even when they had been explicitly told to apply independent judgment, and even when the errors were visible to an unbiased observer.

The finding has been replicated dozens of times since across different domains. Medical residents shown an AI-generated differential diagnosis are less likely to consider diagnoses the AI omitted, even when their own history-taking has revealed clues the AI didn't have. Radiologists reviewing AI-flagged scans spend more time on flagged areas and proportionally less time on unflagged areas — which means they are more likely to miss pathology the AI didn't flag. Judges shown algorithmic recidivism predictions shift their sentences toward the algorithm's recommendation.

What makes automation bias particularly insidious in HITL systems is that it works against the purpose of having a human in the loop at all. The whole point of human review is to catch the cases the model gets wrong. But automation bias systematically reduces the probability that humans catch exactly those cases — the ones where the model is confident but wrong.

The mechanism matters. Automation bias is not primarily about deference to authority, or about cognitive laziness. Research by Raja Parasuraman and Victor Riley, who produced the foundational taxonomy of human-automation interaction in 1997, suggests the core mechanism is **attentional allocation**: the human reviewer allocates less attention to processing a case independently when an automated recommendation is already present, because the recommendation satisfies the brain's drive toward closure. The decision feels made. The remaining cognitive work is just confirmation.

This means that adding "please apply independent judgment" instructions to your reviewer training, without redesigning the interface to support independent judgment, accomplishes very little.

## Overtrust and Undertrust: Both Cost You

Automation bias is a form of **overtrust** — relying on the system more than is warranted. But the psychological literature is equally clear that **undertrust** is a problem, and often an underappreciated one.

Undertrust occurs when humans systematically distrust algorithmic recommendations even when the algorithms are accurate. It can manifest as:

- Clinicians who treat AI screening flags as "suggestions" and override them at high rates even when retrospective analysis shows the flags were correct
- Content moderators who develop a reflexive suspicion of AI-generated labels and relitigate every decision, dramatically slowing throughput without improving accuracy
- Judges who are ideologically opposed to "letting an algorithm decide" and override algorithmic recidivism predictions at higher rates than statistical accuracy would justify

Undertrust has real costs. If a screening algorithm correctly identifies high-risk cases and clinicians consistently override it toward lower-risk assessments, the system's effective recall drops. The whole point of AI augmentation — catching things humans miss — is undermined.

The optimal human-AI collaboration requires what researchers call **calibrated trust**: trust that accurately tracks the system's actual performance. Neither systematic over-reliance nor systematic under-reliance, but the sort of flexible, domain-sensitive deference that adjusts when evidence accumulates.

Calibrated trust is hard to achieve and even harder to maintain. It requires that reviewers have accurate mental models of what the AI is good at and what it isn't. It requires feedback loops that let reviewers learn when they're right to override and when they're wrong. And it requires an organizational culture that neither rewards blind deference nor treats algorithm skepticism as a virtue.

## The Expertise Effect: Better in Some Ways, Worse in Others

One might assume that domain experts make better HITL reviewers than novices. In many respects, this is true. Experts catch errors that novices miss. They have better representations of the case distribution. They recognize unusual presentations. They are harder to fool by superficially plausible but actually wrong outputs.

But expertise also introduces its own vulnerabilities.

First, experts are more susceptible to what psychologists call **expectation confirmation**: they have strong prior beliefs about what they will find, and they tend to process new evidence in light of those priors. An experienced radiologist who "knows" that a certain presentation pattern correlates with benign disease may be less willing to register a finding that contradicts that expectation — even when an AI correctly flags it.

Second, highly experienced reviewers have longer case histories with their own intuitions. They have been right a lot. Their confidence in their own judgment is, on average, better calibrated than a novice's. But when AI recommendations conflict with expert intuition, the expert has more to defend and more history of being right. The resistance to AI suggestion that contradicts expert intuition can be fierce.

Third, experts are often more susceptible to what is called the **consistency trap**: they've seen thousands of similar cases and have strong expectations about what a decision "should" look like. AI systems that produce outputs inconsistent with those expectations — even when the outputs are correct — trigger skepticism that may not be warranted.

This is not an argument against expert reviewers. It is an argument for designing HITL systems that account for expert psychology — that present AI recommendations in ways that invite genuine evaluation rather than triggering confirmation or resistance.

## Fatigue and the Time-of-Day Effect

Human judgment is not constant. It varies with time of day, length of shift, number of prior decisions, emotional state, and a half-dozen other factors that standard HITL evaluation frameworks ignore.

A 2011 study by Shai Danziger and colleagues — later the subject of considerable methodological debate, but directionally replicated in multiple subsequent studies — examined parole board decisions across 1,112 judicial hearings. The probability of a favorable decision dropped from roughly 65% at the start of each session to nearly zero toward the end, before recovering after breaks. The judges were not consciously aware of this pattern.

The finding — whatever the exact mechanism — points to something well-established in human performance research: decision quality declines under sustained cognitive load. Annotation quality, medical diagnosis accuracy, content moderation decisions, and financial review accuracy all follow this pattern. They are higher early in a work session and lower late.

This has direct implications for HITL system design. A HITL system that is measured, calibrated, and staffed without accounting for time-of-day effects is effectively ignoring a significant and predictable source of variance in its human component's performance. Routing the most difficult cases to reviewers at hour four of a shift is not the same as routing them to reviewers at hour one. The two populations — same person, different time — can have measurably different error rates.

Practical implications include: randomizing case routing to prevent systematic clustering of hard cases at shift end; building mandatory break schedules into the review workflow; using intra-batch agreement rates as a near-real-time proxy for reviewer fatigue; and considering two-pass review for the highest-stakes decisions at the end of long shifts.

## Team Dynamics Without a Human Team

Traditional organizational research on team performance — the voluminous literature on team cohesion, psychological safety, shared mental models, and team learning — was developed to understand groups of humans working together. Almost none of it applies cleanly when one team member is an algorithm.

An algorithm does not experience psychological safety. It does not feel threatened by dissent. It does not bond with teammates. It does not have a bad day. It does not grow resentful of overrides. It does not build an informal theory of which human reviewers are worth listening to.

What this means in practice is that the "team dynamics" of a human-AI system are almost entirely determined by how the human(s) relate to the AI — and those dynamics are heavily influenced by system design choices that organizations often don't treat as team management decisions.

How confident does the AI appear? Systems that present recommendations with high-seeming confidence (even when that confidence is well-calibrated) elicit more deference than systems that explicitly communicate uncertainty. The same model, the same accuracy, but the framing changes behavior.

Does the AI explain itself? Explainable AI systems — systems that provide some account of why they made a recommendation — change human review behavior in complex ways. They can reduce automation bias by giving reviewers something to evaluate rather than just a recommendation to accept. But they can also increase automation bias if the explanations are plausible-sounding but wrong, providing a post-hoc narrative that convinces reviewers the AI must be right.

Does the reviewer get feedback on their overrides? If a reviewer overrides the AI's recommendation and never learns whether they were right, they have no mechanism to calibrate their trust. If they do get feedback, they can learn which domains their judgment beats the AI's and which it doesn't. This feedback is among the most powerful interventions for producing calibrated trust.

## What HITL System Design Can Do About Human Psychology

These psychological findings are not arguments for resignation — for accepting that humans will always misuse automation. They are arguments for designing systems that support the kind of human engagement that actually produces the outcome we want.

**Interface design for independent judgment.** Present the AI recommendation in a way that invites evaluation rather than closure. One tested approach: have reviewers complete their own initial assessment before the AI recommendation is revealed. This forces genuine processing that is not contaminated by automation bias. The cost is time; the benefit is substantially better detection of AI errors.

**Explicit uncertainty communication.** A system that displays "85% confidence" is telling reviewers something they can reason about. A system that simply says "RECOMMENDED: APPROVE" is making a presentation choice that encourages closure. The five-dimensional framework from earlier chapters suggests that calibrated uncertainty communication is not just a measurement property — it shapes human psychology.

**Structured disagreement protocols.** For high-stakes decisions, require reviewers to document their reasoning when they override the AI, and require a second review when reviewer and AI disagree. This is not about making review slower; it's about creating a structured context in which the human is genuinely doing the work the HITL design requires.

**Feedback on overrides.** If you want calibrated trust, you must give reviewers information about the accuracy of their overrides. Without feedback, trust cannot calibrate. With feedback, even experienced reviewers become more accurate about which of their overrides are worth making.

**Fatigue management.** Build mandatory break structures and randomized case routing into the system design. Don't let the hardest cases cluster at end of shift. Track intra-batch agreement rates as an operational fatigue signal.

None of these interventions fully eliminates automation bias, undertrust, fatigue effects, or expertise-related vulnerabilities. But each moves the actual human behavior closer to the idealized "neutral input device" that HITL system designs often implicitly assume.

---

> **Try This:** The next time you use an AI-powered suggestion — autocomplete, a navigation recommendation, a grammar suggestion — pay attention to your own psychological response. Do you evaluate the suggestion independently before accepting it, or does the presence of a recommendation change your process? What would you have decided if no recommendation had appeared? This is automation bias in your own cognition, in real time.

---

## Chapter Summary

**Key Concepts:**
- Automation complacency: the more reliable the system, the less prepared the human for the moments it fails
- Automation bias: humans shown an AI recommendation become less likely to catch the AI's errors — even when instructed to apply independent judgment
- Overtrust costs you errors that humans should have caught; undertrust costs you benefits that AI augmentation was designed to provide
- The expertise effect: domain experts catch errors novices miss, but are more resistant to AI recommendations that conflict with their priors
- Fatigue and time-of-day effects on decision quality are predictable and large — HITL designs that ignore them are implicitly ignoring a major variance source
- When one team member is an algorithm, traditional team management doesn't apply; human-AI dynamics are largely shaped by interface and system design choices

**Key Examples:**
- **Air France 447 (2009):** Pilots managed a highly automated aircraft for hours; when automation disengaged due to sensor failure, crews lost situational awareness and crashed
- **Automation bias research (Skitka et al., 1999; Parasuraman & Riley, 1997):** Replicated finding that AI recommendations reduce independent judgment even under explicit instructions to apply it
- **Radiologist AI studies:** Attention allocation shifts toward AI-flagged areas, reducing detection of pathology the AI didn't flag
- **Decision fatigue research:** Judicial decisions, medical diagnoses, content moderation all show measurable quality decline over a session

**Key Principles:**
- The human in the loop is not a neutral input device — psychology shapes performance in predictable, designable ways
- Interface design choices (how confidence is displayed, when the AI recommendation is revealed, whether explanations are provided) dramatically affect automation bias
- Calibrated trust — neither systematic over-reliance nor systematic under-reliance — is the goal; it requires feedback loops and explicit support
- HITL system design must incorporate the literature on human performance under automation, including fatigue effects and the paradox of reliable systems

---

## References

### Air France 447
- Bureau d'Enquêtes et d'Analyses (BEA). (2012). *Final Report: Accident on 1 June 2009 to the Airbus A330-203 registered F-GZCP operated by Air France flight AF 447 Rio de Janeiro–Paris*. BEA.
- Wise, J. (2011). What really happened aboard Air France 447. *Popular Mechanics*, December 6, 2011.

### Automation Bias and Complacency
- Skitka, L. J., Mosier, K. L., & Burdick, M. (1999). Does automation bias decision-making? *International Journal of Human-Computer Studies, 51*(5), 991–1006.
- Parasuraman, R., & Riley, V. (1997). Humans and automation: Use, misuse, disuse, abuse. *Human Factors, 39*(2), 230–253.
- Parasuraman, R., & Manzey, D. H. (2010). Complacency and bias in human use of automation: An attentional integration. *Human Factors, 52*(3), 381–410.

### Automation Bias in Medicine
- Goddard, K., Roudsari, A., & Wyatt, J. C. (2012). Automation bias: A systematic review of frequency, effect mediators, and mitigators. *Journal of the American Medical Informatics Association, 19*(1), 121–127.
- Gaube, S., Suresh, H., Raue, M., Merritt, A., Berkowitz, S. J., Lermer, E., Coughlin, J. F., Hexner, J. C., Stoianovici, D., Fecht, D., Murray, S., Bitterman, D. S., & Ghassemi, M. (2021). Do as AI say: Susceptibility in deployment of clinical decision-aids. *npj Digital Medicine, 4*, 31.

### Human Performance Under Automation
- Endsley, M. R. (1995). Toward a theory of situation awareness in dynamic systems. *Human Factors, 37*(1), 32–64.
- Bainbridge, L. (1983). Ironies of automation. *Automatica, 19*(6), 775–779.
  > The foundational paper on the paradox of reliable automation; still essential reading.

### Decision Fatigue
- Danziger, S., Levav, J., & Avnaim-Pesso, L. (2011). Extraneous factors in judicial decisions. *Proceedings of the National Academy of Sciences, 108*(17), 6889–6892.
- Linder, J. A., Doctor, J. N., Friedberg, M. W., Nieva, H. R., Birks, C., Meeker, D., & Fox, C. R. (2014). Time of day and the decision to prescribe antibiotics. *JAMA Internal Medicine, 174*(12), 2029–2031.

### Expertise and Human-AI Interaction
- Dietvorst, B. J., Logg, J. M., & Logg, J. M. (2015). Algorithm aversion: People erroneously avoid algorithms after seeing them err. *Journal of Experimental Psychology: General, 144*(1), 114–126.
- Logg, J. M., Minson, J. A., & Moore, D. A. (2019). Algorithm appreciation: People prefer algorithmic to human judgment. *Organizational Behavior and Human Decision Processes, 151*, 90–103.
