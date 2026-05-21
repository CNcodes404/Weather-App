import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'
import { GlassCard } from '@/components/common/GlassCard'
import { UnitToggle } from '@/components/common/UnitToggle'
import { WeatherIcon } from '@/components/weather/WeatherIcon'
import type { CurrentWeather } from '@/types/weather'
import type { Units } from '@/types/app'

interface CurrentConditionsProps {
  weather: CurrentWeather
  units: Units
}

export function CurrentConditions({ weather, units }: CurrentConditionsProps) {
  const u = units === 'metric' ? '°C' : '°F'

  return (
    <GlassCard className="p-6">
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-1.5 text-white/70">
          <MapPin className="h-4 w-4 shrink-0" />
          <span className="text-sm font-medium">
            {weather.cityName}, {weather.country}
          </span>
        </div>
        <UnitToggle />
      </div>

      <div className="flex items-center justify-between gap-4">
        <div>
          <motion.div
            key={weather.cityName}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-start leading-none">
              <span className="text-8xl font-thin text-white tracking-tighter">
                {Math.round(weather.temp)}
              </span>
              <span className="text-3xl text-white/60 mt-3 ml-1">{u}</span>
            </div>
          </motion.div>

          <p className="text-white/80 capitalize text-lg mt-2">{weather.description}</p>

          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-white/50">
            <span>H: {Math.round(weather.tempMax)}{u}</span>
            <span>L: {Math.round(weather.tempMin)}{u}</span>
            <span>Feels {Math.round(weather.feelsLike)}{u}</span>
          </div>
        </div>

        <div className="shrink-0">
          <WeatherIcon condition={weather.condition} size="xl" />
        </div>
      </div>
    </GlassCard>
  )
}
