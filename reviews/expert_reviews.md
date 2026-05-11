# Expert Review Panel: "Human in the Loop: Misunderstood" — Winter Edition

*Six-panel review conducted 2026-04-22. All 21 action items resolved 2026-04-23.*

## Fix Status Summary (2026-04-23 — COMPLETE)

| # | Issue | Status |
|---|-------|--------|
| 1 | Optimal threshold ch15 — missing class priors | ✅ **Fixed** — `ch15_appendix.tex` includes calibrated-posterior note and likelihood-ratio form |
| 2 | Weighted κ formula incorrect | ✅ **Fixed** — corrected in `ch07_appendix.tex` and `Ch7A_final.md`; `cohen1968weighted` citation added |
| 3 | Gaube 2021 cited as Goddard 2012 in ch06 | ✅ **Fixed** — `ch06.tex` now cites `gaube2021ai`; presentation effect attributed to subsequent research |
| 4 | κ variance disclaimer missing from LaTeX | ✅ **Fixed** — `cautionbox` added to `ch07_appendix.tex` |
| 5 | Duplicate rajpurkar bib entries | ✅ **Fixed** — `rajpurkar2018chexnet` removed; `ch11.tex` updated to `rajpurkar2017chexnet` |
| 6 | Entry type errors (ouyang, rafailov, bai, kaplan, angwin) | ✅ **Fixed** — `@inproceedings` / `@misc` as appropriate |
| 7 | Key year mismatches: mosier1996→1998, drew2014→2013, yang2020→2018 | ✅ **Fixed** — keys renamed in bib; all `\autocite{}` calls updated |
| 8 | Missing citation for 3–27% hallucination range | ✅ **Fixed** — claim hedged to "vary widely"; "Stanford" attribution removed; `magesh2024hallucination` cited |
| 9 | Missing citation for 5–17% medical AI error range | ✅ **Fixed** — hedged; `kompa2021second` cited |
| 10 | FDA "900 devices as of 2024" cites 2021 document | ✅ **Fixed** — year qualifier removed; fda2021samed retained for regulatory framework |
| 11 | CheXNet presentation effect attributed to original paper | ✅ **Fixed** — attributed to "subsequent research"; `gaube2021ai` added |
| 12 | ImageNet gender claim (`yang2020fairer`) | ✅ **Fixed** — key renamed `yang2018fairer` throughout |
| 13 | Missing pages/DOI for vaswani, christiano, goodfellow | ✅ **Fixed** — pages and DOIs added to all three entries |
| 14 | Duplicate rajpurkar / arXiv standardization | ✅ **Fixed** — duplicate removed; remaining arXiv entries are `@misc` |
| 15 | Redundancy formula λ≈0.3 — source or note | ✅ **Fixed** — `technote` box added explaining λ as empirical heuristic |
| 16 | Netflix "3 episodes or 90 minutes" — verify or hedge | ✅ **Fixed** — hedged to "several episodes" and "roughly 90 minutes" with region caveat |
| 17 | Danziger replication-debate caveat | ✅ **Fixed** — `technote` box added in `ch13.tex` noting methodological contestation |
| 18 | Formally introduce Five Dimensions framework by Ch3 | ✅ **Fixed** — `keyconcept` box added to `ch01.tex` naming all five dimensions formally |
| 19 | Six stub chapters (5, 8, 9, 14, 17, 18) | ✅ **Fixed** — all six fully typeset; PDF grew from 369 → 433 pages |
| 20 | Thesis tie-back sentence in Ch3, Ch4, Ch11 | ✅ **Fixed** — added to each chapter's Key Concepts summary |
| 21 | Ch2 aleatoric/epistemic non-specialist callout | ✅ **Fixed** — `technote` box added with plain-language substitutes |

**Final build: 433 pages, 965 KB, 0 undefined references, 0 multiply-defined labels.**  
All 21 action items resolved. No open items.

---

## Panel

| # | Reviewer | Domain |
|---|----------|--------|
| 1 | Math & Statistics | Equations, proofs, approximations |
| 2 | ML/AI Research | Technical claims, benchmarks, methods |
| 3 | Human Factors & Cognitive Psychology | Automation bias, trust, fatigue literature |
| 4 | Medical AI & Ethics | Clinical AI claims, FDA regulation, fairness |
| 5 | Bibliography & References | BibTeX audit, citation accuracy |
| 6 | Writing & Narrative | Prose quality, structure, thesis coherence |

---

## Review 1 — Mathematics & Statistics

*Reviewer profile: mathematician and statistician, publication-quality standards.*

### CRITICAL ERRORS (all resolved)

#### 1. Weighted Cohen's Kappa — INCORRECT FORMULA ✅ Fixed

**Was:** $\kappa_w = 1 - P_o^w/P_e^w$ (incorrect)  
**Now:** $\kappa_w = (P_o^w - P_e^w)/(1 - P_e^w)$ with definitions; `cohen1968weighted` citation added.

#### 2. Optimal Decision Threshold — MISSING CLASS PRIORS ✅ Fixed

**Was:** $\theta^* = C_{FP}/(C_{FP} + C_{FN})$ (missing priors, 70× error for rare events)  
**Now:** Technote added to `ch15_appendix.tex` explaining the formula applies to calibrated posteriors and giving the likelihood-ratio form.

#### 3. Cohen's Kappa Variance — OVERSIMPLIFIED ✅ Fixed

`cautionbox` added to LaTeX appendix matching the disclaimer already in `Ch7A_final.md`.

### MINOR ISSUES (all resolved)

- Redundancy formula λ≈0.3: `technote` box added explaining it as an empirical heuristic.

### VERIFIED CORRECT

| Formula | Location | Status |
|---------|----------|--------|
| ECE (all versions) | ch01, ch02, ch10, ch12, ch15 appendices | ✓ Correct |
| Unweighted Cohen's κ | ch07_appendix | ✓ Correct |
| Fleiss' κ | ch07_appendix | ✓ Correct |
| Dawid-Skene EM (E-step, M-step) | ch07_appendix | ✓ Correct |
| Bradley-Terry preference model | ch10_appendix | ✓ Correct |
| DPO loss and optimal policy | ch10_appendix | ✓ Correct |
| RLHF objective with KL term | ch10_appendix | ✓ Correct |
| Conformal prediction coverage | ch02_appendix | ✓ Correct |
| Deep ensembles variance | ch02_appendix | ✓ Correct |
| F₁ and F_β | ch04, ch12 appendices | ✓ Correct |
| ROC/AUC | ch04_appendix | ✓ Correct |
| SDT framing model | ch07_appendix | ✓ Correct |
| WER, DER | ch16_appendix | ✓ Correct |
| KS-test | ch12_appendix | ✓ Correct |

---

## Review 2 — Machine Learning & AI Research

*Reviewer profile: senior ML researcher, NeurIPS/ICML/ICLR author and reviewer.*

### OVERALL: TECHNICALLY SOUND

No major factual errors in the ML technical content. Strong command of RLHF, DPO, CAI, adversarial examples, Word2Vec, AlexNet, Transformers, AlphaFold.

### ITEMS RESOLVED

| Item | Resolution |
|------|-----------|
| 3–27% hallucination range (ch01) — no citation | Hedged to "vary widely"; removed "Stanford University" attribution; Magesh 2024 cited |
| 58–82% vs. 58% range discrepancy (ch01 vs. ch10) | ch01 now uses a single hedged claim; both Magesh-specific figures remain in ch10 with correct attribution |
| Medical AI error rates 5–17% (ch10) — no citation | Hedged; `kompa2021second` added |
| Netflix "3 episodes or 90 minutes" | Hedged with region/account-type caveat |

### VERIFIED CORRECT

| Claim | Status |
|-------|--------|
| AlexNet ~11 pp below next entry (ImageNet 2012) | ✓ |
| Goodfellow panda → gibbon with 57.7% / 99.3% confidence | ✓ |
| Word2Vec: Mikolov 2013, Google team | ✓ |
| "Attention is All You Need" Vaswani 2017 | ✓ |
| RLHF three-stage pipeline (SFT → RM → PPO) | ✓ |
| DPO closed-form solution, avoids RL | ✓ |
| Constitutional AI two-phase (SL-CAF + RLAIF) | ✓ |
| AlphaFold2 CASP performance, pLDDT confidence scores | ✓ |
| COMPAS racial disparity (ProPublica 2016) | ✓ |

---

## Review 3 — Human Factors & Cognitive Psychology

*Reviewer profile: human factors scientist, expertise in automation bias, trust in automation, HITL design.*

### ITEMS RESOLVED

| Item | Resolution |
|------|-----------|
| Mosier year mismatch (1996 key, 1998 year) | Key renamed `mosier1998automation`; all `\autocite` calls updated |
| ImageNet gender bias source (`yang2020fairer`) | Key renamed `yang2018fairer`; Yang et al. 2018 SIGMOD does discuss ImageNet stereotypes |
| Gaube citation error in ch06 | Fixed — `gaube2021ai` added; presentation effect attributed to subsequent research |
| Danziger replication caveat | `technote` box added noting methodological contestation |

### VERIFIED CORRECT

- Bainbridge (1983) "Ironies of Automation" — correctly described and cited
- Parasuraman & Riley (1997) attentional allocation taxonomy — correct
- Parasuraman & Manzey (2010) — complacency cross-domain generalization accurate
- Skitka et al. (1999) automation bias persists under explicit instructions — correct
- Dietvorst (2015) algorithm aversion — correct
- Linder et al. (2014) time-of-day antibiotic prescribing — correct
- AF447 accident sequence — factually accurate per BEA final report

---

## Review 4 — Medical AI & Ethics

*Reviewer profile: physician-scientist and AI ethics researcher.*

### ITEMS RESOLVED

| Item | Resolution |
|------|-----------|
| Gaube 2021 citation error in ch06 | Fixed — `gaube2021ai` now cited; "subsequent research" framing |
| FDA "900 devices as of 2024" with 2021 source | Year qualifier removed; fda2021samed retained for regulatory framework description |
| Medical AI error rates (ch10) — no citation | Hedged and `kompa2021second` cited |
| CheXNet presentation effect overstated | Attributed to "subsequent research" rather than the original CheXNet paper |

### VERIFIED CORRECT

| Claim | Status |
|-------|--------|
| CheXNet hedged correctly (task-specific, solo baseline) | ✓ |
| Ardila et al. (2019) lung cancer CT | ✓ |
| COMPAS ProPublica characterization | ✓ |
| Buolamwini & Gebru Gender Shades | ✓ |
| Koenecke 2020 — racial ASR disparity | ✓ |
| Steiger 2021 — psychological harm to content moderators | ✓ |
| Magesh 2024 — 58% hallucination in legal research tools | ✓ (ch10) |

---

## Review 5 — Bibliography & References

*Reviewer profile: senior academic editor and bibliographer.*

### ALL ERRORS RESOLVED

| Key | Issue | Resolution |
|-----|-------|-----------|
| `rajpurkar2017chexnet` + `rajpurkar2018chexnet` | Duplicate arXiv preprint | `rajpurkar2018chexnet` removed; ch11 updated |
| `mosier1996automation` | Key/year mismatch | Renamed `mosier1998automation` |
| `drew2014alarm` | Key/year mismatch | Renamed `drew2013alarm` |
| `yang2020fairer` | Key/year mismatch | Renamed `yang2018fairer` |
| `ouyang2022training` | `@article` for NeurIPS | Changed to `@inproceedings` |
| `rafailov2023direct` | `@article` for NeurIPS | Changed to `@inproceedings` |
| `bai2022constitutional` | `@article` for arXiv | Changed to `@misc` |
| `kaplan2020scaling` | `@article` for arXiv | Changed to `@misc` |
| `angwin2016machine` | `@article` for ProPublica | Changed to `@misc` |
| `vaswani2017attention` | Missing pages, DOI | Added pages 5998–6008, DOI |
| `christiano2017deep` | Missing pages, DOI | Added pages 4299–4307, DOI |
| `goodfellow2015explaining` | Missing DOI | Added DOI |

**All 91 cited keys resolve successfully in biber. 0 undefined references.**

---

## Review 6 — Writing Quality & Narrative Coherence

*Reviewer profile: science writer and editor, Nature/Penguin Press authors.*

### ITEMS RESOLVED

| Item | Resolution |
|------|-----------|
| Five Dimensions framework — no formal introduction | `keyconcept` box added to `ch01.tex` formally naming all five dimensions |
| Stub chapters — LaTeX integration | All six chapters complete; PDF 369 → 433 pages |
| Ch3–4, Ch11 thesis tie-back | Thesis-reinforcing sentences added to Key Concepts in each |
| Netflix threshold — hedge | Hedged with "several episodes" and region/account caveat |
| Ch2 aleatoric/epistemic non-specialist callout | `technote` added with "irreducible uncertainty" / "knowledge-gap uncertainty" labels |
| Danziger replication caveat | `technote` added in `ch13.tex` |

### OPENING HOOKS — ALL CHAPTERS ✓

All 18 chapters verified as opening with specific stories that earn abstract discussion.

### CROSS-CHAPTER CONSISTENCY — CONFIRMED

- Netflix pause: Ch1 (exemplar) → Ch4 (threshold) → Ch5 (asking design)
- Nest thermostat: Ch1 (bad UX) → Ch13 (automation complacency parallel)
- Air Canada chatbot: Ch1 → Ch10 → Ch18 (accountability thread)
- COMPAS: Ch6 (interface failure) → Ch14 (fairness impossibility) → Ch18 (accountability)
- Automation bias: Ch1 → Ch6 → Ch13 (progressively deepened)

No contradictions detected.

### VOICE CONSISTENCY — EXCELLENT

Conversational-but-rigorous voice holds across all 18 chapters. Six newly integrated chapters (ch05, ch08, ch09, ch14, ch17, ch18) are indistinguishable in register from original chapters.

---

## Consolidated Action List — COMPLETE

*All 21 action items resolved as of 2026-04-23.*

| # | Issue | Reviewers | Status |
|---|-------|-----------|--------|
| 1 | Optimal threshold ch15 | Math | ✅ |
| 2 | Weighted κ formula | Math | ✅ |
| 3 | Gaube 2021 / Goddard 2012 in ch06 | HF, Medical AI | ✅ |
| 4 | κ variance disclaimer | Math | ✅ |
| 5 | Duplicate rajpurkar entries | References | ✅ |
| 6 | Entry type errors (ouyang, rafailov, bai, kaplan, angwin) | References | ✅ |
| 7 | Key year mismatches | References, HF | ✅ |
| 8 | 3–27% hallucination citation | ML/AI, Medical AI | ✅ |
| 9 | 5–17% medical AI error citation | ML/AI, Medical AI | ✅ |
| 10 | FDA device count / source year | Medical AI | ✅ |
| 11 | CheXNet presentation effect attribution | Medical AI | ✅ |
| 12 | ImageNet gender claim source | HF | ✅ |
| 13 | Pages/DOI for vaswani, christiano, goodfellow | References | ✅ |
| 14 | Duplicate rajpurkar / arXiv standardization | References | ✅ |
| 15 | Redundancy formula λ≈0.3 note | Math | ✅ |
| 16 | Netflix threshold hedge | ML/AI, Writing | ✅ |
| 17 | Danziger replication caveat | HF | ✅ |
| 18 | Five Dimensions formal introduction | Writing | ✅ |
| 19 | Six stub chapters integrated | Writing | ✅ |
| 20 | Thesis tie-back in Ch3, Ch4, Ch11 | Writing | ✅ |
| 21 | Ch2 non-specialist callout | Writing | ✅ |

---

*Original review compiled 2026-04-22. All action items resolved 2026-04-23.*  
*Final build: 433 pages, 965 KB, 0 undefined references, 0 multiply-defined labels.*
