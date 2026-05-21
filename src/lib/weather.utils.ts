import type { WeatherCondition, AQILabel, AQILevel, OWMForecastItem, DailyForecast } from '@/types/weather'

export function getConditionFromCode(code: number): WeatherCondition {
  if (code >= 200 && code < 300) return 'thunderstorm'
  if (code >= 300 && code < 400) return 'drizzle'
  if (code >= 500 && code < 600) return 'rain'
  if (code >= 600 && code < 700) return 'snow'
  if (code === 800) return 'clear'
  if (code > 800) return 'clouds'

  const atmosphereMap: Record<number, WeatherCondition> = {
    701: 'mist',
    711: 'smoke',
    721: 'haze',
    731: 'dust',
    741: 'fog',
    751: 'sand',
    761: 'dust',
    762: 'ash',
    771: 'squall',
    781: 'tornado',
  }
  return atmosphereMap[code] ?? 'mist'
}

export function getWindDirection(deg: number): string {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  return dirs[Math.round(deg / 45) % 8]
}

export function formatVisibility(meters: number): string {
  if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`
  return `${meters} m`
}

export function getAQILabel(aqi: AQILevel): AQILabel {
  const labels: Record<AQILevel, AQILabel> = {
    1: 'Good',
    2: 'Fair',
    3: 'Moderate',
    4: 'Poor',
    5: 'Very Poor',
  }
  return labels[aqi]
}

export function aggregateDailyForecasts(
  items: OWMForecastItem[],
  timezoneOffsetSec: number,
): DailyForecast[] {
  const dayMap = new Map<string, OWMForecastItem[]>()

  for (const item of items) {
    const localDate = new Date((item.dt + timezoneOffsetSec) * 1000)
    const dateKey = `${localDate.getUTCFullYear()}-${localDate.getUTCMonth()}-${localDate.getUTCDate()}`
    const bucket = dayMap.get(dateKey) ?? []
    bucket.push(item)
    dayMap.set(dateKey, bucket)
  }

  return Array.from(dayMap.values()).map((dayItems) => {
    const tempMins = dayItems.map((i) => i.main.temp_min)
    const tempMaxs = dayItems.map((i) => i.main.temp_max)
    const pops = dayItems.map((i) => i.pop)
    const humidities = dayItems.map((i) => i.main.humidity)

    // Prefer midday item for representative condition
    const midday = dayItems.find((i) => {
      const h = new Date((i.dt + timezoneOffsetSec) * 1000).getUTCHours()
      return h >= 11 && h <= 14
    }) ?? dayItems[Math.floor(dayItems.length / 2)]

    return {
      date: dayItems[0].dt,
      tempMin: Math.min(...tempMins),
      tempMax: Math.max(...tempMaxs),
      condition: getConditionFromCode(midday.weather[0]?.id ?? 800),
      description: midday.weather[0]?.description ?? '',
      icon: midday.weather[0]?.icon ?? '01d',
      pop: Math.max(...pops),
      humidity: Math.round(humidities.reduce((a, b) => a + b, 0) / humidities.length),
    }
  })
}
