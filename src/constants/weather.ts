import type { WeatherCondition } from '@/types/weather'
import type { WeatherTheme, TimeOfDay } from '@/types/app'

// Maps each condition + time-of-day to a gradient theme for AppBackground.
export function getWeatherTheme(condition: WeatherCondition, timeOfDay: TimeOfDay): WeatherTheme {
  switch (condition) {
    case 'clear':
      return CLEAR_THEMES[timeOfDay] ?? CLEAR_THEMES.midday
    case 'clouds':
      return CLOUDY_THEME
    case 'drizzle':
    case 'rain':
      return RAIN_THEME
    case 'thunderstorm':
      return STORM_THEME
    case 'snow':
      return SNOW_THEME
    case 'fog':
    case 'mist':
    case 'haze':
    case 'smoke':
    case 'dust':
    case 'sand':
    case 'ash':
    case 'squall':
    case 'tornado':
      return FOG_THEME
    default:
      return CLEAR_THEMES.midday
  }
}

const CLEAR_THEMES: Record<TimeOfDay, WeatherTheme> = {
  dawn: {
    gradientFrom: '#F97316',
    gradientVia: '#FB923C',
    gradientTo: '#7DD3FC',
    glassOpacity: 0.15,
    textColor: 'dark',
    accentColor: '#F97316',
  },
  morning: {
    gradientFrom: '#38BDF8',
    gradientVia: '#0EA5E9',
    gradientTo: '#1D4ED8',
    glassOpacity: 0.15,
    textColor: 'light',
    accentColor: '#38BDF8',
  },
  midday: {
    gradientFrom: '#0EA5E9',
    gradientVia: '#2563EB',
    gradientTo: '#1D4ED8',
    glassOpacity: 0.12,
    textColor: 'light',
    accentColor: '#38BDF8',
  },
  afternoon: {
    gradientFrom: '#60A5FA',
    gradientVia: '#3B82F6',
    gradientTo: '#1D4ED8',
    glassOpacity: 0.15,
    textColor: 'light',
    accentColor: '#60A5FA',
  },
  evening: {
    gradientFrom: '#F97316',
    gradientVia: '#EC4899',
    gradientTo: '#7C3AED',
    glassOpacity: 0.18,
    textColor: 'light',
    accentColor: '#F97316',
  },
  night: {
    gradientFrom: '#0F172A',
    gradientVia: '#1E1B4B',
    gradientTo: '#0F172A',
    glassOpacity: 0.2,
    textColor: 'light',
    accentColor: '#818CF8',
  },
}

const CLOUDY_THEME: WeatherTheme = {
  gradientFrom: '#94A3B8',
  gradientVia: '#64748B',
  gradientTo: '#475569',
  glassOpacity: 0.15,
  textColor: 'light',
  accentColor: '#94A3B8',
}

const RAIN_THEME: WeatherTheme = {
  gradientFrom: '#1E3A5F',
  gradientVia: '#2D5986',
  gradientTo: '#1A2F4A',
  glassOpacity: 0.2,
  textColor: 'light',
  accentColor: '#60A5FA',
}

const STORM_THEME: WeatherTheme = {
  gradientFrom: '#1A1A2E',
  gradientVia: '#2D1B69',
  gradientTo: '#0F0F23',
  glassOpacity: 0.22,
  textColor: 'light',
  accentColor: '#A78BFA',
}

const SNOW_THEME: WeatherTheme = {
  gradientFrom: '#EFF6FF',
  gradientVia: '#BFDBFE',
  gradientTo: '#93C5FD',
  glassOpacity: 0.12,
  textColor: 'dark',
  accentColor: '#3B82F6',
}

const FOG_THEME: WeatherTheme = {
  gradientFrom: '#D1D5DB',
  gradientVia: '#9CA3AF',
  gradientTo: '#6B7280',
  glassOpacity: 0.18,
  textColor: 'dark',
  accentColor: '#6B7280',
}
