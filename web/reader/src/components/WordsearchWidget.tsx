import { useCallback, useEffect, useRef, useState } from "react";
import type { WordsearchData } from "../types";

interface Cell { row: number; col: number; }
interface FoundWord { word: string; cells: Cell[]; }

function cellKey(c: Cell) { return `${c.row},${c.col}`; }

function getLineCells(start: Cell, end: Cell): Cell[] {
  const dr = Math.sign(end.row - start.row);
  const dc = Math.sign(end.col - start.col);
  const steps = Math.max(Math.abs(end.row - start.row), Math.abs(end.col - start.col));
  const cells: Cell[] = [];
  for (let i = 0; i <= steps; i++) {
    cells.push({ row: start.row + dr * i, col: start.col + dc * i });
  }
  return cells;
}

function checkWordMatch(grid: string[][], cells: Cell[], words: string[]): string | null {
  const forward = cells.map((c) => grid[c.row]?.[c.col] ?? "").join("");
  const backward = forward.split("").reverse().join("");
  for (const w of words) {
    if (w === forward || w === backward) return w;
  }
  return null;
}

// Search all 8 directions for a word in the grid
const DIRS = [[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]] as const;
function findWord(grid: string[][], word: string): Cell[] | null {
  const rows = grid.length, cols = grid[0]?.length ?? 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      for (const [dr, dc] of DIRS) {
        let match = true;
        const cells: Cell[] = [];
        for (let i = 0; i < word.length; i++) {
          const nr = r + dr * i, nc = c + dc * i;
          if (grid[nr]?.[nc] !== word[i]) { match = false; break; }
          cells.push({ row: nr, col: nc });
        }
        if (match) return cells;
      }
    }
  }
  return null;
}

function fmtTime(ms: number) {
  const s = Math.floor(ms / 1000);
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

interface Props { data: WordsearchData; }

export function WordsearchWidget({ data }: Props) {
  const { words, grid } = data;
  const cols = grid[0]?.length ?? 0;

  const [selecting, setSelecting] = useState(false);
  const [dragStart, setDragStart] = useState<Cell | null>(null);
  const [dragEnd, setDragEnd] = useState<Cell | null>(null);
  const [foundWords, setFoundWords] = useState<FoundWord[]>([]);
  const [announcement, setAnnouncement] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [finished, setFinished] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<number>(0);
  const rafRef = useRef<number>(0);

  const currentSelectionCells = dragStart && dragEnd ? getLineCells(dragStart, dragEnd) : [];
  const currentSelectionKeys = new Set(currentSelectionCells.map(cellKey));
  const foundCellKeys = new Set<string>(foundWords.flatMap((fw) => fw.cells.map(cellKey)));
  const allFound = foundWords.length === words.length && words.length > 0;

  // Timer loop
  useEffect(() => {
    if (!timerRunning || finished) return;
    const tick = (now: number) => {
      setElapsed(now - startTimeRef.current);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [timerRunning, finished]);

  // Stop timer when all found
  useEffect(() => {
    if (allFound && timerRunning) {
      setTimerRunning(false);
      setFinished(true);
    }
  }, [allFound, timerRunning]);

  const startTimer = useCallback(() => {
    if (timerRunning || finished) return;
    startTimeRef.current = performance.now() - elapsed;
    setTimerRunning(true);
  }, [timerRunning, finished, elapsed]);

  const handleReset = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    setFoundWords([]);
    setDragStart(null);
    setDragEnd(null);
    setSelecting(false);
    setAnnouncement("");
    setElapsed(0);
    setTimerRunning(false);
    setFinished(false);
  }, []);

  const handleReveal = useCallback(() => {
    const remaining = words.filter((w) => !foundWords.some((fw) => fw.word === w));
    const newFound: FoundWord[] = [];
    for (const word of remaining) {
      const cells = findWord(grid, word);
      if (cells) newFound.push({ word, cells });
    }
    if (newFound.length > 0) {
      setFoundWords((prev) => [...prev, ...newFound]);
      setAnnouncement(`Revealed ${newFound.length} word${newFound.length > 1 ? "s" : ""}.`);
      setTimerRunning(false);
      setFinished(true);
    }
  }, [words, foundWords, grid]);

  const attemptMatch = useCallback((start: Cell, end: Cell) => {
    const cells = getLineCells(start, end);
    const remaining = words.filter((w) => !foundWords.some((fw) => fw.word === w));
    const matched = checkWordMatch(grid, cells, remaining);
    if (matched) {
      setFoundWords((prev) => [...prev, { word: matched, cells }]);
      setAnnouncement(`Found: ${matched}`);
    }
  }, [grid, words, foundWords]);

  const getCellFromPointer = useCallback((e: React.PointerEvent | PointerEvent): Cell | null => {
    if (!containerRef.current) return null;
    for (const el of containerRef.current.querySelectorAll<HTMLElement>("[data-cell]")) {
      const rect = el.getBoundingClientRect();
      if (e.clientX >= rect.left && e.clientX <= rect.right &&
          e.clientY >= rect.top  && e.clientY <= rect.bottom) {
        const [r, c] = (el.dataset.cell ?? "").split(",").map(Number);
        return { row: r, col: c };
      }
    }
    return null;
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    startTimer();
    const cell = getCellFromPointer(e);
    if (!cell) return;
    setSelecting(true);
    setDragStart(cell);
    setDragEnd(cell);
  }, [getCellFromPointer, startTimer]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!selecting) return;
    const cell = getCellFromPointer(e);
    if (cell) setDragEnd(cell);
  }, [selecting, getCellFromPointer]);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    if (!selecting) return;
    setSelecting(false);
    const cell = getCellFromPointer(e);
    if (dragStart && cell) attemptMatch(dragStart, cell);
    setDragStart(null);
    setDragEnd(null);
  }, [selecting, dragStart, getCellFromPointer, attemptMatch]);

  // Reset when puzzle data changes
  useEffect(() => { handleReset(); }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  const remaining = words.length - foundWords.length;

  return (
    <div className="wordsearch">
      <div className="wordsearch__header">
        <h3 className="wordsearch__title">Word Search</h3>
        <div className="wordsearch__controls">
          <span className="wordsearch__timer" aria-label="Elapsed time">
            ⏱ {fmtTime(elapsed)}
          </span>
          <button className="wordsearch__btn" onClick={handleReset} aria-label="Reset puzzle">
            Reset
          </button>
          <button
            className="wordsearch__btn wordsearch__btn--reveal"
            onClick={handleReveal}
            disabled={allFound}
            aria-label="Reveal remaining words"
          >
            Reveal
          </button>
        </div>
      </div>

      {/* aria-live region for screen readers */}
      <div role="status" aria-live="polite" aria-atomic="true" className="wordsearch__announce">
        {announcement}
      </div>

      <div className="wordsearch__layout">
        <div
          ref={containerRef}
          className="wordsearch__grid"
          style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          role="application"
          aria-label={`Word search grid. ${remaining} word${remaining !== 1 ? "s" : ""} remaining.`}
        >
          {grid.map((row, ri) =>
            row.map((letter, ci) => {
              const key = cellKey({ row: ri, col: ci });
              const isFound = foundCellKeys.has(key);
              const isSel = currentSelectionKeys.has(key);
              return (
                <span
                  key={key}
                  data-cell={`${ri},${ci}`}
                  className={[
                    "wordsearch__cell",
                    isFound ? "wordsearch__cell--found" : "",
                    isSel   ? "wordsearch__cell--selecting" : "",
                  ].filter(Boolean).join(" ")}
                  aria-hidden="true"
                >
                  {letter}
                </span>
              );
            })
          )}
        </div>

        <div className="wordsearch__words">
          <p className="wordsearch__words-label">
            Find {words.length} words
            {remaining > 0 && !allFound ? ` · ${remaining} left` : ""}:
          </p>
          <ul>
            {words.map((w) => {
              const found = foundWords.some((fw) => fw.word === w);
              return (
                <li key={w} className={`wordsearch__word${found ? " wordsearch__word--found" : ""}`}>
                  {found && <span className="wordsearch__check" aria-hidden="true">✓ </span>}
                  {w}
                  {found && <span className="sr-only"> (found)</span>}
                </li>
              );
            })}
          </ul>
          {allFound && (
            <p className="wordsearch__complete" role="status">
              {finished && !timerRunning
                ? `All found in ${fmtTime(elapsed)}! 🎉`
                : "All found! 🎉"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
