# Winter Edition — Complete

**Human in the Loop: Misunderstood** — the full Winter textbook edition.

**Status: COMPLETE**

---

## Contents

| Component | Count | Location |
|-----------|-------|----------|
| Chapters (LaTeX) | 18 | `latex/chapters/ch01.tex` … `ch18.tex` |
| Technical appendices | 18 | `latex/appendices/ch01_appendix.tex` … |
| Teacher's guides | 18 | `latex/teaching/ch01_teacher.tex` … |
| Solutions manuals | 18 | `latex/teaching/ch01_solutions.tex` … |
| Frontmatter | 4 | `latex/frontmatter/` (titlepage, preface, acknowledgments, legend) |
| Backmatter | 2 | `latex/backmatter/` (glossary, about) |
| Bibliography | ~90 entries | `latex/references.bib` |
| Index | generated | `latex/indexstyle.ist` |
| Companion docs (Markdown) | 18 ch × 6 files | `chapters/ch1/` … `chapters/ch18/` |

Pre-built PDF: `latex/main.pdf`

Build verified on 2026-04-29: `make winter` completes successfully and produces the current 497-page PDF.

---

## Build

**Requirements:** LuaLaTeX, Biber, Libertinus fonts, JetBrains Mono

```bash
# From repo root:
make winter

# Or manually:
cd editions/winter/latex
lualatex -interaction=nonstopmode main.tex
biber main
makeindex main.idx -s indexstyle.ist
lualatex -interaction=nonstopmode main.tex
lualatex -interaction=nonstopmode main.tex
```

---

## Format

- Paper: 6×9 in (standard trade paperback)
- Body font: Libertinus Serif 11pt
- Headings: Libertinus Sans
- Code: JetBrains Mono
- Document class: `scrbook`
- Build engine: LuaLaTeX + Biber + makeindex
