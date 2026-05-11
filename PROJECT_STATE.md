# Human in the Loop: Project State

**Title:** Human in the Loop: Misunderstood  
**Date of this document:** 2026-04-28

---

## Overview

A full-length non-fiction book on human-in-the-loop (HITL) machine learning systems. Story-driven approach: accessible narrative prose per chapter, rigorous technical content in per-chapter appendices, complete instructor's package for academic use. Central analytical tool: the **Five-Dimension Framework** introduced in Chapter 1.

Aimed at technically curious general readers, students in data science or AI ethics courses, and practitioners who work alongside ML systems. Usable as a standalone textbook.

Also includes companion documents, translations, and web packaging around the four seasonal editions.

---

## Series Structure

| Edition | Directory | Format | Description | Status |
|---------|-----------|--------|-------------|--------|
| **Winter (Main Textbook)** | `editions/winter/` | LaTeX PDF, 18 chapters | Full book with technical appendices and teaching materials | ✅ Complete |
| **Summer** | `editions/summer/` | Jupyter Book HTML + PDF | Interactive HTML with 17 MyST chapters | ✅ Complete |
| **Spring** (platform) | `editions/spring/` | FastAPI + Rust + React + Flutter | Scavenger-hunt/game platform | ✅ Complete |
| **Autumn Pamphlet** ("Misunderstood") | `editions/autumn/` | HTML (self-contained) + PDF | Pamphlet for annotation teams; corrects 6 misconceptions | ✅ Complete |
| **Companion Docs** | `companion/` | Markdown | Spring / Summer / Autumn / Winter supporting docs | ✅ Complete |
| **Editions Overview** | `overview/` | LaTeX PDF | Single PDF introducing all editions | ✅ Complete |

---

## Five-Dimension Framework

The analytical core of the book, introduced in Chapter 1 and applied throughout.

| Dimension | Key Question | What It Evaluates |
|-----------|-------------|-------------------|
| **Uncertainty Detection** | Can the system recognize when it is unsure? | Does the model know its own limits? |
| **Intervention Design** | How does it ask for help? | Is the ask well-formed and appropriately timed? |
| **Timing** | When does it ask? | Too early (unnecessary), too late (useless), or just right? |
| **Stakes Calibration** | Does it understand consequences? | Are high-stakes errors treated differently from low-stakes ones? |
| **Feedback Integration** | Does it learn from the responses it receives? | Are corrections incorporated, or discarded? |

---

## Chapter Status

Winter's 18 textbook chapters are complete in LaTeX with per-chapter appendices, teacher guides, and solutions. Summer's 17 workbook chapters are complete in MyST/Jupyter Book format. Spring's 15 platform-guide chapters are complete as a build/project guide. These editions use different chapter maps; use `editions/winter/latex/main.tex`, `editions/summer/_toc.yml`, and `editions/spring/_toc.yml` as the source of truth.

---

## File Inventory

### LaTeX (`editions/winter/latex/`)

**Root:**
- `main.tex` — master document with all `\input{}` calls and edition flags
- `preamble.tex` — Libertinus fonts, color palette, custom tcolorbox environments
- `references.bib` — BibLaTeX bibliography
- `copyright.tex` — copyright page
- `indexstyle.ist` — index formatting

**Frontmatter (`editions/winter/latex/frontmatter/`):** `titlepage.tex`, `preface.tex`, `acknowledgments.tex`, `legend.tex`

**Chapters (`editions/winter/latex/chapters/`):** `ch01.tex` – `ch18.tex`

**Appendices (`editions/winter/latex/appendices/`):** `ch01_appendix.tex` – `ch18_appendix.tex`

**Teaching (`editions/winter/latex/teaching/`):** `ch01_teacher.tex` + `ch01_solutions.tex` × 18 chapters = 36 files (complete)

**Backmatter (`editions/winter/latex/backmatter/`):** `glossary.tex`, `about.tex`

**Editions Overview (`overview/`):** `editions_overview.tex` + compiled `editions_overview.pdf`

**Build artifacts (gitignored):** `main.pdf`, `*.aux`, `*.bbl`, `*.bcf`, `*.blg`, `*.idx`, `*.ilg`, `*.ind`, `*.log`, `*.run.xml`, `*.synctex.gz`, `*.toc`

### Markdown (`editions/winter/chapters/`)

Each of the 18 chapter directories (`ch1/`–`ch18/`) contains 6 files:

| Suffix | Content |
|--------|---------|
| `Ch*_final.md` | Chapter prose |
| `Ch*A_final.md` | Technical appendix with Python code and math |
| `Ch*T_updated.md` | Teacher's guide |
| `C*AM_updated.md` | Discussion question solutions |
| `Ch*AS_updated.md` | Technical exercise solutions |
| `Ch*_References.md` | Annotated bibliography |

**Companion editions (`companion/`):**
- `HITL_Misunderstood.md` — Autumn: six misconceptions pamphlet (companion to the Autumn edition)
- `HITL_Misunderstood_Summer.md` — Summer: activity workbook
- `HITL_Winter_is_Coming.md` — Winter: exam study companion
- `HITL_Winter_is_Coming_Solutions.md` — Winter answer key
- `HITL_Winter_is_Coming_Teachers.md` — Winter instructor notes

### Autumn Pamphlet (`editions/autumn/`)
- `editions/autumn/index.html` — Self-contained editorial HTML/CSS pamphlet ✅
- `editions/autumn/source.md` — Markdown source
- `editions/autumn/hitl_autumn_edition.pdf` — Compiled pamphlet PDF

### Reader App (`web/reader/`)
- React + Vite + TypeScript standalone reader
- TTS, ambient audio, 12 games (Bowling, BubbleShooter, Chess, Crossword, DotToDot, Hangman, Minesweeper, Pacman, Pong, Pool, Snake, Solitaire)
- Pre-built deliverable: `dist/reader_app/`

---

## Build Instructions

### Requirements
- LuaLaTeX or XeLaTeX
- Biber
- Fonts: Libertinus Serif, Libertinus Sans, Libertinus Math, JetBrains Mono
- Python 3.10+ with Jupyter Book (`pip install -r requirements.txt`)
- Node.js 18+ (reader app only)

### Winter (LaTeX)
```bash
make winter
# or manually:
cd editions/winter/latex
lualatex -interaction=nonstopmode main.tex
biber main
makeindex main.idx -s indexstyle.ist
lualatex -interaction=nonstopmode main.tex
lualatex -interaction=nonstopmode main.tex
```

### Edition Flags (in `editions/winter/latex/main.tex`)
```latex
\printeditiontrue      % 6"×9" trade paperback
% \ebookeditiontrue    % Screen-optimized, single-sided
% \thesiseditiontrue   % US Letter, extra binding margin
```

### Summer (Jupyter Book)
```bash
make install
make summer
make summer-serve   # serve at http://localhost:8081
```

### Autumn Pamphlet (HTML + PDF)
```bash
open editions/autumn/index.html
make autumn-pdf
```

### Editions Overview PDF
```bash
make overview
```

---

## Current State

| Area | Status | Notes |
|------|--------|-------|
| Winter publication frontmatter | ✅ Complete | Title page, copyright page, preface, and author page are now populated |
| Winter PDF build | ✅ Verified | `make winter` completed on 2026-04-29; current output is `editions/winter/latex/main.pdf` |
| Summer core edition | ✅ Verified | `make summer` builds the main HTML edition successfully; warning volume is dominated by translation pages |
| Autumn pamphlet | ✅ Verified | HTML is self-contained and the PDF was rebuilt from current source on 2026-04-29 |
| Spring guide PDF | ✅ Verified | `make spring-guide` rebuilt `editions/spring/project_guide.pdf` on 2026-04-29 |
| Spring backend code | ✅ Verified | `SQLX_OFFLINE=true cargo check` succeeds after replacing the stale cached delete-query path |
| Spring web dashboard | ✅ Verified | `npm run build` succeeds in `editions/spring/web` |
| Spring platform runtime | ✅ Complete | All code verified; runtime validation (OIDC credentials, LLM key, mobile app) is human-gated — see HUMAN_TODO.md |
| Translations | ⚠ Mixed | Shared assets are present; translation reviews are still incomplete and localized builds may emit language-scope warnings |
| Companion docs | ✅ Complete | `companion/` contains the Spring, Summer, Autumn, and Winter companion material |
| Reader app | ✅ Complete | `web/reader/` ships a standalone React reader for Summer content |
| Web: Summer / Winter study companions | Optional | The source material exists in `companion/`; further web packaging would be a new deliverable, not a Winter blocker |
| Additional code-example expansion | Optional | Existing appendix material is sufficient for Winter completeness; further standalone code extraction is enhancement work |
