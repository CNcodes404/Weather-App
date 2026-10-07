import { motion } from 'framer-motion'
import { useUnits } from '@/hooks/useUnits'

export function UnitToggle() {
  const { units, toggleUnits } = useUnits()

  return (
    <button
      onClick={toggleUnits}
      aria-label="Toggle temperature unit"
      className="relative flex items-center h-7 rounded-full bg-white/10 border border-white/15 p-0.5 gap-0"
    >
      {/* Sliding pill indicator */}
      <motion.div
        className="absolute top-0.5 bottom-0.5 w-[calc(50%-2px)] rounded-full bg-white/25"
        animate={{ left: units === 'metric' ? '2px' : 'calc(50%)' }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      />
      <span className={`relative z-10 px-2.5 text-xs font-semibold transition-colors ${units === 'metric' ? 'text-white' : 'text-white/40'}`}>
        °C
      </span>
      <span className={`relative z-10 px-2.5 text-xs font-semibold transition-colors ${units === 'imperial' ? 'text-white' : 'text-white/40'}`}>
        °F
      </span>
    </button>
  )
}
