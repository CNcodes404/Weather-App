import type { TimeOfDay, Season } from '@/types/app'

export function getTimeOfDay(hour: number): TimeOfDay {
  if (hour >= 5 && hour < 8) return 'dawn'
  if (hour >= 8 && hour < 12) return 'morning'
  if (hour >= 12 && hour < 14) return 'midday'
  if (hour >= 14 && hour < 17) return 'afternoon'
  if (hour >= 17 && hour < 20) return 'evening'
  return 'night'
}

export function getSeason(month: number, lat: number): Season {
  const isNorthern = lat >= 0
  if (month >= 3 && month <= 5) return isNorthern ? 'spring' : 'autumn'
  if (month >= 6 && month <= 8) return isNorthern ? 'summer' : 'winter'
  if (month >= 9 && month <= 11) return isNorthern ? 'autumn' : 'spring'
  return isNorthern ? 'winter' : 'summer'
}

// All timestamp helpers account for the city's timezone offset (seconds from UTC),
// avoiding browser-local-time errors when displaying weather for remote cities.

function toLocalDate(unixTimestamp: number, timezoneOffsetSec: number): Date {
  return new Date((unixTimestamp + timezoneOffsetSec) * 1000)
}

export function formatSunTime(unixTimestamp: number, timezoneOffsetSec: number): string {
  const d = toLocalDate(unixTimestamp, timezoneOffsetSec)
  const h = d.getUTCHours()
  const m = d.getUTCMinutes()
  const ampm = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}:${m.toString().padStart(2, '0')} ${ampm}`
}

export function formatHour(unixTimestamp: number, timezoneOffsetSec: number): string {
  const d = toLocalDate(unixTimestamp, timezoneOffsetSec)
  const h = d.getUTCHours()
  const ampm = h >= 12 ? 'pm' : 'am'
  return `${h % 12 || 12}${ampm}`
}

export function formatDayName(unixTimestamp: number, timezoneOffsetSec: number): string {
  const d = toLocalDate(unixTimestamp, timezoneOffsetSec)
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getUTCDay()]
}

export function isToday(unixTimestamp: number, timezoneOffsetSec: number): boolean {
  const cityDate = toLocalDate(unixTimestamp, timezoneOffsetSec)
  const nowDate = toLocalDate(Math.floor(Date.now() / 1000), timezoneOffsetSec)
  return (
    cityDate.getUTCFullYear() === nowDate.getUTCFullYear() &&
    cityDate.getUTCMonth() === nowDate.getUTCMonth() &&
    cityDate.getUTCDate() === nowDate.getUTCDate()
  )
}

export function isDaytime(dt: number, sunrise: number, sunset: number): boolean {
  return dt >= sunrise && dt <= sunset
}
