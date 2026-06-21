import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { handleCallback } from '../services/auth'
import { me } from '../services/api'

function roleToPath(role: string): string {
  switch (role) {
    case 'creator':  return '/creator'
    case 'observer': return '/observer'
    case 'player':   return '/hunts'
    default:         return '/hunts'
  }
}

export default function Callback() {
  const navigate = useNavigate()
  const ran      = useRef(false)

  useEffect(() => {
    if (ran.current) return
    ran.current = true
    handleCallback()
      .then(async () => {
        // If the user was trying to reach a specific page before auth, honour it.
        const saved = localStorage.getItem('postLoginPath')
        localStorage.removeItem('postLoginPath')
        if (saved && saved !== '/login') {
          navigate(saved, { replace: true })
          return
        }
        // Otherwise route to the page that matches their role.
        const profile = await me()
        navigate(roleToPath(profile.role), { replace: true })
      })
      .catch(() => navigate('/login', { replace: true }))
  }, [navigate])

  return (
    <div className="login-bg">
      <div className="login-card">
        <div className="login-logo">🗺</div>
        <p style={{ color: 'var(--text-muted)', marginTop: 8 }}>Signing in…</p>
      </div>
    </div>
  )
}
