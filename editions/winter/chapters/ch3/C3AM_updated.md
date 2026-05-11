# Chapter 3 Solutions Guide: How Computers Learn (The Simple Version)

*Model answers for all discussion questions and activities*

---

## Discussion Question Solutions

### Introductory Level

#### Question 1: Personal Overfitting
**Prompt:** "Describe a time you 'overfitted' to a limited set of examples in your own life — drew a rule from too few cases that failed when you encountered something new."

**Model Answer (teacher guide):**

Strong answers should identify a real personal example and draw the correct parallel to machine learning. Accept any valid example that shows the key features: learning from a limited sample, inferring a rule or pattern, and that rule failing on a new case.

*Strong example:* "I learned to make coffee using my roommate's machine and assumed all coffee makers worked the same way. When I used a different machine for the first time, my rule failed — wrong ratios, wrong settings. I had overfitted to one machine's quirks."

*Connection to ML:* Like a model that learns "cats have blue backgrounds" from a non-representative training set, I learned "coffee takes exactly this much water" from a non-representative appliance. More exposure to diverse coffee machines (a richer training distribution) would have helped me generalize.

*Grade Band:*
- A: Accurate parallel, identifies the rule learned, what made the sample limited, how generalization failed
- B: Correct direction but loose analogy; may not identify the specific rule
- C: Relevant personal example but weak connection to ML concepts

#### Question 2: Spam Filter Distribution Shift
**Prompt:** "A spam filter trained on business email from 2018 — in what ways might emails from 2025 be different?"

**Model Answer:**

Strong answers identify multiple plausible types of change and categorize them by type of distribution shift:

**Covariate shift examples** (P(x) changes, P(y|x) stable):
- New platforms referenced (WhatsApp, TikTok, Discord) that didn't exist or were rare in 2018 data
- New slang and abbreviations
- More emoji and informal punctuation in business email
- New company names and product categories

**Concept drift examples** (P(y|x) changes):
- New phishing techniques crafted to mimic 2025 business communication styles
- AI-generated spam that doesn't match any 2018 templates
- New categories of spam (NFT/crypto scams, AI product spam) that the model has no concept of

**Vocabulary/domain shift:**
- New proper nouns (companies founded after 2018, new technologies)
- Language evolution — words whose meaning changed
- New regulatory language (GDPR, new compliance terms)

**Key HITL implication:** The filter should route its low-confidence cases to human review and monitor for signs of calibration drift (confidence scores stable but error rate rising).

#### Question 3: Test Set vs. Real World
**Prompt:** "Why is it not sufficient to just test a machine learning system on a test set before deploying it? What does the test set miss?"

**Model Answer:**

The test set is a controlled sample drawn from the same distribution as the training data. It is cleaned, labeled, and — crucially — from the same time and context as the training data.

**What the test set misses:**

1. **Temporal distribution shift:** The world changes after training. New events, new language, new attack patterns, new user behaviors appear in deployment that weren't in training or test.

2. **Population coverage:** Training and test sets typically reflect the most common users, inputs, and scenarios. Rare but real edge cases may be entirely absent.

3. **Adversarial adaptation:** Spam authors, fraudsters, and others actively adapt to evade detection. Test sets don't include adversarial inputs crafted after training.

4. **Deployment context differences:** Real users may interact differently with a system than annotators who created the test set. The test environment is cleaner and more controlled.

5. **Scale effects:** At deployment scale (millions of examples), rare failure modes become common.

**The core lesson:** Test performance establishes a ceiling for deployment performance, not a reliable prediction of it. Deployment performance is typically lower — sometimes dramatically so.

---

### Intermediate Level

#### Question 4: Medical AI in Kenya
**Prompt:** "A medical AI trained on five major U.S. hospitals is deployed in rural health clinics in Kenya. Identify three specific types of distribution shift and predict errors."

**Model Answer:**

*Distribution shift type 1: Demographic covariate shift*
- US academic medical centers serve a younger, more insured, more urban population
- Rural Kenyan clinics serve patients with very different baseline health profiles
- Predictions: AI may miscalibrate risk scores that depend on demographic baselines; may not recognize presentation patterns of diseases endemic to East Africa but rare in US

*Distribution shift type 2: Disease prevalence label shift*
- Diseases like malaria, typhoid, HIV-associated opportunistic infections have much higher base rates in rural Kenya
- A US-trained model may flag these as "unusual" and express low confidence, or worse, misclassify to more familiar conditions
- Predictions: Higher false negative rates on endemic diseases; potential for systematic misdiagnosis

*Distribution shift type 3: Equipment and imaging covariate shift*
- Rural clinics often use older, lower-resolution imaging equipment than U.S. academic medical centers
- AI trained on high-quality images may perform poorly on lower-quality inputs
- X-ray images from older equipment may not match the training distribution's image quality distribution
- Predictions: Systematic accuracy degradation on all image-based tasks; may express high confidence on poor-quality inputs if not calibrated for image quality

**HITL response:** Aggressive human-in-the-loop for all cases, particularly those with unfamiliar disease presentations. Rapid re-calibration using local labeled data. Community health worker review at minimum confidence thresholds.

#### Question 5: Overfitting Diagnosis
**Prompt:** "A model: 98% train, 87% test (same distribution). Then 72% deployment. Interpret."

**Model Answer:**

**Train vs. test gap (98% → 87%):**
- 11 percentage point drop from training to same-distribution test
- This is large for modern ML — suggests possible overfitting
- OR the training set was small enough that sampling variance explains some of it
- Conclusion: moderate overfitting likely; model is learning some noise from the training set

**Test vs. deployment gap (87% → 72%):**
- 15 percentage point drop from same-distribution test to deployment
- This is a very large deployment gap
- The test set is not representative of deployment — suggests significant distribution shift
- Possible causes: temporal shift, population shift, adversarial adaptation, context differences

**Full interpretation:**
- Both overfitting (train→test gap) and distribution shift (test→deployment gap) are present
- The deployment gap is larger than the overfitting gap, suggesting distribution shift is the dominant problem
- HITL priority: first address distribution shift (monitor deployment inputs, collect new labels from deployment distribution); then address overfitting (regularization, more training data)

#### Question 6: Overfitting and HITL Routing Failure
**Prompt:** "How does overfitting create a specific challenge for uncertainty-based HITL routing?"

**Model Answer:**

This is a sophisticated question that requires connecting the bias-variance framing to HITL calibration.

**The mechanism:**

An overfit model has learned statistical patterns that are specific to the training data's noise and idiosyncrasies. When it encounters a test or deployment example that matches these spurious patterns, it outputs a high-confidence prediction — even if the underlying truth is uncertain.

**The HITL routing consequence:**

HITL routing based on uncertainty works by sending low-confidence cases to human review. But an overfit model produces low-confidence outputs on genuinely familiar cases (that happen not to match the training noise) and high-confidence outputs on novel cases (that happen to match a spurious pattern learned from training noise).

The result: the routing system sends to human review the wrong set of cases. Cases the model is "confident" about (but is actually wrong about because it's following a spurious rule) fly through the autonomous channel. Cases the model is "uncertain" about (but would actually be fine) go to human review.

**Example:** An overfit spam filter learned that emails from a particular domain (blue background = cat, but for email) are "not spam." New phishing emails from that domain get routed as high-confidence "not spam" by the filter — no flag, no review, straight to inbox. This is the most dangerous scenario: high confidence + wrong answer + no routing trigger.

**Solution:** Calibration auditing is necessary in addition to uncertainty-based routing. Routinely sample high-confidence model outputs and verify them with human review to detect systematic overconfidence.

---

### Advanced Level

#### Question 7: HITL Value for High-Variance vs. High-Bias Models
**Prompt:** "Using the bias-variance decomposition, explain when HITL value is highest for high-variance vs. high-bias models."

**Model Answer:**

**High-variance model characteristics:**
- Low bias: captures complex patterns correctly on average
- High variance: predictions fluctuate significantly across different training samples
- Errors are *unpredictable in location* — they occur on unusual inputs without systematic pattern
- Calibration tends to be poor on novel inputs

**HITL value for high-variance models:**
High. The model makes errors in unpredictable places — it may be wrong on inputs that *look* like they should be in its competence zone but happen to fall near a decision boundary created by training noise. Uncertainty-based routing (low confidence) may not catch all these errors.

HITL design for high-variance: combine uncertainty routing (low confidence cases) with random sampling (spot-check high-confidence cases) to detect undetected systematic errors.

**High-bias model characteristics:**
- High bias: doesn't capture complex patterns; systematic underfitting
- Low variance: consistently wrong in the same predictable ways
- Errors are *systematic and predictable* — they occur on all instances of a certain type

**HITL value for high-bias models:**
Lower for case-by-case review; higher for systematic data collection. The model's errors are not random — it consistently fails on a category of input. Having humans review these cases produces uniform decisions ("yes, this is spam" 100 times in a row) that could have been captured by targeted data collection and retraining.

**Design implication:**
- High-variance: invest in HITL for real-time review of edge cases
- High-bias: invest in systematic data collection from the underperforming categories; HITL can identify which categories

---

## Activity Solutions

### Activity: Distribution Edge Map — Sample Strong Solution

**Scenario:** Content moderation AI trained on US/UK/AU English social media posts, 2019-2022.

| Edge Case Category | Specific Examples | Expected Errors |
|-------------------|-------------------|----------------|
| **Non-English content** | Spanish, Tagalog, Hindi posts | Will classify based on superficial English patterns; high error rate, possibly high false positive (flags innocuous foreign text) |
| **Post-2022 events** | New political conflicts, new public figures, new slang | No learned context; may classify political speech about new figures using old patterns |
| **Non-Western cultural context** | Religious celebrations that use language similar to threat language; cultural idioms | False positives on culturally specific expression; low confidence on genuinely ambiguous content |
| **Platform-specific new formats** | New emoji usages, new format conventions | Pattern mismatch with training distribution; erratic confidence |
| **Sophisticated coordinated behavior** | Influence operations using legitimate-looking accounts and language | Designed to evade the training distribution; high false negative rate |

**HITL implication:** Each of these categories represents a predictable distribution edge. A well-designed system should: (a) route all non-English content to human review, (b) monitor for sudden changes in model confidence patterns after news events, (c) maintain human review queues for content near classification boundaries.

### Activity: Overfit/Underfit Diagnosis — Solutions

**System A: 99% train, 98% test, 91% deployment**
- Train→test gap: 1% (very small — good generalization within distribution)
- Test→deployment gap: 7% (moderate)
- **Diagnosis:** Primarily deployment distribution shift. The model generalizes well within its training distribution but the deployment distribution differs from training. Not primarily overfitting.
- **HITL intervention:** Monitor for distribution drift; add human review for cases detected as distribution-shifted (OOD detection).

**System B: 77% train, 76% test, 73% deployment**
- Train→test gap: 1% (minimal — model is not overfitting)
- Test→deployment gap: 3% (small)
- Absolute accuracy is low across all sets
- **Diagnosis:** Primarily underfitting. The model is not capturing the patterns, even in training data. Distribution shift is minimal.
- **HITL intervention:** Human review for everything, but the bigger fix is model improvement — more training data, better architecture, better features. HITL masks the problem rather than fixing it.

**System C: 98% train, 71% test, 65% deployment**
- Train→test gap: 27% (very large — severe overfitting)
- Test→deployment gap: 6% (consistent with overfitting; model doesn't get much worse because it's already poor)
- **Diagnosis:** Primarily severe overfitting. The model memorized training data and fails to generalize.
- **HITL intervention:** Calibration auditing (the model may be overconfident on wrong predictions). More important: address the overfitting itself — regularization, more training data, simpler model.

### Activity: What Was the Training Data? — Sample Responses

**Autocorrect failing on "Nguyen":** Training data likely over-represents Western European names; Vietnamese names underrepresented. Solution: add diverse name corpora; or detect potential proper nouns and don't "correct" them.

**Translation failing on informal text:** Training data likely from formal parallel corpora (news, EU documents, books) that don't include social media register. Solution: training on Twitter/social media translations; or route informal text to human translation.

**Image classifier failing on dark skin tones:** Training data (e.g., ImageNet) historically skewed toward lighter skin tones. Solution: actively curated diverse training data; calibration auditing by demographic subgroup.
