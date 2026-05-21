// ─── OWM Raw API Response Types ──────────────────────────────────────────────
// Used only inside weather.service.ts for parsing. Never leak into UI.

export interface OWMWeatherCondition {
  id: number
  main: string
  description: string
  icon: string
}

export interface OWMCurrentWeatherResponse {
  coord: { lon: number; lat: number }
  weather: OWMWeatherCondition[]
  main: {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    pressure: number
    humidity: number
  }
  visibility: number
  wind: { speed: number; deg: number; gust?: number }
  clouds: { all: number }
  dt: number
  sys: { sunrise: number; sunset: number; country: string }
  timezone: number
  name: string
}

export interface OWMForecastItem {
  dt: number
  main: {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    pressure: number
    humidity: number
  }
  weather: OWMWeatherCondition[]
  clouds: { all: number }
  wind: { speed: number; deg: number; gust?: number }
  visibility: number
  pop: number
  rain?: { '3h': number }
  snow?: { '3h': number }
  sys: { pod: string }
  dt_txt: string
}

export interface OWMForecastResponse {
  list: OWMForecastItem[]
  city: {
    id: number
    name: string
    coord: { lat: number; lon: number }
    country: string
    timezone: number
    sunrise: number
    sunset: number
  }
}

export interface OWMAirQualityResponse {
  list: Array<{
    main: { aqi: number }
    components: {
      co: number
      no: number
      no2: number
      o3: number
      so2: number
      pm2_5: number
      pm10: number
      nh3: number
    }
    dt: number
  }>
}

export interface OWMGeoLocation {
  name: string
  lat: number
  lon: number
  country: string
  state?: string
  local_names?: Record<string, string>
}

// ─── Clean Internal Types ─────────────────────────────────────────────────────
// These are what the UI always works with.

export type WeatherCondition =
  | 'thunderstorm'
  | 'drizzle'
  | 'rain'
  | 'snow'
  | 'mist'
  | 'smoke'
  | 'haze'
  | 'dust'
  | 'fog'
  | 'sand'
  | 'ash'
  | 'squall'
  | 'tornado'
  | 'clear'
  | 'clouds'

export interface CurrentWeather {
  temp: number
  feelsLike: number
  tempMin: number
  tempMax: number
  humidity: number
  pressure: number
  visibility: number
  windSpeed: number
  windDeg: number
  windGust?: number
  clouds: number
  condition: WeatherCondition
  description: string
  icon: string
  sunrise: number
  sunset: number
  timezone: number
  cityName: string
  country: string
  dt: number
}

export interface HourlyForecast {
  dt: number
  temp: number
  feelsLike: number
  humidity: number
  windSpeed: number
  condition: WeatherCondition
  description: string
  icon: string
  pop: number
  rain?: number
  snow?: number
}

export interface DailyForecast {
  date: number
  tempMin: number
  tempMax: number
  condition: WeatherCondition
  description: string
  icon: string
  pop: number
  humidity: number
}

export type AQILevel = 1 | 2 | 3 | 4 | 5
export type AQILabel = 'Good' | 'Fair' | 'Moderate' | 'Poor' | 'Very Poor'

export interface AirQuality {
  aqi: AQILevel
  label: AQILabel
  components: {
    co: number
    no: number
    no2: number
    o3: number
    so2: number
    pm2_5: number
    pm10: number
    nh3: number
  }
}

export interface GeoLocation {
  name: string
  lat: number
  lon: number
  country: string
  state?: string
}
