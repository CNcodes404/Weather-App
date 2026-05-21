import { useQuery } from '@tanstack/react-query'
import { getForecast } from '@/services/weather.service'
import type { Units } from '@/types/app'

export function useForecast(lat: number | null, lon: number | null, units: Units) {
  return useQuery({
    queryKey: ['forecast', lat, lon, units],
    queryFn: () => getForecast(lat!, lon!, units),
    enabled: lat !== null && lon !== null,
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}
