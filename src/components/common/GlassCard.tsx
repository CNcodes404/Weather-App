import { cn } from '@/lib/utils'

interface GlassCardProps {
  className?: string
  children: React.ReactNode
}

export function GlassCard({ className, children }: GlassCardProps) {
  return (
    <div
      className={cn(
        'relative backdrop-blur-md bg-black/[0.20] border border-white/[0.15] shadow-lg shadow-black/30 rounded-2xl overflow-hidden',
        className,
      )}
    >
      {/* Top-edge frosted highlight */}
      <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />
      {children}
    </div>
  )
}
