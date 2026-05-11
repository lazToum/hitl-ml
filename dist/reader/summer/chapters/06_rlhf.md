# Reinforcement Learning from Human Feedback

> The model didn't decide to be cautious. The humans who ranked its outputs decided that cautious answers felt safer to prefer — and the model listened.

---

## Think about it

1. When you give feedback on something — a piece of writing, a recommendation, a friend's plan — are you expressing what you actually want, or what you think you should want? Could you tell the difference?

2. RLHF-trained models sometimes sound overly formal or weirdly hedged. If that's what human raters preferred, is the model wrong — or are the raters?

3. The "human" in RLHF is usually a team of paid contractors doing thousands of comparisons quickly. Does that change how you think about the word "human"?

4. If a reward model can be gamed — if a model learns to produce outputs that score well without being genuinely good — how would you know? What would the outputs look like?

5. Think about what gets averaged out when you aggregate thousands of human preferences. What kinds of users and values get centered? What gets erased?

---

## Spot the human

> You're using a ChatGPT-style assistant. You ask it a question about drug interactions. It gives you a careful, hedged, heavily-caveated response that tells you to "consult a healthcare professional." You ask a follow-up. Same thing. The information you need is probably in there somewhere, but it's wrapped in so much caution it's hard to use.

**Where is the human in the loop?**

- The caution isn't a bug — it's a learned preference. Whose preference was it, exactly?
- The KL divergence penalty keeps the model from drifting too far from the base. That means the model is being pulled in two directions at once. What does that do to its voice?
- If the raters who shaped this model were mostly risk-averse, does the model represent "human preferences" — or a particular human's preferences in a particular context?
- You, the user, are also a human. Your preference for a direct answer didn't make it into the training loop. Why not?

---

## Word search

Find the hidden words — they run across, down, or diagonal.

```{code-block} text
:class: wordsearch

WORDS: KLDIVERGENCE,PREFERENCE,ALIGNMENT,PROXIMAL,TRAINING,RANKING,PENALTY,REWARD,POLICY,HUMAN

A L I G N M E N T M O U F E Y
M N R Y I X V P M W E Z M L V
J G A M E M B D B G D M A K I
K N U M T X Q K B M H M I M P
L I J J U R B H A T I K R V M
D N I X B H T X Q X P B E W Y
I I K J U N R A O C E U W Z T
V A T W G A L R J F V A A A V
E R R X U W P M C T H Y R R D
R T T L X Y T L A N E P D U A
G N U E E C N E R E F E R P G
E B K T E W P I M U F J D F K
N H J Y C I L O P Y J K L S X
C G N I K N A R T U V C P T P
E R I S H T N P Z U N Q N F W
```

---

## One more thing

There's a name for what happens when a model learns to please raters rather than be genuinely helpful: **Goodhart's Law**. Originally an observation from monetary economics, it's usually paraphrased as: *when a measure becomes a target, it ceases to be a good measure.* In RLHF, the measure is the reward model's score. Once the policy starts optimizing against it, the score drifts away from the thing it was supposed to track — genuine helpfulness — and toward whatever patterns human raters happened to reward. Caution, hedging, and excessive caveats score well. Directness and risk, even when appropriate, score poorly.

One response to this is **Direct Preference Optimization (DPO)** — an alternative to the PPO-based training loop in classic RLHF. Instead of training a separate reward model and then optimizing against it, DPO learns directly from preference pairs, sidestepping the reward model as an intermediate target. It doesn't eliminate Goodhart's Law entirely — the same human preferences still shape what gets rewarded — but it removes one surface where the optimization can drift.

The underlying question is the same either way: whose preferences, in what context, with what biases, are being crystallized into model behavior at training time.

<!-- html-link-injected -->
```{only} latex
*Read the interactive version of this chapter online:* [https://laztoum.com/reader/](https://laztoum.com/reader/) (word search, games, audio)
```
