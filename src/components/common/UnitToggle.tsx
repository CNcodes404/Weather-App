import { useUnits } from '@/hooks/useUnits'
import { cn } from '@/lib/utils'

export function UnitToggle() {
  const { units, toggleUnits } = useUnits()

  return (
    <button
      onClick={toggleUnits}
      className="flex items-center gap-1 text-sm font-medium text-white/70 hover:text-white transition-colors"
      aria-label="Toggle temperature unit"
    >
      <span className={cn(units === 'metric' ? 'text-white' : 'text-white/40')}>°C</span>
      <span className="text-white/30">/</span>
      <span className={cn(units === 'imperial' ? 'text-white' : 'text-white/40')}>°F</span>
    </button>
  )
}
