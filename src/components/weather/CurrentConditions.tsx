import { motion } from 'framer-motion'
import { MapPin, ArrowUp, ArrowDown, Thermometer } from 'lucide-react'
import { GlassCard } from '@/components/common/GlassCard'
import { UnitToggle } from '@/components/common/UnitToggle'
import { WeatherIcon } from '@/components/weather/WeatherIcon'
import type { CurrentWeather, WeatherCondition } from '@/types/weather'
import type { Units } from '@/types/app'

interface CurrentConditionsProps {
  weather: CurrentWeather
  units: Units
}

const CONDITION_GLOW: Record<WeatherCondition, string> = {
  clear:       'bg-amber-300',
  clouds:      'bg-slate-300',
  rain:        'bg-blue-400',
  drizzle:     'bg-blue-300',
  thunderstorm:'bg-violet-400',
  snow:        'bg-blue-100',
  mist:        'bg-slate-400',
  smoke:       'bg-stone-400',
  haze:        'bg-yellow-200',
  dust:        'bg-amber-200',
  fog:         'bg-slate-300',
  sand:        'bg-amber-300',
  ash:         'bg-stone-400',
  squall:      'bg-cyan-300',
  tornado:     'bg-red-400',
}

export function CurrentConditions({ weather, units }: CurrentConditionsProps) {
  const u = units === 'metric' ? '°C' : '°F'
  const glowColor = CONDITION_GLOW[weather.condition]

  return (
    <GlassCard className="p-6">
      {/* Header row */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-1.5">
          <MapPin className="h-4 w-4 text-white/50 shrink-0" />
          <span className="text-sm font-semibold text-white/80 tracking-wide">
            {weather.cityName},&nbsp;{weather.country}
          </span>
        </div>
        <UnitToggle />
      </div>

      {/* Main content */}
      <div className="flex items-center justify-between gap-4">
        {/* Left — temperature block */}
        <div>
          <motion.div
            key={weather.cityName}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Temperature */}
            <div className="flex items-start leading-none">
              <span className="text-8xl font-extralight tracking-tighter bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent">
                {Math.round(weather.temp)}
              </span>
              <span className="text-3xl text-white/50 mt-3 ml-1 font-light">{u}</span>
            </div>

            {/* Description */}
            <p className="text-white/90 capitalize text-lg font-medium mt-2 tracking-wide">
              {weather.description}
            </p>

            {/* H / L / Feels */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-3">
              <span className="flex items-center gap-1 text-xs font-medium text-white/60">
                <ArrowUp className="h-3 w-3 text-rose-400" />
                {Math.round(weather.tempMax)}{u}
              </span>
              <span className="flex items-center gap-1 text-xs font-medium text-white/60">
                <ArrowDown className="h-3 w-3 text-sky-400" />
                {Math.round(weather.tempMin)}{u}
              </span>
              <span className="flex items-center gap-1 text-xs font-medium text-white/60">
                <Thermometer className="h-3 w-3 text-orange-400" />
                Feels {Math.round(weather.feelsLike)}{u}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Right — icon with ambient glow ring */}
        <div className="shrink-0 relative">
          <div className={`absolute inset-0 rounded-full blur-2xl opacity-30 ${glowColor} scale-75`} />
          <WeatherIcon condition={weather.condition} size="xl" />
        </div>
      </div>
    </GlassCard>
  )
}
