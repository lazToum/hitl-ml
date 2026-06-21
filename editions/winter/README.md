# Winter Edition — Complete

**Human in the Loop: Misunderstood** — the full Winter textbook edition.

**Status: COMPLETE**

---

## Contents

| Component | Count | Location |
|-----------|-------|----------|
| Chapters (LaTeX) | 19 | `latex/chapters/ch01.tex` … `ch19.tex` |
| Technical appendices | 19 | `latex/appendices/ch01_appendix.tex` … |
| Teacher's guides | 19 | `latex/teaching/ch01_teacher.tex` … |
| Solutions manuals | 19 | `latex/teaching/ch01_solutions.tex` … |
| Frontmatter | 4 | `latex/frontmatter/` (titlepage, preface, acknowledgments, legend) |
| Backmatter | 2 | `latex/backmatter/` (glossary, about) |
| Bibliography | ~145 entries | `latex/references.bib` |
| Index | generated | `latex/indexstyle.ist` |
| Companion docs (Markdown) | retired | archived to gitignored `.local/winter-chapters-md/` (June 2026) |

Pre-built PDF: `latex/main.pdf`

Build verified on 2026-07-19: `make winter` completes cleanly and produces the current 541-page PDF.

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
