import { useEffect, useRef, useState } from "react";
import { BubbleShooterGame } from "../games/BubbleShooterGame";
import { PongGame } from "../games/PongGame";
import { SnakeGame } from "../games/SnakeGame";
import { SolitaireGame } from "../games/SolitaireGame";
import { MinesweeperGame } from "../games/MinesweeperGame";
import { PacmanGame } from "../games/PacmanGame";
import { CrosswordGame } from "../games/CrosswordGame";
import { HangmanGame } from "../games/HangmanGame";
import { PoolGame } from "../games/PoolGame";

type GameId = "crossword" | "hangman" | "minesweeper" | "pacman" | "bubble" | "snake" | "pong" | "solitaire" | "pool";

const GAMES: { id: GameId; icon: string; label: string }[] = [
  { id: "crossword",   icon: "📝", label: "Crossword"  },
  { id: "hangman",     icon: "🪢", label: "Hangman"    },
  { id: "minesweeper", icon: "🧠", label: "Spot Human" },
  { id: "pacman",      icon: "🟡", label: "Pac-Man"    },
  { id: "bubble",      icon: "🫧", label: "Bubbles"    },
  { id: "snake",       icon: "🐍", label: "Snake"      },
  { id: "pong",        icon: "🏓", label: "Pong"       },
  { id: "solitaire",   icon: "🃏", label: "Solitaire"  },
  { id: "pool",        icon: "🎱", label: "Pool"       },
];

function renderGame(id: GameId, vocabWords: string[]) {
  switch (id) {
    case "crossword":   return <CrosswordGame words={vocabWords} />;
    case "hangman":     return <HangmanGame words={vocabWords} />;
    case "bubble":      return <BubbleShooterGame />;
    case "pong":        return <PongGame />;
    case "snake":       return <SnakeGame />;
    case "solitaire":   return <SolitaireGame />;
    case "minesweeper": return <MinesweeperGame />;
    case "pacman":      return <PacmanGame />;
    case "pool":        return <PoolGame />;
  }
}

interface Props {
  chapterTitle?: string;
  readMinutes?: number;
  vocabWords?: string[];
}

export function GameBreak({ chapterTitle, readMinutes, vocabWords = [] }: Props) {
  const [open, setOpen] = useState(false);
  // Default to crossword when chapter words are available, otherwise snake
  const [activeGame, setActiveGame] = useState<GameId>(vocabWords.length >= 3 ? "crossword" : "snake");
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <button className="game-break-trigger" onClick={() => setOpen(true)}>
        <span className="game-break-trigger__icon">☀️</span>
        <span className="game-break-trigger__label">
          <div className="game-break-trigger__title">Take a break</div>
          <div className="game-break-trigger__sub">
            {chapterTitle ? `After "${chapterTitle}"` : "Quick game interlude"}
            {readMinutes ? ` · ~${readMinutes} min read` : ""}
          </div>
        </span>
        <span style={{ fontSize: "0.8rem", opacity: 0.5 }}>▶</span>
      </button>

      {open && (
        <div className="game-break-overlay" onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
          <div
            className="game-break-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="game-break-title"
          >
            <div className="game-break-panel__header">
              <span className="game-break-panel__title" id="game-break-title">☀ Game Break</span>
              <button ref={closeRef} className="game-break-panel__close" onClick={() => setOpen(false)}>✕ close</button>
            </div>
            <div className="game-break-picker">
              {GAMES.map(g => (
                <button
                  key={g.id}
                  className={`game-break-picker__btn${activeGame === g.id ? " game-break-picker__btn--active" : ""}`}
                  onClick={() => setActiveGame(g.id)}
                >
                  <span className="game-break-picker__icon">{g.icon}</span>
                  {g.label}
                </button>
              ))}
            </div>
            <div className="game-break-canvas">
              {renderGame(activeGame, vocabWords)}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
