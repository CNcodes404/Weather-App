export const OWM_BASE_URL = 'https://api.openweathermap.org'
export const OWM_KEY = import.meta.env.VITE_OWM_API_KEY

export const ENDPOINTS = {
  current: '/data/2.5/weather',
  forecast: '/data/2.5/forecast',
  airQuality: '/data/2.5/air_pollution',
  geocoding: '/geo/1.0/direct',
  reverseGeocode: '/geo/1.0/reverse',
} as const
