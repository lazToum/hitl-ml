import { useState, useEffect, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2, MapPin, Type, QrCode, Nfc, Camera, Lightbulb } from 'lucide-react'
import { listClues, upsertClue, deleteClue, generateClue, estimateDifficulty } from '../../services/api'
import GpsPickerMap from './GpsPickerMap'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ReactFlowProvider,
  type Node,
  type Edge,
  type NodeProps,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

interface Props { huntId: string }

const BLANK_CLUE = {
  title: '', body: '', answer_type: 'text', answer_value: '',
  answer_tolerance: 0.85, hint_unlock_after_minutes: 5, hint_unlock_after_attempts: 3,
  hints: [''],
}

const TYPE_LABELS: Record<string, string> = {
  text: 'Text', qr: 'QR Code', nfc: 'NFC', gps: 'GPS', photo: 'Photo',
}
const TYPE_BADGE: Record<string, string> = {
  text: 'badge-blue', qr: 'badge-gray', nfc: 'badge-gray', gps: 'badge-teal', photo: 'badge-yellow',
}
const TYPE_ICON: Record<string, JSX.Element> = {
  text:  <Type size={13} strokeWidth={2} />,
  photo: <Camera size={13} strokeWidth={2} />,
  gps:   <MapPin size={13} strokeWidth={2} />,
  qr:    <QrCode size={13} strokeWidth={2} />,
  nfc:   <Nfc size={13} strokeWidth={2} />,
}

function hasHints(hints: string[] | undefined): boolean {
  return Array.isArray(hints) && hints.some(h => h.trim().length > 0)
}

// ── Node dimensions ──────────────────────────────────────────────
const NODE_WIDTH  = 220
const NODE_GAP    = 60  // horizontal space between nodes

// ── ClueNode data shape ──────────────────────────────────────────
interface ClueNodeData {
  clue: any
  onEdit: (clue: any) => void
  [key: string]: unknown
}

// ── Custom ClueNode component ────────────────────────────────────
function ClueNode({ data }: NodeProps) {
  const { clue, onEdit } = data as ClueNodeData

  return (
    <div
      style={{
        width:        NODE_WIDTH,
        background:   'var(--card, #fff)',
        borderRadius: 'var(--radius, 10px)',
        boxShadow:    'var(--shadow, 0 2px 12px rgba(0,0,0,0.10))',
        border:       '1px solid var(--border, #e2e6ea)',
        overflow:     'hidden',
        fontFamily:   'inherit',
      }}
    >
      {/* Top bar: sequence badge + type */}
      <div
        style={{
          display:        'flex',
          alignItems:     'center',
          gap:            8,
          padding:        '10px 12px 8px',
          borderBottom:   '1px solid var(--border)',
          background:     'var(--parchment-mid)',
        }}
      >
        {/* Sequence badge */}
        <span
          style={{
            background:     'var(--ink)',
            color:          'var(--parchment)',
            borderRadius:   999,
            fontSize:       11,
            fontWeight:     700,
            fontFamily:     'var(--font-mono)',
            minWidth:       22,
            height:         22,
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            padding:        '0 6px',
            flexShrink:     0,
          }}
        >
          {clue.sequence}
        </span>

        {/* Type icon + label */}
        <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
          {TYPE_ICON[clue.answer_type] ?? <Type size={13} strokeWidth={2} />}
        </span>
        <span
          className={`badge ${TYPE_BADGE[clue.answer_type] ?? 'badge-gray'}`}
          style={{ fontSize: 11 }}
        >
          {TYPE_LABELS[clue.answer_type] ?? clue.answer_type}
        </span>
      </div>

      {/* Body: title + hints badge */}
      <div style={{ padding: '10px 12px 8px', minHeight: 48 }}>
        <div
          style={{
            fontWeight:   600,
            fontSize:     13,
            color:        'var(--text)',
            overflow:     'hidden',
            textOverflow: 'ellipsis',
            whiteSpace:   'nowrap',
          }}
          title={clue.title || 'Untitled'}
        >
          {clue.title || <em style={{ color: 'var(--text-light)', fontWeight: 400 }}>Untitled</em>}
        </div>

        {hasHints(clue.hints) && (
          <span
            className="badge badge-yellow"
            style={{ marginTop: 6, display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11 }}
          >
            <Lightbulb size={10} strokeWidth={2} /> Hints
          </span>
        )}
      </div>

      {/* Footer: Edit button */}
      <div
        style={{
          borderTop:      '1px solid var(--border, #e2e6ea)',
          padding:        '6px 12px',
          display:        'flex',
          justifyContent: 'flex-end',
        }}
      >
        <button
          className="btn-ghost btn-sm"
          style={{ fontSize: 12 }}
          onClick={() => onEdit(clue)}
        >
          Edit
        </button>
      </div>
    </div>
  )
}

const nodeTypes = { clueNode: ClueNode }

// ── Helpers: build nodes + edges from clue array ─────────────────
function buildNodesAndEdges(
  clues: any[],
  onEdit: (clue: any) => void,
): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = clues.map((c, i) => ({
    id:       String(c.id ?? c.sequence),
    type:     'clueNode',
    position: { x: i * (NODE_WIDTH + NODE_GAP), y: 0 },
    data:     { clue: c, onEdit },
    draggable: true,
  }))

  const edges: Edge[] = clues.slice(0, -1).map((c, i) => ({
    id:           `e-${c.id ?? c.sequence}-${clues[i + 1].id ?? clues[i + 1].sequence}`,
    source:       String(c.id ?? c.sequence),
    target:       String(clues[i + 1].id ?? clues[i + 1].sequence),
    sourceHandle: undefined,
    targetHandle: undefined,
    type:         'smoothstep',
    animated:     true,
    style:        { stroke: 'var(--sage)', strokeWidth: 2 },
  }))

  return { nodes, edges }
}

// ── Inner component (needs ReactFlowProvider in scope) ───────────
function ClueEditorInner({ huntId }: Props) {
  const qc = useQueryClient()
  const [editing,        setEditing]        = useState<any>(null)
  const [aiLoading,      setAiLoading]      = useState(false)
  const [difficultyInfo, setDifficultyInfo] = useState<any>(null)

  const { fitView } = useReactFlow()
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])

  const { data } = useQuery({
    queryKey: ['clues', huntId],
    queryFn:  () => listClues(huntId),
  })
  const clues: any[] = data?.clues ?? []

  const saveMutation = useMutation({
    mutationFn: (clue: any) => upsertClue(huntId, clue.sequence, clue),
    onSuccess:  () => {
      qc.invalidateQueries({ queryKey: ['clues', huntId] })
      setEditing(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (clue: any) => deleteClue(huntId, clue.sequence),
    onSuccess:  () => {
      qc.invalidateQueries({ queryKey: ['clues', huntId] })
      setEditing(null)
    },
  })

  // Stable openEdit callback — passed into node data
  const openEdit = useCallback((c: any) => {
    setDifficultyInfo(null)
    setEditing({ ...c, _isExisting: true })
  }, [])

  // Rebuild the graph whenever clues change (content or structure)
  useEffect(() => {
    const { nodes: n, edges: e } = buildNodesAndEdges(clues, openEdit)
    setNodes(n)
    setEdges(e)
    // fitView after React has painted the new nodes
    setTimeout(() => fitView({ padding: 0.2, duration: 300 }), 50)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(clues)])

  // When openEdit ref changes (shouldn't, it's stable), refresh node data
  useEffect(() => {
    setNodes(ns => ns.map(n => ({
      ...n,
      data: { ...(n.data as ClueNodeData), onEdit: openEdit },
    })))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openEdit])

  // ── Node drag-end → reorder ───────────────────────────────────
  async function handleNodeDragStop(_: React.MouseEvent, _node: Node, currentNodes: Node[]) {
    if (clues.length < 2) return

    // Sort nodes by their current x position to derive new sequence
    const sorted = [...currentNodes].sort((a, b) => a.position.x - b.position.x)

    // Map sorted node id → new 1-based sequence
    const newSeqById: Record<string, number> = {}
    sorted.forEach((n, i) => { newSeqById[n.id] = i + 1 })

    // Find clues whose sequence has changed
    const updates = clues
      .map(c => {
        const nodeId    = String(c.id ?? c.sequence)
        const newSeq    = newSeqById[nodeId]
        return { clue: { ...c, sequence: newSeq }, originalSeq: c.sequence }
      })
      .filter(({ clue }, i) => clue.sequence !== clues[i].sequence)

    if (updates.length === 0) return

    await Promise.all(updates.map(({ clue, originalSeq }) => upsertClue(huntId, originalSeq, clue)))
    qc.invalidateQueries({ queryKey: ['clues', huntId] })
  }

  // ── AI / difficulty helpers ───────────────────────────────────
  async function handleGenerateAi() {
    if (!editing) return
    setAiLoading(true)
    try {
      const result = await generateClue(huntId, {
        description: editing.body || 'a mystery location',
        answer:      editing.answer_value || 'unknown',
        difficulty:  3,
        num_hints:   3,
      })
      setEditing({ ...editing, title: result.title, body: result.body, hints: result.hints })
    } finally {
      setAiLoading(false)
    }
  }

  async function handleEstimateDifficulty() {
    if (!editing) return
    const result = await estimateDifficulty(huntId, editing.body)
    setDifficultyInfo(result)
  }

  function openNew() {
    setDifficultyInfo(null)
    const nextSeq = clues.length > 0
      ? Math.max(...clues.map((c: any) => c.sequence)) + 1
      : 1
    setEditing({ ...BLANK_CLUE, sequence: nextSeq, _isExisting: false })
  }

  return (
    <>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <h3>Clues</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 2 }}>
            {clues.length} clue{clues.length !== 1 ? 's' : ''} in this hunt
          </p>
        </div>
        <button className="btn-primary" onClick={openNew}>+ Add Clue</button>
      </div>

      {/* ReactFlow canvas */}
      {clues.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><MapPin size={36} strokeWidth={1.3} /></div>
          <p className="empty-state-text">No clues yet — add your first one.</p>
        </div>
      ) : (
        <div
          style={{
            height:       'clamp(600px, calc(100vh - 280px), 900px)',
            borderRadius: 'var(--radius-lg)',
            border:       '1px solid var(--border)',
            overflow:     'hidden',
            background:   'var(--parchment)',
          }}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeDragStop={handleNodeDragStop}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            minZoom={0.3}
            maxZoom={2}
            proOptions={{ hideAttribution: true }}
          >
            <Background color="var(--border-mid)" gap={24} />
            <Controls />
            <MiniMap
              nodeColor="var(--sage)"
              maskColor="rgba(61,107,74,0.06)"
            />
          </ReactFlow>
        </div>
      )}

      {/* Editor modal — identical to original */}
      {editing && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setEditing(null)}>
          <div className="modal" style={{ width: 640 }}>
            <div className="modal-header">
              <h3>Clue #{editing.sequence}</h3>
              <button className="modal-close" onClick={() => setEditing(null)}>×</button>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

              {/* ── Content section ── */}
              <div className="field">
                <label>Title</label>
                <input
                  value={editing.title}
                  onChange={e => setEditing({ ...editing, title: e.target.value })}
                  placeholder="e.g. The Old Library"
                />
              </div>

              <div className="field">
                <label>Clue text</label>
                <textarea
                  rows={4}
                  value={editing.body}
                  onChange={e => setEditing({ ...editing, body: e.target.value })}
                  placeholder="Describe where to go and what to find…"
                />
              </div>

              {/* ── Divider between content and answer section ── */}
              <hr className="divider" style={{ margin: '4px 0 16px' }} />

              {/* ── Answer section ── */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="field">
                  <label>Answer type</label>
                  <select
                    value={editing.answer_type}
                    onChange={e => setEditing({
                      ...editing,
                      answer_type: e.target.value,
                      answer_value: '',
                      answer_tolerance: e.target.value === 'gps' ? 30 : 0.85,
                    })}
                  >
                    {Object.entries(TYPE_LABELS).map(([v, l]) => (
                      <option key={v} value={v}>{l}</option>
                    ))}
                  </select>
                </div>

                {editing.answer_type !== 'gps' && (
                  <div className="field">
                    <label>Answer value</label>
                    <input
                      value={editing.answer_value}
                      onChange={e => setEditing({ ...editing, answer_value: e.target.value })}
                      placeholder="Expected answer"
                    />
                  </div>
                )}
              </div>

              {/* GPS map picker */}
              {editing.answer_type === 'gps' && (
                <>
                  <div className="field">
                    <label>GPS coordinates</label>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, marginTop: -2 }}>
                      Click the map to drop a pin
                    </p>
                    <GpsPickerMap
                      value={editing.answer_value}
                      onChange={v => setEditing({ ...editing, answer_value: v })}
                    />
                    <div style={{ marginTop: 8 }}>
                      <label>Coordinates (read-only — use map above or paste below)</label>
                      <input
                        value={editing.answer_value}
                        onChange={e => setEditing({ ...editing, answer_value: e.target.value })}
                        placeholder="lat,lon — e.g. 51.507400,-0.127800"
                        style={{ fontFamily: 'monospace' }}
                      />
                    </div>
                  </div>
                  <div className="field">
                    <label>Acceptable radius (metres)</label>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6, marginTop: -2 }}>
                      Player must be within this distance of the pin to pass. 20–50m suits most outdoor locations.
                    </p>
                    <input
                      type="number"
                      min={5}
                      max={500}
                      value={editing.answer_tolerance}
                      onChange={e => setEditing({ ...editing, answer_tolerance: +e.target.value })}
                    />
                  </div>
                </>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="field">
                  <label>Hint unlock after (min)</label>
                  <input
                    type="number"
                    value={editing.hint_unlock_after_minutes}
                    onChange={e => setEditing({ ...editing, hint_unlock_after_minutes: +e.target.value })}
                  />
                </div>
                <div className="field">
                  <label>Hint unlock after (attempts)</label>
                  <input
                    type="number"
                    value={editing.hint_unlock_after_attempts}
                    onChange={e => setEditing({ ...editing, hint_unlock_after_attempts: +e.target.value })}
                  />
                </div>
              </div>

              <div className="field">
                <label>Hints (one per line)</label>
                <textarea
                  rows={3}
                  value={(editing.hints ?? ['']).join('\n')}
                  onChange={e => setEditing({ ...editing, hints: e.target.value.split('\n') })}
                  placeholder="First hint&#10;Second hint&#10;Third hint"
                />
              </div>

              {difficultyInfo && (
                <div style={{
                  background:   'var(--primary-light)',
                  padding:      '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize:     13,
                  color:        'var(--primary)',
                }}>
                  Difficulty: <strong>{difficultyInfo.score ?? difficultyInfo.difficulty}</strong>
                  {difficultyInfo.reasoning && <> — {difficultyInfo.reasoning}</>}
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                className="btn-primary"
                onClick={() => saveMutation.mutate(editing)}
                disabled={saveMutation.isPending || deleteMutation.isPending}
                style={{ display: 'flex', alignItems: 'center', gap: 6 }}
              >
                {saveMutation.isPending && <Loader2 size={14} style={{ animation: 'spin 0.8s linear infinite' }} />}
                {saveMutation.isPending ? 'Saving…' : 'Save clue'}
              </button>
              <button
                className="btn-secondary"
                onClick={handleGenerateAi}
                disabled={aiLoading}
              >
                {aiLoading ? 'Generating…' : '✨ AI Draft'}
              </button>
              <button className="btn-ghost" onClick={handleEstimateDifficulty}>
                Rate difficulty
              </button>
              <button className="btn-ghost" onClick={() => setEditing(null)} style={{ marginLeft: 'auto' }}>
                Cancel
              </button>
              {editing._isExisting && (
                <button
                  className="btn-danger"
                  onClick={() => {
                    if (window.confirm(`Delete clue #${editing.sequence}? This cannot be undone.`)) {
                      deleteMutation.mutate(editing)
                    }
                  }}
                  disabled={deleteMutation.isPending || saveMutation.isPending}
                  style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  {deleteMutation.isPending && <Loader2 size={14} style={{ animation: 'spin 0.8s linear infinite' }} />}
                  {deleteMutation.isPending ? 'Deleting…' : 'Delete clue'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </>
  )
}

// ── Exported wrapper — provides ReactFlow context ────────────────
export default function ClueEditor(props: Props) {
  return (
    <ReactFlowProvider>
      <ClueEditorInner {...props} />
    </ReactFlowProvider>
  )
}
