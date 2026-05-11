import { useQuery } from '@tanstack/react-query'
import { getQrSheet } from '../../services/api'

interface Props { huntId: string; onBack: () => void }

export default function QrSheet({ huntId, onBack }: Props) {
  const { data, isLoading } = useQuery({
    queryKey: ['qr-sheet', huntId],
    queryFn:  () => getQrSheet(huntId),
  })

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
        <p style={{ color: 'var(--text-muted)' }}>Generating QR codes…</p>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, alignItems: 'center' }}>
        <button className="btn-ghost btn-sm" onClick={onBack}>← Back to clues</button>
        <button className="btn-primary btn-sm" onClick={() => window.print()}>🖨 Print</button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: 20,
      }}>
        {(data as any[] ?? []).map((item: any) => (
          <div key={item.token} className="card" style={{ textAlign: 'center', padding: 18 }}>
            <p style={{ fontWeight: 700, fontSize: 13, marginBottom: 10 }}>
              #{item.sequence} — {item.title}
            </p>
            <img
              src={`data:image/png;base64,${item.png_b64}`}
              alt={`QR for clue ${item.sequence}`}
              style={{ width: '100%', maxWidth: 148, borderRadius: 6 }}
            />
            <p style={{ fontSize: 10, color: 'var(--text-light)', marginTop: 8, wordBreak: 'break-all', fontFamily: 'monospace' }}>
              {item.token}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
