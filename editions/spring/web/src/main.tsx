import './index.css'
import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'

import CreatorDashboard  from './pages/CreatorDashboard'
import ObserverDashboard from './pages/ObserverDashboard'
import PlayerSession     from './pages/PlayerSession'
import JoinHunt          from './pages/JoinHunt'
import Login             from './pages/Login'
import Callback          from './pages/Callback'
import HuntBrowser       from './pages/HuntBrowser'
import Learn             from './pages/Learn'
import { getToken, isLoggedIn } from './services/auth'

const queryClient = new QueryClient()

// ── Auth guard ────────────────────────────────────────────────

function RequireAuth() {
  const [checked, setChecked] = useState(false)
  const [authed,  setAuthed]  = useState(false)

  useEffect(() => {
    isLoggedIn().then(ok => { setAuthed(ok); setChecked(true) })
  }, [])

  if (!checked) return null
  if (authed) return <Outlet />

  const returnTo = window.location.pathname + window.location.search
  if (returnTo !== '/login') {
    localStorage.setItem('postLoginPath', returnTo)
  }
  return <Navigate to="/login" replace />
}

// ── Observer wrapper (needs token + huntId from query params) ─

function ObserverRoute() {
  const [token,  setToken]  = useState<string | null>(null)
  const [huntId, setHuntId] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setHuntId(params.get('hunt') ?? '')
    getToken().then(setToken)
  }, [])

  if (!token) return <div className="page-center"><p style={{ color: 'var(--text-muted)' }}>Loading…</p></div>
  return <ObserverDashboard huntId={huntId} token={token} />
}

// ── App ───────────────────────────────────────────────────────

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login"    element={<Login />} />
          <Route path="/callback" element={<Callback />} />
          <Route path="/discover" element={<HuntBrowser />} />
          <Route path="/learn"    element={<Learn />} />

          <Route element={<RequireAuth />}>
            <Route path="/creator"  element={<CreatorDashboard />} />
            <Route path="/observer" element={<ObserverRoute />} />
            <Route path="/hunts"    element={<HuntBrowser />} />
            <Route path="/join"     element={<JoinHunt />} />
            <Route path="/play"     element={<PlayerSession />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
)
