import { useEffect, useRef } from 'react'
import {
  Engine,
  Scene,
  HemisphericLight,
  Vector3,
  Color4,
  ParticleSystem,
  Texture,
  ArcRotateCamera,
} from '@babylonjs/core'

interface HuntCompleteProps {
  totalClues: number
  elapsedMs: number
  onPlayAgain?: () => void
}

function formatTime(ms: number): string {
  const totalSec = Math.floor(ms / 1000)
  const m = Math.floor(totalSec / 60)
  const s = totalSec % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

export default function HuntComplete({ totalClues, elapsedMs, onPlayAgain }: HuntCompleteProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const engine = new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true })
    const scene = new Scene(engine)

    // Transparent background so CSS gradient shows through
    scene.clearColor = new Color4(0, 0, 0, 0)

    // Minimal camera (not interactive — particles only)
    const camera = new ArcRotateCamera('cam', 0, 0, 10, Vector3.Zero(), scene)
    camera.setPosition(new Vector3(0, 0, -20))

    // Ambient light
    const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene)
    light.intensity = 1.2

    // ── Particle system ──────────────────────────────────────────
    const ps = new ParticleSystem('celebration', 2000, scene)

    // Use a blank white texture (Babylon fallback handles missing texture gracefully)
    ps.particleTexture = new Texture(null, scene)

    ps.emitter = new Vector3(0, -10, 0)
    ps.minEmitBox = new Vector3(-8, -10, 0)
    ps.maxEmitBox = new Vector3(8, -10, 0)

    // Direction — upward burst with spread
    ps.direction1 = new Vector3(-3, 8, -1)
    ps.direction2 = new Vector3(3, 12, 1)

    // Colors: gold, teal, indigo, white
    ps.color1      = new Color4(1.0, 0.843, 0.0, 1.0)   // #FFD700 gold
    ps.color2      = new Color4(0.051, 0.620, 0.553, 1.0) // #0d9e8e teal
    ps.colorDead   = new Color4(0.169, 0.227, 0.561, 0.0) // #2b3a8f indigo, fade out

    ps.minSize = 0.15
    ps.maxSize = 0.4

    ps.minLifeTime = 2
    ps.maxLifeTime = 4

    ps.emitRate = 400

    ps.gravity = new Vector3(0, -1.5, 0)

    ps.minAngularSpeed = 0
    ps.maxAngularSpeed = Math.PI * 2

    ps.minEmitPower = 1
    ps.maxEmitPower = 4

    ps.updateSpeed = 0.016

    ps.start()

    engine.runRenderLoop(() => scene.render())

    const handleResize = () => engine.resize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      engine.dispose()
    }
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'linear-gradient(135deg, #0d1b4b 0%, #0d3b35 100%)',
        overflow: 'hidden',
      }}
    >
      {/* Babylon canvas filling the full screen */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          outline: 'none',
        }}
      />

      {/* Overlay content */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          zIndex: 10,
          padding: '24px',
        }}
      >
        <div
          style={{
            background: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(12px)',
            borderRadius: 24,
            padding: '40px 48px',
            maxWidth: 420,
            width: '100%',
            textAlign: 'center',
            border: '1px solid rgba(255,255,255,0.12)',
            boxShadow: '0 8px 48px rgba(0,0,0,0.5)',
            pointerEvents: 'auto',
          }}
        >
          <div style={{ fontSize: '3.5rem', lineHeight: 1, marginBottom: 12 }}>🏆</div>

          <h1
            style={{
              fontSize: '2rem',
              fontWeight: 800,
              color: '#fff',
              marginBottom: 8,
              textShadow: '0 2px 16px rgba(255,215,0,0.6)',
              letterSpacing: '-0.02em',
            }}
          >
            Hunt Complete!
          </h1>

          <p
            style={{
              color: 'rgba(255,255,255,0.65)',
              fontSize: 15,
              marginBottom: 32,
            }}
          >
            Outstanding work — you found every clue!
          </p>

          {/* Stats */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 16,
              marginBottom: 32,
            }}
          >
            <div
              style={{
                background: 'rgba(255,255,255,0.07)',
                borderRadius: 12,
                padding: '16px 12px',
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: 'rgba(255,255,255,0.45)',
                  textTransform: 'uppercase',
                  letterSpacing: '.06em',
                  marginBottom: 6,
                }}
              >
                Clues solved
              </div>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  color: '#FFD700',
                }}
              >
                {totalClues}
              </div>
            </div>

            <div
              style={{
                background: 'rgba(255,255,255,0.07)',
                borderRadius: 12,
                padding: '16px 12px',
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: 'rgba(255,255,255,0.45)',
                  textTransform: 'uppercase',
                  letterSpacing: '.06em',
                  marginBottom: 6,
                }}
              >
                Time taken
              </div>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  color: '#0d9e8e',
                }}
              >
                {formatTime(elapsedMs)}
              </div>
            </div>
          </div>

          {onPlayAgain && (
            <button
              onClick={onPlayAgain}
              style={{
                background: 'transparent',
                border: '2px solid rgba(255,255,255,0.35)',
                borderRadius: 12,
                color: '#fff',
                fontSize: 15,
                fontWeight: 600,
                padding: '12px 32px',
                cursor: 'pointer',
                width: '100%',
                transition: 'border-color 0.2s, background 0.2s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.7)'
                ;(e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.08)'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.35)'
                ;(e.currentTarget as HTMLButtonElement).style.background = 'transparent'
              }}
            >
              Play again
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
