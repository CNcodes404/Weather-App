export type Units = 'metric' | 'imperial'
export type NarratorTone = 'newsanchor' | 'poetic' | 'sarcastic' | 'neighbor'
export type TimeOfDay = 'dawn' | 'morning' | 'midday' | 'afternoon' | 'evening' | 'night'
export type Season = 'spring' | 'summer' | 'autumn' | 'winter'
export type TextColor = 'light' | 'dark'

export interface Location {
  lat: number
  lon: number
  name: string
  country: string
  state?: string
}

export interface WeatherTheme {
  gradientFrom: string
  gradientVia: string
  gradientTo: string
  glowColor?: string
  glassOpacity: number
  textColor: TextColor
  accentColor: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'model'
  text: string
  timestamp: number
}
