import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

const DefaultIcon = L.icon({ iconUrl, shadowUrl: iconShadow, iconAnchor: [12, 41] })
L.Marker.prototype.options.icon = DefaultIcon

import { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, Circle, useMap } from 'react-leaflet'

interface Props {
  targetCoords?: string
  onPosition?: (lat: number, lon: number) => void
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

// Haversine formula — returns distance in metres
function haversineMetres(
  lat1: number, lon1: number,
  lat2: number, lon2: number,
): number {
  const R = 6_371_000
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

// Player dot using a pulsing DivIcon
function playerIcon(): L.DivIcon {
  return L.divIcon({
    className: '',
    html: `
      <div style="
        width:16px; height:16px;
        background:#2b3a8f;
        border:3px solid #fff;
        border-radius:50%;
        box-shadow:0 0 0 0 rgba(43,58,143,0.5);
        animation:player-pulse 1.6s ease-out infinite;
      "></div>
      <style>
        @keyframes player-pulse {
          0%   { box-shadow:0 0 0 0   rgba(43,58,143,0.5); }
          70%  { box-shadow:0 0 0 14px rgba(43,58,143,0);   }
          100% { box-shadow:0 0 0 0   rgba(43,58,143,0);    }
        }
      </style>
    `,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  })
}

// Sub-component that recenter the map when position changes
function MapRecenter({ center }: { center: [number, number] }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, map.getZoom(), { animate: true })
  }, [center[0], center[1]])
  return null
}

// Sub-component that places the player marker using a DivIcon
function PlayerMarker({ position }: { position: [number, number] }) {
  const map = useMap()
  const markerRef = useRef<L.Marker | null>(null)

  useEffect(() => {
    const icon = playerIcon()
    const m = L.marker(position, { icon }).addTo(map)
    markerRef.current = m
    return () => { m.remove() }
  }, [])

  useEffect(() => {
    markerRef.current?.setLatLng(position)
  }, [position[0], position[1]])

  return null
}

export default function PlayerMap({ targetCoords, onPosition }: Props) {
  const target = targetCoords ? parseCoords(targetCoords) : null
  const [playerPos, setPlayerPos] = useState<[number, number] | null>(null)
  const watchIdRef = useRef<number | null>(null)

  useEffect(() => {
    if (!navigator.geolocation) return
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude: lat, longitude: lon } = pos.coords
        setPlayerPos([lat, lon])
        onPosition?.(lat, lon)
      },
      () => { /* silently ignore — GPS denied or unavailable */ },
      { enableHighAccuracy: true, timeout: 15_000, maximumAge: 5_000 },
    )
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current)
      }
    }
  }, [])

  // Map center: player position if known, else target zone, else world centre
  const mapCenter: [number, number] = playerPos ?? target ?? [20, 0]
  const mapZoom = target ? 16 : 13

  const distance =
    playerPos && target
      ? Math.round(haversineMetres(playerPos[0], playerPos[1], target[0], target[1]))
      : null

  return (
    <div style={{ marginBottom: 16 }}>
      <div
        style={{
          height: 260,
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          border: '1px solid var(--border)',
        }}
      >
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Blurred zone around target — visible but not pinpoint */}
          {target && (
            <Circle
              center={target}
              radius={80}
              pathOptions={{
                color: '#0d9e8e',
                fillColor: '#0d9e8e',
                fillOpacity: 0.18,
                weight: 2,
                opacity: 0.45,
              }}
            />
          )}

          {/* Player position marker */}
          {playerPos && <PlayerMarker position={playerPos} />}

          {/* Recenter when player moves */}
          {playerPos && <MapRecenter center={playerPos} />}
        </MapContainer>
      </div>

      {/* Distance label below map */}
      <div
        style={{
          marginTop: 8,
          textAlign: 'center',
          fontSize: 13,
          color: 'var(--text-muted)',
        }}
      >
        {!playerPos && (
          <span style={{ color: 'var(--text-light)' }}>
            Waiting for GPS signal…
          </span>
        )}
        {playerPos && distance !== null && distance < 30 && (
          <span style={{ color: 'var(--teal)', fontWeight: 600 }}>
            You&apos;re close! Tap the button below.
          </span>
        )}
        {playerPos && distance !== null && distance >= 30 && (
          <span>~{distance}m away</span>
        )}
        {playerPos && distance === null && (
          <span>GPS active — navigate to the zone on the map</span>
        )}
      </div>
    </div>
  )
}
