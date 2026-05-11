# Contributing to HITL: Misunderstood

Thanks for reading. This is a book project, so contributions look different
from a typical software repo.

## What's in scope

- **Corrections** — factual errors, broken math, incorrect citations, broken
  code examples
- **Accessibility** — fixes to HTML rendering, screen-reader compatibility,
  missing alt text
- **Build fixes** — Makefile, Jupyter Book config, LaTeX compilation issues
- **Translation corrections** — the machine-generated translations (all except
  English and Greek) are known to be imperfect; corrections are welcome
- **Spring platform bugs** — the interactive platform backend and frontend

## What's out of scope

- Additions or rewrites to book content — the editorial voice and structure
  are intentional; open an issue to discuss before investing effort
- New translations — coordinate via an issue first
- Reader app feature requests — open an issue to gauge interest

## How to contribute

1. Fork the repo and create a branch from `main`.
2. For book content: edit the relevant `.md` file in `editions/summer/chapters/`
   or `editions/winter/latex/chapters/`. Run `make summer` or `make winter`
   to verify it builds.
3. For code: run the relevant linter / test suite before opening a PR.
4. Open a PR with a clear description. For citation or math corrections,
   include a reference to the source you're correcting against.

## Content license

Book content is licensed under [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/).
By contributing content you agree to release it under the same terms.

Code contributions (Spring platform, reader app, build scripts) are licensed
under [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0).

See [LICENSE.md](LICENSE.md) for the full breakdown.
