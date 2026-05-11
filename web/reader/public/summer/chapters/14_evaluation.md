# Evaluation and Metrics

> 95% accuracy sounds great until you find out the dataset is 95% one class, and the model just learned to say that class every time.

---

## Think about it

1. Think of a number you've been given to assess something — a score, a grade, a rating. What did that number leave out? Was the thing it left out important?

2. If a model has been optimized specifically to do well on a benchmark, does doing well on that benchmark tell you anything anymore?

3. Calibration means a model's confidence matches its actual accuracy. Why might that matter more than raw accuracy when you're making a decision based on the model's output?

4. A model trained in 2022 is deployed in 2025. The world has changed. The benchmark score hasn't. What does the score actually measure now?

5. Precision and recall pull against each other — improving one often hurts the other. In your field (or in your life), which kind of mistake costs more: false positives or false negatives?

---

## Spot the human

> A machine learning team reports that their model achieves 95% accuracy on a standard benchmark. The benchmark is publicly available and widely used. They submit to a conference. A reviewer notes that the benchmark's class distribution is 95% negative examples. The model predicts "negative" for everything.

**Where is the human in the loop?**

- The benchmark was designed by humans, with choices about what to include and what distribution to use. Those choices are still active — they're just invisible now.
- The team may not have intentionally gamed the metric. But they optimized for it. Is there a difference?
- Cohen's kappa adjusts for chance agreement. If you applied it to this model, what would you find?
- The reviewer caught it. How many papers didn't have that reviewer? What's already deployed based on that number?

---

## Word search

Find the hidden words — they run across, down, or diagonal.

```{code-block} text
:class: wordsearch

WORDS: CALIBRATION,PRECISION,BENCHMARK,ACCURACY,COVERAGE,RECALL,METRIC,KAPPA,AUDIT,DRIFT

C B U C I R T E M Q O H Q O F
Y P S L C Q J K I Y Z Z Z B D
T K M M N O M E N L K P N X S
Z D E R C R V K O K Z I T V N
E N K I W A Z E R E Y Q R W O
J W J D O Z L A R D G S D Y I
R E C A L L M I E A A F C W S
H R I E T H G G B U G A U X I
K K K G C F F Z D R R E N I C
S C Q N X B I I A U A A U Z E
F J E O P K T R C O K T C H R
B B Q M P F G C D D N O I Y P
S B M V S H A J X L B R U O H
M A N E N A P P A K Q N A C N
F R Y Y H M L V X A D F Z I D
```

---

## One more thing

A model that predicts "negative" for everything achieves 95% accuracy on a dataset that is 95% negative. The metric is correct. The model is useless. This is the cleanest possible demonstration of why evaluation metrics need to be understood before they are trusted.

Accuracy measures the fraction of correct predictions. It does not measure whether the model learned anything. A human evaluator who looked at the outputs would notice immediately. The metric did not. The number passed review. The model shipped.

<!-- html-link-injected -->
```{only} latex
*Read the interactive version of this chapter online:* [https://what-if.io/reader/](https://what-if.io/reader/) (word search, games, audio)
```