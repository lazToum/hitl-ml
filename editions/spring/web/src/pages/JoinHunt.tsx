import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { startSession } from '../services/api'

export default function JoinHunt() {
  const nav = useNavigate()
  const [params] = useSearchParams()
  const [huntId,  setHuntId]  = useState(params.get('hunt') ?? '')
  const [error,   setError]   = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Auto-join when hunt ID arrives via URL
  useEffect(() => {
    const id = params.get('hunt')
    if (id) joinWith(id)
  }, [])

  async function joinWith(id: string) {
    setLoading(true); setError(null)
    try {
      const data = await startSession(id.trim())
      nav(`/play?session=${data.session.id}`, { replace: true })
    } catch (e: any) {
      setError(e?.response?.data?.error ?? 'Could not join hunt. Check the ID and try again.')
    } finally {
      setLoading(false)
    }
  }

  async function join() {
    if (!huntId.trim()) { setError('Enter a hunt ID.'); return }
    await joinWith(huntId.trim())
  }

  return (
    <div className="login-bg">
      <div style={{ position: 'absolute', top: 16, right: 20 }}>
        <a href="/learn" target="_blank" style={{ color: 'rgba(255,255,255,.35)', fontSize: 11, textDecoration: 'none' }}>📚 Handbook</a>
      </div>
      <div className="join-card">
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: '2.2rem', marginBottom: 6 }}>🗺</div>
          <h2>Join a Hunt</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: 4, fontSize: 14 }}>
            Enter the hunt ID your organiser shared with you.
          </p>
        </div>

        <div className="field">
          <label htmlFor="hunt-id">Hunt ID</label>
          <input
            id="hunt-id"
            value={huntId}
            onChange={e => setHuntId(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && join()}
            placeholder="e.g. 3f7a9b2c-…"
            autoFocus
          />
        </div>

        {error && (
          <p style={{ color: 'var(--error-text)', fontSize: 13, marginBottom: 12 }}>{error}</p>
        )}

        <button
          className="btn-primary btn-lg btn-full"
          onClick={join}
          disabled={loading}
        >
          {loading ? 'Joining…' : 'Join Hunt'}
        </button>
      </div>
    </div>
  )
}
