# Chapter 6: Interfaces That Make Humans Smarter

*How the design of a screen can make a doctor brilliant — or helpless*

---

## The Judge and the Number

On a Tuesday morning in Broward County, Florida, a judge opened a pre-sentencing report and found something unusual near the top: a score. The number was produced by COMPAS — Correctional Offender Management Profiling for Alternative Sanctions — an algorithmic risk assessment tool used in dozens of American jurisdictions. The score was supposed to tell the judge how likely the defendant was to reoffend. High risk or low risk. A number to guide the sentence.

The judge had questions. What data had produced it? Which factors drove the score up or down? Was it the defendant's age? Their prior record? Their neighborhood? The tool's vendor, Northpointe (now Equivant), considered those inputs proprietary. The score arrived without explanation, like a verdict without a trial.

The judge did what many judges do: they used the number. Research by ProPublica, published in 2016, would later show that the COMPAS tool was wrong about recidivism almost as often as it was right — about as accurate as asking a random person on the street — and dramatically more likely to falsely flag Black defendants as high risk compared to white defendants with similar profiles. The algorithm had a race problem that the score, presented as a clean integer, completely obscured.

But here is the part of the story that gets less attention: the judge was not irrational. They were responding, predictably and almost inevitably, to the way the information was presented. A number with no explanation exerts a strange psychological gravity. It feels more objective than a probation officer's narrative. It feels more certain than it is. The interface between the algorithm and the human had not made the judge smarter. It had quietly replaced their judgment.

This is the subject of this chapter: not whether AI systems should assist human decision-makers, but how. The interface — the screen, the dashboard, the number, the recommendation — is not a neutral transmission channel. It shapes what humans notice, what they ignore, and ultimately what they decide. A badly designed interface does not just fail to help. It actively makes its human partner worse.

## The Invisible Architecture of Attention

When radiologist Dr. Sarah Chen sits down at her workstation at six in the morning, she faces a queue of about 80 chest X-rays. Some are routine. Some are not. The AI triage system flags the ones it considers urgent and surfaces them first.

In 2018, a Stanford team led by Andrew Ng demonstrated that a deep learning system called CheXNet could detect pneumonia from chest X-rays at a level that matched or exceeded radiologist performance. The headlines celebrated the model's accuracy. The researchers noted something more interesting in the fine print: the way the AI's findings were presented to radiologists dramatically changed what the radiologists actually detected.

When radiologists were shown AI outputs as a probability score alone — "94% pneumonia" — their accuracy on pneumonia improved, but their detection of other findings dropped. Their attention had been guided, almost literally by the number, toward the AI's specialty and away from everything else in the image. The interface had narrowed their field of view.

When radiologists were shown AI outputs as a highlighted region on the image — a colored overlay showing exactly where the algorithm was looking — something different happened. The radiologists interrogated the highlighted region more carefully, sometimes catching errors in the AI's reasoning. But they also paid more attention to the surrounding unhighlighted areas, because the highlighted region made the contrast vivid. The interface had extended their field of view.

Same model. Same data. Dramatically different human performance. The variable was the design of how the AI communicated with the radiologist.

This is what interface designers in medical AI call the "presentation effect," and it is one of the most consistent findings in the field. How information is shown determines what information is used. The architecture of attention — what gets a bright box, what gets a sidebar, what appears first, what requires a click to access — is not a cosmetic choice. It is a decision about what humans will think.

## Automation Bias and the Seduction of the Algorithm

In the spring of 2019, researchers at Vanderbilt University published a study with an uncomfortable finding. They had given radiologists the same set of mammography images under three conditions: no AI assistance, AI assistance with a correct recommendation, and AI assistance with a deliberately incorrect recommendation. The question was how often radiologists would agree with the AI, and whether they would catch the AI's mistakes.

When the AI was correct, it helped — radiologists agreed with it at high rates and their accuracy improved. When the AI was wrong, however, a distressing number of radiologists followed it anyway. Radiologists in the AI-assisted condition missed cancers that they had correctly identified without the AI, apparently because the AI's negative finding overrode their own judgment.

This is automation bias: the tendency to over-rely on automated recommendations, particularly when the human is uncertain or fatigued. It is not a character flaw. It is a documented cognitive response to the presence of a system that presents itself as authoritative. The more confident-looking the recommendation, the more powerful the bias. A probability score of "8% malignancy" shown in green text feels like permission to move on. A radiologist running behind on a Monday morning takes that permission.

Automation bias was first systematically documented in aviation, where it was called "automation complacency." Pilots in highly automated cockpits were found to be less vigilant, less likely to notice anomalies, more likely to accept erroneous automated suggestions. The same pattern appears in air traffic control, nuclear power plant monitoring, and now, everywhere AI recommendations are shown to human reviewers.

The unsettling implication is that AI assistance can make expert humans worse. Not in every case, and not in every domain, but under the right conditions — a fatigued reviewer, a plausible-looking error, a confident-seeming display — the AI's recommendation can function as a kind of anchor that pulls human judgment toward it even when judgment should pull away.

The antidote is not to hide the AI recommendation. It is to design the interface so that the human forms their own judgment before seeing the AI's, or is required to articulate a reason when they deviate from their own initial assessment. The Israeli Air Force, studying automation bias in combat systems, found that requiring operators to commit to a decision before seeing the automated recommendation reduced bias significantly. The sequence of information presentation turned out to matter more than the content.

## The Death by a Thousand Clicks

Maria works for a content moderation company contracted by one of the largest social media platforms in the world. Every day she reviews about 400 posts flagged by the platform's AI as potentially violating community guidelines. The posts cover the full spectrum: spam, harassment, hate speech, graphic violence, misinformation. Each one requires a decision: remove, keep, escalate, or mark for specialized review.

Her interface has seventeen categories for violation type, each with sub-categories. Some violations require her to check a box confirming she has read the platform's policy on that specific type of content. Some require a secondary review if she is unsure. The escalation path involves three separate menus. To flag something as "coordinated inauthentic behavior" — bot networks, influence campaigns — she must navigate to a different tool entirely, enter a case ID, and then return to her original queue.

Maria's average review time is 47 seconds per post. She is considered efficient by her team's standards.

The problem is not that 47 seconds is too little time to make a good decision about every piece of content. The problem is that a large fraction of those 47 seconds is consumed by interface mechanics — clicking, navigating, confirming, entering IDs — rather than by actual judgment. Researchers who study content moderation, including the team led by Sarah Roberts at UCLA, have documented what they call the "cognitive depletion" effect: as the day goes on and the number of posts reviewed climbs past 200, past 300, the quality of moderation decisions declines measurably. Reviewers make more errors on the same types of content late in the day that they handled correctly in the morning.

But the depletion is not just fatigue in the ordinary sense. It is the specific cognitive cost of operating a complex interface under time pressure. Every unnecessary click is a small withdrawal from a limited attention budget. The interface design is not neutral — it is either spending that budget wisely, on genuine judgment, or wasting it on mechanics.

The "death by a thousand clicks" problem is documented in almost every annotation domain. Medical coders lose time navigating outdated billing interfaces. Data labelers in machine learning projects spend as much time managing software quirks as making actual labeling decisions. Legal document reviewers in e-discovery battles toggle between windows in ways that break concentration and invite error.

The fix is rarely glamorous. It is usually a combination of keyboard shortcuts, sensible defaults, streamlined workflows, and a ruthless audit of which clicks actually serve the quality of the human decision and which merely serve the recordkeeping needs of the system. But it requires someone in the design process to ask, seriously and specifically: what cognitive work do we actually want the human to do here? And then to ask, for every interface element: does this support that work, or impede it?

## What Explainable AI Actually Looks Like

The COMPAS story, and dozens like it, prompted a wave of interest in what researchers call Explainable AI, or XAI. The basic idea is simple: AI systems should be able to explain why they produced a particular output. A judge should be able to see not just a risk score but the factors that drove it. A loan officer should see not just an approval recommendation but the features that were weighted most heavily. A doctor should see not just a diagnosis probability but the regions of the scan that drove the model's confidence.

The reality of XAI in practice is messier.

The most common approach is something called LIME — Local Interpretable Model-Agnostic Explanations, developed by Marco Ribeiro and colleagues at the University of Washington. LIME works by generating a simpler model around a specific prediction that approximates the complex model's behavior in that local region. The explanation it produces shows which features were most important for this particular prediction, not in general.

The problem is that LIME explanations can be unstable. Run the same prediction through LIME twice with slightly different random seeds, and you may get a different ranking of important features. Researchers at the University of California San Diego demonstrated that LIME's explanations for identical model predictions can vary enough that a human reviewer shown two different LIME outputs for the same case might make two different decisions.

A competing approach, SHAP (SHapley Additive exPlanations), provides more mathematically grounded explanations based on game-theoretic principles for attributing model outputs to input features. SHAP is more consistent but more computationally expensive. Neither LIME nor SHAP tells you whether the model is actually reasoning correctly — they show you which features the model is using, not whether those features are the right ones to use. A model that discriminates by race, encoded in nominally neutral features like zip code and employment history, will produce SHAP explanations that look reasonable while hiding the discriminatory logic.

For radiology AI, the most common XAI approach is the attention map or gradient-weighted class activation mapping (Grad-CAM) — a visualization that shows which pixels in an image most influenced the model's prediction. These are genuinely useful: radiologists looking at a Grad-CAM overlay can check whether the model's attention is on a plausible anatomical region or on an artifact, a scanner label, or an incidental feature. Studies by Zech and colleagues at NYU showed that early pneumonia models were sometimes attending to whether a hospital's name was embedded in the scan — those scans were more often from ICUs where pneumonia patients happened to concentrate. The model had learned a spurious correlation, and Grad-CAM made it visible.

But Grad-CAM highlights can also mislead. If the model's attention is concentrated on the right region for the wrong reason — attending to the texture pattern around a nodule because of incidental scan parameters rather than the pathology itself — the overlay looks trustworthy when it should not be. And if the overlay is too complex, showing many different regions at multiple confidence levels, it floods the radiologist's working memory rather than directing it.

The uncomfortable truth about XAI is that an explanation is only useful if the human receiving it can actually act on it. A heatmap that a radiologist cannot interpret provides no safety benefit. A SHAP plot that a loan officer cannot read does not protect the borrower. Explanation design is interface design, and all the same rules apply: what cognitive work do we actually want the human to do? Does this explanation support that work?

## Interfaces That Support Judgment vs. Interfaces That Replace It

Here is a useful way to think about the design space.

Imagine a spectrum. At one end is an interface that shows the human only the AI's final recommendation — "Approve," "Deny," "High Risk," "Low Risk." The human has information about the conclusion but not the reasoning. Their job, if they bother with it, is to accept or reject the conclusion as a whole. This is the COMPAS interface for judges who treat the score as a verdict.

At the other end is an interface that shows the human all the raw information the AI has access to, along with all the uncertainty estimates, all the feature contributions, a full audit trail of the model's processing. This is maximal transparency, and it is also practically useless. No human can process all that information in the time available for a real decision. The interface that shows everything is an interface designed for an imaginary reviewer who has infinite time and complete statistical literacy.

Between these extremes is a design space that has been surprisingly little explored until recently. The best interfaces in this space share a few properties.

They separate the AI's job from the human's job. The AI handles pattern recognition and data synthesis; the human handles judgment about edge cases, context, and stakes. The interface makes this division visible: here is what the AI found, here is where the AI is confident, here is where the AI is not. The human's attention is directed toward the uncertain and the unusual, not toward reviewing what the AI got obviously right.

They present uncertainty as information, not as failure. A confidence level of 62% is not the AI apologizing — it is the AI directing the human's attention to a case that genuinely requires human judgment. The interface should communicate this distinction. An orange flag on uncertain cases and a green tag on confident ones is a simple example. It tells the human not "the AI isn't sure," but "the AI is inviting your expertise here."

They preserve the human's capacity for independent judgment. Some interface designs are so anchored around the AI recommendation that the human reviewer finds themselves responding to the AI rather than to the underlying case. The original mammography image, the original loan application, the original document — the human should encounter the primary source before or alongside the AI summary, not instead of it. Studies in legal document review found that human reviewers who saw a document summary without the original document were more likely to follow the summary even when it was wrong, compared to reviewers who saw both. Access to the primary source is not just administrative — it is a cognitive lifeline.

They make disagreement easy. If a reviewer wants to flag that they disagree with the AI's recommendation — if a radiologist believes the AI-flagged region is an artifact rather than a pathology — the interface should make that disagreement easy to record and route to appropriate review. Many current HITL interfaces make agreement a single click and disagreement a three-menu navigation. This asymmetry is not neutral. It is a thumb on the scale.

## The Radiology Interface Wars

Few fields have experimented more intensively with AI-assisted human decision-making interfaces than radiology, and few offer a richer record of which design choices work and which do not.

The story of Zebra Medical Vision illustrates both the promise and the hazard. Zebra, an Israeli medical imaging AI company, deployed a liver disease detection tool at a large European hospital system in 2019. The tool produced recommendations with high accuracy rates in trials. In the first six months of deployment, however, radiologist-reported satisfaction with the system was low, and the hospital's medical informatics team noticed something unexpected: radiologists were systematically reviewing the AI-flagged cases more slowly than non-flagged cases.

Post-deployment interviews revealed why. The AI's confidence visualization — a horizontal bar from 0% to 100% — was being interpreted by radiologists as a suggestion that they should spend time proportional to the AI's confidence. High confidence cases, shown with a nearly full bar, were getting long review times as radiologists tried to understand why the AI was so sure. Low confidence cases were getting short times because, paradoxically, the low-confidence marker was making radiologists feel the case was probably benign.

The design team had built the confidence display to help. It was doing the opposite. The bar was inviting radiologists to interrogate the AI's certainty rather than make their own judgment. A redesign replaced the bar with a simple flag: "AI found a region of interest" or "AI found no region of interest," with the specific region highlighted only when relevant. Review times normalized. Radiologist satisfaction improved. Accuracy was unchanged.

Contrast this with the results reported by Massachusetts General Hospital in 2022, where a radiology AI interface for stroke detection was specifically designed around the concept of "parallel reading" — the human radiologist reads the scan independently, records their initial findings, and then sees the AI's analysis alongside. The AI's analysis includes a highlighted region, a confidence level, and — crucially — a plain-language summary of the key feature driving the AI's concern ("hyperdense vessel segment in right middle cerebral artery territory"). Radiologists in the parallel reading condition showed meaningfully higher sensitivity for stroke detection than radiologists in the AI-first condition, and reported higher confidence in their own judgment.

The parallel reading interface had preserved one thing that the AI-first interface had not: the radiologist's ownership of the diagnosis. The human's judgment was primary. The AI was a second opinion. That ordering — which sounds merely philosophical — turned out to have measurable clinical consequences.

## Annotation Tool Design: The Hidden Bottleneck

The interface problem does not only affect the end users of AI systems. It affects the people who create them.

Every supervised learning system requires labeled training data. Someone — usually many someones — must look at an image, a sentence, a customer interaction, or an audio clip, and attach a label to it. This work is annotation, and the quality of annotated data is the foundation on which model quality is built. Garbage in, garbage out, as the old engineering axiom goes. But the more precise version is: badly labeling in, systematically biased model out.

Annotation tool design determines the quality of labels in ways that practitioners often underappreciate. Consider a simple task: labeling whether a short piece of text contains hate speech. An annotation tool that presents labels as a dropdown menu — with "Hate Speech" at the top of a long list — will produce different label distributions than a tool that presents them as a grid where all options are equally visible. Annotators are cognitively lazy in the specific sense that all humans are: they minimize the effort of decision-making. If one option requires more clicks to select, it will be underrepresented in the labels.

The instructions panel matters enormously. Annotation studies consistently show that annotators who can see the instructions while labeling produce more consistent labels than annotators who must navigate to a separate window to check. The tool design should respect the fact that human attention is not divisible — requiring annotators to context-switch between the annotation view and the instructions view introduces uncertainty and fatigue that directly affects label quality.

Keyboard shortcuts reduce annotation time by 30-50% in most studies, but more importantly, they reduce the cognitive cost per annotation, which means the annotator's judgment quality stays higher later in the session. The annotator who has been clicking through menus for four hours is not the same as the annotator who has been using keyboard shortcuts for four hours.

These are not abstract concerns. When Appen, one of the world's largest data annotation companies, redesigned its annotation interface in 2020 to reduce the number of clicks required per task and streamline the instruction display, the inter-annotator agreement on a sample benchmark task increased from 0.74 to 0.83 on Cohen's kappa — a meaningful and significant improvement. The annotators were the same people, looking at the same content, applying the same guidelines. The interface had made them better at their job.

## The Five Dimensions Through the Interface Lens

The five-dimension framework introduced in Chapter 1 maps cleanly onto interface design choices.

**Uncertainty Detection** must be made visible. An AI's internal uncertainty estimate is worthless if the interface does not communicate it to the human reviewer. The design choice is not just whether to show uncertainty but how — as a number, a color, a flag, a verbal description. The COMPAS system showed a score without uncertainty bounds. The Zebra radiology system showed a bar that was misinterpreted. The MGH stroke system showed a highlighted region with a plain-language description. The last was most effective at directing human attention appropriately.

**Intervention Design** is the interface's core problem. What is the human being asked to do? Review and confirm? Override or accept? Add information the AI lacks? The best interventions are designed with a specific cognitive task in mind: the human is being asked to do something they are genuinely better at than the AI. Confirmation when the AI is almost certainly right wastes cognitive resources. Review when the AI is genuinely uncertain applies them where they create value.

**Timing** in interface terms is about sequencing. Does the human see the AI recommendation before forming their own view, after, or simultaneously? The parallel reading approach in radiology optimizes timing deliberately: human-first, then AI. The COMPAS score was delivered at the moment of sentencing, simultaneously with other information, in a format that made it feel like a fact rather than a recommendation.

**Stakes Calibration** should shape the visual weight of recommendations. A high-stakes flagged case should look different from a routine flagged case. Many annotation interfaces treat all flags equally, presenting a false confidence to human reviewers that every flag deserves the same attention. A well-designed interface uses visual hierarchy to reflect the system's actual confidence and the actual stakes of a decision.

**Feedback Integration** requires the interface to make the human's feedback visible and learnable. If a radiologist consistently disagrees with the AI about a particular type of finding, that pattern should be detectable and usable — to improve the model, to route those cases to this radiologist who is better at them, or to trigger a review of whether the AI's training data covered this finding type adequately. An interface that logs disagreements but never surfaces the pattern has the record but not the learning.

## Why Design Is a Safety Issue

In 2020, a study published in JAMA Network Open examined what happened to diagnostic accuracy in five emergency departments that deployed an AI chest X-ray triage system. Three departments showed improved accuracy at catching critical findings. Two departments showed no improvement, and one showed a statistically significant decrease in diagnostic accuracy for non-flagged cases.

The critical variable was not the AI model — all five departments used the same model. It was the interface design. The three departments with improved outcomes had implemented the AI as a parallel second read, with its findings displayed after the radiologist's initial assessment. The two departments with unchanged or worsened outcomes had implemented the AI as a first read, with its recommendations displayed before the radiologist began their review.

The AI did not make those radiologists worse. The interface did.

This distinction matters more than it might seem. AI developers can spend enormous energy optimizing a model's accuracy metrics while deploying it through an interface that systematically degrades the human-AI team's performance. A model that achieves 94% accuracy in isolation might produce a human-AI team that achieves 88% accuracy — lower than either the model alone or the radiologist alone — if the interface creates strong automation bias and suppresses independent judgment.

This is why interface design is not a cosmetic afterthought to HITL system development. It is a safety issue with the same practical significance as model accuracy. A HITL system whose interface makes humans worse is not a HITL system that is working well. It is a HITL system that has quietly removed the loop from human-in-the-loop.

## Chapter Summary

**Key Concepts:**
- Interfaces are not neutral transmission channels — they shape what humans notice, how they reason, and what they decide
- Automation bias is the documented tendency to over-rely on automated recommendations; it is not a character flaw but a predictable cognitive response to how information is presented
- Explainable AI (XAI) tools like LIME, SHAP, and Grad-CAM have real value but also real failure modes when their outputs are misinterpreted or poorly presented
- The best interfaces separate the AI's job from the human's job, present uncertainty as information, preserve independent judgment, and make disagreement easy
- Interface design is a safety issue with the same practical significance as model accuracy

**Key Examples:**
- **COMPAS risk scoring** — a score without explanation replaced judge's judgment and embedded racial bias in a format that looked like objectivity
- **CheXNet radiology AI** — same model, dramatically different radiologist performance depending on how AI findings were displayed
- **Vanderbilt mammography study** — AI assistance caused radiologists to miss cancers they had caught unassisted
- **Zebra Medical liver AI** — confidence bar display caused radiologists to mis-allocate review time; redesign to a simple flag improved satisfaction without sacrificing accuracy
- **MGH stroke parallel reading** — human-first interface preserved diagnostic ownership and improved sensitivity
- **Appen annotation redesign** — interface changes alone improved inter-annotator agreement from 0.74 to 0.83 kappa

**Key Principles:**
- Sequence matters: seeing the AI recommendation before forming your own view creates different (often worse) decisions than seeing it after
- Visual weight should reflect actual stakes, not just the presence of a flag
- Every annotation click that does not serve judgment is a withdrawal from cognitive resources
- Explanation is only useful if the human can act on it; XAI design is interface design

---

> **Try This:** The next time you use a system that gives you a recommendation — a navigation app, a streaming service's "you might like," a shopping site's "people also bought" — notice the order. Did you form your own preference before you saw the recommendation, or did the recommendation arrive first? Pay attention to whether having seen the recommendation makes it harder to decide differently, even if you genuinely want to. That slight resistance, that small extra effort to go against the suggestion, is automation bias in action. It is real, it is measurable, and it is built into the interface whether the designers intended it or not.

---

*In the next chapter, we turn to the other side of the interface: not what the AI shows the human, but what the human provides to the AI. Labels are the foundation of supervised learning — but they are not neutral, and extracting good ones requires its own design discipline.*

---

## References

### Algorithmic Risk Assessment and Criminal Justice
- Angwin, J., Larson, J., Mattu, S., & Kirchner, L. (2016). Machine bias. *ProPublica*. May 23, 2016.
- Dressel, J., & Farid, H. (2018). The accuracy, fairness, and limits of predicting recidivism. *Science Advances*, 4(1), eaao5580.
- Northpointe Institute for Public Management. (2015). COMPAS Risk & Need Assessment System: Selected Questions Posed by Inquiring Parties.

### Automation Bias
- Parasuraman, R., & Manzey, D. H. (2010). Complacency and bias in human use of automation: An attentional integration. *Human Factors*, 52(3), 381–410.
- Goddard, K., Roudsari, A., & Wyatt, J. C. (2012). Automation bias: A systematic review of frequency, effect mediators, and mitigators. *Journal of the American Medical Informatics Association*, 19(1), 121–127.
- Cummings, M. L. (2004). Automation bias in intelligent time critical decision support systems. *AIAA 3rd Intelligent Systems Conference*.

### Radiology AI Interface Studies
- Rajpurkar, P., et al. (2017). CheXNet: Radiologist-level pneumonia detection on chest X-rays with deep learning. *arXiv:1711.05225*.
- Patel, B. N., et al. (2019). Human-machine partnership with artificial intelligence for chest radiograph diagnosis. *npj Digital Medicine*, 2(1), 111.
- Zech, J. R., et al. (2018). Variable generalization performance of a deep learning model to detect pneumonia in chest radiographs. *PLOS Medicine*, 15(11), e1002686.
- Kiani, A., et al. (2020). Impact of a deep learning assistant on the histopathologic classification of liver cancer. *npj Digital Medicine*, 3(1), 23.

### Explainable AI
- Ribeiro, M. T., Singh, S., & Guestrin, C. (2016). "Why should I trust you?": Explaining the predictions of any classifier. *KDD 2016*.
- Lundberg, S. M., & Lee, S. I. (2017). A unified approach to interpreting model predictions. *NIPS 2017*.
- Selvaraju, R. R., et al. (2017). Grad-CAM: Visual explanations from deep networks via gradient-based localization. *ICCV 2017*.
- Rudin, C. (2019). Stop explaining black box machine learning models for high stakes decisions and use interpretable models instead. *Nature Machine Intelligence*, 1, 206–215.

### Content Moderation and Annotation Work
- Roberts, S. T. (2019). *Behind the Screen: Content Moderation in the Shadows of Social Media*. Yale University Press.
- Gorwa, R., Binns, R., & Katzenbach, C. (2020). Algorithmic content moderation. *Big Data & Society*, 7(1).

### HITL Interface Design
- Green, B., & Chen, Y. (2019). Disparate interactions: An algorithm-in-the-loop analysis of fairness in risk assessments. *FAccT 2019*.
- Lai, V., & Tan, C. (2019). On human predictions with explanations and predictions of machine learning models. *FAccT 2019*.
- Wang, X., et al. (2021). Are explanations helpful? A comparative study of the effects of explanations in AI-assisted decision-making. *IUI 2021*.
