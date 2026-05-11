/**
 * Interactive Word Search — Summer Edition
 * Finds <code class="language-wordsearch"> blocks and replaces them
 * with a clickable, drag-to-select grid.
 *
 * Format inside the fenced block:
 *   WORDS: WORD1,WORD2,...
 *   (blank line)
 *   A B C D E ...   <- grid rows, space-separated letters
 */
(function () {
  'use strict';

  /* ── Parser ───────────────────────────────────────────── */
  function parse(text) {
    const lines  = text.trim().split('\n');
    const words  = [];
    const grid   = [];

    for (const line of lines) {
      const t = line.trim();
      if (t.toUpperCase().startsWith('WORDS:')) {
        t.slice(6).split(',').forEach(w => {
          const clean = w.trim().replace(/\s+/g, '').toUpperCase();
          if (clean) words.push(clean);
        });
      } else {
        const row = t.toUpperCase().split(/\s+/).filter(ch => /^[A-Z]$/.test(ch));
        if (row.length > 1) grid.push(row);
      }
    }
    return { words, grid };
  }

  /* ── Cell-line helper ─────────────────────────────────── */
  function cellsInLine(r1, c1, r2, c2, rows, cols) {
    const dr = Math.sign(r2 - r1);
    const dc = Math.sign(c2 - c1);
    if (dr === 0 && dc === 0) return [[r1, c1]];
    const adR = Math.abs(r2 - r1), adC = Math.abs(c2 - c1);
    if (dr !== 0 && dc !== 0 && adR !== adC) return null;
    const result = [];
    let r = r1, c = c1;
    for (;;) {
      if (r < 0 || r >= rows || c < 0 || c >= cols) break;
      result.push([r, c]);
      if (r === r2 && c === c2) break;
      r += dr; c += dc;
    }
    return result;
  }

  /* ── Build widget ─────────────────────────────────────── */
  function buildWidget(words, grid) {
    const rows = grid.length;
    const cols = grid[0].length;

    /* state */
    let active    = false;
    let startCell = null;
    let selCells  = [];
    const found   = new Set();

    /* root */
    const root = document.createElement('div');
    root.className = 'ws-root';

    /* word list */
    const wlist = document.createElement('div');
    wlist.className = 'ws-wordlist';
    const wspans = {};
    words.forEach(w => {
      const sp = document.createElement('span');
      sp.className = 'ws-word';
      sp.textContent = w;
      wlist.appendChild(sp);
      wspans[w] = sp;
    });

    /* table */
    const table = document.createElement('table');
    table.className = 'ws-grid';
    table.setAttribute('role', 'grid');
    const cells = [];

    for (let r = 0; r < rows; r++) {
      const tr = document.createElement('tr');
      cells.push([]);
      for (let c = 0; c < cols; c++) {
        const td = document.createElement('td');
        td.className = 'ws-cell';
        td.textContent = grid[r][c];
        td.dataset.r = r; td.dataset.c = c;
        cells[r].push(td);
        tr.appendChild(td);
      }
      table.appendChild(tr);
    }

    /* helpers */
    const hl  = (list, cls, on) => list.forEach(([r,c]) => cells[r][c].classList.toggle(cls, on));
    const txt = list => list.map(([r,c]) => grid[r][c]).join('');

    function cellAt(x, y) {
      const el = document.elementFromPoint(x, y);
      if (!el || !el.classList.contains('ws-cell')) return null;
      return { r: +el.dataset.r, c: +el.dataset.c };
    }

    function commit() {
      const word = txt(selCells);
      const rev  = word.split('').reverse().join('');
      const hit  = words.find(w => w === word || w === rev);
      hl(selCells, 'ws-selecting', false);
      if (hit && !found.has(hit)) {
        found.add(hit);
        hl(selCells, 'ws-found', true);
        wspans[hit].classList.add('ws-word-found');
        if (found.size === words.length) {
          root.classList.add('ws-all-found');
          banner.style.display = 'block';
        }
      }
      selCells = []; startCell = null; active = false;
    }

    function update(x, y) {
      if (!active) return;
      const cell = cellAt(x, y);
      if (!cell) return;
      hl(selCells, 'ws-selecting', false);
      const line = cellsInLine(startCell.r, startCell.c, cell.r, cell.c, rows, cols);
      selCells = line || [[startCell.r, startCell.c]];
      hl(selCells, 'ws-selecting', true);
    }

    /* mouse */
    table.addEventListener('mousedown', e => {
      const cell = cellAt(e.clientX, e.clientY);
      if (!cell) return;
      e.preventDefault();
      active = true; startCell = cell;
      selCells = [[cell.r, cell.c]];
      hl(selCells, 'ws-selecting', true);
    });
    document.addEventListener('mousemove', e => { if (active) update(e.clientX, e.clientY); });
    document.addEventListener('mouseup',   () => { if (active) commit(); });

    /* touch */
    table.addEventListener('touchstart', e => {
      const t = e.touches[0];
      const cell = cellAt(t.clientX, t.clientY);
      if (!cell) return;
      e.preventDefault();
      active = true; startCell = cell;
      selCells = [[cell.r, cell.c]];
      hl(selCells, 'ws-selecting', true);
    }, { passive: false });

    table.addEventListener('touchmove', e => {
      e.preventDefault();
      const t = e.touches[0];
      update(t.clientX, t.clientY);
    }, { passive: false });

    table.addEventListener('touchend', () => { if (active) commit(); });

    /* completion banner */
    const banner = document.createElement('div');
    banner.className = 'ws-banner';
    banner.textContent = 'All words found!';
    banner.style.display = 'none';

    root.appendChild(wlist);
    root.appendChild(table);
    root.appendChild(banner);
    return root;
  }

  /* ── Init ─────────────────────────────────────────────── */
  function init() {
    /* Sphinx renders {code-block} text :class: wordsearch as:
       div.wordsearch > div.highlight > pre
       Also handle legacy selectors just in case */
    const selector = [
      'div.wordsearch pre',
      'div.highlight-wordsearch pre',
      'pre code.language-wordsearch',
    ].join(', ');

    document.querySelectorAll(selector).forEach(el => {
      /* Walk up to the outermost container we want to replace:
         div.wordsearch (from :class: wordsearch) > div.highlight > pre  */
      const anchor = el.closest('div.wordsearch')
                  || el.closest('div.highlight-wordsearch')
                  || el.closest('div.highlight')
                  || el.closest('pre')
                  || el;
      const parent = anchor.parentNode;
      try {
        const { words, grid } = parse(el.textContent);
        if (!words.length || !grid.length) return;
        const widget = buildWidget(words, grid);
        parent.replaceChild(widget, anchor);
      } catch (err) {
        console.warn('[wordsearch] parse error:', err);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
