# Chapter 11 Technical Exercise Solutions

*Worked solutions for all technical exercises in Chapter 11 and its appendix*

---

## Exercise 11.1: Convolution Operation

**Problem:** Apply a 3×3 edge-detection filter to the following 4×4 grayscale image patch:

$$X = \begin{pmatrix} 10 & 10 & 10 & 10 \\ 10 & 10 & 10 & 10 \\ 200 & 200 & 200 & 200 \\ 200 & 200 & 200 & 200 \end{pmatrix}$$

using the horizontal edge filter (Sobel filter):

$$K = \begin{pmatrix} -1 & -2 & -1 \\ 0 & 0 & 0 \\ 1 & 2 & 1 \end{pmatrix}$$

(a) Compute the convolution output $Z$ (valid mode, no padding). What is the shape of $Z$?
(b) Where is the activation largest? What does this tell you about what the filter is detecting?
(c) Describe what the vertical Sobel filter would detect. Write it out and explain.

---

**Solution:**

**(a) Convolution output:**

Valid mode with 4×4 input and 3×3 filter: output shape is $(4-3+1) \times (4-3+1) = 2 \times 2$.

Compute $Z[i,j] = \sum_{m=0}^{2} \sum_{n=0}^{2} X[i+m, j+n] \cdot K[m,n]$:

**$Z[0,0]$:** (top-left 3×3 patch)
$$= (-1)(10) + (-2)(10) + (-1)(10) + (0)(10) + (0)(10) + (0)(10) + (1)(200) + (2)(200) + (1)(200)$$
$$= -10 - 20 - 10 + 0 + 0 + 0 + 200 + 400 + 200 = 760$$

**$Z[0,1]$:** (top 3×3 starting at column 1)
$$= (-1)(10) + (-2)(10) + (-1)(10) + (0)(10) + (0)(10) + (0)(10) + (1)(200) + (2)(200) + (1)(200)$$
$$= 760 \quad \text{(same values)}$$

**$Z[1,0]$:** (starting at row 1, column 0)
$$= (-1)(10) + (-2)(10) + (-1)(10) + (0)(200) + (0)(200) + (0)(200) + (1)(200) + (2)(200) + (1)(200)$$
$$= -10 - 20 - 10 + 0 + 0 + 0 + 200 + 400 + 200 = 760$$

**$Z[1,1]$:** (starting at row 1, column 1)
$$= 760 \quad \text{(same structure)}$$

$$Z = \begin{pmatrix} 760 & 760 \\ 760 & 760 \end{pmatrix}$$

**(b) Interpretation:**

All activations are equal and large (760), indicating the filter has detected a strong horizontal edge across the entire image — the transition from value 10 (top two rows) to value 200 (bottom two rows) is a horizontal intensity edge. The Sobel filter responds maximally to horizontal intensity transitions, which is exactly what this filter was designed to detect.

The large positive value indicates the edge goes from darker (top) to lighter (bottom). A negative value would indicate lighter to darker.

**(c) Vertical Sobel filter:**

$$K_{\text{vertical}} = \begin{pmatrix} -1 & 0 & 1 \\ -2 & 0 & 2 \\ -1 & 0 & 1 \end{pmatrix}$$

This filter detects vertical intensity transitions — edges that run vertically in the image (left-to-right intensity changes). Applied to our image $X$ (which has uniform values across columns in each row), the vertical Sobel filter would produce zero everywhere: there are no left-to-right intensity changes in this image, only top-to-bottom changes.

In a convolutional neural network's first layer, the learned filters include many variants of edge detectors at different orientations, not just horizontal and vertical — 45°, 135°, etc. Higher layers combine these edge detectors into increasingly complex patterns.

---

## Exercise 11.2: IoU Calculation

**Problem:** A tumor detection system produces the following bounding box for a chest CT slice:
- **Predicted box** $(B_p)$: upper-left $(100, 50)$, lower-right $(180, 120)$
- **Ground truth box** $(B_g)$: upper-left $(90, 45)$, lower-right $(170, 115)$

Coordinates are in pixels $(x, y)$ from the top-left of the image.

(a) Calculate the IoU between the predicted and ground truth boxes.
(b) Does this detection meet the commonly used IoU ≥ 0.5 threshold for a "correct detection"?
(c) A radiologist considers any detection with IoU ≥ 0.4 to be clinically useful (sufficient for her to identify the region and investigate further). Does this detection meet the clinical threshold?

---

**Solution:**

**(a) IoU calculation:**

**Intersection:**
$$x_{\text{inter,min}} = \max(100, 90) = 100$$
$$x_{\text{inter,max}} = \min(180, 170) = 170$$
$$y_{\text{inter,min}} = \max(50, 45) = 50$$
$$y_{\text{inter,max}} = \min(120, 115) = 115$$

$$w_{\text{inter}} = \max(0, 170 - 100) = 70$$
$$h_{\text{inter}} = \max(0, 115 - 50) = 65$$
$$\text{Area}_{\text{inter}} = 70 \times 65 = 4{,}550 \text{ px}^2$$

**Predicted box area:**
$$w_p = 180 - 100 = 80, \quad h_p = 120 - 50 = 70$$
$$\text{Area}_p = 80 \times 70 = 5{,}600 \text{ px}^2$$

**Ground truth box area:**
$$w_g = 170 - 90 = 80, \quad h_g = 115 - 45 = 70$$
$$\text{Area}_g = 80 \times 70 = 5{,}600 \text{ px}^2$$

**Union:**
$$\text{Area}_{\text{union}} = 5600 + 5600 - 4550 = 6{,}650 \text{ px}^2$$

**IoU:**
$$\text{IoU} = \frac{4550}{6650} \approx 0.684$$

**(b) Does it meet IoU ≥ 0.5?**

Yes — $\text{IoU} = 0.684 \geq 0.5$. This detection would be counted as a true positive at the standard threshold.

**(c) Does it meet the clinical threshold of IoU ≥ 0.4?**

Yes — $0.684 \geq 0.4$. The detection is well within the clinical usefulness threshold.

**Teaching note:** This exercise illustrates an important principle: the IoU threshold for defining "correct detection" is a design choice that should reflect clinical or application requirements, not just computer vision convention. The standard $\text{IoU} \geq 0.5$ threshold originated in benchmark competitions, not medical practice. For clinical applications, the relevant question is: "Does the detection give the clinician enough information to act appropriately?" — which may correspond to a different threshold than 0.5.

---

## Exercise 11.3: MC Dropout Uncertainty Estimation

**Problem:** A medical image classifier uses MC Dropout with $T = 100$ forward passes. For a particular chest X-ray, the 100 predictions for the "pneumonia" class are:

- 60 passes predict pneumonia probability $> 0.8$ (mean of these: 0.89)
- 40 passes predict pneumonia probability $< 0.2$ (mean of these: 0.12)

(a) Compute the mean predicted probability $\bar{p}$ and the standard deviation $\hat{\sigma}$.
(b) How would you interpret this result clinically? Is this high or low uncertainty?
(c) Should this case be escalated to a radiologist? Apply the Stakes Calibration principle.

---

**Solution:**

**(a) Mean and standard deviation:**

First, compute the complete mean:
$$\bar{p} = \frac{60 \times 0.89 + 40 \times 0.12}{100} = \frac{53.4 + 4.8}{100} = \frac{58.2}{100} = 0.582$$

For the standard deviation, we need to compute variance. Using the two-group approximation:

Group 1 (60 passes): $p_1 = 0.89$, Group 2 (40 passes): $p_2 = 0.12$

$$\hat{\sigma}^2 \approx \frac{1}{T-1}\!\left[60(0.89 - 0.582)^2 + 40(0.12 - 0.582)^2\right]$$

$$= \frac{1}{99}\!\left[60(0.308)^2 + 40(-0.462)^2\right]$$

$$= \frac{1}{99}\!\left[60 \times 0.0949 + 40 \times 0.2134\right]$$

$$= \frac{1}{99}\!\left[5.694 + 8.538\right] = \frac{14.232}{99} \approx 0.144$$

$$\hat{\sigma} \approx 0.379$$

**(b) Clinical interpretation:**

This is **very high uncertainty**. The model's 100 predictions split almost bipolarically — 60% of dropout samples predict very high pneumonia probability (0.89 average), 40% predict very low probability (0.12 average). The mean probability of 0.58 is near the decision boundary, but more importantly, the bimodal distribution of predictions suggests the model is genuinely uncertain — not just uncertain in a way that averages out, but uncertain in a way that suggests it may be activating two very different feature patterns depending on which neurons are dropped out.

In clinical terms: the model cannot reliably characterize this image. It may be detecting features consistent with pneumonia in some inference paths and features inconsistent with pneumonia in others. This suggests the image has ambiguous or unusual features — perhaps overlapping pathologies, unusual patient positioning, or imaging artifacts.

**(c) Escalation decision:**

**Escalate immediately.** The Stakes Calibration principle requires us to consider the cost asymmetry:
- Cost of missed pneumonia (false negative): potentially life-threatening delayed treatment
- Cost of unnecessary radiologist review (false positive escalation): time cost, approximately $50-100

Given this asymmetry, the threshold for escalation should be extremely low — essentially, any case with meaningful uncertainty about a life-threatening condition should be escalated. A standard deviation of 0.38 and a bimodal prediction distribution represents very high uncertainty for a system making binary medical decisions.

Well-calibrated escalation thresholds in medical imaging are typically based on: (a) model uncertainty (this case: very high), (b) base rate of condition in the population (affects prior), and (c) clinical stakes. All three factors point toward escalation here.

---

## Exercise 11.4: Active Learning Selection

**Problem:** You have a pool of 1,000 unlabeled chest X-rays. Your current model has been trained on 500 labeled examples. Using entropy-based uncertainty sampling, you compute the following statistics for the unlabeled pool:

| Image | Mean Probability (Pathology) | Prediction Entropy |
|-------|-----------------------------|--------------------|
| X_001 | 0.50 | 0.693 |
| X_002 | 0.95 | 0.199 |
| X_003 | 0.48 | 0.692 |
| X_004 | 0.02 | 0.081 |
| X_005 | 0.50 | 0.693 |

Entropy formula: $H = -p\log p - (1-p)\log(1-p)$

(a) Verify the entropy values for X_001 and X_002.
(b) Using entropy sampling, which image would be selected first for human annotation?
(c) A colleague argues that core-set selection is preferable because it would also select X_004, which entropy sampling would select last. Explain the rationale for each strategy and when you'd prefer each.

---

**Solution:**

**(a) Entropy verification:**

**X_001** ($p = 0.50$):
$$H = -0.50 \log(0.50) - 0.50 \log(0.50)$$
$$= -0.50 \times (-0.693) - 0.50 \times (-0.693)$$
$$= 0.347 + 0.347 = 0.693 \checkmark$$

This is maximum entropy for a binary classifier — complete uncertainty.

**X_002** ($p = 0.95$):
$$H = -0.95 \log(0.95) - 0.05 \log(0.05)$$
$$= -0.95 \times (-0.0513) - 0.05 \times (-2.996)$$
$$= 0.0487 + 0.1498 = 0.1985 \approx 0.199 \checkmark$$

**(b) First selection:**

X_001, X_003, and X_005 all have the maximum entropy of 0.693. Among these, entropy sampling would select any of them with equal priority (tie-breaking by index gives X_001 first, but this is arbitrary). X_001 would typically be selected first.

**(c) Rationale comparison:**

**Entropy sampling** selects images where the model is most uncertain — where learning the label would most update the model's decision boundary. It's computationally cheap (just a forward pass) and concentrates annotation budget on the most decision-relevant examples.

*Limitation:* X_004 has very high confidence (98% negative) and would be selected last. But X_004 might be in a region of feature space that is very sparse — few training examples look like X_004. If X_004 represents a category of X-rays the model has never been challenged on, it might actually be important for evaluation and robustness, even if the model is currently confident.

**Core-set selection** selects images to maximize coverage of the feature space, explicitly including rare or unusual images like X_004. It ensures that unusual presentations are represented in the labeled pool.

*Limitation:* It ignores decision-relevance — it might include X_004, but if X_004 is far from the decision boundary, labeling it doesn't help improve the model's accuracy on ambiguous cases.

**When to prefer entropy sampling:** Training data is relatively representative; you want to improve accuracy on uncertain cases quickly; annotation budget is very limited.

**When to prefer core-set:** Training data is sparse in some regions of feature space; unusual presentations are clinically important; you want a labeled set that covers the full variety of cases the model will encounter in deployment.

**Best practice (as discussed in the chapter):** A hybrid approach — use core-set for initial coverage, then entropy or BALD for main active learning phase — captures the benefits of both.

---

## Exercise 11.5: Confusion Matrix for Object Detection

**Problem:** An autonomous vehicle's pedestrian detection system is evaluated on a test set of 500 frames. Results:

- 320 frames: pedestrian present, correctly detected (TP)
- 40 frames: pedestrian present, not detected (FN)
- 30 frames: no pedestrian, but detection reported (FP)
- 110 frames: no pedestrian, correctly cleared (TN)

(a) Compute precision, recall, and F1 score.
(b) For autonomous vehicle safety, which metric matters most? Why?
(c) The team adjusts the confidence threshold, resulting in: TP=350, FN=10, FP=80, TN=60. Compute the new metrics. Is this a better system from a safety perspective?

---

**Solution:**

**(a) Original metrics:**

$$\text{Precision} = \frac{\text{TP}}{\text{TP}+\text{FP}} = \frac{320}{320+30} = \frac{320}{350} \approx 0.914 \quad (91.4\%)$$

$$\text{Recall} = \frac{\text{TP}}{\text{TP}+\text{FN}} = \frac{320}{320+40} = \frac{320}{360} \approx 0.889 \quad (88.9\%)$$

$$\text{F1} = \frac{2 \times \text{Precision} \times \text{Recall}}{\text{Precision}+\text{Recall}} = \frac{2 \times 0.914 \times 0.889}{0.914+0.889} = \frac{1.626}{1.803} \approx 0.902$$

**(b) Most important metric for AV safety:**

**Recall** is the most safety-critical metric. Recall measures the fraction of pedestrians that were successfully detected. A false negative (FN) in this context means a pedestrian was not detected and the vehicle did not respond — this is a potential collision.

The cost asymmetry is severe: a false positive (FP) causes the vehicle to brake or swerve unnecessarily — uncomfortable but rarely dangerous. A false negative (FN) means a pedestrian may be struck.

This is exactly the Stakes Calibration dimension of the five-dimension framework: the cost structure of errors determines the appropriate operating point. For pedestrian detection, we should be willing to accept high false positive rates (extra braking) in exchange for very low false negative rates (missed pedestrians).

**(c) Adjusted threshold metrics:**

$$\text{Precision} = \frac{350}{350+80} = \frac{350}{430} \approx 0.814 \quad (81.4\%)$$

$$\text{Recall} = \frac{350}{350+10} = \frac{350}{360} \approx 0.972 \quad (97.2\%)$$

$$\text{F1} = \frac{2 \times 0.814 \times 0.972}{0.814+0.972} = \frac{1.583}{1.786} \approx 0.886$$

**F1 score decreased** from 0.902 to 0.886. However, **this is a better system for safety purposes**: recall increased from 88.9% to 97.2%, meaning 30 previously missed pedestrians are now detected. The cost: 50 more false positives (extra unnecessary braking events per 500 frames).

This illustrates why F1 score — which weights precision and recall equally — is not always the right optimization target. For safety-critical applications, a precision-recall tradeoff that improves recall at the cost of precision can be the right choice. The safety design question is not "maximize F1" but "what level of false negatives is acceptable, given the cost of the required false positive rate?"

---

*These worked solutions provide technically rigorous answers to the exercises in Chapter 11, grounded in the practical HITL design principles developed throughout the chapter.*
