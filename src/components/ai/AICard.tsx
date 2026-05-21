import type { ElementType, ReactNode } from 'react'
import { Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface AICardProps {
  title: string
  icon?: ElementType
  children: ReactNode
  isLoading?: boolean
  className?: string
}

export function AICard({
  title,
  icon: Icon = Sparkles,
  children,
  isLoading = false,
  className,
}: AICardProps) {
  return (
    <div
      className={cn(
        'relative backdrop-blur-md bg-white/10 border shadow-xl rounded-2xl overflow-hidden',
        isLoading ? 'border-white/30' : 'border-white/20',
        className,
      )}
    >
      {/* Shimmer border sweep while loading */}
      {isLoading && (
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 50%, transparent 100%)',
            backgroundSize: '200% 100%',
          }}
          animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
        />
      )}

      <div className="p-4">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <Icon className="h-4 w-4 text-white/60" />
          <p className="text-xs text-white/40 uppercase tracking-wide font-medium">{title}</p>
        </div>

        {children}
      </div>
    </div>
  )
}
