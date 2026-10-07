import type { ElementType } from 'react'
import { motion } from 'framer-motion'
import {
  Sun,
  Cloud,
  CloudSun,
  CloudRain,
  CloudDrizzle,
  CloudLightning,
  CloudSnow,
  CloudFog,
  Wind,
  Tornado,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { WeatherCondition } from '@/types/weather'

interface IconConfig {
  icon: ElementType
  color: string
}

const ICON_MAP: Record<WeatherCondition, IconConfig> = {
  clear:       { icon: Sun,           color: 'text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]' },
  clouds:      { icon: CloudSun,      color: 'text-slate-300' },
  rain:        { icon: CloudRain,     color: 'text-blue-400 drop-shadow-[0_0_6px_rgba(96,165,250,0.5)]' },
  drizzle:     { icon: CloudDrizzle,  color: 'text-sky-400' },
  thunderstorm:{ icon: CloudLightning,color: 'text-violet-400 drop-shadow-[0_0_8px_rgba(167,139,250,0.6)]' },
  snow:        { icon: CloudSnow,     color: 'text-blue-100 drop-shadow-[0_0_6px_rgba(219,234,254,0.6)]' },
  mist:        { icon: CloudFog,      color: 'text-slate-400' },
  fog:         { icon: CloudFog,      color: 'text-slate-400' },
  haze:        { icon: CloudFog,      color: 'text-amber-200/80' },
  smoke:       { icon: Wind,          color: 'text-slate-400' },
  dust:        { icon: Wind,          color: 'text-yellow-600/80' },
  sand:        { icon: Wind,          color: 'text-yellow-500/80' },
  ash:         { icon: Cloud,         color: 'text-slate-500' },
  squall:      { icon: Wind,          color: 'text-cyan-400' },
  tornado:     { icon: Tornado,       color: 'text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.6)]' },
}

const SIZE_CLASSES = {
  sm: 'h-5 w-5',
  md: 'h-8 w-8',
  lg: 'h-14 w-14',
  xl: 'h-24 w-24',
} as const

interface WeatherIconProps {
  condition: WeatherCondition
  size?: keyof typeof SIZE_CLASSES
  className?: string
  animated?: boolean
}

export function WeatherIcon({
  condition,
  size = 'md',
  className,
  animated = true,
}: WeatherIconProps) {
  const config = ICON_MAP[condition] ?? ICON_MAP.clouds
  const Icon = config.icon

  const icon = (
    <Icon
      className={cn(SIZE_CLASSES[size], config.color, className)}
      strokeWidth={1.5}
    />
  )

  if (!animated) return icon

  return (
    <motion.div
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    >
      {icon}
    </motion.div>
  )
}
