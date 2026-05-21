import { useState, useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, MapPin } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { searchCities } from '@/services/weather.service'
import { useWeatherStore } from '@/store/weatherStore'
import type { GeoLocation } from '@/types/weather'

export function LocationSearch() {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const setLocation = useWeatherStore((state) => state.setLocation)

  // Debounce input 300ms
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300)
    return () => clearTimeout(timer)
  }, [query])

  const { data: suggestions = [] } = useQuery({
    queryKey: ['geocode', debouncedQuery],
    queryFn: () => searchCities(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
    staleTime: 60 * 60 * 1000,
  })

  useEffect(() => {
    if (suggestions.length > 0) setIsOpen(true)
  }, [suggestions])

  // Close on outside click
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
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50 pointer-events-none" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search city..."
          className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus-visible:ring-white/30 focus-visible:border-white/40"
        />
      </div>

      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full mt-1 w-full z-50 backdrop-blur-md bg-black/60 border border-white/20 rounded-xl overflow-hidden shadow-2xl">
          {suggestions.map((geo) => (
            <button
              key={`${geo.lat}-${geo.lon}`}
              onClick={() => handleSelect(geo)}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-white hover:bg-white/10 transition-colors text-left"
            >
              <MapPin className="h-3.5 w-3.5 shrink-0 text-white/50" />
              <span>
                {geo.name}
                {geo.state ? `, ${geo.state}` : ''}, {geo.country}
              </span>
            </button>
          ))}
        </div>
      )}

      {isOpen && debouncedQuery.length >= 2 && suggestions.length === 0 && (
        <div className="absolute top-full mt-1 w-full z-50 backdrop-blur-md bg-black/60 border border-white/20 rounded-xl px-3 py-3 text-sm text-white/50 shadow-2xl">
          No cities found
        </div>
      )}
    </div>
  )
}
