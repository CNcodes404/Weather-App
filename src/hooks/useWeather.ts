import { useQuery } from '@tanstack/react-query'
import { getCurrentWeather } from '@/services/weather.service'
import type { Units } from '@/types/app'

export function useWeather(lat: number | null, lon: number | null, units: Units) {
  return useQuery({
    queryKey: ['weather', lat, lon, units],
    queryFn: () => getCurrentWeather(lat!, lon!, units),
    enabled: lat !== null && lon !== null,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  })
}
