# A Taxonomy of Human–Machine Interaction

> Being consulted and being overridden are not the same thing — and the gap between them is where most of the interesting questions live.

---

## Think about it

1. Think of an app you use every day that makes suggestions — autocomplete, recommended routes, curated feeds. Does it feel like you're in the loop, or just watching it go?

2. When does "the human reviews the output" become meaningfully different from "the human rubber-stamps the output"? What would have to change for you to tell?

3. You get a push notification asking you to confirm something. You tap OK without reading it. Were you in the loop?

4. Is there a difference between a system that learns from what you click and one that learns from what you say? Does one feel more like feedback to you?

5. If you had to draw a line between "the machine is helping me" and "I'm helping the machine," where would you put it — and does it move depending on the day?

---

## Spot the human

> Gmail's Smart Compose watches as you type and offers to finish your sentences. You can accept the suggestion with a single key press, or ignore it and keep typing. The model was trained on billions of emails. It knows how sentences tend to end. It's very good at this.

**Where is the human in the loop?**

- Is accepting a suggestion feedback? If so, is ignoring one also feedback — or just silence?
- At what point does Smart Compose shift from being "in the loop" to being "on the loop" — advising without really participating?
- The model was trained on human writing, but the humans who wrote those emails never consented to training a completion model. Were they in the loop?
- If you accept 80% of Smart Compose's suggestions, who is writing your email?

---

## Word search

Find the hidden words — they run across, down, or diagonal.

```{code-block} text
:class: wordsearch

WORDS: ANNOTATION,INTERFACE,TAXONOMY,PIPELINE,FEEDBACK,PASSIVE,ORACLE,SCHEMA,LABEL,LOOP

L G V I W V U C T U F A Y R X
H K F E O M I U W R H N M A V
K Y C C Y P B H B Z K N O M M
I C G A S W O K G U P O N E M
U O E F B I E O H X R T O H R
I X S R N D S M L L H A X C E
Q P C E Y P E B D E U T A S F
Z V N T T C I E M M T I T O Q
I R A N V X D P F V R O Y I Y
U K D I J N F O E A X N X I Q
Y F Q O R A C L E L D U J U Q
T E V I S S A P G E I L Y F R
Y Q A T K P A D L Z J N H B H
S L E B A L C C X P C Y E R Y
E E V P R F I Q T N G R Y X W
```

---

## One more thing

The Smart Compose example straddles a distinction worth naming. When you accept or reject a suggestion, you're giving **deliberate feedback** — you made a choice, and the system can observe it. When you write emails that the model trains on without your involvement, you're generating **behavioral traces** — patterns extracted from your activity, not feedback you intended to give.

These feel different, but they're often treated the same in practice. Both end up in training pipelines. Both shape model behavior. The difference is **consent and intent**: deliberate feedback implies you knew you were in the loop; behavioral traces assume your participation without announcing it.

Most real systems blend the two. The question worth asking is: which kind of feedback actually moves the model — and does the person providing it know they're providing it?

<!-- html-link-injected -->
```{only} latex
*Read the interactive version of this chapter online:* [https://laztoum.com/reader/](https://laztoum.com/reader/) (word search, games, audio)
```
