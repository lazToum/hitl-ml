import { useState, useCallback, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Map, Plus, Share2, Check, Printer, Trash2,
  BookOpen, LogOut, ChevronRight,
} from 'lucide-react'
import { createHunt, listHunts, updateHunt, deleteHunt } from '../../services/api'
import { logout } from '../../services/auth'
import ClueEditor from './ClueEditor'
import QrSheet from './QrSheet'

const STATUS_BADGE: Record<string, string> = {
  draft:    'badge-gray',
  active:   'badge-teal',
  archived: 'badge-yellow',
}

export default function CreatorDashboard() {
  const qc = useQueryClient()
  const [selectedHuntId, setSelectedHuntId] = useState<string | null>(null)
  const [showQr,         setShowQr]         = useState(false)
  const [copied,         setCopied]         = useState(false)
  const [editingTitle,   setEditingTitle]   = useState(false)
  const [titleDraft,     setTitleDraft]     = useState('')
  const [confirmDelete,  setConfirmDelete]  = useState(false)
  const titleInputRef = useRef<HTMLInputElement>(null)

  const {
    data: hunts = [],
    isLoading: huntsLoading,
    isError: huntsError,
    refetch: refetchHunts,
  } = useQuery({
    queryKey: ['hunts'],
    queryFn:  () => listHunts().then((d: any) => d.hunts ?? d),
  })

  const createMutation = useMutation({
    mutationFn: () => createHunt({ title: 'Untitled Hunt', description: '' }),
    onSuccess:  (data: any) => {
      qc.invalidateQueries({ queryKey: ['hunts'] })
      setSelectedHuntId(data.hunt?.id ?? data.id)
      setShowQr(false)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: object }) => updateHunt(id, data),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['hunts'] }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteHunt(id),
    onSuccess:  () => {
      qc.invalidateQueries({ queryKey: ['hunts'] })
      setSelectedHuntId(null)
      setConfirmDelete(false)
    },
  })

  const handleShare = useCallback(() => {
    if (!selectedHuntId) return
    navigator.clipboard.writeText(`${window.location.origin}/join?hunt=${selectedHuntId}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }, [selectedHuntId])

  function startEditTitle() {
    if (!selected) return
    setTitleDraft(selected.title)
    setEditingTitle(true)
    setTimeout(() => titleInputRef.current?.select(), 0)
  }

  function commitTitle() {
    if (!selectedHuntId || !titleDraft.trim()) { setEditingTitle(false); return }
    updateMutation.mutate({ id: selectedHuntId, data: { title: titleDraft.trim() } })
    setEditingTitle(false)
  }

  const selected = (hunts as any[]).find((h: any) => h.id === selectedHuntId)

  const statusAction = selected?.status === 'draft'    ? { label: 'Activate',   cls: 'btn-teal',  next: 'active'   }
                     : selected?.status === 'active'   ? { label: 'Archive',    cls: 'btn-ghost', next: 'archived' }
                     : selected?.status === 'archived' ? { label: 'Reactivate', cls: 'btn-teal',  next: 'active'   }
                     : null

  return (
    <div className="app-layout">

      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <Map size={17} strokeWidth={1.8} />
            <div>
              Expedition HQ
              <div className="sidebar-logo-sub">Treasure Hunt Platform</div>
            </div>
          </div>
        </div>

        <div className="sidebar-section">My Hunts</div>

        <div className="sidebar-scroll">
          {huntsLoading && (
            <p style={{ padding: '12px 18px', color: 'rgba(255,255,255,.35)', fontSize: 12, fontFamily: 'var(--font-mono)', letterSpacing: '.04em' }}>
              Loading…
            </p>
          )}
          {huntsError && (
            <div style={{ padding: '12px 18px' }}>
              <p style={{ color: 'rgba(255,255,255,.55)', fontSize: 12, marginBottom: 8 }}>Could not load hunts.</p>
              <button className="sidebar-new-btn" onClick={() => refetchHunts()}>
                Retry
              </button>
            </div>
          )}
          {!huntsLoading && !huntsError && (hunts as any[]).length === 0 && (
            <p style={{ padding: '12px 18px', color: 'rgba(255,255,255,.25)', fontSize: 12, fontFamily: 'var(--font-mono)', fontStyle: 'italic' }}>
              No hunts yet.
            </p>
          )}
          {(hunts as any[]).map((h: any) => (
            <div
              key={h.id}
              className={`hunt-item ${h.id === selectedHuntId ? 'active' : ''}`}
              onClick={() => { setSelectedHuntId(h.id); setShowQr(false); setEditingTitle(false) }}
            >
              <div className="hunt-item-title">{h.title}</div>
              <div className="hunt-item-meta">{h.status} · {h.clue_count ?? 0} clues</div>
            </div>
          ))}
        </div>

        <div className="sidebar-footer">
          <button
            className="sidebar-new-btn"
            onClick={() => createMutation.mutate()}
            disabled={createMutation.isPending}
          >
            <Plus size={14} strokeWidth={2} />
            {createMutation.isPending ? 'Creating…' : 'New Hunt'}
          </button>
          <a
            href="/learn"
            target="_blank"
            className="sidebar-link-btn"
            style={{ textDecoration: 'none' }}
          >
            <BookOpen size={12} strokeWidth={1.8} />
            Handbook
          </a>
          <button className="sidebar-link-btn" onClick={logout}>
            <LogOut size={12} strokeWidth={1.8} />
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="main-content">
        {!selectedHuntId ? (
          <div className="page-center">
            <div style={{ textAlign: 'center', maxWidth: 320 }}>
              <div style={{ color: 'var(--copper)', marginBottom: 18, display: 'flex', justifyContent: 'center' }}>
                <Map size={44} strokeWidth={1.2} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 10 }}>Your expeditions await</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.65, marginBottom: 24 }}>
                Select a hunt from the sidebar to edit its clues, or create a new one to begin.
              </p>
              <button
                className="btn-copper btn-lg"
                onClick={() => createMutation.mutate()}
                disabled={createMutation.isPending}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
              >
                <Plus size={16} strokeWidth={2} />
                {createMutation.isPending ? 'Creating…' : 'New Hunt'}
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Topbar */}
            <div className="topbar">
              {editingTitle ? (
                <input
                  ref={titleInputRef}
                  value={titleDraft}
                  onChange={e => setTitleDraft(e.target.value)}
                  onBlur={commitTitle}
                  onKeyDown={e => {
                    if (e.key === 'Enter') commitTitle()
                    if (e.key === 'Escape') setEditingTitle(false)
                  }}
                  style={{
                    fontSize: '1rem', fontWeight: 600, fontFamily: 'var(--font-display)',
                    border: 'none', borderBottom: '2px solid var(--sage)',
                    outline: 'none', background: 'transparent',
                    padding: '0 2px', minWidth: 200, flex: 1,
                  }}
                  autoFocus
                />
              ) : (
                <h2
                  onClick={startEditTitle}
                  title="Click to rename"
                  style={{ cursor: 'text', flex: 1, display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  {selected?.title ?? 'Hunt'}
                  <ChevronRight size={14} style={{ opacity: 0.35, flexShrink: 0 }} />
                </h2>
              )}

              <span className={`badge ${STATUS_BADGE[selected?.status] ?? 'badge-gray'}`}>
                {selected?.status}
              </span>

              <div className="topbar-actions">
                {statusAction && (
                  <button
                    className={`${statusAction.cls} btn-sm`}
                    onClick={() => updateMutation.mutate({ id: selectedHuntId, data: { status: statusAction.next } })}
                    disabled={updateMutation.isPending}
                  >
                    {statusAction.label}
                  </button>
                )}
                <button
                  className={`btn-sm ${showQr ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setShowQr(v => !v)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}
                >
                  <Printer size={13} strokeWidth={1.8} />
                  QR Sheet
                </button>
                <button
                  className="btn-sm btn-ghost"
                  onClick={handleShare}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}
                >
                  {copied
                    ? <><Check size={13} strokeWidth={2.5} /> Copied</>
                    : <><Share2 size={13} strokeWidth={1.8} /> Share</>
                  }
                </button>
                <button
                  className="btn-sm btn-ghost"
                  onClick={() => setConfirmDelete(true)}
                  style={{ color: 'var(--error-text)', display: 'inline-flex', alignItems: 'center', gap: 5 }}
                  title="Delete hunt"
                >
                  <Trash2 size={13} strokeWidth={1.8} />
                </button>
              </div>
            </div>

            <div className="content-area">
              {showQr
                ? <QrSheet huntId={selectedHuntId} onBack={() => setShowQr(false)} />
                : <ClueEditor huntId={selectedHuntId} />
              }
            </div>
          </>
        )}
      </div>

      {/* ── Delete confirm modal ── */}
      {confirmDelete && selected && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setConfirmDelete(false)}>
          <div className="modal" style={{ width: 400 }}>
            <div className="modal-header">
              <h3>Delete hunt?</h3>
              <button className="modal-close" onClick={() => setConfirmDelete(false)}>
                <span style={{ fontSize: 20, lineHeight: 1 }}>×</span>
              </button>
            </div>
            <div className="modal-body">
              <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.65 }}>
                <strong>"{selected.title}"</strong> and all its clues will be permanently deleted. This cannot be undone.
              </p>
            </div>
            <div className="modal-footer">
              <button
                className="btn-danger"
                onClick={() => deleteMutation.mutate(selectedHuntId!)}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? 'Deleting…' : 'Yes, delete'}
              </button>
              <button className="btn-ghost" onClick={() => setConfirmDelete(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
