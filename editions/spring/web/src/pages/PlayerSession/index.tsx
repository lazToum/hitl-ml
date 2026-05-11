import { useState, useEffect, useRef, useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { MapPin, Lightbulb, AlertTriangle, Camera, RefreshCw } from 'lucide-react'
import { getCurrentClue, getSession, submitAnswer, requestHint } from '../../services/api'
import SessionProgress from './SessionProgress'
import PlayerMap from './PlayerMap'
import HuntComplete from './HuntComplete'

interface Clue {
  id: string
  sequence: number
  title: string
  body: string
  answer_type: string
  media_url?: string
  target_coords?: string
}

interface HintView {
  sequence: number
  body: string
}

interface SessionInfo {
  total_clues: number
  current_clue_sequence: number
}

// ── Correct flash ────────────────────────────────────────────────
function CorrectFlash({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const id = setTimeout(onDone, 900)
    return () => clearTimeout(id)
  }, [onDone])

  return (
    <div className="correct-flash entering">
      <div className="correct-flash-badge">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        Correct
      </div>
    </div>
  )
}

// ── Inline spinner ───────────────────────────────────────────────
function Spinner() {
  return (
    <span
      style={{
        display: 'inline-block',
        width: 14,
        height: 14,
        border: '2px solid rgba(255,255,255,0.35)',
        borderTopColor: '#fff',
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
        verticalAlign: 'middle',
        marginRight: 7,
        flexShrink: 0,
      }}
    />
  )
}

// ── GPS helper ───────────────────────────────────────────────────
type GpsResult =
  | { coords: GeolocationCoordinates; error?: never }
  | { coords?: never; error: string }

function gpsOnce(opts: PositionOptions): Promise<GpsResult> {
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ coords: pos.coords }),
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          resolve({ error: 'Location permission denied. Enable location access and try again.' })
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          resolve({ error: 'Location unavailable. Check your device settings.' })
        } else {
          resolve({ error: 'timeout' })
        }
      },
      opts,
    )
  })
}

async function getGps(): Promise<GpsResult> {
  if (!navigator.geolocation) {
    return { error: 'Geolocation is not supported by your browser.' }
  }
  // First: accept a position up to 60s old — instant on desktop (WiFi cache)
  const cached = await gpsOnce({ timeout: 4_000, enableHighAccuracy: false, maximumAge: 60_000 })
  if (cached.coords) return cached
  if (cached.error !== 'timeout') return cached   // permission denied or unavailable — don't retry

  // Second: fresh fix with a generous timeout
  const fresh = await gpsOnce({ timeout: 20_000, enableHighAccuracy: false, maximumAge: 0 })
  if (fresh.error === 'timeout') return { error: 'Location timed out. Make sure location services are enabled and try again.' }
  return fresh
}

// ── Answer type helpers ──────────────────────────────────────────
const ANSWER_TYPE_LABEL: Record<string, string> = {
  text: 'Text', qr: 'QR Code', nfc: 'NFC', gps: 'GPS Location', photo: 'Photo',
}
const ANSWER_TYPE_BADGE: Record<string, string> = {
  text: 'badge-blue', qr: 'badge-gray', nfc: 'badge-gray', gps: 'badge-teal', photo: 'badge-yellow',
}

// ── Main component ───────────────────────────────────────────────
export default function PlayerSession() {
  const [params] = useSearchParams()
  const nav = useNavigate()
  const sessionId = params.get('session') ?? ''

  const mountedAt = useRef(Date.now())

  const [clue, setClue] = useState<Clue | null>(null)
  const [loading, setLoading] = useState(true)
  const [clueError, setClueError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState<string | null>(null)
  const [fbKind, setFbKind] = useState<'correct' | 'close' | 'wrong' | null>(null)
  const [hints, setHints] = useState<HintView[]>([])
  const [hintLoading, setHintLoading] = useState(false)
  const [complete, setComplete] = useState(false)
  const [mapPos, setMapPos] = useState<{ lat: number; lon: number } | null>(null)
  const [photoB64, setPhotoB64] = useState<string | null>(null)
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null)
  const [showFlash, setShowFlash] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null)

  useEffect(() => {
    if (!sessionId) return
    let active = true
    const fetchSession = async () => {
      try {
        const data = await getSession(sessionId)
        if (active) {
          setSessionInfo({
            total_clues: data.total_clues ?? 0,
            current_clue_sequence: data.current_clue_sequence ?? 1,
          })
        }
      } catch {
        // non-fatal
      }
    }
    fetchSession()
    const id = setInterval(fetchSession, 30_000)
    return () => { active = false; clearInterval(id) }
  }, [sessionId])

  const loadClue = useCallback(async () => {
    setLoading(true)
    setFeedback(null)
    setFbKind(null)
    setHints([])
    setClueError(null)
    try {
      const data = await getCurrentClue(sessionId)
      setClue(data.clue)
      setAnswer('')
      setPhotoB64(null)
      setPhotoPreviewUrl(null)
      setMapPos(null)
    } catch (e: any) {
      const status = e?.response?.status
      if (status === 404 || status === 410) {
        setComplete(true)
      } else {
        setClueError(e?.response?.data?.error ?? 'Could not load clue. Please check your connection.')
      }
    } finally {
      setLoading(false)
    }
  }, [sessionId])

  useEffect(() => {
    if (!sessionId) { nav('/join', { replace: true }); return }
    loadClue()
  }, [sessionId])

  async function submit() {
    if (!clue || submitting) return
    setSubmitting(true)
    setFeedback(null)
    setFbKind(null)
    try {
      let lat: number | undefined, lon: number | undefined
      if (clue.answer_type === 'gps') {
        if (mapPos) {
          // Reuse coordinates already acquired by the map's watchPosition
          lat = mapPos.lat
          lon = mapPos.lon
        } else {
          // Fallback: map hasn't reported a position yet — try a fresh request
          const gps = await getGps()
          if (gps.error) {
            setFeedback(gps.error)
            setFbKind('wrong')
            setSubmitting(false)
            return
          }
          lat = gps.coords!.latitude
          lon = gps.coords!.longitude
        }
      }
      const result = await submitAnswer(sessionId, {
        value: answer,
        lat,
        lon,
        photo_b64: photoB64 ?? undefined,
      })
      if (result.hunt_complete) {
        setComplete(true)
        return
      }
      if (result.passed) {
        setFbKind('correct')
        setFeedback(result.feedback)
        setShowFlash(true)
      } else {
        setFbKind(result.score >= 0.6 ? 'close' : 'wrong')
        setFeedback(result.feedback)
      }
    } catch (e: any) {
      setFeedback(e?.response?.data?.error ?? 'Submission failed. Try again.')
      setFbKind('wrong')
    } finally {
      setSubmitting(false)
    }
  }

  const handleFlashDone = useCallback(() => {
    setShowFlash(false)
    loadClue()
  }, [loadClue])

  async function getHint() {
    setHintLoading(true)
    try {
      const data = await requestHint(sessionId)
      const h = data.hint as HintView
      setHints((prev) =>
        prev.some((x) => x.sequence === h.sequence) ? prev : [...prev, h],
      )
    } catch (e: any) {
      setFeedback(e?.response?.data?.error ?? 'No hint available yet.')
      setFbKind('wrong')
    } finally {
      setHintLoading(false)
    }
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const objectUrl = URL.createObjectURL(file)
    setPhotoPreviewUrl(objectUrl)
    const reader = new FileReader()
    reader.onload = () => {
      setPhotoB64((reader.result as string).split(',')[1])
    }
    reader.readAsDataURL(file)
  }

  function retakePhoto() {
    setPhotoB64(null)
    if (photoPreviewUrl) {
      URL.revokeObjectURL(photoPreviewUrl)
      setPhotoPreviewUrl(null)
    }
    if (fileRef.current) fileRef.current.value = ''
    fileRef.current?.click()
  }

  if (!sessionId) return null

  if (complete) {
    const elapsedMs = Date.now() - mountedAt.current
    return (
      <HuntComplete
        totalClues={sessionInfo?.total_clues ?? 0}
        elapsedMs={elapsedMs}
        onPlayAgain={() => nav('/join')}
      />
    )
  }

  if (loading) {
    return (
      <div className="player-state">
        <div className="player-state-card">
          <div className="player-state-icon">
            <MapPin size={36} strokeWidth={1.5} />
          </div>
          <h3 className="player-state-title">Loading clue…</h3>
          <p className="player-state-sub">Fetching your next waypoint.</p>
        </div>
      </div>
    )
  }

  if (clueError) {
    return (
      <div className="player-state">
        <div className="player-state-card">
          <div className="player-state-icon" style={{ color: 'var(--error-text)' }}>
            <AlertTriangle size={36} strokeWidth={1.5} />
          </div>
          <h3 className="player-state-title">Something went wrong</h3>
          <p className="player-state-sub">{clueError}</p>
          <button
            className="btn-primary btn-lg btn-full"
            onClick={loadClue}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 7, justifyContent: 'center' }}
          >
            <RefreshCw size={15} strokeWidth={2} />
            Try again
          </button>
        </div>
      </div>
    )
  }

  if (!clue) return null

  const answerType = clue.answer_type
  const currentSeq = sessionInfo?.current_clue_sequence ?? clue.sequence
  const totalClues = sessionInfo?.total_clues ?? 0

  return (
    <>
      {showFlash && <CorrectFlash onDone={handleFlashDone} />}

      <SessionProgress
        current={currentSeq}
        total={totalClues}
        sessionId={sessionId}
      />

      <div className="player-page" style={{ paddingTop: 20 }}>
        <div className="player-inner">

          {/* Clue card */}
          <div className="clue-card">
            <div className="clue-card-header">
              <span className="clue-seq-large">Waypoint {clue.sequence}</span>
              <span className={`badge ${ANSWER_TYPE_BADGE[answerType] ?? 'badge-gray'}`}>
                {ANSWER_TYPE_LABEL[answerType] ?? answerType}
              </span>
            </div>
            <h2 className="clue-title-large">{clue.title}</h2>
            {clue.media_url && (
              <img
                src={clue.media_url}
                alt="clue"
                style={{ width: '100%', borderRadius: 8, marginBottom: 16, display: 'block' }}
              />
            )}
            <p className="clue-body">{clue.body}</p>
          </div>

          {/* Answer area */}
          <div className="answer-card">

            {answerType === 'text' && (
              <>
                <div className="field" style={{ marginBottom: 12 }}>
                  <label>Your answer</label>
                  <input
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && submit()}
                    placeholder="Type here and press Enter…"
                    autoFocus
                  />
                </div>
                <button
                  className="btn-primary btn-lg btn-full"
                  onClick={submit}
                  disabled={submitting}
                >
                  {submitting ? <><Spinner />Checking…</> : 'Submit answer'}
                </button>
              </>
            )}

            {(answerType === 'qr' || answerType === 'nfc') && (
              <>
                <p style={{ color: 'var(--text-muted)', marginBottom: 13, fontSize: 14, lineHeight: 1.65, fontFamily: 'var(--font-body)' }}>
                  {answerType === 'qr'
                    ? 'Scan the QR code at the location, or enter the token below.'
                    : 'Tap the NFC tag with your phone, or enter the token below.'}
                </p>
                <div className="field" style={{ marginBottom: 12 }}>
                  <label>Token</label>
                  <input
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Auto-filled by scan…"
                  />
                </div>
                <button
                  className="btn-primary btn-lg btn-full"
                  onClick={submit}
                  disabled={submitting || !answer.trim()}
                >
                  {submitting ? <><Spinner />Checking…</> : 'Submit token'}
                </button>
              </>
            )}

            {answerType === 'gps' && (
              <>
                <p style={{ color: 'var(--text-muted)', marginBottom: 13, fontSize: 14, lineHeight: 1.65, fontFamily: 'var(--font-body)' }}>
                  Navigate to the location on the map below, then tap the button when you arrive.
                </p>
                <PlayerMap
                  targetCoords={clue.target_coords}
                  onPosition={(lat, lon) => setMapPos({ lat, lon })}
                />
                <button
                  className="btn-teal btn-lg btn-full"
                  onClick={submit}
                  disabled={submitting}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}
                >
                  {submitting
                    ? <><Spinner />Checking location…</>
                    : <><MapPin size={16} strokeWidth={2} />I am here</>
                  }
                </button>
              </>
            )}

            {answerType === 'photo' && (
              <>
                <p style={{ color: 'var(--text-muted)', marginBottom: 14, fontSize: 14, lineHeight: 1.65, fontFamily: 'var(--font-body)' }}>
                  Take a photo at the location to confirm you were there.
                </p>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  style={{ display: 'none' }}
                  onChange={handlePhotoChange}
                />
                {photoPreviewUrl ? (
                  <div style={{ marginBottom: 14 }}>
                    <img
                      src={photoPreviewUrl}
                      alt="preview"
                      style={{
                        width: '100%',
                        borderRadius: 'var(--radius)',
                        maxHeight: 240,
                        objectFit: 'cover',
                        display: 'block',
                        border: '1px solid var(--border)',
                      }}
                    />
                    <button
                      className="btn-ghost btn-sm"
                      style={{ marginTop: 10, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                      onClick={retakePhoto}
                    >
                      <RefreshCw size={13} strokeWidth={2} />
                      Retake photo
                    </button>
                  </div>
                ) : (
                  <button
                    className="btn-ghost btn-lg btn-full"
                    style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}
                    onClick={() => fileRef.current?.click()}
                  >
                    <Camera size={17} strokeWidth={1.8} />
                    Take photo
                  </button>
                )}
                <button
                  className="btn-primary btn-lg btn-full"
                  onClick={submit}
                  disabled={submitting || !photoB64}
                >
                  {submitting ? <><Spinner />Verifying photo…</> : 'Submit photo'}
                </button>
              </>
            )}

            {feedback && (
              <div className={`feedback ${fbKind ?? 'wrong'}`}>{feedback}</div>
            )}
          </div>

          {/* Hints */}
          {hints.length > 0 && (
            <div className="hint-card">
              <div className="hint-card-header">
                <Lightbulb size={13} strokeWidth={2} />
                Field Notes
              </div>
              {hints.map((h) => (
                <p key={h.sequence} className="hint-item">
                  {h.sequence > 0 ? `${h.sequence}. ` : ''}{h.body}
                </p>
              ))}
            </div>
          )}

          <button
            className="hint-btn"
            onClick={getHint}
            disabled={hintLoading}
          >
            <Lightbulb size={15} strokeWidth={1.8} />
            {hintLoading ? 'Fetching field note…' : 'Request a hint'}
          </button>

        </div>
      </div>
    </>
  )
}
