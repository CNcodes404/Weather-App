import { Skeleton } from '@/components/ui/skeleton'

export function HeroSkeleton() {
  return (
    <Skeleton className="h-52 rounded-2xl bg-white/10" />
  )
}

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <Skeleton key={i} className="h-16 rounded-2xl bg-white/10" />
      ))}
    </div>
  )
}

export function SunriseAQISkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Skeleton className="h-28 rounded-2xl bg-white/10" />
      <Skeleton className="h-28 rounded-2xl bg-white/10" />
    </div>
  )
}

export function ChartSkeleton() {
  return <Skeleton className="h-52 rounded-2xl bg-white/10" />
}

export function ForecastSkeleton() {
  return (
    <div className="flex gap-2">
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <Skeleton key={i} className="h-28 w-[72px] shrink-0 rounded-2xl bg-white/10" />
      ))}
    </div>
  )
}

export function MapSkeleton() {
  return <Skeleton className="h-[268px] rounded-2xl bg-white/10" />
}
