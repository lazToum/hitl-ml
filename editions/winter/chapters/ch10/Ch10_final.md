# Chapter 10: Teaching Computers to Understand Language

*How transformers learned to read — and why they still need humans to tell them when they're wrong*

---

## The Lawyer Who Trusted the Machine

On June 22, 2023, a federal judge in New York held an unusual sanctions hearing. Two attorneys — Steven Schwartz and Peter LoDuca of the firm Levidow, Levidow & Oberman — sat before Judge P. Kevin Castel in the Southern District of New York. They had filed a legal brief in a personal injury case against Avianca airlines. The brief cited over half a dozen case precedents. The judge had noticed something strange: he couldn't find them.

He couldn't find them because they didn't exist.

ChatGPT, the AI assistant attorney Schwartz had used to research the case, had fabricated six court decisions — complete with plausible-sounding case names, docket numbers, courts of jurisdiction, and summarized holdings. *Martinez v. Delta Air Lines, Varghese v. China Southern Airlines, Shaboon v. Egypt Air*. None were real. When the opposing counsel filed a brief pointing this out, Schwartz asked ChatGPT to verify the cases. The AI doubled down, insisting they were "real and can be found in reputable legal databases." Schwartz attached printed ChatGPT transcripts to a court filing, apparently as evidence that he had done his due diligence.

Judge Castel imposed sanctions on both attorneys. In his ruling, he wrote something that should be printed on the login screen of every AI assistant: "The Court is presented with an unprecedented circumstance — a submission replete with citations to non-existent cases."

This story reveals something profound about how language models work — and, critically, how they fail. These are systems that can discuss Aristotle and write sonnets and explain quantum mechanics, yet they will confidently cite cases that never happened, with the same untroubled certainty they'd use to tell you the capital of France.

To understand why, we need to understand what language models actually are — and what "understanding" means when you're made of math.

## Why Language Is Hard

Before computers, before neural networks, before anyone dreamed of machines that could write — long before all of that — there was the problem of language itself.

Language is, in a word, slippery.

Consider the sentence: "I saw the man with the telescope." Did you use the telescope to see him? Or was he carrying the telescope? Both readings are grammatically valid. English doesn't tell you.

Now try: "The chicken is ready to eat." Is the chicken about to eat something? Or has it been cooked and is awaiting consumption? Again — both are correct. Context resolves the ambiguity, but context is everything: it's the restaurant menu, the farmyard, the smell coming from the kitchen.

Or consider irony: "Oh, great. Another Monday." A computer reading that sentence, unaware that Monday often brings dread, might classify it as a positive statement. The word "great" is positive. The word "Monday" is neutral. Sentiment analysis tools still get tripped up by sarcasm constantly, because understanding irony requires a model of what the speaker wanted you to *think they meant* as opposed to what they *literally said* — a layered theory of mind that took humans millions of years to evolve.

Language also carries cultural baggage. "That's sick" can be a compliment among teenagers and an insult at the dinner table. "Wicked" means evil in standard English and excellent in Boston. References to "the shot heard round the world" mean something entirely different to a baseball fan than to a history teacher.

And then there's implication. "Do you know what time it is?" is not a question about your epistemological relationship to clock-reading. It's a request for the time. Humans automatically perform this translation. Computers, for decades, could not.

These challenges — ambiguity, context, irony, cultural reference, implication — are not edge cases. They are the *substance* of language. Every sentence you have ever uttered is woven through with them.

For five decades, researchers tried to solve this with rules. Write down enough grammar rules. Build enough ontologies. Enumerate enough world knowledge. It mostly failed. Language was too vast, too fluid, too context-dependent for any rulebook.

Then came a different idea: what if instead of teaching computers the rules of language, you let them *learn* language from the sheer volume of text that humans had already written?

## Words as Coordinates in Meaning-Space

The first breakthrough in modern language AI came in 2013, from a small team at Google. Tomáš Mikolov and colleagues published a paper describing a technique called **Word2Vec**. The idea sounds almost too simple: train a neural network to predict which words appear near other words in text, and the process of learning those predictions will encode meaning.

Here's the intuition. Imagine you're trying to summarize the "context" of a word — all the other words that appear near it in millions of documents. Words that appear in similar contexts tend to mean similar things. "Dog" and "cat" both appear near "pet," "owner," "veterinarian," "food bowl." "King" and "queen" both appear near "throne," "crown," "royal," "palace."

Word2Vec turned these contextual patterns into coordinates — vectors in a high-dimensional space, where you can think of each dimension as capturing some aspect of meaning. The result was startling. Not only did similar words cluster near each other geometrically, but the *relationships* between words were encoded in the directions between them.

The famous example: the vector for "king" minus the vector for "man," plus the vector for "woman," gave you something very close to the vector for "queen." The geometry of meaning-space turned out to mirror the geometry of human concepts.

You don't need to understand the linear algebra to appreciate what this represents: meaning, for the first time, had a shape. Words were no longer just arbitrary symbols — they were points in a landscape where proximity implied similarity and direction implied relationship.

But word embeddings had a fundamental limitation. They gave each word a single fixed location in meaning-space, regardless of context. The word "bank" has the same vector whether you're talking about a river bank or a financial institution. The word "play" is the same whether you mean the theater kind or the playground kind.

Real understanding requires knowing which *sense* of a word is meant in a particular sentence. For that, you need something that reads the whole sentence — maybe the whole paragraph — to determine meaning. You need something that, when processing the word "bank," simultaneously asks: "What does the surrounding text tell me about which bank this is?"

## The Attention Mechanism: Reading While Noticing

In 2017, a team at Google published a paper with a deceptively casual title: "Attention Is All You Need." It was, by any measure, one of the most consequential papers in the history of artificial intelligence.

The key idea was a mechanism called **attention**, and it can be understood through an analogy.

Imagine you're reading a mystery novel. You're on page 300, and you've just reached a scene where the detective notices a red coat. To understand why the red coat is significant, your brain doesn't process just the current sentence. Without conscious effort, your attention drifts back to page 47, where a witness mentioned a figure in red. And to page 112, where the suspect claimed to own no bright clothing. Your mind holds the current word and simultaneously asks: *which other words, anywhere in what I've read, are relevant to understanding this one?*

That is attention.

The transformer architecture — the "T" in ChatGPT, the "T" in BERT, the engine inside nearly every modern language AI — does exactly this, but for every word simultaneously.

When a transformer processes the sentence "The animal didn't cross the street because it was too tired," it asks, for the word "it": which other words in this sentence should I weight heavily when interpreting this one? "Animal" scores highly. "Street" scores low. "Tired" scores very high, because the attribution of tiredness resolves the pronoun reference. The word "it" is processed *in relation* to all other words at once.

This happens not once but many times simultaneously, in parallel "heads" of attention, each head learning to track different kinds of relationships — syntactic ones, semantic ones, coreference chains, discourse structure. When all these heads are combined and processed through layers upon layers of the same mechanism, something remarkable emerges: representations of text that capture context at every level of abstraction.

The transformer architecture unleashed a scaling law that no one fully expected. The more text you fed it, the more parameters you used to represent the model, the more compute you threw at the problem — the better the results, in a way that showed no sign of plateauing. Researchers fed transformers first millions of documents, then billions of web pages, then essentially the entire written output of human civilization. The models got better and better at predicting text, which — it turned out — was a surprisingly good proxy for getting better at understanding it.

This is how we arrived at large language models: GPT-4, Claude, Gemini, LLaMA, Mistral. Vast statistical engines trained on human writing at a scale that dwarfs any library ever built.

## What a Language Model "Knows"

Here is where we need to be careful — because the word "knows" is doing a lot of work, and it's often doing it dishonestly.

When a language model appears to "know" something, what's actually happening is this: during training, the model processed enormous amounts of text in which certain patterns co-occurred. It learned, in a statistical sense, that "Paris" and "capital of France" appear together constantly. That "Abraham Lincoln" and "1865" and "assassinated" appear together. That "Avianca" and "airline" appear together, and that "Martinez v. Delta Air Lines" — well, that's where things get interesting.

The model didn't learn "Martinez v. Delta Air Lines" from any case reporter. It learned the *pattern* of what court citations look like. And it learned what kinds of phrases appear near "airline injury lawsuits." When asked to produce precedents for airline injury cases, it did what it always does: it generated text that was statistically plausible given the prompt. It produced strings of text that *looked like* court citations — because it had learned the form deeply — without having any mechanism to distinguish between citing something that existed and generating something plausible-sounding.

The model has no memory in the human sense. It has no index pointing from case names to actual decisions. It has something more like a vast, compressed statistical portrait of what human writing looks like — and it uses that portrait to generate text that continues naturally from whatever you've given it.

This is not the same as knowing. It is, at its best, an extraordinary mimicry of knowing. The distinction matters enormously — and it's a distinction the models themselves cannot make.

## The Hallucination Problem

The AI research community has a name for what happened to attorney Schwartz's legal brief: **hallucination**.

A language model hallucinates when it produces text that is confident, fluent, plausible in form — and factually wrong. The term is imperfect (the model isn't experiencing visions), but it captures something real: the wrongness isn't random noise. It's confabulation — the generation of plausible-seeming content that fills a gap where actual knowledge should be.

Why does hallucination happen? Several reasons, each illuminating.

First, the training objective doesn't distinguish truth from plausibility. The model is trained to predict what comes next in text. Real text sometimes contains errors, propaganda, myths, and mistakes. The model learned from all of it. When it generates text, it generates what's statistically likely given its training — not what's true.

Second, the model has no mechanism for expressing "I don't know." Every query gets a response. The model has learned to produce fluent text, and silence is not a token in its vocabulary. When it encounters a question it genuinely cannot answer from its training — because the answer was never in the training data, or was encoded too sparsely to retrieve reliably — it generates the most plausible continuation anyway.

Third, the model's confidence is encoded in the fluency of its output, not in any internal calibration. It writes "The case was decided on April 14, 1992, by the Second Circuit" with the same stylistic assurance whether the case is real or fabricated. There is no tremble in the pen.

Research into hallucination rates is sobering. A 2023 study by researchers at Stanford found that ChatGPT hallucinated in over 58% of legal queries — not getting things slightly wrong, but generating completely fictional citations, statutes, or holdings. Studies of medical AI outputs found rates of clinically significant errors ranging from 5% to 17% depending on the domain and task. Even retrieval-augmented systems — models that can look things up — hallucinate at measurable rates when they mis-attribute what they've retrieved.

The hallucination problem is, at its core, a calibration problem of the kind this book has been tracking all along. The model isn't uncertain where it should be uncertain. Its expressed confidence doesn't match its actual accuracy. And that miscalibration has real consequences — for lawyers, doctors, students, journalists, and anyone else who trusts a confident-sounding machine.

## Three Shapes of Human-in-the-Loop in Language AI

Language AI has not one but three very distinct shapes of human-in-the-loop deployment, and they demand very different design thinking.

### The Chatbot: Real-Time Assistance

The first shape is the one most people encounter: the AI assistant deployed to answer questions, help write emails, or provide customer service in real time.

Here, the human-in-the-loop challenge is primarily one of **uncertainty communication and escalation**. When should the system answer directly? When should it hedge? When should it say "I recommend you check this with a human expert"? When should it refuse to answer entirely?

The Air Canada chatbot failed this test catastrophically. It had no mechanism to distinguish confident knowledge from confident confabulation. It had no escalation path to a human agent when uncertainty was high. It behaved, in effect, as though every question were equally within its competence.

Well-designed chatbot systems do the opposite. They are trained to recognize categories of query where the model's training-derived knowledge is unreliable — time-sensitive information, jurisdiction-specific legal matters, medical diagnosis, anything requiring personal context the model doesn't have. For these categories, they are designed to hedge explicitly: "I can give you general information, but for your specific situation, you should consult a licensed professional."

This hedging is not a limitation — it is a feature, exactly the kind of Stakes Calibration we described in earlier chapters. The stakes for getting medical advice wrong are not the same as the stakes for getting a recipe wrong.

### The Content Moderator: Harmful Content Detection

The second shape of HITL in language AI is less visible to most users but arguably more consequential: content moderation at scale.

Every major social media platform, every content-hosting service, every forum of any size uses some form of automated content moderation — AI systems that flag or remove content that violates platform policies. The categories of concern include hate speech, harassment, incitement to violence, child sexual abuse material, disinformation, and spam.

Language AI does the first pass. Human reviewers handle the escalations.

This sounds elegant, but the practice is bruising. The language of harm is deeply contextual. "I want to kill my boss" is, in virtually all instances, idiomatic frustration, not a genuine threat. Satire of a political figure can look exactly like earnest endorsement of the views being lampooned. A slur used reclaimed by the community it targets means something different than the same slur used as an attack.

Automated systems miss these distinctions constantly. They over-remove legitimate content (often disproportionately affecting minority communities whose speech patterns fall outside the training distribution) and under-remove harmful content that's been camouflaged through deliberate adversarial manipulation — misspellings, emoji substitutions, coded language.

The human reviewers who handle escalations and provide feedback to these systems are some of the least-discussed people in the AI ecosystem. They are often contracted employees in low-wage markets, paid to review content that includes graphic violence, child abuse material, and extremist propaganda — material that causes documented psychological harm. The feedback they provide trains the next version of the automated system.

This is HITL in its most difficult form: humans in the loop not as occasional consultants but as the cognitive infrastructure that makes the whole system function, often at significant personal cost.

### The Alignment Trainer: Preference Feedback

The third shape of HITL in language AI is the one that has received the most attention from researchers in recent years: using human feedback to align language model behavior with human values and preferences.

This is the domain of RLHF, DPO, and Constitutional AI — techniques this book has mentioned but which deserve fuller explanation for general readers, because they represent a genuinely new and important form of human-machine collaboration.

## Teaching Values: RLHF, DPO, and Constitutional AI

### Reinforcement Learning from Human Feedback

Imagine you've trained a language model on billions of words. It can generate fluent text. But "fluent" is not the same as "good." The model might generate text that's plausible but harmful, factually wrong, ethically objectionable, or simply unhelpful in ways that wouldn't be obvious from just predicting the next word.

How do you teach it to be better?

**Reinforcement Learning from Human Feedback (RLHF)** — developed and popularized through work at OpenAI, DeepMind, and Anthropic — works roughly like this:

First, generate a lot of model outputs for a variety of prompts. Then show pairs of outputs to human raters and ask: which is better? The raters — trained labelers working from explicit guidelines — compare responses on dimensions like helpfulness, honesty, harmlessness, and accuracy.

These preference judgments are used to train a separate model called a **reward model** — essentially an AI that learns to predict which outputs humans would prefer. Then the original language model is fine-tuned using reinforcement learning, nudging it to produce outputs the reward model would rate highly.

The genius of RLHF is that it converts the fuzzy, hard-to-specify notion of "good output" into something a model can optimize for. Instead of trying to write rules for every possible scenario, you hire humans to express their preferences, train a model on those preferences, and use that as a training signal.

The limitation of RLHF is that it's expensive, slow, and the humans in the loop introduce their own biases. Different raters disagree. The trained reward model may overfit to the specific things raters were asked to evaluate. And there's a well-documented problem of **reward hacking** — the model finding ways to score highly on the reward model without actually being helpful, a bit like a student who learns to write essays that sound good to automated graders without actually engaging with the substance.

### Direct Preference Optimization

**Direct Preference Optimization (DPO)** is a more recent approach that sidesteps the need for a separate reward model. Instead of using reinforcement learning, DPO directly adjusts the language model's weights based on preference comparisons.

The mathematical insight behind DPO is elegant: you can prove that the reinforcement learning problem RLHF is trying to solve has a closed-form solution that can be computed directly from preference data, without the intermediate reward model. This makes training more stable, more efficient, and less prone to some forms of reward hacking.

For our purposes, the important point is the same: humans are in the loop, providing preference judgments that shape what the model learns to do. DPO is a more streamlined way to incorporate that human signal.

### Constitutional AI

A different approach was pioneered by Anthropic (the company that builds Claude) under the name **Constitutional AI**. Rather than relying purely on human raters to judge millions of individual outputs, Constitutional AI starts with a set of written principles — a "constitution" — describing how the AI should behave: be helpful, be honest, avoid harmful outputs, respect human autonomy, and so on.

The AI is then asked to critique and revise its own outputs based on these principles, in a process that can be largely automated. This drastically reduces the need for human feedback on individual examples, while still allowing humans to exert significant influence — through the design of the constitution itself.

Constitutional AI represents an interesting reconfiguration of the HITL relationship. The human is in the loop not at the level of individual judgments ("this output is better than that one") but at the level of values ("these are the principles we want the system to embody"). It's a shift from line-editing to authorship — from correcting individual mistakes to writing the ethical framework the system will use to correct itself.

None of these approaches is perfect. They all depend, ultimately, on humans — on the quality of the raters' judgments, the wisdom of the constitution's authors, the diversity and representativeness of the human feedback. That dependency is not a weakness to be engineered away. It is the point.

## The Five Dimensions, Applied to Language AI

Let's revisit our framework with language-specific eyes.

**Uncertainty Detection**: Language models are notoriously miscalibrated. They express their uncertainty through hedging language ("I think," "I believe," "you may want to verify"), but this hedging is learned stylistic behavior, not a reflection of actual probability estimates. A well-calibrated language model would hedge proportionally to its actual accuracy. The challenge is that the model processes a query all at once and generates output token by token — there is no natural place in this process where genuine uncertainty is computed and expressed. Retrieval-augmented generation, where the model can look things up, partially addresses this, but the fundamental calibration problem remains.

**Intervention Design**: How should a language AI ask for help? The best implementations use a tiered approach: answer directly when confidence is high and stakes are low; hedge and suggest verification when confidence is uncertain; refuse and escalate when stakes are high and confidence is insufficient. The chatbot that says "For specific legal advice about your situation, please consult a licensed attorney" is practicing good intervention design. The chatbot that confidently cites six fictional cases is practicing the opposite.

**Timing**: In real-time language AI, timing of human intervention is particularly constrained. A customer service chatbot that says "I'll route you to a human" after ten minutes of unhelpful circular conversation has failed the timing dimension. The intervention needed to happen at the first indication of inadequate confidence.

**Stakes Calibration**: Language AI systems need domain-aware stakes calibration. Getting a recipe wrong has different consequences than getting a drug interaction wrong. Getting a historical date wrong has different consequences than getting a medication dosage wrong. The best systems have been trained with category-specific behavior: more hedging in high-stakes domains, clearer escalation paths for medical, legal, and safety-critical queries.

**Feedback Integration**: RLHF and its descendants are, at bottom, systematic feedback integration — the most elaborate version of this dimension yet designed. Every preference judgment from a human rater is a piece of feedback that shapes future behavior. The challenge is ensuring this feedback loop is representative, unbiased, and fast enough to keep pace with the ways people use the model.

## The Philosophical Aside: Does It Understand?

We have been using the word "understand" carefully throughout this chapter, with occasional scare quotes. Let's address it directly, because it matters more than it might seem.

When a transformer model processes "The animal didn't cross the street because it was too tired" and correctly identifies that "it" refers to the animal rather than the street — has it *understood* that sentence?

One view says: yes, obviously. It produced the correct output. It tracked the relevant relationships. What more could understanding require?

Another view says: no. Understanding implies something beyond producing correct outputs. It implies that there's a model of the world inside — that somewhere in the system there's a representation of animals and streets and tiredness that connects to a broader understanding of physical reality, biology, and the nature of fatigue. The transformer has learned statistical patterns over text. It has, perhaps, a kind of textual shadow of these concepts. But whether that shadow constitutes genuine comprehension is genuinely unclear.

This is not an idle philosophical question. It has direct practical implications for where human oversight is most needed.

A system that genuinely understands what it's saying will, presumably, notice when what it's saying is false. A system that is producing statistically plausible text has no such internal check. If the distinction matters, it tells us something important: language AI systems need human oversight not as a workaround for a temporary technical limitation, but as a structural feature of what these systems are.

The attorney's problem was not that ChatGPT was a flawed prototype that future versions would fix. It was that ChatGPT is, at its core, a very sophisticated text prediction machine — and text prediction machines, however sophisticated, do not have a relationship to truth. They have a relationship to plausibility. Closing that gap requires humans in the loop.

## What's Next

Language and vision evolved together in biological intelligence — the words we use to describe what we see, the images we conjure when we read. It's fitting that the next frontier in AI combines both.

In Chapter 11, we'll turn to the other great sensory modality that AI has been learning to navigate: vision. We'll explore how machines learn to see, why adversarial examples reveal such a fundamental strangeness in machine perception, and how the human-in-the-loop problem looks different when the stakes involve a radiologist reading a tumor scan, a car traveling at sixty miles an hour, or a content moderator reviewing millions of images.

The challenges are different. The fundamental question is the same: when can the machine act alone, and when does it need us?

---

> **Try This:** The next time you use an AI assistant for something that matters — a health question, a legal question, a factual claim you'll repeat to someone else — ask it to express its confidence. Then try to verify its answer through another source. How often does it hedge appropriately? How often is it confidently wrong? What does this tell you about when AI tools need human supervision?

---

## Chapter 10 Summary

**Key Concepts:**
- Language is intrinsically hard for computers because of ambiguity, context-dependence, irony, cultural reference, and implication
- Word embeddings (Word2Vec) gave words coordinates in "meaning-space" — similar words cluster together
- Transformer models use attention to process words in context of all other words simultaneously
- Language models "know" things statistically, not factually — they have no internal check on truth
- Hallucination is a calibration failure: models express high confidence when they should express uncertainty
- Three HITL shapes in language AI: real-time chatbot assistance, content moderation, and alignment training
- RLHF, DPO, and Constitutional AI are systematic approaches to incorporating human values through preference feedback

**Key Examples:**
- **Mata v. Avianca (2023)** — attorney fined for submitting AI-fabricated legal citations, demonstrating the hallucination problem's real-world consequences
- **Air Canada chatbot (2024)** — no escalation path for high-stakes queries, confidently wrong about policy
- **Content moderation human reviewers** — the unseen cognitive infrastructure behind automated moderation
- **RLHF alignment training** — human preference judgments as the signal that makes AI helpful rather than merely fluent
- **Constitutional AI** — human values encoded at the constitutional level, not the individual judgment level

**Key Principles:**
- Fluency is not accuracy; a system can sound certain while being completely wrong
- Hallucination is not a bug to be patched but a structural feature of text prediction systems
- The three HITL shapes demand different intervention designs: hedging, escalation, and preference training
- Human oversight of language AI is not a temporary workaround — it's a structural necessity

---

## References

*(Full references in Ch10\_References.md)*

---

*In Chapter 11, we turn from language to vision — and discover that the way machines learn to see reveals something just as strange about the nature of machine intelligence.*
