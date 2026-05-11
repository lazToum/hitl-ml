# Crowdsourcing and Quality Control

> Five hundred workers, three labels each — and somewhere in that number, a few people who were clearly just clicking. The math assumes you can tell them apart.

---

## Think about it

1. When a crowd votes and you go with the majority, what are you assuming about the crowd? What has to be true about them for that assumption to hold?

2. "Gold standard questions" are tasks where you already know the answer, used to detect bad annotators. Does that work if a careful worker gets a hard gold question wrong?

3. Think about how much the task of labeling an image pays on Mechanical Turk — maybe a few cents. Does that affect what kind of answers you'd expect? What kind of workers?

4. Dawid-Skene estimates worker reliability from agreement patterns. But two workers who agree can both be wrong in the same systematic way. How would you catch that?

5. If you could redesign one thing about how crowdsourcing platforms work — payment, task design, quality control, worker communication — what would it be and why?

---

## Spot the human

> Five hundred workers on Mechanical Turk are labeling images — three workers per image, earning a few cents each. Most clusters of three are consistent. But looking at the logs, a handful of workers are clearly clicking through without reading — their per-image times are under a second, their responses are random. The majority vote algorithm doesn't know that yet.

**Where is the human in the loop?**

- The workers are humans. But their presence in the loop depends entirely on whether they're actually engaged with the task. At what point does a worker stop being "in the loop"?
- Majority vote is designed to filter out random noise. But if a whole group of workers shares the same misunderstanding, it won't help. What does?
- The few-cents-per-image rate was set by someone. That rate shapes who does the work and how much attention they give it. Is the person who set the rate in the loop?
- A spam filter based on response time would catch the fastest clickers. But some fast responders are legitimately fast. What's the cost of wrongly removing them?

---

## Word search

Find the hidden words — they run across, down, or diagonal.

```{code-block} text
:class: wordsearch

WORDS: AGREEMENT,MAJORITY,QUALITY,WORKER,FILTER,CROWD,DAWID,SKENE,SPAM,GOLD

M C Y J E U M H O T H J H G Y
T P T P N H F G R G C K E Y F
I O I K X N D A O H S R C X U
R Y L M L I G L W Z I S O T P
Z V A K T F D F R X L C B W U
R M U W O R K E R N Y A Y V D
N R Q O P E S P A M V V U M V
G T Z L T N E M E E R G A B H
I N R Y A Q R T K A K I C M W
S S B U B B Q E M R Y X U B V
P X D I W A D Q T E L Q D M Y
N V Z A Y S B N R L N G Q U R
Z B M I J G E Y R M I J G P D
M A J O R I T Y T P H F W N Z
B Q E N E K S V X M J E G M U
```

---

## One more thing

The majority vote catches random behavior eventually, but not before those responses are counted. Crowdsourcing exchanges depth for scale — that's a reasonable trade when it's made deliberately.

The problem is when the system treats all workers as interchangeable, because they are not. The quality of the labels depends on the quality of the attention, and attention is not something a platform can mandate. The five hundred workers are not five hundred identical measurement instruments. They are people, and people vary.

<!-- html-link-injected -->
```{only} latex
*Read the interactive version of this chapter online:* [https://laztoum.com/reader/](https://laztoum.com/reader/) (word search, games, audio)
```