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
          style={{
            background: `linear-gradient(135deg, ${theme.gradientFrom} 0%, ${theme.gradientVia} 50%, ${theme.gradientTo} 100%)`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        />
      </AnimatePresence>
    </div>
  )
}
