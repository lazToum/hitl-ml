# Technical Review & Audit: Winter Edition

This document tracks the formal expert review of the full technical edition. The original April 2026 audit (mathematical, bibliographic, engineering) is preserved in summary below; the June 2026 four-panel refresh re-audited the then-current 517-page build; the July 2026 five-panel review audited the new Chapter 18 against the 539-page first build (final: 541 pages). See `expert_reviews.md` for the full panel reports.

## July 2026 blinded full-project round — all items resolved

Late July 2026, a second five-panel round (Mathematics, Content Accuracy, Writing & Narrative, Citations & Bibliography, Policy & Political Economy) re-reviewed the **entire project from scratch** — all four editions, companions, overview, teaching set, and interactive reader — with reviewers deliberately blinded to this file and all prior review documents. Ch18/18A survived every check untouched; the findings clustered in older material:

1. **Fabricated or composite material presented as fact (Blockers).** Ch15's two case studies (2019 "regional bank" with an ECOA/FHA misstatement; 2021 "social platform") replaced with the documented Apple Card/NYDFS investigation and Meta's 2020 civil-rights audit. Ch06's "Maria" vignette replaced with Roberts's ethnography plus the Stureborg interface study; the invented "cognitive depletion effect" attribution removed. Ch12's e-commerce case reframed as an explicit composite. Appendix 1A's Netflix "results" and 6A's table captions relabeled as illustrative.
2. **Fabricated findings attached to real citations (Blockers).** Gaube et al. 2021 (ch06/ch11) restated to the study's actual AI-vs-human-labeled-advice design; Zampieri 2019 kappa corrected (0.83, not an invented 0.45–0.72 range); Sap et al. 2019 re-attributed (UW, AAE-labeling disparity; the annotator-demographics comparison cited to Sap et al. 2022); `yang2018fairer` (wrong SIGMOD paper) replaced with Yang et al. 2020.
3. **Bibliography (Blockers/Majors).** Four entries with fabricated elements replaced (`jain2022adversarial` → the real USENIX Security 2022 paper; `eyuboglu2022domino` and `ash2020badge` author/title corrections; `cbc2016gps` → the real CBC Kitchener-Waterloo story). Two wrong DOIs (zech2018variable, davani2022dealing), garbled author lists (rajpurkar2017chexnet, bai2022constitutional, begoli2019uncertainty), Moffatt docket → 2024 BCCRT 149, plus ~11 field-level fixes. 123/146 entries verified clean at field level against Crossref/arXiv/publisher records.
4. **Verified-wrong facts (Majors).** Dahl et al. hallucination range corrected to 58–88% everywhere (ch01, ch10, companions, reader); ch14's Amazon recruiting narrative rewritten to match the Reuters source (bias found by 2015, tool never used on live candidates); ch06's COMPAS accuracy claim re-attributed to Dressel & Farid 2018; Georgian Bay rescue detail, Mata v. Avianca dates, Uber Tempe 1.2 s, CheXNet year, Begoli year/author all corrected.
5. **Mathematics (7 majors).** Ch07 chance-agreement example (82%, correct model); 12A sample-size worked example (n ≈ 6,746) and unsolvable IRR exercise data; 16A Koenecke WER figures aligned with ch02 and the study; 1A over/under-asking inequalities; ch04 solutions threshold formula (calibrated posteriors); ch01 solutions Activity 3 cost model. Plus BADGE gradient code, ECE rubric conflict, ICU alarm arithmetic, and smaller items.
6. **Policy/legal.** Companion answer keys de-escalated Moffatt v. Air Canada from "binding precedent"/"legally necessary" to illustrative principles with the CRT's non-precedential status; GDPR "right to explanation" modernized per CJEU C-203/22; EU AI Act fairness-threshold attribution corrected to EEOC four-fifths doctrine; unsourced Constitutional AI cost figures labeled illustrative; export-control passage in Spring corrected (EAR Cat. 5 Pt. 2, ITAR removed).
7. **Writing/consistency.** Spring's divergent five-dimensions framework reconciled with a mapping to the canonical set (plus a decision-theoretic threshold model); overview reconciled with the actual books (misconception list, Crossroads, Nest framing, character claims); stale ch18-insertion cross-references fixed (19A, preface, ch11 transition); "To Some" dedications replaced; Five Dimensions Check added to the four chapters missing it; British spellings americanized in appendices 5A/8A/11A/14A; Ray's biography harmonized across companions; companion footers and the Dahl-range/"3–27%" study-guide numbers corrected.
8. **Reader reconciliation.** The interactive reader's winter chapters (ch01–ch15) were re-synchronized with all of the above — including the replacement case studies and the corrected Amazon, COMPAS, Gaube, Sap, and Zampieri passages.

A follow-up verification pass also caught and corrected three errors *introduced by* the earlier structured-review resolutions: a false "published in PLOS Medicine" note on the CheXNet entry (that's CheXNeXt) and a wrong "demo track" note on the Snorkel entry in all 14 summer translation bibs, and the Spring EAR/ITAR overclaim above.

## July 2026 Chapter 18 panel — all items resolved

Five reviewers (the four standing personas plus a new Policy & Political Economy persona) audited the new Chapter 18 "Who Owns the Loop?", Appendix 18A, the teaching set, the reader chapter, and the ripple edits. Highlights:

1. **Content (Critical).** The "bride labeled *costume*/*performance art*" anecdote was wrongly attributed to Shankar et al. 2017 (which studies bridegroom images; actual mislabels "chain mail," "academic gown"). Re-sourced: Shankar et al. for the geodiversity findings, Zou & Schiebinger 2018 (*Nature*) for the bride photographs — corrected in ch14, ch18, and both reader chapters.
2. **Writing (Critical).** Renumbering miss: reader `ch19.md` still carried `## Chapter 18 Summary`. Fixed.
3. **Policy (Critical).** California AB 2013 (training-data transparency, in force Jan 2026) was missing from the disclosure-obligations passage; added alongside the EU AI Act in chapter and appendix.
4. **Policy (Major ×2).** "Weights are trade secrets" scoped to closed-weight systems with an open-weight acknowledgment; the labor claim narrowed to safety/moderation work with the expert-annotation wage bifurcation added.
5. **Math (Major).** FedAvg display was FedSGD in disguise (collapsed to centralized GD); rewritten with multi-epoch local training and defined normalization.
6. Plus ~15 minor/cosmetic items (voice, notation, Title-Case bib consistency, licensing-topology precision in the solutions manual) — all applied.

**Final build: 541 pages, 0 LaTeX errors, 0 undefined references, 0 biber warnings.**

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
