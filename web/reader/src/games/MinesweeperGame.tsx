/**
 * "Spot the Human" — a Minesweeper reskin for the HITL summer reader.
 *
 * Instead of mines, hidden humans are lurking in a grid of automated decisions.
 * Flag the humans. Don't disturb them.
 *
 * 💀 = bot (safe to reveal)   🧠 = human (mine — avoid!)
 * 🚩 = flagged as human       ❓ = uncertain
 */
import React, { useCallback, useEffect, useReducer, useRef, useState } from "react";

// ── Config ─────────────────────────────────────────────────────────────────────
const COLS = 10;
const ROWS = 10;
const HUMAN_COUNT = 15;

const CELL_SIZE = 34; // px per cell
const GRID_W = COLS * CELL_SIZE;
const GRID_H = ROWS * CELL_SIZE;

// Number colors matching classic minesweeper
const NUM_COLORS = ["", "#1d4ed8", "#15803d", "#b91c1c", "#1e40af", "#9f1239", "#0891b2", "#111827", "#6b7280"];

// ── Types ──────────────────────────────────────────────────────────────────────
type CellState = "hidden" | "revealed" | "flagged" | "question";
type Phase = "idle" | "playing" | "won" | "lost";

interface Cell {
  isHuman: boolean;
  adjacentHumans: number;
  state: CellState;
}

interface GameState {
  grid: Cell[][];
  phase: Phase;
  flagCount: number;
  startTime: number | null;
  elapsed: number;
}

type Action =
  | { type: "NEW_GAME" }
  | { type: "REVEAL"; row: number; col: number }
  | { type: "CYCLE_FLAG"; row: number; col: number }
  | { type: "CHORD"; row: number; col: number }
  | { type: "TICK" };

// ── Grid helpers ───────────────────────────────────────────────────────────────
function makeEmptyGrid(): Cell[][] {
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({
      isHuman: false,
      adjacentHumans: 0,
      state: "hidden" as CellState,
    })),
  );
}

function placeHumans(grid: Cell[][], safeRow: number, safeCol: number): Cell[][] {
  const g = grid.map(r => r.map(c => ({ ...c })));
  const positions: [number, number][] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (Math.abs(r - safeRow) > 1 || Math.abs(c - safeCol) > 1) {
        positions.push([r, c]);
      }
    }
  }
  // Fisher-Yates partial shuffle
  for (let i = 0; i < HUMAN_COUNT; i++) {
    const j = i + Math.floor(Math.random() * (positions.length - i));
    [positions[i], positions[j]] = [positions[j], positions[i]];
    const [hr, hc] = positions[i];
    g[hr][hc].isHuman = true;
  }
  // Count adjacents
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (g[r][c].isHuman) continue;
      let count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && g[nr][nc].isHuman) count++;
        }
      }
      g[r][c].adjacentHumans = count;
    }
  }
  return g;
}

function floodReveal(grid: Cell[][], row: number, col: number): Cell[][] {
  const g = grid.map(r => r.map(c => ({ ...c })));
  const queue: [number, number][] = [[row, col]];
  while (queue.length > 0) {
    const [r, c] = queue.shift()!;
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) continue;
    const cell = g[r][c];
    if (cell.state === "revealed" || cell.isHuman) continue;
    if (cell.state === "flagged" || cell.state === "question") continue;
    cell.state = "revealed";
    if (cell.adjacentHumans === 0) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr !== 0 || dc !== 0) queue.push([r + dr, c + dc]);
        }
      }
    }
  }
  return g;
}

function checkWin(grid: Cell[][]): boolean {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = grid[r][c];
      if (!cell.isHuman && cell.state !== "revealed") return false;
    }
  }
  return true;
}

function countFlags(grid: Cell[][]): number {
  let n = 0;
  for (const row of grid) for (const cell of row) if (cell.state === "flagged") n++;
  return n;
}

function revealAllHumans(grid: Cell[][]): Cell[][] {
  return grid.map(row =>
    row.map(cell => cell.isHuman ? { ...cell, state: "revealed" as CellState } : cell),
  );
}

// ── Reducer ────────────────────────────────────────────────────────────────────
const INIT: GameState = {
  grid: makeEmptyGrid(),
  phase: "idle",
  flagCount: 0,
  startTime: null,
  elapsed: 0,
};

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "NEW_GAME":
      return { ...INIT, grid: makeEmptyGrid() };

    case "REVEAL": {
      if (state.phase === "won" || state.phase === "lost") return state;
      const { row, col } = action;
      const cell = state.grid[row][col];
      if (cell.state !== "hidden" && cell.state !== "question") return state;
      if (cell.state === "question") {
        // reveal question-marked cell directly
      }

      let grid: Cell[][];
      // First click — place humans safely
      if (state.phase === "idle") {
        grid = placeHumans(state.grid, row, col);
      } else {
        grid = state.grid.map(r => r.map(c => ({ ...c })));
      }

      if (grid[row][col].isHuman) {
        // Hit a human — game over
        grid[row][col] = { ...grid[row][col], state: "revealed" };
        grid = revealAllHumans(grid);
        return { ...state, grid, phase: "lost", elapsed: state.elapsed };
      }

      grid = floodReveal(grid, row, col);
      const won = checkWin(grid);
      return {
        ...state,
        grid,
        phase: won ? "won" : "playing",
        startTime: state.startTime ?? Date.now(),
        flagCount: countFlags(grid),
      };
    }

    case "CYCLE_FLAG": {
      if (state.phase === "won" || state.phase === "lost") return state;
      const { row, col } = action;
      const cell = state.grid[row][col];
      if (cell.state === "revealed") return state;
      const next: CellState =
        cell.state === "hidden" ? "flagged" :
        cell.state === "flagged" ? "question" : "hidden";
      const grid = state.grid.map((r, ri) =>
        r.map((c, ci) => ri === row && ci === col ? { ...c, state: next } : c),
      );
      return {
        ...state,
        grid,
        phase: state.phase === "idle" ? "idle" : "playing",
        flagCount: countFlags(grid),
      };
    }

    case "CHORD": {
      // Reveal all unflagged neighbors if flag count matches adjacentHumans
      if (state.phase !== "playing") return state;
      const { row, col } = action;
      const cell = state.grid[row][col];
      if (cell.state !== "revealed" || cell.adjacentHumans === 0) return state;
      let flagsAround = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = row + dr, nc = col + dc;
          if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
            if (state.grid[nr][nc].state === "flagged") flagsAround++;
          }
        }
      }
      if (flagsAround !== cell.adjacentHumans) return state;
      let grid = state.grid.map(r => r.map(c => ({ ...c })));
      let hitHuman = false;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = row + dr, nc = col + dc;
          if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) continue;
          const nc2 = grid[nr][nc];
          if (nc2.state !== "hidden" && nc2.state !== "question") continue;
          if (nc2.isHuman) { hitHuman = true; grid[nr][nc] = { ...nc2, state: "revealed" }; }
          else grid = floodReveal(grid, nr, nc);
        }
      }
      if (hitHuman) {
        grid = revealAllHumans(grid);
        return { ...state, grid, phase: "lost" };
      }
      const won = checkWin(grid);
      return { ...state, grid, phase: won ? "won" : "playing", flagCount: countFlags(grid) };
    }

    case "TICK":
      if (state.phase !== "playing" || !state.startTime) return state;
      return { ...state, elapsed: Math.floor((Date.now() - state.startTime) / 1000) };

    default:
      return state;
  }
}

// ── Component ──────────────────────────────────────────────────────────────────
export function MinesweeperGame() {
  const [state, dispatch] = useReducer(reducer, INIT);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tickRef = useRef<number | null>(null);
  const longPressRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isTouch, setIsTouch] = useState(false);

  // Timer
  useEffect(() => {
    if (state.phase === "playing") {
      tickRef.current = window.setInterval(() => dispatch({ type: "TICK" }), 1000);
    } else {
      if (tickRef.current !== null) { clearInterval(tickRef.current); tickRef.current = null; }
    }
    return () => { if (tickRef.current !== null) clearInterval(tickRef.current); };
  }, [state.phase]);

  // Draw grid on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = GRID_W * dpr;
    canvas.height = GRID_H * dpr;
    canvas.style.width = GRID_W + "px";
    canvas.style.height = GRID_H + "px";
    ctx.scale(dpr, dpr);

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const cell = state.grid[r][c];
        const x = c * CELL_SIZE;
        const y = r * CELL_SIZE;

        if (cell.state === "revealed") {
          ctx.fillStyle = "#e8dfc8";
          ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
          ctx.strokeStyle = "#c4b89a";
          ctx.lineWidth = 0.5;
          ctx.strokeRect(x + 0.25, y + 0.25, CELL_SIZE - 0.5, CELL_SIZE - 0.5);

          if (cell.isHuman) {
            ctx.font = `${CELL_SIZE * 0.6}px serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("🧠", x + CELL_SIZE / 2, y + CELL_SIZE / 2 + 1);
          } else if (cell.adjacentHumans > 0) {
            ctx.fillStyle = NUM_COLORS[cell.adjacentHumans] || "#111";
            ctx.font = `bold ${CELL_SIZE * 0.55}px Georgia, serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(String(cell.adjacentHumans), x + CELL_SIZE / 2, y + CELL_SIZE / 2);
          }
        } else {
          // Hidden cell — warm raised look
          ctx.fillStyle = "#f5edd8";
          ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
          // top-left light edge
          ctx.fillStyle = "#fffdf9";
          ctx.fillRect(x, y, CELL_SIZE, 2);
          ctx.fillRect(x, y, 2, CELL_SIZE);
          // bottom-right shadow
          ctx.fillStyle = "#c4b09a";
          ctx.fillRect(x, y + CELL_SIZE - 2, CELL_SIZE, 2);
          ctx.fillRect(x + CELL_SIZE - 2, y, 2, CELL_SIZE);

          if (cell.state === "flagged") {
            ctx.font = `${CELL_SIZE * 0.58}px serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("🚩", x + CELL_SIZE / 2, y + CELL_SIZE / 2 + 1);
          } else if (cell.state === "question") {
            ctx.fillStyle = "#c47e1a";
            ctx.font = `bold ${CELL_SIZE * 0.55}px Georgia, serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("?", x + CELL_SIZE / 2, y + CELL_SIZE / 2);
          }
        }
      }
    }
  }, [state.grid]);

  const cellFromXY = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const scaleX = GRID_W / rect.width;
    const scaleY = GRID_H / rect.height;
    const col = Math.floor((clientX - rect.left) * scaleX / CELL_SIZE);
    const row = Math.floor((clientY - rect.top) * scaleY / CELL_SIZE);
    if (row < 0 || row >= ROWS || col < 0 || col >= COLS) return null;
    return { row, col };
  }, []);

  const cellFromEvent = useCallback((e: React.MouseEvent<HTMLCanvasElement>) =>
    cellFromXY(e.clientX, e.clientY), [cellFromXY]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = cellFromEvent(e);
    if (!pos) return;
    const cell = state.grid[pos.row][pos.col];
    if (cell.state === "revealed" && cell.adjacentHumans > 0) {
      dispatch({ type: "CHORD", ...pos });
    } else {
      dispatch({ type: "REVEAL", ...pos });
    }
  }, [cellFromEvent, state.grid]);

  const handleRightClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const pos = cellFromEvent(e);
    if (!pos) return;
    dispatch({ type: "CYCLE_FLAG", ...pos });
  }, [cellFromEvent]);

  // Long-press to flag on touch devices
  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    setIsTouch(true);
    const t = e.touches[0];
    if (!t) return;
    const pos = cellFromXY(t.clientX, t.clientY);
    if (!pos) return;
    longPressRef.current = setTimeout(() => {
      dispatch({ type: "CYCLE_FLAG", ...pos });
    }, 500);
  }, [cellFromXY]);

  const handleTouchEnd = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    if (longPressRef.current !== null) {
      clearTimeout(longPressRef.current);
      longPressRef.current = null;
    }
    const t = e.changedTouches[0];
    if (!t) return;
    const pos = cellFromXY(t.clientX, t.clientY);
    if (!pos) return;
    const cell = state.grid[pos.row][pos.col];
    if (cell.state === "revealed" && cell.adjacentHumans > 0) {
      dispatch({ type: "CHORD", ...pos });
    } else if (cell.state !== "flagged") {
      dispatch({ type: "REVEAL", ...pos });
    }
  }, [cellFromXY, state.grid]);

  const handleTouchMove = useCallback(() => {
    if (longPressRef.current !== null) {
      clearTimeout(longPressRef.current);
      longPressRef.current = null;
    }
  }, []);

  const remaining = HUMAN_COUNT - state.flagCount;
  const timerStr = String(Math.min(state.elapsed, 999)).padStart(3, "0");
  const counterStr = String(Math.max(remaining, -99)).padStart(3, " ");

  const statusMsg =
    state.phase === "won" ? "All humans identified! 🎉" :
    state.phase === "lost" ? "A human was disturbed! 😬" :
    state.phase === "idle" ? "Click any cell to begin" :
    `${remaining} human${remaining !== 1 ? "s" : ""} remaining`;

  const emoji =
    state.phase === "won" ? "😎" :
    state.phase === "lost" ? "😵" : "🤖";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0, width: "100%", height: "100%", background: "#c8cdd6", padding: 14, boxSizing: "border-box", justifyContent: "center" }}>
      {/* Toolbar */}
      <div style={{ width: GRID_W, padding: "8px 10px", background: "#dfe4eb", borderTop: "2px solid #fff", borderLeft: "2px solid #fff", borderRight: "2px solid #9ca3af", borderBottom: "2px solid #9ca3af", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4, boxSizing: "border-box" }}>
        <div style={{ fontFamily: "Courier New, monospace", fontWeight: 700, fontSize: 20, letterSpacing: "0.08em", color: "#dc2626", background: "#120e14", padding: "4px 8px", minWidth: 52, textAlign: "center", border: "2px inset #9ca3af" }}>
          {counterStr}
        </div>
        <button
          onClick={() => dispatch({ type: "NEW_GAME" })}
          style={{ width: 42, height: 42, fontSize: 22, cursor: "pointer", background: "#dfe4eb", borderTop: "2px solid #fff", borderLeft: "2px solid #fff", borderRight: "2px solid #6b7280", borderBottom: "2px solid #6b7280" }}
          title="New game"
        >
          {emoji}
        </button>
        <div style={{ fontFamily: "Courier New, monospace", fontWeight: 700, fontSize: 20, letterSpacing: "0.08em", color: "#dc2626", background: "#120e14", padding: "4px 8px", minWidth: 52, textAlign: "center", border: "2px inset #9ca3af" }}>
          {timerStr}
        </div>
      </div>

      {/* Grid */}
      <canvas
        ref={canvasRef}
        style={{ display: "block", maxWidth: "100%", borderTop: "3px solid #9ca3af", borderLeft: "3px solid #9ca3af", borderRight: "3px solid #fff", borderBottom: "3px solid #fff", cursor: "default", touchAction: "none" }}
        onClick={handleClick}
        onContextMenu={handleRightClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
      />

      {/* Status */}
      <div style={{ width: "min(100%, " + GRID_W + "px)", marginTop: 4, padding: "6px 10px", background: "#dfe4eb", borderTop: "2px solid #fff", borderLeft: "2px solid #fff", borderRight: "2px solid #9ca3af", borderBottom: "2px solid #9ca3af", fontSize: 12, color: "#334155", textAlign: "center", boxSizing: "border-box" }}>
        {statusMsg}
        <span style={{ marginLeft: 8, opacity: 0.6 }}>
          {isTouch ? "· hold to flag · tap number to chord" : "· right-click to flag · click numbered to chord"}
        </span>
      </div>
    </div>
  );
}
