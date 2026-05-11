# HITL in Natural Language Processing

> The model can tell you what word is there. It can't tell you what it means to the person who wrote it — and neither, sometimes, can the person who's labeling it.

---

## Think about it

1. Think of a word that means different things depending on who says it, to whom, and when. How would you write a labeling guideline for it?

2. When you read a sentence and feel like you understand it, what are you doing? If a model predicts the right label without understanding the sentence, does it matter?

3. Snorkel and weak supervision let you write rules instead of labeling examples. Is a rule the same as an opinion? What do you lose when you automate the labeling?

4. Majority vote is used to aggregate labels across annotators. But what if the minority was right? Is there a context where you'd actively want to preserve the minority label?

5. What's the difference between a word being ambiguous and a word being contested? Does your answer change how you'd handle it in a labeling pipeline?

---

## Spot the human

> A medical NLP system is extracting drug names from clinical notes. The word "lithium" appears in a note. In most contexts, it's a psychiatric medication. In this note, it's part of a sentence about a patient's diet and a supplement they mentioned to their doctor. The labeling function flags it as a drug name.

**Where is the human in the loop?**

- The labeling function didn't read the sentence — it matched a pattern. Who's responsible for what it missed?
- A human reviewer would catch this in a second. But there are 4 million notes. Where does the human fit when the volume is that high?
- The model trained on this data will probably learn the wrong thing about "lithium." How many wrong examples does it take before that becomes a real problem?
- Sequence labeling breaks text into tokens and labels each one. Does that framing fit how humans actually read — or does it miss something structural?

---

## Word search

Find the hidden words — they run across, down, or diagonal.

```{code-block} text
:class: wordsearch

WORDS: SENTIMENT,SEQUENCE,LABELING,FUNCTION,MAJORITY,SNORKEL,ENTITY,TOKEN,VOTE,SPAN

N P O U C V Y T C U H H N K Q
L S A V F L L T D T X S D F S
E I Y T N C S G I I Y P L W V
K V Q X E O E N V T D A Y S O
R S E X V M N I T A N N I Q D
O K T S K N T L X U Q E S Q R
N X H A H B I E K Y C F E P O
S I N Z Z E M B R T A U Q N X
W Q E I D T E A O I H N U A P
S E K I M O N L F R I C E S H
Y F O H T V T J L O G T N B D
N B T W D C C Q N J G I C Q W
I I G P O U J K X A A O E J V
V G E U W Y K H D M B N D X K
D T N Y U H B W H L Q I C Y E
```

---

## One more thing

"Lithium" means different things in different sentences, and a system that can't distinguish them will flag the wrong ones. This is not a failure of the model — it is a description of the problem.

Language doesn't carry meaning in words. It carries meaning in words plus context. The human in the loop for a medical NLP system is not just checking whether an extraction was technically correct. They are supplying the contextual judgment the model cannot make reliably — and in clinical settings, that judgment has consequences.

<!-- html-link-injected -->
```{only} latex
*Read the interactive version of this chapter online:* [https://laztoum.com/reader/](https://laztoum.com/reader/) (word search, games, audio)
```