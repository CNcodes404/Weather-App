import { ForecastDay } from '@/components/weather/ForecastDay'
import type { DailyForecast as DailyForecastType } from '@/types/weather'
import type { Units } from '@/types/app'

interface DailyForecastProps {
  daily: DailyForecastType[]
  units: Units
  timezoneOffset: number
}

export function DailyForecast({ daily, units, timezoneOffset }: DailyForecastProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      {daily.map((day) => (
        <ForecastDay key={day.date} day={day} units={units} timezoneOffset={timezoneOffset} />
      ))}
    </div>
  )
}
