"""
Inject a "read interactive version" footer into each summer chapter.
Safe to re-run: strips and re-injects so URL changes are picked up.

Usage:
  python3 build/scripts/inject_html_links.py
  python3 build/scripts/inject_html_links.py https://hitl-summer.netlify.app
  SUMMER_URL=https://hitl-summer.netlify.app make summer-pdf
"""
import os, pathlib, sys

CHAPTERS_DIR = pathlib.Path(__file__).parent.parent.parent / "editions" / "summer" / "chapters"
MARKER = "<!-- html-link-injected -->"

# URL priority: CLI arg → env var → None (use relative zip path)
base_url = sys.argv[1] if len(sys.argv) > 1 else os.environ.get("SUMMER_URL", "").rstrip("/")

def link_text(slug: str) -> str:
    if base_url:
        url = f"{base_url}/chapters/{slug}.html"
        return (
            f"*Read the interactive version of this chapter online:* "
            f"[{url}]({url}) "
            f"(word search, games, audio)"
        )
    return (
        f"*Interactive version (word search, games):* open "
        f"`summer_interactive/chapters/{slug}.html` "
        f"from the accompanying zip archive."
    )

LINK_BLOCK = (
    "\n\n<!-- html-link-injected -->\n"
    "```{{only}} latex\n"
    "{text}\n"
    "```\n"
)

for md in sorted(CHAPTERS_DIR.glob("*.md")):
    text = md.read_text()
    # strip any previous injection
    idx = text.find(MARKER)
    clean = text[:idx].rstrip() if idx != -1 else text.rstrip()
    slug = md.stem
    md.write_text(clean + LINK_BLOCK.format(text=link_text(slug)))
    action = "updated" if idx != -1 else "injected"
    print(f"  {action} → {md.name}")

print(f"done.  url={'<relative zip path>' if not base_url else base_url}")
