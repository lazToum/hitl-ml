# Annotation Platforms and Tooling

> The platform decided you could only pick one label. That decision shaped every dataset built on it.

---

## Think about it

1. Think about a form you've filled out that didn't have a field for what you actually wanted to say. Did the form shape your answer? What did the data collector learn?

2. Interface design is a series of choices about what's easy and what's hard. In an annotation platform, what things should be easy — and for whom?

3. If annotators can only choose from the options the platform offers, then the platform designer is making decisions about the data. Are they accountable for those decisions?

4. "Quality control" in annotation usually means checking consistency. But consistency and correctness aren't the same. Can you think of a case where they'd point in opposite directions?

5. Think about a task you've done repetitively — data entry, tagging, sorting, filing. At what point did you stop thinking carefully and start going on autopilot? What would have kept you engaged?

---

## Spot the human

> A startup is building a training dataset using a crowdsourcing platform. The platform shows one item at a time, offers three label choices, and logs how long each annotator spends. Fast annotators get flagged for review. The platform's design — one item, three choices, a timer — quietly determines what kinds of annotations are possible and what kinds of data get produced.

**Where is the human in the loop?**

- The platform was designed by engineers who probably didn't annotate the task themselves. Does that matter?
- The three label choices were chosen by the startup. What got left out of the interface?
- The timer creates pressure. Does pressure improve annotation quality or degrade it? Does the platform know?
- The human doing the annotation is in the loop. The human who designed the platform is no longer in the loop. But her choices are still making decisions.

---

## Word search

Find the hidden words — they run across, down, or diagonal.

```{code-block} text
:class: wordsearch

WORDS: THROUGHPUT,INTERFACE,PLATFORM,WORKFLOW,QUALITY,WORKER,REVIEW,EXPORT,SCALE,TASK

Y G E E L A C S R P Q H S O T
T E Z H Q V V E L Y M Q V G U
C V V E B X K A T A L I C M P
B E Q E D R T X X W T M Q V H
A E J O O F B F E R E Z E E G
C W X W O H K I U G L I G E U
C Y Y R I B V Y C V E Z G H O
W R M K K E L L J C A F V M R
I O C P R H Q U A L I T Y W H
B K L X F E W F J I L Z N V T
V R P F X U R A S T W P I U D
Q B W P K E D P O G C T W X I
T B O J T R Y I Q F A K A Q H
G R D N U K O O D H W L E S B
T C I Q E Z Q W Y G I Y Q W K
```

---

## One more thing

The platform shows one item at a time. That means the annotator can never compare this item to the previous one, never see a cluster of borderline cases together, never develop a feel for the distribution. The platform wasn't designed to prevent that — it just wasn't designed to enable it.

Interface design is not neutral. The structure of the tool determines the structure of the knowledge that can be produced. Building the right HITL platform is not a secondary engineering concern. It is part of deciding what the annotation will mean.

<!-- html-link-injected -->
```{only} latex
*Read the interactive version of this chapter online:* [https://what-if.io/reader/](https://what-if.io/reader/) (word search, games, audio)
```