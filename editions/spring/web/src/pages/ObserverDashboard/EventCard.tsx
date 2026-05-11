interface HuntEvent {
  event_type: string
  payload: any
  ts: string
  session_id?: string
}

interface Props {
  event: HuntEvent
}

interface EventMeta {
  emoji: string
  label: string
  iconBg: string
  iconColor: string
  subtitle?: (payload: any) => string | null
}

const EVENT_META: Record<string, EventMeta> = {
  session_started: {
    emoji: '🚀',
    label: 'Session started',
    iconBg: '#eef0fb',
    iconColor: '#2b3a8f',
  },
  session_completed: {
    emoji: '🏆',
    label: 'Hunt completed!',
    iconBg: '#e6f7f5',
    iconColor: '#0d9e8e',
  },
  answer_correct: {
    emoji: '✅',
    label: 'Correct answer',
    iconBg: '#e6f7f5',
    iconColor: '#0d9e8e',
  },
  answer_attempted: {
    emoji: '❌',
    label: 'Wrong answer',
    iconBg: '#fff5f5',
    iconColor: '#c53030',
    subtitle: (p) => p?.value ? `"${p.value}"` : null,
  },
  hint_requested: {
    emoji: '💡',
    label: 'Hint requested',
    iconBg: '#fffbeb',
    iconColor: '#92400e',
    subtitle: (p) => p?.sequence != null ? `Hint #${p.sequence}` : null,
  },
  clue_viewed: {
    emoji: '👁',
    label: 'Clue viewed',
    iconBg: '#eef0fb',
    iconColor: '#2b3a8f',
    subtitle: (p) => p?.sequence != null ? `Clue #${p.sequence}` : null,
  },
}

const FALLBACK_META: EventMeta = {
  emoji: '📌',
  label: '',
  iconBg: '#f1f5f9',
  iconColor: '#64748b',
}

function formatTime(ts: string): string {
  const date = new Date(ts)
  const now = Date.now()
  const diffMs = now - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)

  if (diffSec < 60) return 'just now'
  if (diffSec < 3600) {
    const m = Math.floor(diffSec / 60)
    return `${m} min ago`
  }
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

export default function EventCard({ event }: Props) {
  const meta = EVENT_META[event.event_type] ?? FALLBACK_META
  const label = meta.label || event.event_type.replace(/_/g, ' ')
  const subtitle = meta.subtitle ? meta.subtitle(event.payload) : null

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '10px 0',
      borderBottom: '1px solid #f4f6fb',
      minHeight: 48,
    }}>
      {/* Icon circle */}
      <div style={{
        width: 34,
        height: 34,
        borderRadius: '50%',
        background: meta.iconBg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 16,
        flexShrink: 0,
      }}>
        {meta.emoji}
      </div>

      {/* Middle: label + subtitle */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontWeight: 600,
          fontSize: 13,
          color: '#1a202c',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {label}
        </div>
        {subtitle && (
          <div style={{
            fontSize: 11,
            color: '#64748b',
            marginTop: 1,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {subtitle}
          </div>
        )}
        {event.session_id && (
          <div style={{ fontSize: 10, color: '#a0aec0', marginTop: 1, fontVariantNumeric: 'tabular-nums' }}>
            {event.session_id.slice(0, 8)}
          </div>
        )}
      </div>

      {/* Right: time */}
      <div style={{
        fontSize: 11,
        color: '#a0aec0',
        whiteSpace: 'nowrap',
        fontVariantNumeric: 'tabular-nums',
        flexShrink: 0,
      }}>
        {formatTime(event.ts)}
      </div>
    </div>
  )
}
