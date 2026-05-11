# HITL in Computer Vision

> The annotator drew the box. Whether the box captured the thing the model needed to understand is a different question entirely.

---

## Think about it

1. Where does a pedestrian end? It sounds absurd, but that's exactly what a bounding box annotation requires you to decide. Does the answer depend on why you're drawing the box?

2. Think of something you can recognize instantly but would struggle to draw a precise boundary around. A crowd. A shadow. A reflection. What does "annotation" even mean for those things?

3. If two annotators draw slightly different boxes around the same object, and a model trains on both, what does it learn? Is the average the right answer?

4. Polygon annotations are more precise than bounding boxes but take longer. At some point, more precision costs more than it's worth. Who makes that call, and how?

5. Have you ever labeled something — on any platform, in any context — and felt like the category didn't fit? What did you do? What should the platform have done?

---

## Spot the human

> An annotator is drawing bounding boxes around pedestrians for a self-driving car dataset. She's doing hundreds per hour. The guidelines say to include the full body, but some pedestrians are partially occluded — cut off by a pole, a car, another person. She's making judgment calls every few seconds.

**Where is the human in the loop?**

- The model will train on her judgment calls alongside everyone else's. If she's more conservative about occluded pedestrians than other annotators, is her data worse — or different?
- After hour three, boxes start getting a little looser. The platform doesn't know that. Should it?
- Tight bounding boxes are more "correct" in some sense, but the model may actually generalize better from slightly noisier annotations. Does the human need to know that to do the job well?
- The pedestrian the model will one day fail to detect — was her bounding box in the training set?

---

## Word search

Find the hidden words — they run across, down, or diagonal.

```{code-block} text
:class: wordsearch

WORDS: DETECTION,BOUNDING,KEYPOINT,SEGMENT,POLYGON,CAPTION,OBJECT,ACTIVE,LABEL,MASK

K C O V U S A J K L R U V Q P
C S J F N G N I D N U O B N G
D V A C A F E B E A J V X O L
A F Q M B H S W J W S A E I P
M N L R E H A Q T J U K M T K
B E R P T N I O P Y E K N P J
E L Z D K M W Z I Q N E A A R
D A D R C A D J U O M C P C O
O B I J Z V T H I G T Z I B P
H E S V G H J T E I H B J O R
P L F H D W C S V I X E L M Y
A X J R D E Z E F V C Y N H P
M Y R B T Q J P D T G F F Y K
Q G A E H G Z P J O W V O U U
R R D D G B L A N G C H E D W
```

---

## One more thing

The annotator drawing boxes around occluded pedestrians is making dozens of judgment calls per hour, and none of them feel like judgment calls — they feel like box-drawing. But the decision about where the box goes when a person is cut off by a pole is a decision about what the model will learn counts as a pedestrian.

Scale that across thousands of annotators and millions of images, and those small judgment calls become the definition the model works from. The guideline says "include the full body," but the model learns what annotators actually did.

<!-- html-link-injected -->
```{only} latex
*Read the interactive version of this chapter online:* [https://laztoum.com/reader/](https://laztoum.com/reader/) (word search, games, audio)
```