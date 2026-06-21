#!/usr/bin/env python3
"""Cite-key resolution gate for all Jupyter Book trees with a references.bib.

For every tree that has both markdown sources and a references.bib:
  - every citation key used in .md files (`[@key]`, `{cite}`key``) must exist
    in that tree's references.bib  -> ERROR (exit 1)
  - bib entries never cited are reported as a WARNING (exit 0)

Usage: python3 build/scripts/check_citations.py
"""
import os
import re
import sys

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

TREES = ["editions/summer"] + sorted(
    os.path.join("editions/summer/translations", d)
    for d in os.listdir(os.path.join(REPO_ROOT, "editions/summer/translations"))
    if os.path.isdir(os.path.join(REPO_ROOT, "editions/summer/translations", d))
)

BIB_ENTRY = re.compile(r"@\w+\{([^,\s]+)")
MD_CITES = re.compile(r"\[@([^\]]+)\]|\{cite\}`([a-zA-Z0-9_:\-]+)`")
SKIP_DIRS = {"_build", "_static", ".git", "node_modules", "translations"}

errors = 0
for tree in TREES:
    root = os.path.join(REPO_ROOT, tree)
    bib_path = os.path.join(root, "references.bib")
    if not os.path.isfile(bib_path):
        continue
    keys = set(BIB_ENTRY.findall(open(bib_path, encoding="utf-8").read()))
    used = set()
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        for fn in filenames:
            if not fn.endswith(".md"):
                continue
            text = open(os.path.join(dirpath, fn), encoding="utf-8").read()
            for m in MD_CITES.finditer(text):
                if m.group(2):
                    used.add(m.group(2))
                else:  # bracket form: [@key] or [@key1; @key2]
                    used.update(k.strip().lstrip("@").strip() for k in m.group(1).split(";"))
    missing = sorted(used - keys)
    orphan = sorted(keys - used)
    if missing:
        errors += len(missing)
        print(f"ERROR {tree}: {len(missing)} unresolved cite key(s): {', '.join(missing)}")
    if orphan:
        print(f"warn  {tree}: {len(orphan)} uncited bib entr(y/ies): {', '.join(orphan)}")
    if not missing and not orphan:
        print(f"ok    {tree}: {len(used)} cited key(s), all resolve")

sys.exit(1 if errors else 0)
