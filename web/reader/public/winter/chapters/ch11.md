# Chapter 11: Teaching Computers to See

*What machines see when they look at the world — and why a stop sign with stickers can fool them completely*

---

## The Stop Sign That Wasn't

In 2017, a team of researchers from the University of Washington, UC Berkeley, and other institutions published a paper with an unsettling finding. Using nothing more exotic than a color printer and some stickers, they could reliably make a stop sign invisible to autonomous vehicle vision systems — while remaining completely recognizable to every human who looked at it.

The attack was elegant. The researchers printed small black-and-white sticker patterns — some designed to look like graffiti, some like ordinary wear-and-tear — and affixed them to real stop signs. To any passing driver or pedestrian, the signs still read "STOP" in large white letters on the familiar red octagon. To the machine vision system they tested, the signs were classified as something else entirely: "Speed Limit 45" was the most common misclassification.

Not occasionally. Reliably. In multiple weather conditions. From multiple viewing angles. At vehicle speeds.

The researchers called it a "physical adversarial attack" — a deliberate manipulation of the physical world designed to fool machine perception while remaining invisible to human perception. The finding sent a chill through the autonomous vehicle community, and it immediately raised a question that sits at the heart of this chapter: if machines see differently from humans in ways this dramatic and this exploitable, what does "teaching a computer to see" actually mean?

The answer is stranger and more profound than it might initially seem. And understanding it reveals why human oversight of machine vision — in medicine, in transportation, in security — isn't a temporary accommodation on the road to full automation. It's a structural requirement, rooted in the fundamental nature of what machine vision is.

## Pixels as Numbers, Patterns as Everything

Before we can understand what went wrong with the stop sign, we need to understand what "seeing" means when you're built from mathematics.

To a digital camera, an image is nothing more than a rectangular grid of numbers. Each position in the grid is a pixel. Each pixel is a triplet of numbers between 0 and 255 representing the intensity of red, green, and blue light at that location. A 640×480 image is a matrix of 640×480×3 = 921,600 numbers. Nothing more. No shapes. No objects. No meaning. Just numbers arranged in a grid.

Early computer vision tried to extract meaning from these numbers using hand-crafted rules: look for sharp transitions in pixel values (edges), then look for edges that form closed curves (contours), then match those contours against stored templates of known objects. This worked tolerably well for simple, controlled scenarios — reading license plates in consistent lighting, detecting faces in passport photos — and catastrophically badly for anything more complex.

The revolution came in 2012, when a PhD student at the University of Toronto named Alex Krizhevsky and his supervisor Geoffrey Hinton submitted an entry to the ImageNet Large Scale Visual Recognition Challenge — an annual competition to build the world's best image classifier. Their entry, which they called AlexNet, used a **convolutional neural network** trained on two GPUs for about a week. It crushed the competition, achieving an error rate almost 11 percentage points lower than the next best system.

The method had been theorized for decades, but AlexNet was the first time it worked at scale, on a challenging real-world task. The deep learning era in computer vision had begun.

## What a Convolutional Neural Network Actually Does

The intuition behind convolutional neural networks is one of the most beautiful ideas in modern AI, and it's accessible without any mathematics.

Imagine you're looking for a face in a photograph. How would you systematically scan the image? You might first look for local patterns — places where there's a gradual smooth region (like a cheek), an abrupt curved boundary (like a hairline), or a specific arrangement of dark and light (like eyes against a forehead). Then you'd look for combinations of these patterns at the right scales and spatial relationships. Eyes above a nose above a mouth, arranged in roughly the right proportions, surrounded by roughly the right skin-tones.

A convolutional neural network does something structurally similar, learned from data rather than programmed by hand.

The lowest layer learns to detect the simplest patterns: edges — places where pixel values change sharply in a particular direction. Horizontal edges. Vertical edges. Diagonal edges. Nothing more complex.

The next layer combines the edge detections into slightly more complex patterns: corners where two edges meet, curves, short line segments.

The layer after that combines corners and curves into textures, simple shapes, partial outlines.

And so on, up through the network. Each layer takes the "feature maps" produced by the layer below and combines them into more abstract representations. By the time you reach the highest layers, the network is detecting things like "wheel-like circular shapes" or "skin-tone blobs flanking a dark vertical stripe" — components of concepts that approach the human-level categories we'd use to describe what we see.

The crucial insight is that the network learns all of this from examples. You show it a million images labeled "cat" and a million labeled "not cat," and it adjusts its internal weights until it can reliably tell the difference. The features it learns are not ones a human would have specified. They're whatever works, extracted from the statistics of the training images.

And this is precisely the source of both the power and the vulnerability.

## What the Model Actually Sees — and What It Doesn't

The features a convolutional neural network learns are not the features humans use to understand images.

We know this because of adversarial examples.

Ian Goodfellow and colleagues at Google published a landmark 2014 paper demonstrating that you could take any image a neural network classifies correctly, add a carefully calculated pattern of noise — often invisible to the human eye — and cause the network to classify the image as anything you want, with near-absolute confidence.

The canonical example: take a photograph of a panda. The network correctly identifies it as a panda with 57.7% confidence. Add a very specific pattern of pixel perturbations — perturbations so small they don't visibly change the image — and the network now classifies the image as a gibbon with 99.3% confidence. The image looks identical to a human. The network sees something completely different.

This isn't a trick enabled by cheating or system access. The adversarial pattern exploits something fundamental about how convolutional networks process images: they're extremely sensitive to specific high-frequency patterns in the input that humans don't perceive and don't use for recognition.

Think about what this means. The network and the human are looking at the same pixel array. The human perceives: "panda." The network perceives: "gibbon, definitely." They are literally processing the same numbers and arriving at completely different interpretations.

The stop sign with stickers is a physical version of the same phenomenon. The sticker pattern creates specific local pixel-level features that the network's lower layers interpret in ways that cascade up through the architecture into a confident wrong classification, while human perception processes the sign at the level of semantic content — reading the word STOP, recognizing the shape, understanding the context — in ways that are robust to such local perturbations.

This is not a bug that will be fixed in the next version of the software. It is an inherent feature of how these systems work, rooted in the fact that they learned from pixel statistics rather than from the conceptual structure of the visual world.

## Three HITL Domains in Computer Vision

This fundamental strangeness in machine vision creates different challenges in different high-stakes applications. Let's examine three in detail.

### Medical Imaging: The Augmented Radiologist

Medicine was among the first high-stakes domains where AI vision found genuine traction — and where the human-in-the-loop question has been most carefully and formally studied.

Modern radiology AI systems can detect early-stage lung cancer in chest CTs, identify diabetic retinopathy in fundus photographs, flag abnormalities in mammograms, and measure tumor volumes in MRI scans, all with accuracy competitive with experienced radiologists on the specific tasks they've been trained for.

The key phrase is "specific tasks they've been trained for." A radiologist looking at a chest CT is not only looking for the specific pathology her AI assistant was trained to detect. She is looking at the whole image, bringing decades of clinical intuition, noticing unexpected findings, integrating the scan with the patient's history, symptoms, and prior imaging. She is doing something far broader and more contextual than image classification.

This asymmetry has shaped how medical AI is deployed. The dominant paradigm is not replacement but **augmentation**: the AI examines the image, generates findings, assigns confidence scores, and the radiologist reviews both the raw image and the AI's assessment.

Research on this workflow has produced a genuinely interesting finding: radiologists who see the AI's confidence score systematically change their behavior in ways that are not always improvements.

When the AI confidently flags an abnormality, radiologists spend less time examining the region and are more likely to agree with the AI's characterization — a phenomenon called **automation bias**. When the AI misses an abnormality, radiologists who saw the AI's "all clear" are less likely to catch it than radiologists who worked without AI assistance at all. The AI's confident silence acts as a cognitive anchor.

This is the Uncertainty Detection dimension operating in reverse: expressed AI confidence suppresses human vigilance precisely in the cases where human vigilance is most needed.

The design response has been nuanced. Some systems present AI findings after radiologists have done their initial read, so that human perception is not anchored by the AI's prior. Others present AI findings only in specific forms — flagging regions but not classifying them, prompting the radiologist to look without telling them what to conclude. The Intervention Design dimension turns out to be as consequential as the accuracy of the underlying algorithm.

The FDA has developed a specific regulatory pathway for AI/ML-based medical devices. As of 2024, over 900 AI-enabled medical devices have received FDA authorization — the large majority in radiology. The framework distinguishes between "locked" algorithms (fixed after training) and "adaptive" algorithms (that continue to learn after deployment), with different requirements for each. This regulatory architecture is itself a form of institutionalized HITL: before any medical vision AI can be used on actual patients, it must demonstrate performance to a human oversight body with the authority to require changes.

### Autonomous Vehicles: Human in the Loop at 60 MPH

The physics of driving establish a constraint that makes the HITL design problem in autonomous vehicles uniquely brutal.

At 60 miles per hour, a car travels 88 feet per second. Typical human reaction time to an unexpected event is approximately 1.5 seconds. In the 1.5 seconds between when an autonomous system recognizes it cannot handle the current situation and when a human driver could realistically respond, the vehicle has already traveled 132 feet — nearly half a football field.

This makes the naive version of "human in the loop" — AI drives until uncertain, then asks human to take over — deeply inadequate as a safety model. By the time the human has processed the alert, looked up from their phone, assessed the situation, and responded, the situation has evolved far beyond the moment when the AI first recognized its uncertainty.

The autonomous vehicle industry has responded to this constraint by developing radically different approaches to where the human fits in the loop.

**Tesla's Full Self-Driving (Supervised)** operates in what Tesla calls a "Level 2" framework: the human driver is always in the loop, hands on (or near) the wheel, responsible for the vehicle's behavior. The AI handles driving but the human is the backup and the supervisor, required to be ready to take over at any moment. In the Five Dimensions framework, Tesla has essentially exited the "Timing" problem by requiring continuous human engagement. The downside: drivers habituate to the AI's competence and stop paying genuine attention, exactly the automation bias problem observed in radiology.

**Waymo's approach** is the opposite extreme. Waymo's commercial vehicles in Phoenix, San Francisco, and other markets operate without a human driver — not human backup in the vehicle, full stop. The HITL happens at a different level: remotely, where human operators can observe vehicles that encounter uncertain situations and intervene in ways that don't require physical presence. The escalation path goes to a remote assistance center, not to a person in the passenger seat. This solves the reaction-time problem (remote operators aren't "taking over" in real time, they're providing guidance that the vehicle's AI then executes) but requires sufficient confidence to drive without a physical fallback.

**Cruise's approach** — before its service was suspended following a 2023 incident in San Francisco — was a kind of middle path: vehicles with safety drivers in some conditions, without in others, with remote human monitoring in all conditions.

What this divergence reveals is that "human in the loop for autonomous vehicles" is not a single design pattern. It's a design space, with fundamentally different architectures making fundamentally different tradeoffs between human reaction time, automation bias, regulatory acceptability, and operational cost.

The escalation problem — the 1.5-second gap between AI uncertainty and human capability — is not solved by any of these architectures. It is managed differently by each. This is the Timing dimension of the Five Dimensions framework at its most urgent and most difficult.

### Content Moderation at Scale: Hashing, Perception, and the Adversary

Image-based content moderation — automatically detecting child sexual abuse material, violent extremism, graphic content — faces a challenge that language moderation does not: the stakes are higher and the adversaries more resourceful.

For certain categories of content — primarily child sexual abuse material (CSAM) — the dominant technical approach is **perceptual hashing**. A perceptual hash is a compact fingerprint of an image, computed in a way that's deliberately similar for visually similar images. The PhotoDNA system, developed by Microsoft and widely deployed by platforms, computes a hash for every uploaded image and compares it against a database of known CSAM hashes maintained by the National Center for Missing and Exploited Children.

The design is elegant: known harmful images can be detected and blocked automatically, without any human having to review the content. Hashing is faster, cheaper, and less psychologically damaging to humans than any alternative.

But perceptual hashing systems have a fundamental vulnerability: they are only as good as the database. They can identify known harmful content — images that have already been identified, hashed, and added to the database. They cannot identify novel content: new images, new material, content that has never been seen before.

And adversaries learn. Once a bad actor understands that image hashing is the detection mechanism, they can modify images in ways that change the hash — slight color shifts, small crops, adding noise patterns — while preserving the harmful content for human viewers. The arms race between hashing systems and adversarial evasion techniques is active and ongoing.

This is where human updating of the hash database becomes critical: every new image of harm that is identified by a human reviewer, removed, and hashed adds to the detection capability. The human is in the loop not just as an adjudicator of edge cases but as the source of new ground truth in an adversarially evolving system.

The second challenge for image moderation is context. A photograph of a human body might be art, medical documentation, evidence of abuse, or exploitation. The same image in different contexts is all four, and no hash-based system can distinguish context from pixels. Human judgment on these contextual distinctions is not a temporary workaround — it's the only mechanism available for the kinds of evaluations that require understanding of intent, context, and meaning.

## What "Seeing" Means When You're Made of Math

We've circled around the philosophical question long enough to address it directly.

Human vision is not just image processing. It's perception — active, contextual, laden with meaning and expectation. When a human sees a stop sign, they don't just recognize a red octagon with text. They understand that the stop sign is embedded in a physical environment, connected to rules they've internalized, embedded in a situation with other actors who are also following those rules. The recognition is inseparable from the understanding of what stopping is for.

When a convolutional neural network classifies an image, it is doing something that superficially resembles this but is fundamentally different. It is detecting statistical patterns that correlate with the presence of things labeled a certain way in training data. It has no model of the environment, no understanding of why things are labeled as they are, no connection between what it "sees" and any broader understanding of the world.

This is why adversarial examples are possible at all. If the network had a model of what a stop sign is — what it's for, how it's designed, what distinguishes it from other signs — it would be robust to sticker-based attacks, just as human vision is robust. The vulnerability exists precisely because the network's classification is based on statistical pattern matching, not conceptual understanding.

Does this mean machines can't genuinely "see"? It depends on what you mean by seeing.

If seeing means detecting and responding to visual input in ways that produce correct behavior across the full range of situations a human would encounter — no, current machine vision systems cannot do this. Their statistical patterns are brittle in ways human perception is not.

If seeing means processing visual information and extracting features useful for a wide range of tasks — then yes, modern vision systems do something that deserves to be called seeing, even if it's vision of a fundamentally different kind.

The practical implication is the same in either interpretation: machine vision and human vision are complementary, with different strengths, different failure modes, and different robustness profiles. The radiologist's eyes catch the unexpected finding the AI wasn't trained to detect. The AI catches the early-stage nodule the radiologist would have dismissed as artifact. The human in the loop is not compensating for a deficiency — they're contributing a genuinely different capability.

## The Five Dimensions in Visual AI

**Uncertainty Detection** in vision AI manifests as calibrated confidence scores on classification outputs. A well-calibrated vision system would express low confidence on images that fall outside its training distribution — unusual angles, unusual lighting conditions, image degradation, adversarial inputs. In practice, most classification networks are overconfident, producing high-confidence predictions on inputs that should be uncertain. Techniques like MC Dropout and deep ensembles can improve calibration (see Technical Appendix), but remain imperfect.

**Intervention Design** in medical imaging involves the specific format in which AI findings are presented to radiologists: regions of interest highlighted in the image, confidence scores, differential diagnoses, comparison with prior imaging. Research has found that the format of AI findings significantly affects the quality of radiologist decisions — not just the accuracy of the AI, but how the AI's uncertainty is communicated and how that communication shapes human attention.

**Timing** in autonomous vehicles is, as discussed, the hard problem — the gap between when the system detects uncertainty and when a human can meaningfully respond. Architectural choices (whether humans are physically present, remotely monitored, or not involved until post-hoc review) represent fundamentally different responses to this timing constraint.

**Stakes Calibration** in image moderation requires distinguishing between categories of content with very different consequences for error. A false positive on hate speech — removing legitimate content — has different consequences than a false negative on CSAM — failing to remove child abuse material. The intervention threshold should be set differently for different content categories, with human review calibrated to the stakes of each error type.

**Feedback Integration** in computer vision is the active learning loop discussed earlier in this book — selecting images for human annotation that are maximally informative about the model's current uncertainties, updating the model, and monitoring distribution shift. When the training distribution changes (new camera hardware, new environments, new types of adversarial attack), the model's performance silently degrades. Human monitoring and feedback integration is how systems detect and respond to this drift.

## What's Next

The final chapters of this book turn from the modalities — language and vision — to the applications: healthcare, education, creative work, legal systems. In each domain, the five dimensions take on specific texture. The timing of intervention in an ICU looks nothing like the timing of intervention in a classroom. The stakes of getting medical diagnosis wrong are not the stakes of getting a homework grade wrong.

But the underlying structure is the same: a system with genuine capabilities and genuine limitations, working alongside humans who have complementary capabilities and complementary limitations, with the quality of their collaboration determined by how well the system is designed to recognize its uncertainties and communicate them — and by how well the human partner is positioned to act on that information.

Machine vision will become more capable. But the stop sign with stickers is not a temporary limitation of 2017-era deep learning. It is a window into what machine vision fundamentally is: a powerful pattern detector that sees differently from us, fails differently from us, and will always need us most precisely at the moments when what it sees diverges most sharply from what is actually there.

---

> **Try This:** Find an image recognition tool online — Google Lens, Apple's Visual Look Up, or any image classifier you can access. Photograph the same object under three different conditions: normal lighting, unusual angle, with some small modification (adding a sticker, changing the background, partial occlusion). How does the classifier's confidence change? What does this tell you about what it's actually detecting?

---

## Chapter 11 Summary

**Key Concepts:**
- Images are grids of numbers; convolutional neural networks learn hierarchical pattern detectors from edge detections to abstract concepts
- The features CNNs learn differ fundamentally from the features humans use — adversarial examples make this concrete
- Machine vision and human vision are complementary, not interchangeable: different failure modes, different strengths
- Three HITL domains in computer vision: medical imaging (augmented radiologists), autonomous vehicles (the escalation timing problem), and content moderation (hashing, adversarial evasion, contextual judgment)
- Automation bias — AI confidence suppressing human vigilance — is as important as AI accuracy in medical AI design

**Key Examples:**
- **AlexNet (2012)** — the deep learning breakthrough that launched modern computer vision
- **Adversarial examples (Goodfellow et al., 2014)** — invisible pixel perturbations that fool neural networks with near-absolute confidence
- **Physical adversarial stop sign attack (2017)** — stickers that fool autonomous vehicle vision while remaining obvious to humans
- **FDA AI device authorization pathway** — institutional HITL for medical vision AI
- **Waymo vs. Tesla vs. Cruise** — three fundamentally different architectures for human oversight in autonomous vehicles
- **PhotoDNA** — perceptual hashing as the core of CSAM detection, and its vulnerability to adversarial evasion

**Key Principles:**
- Machine vision failure modes are structural, not accidental — they arise from what deep learning is
- The HITL design challenge in autonomous vehicles is a physics problem (reaction time), not just a software problem
- In content moderation, the human is in the loop as ground-truth generator, not just edge-case adjudicator
- Automation bias means that how AI findings are presented is as important as the AI's accuracy

---

## References

*(Full references in Ch11\_References.md)*

---

*In the chapters ahead, we apply these insights to specific domains — and discover that knowing when to hand off to a human is the deepest form of machine intelligence.*
