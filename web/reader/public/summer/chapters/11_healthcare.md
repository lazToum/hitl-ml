# HITL in Healthcare and Science

> The AI flagged it. The cardiologist overruled it. The patient was fine. Next time, it might not be the AI that's wrong.

---

## Think about it

1. When you trust a doctor's judgment, what are you trusting — their knowledge, their experience, their confidence, or something harder to name? Does it matter if an AI has all the first three?

2. In healthcare, false positives (wrong alarms) and false negatives (missed cases) have very different costs. Who should decide where to set the threshold — the engineers, the clinicians, or the patients?

3. Two radiologists look at the same scan and disagree. This happens all the time. Does that mean one of them is wrong, or that the image is genuinely ambiguous? How should a model handle that?

4. "Regulatory oversight" sounds dry, but it's the mechanism by which society decides who bears responsibility when something goes wrong. If an AI makes a call and a doctor follows it, who's accountable?

5. Think about a time you were on the receiving end of someone's expert judgment — a diagnosis, a legal opinion, a teacher's assessment. Did you feel like you were in the loop? Should you have been?

---

## Spot the human

> An AI system reads ECGs and flags potential arrhythmias for cardiologist review. The system has been validated on a large dataset and performs comparably to junior cardiologists on most arrhythmia types. A cardiologist reviews a flagged ECG and disagrees with the AI's reading. The patient's chart is ambiguous. The cardiologist makes the call.

**Where is the human in the loop?**

- The cardiologist overruled the AI. Was she overruling a tool, or a second opinion? Does the framing change how she thought about it?
- The AI was trained on data from a different hospital system with different demographics. The cardiologist doesn't know that. Should she?
- If the AI is right more often than it's wrong, and the cardiologist overrules it often, is the cardiologist making the system worse? How would you measure that?
- Consent forms say the hospital uses AI to assist diagnosis. Is that "in the loop" for the patient?

---

## Word search

Find the hidden words — they run across, down, or diagonal.

```{code-block} text
:class: wordsearch

WORDS: RADIOLOGY,DIAGNOSIS,OVERSIGHT,CLINICAL,CONSENT,SAFETY,EXPERT,TRIAL,AUDIT,BIAS

B K O J R V T O C G T R L W J
I P Y E R U D L N R Z F D J O
X A V V F V I I E N X C R Q Q
Y J S W S N V P A O X S O P M
A U Y W I T X I E G A Z V Y M
M U M C K E H K M I N S U V K
R O A N Q X S G B K P O T D A
E L M G Z N Y I I B M Y S R K
B Q I B K T Y A T S J O C I T
P X R Z E R E R L I R C X P S
Q S A F H V I Y N F X E Z Z D
S U A X A A T Q T X Y F V Y S
P S U E L E Q R N N G P B O O
O M C R Y G O L O I D A R B D
C O N S E N T T I D U A J Q C
```

---

## One more thing

The cardiologist overrules the AI and makes the call. That's the right structure — the human with training, context, and accountability decides where the evidence is ambiguous. What matters is what happens next.

If the case is recorded only as the cardiologist's decision, the AI never learns that its reading was disputed. If it's recorded as a correction, the feedback loop closes. Whether this encounter makes the AI better depends entirely on whether anyone designed the system to learn from this kind of disagreement.

<!-- html-link-injected -->
```{only} latex
*Read the interactive version of this chapter online:* [https://what-if.io/reader/](https://what-if.io/reader/) (word search, games, audio)
```