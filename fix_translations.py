#!/usr/bin/env python3
"""
Fix two issues in Sphinx-generated HTML translation pages:
1. Replace English sidebar text with translated titles (captions + chapter links)
2. Add collapsible font-size widget before </body>

Strategy for sidebar fix:
- Captions: mapped by position (part index) from _toc.yml
  - HTML has 8 captions: Parts I-VI (from toc parts 1-6) + "Case Study" + "Back"
    (toc part 7 "Back Matter" is split by Sphinx into two caption groups)
  - Both "Case Study" and "Back" map to the single translated Back Matter caption
- Titles: mapped by href basename (filename without path prefix)
  - toc `file: chapters/01_introduction` → key `01_introduction`
  - href `chapters/01_introduction.html` or `01_introduction.html` → key `01_introduction`
  - This handles the case where Sphinx uses a short title (e.g. "What Is HITL ML?")
    different from the toc title (e.g. "What Is Human-in-the-Loop ML?")
"""

import os
import re
import sys

try:
    import yaml
    HAS_YAML = True
except ImportError:
    HAS_YAML = False
    print("PyYAML not available, using manual parsing")

DIST_DIR = "/Users/laztoum/Projects/p/main/dist/site/summer/translations"
EDITIONS_DIR = "/Users/laztoum/Projects/p/main/editions/summer/translations"
LANGUAGES = ["am", "ar", "de", "el", "en", "es", "fa", "fr", "ha", "hi", "ru", "sw", "tr", "zh"]

FONT_WIDGET_SCRIPT = r"""<script>
(function () {
  var SZ_KEY = 'limen:font-size', OP_KEY = 'limen:font-ctrl';
  var STEPS = [90, 100, 115, 130];
  var idx = Math.max(0, Math.min(3, parseInt(localStorage.getItem(SZ_KEY) ?? '1', 10) || 1));
  var open = localStorage.getItem(OP_KEY) === '1';
  function applySize() { document.documentElement.style.fontSize = STEPS[idx] + '%'; localStorage.setItem(SZ_KEY, String(idx)); }
  applySize();
  document.addEventListener('DOMContentLoaded', function () {
    var dark = /^#[89a-fA-F]/.test((getComputedStyle(document.documentElement).getPropertyValue('--text') || '').trim());
    var fg = dark ? '#e2e8f0' : '#1d2935';
    var hv = dark ? 'rgba(255,255,255,0.1)' : 'rgba(13,158,142,0.1)';
    var bg = dark ? 'rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.9);border:1px solid rgba(45,62,80,0.13)';
    var w = document.createElement('div');
    w.setAttribute('role', 'toolbar'); w.setAttribute('aria-label', 'Text size');
    w.style.position = 'fixed'; w.style.bottom = '18px'; w.style.right = '18px';
    w.style.zIndex = '9999'; w.style.display = 'flex'; w.style.alignItems = 'center';
    w.style.borderRadius = '10px'; w.style.backdropFilter = 'blur(10px)';
    w.style.webkitBackdropFilter = 'blur(10px)';
    w.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
    function btn(label, title, onclick) {
      var b = document.createElement('button');
      b.textContent = label; b.title = title; b.setAttribute('aria-label', title);
      b.style.cssText = 'border:none;background:none;cursor:pointer;padding:3px 8px;border-radius:6px;font-family:inherit;font-size:.85rem;line-height:1.4;color:' + fg + ';transition:background 120ms ease';
      b.addEventListener('mouseenter', function(){ this.style.background = hv; });
      b.addEventListener('mouseleave', function(){ this.style.background = 'none'; });
      b.addEventListener('click', onclick);
      return b;
    }
    function render() {
      w.innerHTML = '';
      w.style.cssText += ';padding:' + (open ? '4px 2px 4px 6px' : '4px 6px') + ';background:' + bg;
      var toggle = btn('Aa', open ? 'Collapse text controls' : 'Text size controls', function(){
        open = !open; localStorage.setItem(OP_KEY, open ? '1' : '0'); render();
      });
      toggle.style.fontWeight = '600'; toggle.style.fontSize = '.78rem';
      w.appendChild(toggle);
      if (open) {
        var sep = document.createElement('span');
        sep.style.cssText = 'width:1px;height:16px;background:' + fg + ';opacity:.15;margin:0 2px';
        w.appendChild(sep);
        var dm = btn('A−', 'Smaller text', function(){ if(idx>0){idx--;applySize();upd();} });
        var dr = btn('A',  'Default size', function(){ idx=1; applySize();upd(); });
        var dp = btn('A+', 'Larger text',  function(){ if(idx<3){idx++;applySize();upd();} });
        [dm, dr, dp].forEach(function(b){ w.appendChild(b); });
        function upd(){ dm.style.opacity=idx===0?'.3':'1'; dm.style.pointerEvents=idx===0?'none':''; dp.style.opacity=idx===3?'.3':'1'; dp.style.pointerEvents=idx===3?'none':''; }
        upd();
      }
    }
    render();
    document.body.appendChild(w);
  });
}());
</script>
"""


def parse_toc_yaml(toc_path):
    """
    Parse _toc.yml and return list of (caption, list_of_(basename, title)) in order.
    basename = the stem of the file path (e.g. "chapters/01_introduction" -> "01_introduction").
    """
    with open(toc_path, "r", encoding="utf-8") as f:
        content = f.read()

    if HAS_YAML:
        data = yaml.safe_load(content)
        parts = data.get("parts", [])
        result = []
        for part in parts:
            caption = part.get("caption", "")
            chapters = part.get("chapters", [])
            entries = []
            for ch in chapters:
                file_path = ch.get("file", "")
                title = ch.get("title", "")
                # Extract basename (last component without extension)
                basename = os.path.basename(file_path)
                entries.append((basename, title))
            result.append((caption, entries))
        return result
    else:
        # Manual fallback
        result = []
        caption_re = re.compile(r'- caption:\s*["\']?(.*?)["\']?\s*$', re.MULTILINE)
        file_re = re.compile(r'file:\s*(\S+)', re.MULTILINE)
        title_re = re.compile(r'title:\s*["\']?(.*?)["\']?\s*$', re.MULTILINE)

        part_blocks = re.split(r'\n  - caption:', content)
        for block in part_blocks[1:]:
            lines = block.strip().split('\n')
            cap = lines[0].strip().strip('"\'')
            files = file_re.findall(block)
            titles = title_re.findall(block)
            titles = [t.strip().strip('"\'') for t in titles]
            entries = []
            for i, f in enumerate(files):
                basename = os.path.basename(f)
                t = titles[i] if i < len(titles) else ""
                entries.append((basename, t))
            result.append((cap, entries))
        return result


def href_to_key(href):
    """
    Convert an href to a lookup key (basename without .html extension).
    e.g. 'chapters/01_introduction.html' -> '01_introduction'
         '01_introduction.html' -> '01_introduction'
         '../chapters/01_introduction.html' -> '01_introduction'
    """
    basename = os.path.basename(href)
    if basename.endswith(".html"):
        basename = basename[:-5]
    return basename


def build_sidebar_mapping(lang):
    """
    Build caption_map and title_map for a language.

    caption_map: EN caption text -> translated caption text
    title_map: {href_key -> translated_title}
               key is the basename of the file without .html

    The EN toc sidebar captions (as they appear in HTML):
      Part 0 (Front Matter) -> not shown in sidebar
      Parts 1-6 -> shown directly using their caption text
      Part 7 (Back Matter) -> appears as "Case Study" (for 17_limen) and "Back" (for others)
      But in the HTML we see the captions verbatim from en/_toc.yml for parts 1-6,
      and then "Case Study" and "Back" for part 7.

    IMPORTANT: The sidebar captions are exactly as in _toc.yml for parts 1-6.
    The "Case Study" and "Back" groups are how Sphinx chose to split part 7.
    We map both to the single translated back matter caption from lang toc.
    """
    en_toc_path = os.path.join(EDITIONS_DIR, "en", "_toc.yml")
    lang_toc_path = os.path.join(EDITIONS_DIR, lang, "_toc.yml")

    en_parts = parse_toc_yaml(en_toc_path)
    lang_parts = parse_toc_yaml(lang_toc_path)

    caption_map = {}
    # href_key -> translated title
    title_key_map = {}

    n_parts = min(len(en_parts), len(lang_parts))

    # Caption mapping
    # Parts 1-6: direct match by position
    for i in range(1, min(7, n_parts)):
        en_cap = en_parts[i][0]
        lang_cap = lang_parts[i][0]
        if en_cap and lang_cap:
            caption_map[en_cap] = lang_cap

    # Part 7 (Back Matter): HTML shows "Case Study" and "Back"
    # Both map to the translated back matter caption
    if n_parts > 7:
        back_translated = lang_parts[7][0]
        caption_map["Case Study"] = back_translated
        caption_map["Back"] = back_translated

    # Title mapping by href key (basename)
    # Build key -> translated_title from lang toc (all parts, skip Front Matter = part 0)
    for i in range(1, n_parts):
        lang_entries = lang_parts[i][1]
        for basename, lang_title in lang_entries:
            if basename and lang_title:
                title_key_map[basename] = lang_title

    return caption_map, title_key_map


def replace_sidebar_captions(html, caption_map):
    """Replace <span class="caption-text">EN_CAP</span> -> translated."""
    def replacer(m):
        en_cap = m.group(1)
        translated = caption_map.get(en_cap, en_cap)
        return f'<span class="caption-text">{translated}</span>'

    return re.sub(
        r'<span class="caption-text">([^<]+)</span>',
        replacer,
        html
    )


def replace_sidebar_links(html, title_key_map):
    """
    Replace link text in toctree-l1 sidebar items using href-based lookup.
    Only replaces links inside <li class="toctree-l1"> elements.
    Leaves nav-link (page-internal heading) links untouched by only matching
    within toctree-l1 list items.
    """
    def link_replacer(m):
        href = m.group(1)
        link_text = m.group(2)
        key = href_to_key(href)
        translated = title_key_map.get(key, link_text)
        return f'<li class="toctree-l1"><a class="reference internal" href="{href}">{translated}</a>'

    return re.sub(
        r'<li class="toctree-l1"><a class="reference internal" href="([^"]+)">([^<]+)</a>',
        link_replacer,
        html
    )


def add_font_widget(html):
    """Add font-size widget before </body> if not already present."""
    if "limen:font-size" in html:
        return html, False
    html = html.replace("</body>", FONT_WIDGET_SCRIPT + "</body>", 1)
    return html, True


def get_html_files(lang_dist_dir):
    files = []
    for root, dirs, filenames in os.walk(lang_dist_dir):
        for fname in sorted(filenames):
            if fname.endswith(".html"):
                files.append(os.path.join(root, fname))
    return sorted(files)


def process_language(lang):
    lang_dist_dir = os.path.join(DIST_DIR, lang)
    if not os.path.isdir(lang_dist_dir):
        return 0, 0, [f"dist dir not found: {lang_dist_dir}"]

    caption_map = {}
    title_key_map = {}
    errors = []

    if lang != "en":
        try:
            caption_map, title_key_map = build_sidebar_mapping(lang)
        except Exception as e:
            errors.append(f"Failed to build mapping: {e}")

    html_files = get_html_files(lang_dist_dir)
    sidebar_fixed = 0
    widget_added = 0

    for fpath in html_files:
        try:
            with open(fpath, "r", encoding="utf-8") as f:
                original = f.read()

            modified = original

            # Fix 1: sidebar (non-en only)
            if lang != "en":
                modified = replace_sidebar_captions(modified, caption_map)
                modified = replace_sidebar_links(modified, title_key_map)
                if modified != original:
                    sidebar_fixed += 1

            # Fix 2: font widget
            modified, widget_inserted = add_font_widget(modified)
            if widget_inserted:
                widget_added += 1

            if modified != original:
                with open(fpath, "w", encoding="utf-8") as f:
                    f.write(modified)

        except Exception as e:
            errors.append(f"{os.path.relpath(fpath, lang_dist_dir)}: {e}")

    return sidebar_fixed, widget_added, errors


def main():
    print(f"Processing {len(LANGUAGES)} languages...")
    print(f"PyYAML available: {HAS_YAML}")
    print()

    total_sidebar = 0
    total_widget = 0
    summary = []

    for lang in LANGUAGES:
        print(f"[{lang}] Processing...")
        sidebar_fixed, widget_added, errors = process_language(lang)
        total_sidebar += sidebar_fixed
        total_widget += widget_added

        if errors:
            for err in errors:
                print(f"  ERROR: {err}")

        if lang == "en":
            label = "(skipped sidebar — English)"
        else:
            label = f"sidebar text updated in {sidebar_fixed} files"
        print(f"  Widget: {widget_added} files; {label}")
        summary.append((lang, sidebar_fixed, widget_added, errors))

    print()
    print("=" * 65)
    print("SUMMARY")
    print("=" * 65)
    print(f"{'Lang':<6} {'Sidebar files':<22} {'Widget files':<16} {'Errors'}")
    print("-" * 65)
    for lang, sf, wa, errs in summary:
        err_str = str(len(errs)) if errs else "-"
        sidebar_str = "skipped (en)" if lang == "en" else str(sf)
        print(f"{lang:<6} {sidebar_str:<22} {wa:<16} {err_str}")
    print("-" * 65)
    print(f"{'TOTAL':<6} {total_sidebar:<22} {total_widget:<16}")
    print()

    # Spot check: show el mapping
    print("Spot-check — Greek (el) mappings:")
    try:
        cap_map, key_map = build_sidebar_mapping("el")
        print("  Captions:")
        for k, v in list(cap_map.items()):
            print(f"    '{k}' -> '{v}'")
        print("  Title keys (sample):")
        for k, v in list(key_map.items())[:8]:
            print(f"    '{k}' -> '{v}'")
    except Exception as e:
        print(f"  Error: {e}")

    # Verify actual HTML result for el
    print()
    print("Verification — el/intro.html sidebar after fix:")
    import re as _re
    with open(os.path.join(DIST_DIR, "el", "intro.html"), "r", encoding="utf-8") as f:
        html = f.read()
    captions = _re.findall(r'<span class="caption-text">([^<]+)</span>', html)
    links = _re.findall(r'<li class="toctree-l1"><a class="reference internal" href="([^"]+)">([^<]+)</a>', html)
    print("  Captions in sidebar:", captions)
    print("  Links:")
    for href, title in links:
        print(f"    {href:45s} -> {title}")


if __name__ == "__main__":
    main()
