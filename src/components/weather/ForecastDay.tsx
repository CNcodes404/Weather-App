import { Droplets } from 'lucide-react'
import { GlassCard } from '@/components/common/GlassCard'
import { WeatherIcon } from '@/components/weather/WeatherIcon'
import { formatDayName, isToday } from '@/lib/time.utils'
import type { DailyForecast } from '@/types/weather'
import type { Units } from '@/types/app'

interface ForecastDayProps {
  day: DailyForecast
  units: Units
  timezoneOffset: number
}

export function ForecastDay({ day, units, timezoneOffset }: ForecastDayProps) {
  const u = units === 'metric' ? '°' : '°'
  const today = isToday(day.date, timezoneOffset)
  const dayLabel = today ? 'Today' : formatDayName(day.date, timezoneOffset)

  return (
    <GlassCard className="p-3 flex flex-col items-center gap-1.5 min-w-[72px]">
      <p className={`text-xs font-medium ${today ? 'text-white' : 'text-white/50'}`}>{dayLabel}</p>
      <WeatherIcon condition={day.condition} size="sm" animated={false} />
      {day.pop > 0.05 && (
        <div className="flex items-center gap-0.5 text-blue-300">
          <Droplets className="h-3 w-3" />
          <span className="text-xs">{Math.round(day.pop * 100)}%</span>
        </div>
      )}
      <div className="text-xs text-white/80 font-medium">{Math.round(day.tempMax)}{u}</div>
      <div className="text-xs text-white/40">{Math.round(day.tempMin)}{u}</div>
    </GlassCard>
  )
}
