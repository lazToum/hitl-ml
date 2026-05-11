# Fairness, Bias, and Ethics

> The model didn't invent the bias. It learned it, faithfully, from humans who didn't notice they had it.

---

## Think about it

1. If a dataset was built by people making reasonable decisions in a biased world, is the dataset biased? Is the model trained on it biased? Is the organization that deployed it responsible?

2. "Removing bias" often means choosing whose idea of fairness wins. Whose idea of fairness is encoded in the tools you use every day?

3. Think about what "neutral" would mean for a hiring algorithm. Is neutrality possible — or does every design choice favor someone?

4. The annotators who labeled "good candidates" for the historical hiring data were humans trying to do a good job. They probably didn't think of themselves as introducing bias. Does intent matter?

5. Transparency — knowing what an AI is doing and why — is supposed to help. But transparency for whom? The engineers? The regulator? The person being decided about?

---

## Spot the human

> A hiring algorithm is trained on a decade of historical hiring data. Human recruiters labeled candidates as "good" or "not good" based on who got hired and performed well. Those historical hires skewed toward a particular demographic. The model learned that pattern. Now it's ranking new candidates.

**Where is the human in the loop?**

- The recruiters who labeled the historical data are no longer in the loop. But their judgments are still running.
- A "feedback loop" in the algorithmic fairness sense means the model's outputs shape future training data. What does that mean for underrepresented candidates over time?
- If you audit the model and find disparate impact, what do you do? Retrain? Adjust outputs? Reconsider the training data? Who decides?
- The workers who annotated this data — did they know it would be used to train a hiring model? Did they consent to that use?

---

## Word search

Find the hidden words — they run across, down, or diagonal.

```{code-block} text
:class: wordsearch

WORDS: TRANSPARENCY,FAIRNESS,CONSENT,PRIVACY,WORKER,RIGHTS,AUDIT,POWER,BIAS,HARM

N P S T X D S T H G I R M V C
I B T W W I P O W E R S J K I
E C R B T N Z O P P C S P I R
L D A I I H M A R N P E S F U
I B N H Z A U U X L N N K W L
R U S A B D S L W V G R P K P
Q J P Q I M I U P G V I H F P
R G A T V W L O T S U A P R A
W B R R D T Q I F N P F I G U
V N E D N G J G Z Q E V A W U
H P N Z W O R K E R A S S P T
Y G C Z N A L O I C C H N N L
N R Y M K C B Y Y E N E A O A
C Y R X B U Z W I X W L B R C
U U R C N R X H X A Q O C B M
```

---

## One more thing

The algorithm learned a pattern from history, and the pattern is real — it does describe who got hired and performed well, by the measures available. The problem is that those measures were not neutral. The historical decisions that produced the training data were made in a context with its own biases, blind spots, and incentives.

When the model is trained on that data and deployed, it doesn't just reproduce the past — it makes the past look like a prediction about the future. Human review of algorithmic hiring decisions is not only a legal requirement. It's the mechanism by which someone can ask: is the pattern the model learned a pattern worth keeping?

<!-- html-link-injected -->
```{only} latex
*Read the interactive version of this chapter online:* [https://laztoum.com/reader/](https://laztoum.com/reader/) (word search, games, audio)
```