# Interactive Machine Learning

> Somewhere between the tenth correction and the thirtieth, you stop correcting and start accepting. That's the moment worth watching.

---

## Think about it

1. Think of something you taught someone — a skill, a game, a habit. How did you know when they'd got it? Could you imagine teaching a machine the same way?

2. The "Grandmother Test" asks whether a non-expert can understand what a system is doing and why. Pick any app on your phone. Would your grandmother pass?

3. Have you ever given up correcting a phone's autocorrect and just started spelling things its way? What does that say about who's really adapting?

4. Fatigue is real — after a while, feedback gets sloppier. If the model was trained partly on your tired corrections, is it learning you at your best or you at your most exhausted?

5. When feedback feels like it's working, is it because the model improved, or because you started expecting less? Is there a way to tell from the inside?

---

## Spot the human

> Google's Teachable Machine lets you open a browser tab, hold objects up to your webcam, and train a classifier in real time. You show it examples of "thumbs up" and "thumbs down," and within seconds it starts predicting. You keep training until it gets it right. It feels like teaching.

**Where is the human in the loop?**

- The model updates as you add examples. But you're also updating — adjusting how you hold the object, what backgrounds you use. Who's learning from whom?
- If the model keeps making the same mistake no matter what you show it, at what point do you conclude the problem is the interface, not your teaching?
- The loop is fast and visible — you can watch the model change. Does that transparency make you trust it more, or just feel more in control?
- What's the first sign you'd notice that the model had anchored on something irrelevant — like the color of your shirt instead of your gesture?

---

## Word search

Find the hidden words — they run across, down, or diagonal.

```{code-block} text
:class: wordsearch

WORDS: INITIATIVE,THRESHOLD,FEEDBACK,ITERATE,CORRECT,FATIGUE,DIRECT,RAPID,TRUST,TEACH

W E M Z D T T F C R V W V Y W
O T M U L I C M Y A M M F W Q
A E C K O S E U W P N H K L O
S A G M H Q R E R I W A V N S
B C U O S U I V Z D S V B H S
H H H B E B D I C T Z L S U J
K O C Z R Q W T M S B W Y M V
O T O X H M S A B M H M B C L
W S R I T C R I E M K H A N K
X U R E V C S T F A T I G U E
T R E Y X N T I S Z D V R V E
U T C Y Z H C N X A E U J I U
Z V T R U E T I S X K M S Y I
M H A G D D E T A R E T I R B
P F E E D B A C K B T N R K K
```

---

## One more thing

Teachable Machine makes the feedback loop visible in a way that most ML systems do not. You can see your examples, retrain, and watch the model change. What it teaches, if you pay attention, is that a model trained only on your examples reflects only your examples.

Show it only sunny thumbs-up and it will struggle with a shadowed one. The model is not learning "thumbs up." It is learning what *you showed it* thumbs up looks like. The gap between those two things is where most real-world ML problems live.

<!-- html-link-injected -->
```{only} latex
*Read the interactive version of this chapter online:* [https://what-if.io/reader/](https://what-if.io/reader/) (word search, games, audio)
```
