import type { ElementType } from 'react'
import { motion } from 'framer-motion'
import { Droplets, Wind, Gauge, Eye, CloudCog, Thermometer } from 'lucide-react'
import { GlassCard } from '@/components/common/GlassCard'
import { getWindDirection, formatVisibility } from '@/lib/weather.utils'
import type { CurrentWeather } from '@/types/weather'
import type { Units } from '@/types/app'

interface StatTile {
  icon: ElementType
  label: string
  value: string
  iconColor: string
  accentColor: string
}

interface WeatherStatsProps {
  weather: CurrentWeather
  units: Units
}

export function WeatherStats({ weather, units }: WeatherStatsProps) {
  const speedUnit = units === 'metric' ? 'km/h' : 'mph'
  const tempUnit = units === 'metric' ? '°C' : '°F'

  const stats: StatTile[] = [
    {
      icon: Droplets,
      label: 'Humidity',
      value: `${weather.humidity}%`,
      iconColor: 'text-blue-400',
      accentColor: 'bg-blue-400',
    },
    {
      icon: Wind,
      label: 'Wind',
      value: `${Math.round(weather.windSpeed)} ${speedUnit} ${getWindDirection(weather.windDeg)}`,
      iconColor: 'text-cyan-400',
      accentColor: 'bg-cyan-400',
    },
    {
      icon: Gauge,
      label: 'Pressure',
      value: `${weather.pressure} hPa`,
      iconColor: 'text-amber-400',
      accentColor: 'bg-amber-400',
    },
    {
      icon: Eye,
      label: 'Visibility',
      value: formatVisibility(weather.visibility),
      iconColor: 'text-emerald-400',
      accentColor: 'bg-emerald-400',
    },
    {
      icon: CloudCog,
      label: 'Cloud Cover',
      value: `${weather.clouds}%`,
      iconColor: 'text-violet-400',
      accentColor: 'bg-violet-400',
    },
    {
      icon: Thermometer,
      label: 'Feels Like',
      value: `${Math.round(weather.feelsLike)}${tempUnit}`,
      iconColor: 'text-orange-400',
      accentColor: 'bg-orange-400',
    },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {stats.map((stat) => (
        <motion.div key={stat.label} whileHover={{ scale: 1.03, y: -2 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}>
        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            {/* Colored icon badge */}
            <div className={`p-2 rounded-xl bg-white/[0.08] shrink-0`}>
              <stat.icon className={`h-4 w-4 ${stat.iconColor}`} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-white/40 uppercase tracking-wide truncate">{stat.label}</p>
              <p className="text-sm font-semibold text-white truncate mt-0.5">{stat.value}</p>
            </div>
          </div>
          {/* Bottom accent line */}
          <div className={`absolute bottom-0 left-0 right-0 h-[2px] ${stat.accentColor} opacity-30 rounded-b-2xl`} />
        </GlassCard>
        </motion.div>
      ))}
    </div>
  )
}
