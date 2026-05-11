import { useState, useEffect } from 'react'
import { analyzeSession } from '../../services/api'

interface Props {
  sessionId: string
  onClose: () => void
}

type State =
  | { status: 'loading' }
  | { status: 'success'; report: string }
  | { status: 'error'; message: string }

function Spinner() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '40px 0' }}>
      <div style={{
        width: 36,
        height: 36,
        border: '3px solid #e2e8f0',
        borderTopColor: '#2b3a8f',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <p style={{ color: '#64748b', fontSize: 14 }}>Analyzing session with AI…</p>
    </div>
  )
}

function ReportBody({ report }: { report: string }) {
  // Split into paragraphs; lines starting with common data-like prefixes use monospace
  const lines = report.split('\n')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {lines.map((line, i) => {
        const trimmed = line.trim()
        if (!trimmed) return <div key={i} style={{ height: 10 }} />

        const isData = /^[\d\-\*\|>#]/.test(trimmed) || trimmed.includes(':') && trimmed.length < 60
        return (
          <p
            key={i}
            style={{
              fontFamily: isData ? 'JetBrains Mono, Consolas, monospace' : 'inherit',
              fontSize: isData ? 12 : 14,
              lineHeight: isData ? 1.6 : 1.75,
              color: isData ? '#2b3a8f' : '#1a202c',
              background: isData ? '#eef0fb' : 'transparent',
              borderRadius: isData ? 4 : 0,
              padding: isData ? '2px 6px' : 0,
              margin: 0,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {line}
          </p>
        )
      })}
    </div>
  )
}

export default function AnalysisModal({ sessionId, onClose }: Props) {
  const [state, setState] = useState<State>({ status: 'loading' })

  async function load() {
    setState({ status: 'loading' })
    try {
      const data = await analyzeSession(sessionId)
      const report: string =
        typeof data === 'string'
          ? data
          : data?.report ?? data?.analysis ?? JSON.stringify(data, null, 2)
      setState({ status: 'success', report })
    } catch (err: any) {
      setState({
        status: 'error',
        message: err?.response?.data?.detail ?? err?.message ?? 'Something went wrong.',
      })
    }
  }

  useEffect(() => { load() }, [sessionId])

  function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal" style={{ width: 640 }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 18 }}>📊</span>
            <h3 style={{ margin: 0 }}>Session Analysis</h3>
            <span style={{
              fontSize: 10,
              fontWeight: 600,
              background: '#eef0fb',
              color: '#2b3a8f',
              padding: '2px 7px',
              borderRadius: 20,
              letterSpacing: '.04em',
              textTransform: 'uppercase',
            }}>
              AI Report
            </span>
          </div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {state.status === 'loading' && <Spinner />}

          {state.status === 'error' && (
            <div style={{
              background: '#fff5f5',
              border: '1px solid #fed7d7',
              borderRadius: 8,
              padding: '20px 20px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>⚠️</div>
              <p style={{ color: '#c53030', fontWeight: 600, marginBottom: 6 }}>Analysis failed</p>
              <p style={{ color: '#64748b', fontSize: 13, marginBottom: 16 }}>{state.message}</p>
              <button className="btn-secondary btn-sm" onClick={load}>Retry</button>
            </div>
          )}

          {state.status === 'success' && (
            <div style={{
              background: '#fafafa',
              border: '1px solid #e2e8f0',
              borderRadius: 8,
              padding: '18px 20px',
              maxHeight: 480,
              overflowY: 'auto',
            }}>
              <ReportBody report={state.report} />
            </div>
          )}
        </div>

        <div className="modal-footer">
          <div style={{ flex: 1, color: '#a0aec0', fontSize: 11 }}>
            Session <code style={{ fontFamily: 'monospace', fontSize: 11 }}>{sessionId.slice(0, 12)}…</code>
          </div>
          <button className="btn-ghost btn-sm" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}
