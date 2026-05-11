import { useEffect } from "react";
import { useReaderStore } from "./store";
import { ChapterNav } from "./components/ChapterNav";
import { MarkdownView } from "./components/MarkdownView";
import { TtsBar } from "./components/TtsBar";
import { AmbientBar } from "./components/AmbientBar";
import { extractParagraphs } from "./hooks/useTts";
import { EDITIONS } from "./types";
import "./App.css";

export default function App() {
  const loadManifest = useReaderStore((s) => s.loadManifest);
  const manifest = useReaderStore((s) => s.manifest);
  const manifestError = useReaderStore((s) => s.manifestError);
  const loadingManifest = useReaderStore((s) => s.loadingManifest);
  const markdownContent = useReaderStore((s) => s.markdownContent);
  const currentChapter = useReaderStore((s) => s.currentChapter);
  const currentEdition = useReaderStore((s) => s.currentEdition);
  const setEdition = useReaderStore((s) => s.setEdition);

  useEffect(() => {
    loadManifest();
  }, [loadManifest]);

  const paragraphs = extractParagraphs(markdownContent);

  if (loadingManifest) {
    return (
      <div className="app-loading">
        <p>Loading book...</p>
      </div>
    );
  }

  if (manifestError) {
    return (
      <div className="app-error">
        <h2>Could not load book manifest</h2>
        <p>{manifestError}</p>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header__inner">
          <div className="app-header__book-info">
            <span className="app-header__title">Human in the Loop: Misunderstood</span>
            {manifest?.metadata.subtitle && (
              <span className="app-header__subtitle">{manifest.metadata.subtitle}</span>
            )}
          </div>
          <nav className="edition-picker" aria-label="Select edition">
            {EDITIONS.map((ed) => (
              <button
                key={ed.id}
                className={`edition-picker__btn${currentEdition === ed.id ? " edition-picker__btn--active" : ""}`}
                onClick={() => setEdition(ed.id)}
                title={ed.subtitle}
              >
                {ed.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <ChapterNav />

      <main className="app-main">
        <MarkdownView
          chapterTitle={currentChapter?.title}
          readMinutes={currentChapter?.estimatedReadMinutes}
        />
      </main>

      <footer className="app-footer">
        <TtsBar paragraphs={paragraphs} />
        <AmbientBar />
      </footer>
    </div>
  );
}
