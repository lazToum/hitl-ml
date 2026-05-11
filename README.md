# Human in the Loop: Misunderstood

[![GitHub](https://img.shields.io/badge/GitHub-lazToum%2Fhitl--ml-181717?logo=github)](https://github.com/lazToum/hitl-ml)
[![GitLab](https://img.shields.io/badge/GitLab-lazToum%2Fhitl--ml-FC6D26?logo=gitlab)](https://gitlab.com/lazToum/hitl-ml)
[![Site](https://img.shields.io/badge/what--if.io-online-0d9e8e)](https://what-if.io)

A book about the relationship between humans and intelligent systems — why even the most capable AI needs to know when to ask for help, and why the humans who answer those questions are doing something more important than they realize.

**Status:** Winter, Summer, and Autumn are in good release shape. Spring now builds and boots in Docker, but it still needs manual browser/mobile validation before it should be treated as fully complete. The translation set also still needs cleanup before it should be treated as uniformly complete.

---

## What This Book Is

*Human in the Loop* is a full-length non-fiction book for technically curious readers, data science students, and practitioners who work alongside AI systems. It takes a story-first approach: each chapter opens with a real-world example and builds from there into the concepts.

The analytical backbone is the **Five-Dimension Framework**, introduced in Chapter 1:

| Dimension | Key Question |
|-----------|-------------|
| **Uncertainty Detection** | Can the system recognize when it is unsure? |
| **Intervention Design** | How does it ask for help? |
| **Timing** | When does it ask — too early, too late, or just right? |
| **Stakes Calibration** | Does it understand the consequences of being wrong? |
| **Feedback Integration** | Does it learn from the responses it receives? |

---

## Editions

| Edition | Directory | Format | Description |
|---------|-----------|--------|-------------|
| **Spring** | `editions/spring/` | FastAPI + Rust + React + Flutter + PDF guide | Interactive scavenger-hunt platform |
| **Summer** | `editions/summer/` | Jupyter Book HTML + PDF | Interactive HTML edition with 17 MyST chapters |
| **Autumn** | `editions/autumn/` | HTML (self-contained) + PDF | "Misunderstood" pamphlet — open directly in browser |
| **Winter** | `editions/winter/` | LaTeX PDF (6×9) | Main textbook: 18 chapters + appendices + teaching package |
| **Translations** | `editions/summer/translations/` | Jupyter Book HTML | 13 localized editions plus English reference: ar de el es fa fr ha hi ru sw tr zh am + en |
| **Editions Overview** | `overview/` | LaTeX PDF | 14-page document introducing all editions |

---

## Chapter Maps

The editions do not share one universal chapter table. Winter is the 18-chapter textbook with LaTeX chapters, technical appendices, teacher guides, solutions, and annotated bibliographies. Summer is a 17-chapter Jupyter Book workbook with its own taxonomy. Spring is a 15-chapter platform guide. Use each edition's `_toc.yml`, `main.tex`, or local README as the source of truth for that edition.

---

## Structure

```
editions/
  spring/                    # Interactive scavenger-hunt/game platform
    backend-python/          # FastAPI backend
    backend-rust/            # Rust/Axum backend
    web/                     # React frontend
    mobile/                  # Flutter app
    db/ zitadel/
    project_guide.tex        # Spring edition PDF source
    project_guide.pdf

  summer/                    # Jupyter Book HTML edition
    _config.yml / _toc.yml
    chapters/                # 17 MyST Markdown chapters
    _static/ / back/ / references.bib
    translations/            # Summer-format localized editions
      en/                    # English reference (base for all translations)
      ar/ de/ el/ es/ fa/ fr/ ha/ hi/ ru/ sw/ tr/ zh/ am/

  autumn/                    # "Misunderstood" pamphlet (zero-dependency)
    index.html               # Open directly in any browser — no build required
    source.md
    hitl_autumn_edition.pdf

  winter/                    # LaTeX 18-chapter trade paperback
    latex/                   # main.tex, preamble.tex, chapters/, appendices/, teaching/
    chapters/ch1/…ch18/      # Markdown companion packages

web/
  reader/                    # React reader (TTS, ambient audio, 12 games)
    src/ public/ package.json vite.config.ts

companion/                   # Standalone companion docs (Markdown)
  HITL_Misunderstood.md
  HITL_Misunderstood_Summer.md
  HITL_Winter_is_Coming.md
  HITL_Winter_is_Coming_Solutions.md
  HITL_Winter_is_Coming_Teachers.md
  HITL_Autumn_Before_You_Ship.md

overview/                    # Editions overview document
  editions_overview.tex
  editions_overview.pdf

reviews/                     # Expert and seasonal review documents
  expert_reviews.md
  summer_reviews.md
  winter_reviews.md
  translations_reviews.md

build/
  scripts/inject_html_links.py
  compat/imghdr.py           # Python 3.13 stdlib shim

dist/                        # Pre-built deliverables
  hitl_ml_handbook.pdf
  hitl_summer_edition.pdf
  reader_app/
  site/downloads/            # Per-edition PDFs
    spring/hitl_spring_guide.pdf
    summer/hitl_summer_edition.pdf
    autumn/hitl_autumn_edition.pdf
    winter/hitl_winter_edition.pdf
    overview/editions_overview.pdf

Makefile
requirements.txt
```

---

## Quick Start

```bash
# Install Python deps
make install

# Build Summer edition (HTML)
make summer

# Build Winter edition (LaTeX PDF)
make winter

# Open Autumn pamphlet (no build needed)
make autumn           # or: open editions/autumn/index.html

# Build Autumn PDF
make autumn-pdf

# Build and serve Summer interactively
make summer-serve

# Build React reader app
make reader-install && make reader

# Build all editions + translations
make build-all

# Full deliverable bundle (PDFs + HTML + reader app)
make zip-full
```

---

## Building Winter (LaTeX)

**Requirements:** LuaLaTeX, Biber, Libertinus fonts, JetBrains Mono

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

---

## Expert Reviews

See `reviews/expert_reviews.md` for the six-panel scientific review (math, ML/AI, human factors, medical AI/ethics, bibliography, writing quality) conducted 2026-04-22.

---

## Status

| Component | Status |
|-----------|--------|
| 18 Chapters (Markdown + LaTeX) | Complete |
| 18 Technical Appendices | Complete |
| 36 Teaching Files (guide + solutions) | Complete |
| Summer Edition (Jupyter Book HTML) | Complete |
| Autumn Edition (HTML pamphlet + PDF) | Complete |
| Winter Edition (LaTeX trade paperback) | Complete |
| Spring Edition PDF guide | Complete |
| Spring platform codebase | Build-verified |
| Spring platform runtime | Docker-boot verified; auth/browser/mobile validation still needed |
| Translations (13 localized + English reference) | Mixed; shared assets restored, review cleanup still needed |
| Editions Overview PDF | Complete |
| React Reader App | Complete |
| Code Examples: Ch 1 | Complete |
| Code Examples: Ch 2–18 | Pending |

---

## A note on authorship

The content across all editions was produced with substantial AI assistance and fully reviewed by the author. The translations have only been validated for English and Greek; all other language editions are machine-generated and unreviewed.

## License

**Content** (chapters, appendices, companion docs, PDFs) — [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/)

**Code** (Spring platform, Reader app, build scripts) — [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0)

Limen OS is a companion project in its own repository: [github.com/lazToum/limen-os](https://github.com/lazToum/limen-os)

See [LICENSE.md](LICENSE.md) for the full breakdown.

© 2026 Lazaros Toumanidis
