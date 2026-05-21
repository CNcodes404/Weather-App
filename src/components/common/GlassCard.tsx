import { cn } from '@/lib/utils'

interface GlassCardProps {
  className?: string
  children: React.ReactNode
}

export function GlassCard({ className, children }: GlassCardProps) {
  return (
    <div
      className={cn(
        'backdrop-blur-md bg-white/[0.13] border border-white/[0.18] shadow-lg shadow-black/20 rounded-2xl',
        className,
      )}
    >
      {children}
    </div>
  )
}
