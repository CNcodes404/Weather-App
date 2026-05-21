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

const ICON_MAP: Record<WeatherCondition, ElementType> = {
  clear: Sun,
  clouds: CloudSun,
  rain: CloudRain,
  drizzle: CloudDrizzle,
  thunderstorm: CloudLightning,
  snow: CloudSnow,
  mist: CloudFog,
  fog: CloudFog,
  haze: CloudFog,
  smoke: Wind,
  dust: Wind,
  sand: Wind,
  ash: Cloud,
  squall: Wind,
  tornado: Tornado,
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
  const Icon = ICON_MAP[condition] ?? CloudSun

  const icon = (
    <Icon
      className={cn(SIZE_CLASSES[size], 'text-white drop-shadow-lg', className)}
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
