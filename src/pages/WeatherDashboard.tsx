import { useEffect } from 'react'
import { AppBackground } from '@/components/layout/AppBackground'
import { AppShell } from '@/components/layout/AppShell'
import { LocationSearch } from '@/components/search/LocationSearch'
import { CurrentConditions } from '@/components/weather/CurrentConditions'
import { WeatherStats } from '@/components/weather/WeatherStats'
import { AQIGauge } from '@/components/weather/AQIGauge'
import { HourlyChart } from '@/components/weather/HourlyChart'
import { DailyForecast } from '@/components/weather/DailyForecast'
import { SunriseSunset } from '@/components/weather/SunriseSunset'
import { WeatherMap } from '@/components/weather/WeatherMap'
import {
  HeroSkeleton,
  StatsSkeleton,
  SunriseAQISkeleton,
  ChartSkeleton,
  ForecastSkeleton,
  MapSkeleton,
} from '@/components/common/LoadingSkeleton'
import { ErrorCard } from '@/components/common/ErrorCard'
import { useGeolocation } from '@/hooks/useGeolocation'
import { useWeather } from '@/hooks/useWeather'
import { useForecast } from '@/hooks/useForecast'
import { useUnits } from '@/hooks/useUnits'
import { useTheme } from '@/hooks/useTheme'
import { useWeatherStore } from '@/store/weatherStore'

export function WeatherDashboard() {
  const { location: geoLocation } = useGeolocation()
  const location = useWeatherStore((state) => state.location)
  const setLocation = useWeatherStore((state) => state.setLocation)
  const { units } = useUnits()

  useEffect(() => {
    if (geoLocation && !location) {
      setLocation(geoLocation)
    }
  }, [geoLocation, location, setLocation])

  const activeLocation = location ?? geoLocation
  const lat = activeLocation?.lat ?? null
  const lon = activeLocation?.lon ?? null

  const {
    data: weather,
    isLoading: weatherLoading,
    isError: weatherError,
    refetch: refetchWeather,
  } = useWeather(lat, lon, units)

  const {
    data: forecast,
    isLoading: forecastLoading,
    isError: forecastError,
    refetch: refetchForecast,
  } = useForecast(lat, lon, units)

  const theme = useTheme(weather?.condition)
  const timezoneOffset = forecast?.timezone ?? weather?.timezone ?? 0

  return (
    <>
      <AppBackground theme={theme} />
      <AppShell>
        <div id="section-weather" className="space-y-4">
          <LocationSearch />

          {/* Hero + stats */}
          {weatherLoading && (
            <>
              <HeroSkeleton />
              <StatsSkeleton />
            </>
          )}
          {weatherError && (
            <ErrorCard
              message="Could not load weather data. Check your API key or network connection."
              onRetry={() => void refetchWeather()}
            />
          )}
          {weather && (
            <>
              <CurrentConditions weather={weather} units={units} />
              <WeatherStats weather={weather} units={units} />
            </>
          )}

          {/* Sunrise + AQI */}
          {weatherLoading && <SunriseAQISkeleton />}
          {weather && lat !== null && lon !== null && (
            <div className="grid grid-cols-2 gap-3">
              <SunriseSunset
                sunrise={weather.sunrise}
                sunset={weather.sunset}
                timezone={timezoneOffset}
              />
              <AQIGauge lat={lat} lon={lon} />
            </div>
          )}

          {/* Hourly chart */}
          {forecastLoading && <ChartSkeleton />}
          {forecastError && (
            <ErrorCard
              message="Could not load forecast data."
              onRetry={() => void refetchForecast()}
            />
          )}
          {forecast && (
            <HourlyChart
              hourly={forecast.hourly}
              units={units}
              timezoneOffset={timezoneOffset}
            />
          )}

          {/* 7-day forecast */}
          {forecastLoading && <ForecastSkeleton />}
          {forecast && (
            <DailyForecast
              daily={forecast.daily}
              units={units}
              timezoneOffset={timezoneOffset}
            />
          )}

          {/* Map — scroll target for mobile nav */}
          <div id="section-map" />
          {weatherLoading && <MapSkeleton />}
          {weather && lat !== null && lon !== null && (
            <WeatherMap lat={lat} lon={lon} />
          )}

          {/* AI section anchor — populated in Steps 13–17 */}
          <div id="section-ai" />

          {/* Settings anchor — unit toggle lives in CurrentConditions header */}
          <div id="section-settings" />
        </div>
      </AppShell>
    </>
  )
}
