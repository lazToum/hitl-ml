# Chapter 10 Technical Appendix: The Mathematics of Language Models

*Token probabilities, attention mechanics, and the formal architecture of human-AI alignment*

---

## A.10.1 Token Probability Distributions and Sampling

Language models don't generate words — they generate **tokens**. A token is a sub-word unit: roughly, a word or a common fragment of a word. The word "unbelievable" might become the tokens ["un", "believ", "able"]. "ChatGPT" might be a single token. The exact tokenization depends on the algorithm (most modern LLMs use Byte Pair Encoding, or BPE).

At each step, a language model produces a **probability distribution over the entire vocabulary** — a number between 0 and 1 for every token in the vocabulary (typically 32,000–100,000 tokens), representing how likely that token is given everything that came before.

Formally, given a sequence of previous tokens $x_1, x_2, \ldots, x_t$, the model produces:

$$P(x_{t+1} \mid x_1, x_2, \ldots, x_t) = \text{softmax}(\mathbf{W}_o \cdot \mathbf{h}_t)$$

where $\mathbf{h}_t$ is the final hidden-state vector after processing the input sequence, and $\mathbf{W}_o$ is the output projection matrix. The softmax function ensures the outputs sum to 1 and are all positive:

$$\text{softmax}(z_i) = \frac{e^{z_i}}{\sum_j e^{z_j}}$$

### Sampling Strategies

Given this distribution, how does the model choose the next token?

**Greedy decoding** always picks the highest-probability token. This produces deterministic output but often results in flat, repetitive text.

**Temperature sampling** divides the logits (pre-softmax values) by a temperature parameter $T$ before applying softmax:

$$P_T(x_{t+1}) = \text{softmax}\!\left(\frac{\mathbf{z}}{T}\right)$$

- $T = 1.0$: original distribution
- $T < 1.0$ (e.g., 0.2): distribution is "sharpened" — high-probability tokens become even more likely; more conservative, less creative output
- $T > 1.0$ (e.g., 1.5): distribution is "flattened" — lower-probability tokens get more chances; more creative but potentially more erratic output

**Top-$k$ sampling** restricts sampling to the $k$ most likely tokens and renormalizes:

$$P_k(x_{t+1} \mid x_{t+1} \in \text{Top}_k) = \frac{P(x_{t+1})}{\sum_{x \in \text{Top}_k} P(x)}$$

**Top-$p$ (nucleus) sampling** selects the smallest set of tokens whose cumulative probability exceeds threshold $p$:

$$\mathcal{N}_p = \min S \subseteq V \text{ such that } \sum_{x \in S} P(x) \geq p$$

This adapts dynamically: when the distribution is peaked (the model is confident), the nucleus is small; when the distribution is flat (the model is uncertain), the nucleus is large.

### Why This Matters for Hallucination

A model's hallucination tendency is partly a sampling artifact. When the model is genuinely uncertain — the correct token has, say, 15% probability and the second-best token has 12% — temperature and sampling parameters determine whether this uncertainty is amplified or suppressed. High-temperature sampling in uncertain regions can produce fluent but wrong text. The model has no internal mechanism to say "I'm sampling from a very flat distribution here; my output should be hedged."

This is why calibration research matters: we want the entropy of the model's distribution to correlate with actual error rate.

---

## A.10.2 The Attention Mechanism: Formal Treatment

The transformer's core innovation is the **scaled dot-product attention** mechanism:

$$\text{Attention}(Q, K, V) = \text{softmax}\!\left(\frac{QK^\top}{\sqrt{d_k}}\right) V$$

where:
- $Q \in \mathbb{R}^{n \times d_k}$ is the **query** matrix (what we're looking for)
- $K \in \mathbb{R}^{m \times d_k}$ is the **key** matrix (what's available to be looked up)
- $V \in \mathbb{R}^{m \times d_v}$ is the **value** matrix (what gets returned)
- $n$ is the number of query positions, $m$ is the number of key/value positions
- $d_k$ is the dimension of keys and queries (the scaling factor $\sqrt{d_k}$ prevents dot products from growing too large in magnitude, which would push softmax into saturation)

In **self-attention** (the core mechanism in transformers), queries, keys, and values are all derived from the same input sequence. For an input sequence $X \in \mathbb{R}^{n \times d_{\text{model}}}$:

$$Q = X W_Q, \quad K = X W_K, \quad V = X W_V$$

where $W_Q, W_K, W_V \in \mathbb{R}^{d_{\text{model}} \times d_k}$ are learned projection matrices.

The softmax in $\text{softmax}(QK^\top / \sqrt{d_k})$ produces an **attention weight matrix** $A \in \mathbb{R}^{n \times m}$, where $A_{ij}$ represents how much position $i$ in the output "attends to" position $j$ in the input. Large $A_{ij}$ means position $j$ strongly influences the representation of position $i$.

### Multi-Head Attention

A single attention operation captures one kind of relationship. **Multi-head attention** runs $h$ attention operations in parallel, each with different learned projections, then concatenates the results:

$$\text{MultiHead}(Q, K, V) = \text{Concat}(\text{head}_1, \ldots, \text{head}_h) W_O$$

$$\text{head}_i = \text{Attention}(Q W_{Q_i},\, K W_{K_i},\, V W_{V_i})$$

Different heads learn to track different relationships: one head might learn coreference resolution (tracking what pronouns refer to), another might track syntactic dependencies, another semantic roles. The combination captures language structure at multiple levels simultaneously.

### Transformer Layer

Each transformer layer combines multi-head attention with a position-wise feed-forward network and layer normalization:

$$\mathbf{h}' = \text{LayerNorm}(\mathbf{x} + \text{MultiHead}(\mathbf{x}))$$
$$\mathbf{h}'' = \text{LayerNorm}(\mathbf{h}' + \text{FFN}(\mathbf{h}'))$$

where $\text{FFN}(\mathbf{x}) = \max(0, \mathbf{x}W_1 + b_1)W_2 + b_2$ is a two-layer MLP with ReLU activation.

Modern LLMs stack dozens to hundreds of such layers. GPT-4 reportedly uses around 120 transformer layers. Claude 3 Opus uses a comparable scale. The deepest layers capture the most abstract semantic properties; the lower layers capture surface-level syntactic patterns.

---

## A.10.3 RLHF Pipeline: Formal Treatment

**Reinforcement Learning from Human Feedback (RLHF)** involves three training stages.

### Stage 1: Supervised Fine-Tuning (SFT)

Starting from a pretrained language model $\pi_{\text{PT}}$, collect a dataset of prompts $x$ with high-quality human-written responses $y^*$, and fine-tune:

$$\mathcal{L}_{\text{SFT}} = -\mathbb{E}_{(x, y^*) \sim \mathcal{D}_{\text{SFT}}} \left[\log \pi_\theta(y^* \mid x)\right]$$

This gives a supervised fine-tuned model $\pi_{\text{SFT}}$ that follows instructions but may still produce harmful or unhelpful outputs.

### Stage 2: Reward Model Training

Collect a preference dataset: for each prompt $x$, generate multiple model outputs $y_1, y_2, \ldots$, show pairs $(y_i, y_j)$ to human raters, and collect judgments $y_w \succ y_l$ (winner preferred over loser).

Train a reward model $r_\phi(x, y) \in \mathbb{R}$ using the **Bradley-Terry** pairwise preference model:

$$P(y_w \succ y_l) = \sigma(r_\phi(x, y_w) - r_\phi(x, y_l))$$

The reward model is trained by minimizing the negative log-likelihood of human preferences:

$$\mathcal{L}_{\text{RM}} = -\mathbb{E}_{(x, y_w, y_l) \sim \mathcal{D}_{\text{pref}}} \left[\log \sigma(r_\phi(x, y_w) - r_\phi(x, y_l))\right]$$

### Stage 3: RL Fine-Tuning

Use the reward model as a reward signal to fine-tune $\pi_{\text{SFT}}$ via **Proximal Policy Optimization (PPO)**:

$$\max_\theta \mathbb{E}_{x \sim \mathcal{D},\, y \sim \pi_\theta(\cdot \mid x)} \left[r_\phi(x, y)\right] - \beta \cdot \text{KL}\!\left[\pi_\theta(\cdot \mid x) \,\|\, \pi_{\text{SFT}}(\cdot \mid x)\right]$$

The KL divergence term $\beta \cdot \text{KL}[\pi_\theta \| \pi_{\text{SFT}}]$ is a crucial regularizer. It penalizes the fine-tuned model for drifting too far from the SFT baseline, preventing the model from exploiting the reward model in degenerate ways (e.g., generating gibberish that scores highly due to reward model overfitting).

The PPO update iteratively computes:

$$\mathcal{L}_{\text{PPO}} = \mathbb{E}_t\left[\min\!\left(r_t(\theta)\hat{A}_t,\; \text{clip}(r_t(\theta), 1-\epsilon, 1+\epsilon)\hat{A}_t\right)\right]$$

where $r_t(\theta) = \pi_\theta(y_t \mid x, y_{<t}) / \pi_{\text{old}}(y_t \mid x, y_{<t})$ is the probability ratio and $\hat{A}_t$ is the estimated advantage (how much better this action was than expected).

---

## A.10.4 Direct Preference Optimization (DPO)

DPO (Rafailov et al., 2023) achieves the same goal as RLHF without training a separate reward model.

The key insight is that the RLHF objective has a closed-form optimal solution. The optimal policy $\pi^*$ under the KL-constrained reward maximization satisfies:

$$\pi^*(y \mid x) = \frac{1}{Z(x)} \pi_{\text{ref}}(y \mid x) \exp\!\left(\frac{r(x,y)}{\beta}\right)$$

where $Z(x) = \sum_y \pi_{\text{ref}}(y \mid x) \exp(r(x,y)/\beta)$ is a normalizing constant.

Inverting this, the reward can be expressed in terms of the optimal policy:

$$r(x, y) = \beta \log \frac{\pi^*(y \mid x)}{\pi_{\text{ref}}(y \mid x)} + \beta \log Z(x)$$

Substituting into the Bradley-Terry preference probability and noting that $\log Z(x)$ cancels:

$$P(y_w \succ y_l \mid x) = \sigma\!\left(\beta \log \frac{\pi_\theta(y_w \mid x)}{\pi_{\text{ref}}(y_w \mid x)} - \beta \log \frac{\pi_\theta(y_l \mid x)}{\pi_{\text{ref}}(y_l \mid x)}\right)$$

The DPO loss directly optimizes this:

$$\mathcal{L}_{\text{DPO}} = -\mathbb{E}_{(x, y_w, y_l)}\!\left[\log \sigma\!\left(\beta \log \frac{\pi_\theta(y_w \mid x)}{\pi_{\text{ref}}(y_w \mid x)} - \beta \log \frac{\pi_\theta(y_l \mid x)}{\pi_{\text{ref}}(y_l \mid x)}\right)\right]$$

**Gradient interpretation:** The DPO gradient increases $\pi_\theta(y_w \mid x)$ and decreases $\pi_\theta(y_l \mid x)$, weighted by how much the current model disagrees with the preference (a kind of implicit hard negative mining). The reference model $\pi_{\text{ref}}$ keeps the optimization anchored, preventing degenerate solutions.

**Practical advantages over RLHF:**
- No separate reward model training, storage, and inference pipeline
- No RL optimization loop (which can be unstable)
- Single forward + backward pass, similar to standard fine-tuning
- Less prone to reward hacking (no reward model to overfit)

**Limitation:** DPO assumes preferences are well-captured by the Bradley-Terry model, which may not hold when preferences are inconsistent or multi-dimensional.

---

## A.10.5 Constitutional AI: Two-Phase Process

**Constitutional AI (CAI)** (Bai et al., 2022) from Anthropic reduces dependence on human-labeled comparisons by using AI feedback guided by a written constitution.

### Phase 1: Supervised Learning from AI Feedback (SL-CAF)

**Step 1: Generate potentially harmful outputs.** Sample outputs $y$ from the initial model $\pi_0$ for a set of "red-team" prompts $x$ designed to elicit harmful responses.

**Step 2: Critique.** For each output, prompt the model to critique it according to a constitutional principle $c_i$ (e.g., "Identify specific ways in which the assistant's last response is harmful, unethical, racist, sexist, toxic, dangerous, or illegal"):

$$\text{critique} = \pi_0(x, y, c_i)$$

**Step 3: Revise.** Prompt the model to revise the output based on the critique:

$$y' = \pi_0(x, y, \text{critique})$$

This critique-revision loop can be applied multiple times. The final revised output $y'$ is typically less harmful than $y$.

**Step 4: Fine-tune.** Fine-tune $\pi_0$ on $(x, y')$ pairs to get $\pi_{\text{SL-CAF}}$, a model that has been steered by self-critique.

### Phase 2: Reinforcement Learning from AI Feedback (RLAIF)

**Step 1: Generate preference pairs.** For each prompt, sample two outputs from $\pi_{\text{SL-CAF}}$.

**Step 2: AI preference labeling.** Present each pair to $\pi_{\text{SL-CAF}}$ (or a more capable model) along with a constitutional principle, and ask which response better satisfies the principle:

$$P_{\text{AI}}(y_w \succ y_l \mid x) = \pi_{\text{SL-CAF}}(\text{"response A"} \mid x, y_1, y_2, c_i)$$

**Step 3: Train reward model.** Train $r_\phi$ on these AI-generated preference labels using the same Bradley-Terry objective as RLHF.

**Step 4: RL fine-tuning.** Fine-tune $\pi_{\text{SL-CAF}}$ using PPO against $r_\phi$, exactly as in RLHF.

**Key insight:** The human contribution has been moved upstream — to the design of the constitution — rather than being distributed across millions of individual preference judgments. This dramatically scales the HITL signal while concentrating human expertise where it matters most: defining what values the system should embody.

**Limitation:** The quality of CAI depends entirely on the quality of the constitution. A poorly designed constitution — one that's internally inconsistent, incomplete, or that encodes biased values — will produce a model that reflects those flaws at scale.

---

## A.10.6 Calibration Metrics for Language Models

A model is **calibrated** if its expressed confidence matches its empirical accuracy. For classification outputs (e.g., a model outputting "yes" or "no"), the canonical measure is **Expected Calibration Error (ECE)**:

$$\text{ECE} = \sum_{b=1}^{B} \frac{|B_b|}{n} \left|\text{acc}(B_b) - \text{conf}(B_b)\right|$$

where predictions are grouped into $B$ bins by confidence level, $|B_b|$ is the number of predictions in bin $b$, $\text{acc}(B_b)$ is the fraction of correct predictions in that bin, and $\text{conf}(B_b)$ is the mean confidence in that bin.

For generative language models, calibration is harder to measure because outputs are sequences, not class probabilities. Active research areas include:

- **Verbalized calibration:** Asking the model to state its confidence in percentage terms and measuring ECE on those verbalized estimates
- **Token-level probability calibration:** Measuring whether the probability assigned to the correct completion correlates with actual correctness frequency
- **Semantic calibration:** Measuring calibration at the level of factual claims, not individual tokens

Research consistently shows that large language models are overconfident — their verbalized confidence ("I'm quite certain that...") significantly exceeds their actual accuracy on factual queries, particularly in specialized domains like law, medicine, and science.

---

*These technical foundations underpin the practical HITL design questions in the main chapter: when to trust a language model's outputs, when to require human verification, and how to build systems that communicate their limitations honestly.*
