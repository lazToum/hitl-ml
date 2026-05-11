# Chapter 10 Solutions Guide: Language AI, Hallucination, and HITL

*Complete solutions for all exercises, activities, and discussion questions*

---

## Discussion Question Solutions

### Introductory Level Solutions

#### Question 1: Ambiguity Recognition
**Prompt:** "Give three examples of sentences that have two plausible interpretations. How would you — as a human reader — decide which one is meant?"

**Model Strong Answer:**

1. **"Flying planes can be dangerous."**
   - *Interpretation A:* The act of flying planes is dangerous (gerund)
   - *Interpretation B:* Planes that are flying are dangerous (participial adjective)
   - *How humans resolve:* Context — if someone just asked "Why don't you take flying lessons?" interpretation A is likely; if someone is watching a low-flying aircraft, interpretation B is likely

2. **"I need glasses."**
   - *Interpretation A:* I need eyeglasses (vision correction)
   - *Interpretation B:* I need drinking glasses
   - *How humans resolve:* Topic of prior conversation, physical context (squinting vs. setting the table), intonation

3. **"Visiting relatives can be annoying."**
   - *Interpretation A:* The experience of visiting relatives is annoying
   - *Interpretation B:* Relatives who visit are annoying
   - *How humans resolve:* Intonation, stress pattern, context of who is speaking

**What information a computer would be missing:** World knowledge, conversational history, pragmatic context, tone of voice (for speech), social role of the speaker, and crucially, a model of what the speaker was *trying* to communicate — not just what they said.

**Grading Criteria:**
- **Excellent (A):** Three clear examples, accurate explanation of both interpretations, thoughtful analysis of resolution strategies and their computational implications
- **Good (B):** Three examples with basic understanding of ambiguity types, less precise on how resolution works
- **Satisfactory (C):** Three examples but struggles to articulate what a computer is missing
- **Needs Improvement:** Fewer than three examples, or confuses grammatical ambiguity with factual uncertainty

---

#### Question 2: Hallucination Analysis
**Prompt:** "Attorney Schwartz trusted ChatGPT's legal citations without verifying them. What three things did the system fail to do that a well-designed HITL system should have done?"

**Model Answer:**

A well-designed system should have:

1. **Expressed appropriate uncertainty about specific factual claims (Uncertainty Detection).**
When generating specific case citations — exactly the kind of content that is sparsely represented in training data — the system should have hedged: "I believe there may be relevant cases in this area, but I am not able to reliably verify specific case citations. Please verify any citations in an authoritative legal database before using them." Instead, it produced fully-formed fictional citations with no hedging.

2. **Provided a clear escalation path or categorical refusal for high-stakes queries (Intervention Design + Stakes Calibration).**
Legal citations are a category where the cost of being wrong is severe and verifiable. A well-designed system for legal professionals should either (a) refuse to generate specific citations unless it has verified retrieval capability, or (b) prominently warn that citations must be independently verified. The system had no such categorical awareness.

3. **Corrected itself when challenged rather than doubling down (Feedback Integration — negative example).**
When Schwartz asked ChatGPT to verify the citations, the system confirmed them — confabulating further rather than catching its own error. A system with appropriate calibration would recognize that "verify this" is a different kind of query than "generate this" and should produce a more cautious response, ideally acknowledging that it cannot reliably verify specific legal citations.

**Common student errors to address:**
- "It should have searched the internet" — True but incomplete; the fundamental issue is calibration and escalation, not just retrieval
- "The attorney should have known better" — True, but the question asks about system design, not user error
- Focusing only on the output rather than the design that produced it

---

#### Question 3: Stakes and Acceptable Error Rates
**Prompt:** "Why does it matter whether a language model hallucinates at a 5% rate versus a 50% rate? For which applications would even 5% be unacceptable?"

**Model Answer:**

The absolute acceptable error rate depends on the stakes of a wrong answer and the availability of error correction.

**5% hallucination is unacceptable when:**
- **Legal citations:** Even one hallucinated case in twenty is unacceptable in legal filings. The professional and legal consequences of citing a non-existent case are severe and difficult to detect without expert review.
- **Medical diagnosis or treatment recommendations:** A 5% error rate on medication dosages or drug interactions could harm one in twenty patients. In an emergency context, this is catastrophic.
- **Safety-critical information (evacuation routes, emergency procedures):** 5% of people receiving wrong evacuation instructions could result in preventable deaths.
- **Financial calculations with compounding effects:** Small errors in financial models can compound into large downstream mistakes.

**50% might be acceptable when:**
- **Brainstorming and creative ideation:** Generating 20 ideas, half of which are "wrong" (ill-suited to your needs), is still useful — you got 10 good ones.
- **First-draft writing assistance:** The human reviews and revises everything anyway; the AI's "wrong" suggestions are filtered in editing.
- **Entertainment applications:** A chatbot that generates imaginative but not necessarily factual conversation for an entertainment product may have higher acceptable error rates.

**Key principle (connect to framework):** Stakes Calibration determines acceptable error rates. The same error rate that's fine for creative brainstorming is catastrophic for medical or legal advice. Well-designed systems have domain-aware error tolerance.

---

### Intermediate Level Solutions

#### Framework Application: Legal Chatbot Analysis
**Sample strong answer applying five-dimension framework to a legal AI:**

| Dimension | Current Rating | Analysis | Improvement |
|-----------|---------------|----------|-------------|
| **Uncertainty Detection** | 2/5 | Produces confident-sounding text regardless of whether query is within training-data coverage | Add domain-classification: flag legal-specific queries, especially those requiring jurisdiction-specific or recent-case knowledge |
| **Intervention Design** | 1/5 | No escalation mechanism; answers all legal queries with same format as general knowledge queries | Add categorical refusal + escalation for: "I can provide general information, but for advice about your specific situation, please consult a licensed attorney" |
| **Timing** | 2/5 | No proactive flagging; user has to realize independently that answer might be wrong | Flag before or during generation of legal content: "Generating legal information — this requires verification" |
| **Stakes Calibration** | 1/5 | Treats "what is an amicus brief?" the same as "can I sue my employer for this?" | Category-aware responses: procedural/definitional questions vs. case-specific advice require different response styles |
| **Feedback Integration** | 3/5 | General RLHF feedback improves general quality; no legal-specific feedback loop | Legal professional feedback pipeline: have attorneys rate legal query responses specifically |

---

#### Design Question: Content Moderation HITL System
**Sample strong solution:**

**Automated First Pass:**
- Hash-based matching for known CSAM (non-negotiable, zero false-negative tolerance)
- Keyword and embedding-based flagging for high-severity categories (incitement to violence, terrorism)
- Confidence thresholds: high-confidence violations removed immediately; medium-confidence flagged for review

**Human Review Triggers:**
- Automated system confidence below 0.7
- Content in languages underrepresented in training data
- Novel patterns not matching known categories
- High-profile accounts (potential for false positives to be newsworthy)
- Appeals from users whose content was removed

**Five-Dimension Design:**
1. **Uncertainty Detection:** Automated system outputs calibrated confidence scores, not just binary decisions
2. **Intervention Design:** Reviewers see confidence score, the specific rule triggered, and comparable past examples — not just the raw content
3. **Timing:** Review queue prioritized by: (a) severity, (b) reach (viral content reviewed faster), (c) age (time-sensitive content about breaking news)
4. **Stakes Calibration:** Different SLAs for different categories — CSAM gets millisecond response, nuanced political speech can wait hours
5. **Feedback Integration:** Reviewer decisions retroactively scored against ground truth; systematic disagreements between reviewers and automated system trigger model retraining

**Structural weakness (students should identify):** Human reviewer well-being. Reviewers exposed to graphic content suffer documented psychological harm. The system should include: content throttling (limits on graphic material per reviewer per shift), psychological support, rotation between content categories.

---

### Advanced Level Solutions

#### Technical Question: RLHF vs. DPO Comparison
**Sample strong answer:**

**RLHF approach:**
1. Train reward model $r_\phi(x,y)$ on human preference data using Bradley-Terry loss
2. Fine-tune language model using PPO: maximize $\mathbb{E}[r_\phi(x,y)] - \beta \cdot \text{KL}[\pi_\theta \| \pi_{\text{SFT}}]$

**DPO approach:**
1. Directly fine-tune language model on preference data using:
$$\mathcal{L}_{\text{DPO}} = -\mathbb{E}\!\left[\log \sigma\!\left(\beta \log \frac{\pi_\theta(y_w|x)}{\pi_{\text{ref}}(y_w|x)} - \beta \log \frac{\pi_\theta(y_l|x)}{\pi_{\text{ref}}(y_l|x)}\right)\right]$$

**Human role in each:**
- RLHF: Human is in the loop at stage 2 (preference labeling). The reward model then mediates between human preferences and model training. Human signal is "amplified" through reward model training.
- DPO: Human is in the loop at the same stage (preference labeling), but the preferences directly update model weights — no intermediate representation.

**Key tradeoffs:**

| | RLHF | DPO |
|--|------|-----|
| Reward model stability | Reward model can overfit; harder to train | No separate reward model; more stable |
| Reward hacking | Risk of model exploiting reward model errors | Less risk; directly optimizes preferences |
| Computational cost | Higher (separate reward model training + RL) | Lower (single fine-tuning pass) |
| Flexibility | Can update reward model with new data without retraining LM | Preferences must be baked into model weights |
| Generalization | Reward model can generalize to new preferences | Less able to generalize beyond training preferences |

**When to choose RLHF:** When you need an explicit reward model for other purposes (e.g., as a safety filter, or to evaluate new outputs without retraining), or when preference data is collected incrementally over time and you want to update the reward model without re-running the full pipeline.

**When to choose DPO:** When preference data is collected in batches, you want simplicity and stability, and you don't need an independent reward signal.

---

## Activity Solutions

### Activity 2: Hallucination Test — Expected Findings

**Common patterns students should identify:**
- LLMs are most confident on well-represented topics (major historical events, famous scientists, established laws)
- Hallucination risk is highest for: (1) specific numbers/statistics, (2) citations and attribution, (3) events after training cutoff, (4) obscure or niche topics
- Models often *sound* more confident when they're less accurate, because they're generating text that sounds authoritative about a topic — a kind of linguistic "bluff"
- Asking the model to verify its own answers frequently produces false confirmation — the model generates plausible verification text

**Strong student observation:** "The model added specific details (a specific date, a specific court) when I asked for obscure legal precedents. The more specific the detail, the more likely it was wrong — as if specificity were a signal of reliability when it's actually the opposite."

**Connection to chapter content:** This illustrates why token probability distributions and calibration metrics matter. The model's internal uncertainty isn't reflected in its output style.

---

### Activity 3: Legal Chatbot Design — Sample Strong Deliverable

**Decision flowchart — three tiers:**

```
INCOMING QUERY
     ↓
[Category classifier]
     ↓
├── Definitional/procedural (What is X in law?)
│     → Answer directly with disclaimer footer
│     → Example: "Habeas corpus is a legal action requiring a person under arrest..."
│     → Footer: "For advice about your specific situation, please consult an attorney."
│
├── State/jurisdiction-specific (What are California's rules for X?)
│     → Answer with jurisdiction caveat
│     → Example: "Generally in California, [answer]. However, laws change and your situation..."
│     → CTA: [Schedule consultation] button
│
└── Case-specific or high-stakes (Can I sue my employer? What should I do about X?)
      → Soft refusal with escalation
      → Example: "This is the kind of question that really depends on the specifics of your situation.
          I can share general information about [topic], but I'd strongly recommend speaking with
          an attorney who can review the details. Would you like to schedule a free consultation?"
      → Never: generate specific legal advice
```

**Sample responses:**

*Query 1 (procedural):* "An uncontested divorce in California generally involves: filing a petition for dissolution, serving your spouse, waiting the mandatory 6-month period, and submitting a final judgment. Since no court hearing is required in most uncontested cases, the total time is typically 6–12 months. [Disclaimer footer]"

*Query 2 (high-stakes):* "I hear you — that sounds like a really difficult situation. I'm not the right resource for advice on something this serious. What you've described — threats involving your children — is exactly the kind of situation where you need to talk to an attorney right away. Would you like help finding a family law attorney in your area, including options for low-cost or free legal aid?"

*Query 3 (high-stakes):* "Alimony eligibility depends on many factors — length of marriage, financial circumstances, state law, and yes, sometimes conduct. Rather than giving you a general answer that might not apply to your situation, I'd recommend talking to a family law attorney who can review your specific circumstances. [Escalation button]"

---

## "Try This" Exercise — Sample Strong Student Responses

**Assignment:** Use an AI assistant for something that matters; ask it to express its confidence; verify the answer.

**Sample A-grade response:**

"I asked Claude about medication interactions for two common drugs I'm taking. The AI gave a detailed, confident-sounding answer. When I asked it to rate its confidence (1–10), it said '8/10.' When I verified against an authoritative pharmacological database, the interaction it described was partially correct but missed a clinically significant caveat about timing.

What struck me: the AI's confidence was verbal — it used phrases like 'it's well established that' — rather than numerical or calibrated. There was no signal in the output that would tell me where the reliable part ended and the gap-filling began.

For this query, I'd rate the five dimensions:
- Uncertainty Detection: 2/5 — It didn't know it was missing something
- Intervention Design: 2/5 — No escalation to 'consult a pharmacist'
- Timing: N/A
- Stakes Calibration: 2/5 — It treated a medical interaction question like a general knowledge question
- Feedback Integration: N/A from my interaction

The lesson: AI assistants feel like authorities but behave like confident amateurs. The fluent prose gives no signal about reliability. I now default to verifying any health, legal, or financial AI response against a specialist source."

---

## Assessment Solution Keys

### Case Analysis Paper — Sample A-Grade Response (Mata v. Avianca)

**Opening:** The Mata v. Avianca case is a study in how the five-dimension framework can predict and explain AI failures. The system that produced fabricated legal citations failed on every dimension, but the failures were not independent — they formed a cascade.

**Uncertainty Detection failure:** Language models produce probability distributions over tokens, not factual confidence estimates. When generating "Martinez v. Delta Air Lines, 2019, holding that..." the model was predicting likely token continuations given a legal-sounding prompt — it had no mechanism to distinguish a real case from a plausible-sounding pattern. Its internal probability distribution over tokens might have been moderately high (producing fluent text) even as the factual content was entirely fabricated. The model should have been trained to recognize queries for specific legal citations as high-uncertainty territory.

**Intervention Design failure:** The system had no escalation path for high-stakes legal queries. A well-designed system would have categorically handled legal citation requests differently: either refusing to generate specific citations, or generating them with prominent warnings requiring independent verification. The absence of any such mechanism reflects either poor training data curation (no examples of appropriate legal-context hedging) or insufficient stakes calibration during fine-tuning.

**Stakes Calibration failure:** The model was calibrated for general helpfulness, not for the specific stakes of legal practice. A citation that is wrong in a history essay is embarrassing; a citation that is wrong in a federal court filing carries sanctions, malpractice risk, and professional consequences. The model made no distinction between these.

**Proposed redesign:** A legal assistant AI should include: (1) categorical identification of citation-generating queries; (2) mandatory retrieval verification — the model should not generate a citation it cannot verify against a legal database; (3) prominent uncertainty communication: "I can discuss legal principles in this area, but I cannot reliably generate specific case citations without verified retrieval capability. Please use Westlaw or LexisNexis for specific case research"; (4) human escalation: any request involving specific case law for actual legal filings should route to a human researcher.

**Grade criteria for A:** Accurately explains why the model hallucinated (statistical text prediction, not factual retrieval); correctly applies all five dimensions with specific evidence; proposes a technically feasible, practically grounded redesign; demonstrates understanding of why retrieval-augmented generation partially but not completely solves the problem.

---

*This solutions guide provides instructors with technically accurate model answers, grade-differentiated criteria, and common error patterns to watch for in student work.*
