# Technical Review & Audit: Winter Edition

This document tracks the formal expert review of the full technical edition. The original April 2026 audit (mathematical, bibliographic, engineering) is preserved in summary below; the June 2026 four-panel refresh re-audited the current 517-page build. See `expert_reviews.md` for the full panel reports.

## June 2026 refresh (517-page build) — all 9 items resolved

1. **Content (Major).** Corrected a voice-recognition passage in Chapter 2 that attributed word-error figures and accent categories (Midwestern/Appalachian/Scottish) to Koenecke et al. 2020 that the study does not contain. Restated to the paper's actual finding: ~19% WER for white speakers vs ~35% for Black speakers across five commercial systems.
2. **Mathematics.** Aligned the Chapter 15 kappa interpretation table to the Landis–Koch cutpoints used in Chapter 12 (`>0.80 / 0.61–0.80 / 0.41–0.60 / ≤0.40`).
3. **Mathematics.** Made the Figure 4.2 operating point consistent across the ROC and precision–recall panels (TPR ≡ recall).
4. **Writing.** Added in-text cross-references for all four new figures.
5. **Content.** Softened the Chapter 13 Danziger claim to match its existing methodological caution.
6. **Content.** Cited the LIME-instability claim (Alvarez-Melis & Jaakkola 2018) and recast the legal-document-review claim as an explicit illustration.
7. **Bibliography.** Dropped four orphan (uncited) entries.
8. **Bibliography.** Fixed three Biber `month`-field warnings.
9. **Mathematics.** Documented the deep-ensemble (`1/M`) vs MC-dropout (`1/(T-1)`) estimator convention with a footnote.

## April 2026 audit (preserved summary)

### 1. Mathematical & Statistical Rigor
*   **Weighted Cohen's Kappa:** Corrected the Chapter 7 Appendix formula from $\kappa_w = 1 - P_o^w/P_e^w$ to the standard $\kappa_w = (P_o^w - P_e^w)/(1 - P_e^w)$.
*   **Optimal Thresholds:** Updated Chapter 15 to address class priors / calibrated posteriors in the optimal threshold formula.
*   **Aleatoric/Epistemic Clarity:** Added technical notes in Chapter 2 distinguishing irreducible data noise from model knowledge gaps.

### 2. ML Research & SOTA Alignment
*   **Hallucination Benchmarks:** Hedged LLM hallucination-rate claims and added Magesh (2024).
*   **RLHF & DPO:** Verified the three-stage RLHF pipeline and the closed-form DPO solution.

### 3. Human Factors & Clinical Ethics
*   **Automation Bias:** Corrected citations for Mosier (1998) and Parasuraman (2010); added the Danziger replication caveat.
*   **Medical External Validity:** Emphasized dataset shift when AI moves between hospital systems (Chapter 11).

### 4. Bibliography Audit
*   Resolved all cited keys; standardized arXiv entries to `@misc`; verified DOIs for foundational papers.

---

*April audit: 433-page build. June refresh: 517-page build, 0 undefined references, 0 duplicate destinations, 0 biber warnings.*
