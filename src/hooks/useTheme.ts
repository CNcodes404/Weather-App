import { useMemo } from 'react'
import { getWeatherTheme } from '@/constants/weather'
import { getTimeOfDay } from '@/lib/time.utils'
import type { WeatherTheme } from '@/types/app'
import type { WeatherCondition } from '@/types/weather'

export function useTheme(condition: WeatherCondition | undefined): WeatherTheme {
  return useMemo(() => {
    const hour = new Date().getHours()
    const timeOfDay = getTimeOfDay(hour)
    return getWeatherTheme(condition ?? 'clear', timeOfDay)
  }, [condition])
}
