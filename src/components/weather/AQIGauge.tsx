import { Leaf } from 'lucide-react'
import { GlassCard } from '@/components/common/GlassCard'
import { Skeleton } from '@/components/ui/skeleton'
import { useAirQuality } from '@/hooks/useAirQuality'
import { getAQILabel } from '@/lib/weather.utils'
import type { AQILevel } from '@/types/weather'

interface AQIGaugeProps {
  lat: number
  lon: number
}

const SEGMENTS: { level: AQILevel; color: string; bg: string }[] = [
  { level: 1, color: 'bg-green-400', bg: 'bg-green-400/20' },
  { level: 2, color: 'bg-lime-400', bg: 'bg-lime-400/20' },
  { level: 3, color: 'bg-yellow-400', bg: 'bg-yellow-400/20' },
  { level: 4, color: 'bg-orange-400', bg: 'bg-orange-400/20' },
  { level: 5, color: 'bg-red-500', bg: 'bg-red-500/20' },
]

export function AQIGauge({ lat, lon }: AQIGaugeProps) {
  const { data, isLoading, isError } = useAirQuality(lat, lon)

  if (isLoading) {
    return <Skeleton className="h-24 rounded-2xl bg-white/10" />
  }

  if (isError || !data) return null

  const label = getAQILabel(data.aqi)

  return (
    <GlassCard className="p-4">
      <div className="flex items-center gap-2 mb-3">
        <Leaf className="h-4 w-4 text-white/60" />
        <p className="text-xs text-white/40 uppercase tracking-wide">Air Quality</p>
      </div>

      <div className="flex gap-1 mb-2">
        {SEGMENTS.map((seg) => (
          <div
            key={seg.level}
            className={`h-2 flex-1 rounded-full transition-all ${
              data.aqi === seg.level ? seg.color : seg.bg
            }`}
          />
        ))}
      </div>

      <div className="flex items-baseline justify-between">
        <p className="text-sm font-medium text-white">{label}</p>
        <p className="text-xs text-white/40">AQI {data.aqi}/5</p>
      </div>
    </GlassCard>
  )
}
