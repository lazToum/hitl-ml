# Technical Review & Audit: Winter Edition

This document tracks the formal expert review of the full technical edition. All mathematical, bibliographic, and engineering items were audited.

## 1. Mathematical & Statistical Rigor
*   **Weighted Cohen's Kappa:** Corrected the formula in Chapter 7 Appendix from $\kappa_w = 1 - P_o^w/P_e^w$ to the standard $\kappa_w = (P_o^w - P_e^w)/(1 - P_e^w)$.
*   **Optimal Thresholds:** Updated Chapter 15 to include class priors in the optimal threshold formula ($\theta^*$) to prevent significant errors in rare-event detection.
*   **Aleatoric/Epistemic Clarity:** Per the mathematician's request, added technical notes in Chapter 2 distinguishing irreducible data noise from model knowledge gaps.

## 2. ML Research & SOTA Alignment
*   **Hallucination Benchmarks:** Hedged claims regarding LLM hallucination rates (3–27%) and added Magesh (2024) for legal/medical specific benchmarks.
*   **RLHF & DPO:** Verified the three-stage RLHF pipeline and the closed-form solution for DPO.
*   **Goodhart’s Law:** Integrated the "throughput vs. quality" warning in Chapter 12 to reflect real-world MLOps failures.

## 3. Human Factors & Clinical Ethics
*   **Automation Bias:** Corrected citations for Mosier (1998) and Parasuraman (2010). Added caveats to the "Danziger judge study" to reflect recent methodological contestation.
*   **Medical External Validity:** Updated Chapter 11 to emphasize "Dataset Shift" when AI moves between hospital systems.

## 4. Infrastructure & Productionization (MLOps Review)
*   **Shadow Mode Deployment:** New recommendation to include a protocol for running HITL systems in "Shadow Mode" (observation only) before full deployment.
*   **Data Lineage:** Established a requirement for auditable logs in Chapter 15. Every model update must be traceable to the specific human annotator batch that influenced it.
*   **Latency Jitter:** Added a "Race Condition" note in Chapter 17—handling cases where the human reviewer is slower than the system-level time-out.

## 5. Bibliography Audit
*   Resolved all 91 cited keys. Standardized arXiv entries to `@misc` and verified DOIs for foundational papers (Vaswani 2017, Christiano 2017).
