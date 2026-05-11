import { useEffect, useRef, useState, useCallback } from "react";
import {
  makeInitialState,
  getLegalMovesFrom,
  applyMove,
  getStatus,
  moveToAlgebraic,
  isInCheck,
  squareName,
} from "./chess_engine";
import type { GameState, Move } from "./chess_engine";

type ChessMode = "2p" | "vs-ai-white" | "vs-ai-black" | "hint";
interface ChessMove { id: string; from: number; to: number; piece: string; promotion?: string; }

const mkId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

const SYM: Record<string, string> = {
  wp: "♙", wr: "♖", wn: "♘", wb: "♗", wq: "♕", wk: "♔",
  bp: "♟", br: "♜", bn: "♞", bb: "♝", bq: "♛", bk: "♚",
};

const MODE_LABELS: Record<ChessMode, string> = {
  "2p":          "2P Local",
  "vs-ai-white": "VS AI (you=White)",
  "vs-ai-black": "VS AI (you=Black)",
  "hint":        "Hint",
};

export function ChessGame() {
  const [gameState, setGameState] = useState<GameState>(makeInitialState);
  const [selected, setSelected] = useState<number>(-1);
  const [legalTargets, setLegalTargets] = useState<Move[]>([]);
  const [mode, setMode] = useState<ChessMode>("2p");
  const [history, setHistory] = useState<ChessMove[]>([]);
  const [thinking, setThinking] = useState(false);
  const [status, setStatus] = useState("White's turn");
  const [promotion, setPromotion] = useState<{ from: number; to: number; piece: string } | null>(null);

  const workerRef = useRef<Worker | null>(null);
  const historyEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (historyEndRef.current?.scrollIntoView)
      historyEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  useEffect(() => () => { workerRef.current?.terminate(); }, []);

  const getStatusText = useCallback((gs: GameState, isThinking: boolean): string => {
    if (isThinking) return "AI thinking…";
    const s = getStatus(gs);
    if (s === "checkmate") return `Checkmate! ${gs.turn === "w" ? "Black" : "White"} wins`;
    if (s === "stalemate") return "Stalemate — draw";
    if (s === "draw")      return "Draw (50-move rule)";
    const inCheck = isInCheck(gs.board, gs.turn);
    const who = gs.turn === "w" ? "White" : "Black";
    return inCheck ? `${who}'s turn — in check!` : `${who}'s turn`;
  }, []);

  const isGameOver = (gs: GameState) => getStatus(gs) !== "playing";

  const recordMove = useCallback((move: Move): ChessMove => ({
    id: mkId(), from: move.from, to: move.to, piece: move.piece,
    ...(move.promotion ? { promotion: move.promotion } : {}),
  }), []);

  const triggerAI = useCallback((gs: GameState) => {
    if (isGameOver(gs)) return;
    setThinking(true);
    if (!workerRef.current) {
      workerRef.current = new Worker(
        new URL("./chess_worker.ts", import.meta.url), { type: "module" }
      );
    }
    const worker = workerRef.current;
    worker.onmessage = (e: MessageEvent<{ type: string; move: Move | null }>) => {
      setThinking(false);
      if (e.data.type === "bestMove" && e.data.move) {
        const aiMove = e.data.move;
        setGameState((prev) => {
          const next = applyMove(prev, aiMove);
          setHistory((h) => [...h, recordMove(aiMove)]);
          setStatus(getStatusText(next, false));
          return next;
        });
      }
    };
    worker.postMessage({ type: "getBestMove", state: gs, depth: 4 });
  }, [getStatusText, recordMove]);

  const isHumanTurn = useCallback((gs: GameState): boolean => {
    if (mode === "2p") return true;
    if (thinking) return false;
    if (mode === "vs-ai-white") return gs.turn === "w";
    if (mode === "vs-ai-black") return gs.turn === "b";
    return true;
  }, [mode, thinking]);

  const applyHumanMove = useCallback((move: Move) => {
    setGameState((prev) => {
      const next = applyMove(prev, move);
      setHistory((h) => [...h, recordMove(move)]);
      setSelected(-1);
      setLegalTargets([]);
      setStatus(getStatusText(next, false));
      if ((mode === "vs-ai-white" || mode === "vs-ai-black") && !isGameOver(next))
        setTimeout(() => triggerAI(next), 50);
      return next;
    });
  }, [mode, getStatusText, recordMove, triggerAI]);

  const handleCellClick = (i: number) => {
    if (!isHumanTurn(gameState) || isGameOver(gameState)) return;
    const piece = gameState.board[i];

    if (selected < 0) {
      if (piece && piece[0] === gameState.turn) {
        setSelected(i);
        setLegalTargets(getLegalMovesFrom(gameState, i));
      }
      return;
    }
    if (i === selected) { setSelected(-1); setLegalTargets([]); return; }
    if (piece && piece[0] === gameState.turn) {
      setSelected(i); setLegalTargets(getLegalMovesFrom(gameState, i)); return;
    }
    const move = legalTargets.find((m) => m.to === i);
    if (!move) { setSelected(-1); setLegalTargets([]); return; }

    if (move.piece[1] === "p" && !move.promotion) {
      const promRank = gameState.turn === "w" ? 0 : 7;
      if (Math.floor(move.to / 8) === promRank) {
        setPromotion({ from: move.from, to: move.to, piece: move.piece });
        return;
      }
    }
    applyHumanMove(move);
  };

  const handlePromotion = (promPiece: string) => {
    if (!promotion) return;
    const move = legalTargets.find(
      (m) => m.from === promotion.from && m.to === promotion.to && m.promotion === promPiece
    );
    setPromotion(null);
    if (move) applyHumanMove(move);
  };

  const reset = () => {
    workerRef.current?.terminate();
    workerRef.current = null;
    const s = makeInitialState();
    setGameState(s); setSelected(-1); setLegalTargets([]);
    setHistory([]); setThinking(false); setStatus("White's turn"); setPromotion(null);
    if (mode === "vs-ai-black") setTimeout(() => triggerAI(s), 100);
  };

  const changeMode = (m: ChessMode) => {
    setMode(m);
    workerRef.current?.terminate(); workerRef.current = null;
    const s = makeInitialState();
    setGameState(s); setSelected(-1); setLegalTargets([]);
    setHistory([]); setThinking(false); setPromotion(null); setStatus("White's turn");
    if (m === "vs-ai-black") setTimeout(() => triggerAI(s), 100);
  };

  const gStatus = getStatus(gameState);

  return (
    <div className="wg-game wg-chess-container">
      <div className="wg-chess-modes">
        {(Object.keys(MODE_LABELS) as ChessMode[]).map((m) => (
          <button
            key={m}
            className={`wg-btn wg-chess-mode-btn${mode === m ? " active" : ""}`}
            onClick={() => changeMode(m)}
          >
            {MODE_LABELS[m]}
          </button>
        ))}
      </div>

      <div className="wg-chess-layout">
        <div className="wg-chess-board-wrap">
          <div className="wg-chess-board">
            {Array.from({ length: 64 }, (_, i) => {
              const r = Math.floor(i / 8), c = i % 8;
              const dark = (r + c) % 2 === 1;
              const isSel = i === selected;
              const isTarget = legalTargets.some((m) => m.to === i);
              const isCapture = isTarget && !!gameState.board[i];
              const isLastFrom = history.length > 0 && history[history.length - 1].from === i;
              const isLastTo   = history.length > 0 && history[history.length - 1].to === i;

              let bg: string;
              if (isSel)                   bg = "#22D3EE";
              else if (isCapture)          bg = "#F87171";
              else if (isLastFrom || isLastTo) bg = dark ? "#a8c18f" : "#cde6a0";
              else                         bg = dark ? "#90A7D0" : "#DCE8FF";

              return (
                <div
                  key={i}
                  className="wg-chess-cell"
                  style={{ background: bg, cursor: "pointer" }}
                  onClick={() => handleCellClick(i)}
                >
                  <span className="wg-piece">{SYM[gameState.board[i]] ?? ""}</span>
                  <span className="wg-sq-label">{squareName(i)}</span>
                  {isTarget && !isCapture && <span className="wg-dot" />}
                </div>
              );
            })}
          </div>

          {promotion && (
            <div className="wg-chess-promotion">
              <span style={{ fontSize: 11, color: "#9fc0ea" }}>Promote to:</span>
              {["q", "r", "b", "n"].map((p) => (
                <button
                  key={p} className="wg-btn"
                  style={{ fontSize: 20, padding: "2px 8px" }}
                  onClick={() => handlePromotion(gameState.turn + p)}
                >
                  {SYM[gameState.turn + p]}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="wg-chess-history">
          <div className="wg-chess-history-header">
            <span>Move History</span>
          </div>
          <div className="wg-chess-history-list">
            {history.map((cm, idx) => {
              const lm: Move = { from: cm.from, to: cm.to, piece: cm.piece,
                ...(cm.promotion ? { promotion: cm.promotion } : {}) };
              const notation = moveToAlgebraic(lm, []);
              const isWhite = cm.piece[0] === "w";
              const moveNum = Math.floor(idx / 2) + 1;
              return (
                <div key={cm.id} className="wg-chess-history-item">
                  <span className="wg-chess-history-num">{idx % 2 === 0 ? `${moveNum}.` : ""}</span>
                  <span className={`wg-chess-history-move${isWhite ? " white" : " black"}`}>
                    {notation}
                  </span>
                </div>
              );
            })}
            <div ref={historyEndRef} />
          </div>
        </div>
      </div>

      <div className="wg-status" style={{ gap: 8 }}>
        <span
          className="wg-chip"
          style={{ background: gameState.turn === "w" ? "#F9FAFB" : "#111827",
                   color: gameState.turn === "w" ? "#111827" : "#F9FAFB" }}
        >
          {gameState.turn === "w" ? "White" : "Black"}
        </span>
        <span style={{ flex: 1 }}>{status}</span>
        {thinking && <span style={{ fontSize: 11, color: "#f59e0b" }}>⏳</span>}
        {mode === "hint" && !thinking && gStatus === "playing" && (
          <button className="wg-btn" onClick={() => triggerAI(gameState)}>Get Hint</button>
        )}
        <button className="wg-btn" onClick={reset}>Reset</button>
      </div>
    </div>
  );
}
