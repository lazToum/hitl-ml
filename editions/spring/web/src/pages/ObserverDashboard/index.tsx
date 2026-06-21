import { useState, useEffect, useRef, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Radio } from 'lucide-react'
import { listSessions, nudgeSession, observeHunt } from '../../services/api'
import { logout } from '../../services/auth'
import EventCard from './EventCard'
import AnalysisModal from './AnalysisModal'

interface Props { huntId: string; token: string }

type FilterKey = 'all' | 'answer_correct' | 'answer_attempted' | 'hint_requested' | 'session_started' | 'session_completed'

const FILTER_OPTIONS: { key: FilterKey; label: string }[] = [
  { key: 'all',               label: 'All' },
  { key: 'answer_correct',    label: '✅ Correct' },
  { key: 'answer_attempted',  label: '❌ Wrong' },
  { key: 'hint_requested',    label: '💡 Hints' },
  { key: 'session_started',   label: '🚀 Sessions' },
]

const NUDGE_TEMPLATES = [
  "You're getting closer!",
  'Think about what you see around you',
  'Try looking up!',
  'Check the date/year',
]

function elapsedLabel(startedAt: string): string {
  const ms = Date.now() - new Date(startedAt).getTime()
  const sec = Math.floor(ms / 1000)
  if (sec < 60) return `${sec}s`
  const min = Math.floor(sec / 60)
  if (min < 60) return `${min}m`
  return `${Math.floor(min / 60)}h ${min % 60}m`
}

function StatPill({ value, label }: { value: number | string; label: string }) {
  return (
    <div style={{
      flex: 1,
      background: 'rgba(255,255,255,.08)',
      borderRadius: 8,
      padding: '8px 6px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>{value}</div>
      <div style={{ fontSize: 10, color: 'rgba(255,255,255,.45)', marginTop: 2, letterSpacing: '.03em' }}>{label}</div>
    </div>
  )
}

function SidebarSessionCard({
  s,
  onNudge,
  onAnalyze,
}: {
  s: any
  onNudge?: () => void
  onAnalyze?: () => void
}) {
  const total   = s.total_clues  ?? 0
  const current = s.current_clue ?? 0
  const pct     = total > 0 ? Math.min(100, Math.round((current - 1) / total * 100)) : 0
  const done    = !!s.completed_at

  return (
    <div style={{
      background: 'rgba(255,255,255,.07)',
      borderRadius: 8,
      padding: '12px 12px 10px',
      marginBottom: 8,
    }}>
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{ fontWeight: 700, fontSize: 13, color: 'rgba(255,255,255,.92)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {s.player ?? 'Player'}
        </span>
        {done ? (
          <span style={{
            fontSize: 10, fontWeight: 700,
            background: '#0d9e8e',
            color: '#fff',
            borderRadius: 20,
            padding: '2px 8px',
            letterSpacing: '.04em',
            flexShrink: 0,
            marginLeft: 6,
          }}>
            ✓ Done
          </span>
        ) : (
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', flexShrink: 0, marginLeft: 6 }}>
            {current}/{total}
          </span>
        )}
      </div>

      {/* Progress bar */}
      {!done && total > 0 && (
        <div style={{ height: 3, background: 'rgba(255,255,255,.15)', borderRadius: 2, marginBottom: 7 }}>
          <div style={{ width: `${pct}%`, height: '100%', background: '#7c8ff5', borderRadius: 2, transition: 'width .4s ease' }} />
        </div>
      )}

      {/* Meta row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: done ? 0 : 8 }}>
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,.35)' }}>
          {s.started_at ? `⏱ ${elapsedLabel(s.started_at)}` : ''}
        </span>
        {done && s.completed_at && (
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,.35)' }}>
            Finished in {elapsedLabel(s.started_at ?? s.completed_at)}
          </span>
        )}
      </div>

      {/* Action buttons */}
      {!done && onNudge && (
        <button
          onClick={onNudge}
          style={{
            fontSize: 11, fontWeight: 600,
            background: 'rgba(255,255,255,.1)',
            color: 'rgba(255,255,255,.75)',
            border: 'none',
            borderRadius: 5,
            padding: '5px 10px',
            cursor: 'pointer',
            width: '100%',
          }}
        >
          Send nudge
        </button>
      )}

      {done && onAnalyze && (
        <button
          onClick={onAnalyze}
          style={{
            fontSize: 11, fontWeight: 600,
            background: 'rgba(13,158,142,.2)',
            color: '#6ee7df',
            border: '1px solid rgba(13,158,142,.35)',
            borderRadius: 5,
            padding: '5px 10px',
            cursor: 'pointer',
            width: '100%',
            marginTop: 4,
          }}
        >
          📊 Analysis
        </button>
      )}
    </div>
  )
}

export default function ObserverDashboard({ huntId, token }: Props) {
  const [events,       setEvents]       = useState<any[]>([])
  const [buffered,     setBuffered]     = useState<any[]>([])
  const [paused,       setPaused]       = useState(false)
  const [filter,       setFilter]       = useState<FilterKey>('all')
  const [nudgeTarget,  setNudgeTarget]  = useState<string | null>(null)
  const [nudgeMsg,     setNudgeMsg]     = useState('')
  const [sending,      setSending]      = useState(false)
  const [analysisId,   setAnalysisId]   = useState<string | null>(null)
  const wsRef  = useRef<WebSocket | null>(null)
  const logRef = useRef<HTMLDivElement>(null)

  const { data, refetch } = useQuery({
    queryKey:        ['sessions', huntId],
    queryFn:         () => listSessions(huntId),
    refetchInterval: 10_000,
  })
  const sessions: any[]        = data?.sessions ?? []
  const activeSessions         = sessions.filter((s: any) => !s.completed_at)
  const finishedSessions       = sessions.filter((s: any) => s.completed_at)
  const completionRate         = sessions.length > 0
    ? Math.round(finishedSessions.length / sessions.length * 100)
    : 0

  const handleEvent = useCallback((event: any) => {
    refetch()
    if (paused) {
      setBuffered(prev => [event, ...prev])
    } else {
      setEvents(prev => [event, ...prev].slice(0, 300))
    }
  }, [paused, refetch])

  useEffect(() => {
    const ws = observeHunt(huntId, token, handleEvent)
    wsRef.current = ws
    return () => ws.close()
  }, [huntId, token])

  // When we come off pause, flush buffer into events
  useEffect(() => {
    if (!paused && buffered.length > 0) {
      setEvents(prev => [...buffered, ...prev].slice(0, 300))
      setBuffered([])
    }
  }, [paused])

  // Reconnect ws when handleEvent identity changes (paused toggled)
  // The ws itself doesn't need reconnect — we only need the callback to see latest paused value.
  // Since observeHunt captures onEvent at call time, we reassign wsRef.current.onmessage instead.
  useEffect(() => {
    if (!wsRef.current) return
    wsRef.current.onmessage = (msg) => {
      try { handleEvent(JSON.parse(msg.data)) } catch { /* non-JSON ping */ }
    }
  }, [handleEvent])

  const displayedEvents = filter === 'all'
    ? events.slice(0, 200)
    : events.filter(e => e.event_type === filter).slice(0, 200)

  async function sendNudge() {
    if (!nudgeTarget || !nudgeMsg.trim()) return
    setSending(true)
    try {
      await nudgeSession(nudgeTarget, nudgeMsg.trim())
      setNudgeMsg('')
      setNudgeTarget(null)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="app-layout">

      {/* ── Sidebar ── */}
      <aside className="sidebar" style={{ width: 320 }}>
        <div className="sidebar-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div className="sidebar-logo">👁 Observer</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
            <a href="/learn" target="_blank" style={{ color: 'rgba(255,255,255,.35)', fontSize: 11, textDecoration: 'none' }}>📚 Handbook</a>
            <button
              onClick={logout}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.3)', fontSize: 11, cursor: 'pointer', marginTop: 2 }}
            >
              Sign out
            </button>
          </div>
        </div>

        {/* Stats strip */}
        <div style={{ display: 'flex', gap: 6, padding: '10px 12px 8px' }}>
          <StatPill value={sessions.length}        label="Total" />
          <StatPill value={activeSessions.length}  label="Active" />
          <StatPill value={`${completionRate}%`}   label="Done" />
        </div>

        <div className="sidebar-scroll" style={{ padding: '4px 12px', display: 'flex', flexDirection: 'column' }}>
          {sessions.length === 0 && (
            <p style={{ color: 'rgba(255,255,255,.3)', fontSize: 13, padding: '12px 4px' }}>
              Waiting for players…
            </p>
          )}

          {activeSessions.length > 0 && (
            <>
              <div className="sidebar-section" style={{ paddingLeft: 0 }}>Active</div>
              {activeSessions.map((s: any) => (
                <SidebarSessionCard
                  key={s.id}
                  s={s}
                  onNudge={() => { setNudgeTarget(s.id); setNudgeMsg('') }}
                />
              ))}
            </>
          )}

          {finishedSessions.length > 0 && (
            <>
              <div className="sidebar-section" style={{ paddingLeft: 0 }}>Completed</div>
              {finishedSessions.map((s: any) => (
                <SidebarSessionCard
                  key={s.id}
                  s={s}
                  onAnalyze={() => setAnalysisId(s.id)}
                />
              ))}
            </>
          )}
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="main-content">
        {/* Topbar */}
        <div className="topbar">
          <h2 style={{ flex: 'none' }}>Live Event Feed</h2>
          <span className="badge badge-teal" style={{ marginLeft: 4 }}>
            {events.length} events
          </span>
          {paused && buffered.length > 0 && (
            <span className="badge badge-yellow" style={{ marginLeft: 4 }}>
              {buffered.length} buffered
            </span>
          )}
          <div style={{ flex: 1 }} />
          <button
            className={paused ? 'btn-secondary btn-sm' : 'btn-ghost btn-sm'}
            onClick={() => setPaused(p => !p)}
            style={{ marginRight: 4 }}
          >
            {paused ? '▶ Resume' : '⏸ Pause'}
          </button>
          {events.length > 0 && (
            <button className="btn-ghost btn-sm" onClick={() => { setEvents([]); setBuffered([]) }}>
              Clear
            </button>
          )}
        </div>

        {/* Filter bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '8px 28px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--card)',
          flexShrink: 0,
        }}>
          {FILTER_OPTIONS.map(opt => (
            <button
              key={opt.key}
              onClick={() => setFilter(opt.key)}
              style={{
                fontSize: 12,
                fontWeight: 600,
                padding: '4px 12px',
                borderRadius: 20,
                border: 'none',
                cursor: 'pointer',
                background: filter === opt.key ? 'var(--primary)' : '#f1f5f9',
                color: filter === opt.key ? '#fff' : 'var(--text-muted)',
                transition: 'background 150ms ease, color 150ms ease',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Event log */}
        <div
          ref={logRef}
          style={{ flex: 1, overflowY: 'auto', padding: '12px 28px' }}
        >
          {displayedEvents.length === 0 ? (
            <div className="empty-state" style={{ paddingTop: 80 }}>
              <div className="empty-state-icon"><Radio size={36} strokeWidth={1.3} /></div>
              <p className="empty-state-text">
                {events.length === 0
                  ? 'Waiting for player activity…'
                  : 'No events match this filter.'}
              </p>
            </div>
          ) : (
            displayedEvents.map((e: any, i) => (
              <EventCard key={i} event={e} />
            ))
          )}
        </div>
      </div>

      {/* ── Nudge modal ── */}
      {nudgeTarget && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setNudgeTarget(null)}>
          <div className="modal" style={{ width: 440 }}>
            <div className="modal-header">
              <h3>Send a nudge</h3>
              <button className="modal-close" onClick={() => setNudgeTarget(null)}>×</button>
            </div>
            <div className="modal-body">
              <p style={{ color: 'var(--text-muted)', marginBottom: 14, fontSize: 13 }}>
                Your message will appear as a hint to the player.
              </p>

              {/* Template chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                {NUDGE_TEMPLATES.map((tpl) => (
                  <button
                    key={tpl}
                    onClick={() => setNudgeMsg(tpl)}
                    style={{
                      fontSize: 12,
                      padding: '5px 12px',
                      borderRadius: 20,
                      border: '1px solid var(--border)',
                      background: nudgeMsg === tpl ? 'var(--primary-light)' : 'var(--card)',
                      color: nudgeMsg === tpl ? 'var(--primary)' : 'var(--text-muted)',
                      cursor: 'pointer',
                      transition: 'background 150ms, color 150ms',
                    }}
                  >
                    {tpl}
                  </button>
                ))}
              </div>

              <div className="field">
                <label>Message</label>
                <textarea
                  rows={3}
                  value={nudgeMsg}
                  onChange={e => setNudgeMsg(e.target.value)}
                  placeholder="Type a hint or encouragement…"
                  autoFocus
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-primary" onClick={sendNudge} disabled={sending || !nudgeMsg.trim()}>
                {sending ? 'Sending…' : 'Send nudge'}
              </button>
              <button className="btn-ghost" onClick={() => setNudgeTarget(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Analysis modal ── */}
      {analysisId && (
        <AnalysisModal
          sessionId={analysisId}
          onClose={() => setAnalysisId(null)}
        />
      )}
    </div>
  )
}
