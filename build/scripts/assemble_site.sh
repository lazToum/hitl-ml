#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
DIST_SITE="$ROOT/dist/site"

rm -rf "$DIST_SITE"
mkdir -p "$DIST_SITE"

mkdir -p "$DIST_SITE/overview" "$DIST_SITE/assets" "$DIST_SITE/winter" "$DIST_SITE/companion" "$DIST_SITE/companion/docs"

cp "$ROOT/site/overview/index.html" "$DIST_SITE/index.html"
cp -R "$ROOT/site/overview/." "$DIST_SITE/overview/"
cp -R "$ROOT/site/styles" "$DIST_SITE/"
cp -R "$ROOT/site/assets" "$DIST_SITE/" 2>/dev/null || true

if [ -d "$ROOT/editions/summer/_build/html" ]; then
  cp -R "$ROOT/editions/summer/_build/html" "$DIST_SITE/summer"
fi

if [ -f "$ROOT/editions/autumn/index.html" ]; then
  mkdir -p "$DIST_SITE/autumn"
  cp "$ROOT/editions/autumn/index.html" "$DIST_SITE/autumn/index.html"
fi

if [ -d "$ROOT/web/reader/dist" ]; then
  cp -R "$ROOT/web/reader/dist" "$DIST_SITE/reader"
fi

cp -R "$ROOT/editions/winter/web/." "$DIST_SITE/winter/"
cp -R "$ROOT/companion/web/." "$DIST_SITE/companion/"
cp "$ROOT"/companion/*.md "$DIST_SITE/companion/docs/"

mkdir -p "$DIST_SITE/downloads/winter" "$DIST_SITE/downloads/spring" "$DIST_SITE/downloads/autumn" "$DIST_SITE/downloads/summer" "$DIST_SITE/downloads/overview"

[ -f "$ROOT/editions/winter/latex/main.pdf" ] && cp "$ROOT/editions/winter/latex/main.pdf" "$DIST_SITE/downloads/winter/hitl_winter_edition.pdf"
[ -f "$ROOT/editions/spring/project_guide.pdf" ] && cp "$ROOT/editions/spring/project_guide.pdf" "$DIST_SITE/downloads/spring/hitl_spring_edition.pdf"
[ -f "$ROOT/editions/autumn/hitl_autumn_edition.pdf" ] && cp "$ROOT/editions/autumn/hitl_autumn_edition.pdf" "$DIST_SITE/downloads/autumn/hitl_autumn_edition.pdf"
[ -f "$ROOT/dist/hitl_summer_edition.pdf" ] && cp "$ROOT/dist/hitl_summer_edition.pdf" "$DIST_SITE/downloads/summer/hitl_summer_edition.pdf"
[ -f "$ROOT/overview/editions_overview.pdf" ] && cp "$ROOT/overview/editions_overview.pdf" "$DIST_SITE/downloads/overview/editions_overview.pdf"

printf 'Assembled static site at %s\n' "$DIST_SITE"
