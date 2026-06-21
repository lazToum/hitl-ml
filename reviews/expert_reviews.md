# Expert Review Panel: "Human in the Loop: Misunderstood" — Winter Edition

*Latest: five-panel review of the new Chapter 18 conducted 2026-07-19 (below). Prior: four-panel refresh of 2026-06-21 (9 items, resolved) and six-panel review of 2026-04-22 (21 items, resolved).*

---

# Chapter 18 Panel (2026-07-19)

*Five-reviewer panel on the newly added Chapter 18 "Who Owns the Loop?" (chapter, Appendix 18A, teaching set, reader chapter, and the ripple edits to ch14/ch17/ch19/preface/glossary), run against the first clean 539-page build. The four standing personas plus a new fifth — Policy & Political Economy (technology-law/STS scholar) — added because the chapter makes legal, labor-market, and export-control claims outside the standing panel's domains. Recommendation: keep Reviewer 5 for any future pass over ch18 or policy-adjacent material.*

## Fix Status Summary (2026-07-19 — COMPLETE)

| # | Severity | Reviewer | Issue | Status |
|---|----------|----------|-------|--------|
| 1 | **Critical** | Content | The "bride labeled *costume*/*performance art*" anecdote was attributed to Shankar et al. 2017, which studies **bridegroom** images (mislabels: "chain mail," "academic gown"; lowest confidence for Ethiopia/Pakistan) and contains neither the bride photos nor those labels — the vivid version traces to Zou & Schiebinger's 2018 *Nature* comment. Same misattribution pattern the June panel caught in ch02. | ✅ **Fixed** — ch14 now carries the accurate two-source version (Shankar findings + *Nature* illustration, new `zou2018ai` entry); ch18 compressed to a back-reference citing both |
| 2 | **Critical** | Writing | Renumbering miss: reader `ch19.md` still had `## Chapter 18 Summary` — two chapters claimed the same summary heading | ✅ **Fixed** — `## Chapter 19 Summary` |
| 3 | **Critical** | Policy | "EU AI Act makes the first significant attempt" ignored California AB 2013 (training-data transparency, in force Jan 1 2026, with live disclosures from major labs) — a checkable currency gap in the chapter's central opacity claim | ✅ **Fixed** — AB 2013 added beside the AI Act in chapter + appendix (new `ab2013california` entry); framing now "disclosure is evidently feasible… everywhere the obligations do not reach, the default remains opacity" |
| 4 | Major | Math | FedAvg display showed a single local gradient step (i.e., FedSGD), which algebraically collapses to centralized GD — undercutting the paragraph's own argument | ✅ **Fixed** — prose states multiple local epochs; $n=\sum_k n_k$ defined; FedSGD distinction made explicit |
| 5 | Major | Policy | "The trained model is private property. Its weights are trade secrets." stated universally — no answer to the open-weight ecosystem (Llama/Mistral/OLMo) | ✅ **Fixed** — scoped to closed-weight systems; open-weight acknowledged as relocating rather than closing the gap (undocumented corpora), documented open corpora cited as proof of feasibility |
| 6 | Major | Policy | "Priced as piecework" asserted industry-wide from Nairobi evidence alone; by 2024–25 expert RLHF commands professional rates while safety/moderation stays commodity-priced | ✅ **Fixed** — claim narrowed to safety/moderation labor; stratification-by-visibility-and-bargaining-power argument added (sharper than the original) |
| 7 | Major | Writing | Geodiversity story retold in ch18 with a near-verbatim sentence from ch14 | ✅ **Fixed** — merged with #1: ch18 now back-references ch14 |
| 8 | Major | Writing | "no country's residents were too risky to harvest" — the one editorializing word in the chapter | ✅ **Fixed** — "the collection recognized no tiers of eligibility" |
| 9 | Minor | Math | Advantage-0 wording (per-attack vs. model-level); Shapley efficiency baseline $U(D)-U(\emptyset)$; threshold-selection bias caveat; $\ell$ vs $\mathcal{L}$ declared; helper comment in listing | ✅ **Fixed** — all five |
| 10 | Minor | Policy | Oct 2022 rule blurred with Jan 2025 tiering (former was China-focused); "incoming administration" imprecise; "mirrors with discomfiting fidelity" overclaimed; "one-way valve" flatter than the solutions manual's own Q3; compulsory-licensing vs collective-rights-management topology conflated in solutions Q1 | ✅ **Fixed** — all five (valve now "flows back only to the few institutions positioned to litigate or negotiate… very nearly a one-way valve") |
| 11 | Minor | Writing | "made flesh"; "The ghost is doing fine work"; repeated "For seventeen chapters" opener; ch19 opening ignored ch18; preface closing slogan + `\ai` macro inconsistency; orphaned Gebru citation; reader-md register (no contractions, unblockquoted Try This); "consumes real risk" zeugma; "U.S." spacing; intervention-design header mismatch; policy-artifact antithesis thinned | ✅ **Fixed** — all |
| 12 | Minor | Citations | 8 new @inproceedings titles were sentence-case vs. file's Title Case convention; EU AI Act entry lacked "of 13 June 2024" | ✅ **Fixed** — all 9 entries adjusted |
| 13 | Noted | Citations | The two federalregister.gov URLs answer curl with an anti-bot challenge (302 → unblock.federalregister.gov); verified correct via the FR API. Automated link checks will false-positive on them | ⚠️ **Recorded** — no change; note for future link-integrity sweeps |
| 14 | Noted | Writing | ch18 storyhook is a three-sentence epigram where siblings use descriptive subtitles | ✅ **Kept deliberately** — conscious escalation for the book's most political chapter |

**Final build after fixes: 541 pages, 0 LaTeX errors, 0 undefined references, 0 duplicate destinations, 0 biber warnings; reader app builds clean with the 19-chapter manifest.** No open items.

All 17 originally-added bibliography entries were field-verified against Crossref/PMLR/EUR-Lex/Federal Register API with zero errors; TIME/Sama wage figures, NYT lawsuit, EU AI Act Art. 53(1)(d) quote, both BIS rules and the May 2025 rescission, Ghost Work, Atlas of AI, data colonialism, and the C4 audit all confirmed against primary sources. Policy reviewer's overall verdict: "would substantially survive hostile review… the hedges are placed exactly where a lawyer or policy scholar would want them"; the vulnerability was 2023-vintage currency, addressed by items 3, 6, and 10.

## Panel

| # | Reviewer | Domain |
|---|----------|--------|
| 1 | Mathematics & Formulas | Appendix 18A equations, listings, exercise solution ranges |
| 2 | Content & Technical Accuracy | Primary-source verification of every factual claim |
| 3 | Writing & Narrative | Voice vs. ch14/ch17, transitions, reader-md register, preface addition |
| 4 | Citations & Bibliography | Field-level web verification of all 17 new entries; key usage |
| 5 | Policy & Political Economy *(new)* | Legal precision, export-control accuracy, labor-market claims, hostile-review stress test |

---

## Why a refresh

Since the April review the edition gained substantial new material: four native TikZ/pgfplots figures (the book's first), a chapter-letter appendix numbering scheme (`NA.x`), several formerly-illustrative vignettes replaced with real cited cases, and a cross-appendix math-presentation harmonization. A fresh panel audited the current state.

## Fix Status Summary (2026-06-21 — COMPLETE)

| # | Severity | Issue | Status |
|---|----------|-------|--------|
| 1 | **Major** | ch02 voice-recognition passage attributed WER figures/accents to Koenecke 2020 the paper does not contain (it studied AAVE vs. white speakers only) | ✅ **Fixed** — `ch02.tex` restated to the paper: ~19% WER (white) vs ~35% (Black) across five systems; Appalachian/Scottish/Midwestern figures removed; downstream sentence de-specified |
| 2 | Minor | ch15 kappa table used boundaries (`0.60–0.80`, `0.40–0.60`) inconsistent with the Landis–Koch cutpoints in ch12 (κ=0.60 was "substantial" in one, "moderate" in the other) | ✅ **Fixed** — `ch15_appendix.tex` bands aligned to `>0.80 / 0.61–0.80 / 0.41–0.60 / ≤0.40` |
| 3 | Minor | Fig 4.2 marked the operating point at TPR=0.52 on ROC but recall=0.60 on PR (TPR ≡ recall, so they must match) | ✅ **Fixed** — ROC marker moved to TPR=0.60 (on-curve point added at FPR≈0.11) |
| 4 | Minor | None of the four new figures was cross-referenced from the prose | ✅ **Fixed** — `\cref{fig:...}` added in ch01, ch02, ch04, ch04_appendix |
| 5 | Minor | ch13 stated "the judges were not consciously aware of this pattern," assuming the contested Danziger causal story | ✅ **Fixed** — softened to "to the extent the effect is real, it operated below the judges' awareness" (consistent with the existing caution technote) |
| 6 | Minor | ch06 had two uncited assertions (LIME instability; legal-document-review summary anchoring) | ✅ **Fixed** — LIME claim now cites `alvarezmelis2018robustness`; legal-review claim recast as an explicit illustration |
| 7 | Minor | 4 orphan (uncited) bib entries: `deng2013improving`, `murphy2022probabilistic`, `murphy2023probabilistic`, `bbc2024aircanada` | ✅ **Fixed** — dropped from `references.bib` |
| 8 | Cosmetic | 3 Biber `month`-field warnings (string month not sortable): `moffatt2024`, `fda2021samed`, `bea2012af447` | ✅ **Fixed** — converted to month macros (`feb`/`jan`/`jul`) |
| 9 | Optional | ch11 deep-ensemble `1/M` vs MC-dropout `1/(T-1)` estimator asymmetry undocumented | ✅ **Fixed** — footnote added explaining the sample-vs-population rationale |

**Final build: 517 pages, 0 undefined references, 0 duplicate destinations, 0 biber warnings.** No open items.

---

## Panel

| # | Reviewer | Domain |
|---|----------|--------|
| 1 | Mathematics & Formulas | Every equation across 18 appendices; the four figures' correctness |
| 2 | Content & Technical Accuracy | ML/AI claims, methods, benchmarks; faithfulness of real-source replacements |
| 3 | Writing & Narrative | Prose, voice, vignette rewrites, captions, flow |
| 4 | Citations & Bibliography | BibTeX audit; web-verification of newly-added real-source entries |

---

## Review 1 — Mathematics & Formulas

*Reviewer profile: mathematical statistician and ML methodologist; journal referee for calibration, conformal prediction, inter-rater reliability, preference learning.*

**Assessment.** The mathematics is correct and now noticeably more internally consistent than the 433-page era: aleatoric/epistemic notation is genuinely aligned across the ch01↔ch02 appendices, the deep-ensemble variance is the correct mixture form with `1/M` weighting, the calibrated-threshold result correctly drops class priors, and the RLHF/DPO/Bradley–Terry derivation is the full canonical one.

**Verified correct (selected):** aleatoric/epistemic definitions; Bayes-optimal Netflix threshold; deep-ensemble mixture variance; ECE (all versions); temperature scaling; conformal coverage; Mahalanobis OOD; calibrated optimal threshold (priors drop out); TPR/FPR/AUC; F_β; bias–variance; VC and PAC-Bayes bounds; ERM bias caveat (unusually careful); Cohen/Fleiss/weighted κ; κ-variance caveat; influence functions (Koh–Liang sign convention); Bradley–Terry / RM / PPO-KL / DPO; MC-dropout MI decomposition; IoU/mAP; information-gain ask criterion.

**Issues (all resolved):** #2 (ch15 Landis–Koch boundary discrepancy with ch12), #3 (Fig 4.2 operating-point inconsistency across panels), #9 (ch11 estimator-convention asymmetry — defensible but undocumented; the `1/M` harmonization confirmed correct). No Critical/Major.

**Figures:** Fig 1.1 (Five-Dimension loop) — faithful cyclic depiction. Fig 2.1 (reliability) — overconfident curve correctly below the diagonal. Fig 4.1 (threshold band) — correct three-way partition. Fig 4.2 (ROC+PR) — both curves faithful; the only defect was the cross-panel operating point (now fixed).

---

## Review 2 — Content & Technical Accuracy

*Reviewer profile: senior ML/AI researcher (NeurIPS/ICML/ICLR author–reviewer) with medical-AI and human-factors background.*

**Assessment.** Strong, and the real-source replacement effort is — with one exception — faithful and well-executed. Spot-checks against primary sources (Dratsch 2023, Pesapane 2026, Su 2025, Cleary 2019, Cvach 2012, Koenecke 2020) match the papers' numbers and avoid overstatement.

**Verified correct (selected):** Dratsch automation-bias collapse (82→46% experienced; 80→<20% inexperienced; n=27); Pesapane (~⅓ automation bias, saliency halves both biases); CheXNet = Rajpurkar 2017; Gaube 2021 presentation effect; Su 2025 acoustic risk flag framed as counselor aid; Cleary 2019 trainee miscalibration; Cvach 2012 ICU alarm load; AlphaFold2 pLDDT bands; active learning 30–70% label reduction; RLHF/DPO/CAI; COMPAS/ProPublica; Stureborg 2023.

**Issues (all resolved):** #1 **Major** — ch02 Koenecke misattribution (the panel's only Major; the figures and two of three accent categories were not in the cited study). #5 (ch13 Danziger provenance). #6 (ch06 uncited LIME/legal-review claims).

**Real-source replacements — fidelity:** ch06 (CheXNet/Gaube/Dratsch/Stureborg/Pesapane) faithful to the decimal — the cleanest rewrite; ch16 (Su 2025) faithful; ch17 (Cleary 2019) faithful; ch02 radiology vignette appropriately illustrative — but its Koenecke passage needed the fix above.

---

## Review 3 — Writing & Narrative

*Reviewer profile: science writer/editor (Nature; Penguin Press trade nonfiction).*

**Assessment.** In strong shape; the session's changes are net improvements. The four de-named/real-cited vignette rewrites read cleanly and preserve the conversational-but-rigorous voice — none reads as a citation dump or leaves a seam where a named character was excised. The four figures are well-drawn and well-captioned. The ch02 Five Dimensions Check is stylistically identical to its siblings.

**Strengths:** seamless vignette rewrites (ch02 radiologist, ch16 counselor, ch06 CheXNet, ch17 calibration); load-bearing cross-chapter callbacks intact (Air Canada, Goldilocks, COMPAS) with no thesis drift; self-contained captions; voice consistent across all 18 chapters.

**Issues (resolved):** #4 — the four figures were never cross-referenced from the prose (now pointed to via `\cref`). Nits noted and largely addressed: a repeated "In [year], a [team]…" opener cadence (broken in the ch02 rewrite). The ch17 `storyhook`-vs-`chapterquote` split is pre-existing and cosmetic (deferred).

**Figure captions:** all four judged strong and self-contained; Fig 4.2's is the best, explicitly teaching why PR exposes what ROC masks.

---

## Review 4 — Citations & Bibliography

*Reviewer profile: senior academic editor / bibliographer.*

**Assessment.** Clean and sound. `references.bib` resolves with **0 undefined citations**, no duplicate keys, no `\nocite`; all `\autocite`/`\textcite` keys resolve. Every load-bearing real-source replacement verifies against publisher/CrossRef records with correct DOI, year, venue, authors, and entry type.

**Verified entries (DOI/venue + year/type confirmed):** `dratsch2023automation` (Radiology, 10.1148/radiol.222176), `stureborg2023interface` (CHI '23), `pesapane2026cognitive` (Eur Radiol), `yang2022generalizability` (npj Digital Med), `su2025acoustic` (JMIR), `cleary2019calibration` (Adv Health Sci Educ), `roppolo2009agonal` (Resuscitation), `bussone2015explanations` (ICHI), `rottger2022paradigms` (NAACL), `gaube2021ai` (npj Digital Med), `landis1977kappa` (Biometrics), `cohen1960kappa` (Educ Psychol Meas).

**Issues (all resolved):** #7 (4 orphan entries dropped), #8 (3 month-field warnings fixed). The new `alvarezmelis2018robustness` entry (added for the ch06 LIME claim) resolves. Post-fix: 0 orphans among the audited set, 0 biber warnings.

---

## Consolidated Action List — COMPLETE

*All 9 action items resolved 2026-06-21.*

| # | Item | Reviewer(s) | Status |
|---|------|-------------|--------|
| 1 | ch02 Koenecke misattribution | Content | ✅ |
| 2 | ch15 kappa boundaries → Landis–Koch | Math | ✅ |
| 3 | Fig 4.2 operating-point consistency | Math | ✅ |
| 4 | Figure cross-references | Writing | ✅ |
| 5 | ch13 Danziger clause | Content | ✅ |
| 6 | ch06 LIME / legal-review citations | Content | ✅ |
| 7 | Orphan bib entries dropped | Citations | ✅ |
| 8 | Biber month-field warnings | Citations | ✅ |
| 9 | ch11 estimator footnote | Math | ✅ |

---

## Prior review (2026-04-22, 6-panel, 433-page era)

The earlier panel (Mathematics; ML/AI; Human Factors; Medical AI & Ethics; Bibliography; Writing) raised and resolved 21 items. Those resolutions were re-checked against the current build and all still hold — `gaube2021ai` cited, weighted-κ in correct form, ch15 optimal-threshold technote present, renamed keys consistent, 0 undefined references. The 2026-06-21 refresh above extends that work to the material added since.

---

*Refresh compiled 2026-06-21. Final build: 517 pages, 0 undefined references, 0 duplicate destinations, 0 biber warnings.*
