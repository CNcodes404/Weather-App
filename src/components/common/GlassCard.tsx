import { cn } from '@/lib/utils'

interface GlassCardProps {
  className?: string
  children: React.ReactNode
}

export function GlassCard({ className, children }: GlassCardProps) {
  return (
    <div
      className={cn(
        'backdrop-blur-md bg-white/10 border border-white/20 shadow-xl rounded-2xl',
        className,
      )}
    >
      {children}
    </div>
  )
}
