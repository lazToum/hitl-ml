export type Edition = "summer" | "winter" | "spring" | "autumn";

export const EDITIONS: { id: Edition; label: string; subtitle: string }[] = [
  { id: "summer", label: "Summer", subtitle: "Online Reading" },
  { id: "winter", label: "Winter", subtitle: "Complete Textbook" },
  { id: "spring", label: "Spring", subtitle: "Building the Loop" },
  { id: "autumn", label: "Autumn", subtitle: "Pamphlet" },
];

export interface ChapterEntry {
  id: string;
  index: number;
  title: string;
  mdPath: string;
  ttsScriptPath?: string;
  soundtrackTrackId?: string;
  estimatedReadMinutes?: number;
}

export interface BookManifest {
  version: "1.0";
  metadata: {
    title: string;
    subtitle: string;
  };
  chapters: ChapterEntry[];
}

// Legacy aliases kept so nothing else breaks
export type SummerChapterEntry = ChapterEntry;
export type SummerManifest = BookManifest;

export interface WordsearchData {
  words: string[];
  grid: string[][];
}

export type AmbientTrackId =
  | "cafe-garden"
  | "beach-breeze"
  | "forest"
  | "rain"
  | "none";

export const AMBIENT_TRACKS: { id: AmbientTrackId; label: string }[] = [
  { id: "none", label: "None" },
  { id: "cafe-garden", label: "Cafe Garden" },
  { id: "beach-breeze", label: "Beach Breeze" },
  { id: "forest", label: "Forest" },
  { id: "rain", label: "Rain" },
];

export const TTS_SPEEDS = [0.8, 0.95, 1, 1.2, 1.5] as const;
export type TtsSpeed = (typeof TTS_SPEEDS)[number];
