import { useWeatherStore } from '@/store/weatherStore'

export function useUnits() {
  const units = useWeatherStore((state) => state.units)
  const toggleUnits = useWeatherStore((state) => state.toggleUnits)
  return { units, toggleUnits }
}
