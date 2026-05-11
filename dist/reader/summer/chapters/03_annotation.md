# Data Annotation and Labeling

> A label is not a fact — it's an opinion that got promoted.

---

## Think about it

1. Have you ever been asked to categorize something and felt like none of the options quite fit? What did you do — pick the closest one, or leave it blank? What did that choice say about the categories themselves?

2. Two people watch the same video and disagree about whether it's "violent." Who's wrong? Is either of them wrong?

3. If annotators consistently disagree on a type of example, is that a problem to fix — or is the disagreement itself telling you something real about the world?

4. Think about a situation where you had to follow a rule that didn't quite cover your actual situation. Did following the rule get you to the right answer?

5. What's the difference between "everyone agrees" and "everyone is correct"? Can you have one without the other?

---

## Spot the human

> A content moderation team is labeling posts as "borderline" or "clearly violating policy." The post in question: a photo of a protest with a caption that could be read as incitement or as documentation, depending on how you look at it. Three annotators see it. Two say borderline. One says clearly violating. The system will record a majority vote.

**Where is the human in the loop?**

- What does the majority vote hide — and is what it hides important?
- The annotator who voted "clearly violating" might be right. Or might be having a bad day. How would you tell?
- If the guidelines don't fully cover this case, does following them anyway produce a meaningful label?
- The model will train on this label. What does it learn from a contested example that got flattened into a single output?

---

## Word search

Find the hidden words — they run across, down, or diagonal.

```{code-block} text
:class: wordsearch

WORDS: GOLDSTANDARD,ADJUDICATION,ANNOTATOR,GUIDELINE,AGREEMENT,AMBIGUITY,LABELING,SCHEMA,KAPPA,SPAN

C P W Y T I U G I B M A K E K
L A B E L I N G H A M E H C S
A X G P U E O J S V O J X P O
J Y X R P R I T N X N Q S C G
T G O L D S T A N D A R D W U
X E T X A U A D Z U G W C Y U
H G G T Z G C X Z Q R B I A F
P O N J C U I K O O E A W N I
P E D Z K I D L K L E P D N Z
M W O K J D U Z G H M P Z O O
F L J N H E J S J Q E A N T U
B F J E Z L D E G E N K A A F
W U S Q W I A W G I T P P T M
Q F I D X N Q L E D N J S O Q
Y I D E S E W Q M B M S O R U
```

---

## One more thing

The majority vote doesn't just decide the label — it erases the disagreement. Two annotators said "borderline," one said "clearly violating." Those are not the same claim. When you flatten them into a single label, you lose the information that the case was contested at all.

Good annotation systems preserve disagreement rather than resolve it. The signal isn't always the label. The signal is often the gap between labels — especially in content moderation, where the hardest cases are hard precisely because reasonable people see them differently.

<!-- html-link-injected -->
```{only} latex
*Read the interactive version of this chapter online:* [https://laztoum.com/reader/](https://laztoum.com/reader/) (word search, games, audio)
```
