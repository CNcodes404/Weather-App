import { useState, useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, MapPin, Loader2 } from 'lucide-react'
import { searchCities } from '@/services/weather.service'
import { useWeatherStore } from '@/store/weatherStore'
import type { GeoLocation } from '@/types/weather'

export function LocationSearch() {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const setLocation = useWeatherStore((state) => state.setLocation)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300)
    return () => clearTimeout(timer)
  }, [query])

  const { data: suggestions = [], isFetching } = useQuery({
    queryKey: ['geocode', debouncedQuery],
    queryFn: () => searchCities(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
    staleTime: 60 * 60 * 1000,
  })

  useEffect(() => {
    if (suggestions.length > 0) setIsOpen(true)
  }, [suggestions])

  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [])

  function handleSelect(geo: GeoLocation) {
    setLocation(geo)
    setQuery('')
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Pill search bar */}
      <div className="relative flex items-center backdrop-blur-md bg-black/25 border border-white/[0.18] rounded-2xl shadow-lg shadow-black/20 overflow-hidden transition-shadow duration-200 focus-within:border-white/30 focus-within:shadow-[0_0_20px_rgba(255,255,255,0.08)]">
        {/* Top-edge highlight */}
        <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

        <Search className="absolute left-4 h-4 w-4 text-white/40 pointer-events-none" />

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search city..."
          className="w-full bg-transparent pl-11 pr-11 py-3.5 text-sm text-white placeholder:text-white/35 outline-none"
        />

        {isFetching && (
          <Loader2 className="absolute right-4 h-4 w-4 text-white/40 animate-spin" />
        )}
      </div>

      {/* Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full mt-2 w-full z-50 backdrop-blur-md bg-black/70 border border-white/[0.15] rounded-2xl overflow-hidden shadow-2xl">
          {/* Top highlight */}
          <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

          {suggestions.map((geo, i) => (
            <button
              key={`${geo.lat}-${geo.lon}`}
              onClick={() => handleSelect(geo)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-white/10 transition-colors text-left ${
                i !== 0 ? 'border-t border-white/[0.06]' : ''
              }`}
            >
              <div className="p-1.5 rounded-lg bg-white/10 shrink-0">
                <MapPin className="h-3 w-3 text-white/60" />
              </div>
              <div>
                <span className="font-medium">{geo.name}</span>
                <span className="text-white/40 ml-1.5 text-xs">
                  {geo.state ? `${geo.state}, ` : ''}{geo.country}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {isOpen && debouncedQuery.length >= 2 && suggestions.length === 0 && !isFetching && (
        <div className="absolute top-full mt-2 w-full z-50 backdrop-blur-md bg-black/70 border border-white/[0.15] rounded-2xl px-4 py-3.5 text-sm text-white/40 shadow-2xl">
          No cities found for "{debouncedQuery}"
        </div>
      )}
    </div>
  )
}
