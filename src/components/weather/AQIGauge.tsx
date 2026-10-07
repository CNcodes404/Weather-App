import { Wind } from 'lucide-react'
import { GlassCard } from '@/components/common/GlassCard'
import { Skeleton } from '@/components/ui/skeleton'
import { useAirQuality } from '@/hooks/useAirQuality'
import { getAQILabel } from '@/lib/weather.utils'
import type { AQILevel } from '@/types/weather'

interface AQIGaugeProps {
  lat: number
  lon: number
}

const SEGMENTS: { level: AQILevel; activeColor: string; inactiveColor: string; label: string }[] = [
  { level: 1, activeColor: 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]', inactiveColor: 'bg-emerald-400/15', label: 'Good' },
  { level: 2, activeColor: 'bg-lime-400 shadow-[0_0_8px_rgba(163,230,53,0.7)]',    inactiveColor: 'bg-lime-400/15',    label: 'Fair' },
  { level: 3, activeColor: 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.7)]',   inactiveColor: 'bg-amber-400/15',   label: 'Moderate' },
  { level: 4, activeColor: 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.7)]',  inactiveColor: 'bg-orange-500/15',  label: 'Poor' },
  { level: 5, activeColor: 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.7)]',      inactiveColor: 'bg-red-500/15',     label: 'Very Poor' },
]

const ACTIVE_TEXT: Record<AQILevel, string> = {
  1: 'text-emerald-400',
  2: 'text-lime-400',
  3: 'text-amber-400',
  4: 'text-orange-400',
  5: 'text-red-400',
}

export function AQIGauge({ lat, lon }: AQIGaugeProps) {
  const { data, isLoading, isError } = useAirQuality(lat, lon)

  if (isLoading) return <Skeleton className="h-24 rounded-2xl bg-white/10" />
  if (isError || !data) return null

  const label = getAQILabel(data.aqi)

  return (
    <GlassCard className="p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded-lg bg-white/[0.08]">
          <Wind className="h-3.5 w-3.5 text-emerald-400" />
        </div>
        <p className="text-[11px] text-white/40 uppercase tracking-wide">Air Quality</p>
      </div>

      <div className="flex gap-1.5 mb-3">
        {SEGMENTS.map((seg) => (
          <div
            key={seg.level}
            className={`h-2 flex-1 rounded-full transition-all duration-300 ${
              data.aqi === seg.level ? seg.activeColor : seg.inactiveColor
            }`}
          />
        ))}
      </div>

      <div className="flex items-baseline justify-between">
        <p className={`text-sm font-semibold ${ACTIVE_TEXT[data.aqi]}`}>{label}</p>
        <p className="text-xs text-white/30">AQI {data.aqi}/5</p>
      </div>
    </GlassCard>
  )
}
