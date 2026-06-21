import { useState, useEffect, useRef } from 'react'

interface Props {
  current: number
  total: number
  sessionId: string
}

function formatElapsed(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function SessionProgress({ current, total, sessionId: _sessionId }: Props) {
  const mountedAt = useRef(Date.now())
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - mountedAt.current) / 1000))
    }, 1000)
    return () => clearInterval(id)
  }, [])

  const progressPct = total > 0 ? ((current - 1) / total) * 100 : 0

  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        background: 'var(--card)',
        borderBottom: '1px solid var(--border)',
        height: 52,
        padding: '0 28px',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
      }}
    >
      {/* Left: clue label */}
      <span
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: 'var(--primary)',
          whiteSpace: 'nowrap',
          minWidth: 110,
        }}
      >
        🗺 Clue {current}{total > 0 ? ` of ${total}` : ''}
      </span>

      {/* Center: progress bar */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="progress-bar" style={{ marginBottom: 0 }}>
          <div
            className="progress-fill"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Right: elapsed time */}
      <span
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: 'var(--text-muted)',
          fontVariantNumeric: 'tabular-nums',
          whiteSpace: 'nowrap',
          minWidth: 52,
          textAlign: 'right',
        }}
      >
        {formatElapsed(elapsed)}
      </span>
    </div>
  )
}
