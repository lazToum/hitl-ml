#!/usr/bin/env python3
"""Crawl dist/site for broken internal links/assets. Exit 1 if any are found.

Run after build/scripts/assemble_site.sh. Used as a CI guard so a bad relative
path or a removed asset blocks the deploy instead of shipping broken pages.

Resolution rules:
  - http(s)://, //, mailto:, data:, #, javascript:, tel:  → external, skipped
  - {{ ... }}                                              → template literal, skipped
  - /abs/path   → resolved from the site root
  - rel/path    → resolved from the containing file's directory
  - a dir (or trailing /) → also tries <dir>/index.html
Excludes *webpack-macros.html (sphinx-book-theme jinja partials, not real pages).
"""
import os, re, sys, html, urllib.parse

ROOT = sys.argv[1] if len(sys.argv) > 1 else "dist/site"
HREF = re.compile(r'(?:href|src)\s*=\s*["\']([^"\']+)["\']', re.I)
SKIP_PREFIX = ("http://", "https://", "//", "mailto:", "data:", "#", "javascript:", "tel:", "{{")

broken = {}
pages = 0
for dp, _, fs in os.walk(ROOT):
    for fn in fs:
        if not fn.endswith(".html") or "webpack-macros" in fn:
            continue
        p = os.path.join(dp, fn)
        pages += 1
        try:
            txt = open(p, encoding="utf-8", errors="ignore").read()
        except OSError:
            continue
        for m in HREF.findall(txt):
            u = html.unescape(m).strip()
            if not u or u.startswith(SKIP_PREFIX):
                continue
            path = urllib.parse.urlparse(u).path
            if not path:
                continue
            tgt = os.path.normpath(ROOT + path) if path.startswith("/") \
                else os.path.normpath(os.path.join(dp, path))
            cand = [tgt]
            if tgt.endswith("/") or os.path.isdir(tgt):
                cand.append(os.path.join(tgt, "index.html"))
            if not any(os.path.exists(c) for c in cand):
                broken.setdefault(os.path.relpath(p, ROOT), set()).add(u)

if broken:
    print(f"✗ broken internal links in {ROOT} ({pages} pages scanned):\n")
    for page in sorted(broken):
        for u in sorted(broken[page]):
            print(f"  {page}  →  {u}")
    sys.exit(1)
print(f"✓ no broken internal links ({pages} pages scanned)")
