import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

const http = axios.create({ baseURL: BASE })

export function setToken(token: string) {
  http.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

// ── Hunts ─────────────────────────────────────────────────────

export const createHunt = (data: { title: string; description?: string }) =>
  http.post('/hunts', data).then(r => r.data)

export const listHunts = () =>
  http.get('/hunts').then(r => r.data)

export const getHunt = (id: string) =>
  http.get(`/hunts/${id}`).then(r => r.data)

export const updateHunt = (id: string, data: object) =>
  http.patch(`/hunts/${id}`, data).then(r => r.data)

export const deleteHunt = (id: string) =>
  http.delete(`/hunts/${id}`)

export const listClues = (huntId: string) =>
  http.get(`/hunts/${huntId}/clues`).then(r => r.data)

export const upsertClue = (huntId: string, seq: number, data: object) =>
  http.put(`/hunts/${huntId}/clues/${seq}`, data).then(r => r.data)

export const deleteClue = (huntId: string, seq: number) =>
  http.delete(`/hunts/${huntId}/clues/${seq}`)

export const getQrSheet = (huntId: string) =>
  http.get(`/hunts/${huntId}/qr-sheet`).then(r => r.data)

// ── AI assist ─────────────────────────────────────────────────

export const generateClue = (huntId: string, data: object) =>
  http.post(`/hunts/${huntId}/ai/generate-clue`, data).then(r => r.data)

export const estimateDifficulty = (huntId: string, clueBody: string) =>
  http.post(`/hunts/${huntId}/ai/difficulty`, { clue_body: clueBody }).then(r => r.data)

// ── Sessions (player) ─────────────────────────────────────────

export const me = () =>
  http.get('/me').then(r => r.data)

export const startSession = (huntId: string) =>
  http.post('/sessions', { hunt_id: huntId }).then(r => r.data)

export const getSession = (id: string) =>
  http.get(`/sessions/${id}`).then(r => r.data)

export const getCurrentClue = (sessionId: string) =>
  http.get(`/sessions/${sessionId}/clue`).then(r => r.data)

export const submitAnswer = (sessionId: string, body: {
  value: string; lat?: number; lon?: number; photo_b64?: string
}) =>
  http.post(`/sessions/${sessionId}/answer`, body).then(r => r.data)

export const requestHint = (sessionId: string) =>
  http.post(`/sessions/${sessionId}/hint`).then(r => r.data)

export const analyzeSession = (sessionId: string) =>
  http.get(`/sessions/${sessionId}/analysis`).then(r => r.data)

export const listHints = (huntId: string, seq: number) =>
  http.get(`/hunts/${huntId}/clues/${seq}/hints`).then(r => r.data)

// ── Observer ──────────────────────────────────────────────────

export const listSessions = (huntId: string) =>
  http.get(`/hunts/${huntId}/sessions`).then(r => r.data)

export const nudgeSession = (sessionId: string, message: string) =>
  http.post(`/sessions/${sessionId}/nudge`, { message }).then(r => r.data)

export const listPublicHunts = () =>
  http.get('/public/hunts').then(r => r.data)

export function observeHunt(huntId: string, token: string, onEvent: (e: object) => void): WebSocket {
  const base = BASE.replace(/^http/, 'ws')
  const url  = `${base}/hunts/${huntId}/observe?token=${encodeURIComponent(token)}`
  const ws   = new WebSocket(url)
  ws.onmessage = (msg) => {
    try { onEvent(JSON.parse(msg.data)) } catch { /* non-JSON ping */ }
  }
  return ws
}
