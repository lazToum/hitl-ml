import { create } from "zustand";
import type {
  Edition,
  BookManifest,
  ChapterEntry,
  AmbientTrackId,
  TtsSpeed,
} from "./types";
import { BUNDLED_MANIFESTS, getBundledChapter } from "./bundled";

const PROGRESS_KEY_PREFIX = "reader_progress_";
const EDITION_KEY = "reader_edition";

function getProgressKey(edition: Edition): string {
  return PROGRESS_KEY_PREFIX + edition;
}

const EDITION_ALIASES: Record<string, Edition> = {
  "winter-teachers": "winter",
  "summer-teachers": "summer",
  "spring-teachers": "spring",
  "autumn-teachers": "autumn",
};

function resolveEdition(raw: string | null): Edition | null {
  if (!raw) return null;
  if (raw === "summer" || raw === "winter" || raw === "spring" || raw === "autumn") return raw;
  return EDITION_ALIASES[raw] ?? null;
}

function getSavedEdition(): Edition {
  const param = new URLSearchParams(window.location.search).get("edition");
  const fromParam = resolveEdition(param);
  if (fromParam) return fromParam;
  const saved = localStorage.getItem(EDITION_KEY);
  return resolveEdition(saved) ?? "summer";
}

interface ReaderState {
  // Edition
  currentEdition: Edition;

  // Manifest + chapters
  manifest: BookManifest | null;
  manifestError: string | null;
  loadingManifest: boolean;
  currentChapterIndex: number;
  currentChapter: ChapterEntry | null;

  // Markdown content
  markdownContent: string;
  loadingContent: boolean;
  contentError: string | null;

  // TTS
  ttsActive: boolean;
  ttsParagraphIndex: number;
  ttsSpeed: TtsSpeed;
  ttsVoiceURI: string;

  // Ambient audio
  ambientTrack: AmbientTrackId;
  ambientVolume: number;
  ambientDucked: boolean;

  // Actions
  setEdition: (ed: Edition) => void;
  loadManifest: () => Promise<void>;
  goToChapter: (index: number) => void;
  prevChapter: () => void;
  nextChapter: () => void;
  setTtsActive: (active: boolean) => void;
  setTtsParagraphIndex: (idx: number) => void;
  setTtsSpeed: (speed: TtsSpeed) => void;
  setTtsVoiceURI: (uri: string) => void;
  setAmbientTrack: (track: AmbientTrackId) => void;
  setAmbientVolume: (vol: number) => void;
  setAmbientDucked: (ducked: boolean) => void;
}

export const useReaderStore = create<ReaderState>((set, get) => ({
  currentEdition: getSavedEdition(),

  manifest: null,
  manifestError: null,
  loadingManifest: false,
  currentChapterIndex: 0,
  currentChapter: null,

  markdownContent: "",
  loadingContent: false,
  contentError: null,

  ttsActive: false,
  ttsParagraphIndex: -1,
  ttsSpeed: 1,
  ttsVoiceURI: localStorage.getItem("tts_voice_uri") ?? "",

  ambientTrack: "none",
  ambientVolume: 0.4,
  ambientDucked: false,

  setEdition: (ed) => {
    localStorage.setItem(EDITION_KEY, ed);
    set({ currentEdition: ed, manifest: null, markdownContent: "", currentChapterIndex: 0, currentChapter: null });
    get().loadManifest();
  },

  loadManifest: async () => {
    const { currentEdition } = get();
    set({ loadingManifest: true, manifestError: null });
    const manifest = BUNDLED_MANIFESTS[currentEdition];

    const savedIdx = localStorage.getItem(getProgressKey(currentEdition));
    const startIdx =
      savedIdx !== null
        ? Math.min(parseInt(savedIdx, 10), manifest.chapters.length - 1)
        : 0;

    set({ manifest, loadingManifest: false });
    get().goToChapter(startIdx);
  },

  goToChapter: async (index: number) => {
    const { manifest, currentEdition } = get();
    if (!manifest) return;
    const chapter = manifest.chapters[index];
    if (!chapter) return;

    set({
      currentChapterIndex: index,
      currentChapter: chapter,
      ttsActive: false,
      ttsParagraphIndex: -1,
      markdownContent: "",
      loadingContent: true,
      contentError: null,
    });

    localStorage.setItem(getProgressKey(currentEdition), String(index));

    const bundled = getBundledChapter(currentEdition, chapter.mdPath);
    if (bundled !== null) {
      set({ markdownContent: bundled, loadingContent: false });
      return;
    }

    try {
      const url = `./${currentEdition}/${chapter.mdPath}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);
      const text = await res.text();
      set({ markdownContent: text, loadingContent: false });
    } catch (e) {
      set({
        contentError: e instanceof Error ? e.message : String(e),
        loadingContent: false,
      });
    }
  },

  prevChapter: () => {
    const { currentChapterIndex } = get();
    if (currentChapterIndex > 0) get().goToChapter(currentChapterIndex - 1);
  },

  nextChapter: () => {
    const { currentChapterIndex, manifest } = get();
    if (manifest && currentChapterIndex < manifest.chapters.length - 1) {
      get().goToChapter(currentChapterIndex + 1);
    }
  },

  setTtsActive: (active) => set({ ttsActive: active }),
  setTtsParagraphIndex: (idx) => set({ ttsParagraphIndex: idx }),
  setTtsSpeed: (speed) => set({ ttsSpeed: speed }),
  setTtsVoiceURI: (uri) => {
    localStorage.setItem("tts_voice_uri", uri);
    set({ ttsVoiceURI: uri });
  },
  setAmbientTrack: (track) => set({ ambientTrack: track }),
  setAmbientVolume: (vol) => set({ ambientVolume: vol }),
  setAmbientDucked: (ducked) => set({ ambientDucked: ducked }),
}));
