# Chapter 3 Solutions Guide: How Computers Learn

*Model answers for discussion questions*

---

## Discussion Question Model Answers

### Introductory Level

**Q1: Personal overfitting example**

Strong answers draw a genuine analogy with a clear structural parallel to ML:
- "I learned that all exam questions about Chapter 3 would be multiple choice from previous years, so I didn't practice short answers. On the actual exam, the format had changed." (Overfit to training examples, failed on test set with different format)
- "I learned my friend was always late, so I stopped accounting for traffic. The one time I used that rule for a meeting with her boss, she was on time." (Overfit to a pattern that held in training but was actually noise)

Key element: the student should identify a rule inferred from limited examples that failed on a genuinely different case — not just any mistake, but a generalization failure.

**Q2: Spam filter trained on 2018 email**

Good answers identify specific, distinct types of change:
- New vocabulary/terminology (COVID, NFT, AI tools — none existed as email topics in 2018)
- New phishing techniques mimicking services that didn't exist (Venmo, Cash App, Zelle were less prevalent)
- New formatting conventions (email marketing styles, mobile-first formatting)
- New domain names (many legitimate businesses didn't exist in 2018)
- Shift in legitimate business communication norms (more casual, more emoji, shorter)

Each of these creates a different type of distribution edge case — some covariate shift, some concept drift.

**Q3: Why the test set is insufficient**

The test set is drawn from the same distribution as the training set (or a closely related one). Deployment introduces inputs that are:
- More diverse demographically or geographically
- More varied in format and quality
- More likely to include adversarial or unusual inputs
- More likely to include cases not represented in the original data collection

Additionally, test sets are often curated (cleaned, balanced) in ways deployment data is not.

Strong answers note: the test set measures "how well the model generalizes to examples similar to what it was trained on" — which is a necessary but not sufficient condition for deployment performance.

---

### Intermediate Level

**Q4: U.S. hospital AI deployed in Kenya**

Three specific shift types with predicted errors:

**Shift 1: Disease prevalence shift (label shift)**
- US training data: HIV/AIDS managed as chronic condition; TB at low prevalence
- Kenya deployment: different disease profiles, presentations at different stages
- Expected error: model undertriages conditions that are common in Kenya but rare in US training data

**Shift 2: Equipment and image quality shift (covariate shift)**
- US training: high-quality imaging from modern equipment
- Kenya deployment: older or different equipment; different imaging protocols
- Expected error: poor calibration on images that look "different" by training set standards; high uncertainty on all images

**Shift 3: Demographic covariate shift**
- US training: primarily on lighter-skinned patients (consistent with US hospital demographics)
- Kenya deployment: predominantly darker-skinned patients
- Expected error: known performance degradations in dermatology AI; may extend to general image analysis depending on what features the model learned

---

**Q5: 98/87/72 accuracy triples**

System A (99/98/91): Moderate deployment gap, minimal train/test gap. Suggests: model generalizes well within training distribution but faces deployment distribution shift. Probably a well-regularized model on deployment data that is somewhat different from test set. HITL design should focus on identifying which deployment cases are furthest from training distribution.

System B (77/76/73): Low accuracy throughout, small gaps. Suggests: underfitting — the model hasn't learned enough to discriminate well. Similar performance across splits because it learned so little that it generalizes well in a vacuous way. HITL would help with everything. Real fix is better model/more data.

System C (98/71/65): Large train/test gap + further deployment gap. Classic overfitting + distribution shift. Model memorized training data patterns that don't generalize. HITL should focus on the entire output space (the model is confidently wrong in unpredictable ways). Real fix: regularization + more training data + distribution-matched test set.

---

**Q6: Overfitting and uncertainty routing**

The core problem: an overfit model has learned spurious correlations that happen to hold in the training data. These correlations produce high-confidence predictions on inputs that match the spurious pattern — even when the underlying true class is different.

Example: if an overfit spam filter learned that emails from certain domains are always legitimate, it will confidently pass emails from those domains regardless of content. If the confidence threshold for human review is "below 70% confidence" — these legitimately-flagging-worthy emails will never be routed to humans because the model is very confident they're fine.

In other words: overfit models are confidently wrong in a correlated, non-random way. Uncertainty-based routing only catches cases where the model is uncertain. Confident errors — the most dangerous overfit failures — are never flagged.

This is why calibration auditing and random sampling of high-confidence cases are both important components of HITL design, beyond just uncertainty-based routing.

---

### Advanced Level

**Q7: Bias-variance and HITL value**

High-variance models have errors that are unpredictable and input-specific. These are the models that learn spurious correlations, overfit to training noise, and fail unexpectedly on novel inputs. Human review adds high value because:
- Human reviewers can often identify the correct answer on inputs the model fails (epistemic uncertainty)
- The failure mode is concentrated at novel inputs, which are exactly where human expertise is comparative advantage
- Human labels on uncertain cases fill the specific gaps in the high-variance model's training

High-bias models have systematic errors — they consistently miss certain patterns regardless of input. Human review adds less marginal value because:
- The errors are not random; they follow a pattern
- Adding more human-labeled examples won't fix the model's inability to learn the pattern (the problem is the model architecture/capacity, not the training data)
- The better intervention is model improvement or architectural change

**Practical implication:** Invest in HITL when you have a capable model with thin training coverage (high variance, epistemic uncertainty). Invest in data collection / model redesign when the model consistently fails on a category (high bias).

**Q8: PAC theory and rare categories**

PAC learning requires at least m ≈ (1/ε) log(1/δ) examples to achieve error rate ε. For rare categories (base rate p_rare << 1), even in a large dataset, the expected number of examples for the rare category is n × p_rare.

To achieve ε error on the rare category:
```
n × p_rare ≥ (1/ε) log(1/δ)
n ≥ (1 / (ε × p_rare)) × log(1/δ)
```

For p_rare = 0.01 and ε = 0.05, δ = 0.05:
```
n ≥ (1 / 0.0005) × 3 ≈ 6000
```

To get sufficient examples of a category representing 1% of the data, you need a dataset of at least 6,000 examples total. For a 0.1% category, you need 60,000.

This explains why rare-category HITL is particularly valuable: for categories that are genuinely rare in the wild, collecting sufficient training data through normal channels is practically impossible. Human reviewers who actively label uncertain cases on the rare category provide disproportionate training signal relative to the cost. Active learning strategies (discussed in Chapter 17) formalize this by directing human review toward the rare, uncertain cases where learning is most efficient.

---

## Grading Notes

**Grade Band A:** Student clearly distinguishes the three sources of generalization failure (overfitting, underfitting, distribution shift); correctly identifies the permanent nature of the distribution edge; provides specific, domain-appropriate examples; understands that uncertainty-based routing misses overfit confident errors.

**Grade Band B:** Student understands generalization gap conceptually; may conflate overfitting with poor generalization in general; examples are valid but generic; understands that HITL helps at distribution edges but doesn't specify the mechanism.

**Grade Band C:** Student understands that AI can fail on novel inputs; conflates test accuracy with deployment performance; intervention recommendations are generic ("add more human review") without specifying when or where.

---
