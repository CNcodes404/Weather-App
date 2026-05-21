import { OWM_BASE_URL, OWM_KEY, ENDPOINTS } from '@/config/api'
import { getConditionFromCode, aggregateDailyForecasts, getAQILabel } from '@/lib/weather.utils'
import type {
  OWMCurrentWeatherResponse,
  OWMForecastResponse,
  OWMAirQualityResponse,
  OWMGeoLocation,
  CurrentWeather,
  HourlyForecast,
  DailyForecast,
  AirQuality,
  AQILevel,
  GeoLocation,
} from '@/types/weather'
import type { Units } from '@/types/app'

async function owmFetch<T>(path: string, params: Record<string, string>): Promise<T> {
  const url = new URL(OWM_BASE_URL + path)
  url.searchParams.set('appid', OWM_KEY)
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value)
  }

  const res = await fetch(url.toString())
  if (!res.ok) {
    throw new Error(`OWM API error ${res.status}: ${res.statusText}`)
  }
  return res.json() as Promise<T>
}

// ─── Current Weather ──────────────────────────────────────────────────────────

export async function getCurrentWeather(
  lat: number,
  lon: number,
  units: Units,
): Promise<CurrentWeather> {
  const raw = await owmFetch<OWMCurrentWeatherResponse>(ENDPOINTS.current, {
    lat: String(lat),
    lon: String(lon),
    units,
  })

  return {
    temp: raw.main.temp,
    feelsLike: raw.main.feels_like,
    tempMin: raw.main.temp_min,
    tempMax: raw.main.temp_max,
    humidity: raw.main.humidity,
    pressure: raw.main.pressure,
    visibility: raw.visibility,
    windSpeed: raw.wind.speed,
    windDeg: raw.wind.deg,
    windGust: raw.wind.gust,
    clouds: raw.clouds.all,
    condition: getConditionFromCode(raw.weather[0]?.id ?? 800),
    description: raw.weather[0]?.description ?? 'Unknown',
    icon: raw.weather[0]?.icon ?? '01d',
    sunrise: raw.sys.sunrise,
    sunset: raw.sys.sunset,
    timezone: raw.timezone,
    cityName: raw.name,
    country: raw.sys.country,
    dt: raw.dt,
  }
}

// ─── Forecast ─────────────────────────────────────────────────────────────────

export interface ForecastData {
  hourly: HourlyForecast[]
  daily: DailyForecast[]
  timezone: number
}

export async function getForecast(
  lat: number,
  lon: number,
  units: Units,
): Promise<ForecastData> {
  const raw = await owmFetch<OWMForecastResponse>(ENDPOINTS.forecast, {
    lat: String(lat),
    lon: String(lon),
    units,
    cnt: '40',
  })

  const hourly: HourlyForecast[] = raw.list.map((item) => ({
    dt: item.dt,
    temp: item.main.temp,
    feelsLike: item.main.feels_like,
    humidity: item.main.humidity,
    windSpeed: item.wind.speed,
    condition: getConditionFromCode(item.weather[0]?.id ?? 800),
    description: item.weather[0]?.description ?? '',
    icon: item.weather[0]?.icon ?? '01d',
    pop: item.pop,
    rain: item.rain?.['3h'],
    snow: item.snow?.['3h'],
  }))

  const daily = aggregateDailyForecasts(raw.list, raw.city.timezone)

  return { hourly, daily, timezone: raw.city.timezone }
}

// ─── Air Quality ──────────────────────────────────────────────────────────────

export async function getAirQuality(lat: number, lon: number): Promise<AirQuality> {
  const raw = await owmFetch<OWMAirQualityResponse>(ENDPOINTS.airQuality, {
    lat: String(lat),
    lon: String(lon),
  })

  const entry = raw.list[0]
  if (!entry) throw new Error('No air quality data returned')

  const aqi = entry.main.aqi as AQILevel

  return {
    aqi,
    label: getAQILabel(aqi),
    components: entry.components,
  }
}

// ─── Geocoding ────────────────────────────────────────────────────────────────

export async function searchCities(query: string): Promise<GeoLocation[]> {
  const results = await owmFetch<OWMGeoLocation[]>(ENDPOINTS.geocoding, {
    q: query,
    limit: '5',
  })

  return results.map((r) => ({
    name: r.name,
    lat: r.lat,
    lon: r.lon,
    country: r.country,
    state: r.state,
  }))
}

export async function reverseGeocode(lat: number, lon: number): Promise<GeoLocation | null> {
  const results = await owmFetch<OWMGeoLocation[]>(ENDPOINTS.reverseGeocode, {
    lat: String(lat),
    lon: String(lon),
    limit: '1',
  })

  const first = results[0]
  if (!first) return null

  return {
    name: first.name,
    lat: first.lat,
    lon: first.lon,
    country: first.country,
    state: first.state,
  }
}
