import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, isLoggedIn } from '../services/auth'
import { me } from '../services/api'

function roleToPath(role: string): string {
  switch (role) {
    case 'creator':  return '/creator'
    case 'observer': return '/observer'
    case 'player':   return '/hunts'
    default:         return '/hunts'
  }
}

export default function Login() {
  const nav = useNavigate()
  const [error, setError] = useState<string | null>(null)

  // If already authenticated, skip the login page and go straight to the
  // role-appropriate dashboard (honours any saved postLoginPath too).
  useEffect(() => {
    isLoggedIn().then(async ok => {
      if (!ok) return
      const saved = localStorage.getItem('postLoginPath')
      if (saved && saved !== '/login' && saved !== '/') {
        localStorage.removeItem('postLoginPath')
        nav(saved, { replace: true })
        return
      }
      const profile = await me().catch(() => null)
      nav(profile ? roleToPath(profile.role) : '/hunts', { replace: true })
    })
  }, [nav])

  const startLogin = async () => {
    setError(null)
    try {
      await login()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    }
  }

  return (
    <div className="login-bg">
      <div className="login-card">
        <div className="login-logo">🗺</div>
        <h1 className="login-title">Treasure Hunt</h1>
        <p className="login-sub">Sign in to create, observe, or play hunts</p>

        <button className="btn-primary btn-lg btn-full" onClick={startLogin}>
          Sign in
        </button>

        {error && <p className="login-error">{error}</p>}

        <p className="login-hint">
          Dev accounts — password is <code>Password1!</code><br />
          <code>creator@example.com</code> · <code>observer@example.com</code> · <code>player@example.com</code>
        </p>

        <div style={{ marginTop: 20, textAlign: 'center' }}>
          <button
            onClick={() => nav('/discover')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: 13,
              cursor: 'pointer',
              textDecoration: 'underline',
              textUnderlineOffset: 3,
              padding: 0,
            }}
          >
            Browse hunts →
          </button>
        </div>
      </div>
    </div>
  )
}
