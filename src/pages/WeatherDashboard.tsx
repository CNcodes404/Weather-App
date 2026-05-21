import { useEffect } from 'react'
import { AppBackground } from '@/components/layout/AppBackground'
import { AppShell } from '@/components/layout/AppShell'
import { LocationSearch } from '@/components/search/LocationSearch'
import { CurrentConditions } from '@/components/weather/CurrentConditions'
import { WeatherStats } from '@/components/weather/WeatherStats'
import { Skeleton } from '@/components/ui/skeleton'
import { useGeolocation } from '@/hooks/useGeolocation'
import { useWeather } from '@/hooks/useWeather'
import { useUnits } from '@/hooks/useUnits'
import { useTheme } from '@/hooks/useTheme'
import { useWeatherStore } from '@/store/weatherStore'

export function WeatherDashboard() {
  const { location: geoLocation } = useGeolocation()
  const location = useWeatherStore((state) => state.location)
  const setLocation = useWeatherStore((state) => state.setLocation)
  const { units } = useUnits()

  // Seed store from geolocation only if no city is already saved
  useEffect(() => {
    if (geoLocation && !location) {
      setLocation(geoLocation)
    }
  }, [geoLocation, location, setLocation])

  const activeLocation = location ?? geoLocation

  const { data: weather, isLoading, isError, refetch } = useWeather(
    activeLocation?.lat ?? null,
    activeLocation?.lon ?? null,
    units,
  )

  const theme = useTheme(weather?.condition)

  return (
    <>
      <AppBackground theme={theme} />
      <AppShell>
        <div className="space-y-4">
          <LocationSearch />

          {isLoading && (
            <div className="space-y-4">
              <Skeleton className="h-52 rounded-2xl bg-white/10" />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-16 rounded-2xl bg-white/10" />
                ))}
              </div>
            </div>
          )}

          {isError && (
            <div className="backdrop-blur-md bg-red-500/20 border border-red-400/30 rounded-2xl p-6 text-center text-white space-y-2">
              <p className="font-semibold">Could not load weather data</p>
              <p className="text-sm text-white/60">
                Check your API key in .env or your network connection
              </p>
              <button
                onClick={() => void refetch()}
                className="mt-2 text-sm underline underline-offset-4 text-white/70 hover:text-white transition-colors"
              >
                Try again
              </button>
            </div>
          )}

          {weather && (
            <>
              <CurrentConditions weather={weather} units={units} />
              <WeatherStats weather={weather} units={units} />
            </>
          )}
        </div>
      </AppShell>
    </>
  )
}
