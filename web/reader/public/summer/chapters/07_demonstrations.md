# Learning from Demonstrations

> The car learned to drive by watching humans. The problem is that humans, when they're being watched, drive slightly differently than when they're not.

---

## Think about it

1. Think of something you do automatically — the way you parallel park, the route you take home, the way you hold a fork. Could you explain it well enough for someone to learn it by watching you once? A hundred times?

2. What's the difference between "what humans do" and "what humans would do if the situation were different"? A self-driving car trained on human data knows the first thing. It doesn't know the second.

3. Have you ever learned something by watching someone and then discovered you'd learned the wrong parts — the tics, the habits, not the skill itself? What was it?

4. Distribution shift sounds technical but you've felt it: showing up in a situation that's a bit like the ones you prepared for, but not quite. What do you do? What should a model do?

5. Behavioral cloning makes the model learn to copy actions. But most experts can't fully articulate why they make their decisions. Is it possible to clone expertise without understanding?

---

## Spot the human

> A self-driving car company records thousands of hours of human driving and trains a behavioral cloning model on the data. The model learns to stay in lane, signal, yield, and accelerate smoothly through familiar scenarios. Then it encounters a flooded road that no driver in the training set ever drove through, because experienced drivers turned around.

**Where is the human in the loop?**

- The demonstrations covered everything the humans decided to demonstrate. What's missing is everything they decided wasn't worth demonstrating — including their judgment about when to stop.
- DAgger tries to fix distribution shift by asking the expert what they would do in the states the model actually visits. Why is that different from just recording more drives?
- The expert policy is a snapshot. Drivers improve, rules change, cities get rebuilt. How long does a demonstration dataset stay valid?
- The humans in the loop were the original drivers. Are they still in the loop when the model is deployed a year later?

---

## Word search

Find the hidden words — they run across, down, or diagonal.

```{code-block} text
:class: wordsearch

WORDS: IMITATION,AGGREGATE,CLONING,ROLLOUT,DATASET,DAGGER,EXPERT,POLICY,SHIFT,ROBOT

F R U N Z Y C C I Q T R C P Z
R O L L O U T Z N L Y L B T I
U T Q V P I W U Z K O A S H G
T R E P X E T L D N N W Y F F
P G E D E X Z A I S E L C Q M
D I O A U D G N T T N C I L A
I B E F X G G Q A I P G L Z Y
R Z P Q E O S G S A M W O C F
E O R R K U E B T H W I P B M
D A B C J R B R J H T X R E T
R S Y O G I T S C S P K R B F
D N N G T L J S Y P T E C Q I
D O A U Z O A N Z S Q Y C Z H
Z J Z W P Q D Y H L Z K F O S
A S D V O D A T A S E T O I U
```

---

## One more thing

Behavioral cloning learns what the human did, not why. The drivers who turned around at the flooded road made a decision — they assessed risk, recognized an unusual situation, and chose differently. The model learned their normal behavior but had no access to that reasoning.

When the model encountered the same road, it had no category for "this is different." It only had the pattern of what to do on roads. The problem with learning from demonstrations is not that the demonstrations were wrong. It's that the model learned the surface without the judgment underneath.

<!-- html-link-injected -->
```{only} latex
*Read the interactive version of this chapter online:* [https://what-if.io/reader/](https://what-if.io/reader/) (word search, games, audio)
```