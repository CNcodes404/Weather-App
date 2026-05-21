import { useState } from 'react'
import { MapContainer, TileLayer, CircleMarker } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { GlassCard } from '@/components/common/GlassCard'
import { OWM_KEY } from '@/config/api'

// Fix Leaflet default icon missing asset bug
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl

interface WeatherMapProps {
  lat: number
  lon: number
}

type LayerKey = 'precipitation_new' | 'clouds_new' | 'wind_new' | 'temp_new'

const LAYERS: { key: LayerKey; label: string }[] = [
  { key: 'precipitation_new', label: 'Rain' },
  { key: 'clouds_new', label: 'Clouds' },
  { key: 'wind_new', label: 'Wind' },
  { key: 'temp_new', label: 'Temp' },
]

export function WeatherMap({ lat, lon }: WeatherMapProps) {
  const [activeLayer, setActiveLayer] = useState<LayerKey>('precipitation_new')

  return (
    <GlassCard className="overflow-hidden p-0">
      {/* Layer toggle */}
      <div className="flex gap-1 p-3 pb-0">
        {LAYERS.map((l) => (
          <button
            key={l.key}
            onClick={() => setActiveLayer(l.key)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              activeLayer === l.key
                ? 'bg-white/20 text-white'
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>

      <div className="mt-3 rounded-b-2xl overflow-hidden" style={{ height: 220 }}>
        <MapContainer
          center={[lat, lon]}
          zoom={9}
          style={{ height: '100%', width: '100%', background: 'transparent' }}
          scrollWheelZoom={false}
          attributionControl={false}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            opacity={0.6}
          />
          <TileLayer
            key={activeLayer}
            url={`https://tile.openweathermap.org/map/${activeLayer}/{z}/{x}/{y}.png?appid=${OWM_KEY}`}
            opacity={0.7}
          />
          <CircleMarker
            center={[lat, lon]}
            radius={7}
            pathOptions={{ color: 'white', fillColor: 'white', fillOpacity: 0.9, weight: 2 }}
          />
        </MapContainer>
      </div>
    </GlassCard>
  )
}
