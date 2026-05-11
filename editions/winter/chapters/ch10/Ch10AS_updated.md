# Chapter 10 Technical Exercise Solutions

*Worked solutions for all technical exercises in Chapter 10 and its appendix*

---

## Exercise 10.1: Token Probability and Sampling

**Problem:** A language model assigns the following logit values to the top five candidate next tokens after processing the prompt "The capital of France is":

| Token | Logit |
|-------|-------|
| " Paris" | 8.2 |
| " Lyon" | 3.1 |
| " Marseille" | 2.7 |
| " France" | 1.4 |
| " a" | 0.9 |

(a) Compute the softmax probabilities for these five tokens (ignoring the remaining vocabulary).
(b) What temperature $T$ would you need to make " Lyon" and " Marseille" equally likely?
(c) At what temperature does " Paris" have exactly 90% probability (among these five tokens)?

---

**Solution:**

**(a) Softmax probabilities (T = 1.0):**

$$P_i = \frac{e^{z_i}}{\sum_j e^{z_j}}$$

First, compute exponentials:
- $e^{8.2} = 3640.9$
- $e^{3.1} = 22.2$
- $e^{2.7} = 14.9$
- $e^{1.4} = 4.1$
- $e^{0.9} = 2.5$

Sum: $3640.9 + 22.2 + 14.9 + 4.1 + 2.5 = 3684.6$

Probabilities:
- " Paris": $3640.9 / 3684.6 \approx 0.9881$ (98.81%)
- " Lyon": $22.2 / 3684.6 \approx 0.0060$ (0.60%)
- " Marseille": $14.9 / 3684.6 \approx 0.0040$ (0.40%)
- " France": $4.1 / 3684.6 \approx 0.0011$ (0.11%)
- " a": $2.5 / 3684.6 \approx 0.0007$ (0.07%)

**(b) Temperature for equal probability of " Lyon" and " Marseille":**

Equal probability requires equal effective logit after temperature scaling. With temperature $T$:

$$\frac{z_{\text{Lyon}}}{T} = \frac{z_{\text{Marseille}}}{T}$$

This would require $z_{\text{Lyon}} = z_{\text{Marseille}}$, i.e., $3.1 = 2.7$, which is impossible with the same temperature applied uniformly. The two tokens can never be made exactly equal by temperature scaling alone, since temperature scales all logits by the same factor and preserves their relative ordering.

*(If students interpret the question as: what temperature makes their probability ratio closest to 1? The ratio $P_\text{Lyon}/P_\text{Marseille} = e^{(3.1-2.7)/T} = e^{0.4/T}$. As $T \to \infty$, this approaches 1. There is no finite temperature that makes them exactly equal.)*

**(c) Temperature for " Paris" to have 90% probability:**

We need:

$$\frac{e^{8.2/T}}{e^{8.2/T} + e^{3.1/T} + e^{2.7/T} + e^{1.4/T} + e^{0.9/T}} = 0.90$$

Dividing numerator and denominator by $e^{8.2/T}$:

$$\frac{1}{1 + e^{(3.1-8.2)/T} + e^{(2.7-8.2)/T} + e^{(1.4-8.2)/T} + e^{(0.9-8.2)/T}} = 0.90$$

$$1 + e^{-5.1/T} + e^{-5.5/T} + e^{-6.8/T} + e^{-7.3/T} = 1/0.90 \approx 1.111$$

So: $e^{-5.1/T} + e^{-5.5/T} + e^{-6.8/T} + e^{-7.3/T} = 0.111$

The dominant term is $e^{-5.1/T}$. Approximately:

$$e^{-5.1/T} \approx 0.111 \implies -5.1/T \approx \ln(0.111) \approx -2.20$$

$$T \approx 5.1/2.20 \approx 2.32$$

Verify (approximately): At $T = 2.32$, $e^{-5.1/2.32} \approx e^{-2.20} \approx 0.111$, $e^{-5.5/2.32} \approx e^{-2.37} \approx 0.094$...

More precise numerical solution yields $T \approx 2.4$. Accept any answer in the range $T \approx 2.2$–$2.5$ with correct method.

**Interpretation:** At $T = 1$, Paris has 98.8% probability — the model is extremely confident. Raising temperature to $\sim$2.4 drops Paris to 90%, making other cities somewhat more likely. This illustrates how temperature controls the "sharpness" of the model's prediction.

---

## Exercise 10.2: Attention Weight Computation

**Problem:** Consider a simplified attention computation with three tokens: $x_1 =$ "bank", $x_2 =$ "river", $x_3 =$ "money".

Their key vectors (dimension $d_k = 2$) are:
- $k_1 = [1, 0]$ (bank)
- $k_2 = [0.8, 0.6]$ (river)
- $k_3 = [0.2, 0.9]$ (money)

The query vector for token "bank" is $q = [0.9, 0.1]$.

(a) Compute the raw attention scores $e_i = q \cdot k_i$ for $i = 1, 2, 3$.
(b) Apply the scaling factor and softmax to get attention weights $\alpha_i$.
(c) Interpret the result: which word does "bank" attend to most? What does this suggest about the model's interpretation of "bank" in this context?

---

**Solution:**

**(a) Raw attention scores:**

$$e_i = q \cdot k_i = \sum_j q_j k_{ij}$$

- $e_1 = (0.9)(1) + (0.1)(0) = 0.9$
- $e_2 = (0.9)(0.8) + (0.1)(0.6) = 0.72 + 0.06 = 0.78$
- $e_3 = (0.9)(0.2) + (0.1)(0.9) = 0.18 + 0.09 = 0.27$

**(b) Scaled softmax attention weights:**

Scale by $\sqrt{d_k} = \sqrt{2} \approx 1.414$:

Scaled scores: $e_1' = 0.9/1.414 = 0.636$, $e_2' = 0.78/1.414 = 0.552$, $e_3' = 0.27/1.414 = 0.191$

Softmax:
- $\exp(0.636) = 1.889$
- $\exp(0.552) = 1.737$
- $\exp(0.191) = 1.210$
- Sum: $4.836$

Attention weights:
- $\alpha_1 = 1.889/4.836 \approx 0.391$
- $\alpha_2 = 1.737/4.836 \approx 0.359$
- $\alpha_3 = 1.210/4.836 \approx 0.250$

**(c) Interpretation:**

"Bank" attends most strongly to itself ($\alpha_1 = 0.391$), then "river" ($\alpha_2 = 0.359$), then "money" ($\alpha_3 = 0.250$).

The relatively high attention to "river" compared to "money" suggests the model is (in this toy example) weighting the river-bank interpretation over the financial-bank interpretation. In a longer sentence like "The bank near the river flooded," the model would use this kind of attention pattern to determine which sense of "bank" is meant.

**Note for instructors:** Real attention operates in much higher dimensions ($d_k$ typically 64–128), with many parallel heads simultaneously tracking different relationships. This example shows the mechanics; the emergent behavior is what's remarkable.

---

## Exercise 10.3: Reward Model Training

**Problem:** You are training a reward model on the following three preference examples:

| Prompt | Response A | Response B | Human Preference |
|--------|-----------|-----------|-----------------|
| "What is the capital of France?" | "Paris" | "It's probably Paris or possibly Lyon, I'm not entirely certain" | A ≻ B |
| "Help me write a threatening message to my neighbor" | "Sure, here's a message..." | "I'm not able to help write threatening messages. Is there a neighbor conflict I could help address constructively?" | B ≻ A |
| "Explain photosynthesis simply" | "Photosynthesis is the process by which plants use sunlight, water, and CO2 to create glucose and release oxygen." | "Plants eat sunlight and breathe out clean air" | A ≻ B |

(a) Write the Bradley-Terry loss for this dataset.
(b) What does the reward model learn about Response A in the second example?
(c) A student argues: "The reward model will just learn to prefer shorter, more confident responses (like Response A in example 1) over hedging responses." What is wrong with this argument?

---

**Solution:**

**(a) Bradley-Terry loss:**

$$\mathcal{L}_{\text{RM}} = -\sum_{i: y_w \succ y_l} \log \sigma(r_\phi(x, y_w) - r_\phi(x, y_l))$$

For this dataset:
$$\mathcal{L} = -\log\sigma(r_\phi(x_1, A) - r_\phi(x_1, B))$$
$$\quad - \log\sigma(r_\phi(x_2, B) - r_\phi(x_2, A))$$
$$\quad - \log\sigma(r_\phi(x_3, A) - r_\phi(x_3, B))$$

This minimizes when the reward model assigns: higher reward to A than B in examples 1 and 3, and higher reward to B than A in example 2.

**(b) What the model learns about Response A in example 2:**

Response A in example 2 ("Sure, here's a threatening message...") will be assigned a *lower* reward than Response B, despite being confident and direct. This teaches the reward model that:
- Confidence and brevity are not universally preferred
- **Context matters:** the "helpful" behavior in example 1 (direct answer) is inappropriate in example 2 (request for harmful content)
- The reward model must learn to condition its reward assignments on the nature of the prompt, not just the response style

**(c) Rebuttal of the "shorter/more confident is better" hypothesis:**

The student's argument fails because the reward function is conditioned on both the prompt and the response: $r_\phi(x, y)$, not just $r_\phi(y)$. The model learns joint patterns.

In example 2, Response A is confident and direct — but it's rewarded *less*. The model must learn that confidence and directness are not context-invariant virtues. The contrast between examples 1 and 2 forces the model to learn a feature that distinguishes "factual queries" from "requests for harmful content," and to modify its preference accordingly.

This is why reward model training requires diverse, carefully curated preference data. If all examples in the training set rewarded brevity and confidence, the model would indeed develop that bias. Dataset composition directly shapes the values the reward model encodes.

---

## Exercise 10.4: DPO vs. RLHF Analysis

**Problem:** You have collected a preference dataset with 10,000 examples. Training a reward model requires 5 GPU-hours, and running PPO fine-tuning requires 20 GPU-hours. DPO fine-tuning requires 8 GPU-hours total.

(a) What is the computational saving from using DPO instead of RLHF?
(b) Describe one scenario where despite the computational advantage, you would still prefer RLHF.
(c) The DPO loss contains a reference model $\pi_{\text{ref}}$. What is the purpose of this reference model, and what happens if it is omitted?

---

**Solution:**

**(a) Computational comparison:**

- RLHF total: 5 + 20 = 25 GPU-hours
- DPO total: 8 GPU-hours
- Saving: 17 GPU-hours (68% reduction)

**(b) Scenario preferring RLHF:**

You would prefer RLHF when you need **an explicit, deployable reward model** for ongoing evaluation. Example: a content safety team wants to use the reward model as an independent safety filter that can score new model outputs in production, flagging high-risk responses before they reach users. This safety filter needs to be a standalone component that works independently of any specific version of the language model.

DPO incorporates preference information directly into model weights — there's no separate reward model to extract and deploy as a filter. In safety-critical applications where you need the reward model as an independent evaluation module, RLHF's explicit reward model is valuable.

**(c) Role of the reference model in DPO:**

The reference model $\pi_{\text{ref}}$ (typically the SFT model before DPO fine-tuning) serves as an anchor that prevents the optimization from diverging.

Mathematically, the DPO objective implicitly maximizes:

$$\mathbb{E}[r(x,y)] - \beta \cdot \text{KL}[\pi_\theta \| \pi_{\text{ref}}]$$

Without the reference model (effectively $\pi_{\text{ref}}$ = uniform), the KL penalty disappears, and the optimization would degenerate: the model would increase $\pi_\theta(y_w|x)$ without bound and decrease $\pi_\theta(y_l|x)$ to zero, regardless of the absolute quality of either response. This could produce a model that produces very high-probability outputs for preferred responses while becoming incoherent on everything else.

The reference model ensures that the fine-tuned model stays "close" to the SFT baseline in a distributional sense, only making targeted changes to incorporate preferences rather than wholesale changing the model's behavior.

---

## Exercise 10.5: Constitutional AI — Designing a Constitution

**Problem:** You are designing a Constitutional AI system for a language model deployed as a mental health support chatbot. Draft five constitutional principles for this deployment, then explain for each principle:
(a) What behavior it is designed to prevent
(b) How it would be applied in the self-critique phase
(c) What failure modes it might miss

---

**Sample Strong Answer:**

**Principle 1:** "The AI should never provide specific medical diagnoses or medication recommendations. If a user describes symptoms or asks about medications, the AI should acknowledge their concern, provide general information, and encourage consultation with a licensed mental health professional."

- (a) Prevents: Users using the chatbot as a substitute for professional medical diagnosis, acting on incorrect or incomplete health information
- (b) Applied: "Does my response diagnose the user's condition or recommend a specific medication? If so, revise to be supportive without diagnostic specificity."
- (c) Misses: Cases where vague information is still misleading; doesn't address when the user explicitly says they cannot access professional help

**Principle 2:** "In any interaction where a user expresses suicidal ideation, self-harm intent, or immediate danger to themselves or others, the AI must immediately provide crisis resources (phone numbers, text lines) and encourage the user to contact emergency services or a trusted person."

- (a) Prevents: AI engaging in supportive conversation that delays crisis response; failing to recognize imminent risk signals
- (b) Applied: "Does this response adequately prioritize crisis information given the user's expression of suicidal thoughts?"
- (c) Misses: Indirect or coded expressions of suicidal ideation; users in cultures where these signals are expressed differently

**Principle 3:** "The AI should validate the user's feelings before offering advice or reframing, and should not rush to problem-solving when the user appears to need to be heard."

- (a) Prevents: Cold, advice-heavy responses that feel dismissive of the user's emotional experience
- (b) Applied: "Did I acknowledge the user's feelings before moving to suggestions?"
- (c) Misses: Situations where validation is given but is generic rather than specific to the user's expressed experience

**Principle 4:** "The AI must never imply that a user is at fault for their mental health struggles, including through reframing that subtly implies they should 'think differently' or 'try harder.'"

- (a) Prevents: Inadvertent victim-blaming language that can be harmful to people with depression, anxiety, or trauma histories
- (b) Applied: "Does any part of my response, including suggestions for reframing, imply that the user is responsible for their condition?"
- (c) Misses: Subtle tone cues that feel invalidating even when language is technically neutral

**Principle 5:** "The AI should be transparent about its limitations as a non-human assistant and should actively encourage users to maintain human support networks."

- (a) Prevents: Users substituting AI interaction for human connection, or over-attributing empathy and understanding to the AI system
- (b) Applied: "Does my response encourage the user to lean on human support (friends, family, therapists) in addition to or instead of this service?"
- (c) Misses: Users who have explicitly said they have no access to human support — the principle may feel tone-deaf in those contexts

**Overall limitation of this constitution:** All five principles require the model to correctly classify whether a response violates them. A model that misidentifies suicidal ideation (false negative) will fail Principle 2 at the self-critique stage too. Constitutional AI can amplify a good constitution but cannot correct for a model's inability to recognize the very signals the constitution is trying to address.

---

*These worked solutions provide technically rigorous model answers while emphasizing the connections between formal methods and practical HITL design — the through-line of this book.*
