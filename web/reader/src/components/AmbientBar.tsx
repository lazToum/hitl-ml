import { useReaderStore } from "../store";
import { AMBIENT_TRACKS } from "../types";
import type { AmbientTrackId } from "../types";
import { useAmbient } from "../hooks/useAmbient";

export function AmbientBar() {
  const ambientTrack = useReaderStore((s) => s.ambientTrack);
  const ambientVolume = useReaderStore((s) => s.ambientVolume);
  const setAmbientTrack = useReaderStore((s) => s.setAmbientTrack);
  const setAmbientVolume = useReaderStore((s) => s.setAmbientVolume);

  // Mount the audio engine
  useAmbient();

  return (
    <div className="ambient-bar">
      <span className="ambient-bar__label">Ambient</span>

      <div className="ambient-bar__tracks">
        {AMBIENT_TRACKS.map((t) => (
          <button
            key={t.id}
            className={`ambient-bar__track${ambientTrack === t.id ? " ambient-bar__track--active" : ""}`}
            onClick={() => setAmbientTrack(t.id as AmbientTrackId)}
            aria-pressed={ambientTrack === t.id}
          >
            {t.label}
          </button>
        ))}
      </div>

      <label className="ambient-bar__vol-label">
        <span className="ambient-bar__vol-icon">🔊</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={ambientVolume}
          onChange={(e) => setAmbientVolume(parseFloat(e.target.value))}
          className="ambient-bar__vol-slider"
          aria-label="Ambient volume"
          disabled={ambientTrack === "none"}
        />
      </label>
    </div>
  );
}
