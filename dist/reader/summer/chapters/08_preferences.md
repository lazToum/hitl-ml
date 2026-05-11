# Learning from Comparisons and Rankings

> Preferences are real. They're just not consistent, context-free, or immune to how the question was asked.

---

## Think about it

1. Think about the last time you chose between two things you genuinely liked differently. Was it easy to say which one was "better"? What would it mean to express that difference to a machine?

2. Spotify's Discover Weekly is built on the implicit assumption that what you listened to is what you preferred. Is that true? What about the song you left on while you made dinner?

3. Are your preferences transitive? If you prefer A to B and B to C, do you always prefer A to C? Think of a case where that might not hold.

4. If someone asked you to rank 50 things from best to worst, how would your answers on day one compare to your answers on day seven? Does that instability mean your preferences aren't real — or just that they're human?

5. What kinds of things are hard to compare ordinally — where "better than" doesn't quite capture your experience of the difference? What gets lost when you try?

---

## Spot the human

> Spotify Discover Weekly compiles a playlist of songs you've never heard. It's built on collaborative filtering and implicit feedback — your listening history, skip rates, repeat plays, playlist additions. Every play is a data point. Every skip is a data point. You never rated anything.

**Where is the human in the loop?**

- You didn't compare songs — the model inferred comparisons from your behavior. Is that the same thing? Is it close enough?
- The Bradley-Terry model assumes comparisons are consistent and probabilistic. What happens when a song you loved at 20 now feels dated? Does the model handle nostalgia?
- Cardinal feedback (ratings) and ordinal feedback (rankings) capture different things. What does Discover Weekly use — and what does it miss because of that?
- If you listen to a song because it's familiar, not because you prefer it to something new, is that signal or noise?

---

## Word search

Find the hidden words — they run across, down, or diagonal.

```{code-block} text
:class: wordsearch

WORDS: COMPARISON,PAIRWISE,CARDINAL,RANKING,UTILITY,ORDINAL,BRADLEY,ELICIT,REWARD,NOISE

N X A V U K L C R U Z T O Q O
O D O S N C P F G A Y C V T W
I G H L B O M R N P N B I T A
S X K M V N S L A C W K H O K
E Y D U B C A I G R E G I S D
E H I K G N R O R E E S U N N
Y B C S I W S C R A M W Q A G
X I U D I T E D E D P C A D Y
M R R S Y Q O S V K I M O R M
V A E J Z J P G E A V N O O D
C N H S J D G B F M D K A C M
B L R X T F G V K R E Q Y L R
G V Z B B B R A D L E Y O E T
P L D B H A C B Y T I C I L E
E H M D U T I L I T Y B O P W
```

---

## One more thing

When you skip a song, you might be in the wrong mood, in a hurry, or just not ready to hear that particular thing today. The system records a skip. It learns "dislike." Next week's playlist shifts.

You didn't choose to teach it that — you just lived in it. The difference between data you intentionally provide and data that is extracted from your behavior is one of the clearest places to think about what it means to be in a loop you didn't sign up for.

<!-- html-link-injected -->
```{only} latex
*Read the interactive version of this chapter online:* [https://laztoum.com/reader/](https://laztoum.com/reader/) (word search, games, audio)
```