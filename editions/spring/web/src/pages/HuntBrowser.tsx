import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Map, AlertTriangle, Compass, ArrowRight, FileText } from 'lucide-react'
import { listPublicHunts } from '../services/api'

interface HuntSummary {
  id: string
  title: string
  status: string
  clue_count: number
  created_at: string
}

function SkeletonCard() {
  return (
    <div className="hunt-card-skeleton">
      <div className="skel-line" style={{ height: 11, width: '40%', marginBottom: 16 }} />
      <div className="skel-line" style={{ height: 22, width: '75%', marginBottom: 12 }} />
      <div className="skel-line" style={{ height: 13, width: '90%', marginBottom: 6 }} />
      <div className="skel-line" style={{ height: 13, width: '60%', marginBottom: 24 }} />
      <div className="skel-line" style={{ height: 40, width: '100%', borderRadius: 10 }} />
    </div>
  )
}

function coordLabel(id: string) {
  const n = parseInt(id.replace(/-/g, '').slice(0, 8), 16)
  const lat = ((n % 18000) / 100 - 90).toFixed(4)
  const lon = (((n >> 8) % 36000) / 100 - 180).toFixed(4)
  return `${lat}°N · ${lon}°E`
}

export default function HuntBrowser() {
  const nav = useNavigate()
  const { data, isLoading, isError, refetch } = useQuery<{ hunts: HuntSummary[] }>({
    queryKey: ['public-hunts'],
    queryFn: listPublicHunts,
  })

  const hunts: HuntSummary[] = data?.hunts ?? []

  return (
    <div className="hunt-browser">
      <div className="hunt-browser-hero">
        <div className="hunt-browser-eyebrow">
          <Map size={12} strokeWidth={2} />
          Active Expeditions
        </div>
        <h1 className="hunt-browser-title">Find a Hunt</h1>
        <p className="hunt-browser-sub">
          Each hunt is a trail of physical-world clues, scored by AI, solved by you.
        </p>
      </div>

      {isLoading ? (
        <div className="hunt-browser-grid">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : isError ? (
        <div className="hunt-browser-state">
          <AlertTriangle size={32} />
          <p>Could not load hunts. Check that the API is running.</p>
          <button className="hunt-browser-retry" onClick={() => refetch()}>
            Try again
          </button>
        </div>
      ) : hunts.length === 0 ? (
        <div className="hunt-browser-state">
          <Compass size={36} />
          <p>No active hunts right now. Check back soon — a new expedition is being prepared.</p>
        </div>
      ) : (
        <div className="hunt-browser-grid">
          {hunts.map((hunt, i) => (
            <div
              key={hunt.id}
              className="hunt-card"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="hunt-card-header">
                <span className="hunt-card-coord">{coordLabel(hunt.id)}</span>
              </div>

              <h3 className="hunt-card-title">{hunt.title}</h3>

              <p className="hunt-card-desc">
                {hunt.clue_count === 0
                  ? 'A new expedition being assembled.'
                  : `A ${hunt.clue_count}-clue trail through the physical world. Navigate, observe, and solve.`}
              </p>

              <div className="hunt-card-meta">
                <span className="hunt-card-badge hunt-card-badge-clue">
                  {hunt.clue_count} {hunt.clue_count === 1 ? 'clue' : 'clues'}
                </span>
                <span className="hunt-card-badge hunt-card-badge-active">
                  {hunt.status}
                </span>
              </div>

              <button
                className="hunt-card-join"
                onClick={() => nav(`/join?hunt=${hunt.id}`)}
              >
                Begin expedition
                <ArrowRight size={14} strokeWidth={2.5} />
              </button>
            </div>
          ))}
        </div>
      )}

      <footer className="hunt-browser-footer">
        <a
          className="hunt-browser-paper-link"
          href="/project_guide.pdf"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FileText size={12} strokeWidth={2} />
          Spring Edition — Project Guide
        </a>
      </footer>
    </div>
  )
}
