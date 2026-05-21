import { useState, useEffect } from 'react'
import { reverseGeocode } from '@/services/weather.service'
import type { Location } from '@/types/app'

const DEFAULT_LOCATION: Location = {
  lat: 51.5074,
  lon: -0.1278,
  name: 'London',
  country: 'GB',
}

export function useGeolocation() {
  const [location, setLocation] = useState<Location | null>(null)
  const [isLocating, setIsLocating] = useState(true)

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation(DEFAULT_LOCATION)
      setIsLocating(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const geo = await reverseGeocode(coords.latitude, coords.longitude)
          setLocation(
            geo ?? {
              lat: coords.latitude,
              lon: coords.longitude,
              name: 'Your Location',
              country: '',
            },
          )
        } catch {
          setLocation({
            lat: coords.latitude,
            lon: coords.longitude,
            name: 'Your Location',
            country: '',
          })
        } finally {
          setIsLocating(false)
        }
      },
      () => {
        setLocation(DEFAULT_LOCATION)
        setIsLocating(false)
      },
      { timeout: 8000 },
    )
  }, [])

  return { location, isLocating }
}
