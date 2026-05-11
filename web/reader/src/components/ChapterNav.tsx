import { useState } from "react";
import { useReaderStore } from "../store";

export function ChapterNav() {
  const manifest = useReaderStore((s) => s.manifest);
  const currentChapterIndex = useReaderStore((s) => s.currentChapterIndex);
  const goToChapter = useReaderStore((s) => s.goToChapter);
  const prevChapter = useReaderStore((s) => s.prevChapter);
  const nextChapter = useReaderStore((s) => s.nextChapter);
  const [menuOpen, setMenuOpen] = useState(false);

  if (!manifest) return null;

  const chapters = manifest.chapters;
  const total = chapters.length;
  const current = chapters[currentChapterIndex];

  return (
    <nav className="chapter-nav">
      <div className="chapter-nav__top">
        <button
          className="chapter-nav__btn"
          onClick={prevChapter}
          disabled={currentChapterIndex === 0}
          aria-label="Previous chapter"
        >
          ←
        </button>

        <button
          className="chapter-nav__title-btn"
          onClick={() => setMenuOpen((o) => !o)}
          aria-expanded={menuOpen}
          aria-haspopup="listbox"
        >
          <span className="chapter-nav__chapter-label">
            Ch. {currentChapterIndex + 1} / {total}
          </span>
          <span className="chapter-nav__chapter-title">{current?.title}</span>
          <span className="chapter-nav__caret">{menuOpen ? "▲" : "▼"}</span>
        </button>

        <button
          className="chapter-nav__btn"
          onClick={nextChapter}
          disabled={currentChapterIndex === total - 1}
          aria-label="Next chapter"
        >
          →
        </button>
      </div>

      {/* Dot progress bar */}
      <div className="chapter-nav__dots" role="progressbar" aria-valuenow={currentChapterIndex + 1} aria-valuemax={total}>
        {chapters.map((_, i) => (
          <button
            key={i}
            className={`chapter-nav__dot${i === currentChapterIndex ? " chapter-nav__dot--active" : i < currentChapterIndex ? " chapter-nav__dot--done" : ""}`}
            onClick={() => goToChapter(i)}
            aria-label={`Go to chapter ${i + 1}: ${chapters[i].title}`}
          />
        ))}
      </div>

      {/* Chapter list dropdown */}
      {menuOpen && (
        <div className="chapter-nav__menu" role="listbox">
          {chapters.map((ch, i) => (
            <button
              key={ch.id}
              className={`chapter-nav__menu-item${i === currentChapterIndex ? " chapter-nav__menu-item--active" : ""}`}
              role="option"
              aria-selected={i === currentChapterIndex}
              onClick={() => {
                goToChapter(i);
                setMenuOpen(false);
              }}
            >
              <span className="chapter-nav__menu-num">{i + 1}.</span>
              <span>{ch.title}</span>
              {ch.estimatedReadMinutes && (
                <span className="chapter-nav__menu-eta">
                  ~{ch.estimatedReadMinutes}m
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
