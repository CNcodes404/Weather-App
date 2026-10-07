import { useState } from 'react'
import { MapContainer, TileLayer, CircleMarker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapPin, Loader2, X } from 'lucide-react'
import { GlassCard } from '@/components/common/GlassCard'
import { OSM_TILE_URL, OWM_TILE_URL } from '@/config/api'
import { reverseGeocode } from '@/services/weather.service'
import { useWeatherStore } from '@/store/weatherStore'
import type { Location } from '@/types/app'

// Fix Leaflet default icon missing asset bug
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl

interface WeatherMapProps {
  lat: number
  lon: number
}

type LayerKey = 'precipitation_new' | 'clouds_new' | 'wind_new' | 'temp_new'

const LAYERS: { key: LayerKey; label: string; emoji: string }[] = [
  { key: 'precipitation_new', label: 'Rain',   emoji: '🌧️' },
  { key: 'clouds_new',        label: 'Clouds', emoji: '☁️' },
  { key: 'wind_new',          label: 'Wind',   emoji: '💨' },
  { key: 'temp_new',          label: 'Temp',   emoji: '🌡️' },
]

interface ClickHandlerProps {
  onMapClick: (lat: number, lon: number) => void
}

function ClickHandler({ onMapClick }: ClickHandlerProps) {
  useMapEvents({
    click: (e) => onMapClick(e.latlng.lat, e.latlng.lng),
  })
  return null
}

export function WeatherMap({ lat, lon }: WeatherMapProps) {
  const [activeLayer, setActiveLayer] = useState<LayerKey>('precipitation_new')
  const [pinnedPos, setPinnedPos] = useState<[number, number] | null>(null)
  const [isPinning, setIsPinning] = useState(false)
  const [pinnedLabel, setPinnedLabel] = useState<string | null>(null)
  const [pendingGeo, setPendingGeo] = useState<Location | null>(null)
  const setLocation = useWeatherStore((s) => s.setLocation)

  async function handleMapClick(clickedLat: number, clickedLon: number) {
    setPinnedPos([clickedLat, clickedLon])
    setPendingGeo(null)
    setIsPinning(true)
    try {
      const geo = await reverseGeocode(clickedLat, clickedLon)
      if (geo) {
        setPendingGeo(geo)
        setPinnedLabel(`${geo.name}, ${geo.country}`)
      }
    } finally {
      setIsPinning(false)
    }
  }

  function handleConfirm() {
    if (!pendingGeo) return
    setLocation(pendingGeo)
    setPendingGeo(null)
  }

  function handleDismiss() {
    setPendingGeo(null)
    setPinnedPos(null)
    setPinnedLabel(null)
  }

  return (
    <GlassCard className="overflow-hidden p-0">
      {/* Header row */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <div className="flex gap-1">
          {LAYERS.map((l) => (
            <button
              key={l.key}
              onClick={() => setActiveLayer(l.key)}
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                activeLayer === l.key
                  ? 'bg-white/20 border-white/25 text-white'
                  : 'border-transparent text-white/40 hover:text-white/70'
              }`}
            >
              <span>{l.emoji}</span>
              {l.label}
            </button>
          ))}
        </div>

        {/* Pin status */}
        <div className="flex items-center gap-1.5 text-xs text-white/40">
          {isPinning
            ? <><Loader2 className="h-3 w-3 animate-spin" /> Locating…</>
            : pinnedLabel
              ? <><MapPin className="h-3 w-3 text-amber-400" /><span className="text-white/60">{pinnedLabel}</span></>
              : <><MapPin className="h-3 w-3" /> Tap map to pin</>
          }
        </div>
      </div>

      {/* Confirmation banner */}
      {pendingGeo && !isPinning && (
        <div className="flex items-center justify-between px-4 py-1.5 bg-amber-500/10 border-t border-amber-400/20 text-xs">
          <span className="text-amber-300 flex items-center gap-1.5">
            <MapPin className="h-3 w-3" />
            {pendingGeo.name}, {pendingGeo.country}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleConfirm}
              className="px-2.5 py-0.5 rounded-full bg-amber-500/20 hover:bg-amber-500/35 border border-amber-400/30 text-amber-200 hover:text-white transition-colors"
            >
              Set as Location
            </button>
            <button
              onClick={handleDismiss}
              className="text-white/30 hover:text-white/60 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Map */}
      <div className="h-[260px]">
        <MapContainer
          center={[lat, lon]}
          zoom={9}
          className="h-full w-full"
          scrollWheelZoom={true}
          attributionControl={false}
        >
          <TileLayer
            url={OSM_TILE_URL}
            opacity={0.55}
          />
          <TileLayer
            key={activeLayer}
            url={OWM_TILE_URL(activeLayer)}
            opacity={0.75}
          />

          {/* Current location — white dot */}
          <CircleMarker
            center={[lat, lon]}
            radius={7}
            pathOptions={{ color: 'white', fillColor: 'white', fillOpacity: 0.9, weight: 2 }}
          />

          {/* Pinned location — amber dot */}
          {pinnedPos && (
            <CircleMarker
              center={pinnedPos}
              radius={8}
              pathOptions={{
                color: '#F59E0B',
                fillColor: '#FCD34D',
                fillOpacity: 0.95,
                weight: 2.5,
              }}
            />
          )}

          <ClickHandler onMapClick={(lt, ln) => void handleMapClick(lt, ln)} />
        </MapContainer>
      </div>
    </GlassCard>
  )
}
