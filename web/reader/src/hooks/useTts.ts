import { useCallback, useEffect, useRef } from "react";
import { useReaderStore } from "../store";

/**
 * Splits markdown text (with wordsearch blocks stripped) into speakable paragraphs.
 * Skips headings markers, blank lines, and code fences.
 */
export function extractParagraphs(markdown: string): string[] {
  // Remove wordsearch code blocks entirely
  const stripped = markdown.replace(
    /```\{code-block\}\s+text[\s\S]*?```/gm,
    ""
  );

  // Split by double newlines (paragraph breaks)
  const raw = stripped.split(/\n{2,}/);

  return raw
    .map((block) => block.trim())
    .filter((block) => {
      if (!block) return false;
      // Skip pure heading lines
      if (/^#{1,6}\s/.test(block)) return false;
      // Skip MyST directive lines
      if (/^[:{]{3}/.test(block)) return false;
      // Skip code fence markers
      if (/^```/.test(block)) return false;
      // Skip front-matter
      if (/^---/.test(block)) return false;
      return true;
    })
    .map((block) =>
      // Strip inline markdown markers for speech
      block
        .replace(/!\[.*?\]\(.*?\)/g, "") // images
        .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // links
        .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, "$1") // bold/italic
        .replace(/`[^`]+`/g, "") // inline code
        .replace(/#{1,6}\s/g, "") // heading markers
        .trim()
    )
    .filter(Boolean);
}

export function useTts(paragraphs: string[]) {
  const ttsActive = useReaderStore((s) => s.ttsActive);
  const ttsParagraphIndex = useReaderStore((s) => s.ttsParagraphIndex);
  const ttsSpeed = useReaderStore((s) => s.ttsSpeed);
  const ttsVoiceURI = useReaderStore((s) => s.ttsVoiceURI);
  const setTtsActive = useReaderStore((s) => s.setTtsActive);
  const setTtsParagraphIndex = useReaderStore((s) => s.setTtsParagraphIndex);
  const setAmbientDucked = useReaderStore((s) => s.setAmbientDucked);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const activeRef = useRef(ttsActive);
  const paragraphsRef = useRef(paragraphs);
  const speedRef = useRef(ttsSpeed);
  const voiceURIRef = useRef(ttsVoiceURI);
  const indexRef = useRef(ttsParagraphIndex);

  // Keep refs in sync
  useEffect(() => {
    activeRef.current = ttsActive;
  }, [ttsActive]);
  useEffect(() => {
    paragraphsRef.current = paragraphs;
  }, [paragraphs]);
  useEffect(() => {
    speedRef.current = ttsSpeed;
  }, [ttsSpeed]);
  useEffect(() => {
    voiceURIRef.current = ttsVoiceURI;
  }, [ttsVoiceURI]);
  useEffect(() => {
    indexRef.current = ttsParagraphIndex;
  }, [ttsParagraphIndex]);

  const speakFrom = useCallback(
    (startIndex: number) => {
      if (!window.speechSynthesis) return;
      window.speechSynthesis.cancel();

      const speak = (idx: number) => {
        if (!activeRef.current) return;
        if (idx >= paragraphsRef.current.length) {
          setTtsActive(false);
          setTtsParagraphIndex(-1);
          setAmbientDucked(false);
          return;
        }

        setTtsParagraphIndex(idx);
        setAmbientDucked(true);

        const utter = new SpeechSynthesisUtterance(paragraphsRef.current[idx]);
        utter.rate = speedRef.current;
        if (voiceURIRef.current) {
          const v = window.speechSynthesis.getVoices().find(
            (v) => v.voiceURI === voiceURIRef.current
          );
          if (v) utter.voice = v;
        }
        utteranceRef.current = utter;

        utter.onend = () => {
          if (activeRef.current) {
            speak(idx + 1);
          }
        };
        utter.onerror = () => {
          if (activeRef.current) {
            speak(idx + 1);
          }
        };

        window.speechSynthesis.speak(utter);
      };

      speak(startIndex);
    },
    [setTtsActive, setTtsParagraphIndex, setAmbientDucked]
  );

  const play = useCallback(() => {
    if (!window.speechSynthesis) return;
    activeRef.current = true;  // set ref immediately — state update is async
    setTtsActive(true);
    const startIdx = indexRef.current >= 0 ? indexRef.current : 0;
    speakFrom(startIdx);
  }, [setTtsActive, speakFrom]);

  const pause = useCallback(() => {
    activeRef.current = false;
    setTtsActive(false);
    setAmbientDucked(false);
    window.speechSynthesis?.cancel();
  }, [setTtsActive, setAmbientDucked]);

  const stop = useCallback(() => {
    activeRef.current = false;
    indexRef.current = -1;
    setTtsActive(false);
    setTtsParagraphIndex(-1);
    setAmbientDucked(false);
    window.speechSynthesis?.cancel();
  }, [setTtsActive, setTtsParagraphIndex, setAmbientDucked]);

  // When speed or voice changes mid-playback, restart from current paragraph
  useEffect(() => {
    if (ttsActive && ttsParagraphIndex >= 0) {
      window.speechSynthesis?.cancel();
      const t = setTimeout(() => {
        if (activeRef.current) speakFrom(indexRef.current);
      }, 80);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ttsSpeed, ttsVoiceURI]);

  // Stop TTS when component unmounts
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return { play, pause, stop, supported: typeof window !== "undefined" && "speechSynthesis" in window };
}
