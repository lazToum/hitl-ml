import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

const DefaultIcon = L.icon({ iconUrl, shadowUrl: iconShadow, iconAnchor: [12, 41] })
L.Marker.prototype.options.icon = DefaultIcon

import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'

interface Props {
  value: string
  onChange: (coords: string) => void
}

interface ClickHandlerProps {
  onChange: (coords: string) => void
}

function ClickHandler({ onChange }: ClickHandlerProps) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng
      onChange(`${lat.toFixed(6)},${lng.toFixed(6)}`)
    },
  })
  return null
}

function parseCoords(value: string): [number, number] | null {
  if (!value) return null
  const parts = value.split(',')
  if (parts.length !== 2) return null
  const lat = parseFloat(parts[0])
  const lon = parseFloat(parts[1])
  if (isNaN(lat) || isNaN(lon)) return null
  return [lat, lon]
}

export default function GpsPickerMap({ value, onChange }: Props) {
  const coords = parseCoords(value)
  const center: [number, number] = coords ?? [20, 0]
  const zoom = coords ? 13 : 2

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div
        style={{
          height: 280,
          width: '100%',
          borderRadius: 'var(--radius)',
          overflow: 'hidden',
          border: '1px solid var(--border)',
          cursor: 'crosshair',
        }}
      >
        <MapContainer
          center={center}
          zoom={zoom}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler onChange={onChange} />
          {coords && (
            <Marker position={coords}>
              <Popup>
                <span style={{ fontFamily: 'monospace', fontSize: 12 }}>
                  {coords[0].toFixed(6)}, {coords[1].toFixed(6)}
                </span>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
        }}
      >
        <span
          style={{
            fontFamily: 'monospace',
            fontSize: 12,
            color: coords ? 'var(--text)' : 'var(--text-light)',
            background: 'var(--bg)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            padding: '5px 10px',
            flex: 1,
          }}
        >
          {value || 'No pin set — click the map to drop one'}
        </span>
        {coords && (
          <button
            className="btn-ghost btn-sm"
            type="button"
            onClick={() => onChange('')}
          >
            Clear pin
          </button>
        )}
      </div>
    </div>
  )
}
