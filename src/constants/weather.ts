import type { WeatherCondition } from '@/types/weather'
import type { WeatherTheme, TimeOfDay } from '@/types/app'

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
    // Warm gold sunrise bleeding into sky blue
    gradientFrom: '#FCD34D',
    gradientVia: '#F97316',
    gradientTo: '#7DD3FC',
    glowColor: 'rgba(252, 211, 77, 0.45)',
    glassOpacity: 0.15,
    textColor: 'light',
    accentColor: '#F97316',
  },
  morning: {
    // Saturated gold top → bright sky blue → deep blue horizon
    gradientFrom: '#FCD34D',
    gradientVia: '#38BDF8',
    gradientTo: '#0369A1',
    glowColor: 'rgba(252, 211, 77, 0.40)',
    glassOpacity: 0.15,
    textColor: 'light',
    accentColor: '#38BDF8',
  },
  midday: {
    // Rich sky blue top → vivid blue → deep ocean blue
    gradientFrom: '#38BDF8',
    gradientVia: '#0EA5E9',
    gradientTo: '#1E40AF',
    glowColor: 'rgba(56, 189, 248, 0.35)',
    glassOpacity: 0.12,
    textColor: 'light',
    accentColor: '#38BDF8',
  },
  afternoon: {
    // Warm amber top → sky blue → rich blue
    gradientFrom: '#FCD34D',
    gradientVia: '#60A5FA',
    gradientTo: '#1D4ED8',
    glowColor: 'rgba(252, 211, 77, 0.40)',
    glassOpacity: 0.15,
    textColor: 'light',
    accentColor: '#60A5FA',
  },
  evening: {
    // Fiery orange → hot pink → deep violet
    gradientFrom: '#F97316',
    gradientVia: '#EC4899',
    gradientTo: '#7C3AED',
    glowColor: 'rgba(249, 115, 22, 0.40)',
    glassOpacity: 0.18,
    textColor: 'light',
    accentColor: '#F97316',
  },
  night: {
    // Deep navy → dark indigo → near-black
    gradientFrom: '#0F172A',
    gradientVia: '#1E1B4B',
    gradientTo: '#030712',
    glowColor: 'rgba(129, 140, 248, 0.15)',
    glassOpacity: 0.2,
    textColor: 'light',
    accentColor: '#818CF8',
  },
}

const CLOUDY_THEME: WeatherTheme = {
  // Light silver top → dark slate bottom — dramatic contrast
  gradientFrom: '#CBD5E1',
  gradientVia: '#475569',
  gradientTo: '#1E293B',
  glassOpacity: 0.15,
  textColor: 'light',
  accentColor: '#94A3B8',
}

const RAIN_THEME: WeatherTheme = {
  // Deep teal-blue → dark navy
  gradientFrom: '#0C4A6E',
  gradientVia: '#1E3A8A',
  gradientTo: '#0F172A',
  glowColor: 'rgba(14, 116, 144, 0.20)',
  glassOpacity: 0.2,
  textColor: 'light',
  accentColor: '#38BDF8',
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
  gradientFrom: '#BAE6FD',
  gradientVia: '#93C5FD',
  gradientTo: '#3B82F6',
  glowColor: 'rgba(186, 230, 253, 0.35)',
  glassOpacity: 0.15,
  textColor: 'light',
  accentColor: '#93C5FD',
}

const FOG_THEME: WeatherTheme = {
  gradientFrom: '#E2E8F0',
  gradientVia: '#94A3B8',
  gradientTo: '#475569',
  glassOpacity: 0.18,
  textColor: 'light',
  accentColor: '#94A3B8',
}
