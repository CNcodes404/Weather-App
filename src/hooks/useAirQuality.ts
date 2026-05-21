import { useQuery } from '@tanstack/react-query'
import { getAirQuality } from '@/services/weather.service'

export function useAirQuality(lat: number | null, lon: number | null) {
  return useQuery({
    queryKey: ['airquality', lat, lon],
    queryFn: () => getAirQuality(lat!, lon!),
    enabled: lat !== null && lon !== null,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}
