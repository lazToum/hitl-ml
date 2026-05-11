# Active Learning

> The model decides what you see. The question is whether you've noticed that yet.

---

## Think about it

1. If a machine asks you only the questions it's most confused about, can you trust that you're building a complete picture — or just filling in the machine's blind spots?

2. What does "uncertain" mean to a model versus what it means to you? Are those two things compatible enough to be useful?

3. A doctor reviewing AI-flagged X-rays gets shown the ones the AI is least sure about. Does that make her more useful — or does it change what kind of expert she becomes over time?

4. Is asking the right question harder than answering it? Think of a domain you know well. Who would ask the most useful questions — you, or a machine that's seen a million examples?

5. When you're on a budget — of time, of money, of attention — how do you decide what's worth your effort? Does that logic look anything like how active learning decides what's worth labeling?

---

## Spot the human

> A radiology AI has been integrated into a hospital workflow. It scans every X-ray that comes in, assigns a confidence score, and flags the ones it's least sure about for the radiologist to review. The radiologist looks at the flagged cases. The unflagged ones go through automatically.

**Where is the human in the loop?**

- The AI chooses which cases the radiologist sees. Does the radiologist know that's happening?
- What happens to the radiologist's intuition about what "normal" looks like if she only ever sees the edge cases?
- A case the AI is confident about could still be wrong. Who catches that?
- The budget is the radiologist's time. Is the AI spending it wisely — and who gets to decide?

---

## Word search

Find the hidden words — they run across, down, or diagonal.

```{code-block} text
:class: wordsearch

WORDS: UNCERTAINTY,COMMITTEE,ENTROPY,CORESET,MARGIN,STREAM,ORACLE,BUDGET,QUERY,POOL

E H P O Z M B U D G E T X V L
T X B I F A C A H A S Y O T U
R T R J L E O S G M D R L K D
H E T W B R M N Y B A V T P D
E S F U X T M A T C U J U C U
I E C A N S I I L F W E Q N U
V R G B I P T E I C N Q C Y Z
T O K R Z P T C J T P E J M M
J C R O C K E I R E R E V E C
O M M U L O E O C T I L S Y E
I A X R Q L P H A B O W H R P
C R Q I N Y W I E O Q U E R Y
O G I E H T N L P Q D K K P E
A I C M U T V W Z M M S U X V
Q N O H Y H F W E X A K J A R
```

---

## One more thing

Active learning is built on a sensible idea: focus human attention where it is most needed. The complication is that the system decides what "most needed" means. In the radiology scenario, the unflagged cases aren't reviewed because the system is confident — not because they are easy.

Confidence is not the same as correctness. The cases the system is most sure about are also the cases where its errors are hardest to catch, because no one is looking.

<!-- html-link-injected -->
```{only} latex
*Read the interactive version of this chapter online:* [https://laztoum.com/reader/](https://laztoum.com/reader/) (word search, games, audio)
```
