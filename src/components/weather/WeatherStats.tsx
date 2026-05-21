import type { ElementType } from 'react'
import { Droplets, Wind, Gauge, Eye, Cloud, Thermometer } from 'lucide-react'
import { GlassCard } from '@/components/common/GlassCard'
import { getWindDirection, formatVisibility } from '@/lib/weather.utils'
import type { CurrentWeather } from '@/types/weather'
import type { Units } from '@/types/app'

interface StatTile {
  icon: ElementType
  label: string
  value: string
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
    },
    {
      icon: Wind,
      label: 'Wind',
      value: `${Math.round(weather.windSpeed)} ${speedUnit} ${getWindDirection(weather.windDeg)}`,
    },
    {
      icon: Gauge,
      label: 'Pressure',
      value: `${weather.pressure} hPa`,
    },
    {
      icon: Eye,
      label: 'Visibility',
      value: formatVisibility(weather.visibility),
    },
    {
      icon: Cloud,
      label: 'Cloud Cover',
      value: `${weather.clouds}%`,
    },
    {
      icon: Thermometer,
      label: 'Feels Like',
      value: `${Math.round(weather.feelsLike)}${tempUnit}`,
    },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {stats.map((stat) => (
        <GlassCard key={stat.label} className="p-4 flex items-center gap-3">
          <stat.icon className="h-5 w-5 text-white/60 shrink-0" />
          <div className="min-w-0">
            <p className="text-xs text-white/40 truncate">{stat.label}</p>
            <p className="text-sm font-medium text-white truncate">{stat.value}</p>
          </div>
        </GlassCard>
      ))}
    </div>
  )
}
