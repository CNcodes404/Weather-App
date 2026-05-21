import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Location, Units, NarratorTone, ChatMessage } from '@/types/app'

interface WeatherStoreState {
  location: Location | null
  units: Units
  narratorTone: NarratorTone
  chatHistory: ChatMessage[]
}

interface WeatherStoreActions {
  setLocation: (location: Location) => void
  toggleUnits: () => void
  setNarratorTone: (tone: NarratorTone) => void
  appendChatMessage: (message: ChatMessage) => void
  clearChat: () => void
}

type WeatherStore = WeatherStoreState & WeatherStoreActions

export const useWeatherStore = create<WeatherStore>()(
  persist(
    (set) => ({
      location: null,
      units: 'metric',
      narratorTone: 'neighbor',
      chatHistory: [],

      setLocation: (location) => set({ location }),

      toggleUnits: () =>
        set((state) => ({
          units: state.units === 'metric' ? 'imperial' : 'metric',
        })),

      setNarratorTone: (tone) => set({ narratorTone: tone }),

      appendChatMessage: (message) =>
        set((state) => ({
          // Keep last 20 messages to cap token usage in multi-turn chat
          chatHistory: [...state.chatHistory.slice(-19), message],
        })),

      clearChat: () => set({ chatHistory: [] }),
    }),
    {
      name: 'skymind-weather-store',
    },
  ),
)
