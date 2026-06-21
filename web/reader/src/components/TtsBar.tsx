import { useEffect, useState } from "react";
import { useReaderStore } from "../store";
import { TTS_SPEEDS, type TtsSpeed } from "../types";
import { useTts } from "../hooks/useTts";

interface Props {
  paragraphs: string[];
}

interface VoiceGroup {
  label: string;
  voices: SpeechSynthesisVoice[];
}

function shortName(v: SpeechSynthesisVoice): string {
  // "Microsoft Aria Online (Natural) - English (United States)" → "Aria ✨"
  if (v.name.includes("Online (Natural)")) {
    const m = v.name.match(/Microsoft (\w+) Online/);
    return m ? `${m[1]} ✨` : v.name;
  }
  // "Google US English" → "Google US Eng"
  if (v.name.startsWith("Google")) {
    return v.name.replace("English", "Eng").replace("United States", "US");
  }
  // Strip trailing parenthetical language tag: "Samantha (en-US)" → "Samantha"
  return v.name.replace(/\s*\([^)]+\)\s*$/, "");
}

function groupVoices(voices: SpeechSynthesisVoice[]): VoiceGroup[] {
  const neural = voices.filter((v) => v.name.includes("Online (Natural)"));
  const google = voices.filter((v) => v.name.startsWith("Google"));
  const rest = voices.filter(
    (v) => !v.name.includes("Online (Natural)") && !v.name.startsWith("Google")
  );
  const groups: VoiceGroup[] = [];
  if (neural.length) groups.push({ label: "Edge Neural ✨", voices: neural });
  if (google.length) groups.push({ label: "Google", voices: google });
  if (rest.length) groups.push({ label: "System", voices: rest });
  return groups;
}

function useVoices() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (!window.speechSynthesis) return;

    const load = () => {
      const v = window.speechSynthesis.getVoices();
      if (v.length) setVoices(v);
    };

    load();
    // Some browsers (Chrome) fire voiceschanged async; others (Safari) are sync.
    // Belt-and-suspenders: also retry after a short delay.
    const t1 = setTimeout(load, 200);
    const t2 = setTimeout(load, 1000);
    window.speechSynthesis.addEventListener("voiceschanged", load);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.speechSynthesis.removeEventListener("voiceschanged", load);
    };
  }, []);

  return voices;
}

export function TtsBar({ paragraphs }: Props) {
  const ttsActive    = useReaderStore((s) => s.ttsActive);
  const ttsSpeed     = useReaderStore((s) => s.ttsSpeed);
  const ttsVoiceURI  = useReaderStore((s) => s.ttsVoiceURI);
  const setTtsSpeed  = useReaderStore((s) => s.setTtsSpeed);
  const setTtsVoiceURI = useReaderStore((s) => s.setTtsVoiceURI);
  const { play, pause, stop, supported } = useTts(paragraphs);

  const voices = useVoices();
  const groups = groupVoices(voices);

  if (!supported) return null;

  return (
    <div className="tts-bar">
      <span className="tts-bar__label">TTS</span>

      <div className="tts-bar__controls">
        <button
          className="tts-bar__btn"
          onClick={ttsActive ? pause : play}
          aria-label={ttsActive ? "Pause" : "Play"}
          disabled={paragraphs.length === 0}
        >
          {ttsActive ? "⏸" : "▶"}
        </button>

        <button
          className="tts-bar__btn tts-bar__btn--stop"
          onClick={stop}
          aria-label="Stop"
          disabled={!ttsActive}
        >
          ■
        </button>
      </div>

      <div className="tts-bar__speeds">
        {TTS_SPEEDS.map((s) => (
          <button
            key={s}
            className={`tts-bar__speed${s === ttsSpeed ? " tts-bar__speed--active" : ""}`}
            onClick={() => setTtsSpeed(s as TtsSpeed)}
            aria-pressed={s === ttsSpeed}
          >
            {s}×
          </button>
        ))}
      </div>

      <select
        className="tts-bar__voice"
        value={ttsVoiceURI}
        onChange={(e) => setTtsVoiceURI(e.target.value)}
        aria-label="TTS voice"
        title={
          groups.length === 0
            ? "No voices loaded yet. Try Edge or Chrome for neural voices."
            : groups.some(g => g.label.includes("✨"))
            ? "✨ = Edge neural voices (best quality)"
            : "For better voices, open in Microsoft Edge"
        }
      >
        <option value="">
          {voices.length === 0 ? "Loading voices…" : "Default voice"}
        </option>
        {groups.map((g) => (
          <optgroup key={g.label} label={g.label}>
            {g.voices.map((v) => (
              <option key={v.voiceURI} value={v.voiceURI}>
                {shortName(v)}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
}
