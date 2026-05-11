# What Is HITL ML?

```{epigraph}
The more capable an automated system becomes, the more consequential its failures are — and therefore the more necessary robust human oversight becomes.

-- Human in the Loop: Misunderstood
```

Human-in-the-loop machine learning (HITL ML) is the practice of designing AI systems that deliberately, structurally, and continuously include human judgment in their operation — not as a fallback when the machine fails, but as a designed feature of how the system works.

The central claim of this book is that human involvement in AI-assisted decisions is not a temporary limitation of current technology. It is grounded in what decisions *are* and who is responsible for them. A system that routes uncertain cases to a human reviewer is not an incomplete system waiting to be fully automated. It is a better-designed system than one that handles everything autonomously — because it knows the difference between what it can do reliably and what requires a person.

This workbook chapter introduces that claim and gives you a way to test it against your own experience.

---

## Think about it

**1.** You use Google Maps and it reroutes you mid-trip because of traffic ahead. Someone had to teach it what "traffic" looks like and when it's worth rerouting. Who was that person? When did they do it? Do you think they knew their work would end up in your car?

**2.** A self-checkout machine at the supermarket flags your item and calls an attendant. Is that human-in-the-loop? What's the machine uncertain about? What is the human actually adding?

**3.** Think of something an AI system got wrong recently — a recommendation, a translation, an autocomplete, a search result. What kind of feedback would have corrected it? Who would have had to give that feedback, and when?

**4.** The chapter describes the "automation paradox": the more capable automation becomes, the more human oversight it demands. Does that feel right to you, based on things you've seen? Can you think of a counterexample?

**5.** HITL ML is defined as *deliberate, structured, and ongoing*. Which of those three feels hardest to achieve in practice? Why?

---

## Spot the human

> A hospital uses an AI system to flag chest X-rays that may show early signs of lung nodules. Radiologists review every flag before any action is taken. The system was trained on 50,000 annotated scans. Since deployment, radiologists have been asked to note whether the system's flag was correct or not — those notes are stored but not yet used to retrain the system.

**Questions to circle in your mind (or on the page):**

- Where is the human in the loop right now?
- Where *was* the human in the loop before deployment?
- Is the feedback currently being collected actually in the loop? What would need to change for it to be?
- What happens if a radiologist disagrees with the AI but approves the flag anyway because it's faster?

---

## Word search

Click and drag across letters to select a word. Diagonal, horizontal, and vertical — all directions are fair game. Words can also run backwards.

```{code-block} text
:class: wordsearch

WORDS: ANNOTATION,ALIGNMENT,ORACLE,FEEDBACK,DELIBERATE,SUPERVISED,LABELING,AUTOPILOT,UNCERTAIN,HUMAN

A L I G N M E N T D E A U H F
Z V N E T C M M T O Q N I U R
A V X T D V R Y L I Y N U M K
D U J A N F O A A X X O I A O
Q N Y R F Q S D B U J T U N R
Q C T E G E U L E K Y A F R A
Y E Q B A T P K L C P T A T C
D R L I Z J E H I A B I H O L
S T C L C X R P N B C O Y L E
R A Y E E E V V G D P N R I F
I I Q D T N I G R E Y X W P G
W N J M V U S L O E Q O D O H
H C K A S R E H S F H A C T W
U B H C B K D C Q H I V P U G
R E X S S P H Z P Z N G D A D
```

---

## One more thing

The opening of this book makes a strong claim: human involvement in ML is not *temporary scaffolding* to be removed once models get good enough. It is a *feature*.

That's a strong claim. Most of the engineering world assumes the opposite — that the goal is full automation, and humans are in the loop only until the machine is ready to go it alone.

Write one sentence (here, or in your head) on which side you're on, and why.

<span class="answer-box">&nbsp;</span>
<span class="answer-box">&nbsp;</span>

<!-- html-link-injected -->
```{only} latex
*Read the interactive version of this chapter online:* [https://laztoum.com/reader/](https://laztoum.com/reader/) (word search, games, audio)
```
