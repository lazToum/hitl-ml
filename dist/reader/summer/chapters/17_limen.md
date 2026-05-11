# Limen: A Human in the Loop of Everything

> A threshold isn't a wall. It's a question the system is asking you — and the answer you give shapes what it asks next time.

---

## Think about it

1. Think about the last time a piece of technology did something helpful without asking. Was it helpful because it asked, or helpful despite not asking? Does the difference matter to you?

2. "Voice-first" means the interface is a conversation. But conversations have norms — about when to interrupt, when to wait, when to assume. Who taught the OS those norms?

3. Local processing means your data doesn't leave your device. Why does that feel different from a privacy policy that promises the same thing? What's the underlying thing you're actually trusting?

4. The Grandmother Test asks whether a non-expert could understand and trust what's happening. Would your grandmother trust a system that anticipates her needs without being asked? Would you?

5. If an OS tracks causal events — WID, what-I-did — to understand your routine, at what point does understanding your routine become predicting your intentions? Is that a line worth drawing?

---

## Spot the human

> Your OS has been learning your morning routine for three weeks. Coffee at 7:15, news app at 7:20, calendar check at 7:25, first work message at 7:45. It starts anticipating — dimming the bedroom light at 7:10, pulling the news headlines before you open the app, surfacing your first meeting's prep notes at 7:40. One morning, it sends the message you were composing — a message you hadn't finished — because it predicted you were done.

**Where is the human in the loop?**

- The OS was following a pattern it had genuinely learned. Was it wrong to send the message, or wrong to have the permission to send messages at all?
- Graceful degradation means the system falls back to asking when it's uncertain. The OS wasn't uncertain — it was confidently wrong. Is that better or worse?
- The difference between "helpful" and "presumptuous" is often just whether the system was right. Does that mean the threshold for acting should be higher than just "high confidence"?
- If you could tell the OS one rule about when to always ask before acting, what would it be?

---

## Word search

Find the hidden words — they run across, down, or diagonal.

```{code-block} text
:class: wordsearch

WORDS: THRESHOLD,FEEDBACK,PRIVACY,ROUTING,CAUSAL,DESIGN,LIMEN,VOICE,LOCAL,LOOP

F A I W N H E S W B X D Y B I
K G V E S H V B S R F A D F Y
W O R F C O F R R M F T N Q Z
N H Z M E F E E D B A C K W D
L O C A L Z B H E A A Y O D L
A S U X T H R E S H O L D O I
U T G L W K Y P R M M R O M F
M X K L L X M C E O G P N V S
A W P I Q N D N A C U C V M A
C I M W Q B C A N V I T U X C
V E B W F X O A U G I O I G A
N F B Y L Y Z F U X I R V N Z
H M A A R B M V H S J S P J G
W S X V Q P F I B P A G E E U
Y U A E O T F R Y D Y L Z D J
```

---

## One more thing

Chapter 1 defined HITL ML as *deliberate, structured, and ongoing*. The anticipatory OS story is worth revisiting through each of those lenses.

**Deliberate**: The morning routine model was built without the user ever intending to provide training data. Three weeks of behavioral traces — coffee time, news opens, calendar checks — were extracted, not offered. The feedback loop was never named as a feedback loop.

**Structured**: There was no explicit threshold policy, no rule about when to act versus ask. The system filled the gap with confidence, which is not the same thing as authority.

**Ongoing**: The message was sent. The damage was done. There was no mechanism to say *that was wrong* in a way that would change the system's future behavior — only a way to feel violated after the fact.

When all three pillars are missing, "human in the loop" becomes a label rather than a guarantee. The user was present throughout the story — and absent from every decision that mattered.

The word *limen* means threshold. Every moment in this book where a system pauses and asks — *Are you still watching? Was this you? Should I send this?* — is a threshold. The system is not failing. It is asking you to be present.

That is what this project has been about. Not building systems that remove the human from the equation, but building systems worth being human in.

<!-- html-link-injected -->
```{only} latex
*Read the interactive version of this chapter online:* [https://laztoum.com/reader/](https://laztoum.com/reader/) (word search, games, audio)
```
