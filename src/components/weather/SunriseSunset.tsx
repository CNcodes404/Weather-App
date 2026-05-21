import { motion } from 'framer-motion'
import { Sunrise, Sunset } from 'lucide-react'
import { GlassCard } from '@/components/common/GlassCard'
import { formatSunTime } from '@/lib/time.utils'

interface SunriseSunsetProps {
  sunrise: number
  sunset: number
  timezone: number
}

export function SunriseSunset({ sunrise, sunset, timezone }: SunriseSunsetProps) {
  const now = Math.floor(Date.now() / 1000)

  // Progress 0–1 through the day arc (clamped)
  const progress = Math.min(1, Math.max(0, (now - sunrise) / (sunset - sunrise)))

  // SVG arc: semicircle from left (180°) to right (0°), cx=50 cy=60 r=40
  // Angle goes from π to 0 as progress 0→1
  const angle = Math.PI - progress * Math.PI
  const cx = 50
  const cy = 60
  const r = 40
  const dotX = cx + r * Math.cos(angle)
  const dotY = cy - r * Math.sin(angle)

  const isPast = now > sunset

  return (
    <GlassCard className="p-4">
      <div className="flex items-center gap-2 mb-1">
        <Sunrise className="h-4 w-4 text-white/60" />
        <p className="text-xs text-white/40 uppercase tracking-wide">Sunrise / Sunset</p>
      </div>

      <svg viewBox="0 0 100 65" className="w-full" aria-hidden="true">
        {/* Arc track */}
        <path
          d="M 10 60 A 40 40 0 0 1 90 60"
          fill="none"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Progress arc */}
        {!isPast && (
          <path
            d={`M 10 60 A 40 40 0 0 1 ${dotX.toFixed(2)} ${dotY.toFixed(2)}`}
            fill="none"
            stroke="rgba(251,191,36,0.6)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        )}
        {/* Horizon line */}
        <line x1="8" y1="61" x2="92" y2="61" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        {/* Sun dot */}
        {!isPast && (
          <motion.circle
            cx={dotX}
            cy={dotY}
            r="4"
            fill="#FBBF24"
            animate={{ r: [4, 5, 4] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
      </svg>

      <div className="flex justify-between text-xs mt-1">
        <div className="flex items-center gap-1 text-white/60">
          <Sunrise className="h-3 w-3" />
          <span>{formatSunTime(sunrise, timezone)}</span>
        </div>
        <div className="flex items-center gap-1 text-white/60">
          <span>{formatSunTime(sunset, timezone)}</span>
          <Sunset className="h-3 w-3" />
        </div>
      </div>
    </GlassCard>
  )
}
