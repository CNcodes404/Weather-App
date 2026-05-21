import { motion, AnimatePresence } from 'framer-motion'
import type { WeatherTheme } from '@/types/app'

interface AppBackgroundProps {
  theme: WeatherTheme
}

export function AppBackground({ theme }: AppBackgroundProps) {
  const gradientKey = `${theme.gradientFrom}-${theme.gradientVia}-${theme.gradientTo}`

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <AnimatePresence mode="sync">
        <motion.div
          key={gradientKey}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        >
          {/* Base gradient */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(160deg, ${theme.gradientFrom} 0%, ${theme.gradientVia} 50%, ${theme.gradientTo} 100%)`,
            }}
          />

          {/* Radial glow — simulates sun, moon, or storm light source */}
          {theme.glowColor && (
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(ellipse at 78% 8%, ${theme.glowColor} 0%, transparent 55%)`,
              }}
            />
          )}

          {/* Subtle noise vignette for depth — darkens bottom edge */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.25) 100%)',
            }}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
