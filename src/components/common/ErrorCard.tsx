import { AlertTriangle, RefreshCw } from 'lucide-react'
import { GlassCard } from '@/components/common/GlassCard'

interface ErrorCardProps {
  message?: string
  onRetry?: () => void
}

export function ErrorCard({
  message = 'Something went wrong',
  onRetry,
}: ErrorCardProps) {
  return (
    <GlassCard className="p-5 flex flex-col items-center gap-3 text-center bg-red-500/10 border-red-400/20">
      <AlertTriangle className="h-6 w-6 text-red-400" />
      <p className="text-sm font-medium text-white">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-1.5 text-xs text-white/60 hover:text-white transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Try again
        </button>
      )}
    </GlassCard>
  )
}
