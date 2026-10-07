import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Car, UtensilsCrossed, Dumbbell, Moon, Smile, BarChart3, RefreshCw } from 'lucide-react'
import { AICard } from '@/components/ai/AICard'
import { useGemini } from '@/hooks/useGemini'
import { buildImpactScorePrompt } from '@/constants/prompts'
import type { CurrentWeather, HourlyForecast } from '@/types/weather'
import type { ImpactScoreData, ImpactItem } from '@/types/ai'

interface ImpactScoreProps {
  weather: CurrentWeather
  hourly: HourlyForecast[]
}

const ACTIVITIES: { key: keyof ImpactScoreData; label: string; icon: React.ElementType }[] = [
  { key: 'commute',       label: 'Commute',        icon: Car },
  { key: 'outdoor_dining',label: 'Outdoor Dining', icon: UtensilsCrossed },
  { key: 'exercise',      label: 'Exercise',       icon: Dumbbell },
  { key: 'sleep',         label: 'Sleep',          icon: Moon },
  { key: 'mood',          label: 'Mood',           icon: Smile },
]

function scoreColor(score: number) {
  if (score >= 8) return 'bg-emerald-400'
  if (score >= 5) return 'bg-amber-400'
  return 'bg-red-400'
}

function scoreLabel(score: number) {
  if (score >= 8) return 'text-emerald-400'
  if (score >= 5) return 'text-amber-400'
  return 'text-red-400'
}

function parseImpactScore(raw: string): ImpactScoreData | null {
  try {
    const clean = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const parsed = JSON.parse(clean) as ImpactScoreData
    const keys: (keyof ImpactScoreData)[] = ['commute', 'outdoor_dining', 'exercise', 'sleep', 'mood']
    for (const key of keys) {
      const item = parsed[key] as ImpactItem | undefined
      if (!item || typeof item.score !== 'number' || typeof item.reason !== 'string') return null
    }
    return parsed
  } catch {
    return null
  }
}

function ScoreBar({ item }: { item: ImpactItem }) {
  return (
    <div className="w-full bg-white/10 rounded-full h-1.5 mt-2">
      <motion.div
        className={`h-1.5 rounded-full ${scoreColor(item.score)}`}
        initial={{ width: 0 }}
        animate={{ width: `${item.score * 10}%` }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      />
    </div>
  )
}

export function ImpactScore({ weather, hourly }: ImpactScoreProps) {
  const { output, isLoading, error, generate } = useGemini()
  const [data, setData] = useState<ImpactScoreData | null>(null)

  useEffect(() => {
    void generate(buildImpactScorePrompt(weather, hourly))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weather.cityName])

  useEffect(() => {
    if (output && !isLoading) {
      setData(parseImpactScore(output))
    }
  }, [output, isLoading])

  function handleRefresh() {
    setData(null)
    void generate(buildImpactScorePrompt(weather, hourly))
  }

  return (
    <AICard title="Weather Impact" icon={BarChart3} isLoading={isLoading}>
      {/* Loading skeleton */}
      {isLoading && (
        <div className="space-y-3 animate-pulse">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-1.5">
              <div className="flex justify-between">
                <div className="h-3 w-28 rounded bg-white/10" />
                <div className="h-3 w-8 rounded bg-white/10" />
              </div>
              <div className="h-1.5 w-full rounded-full bg-white/10" />
              <div className="h-3 w-3/4 rounded bg-white/10" />
            </div>
          ))}
        </div>
      )}

      {/* Results */}
      {data && !isLoading && (
        <div className="space-y-3">
          {ACTIVITIES.map(({ key, label, icon: Icon }) => {
            const item = data[key]
            return (
              <div key={key}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-3.5 w-3.5 text-white/40" />
                    <span className="text-xs font-medium text-white/70">{label}</span>
                  </div>
                  <span className={`text-xs font-bold ${scoreLabel(item.score)}`}>
                    {item.score}/10
                  </span>
                </div>
                <ScoreBar item={item} />
                <p className="text-[11px] text-white/40 mt-1 leading-snug">{item.reason}</p>
              </div>
            )
          })}

          <div className="flex justify-end pt-1">
            <button
              onClick={handleRefresh}
              className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors"
            >
              <RefreshCw className="h-3 w-3" />
              Refresh
            </button>
          </div>
        </div>
      )}

      {/* Error */}
      {error && !isLoading && (
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-red-400/80">
            {error.includes('429') || error.includes('quota')
              ? 'AI quota reached. Try again in a minute.'
              : error}
          </p>
          <button
            onClick={handleRefresh}
            className="text-xs text-white/40 hover:text-white/70 transition-colors shrink-0"
          >
            Retry
          </button>
        </div>
      )}

      {/* Parse error */}
      {!isLoading && !data && !error && output && (
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-white/40">Couldn't parse scores. Try again.</p>
          <button onClick={handleRefresh} className="text-xs text-white/40 hover:text-white/70 transition-colors">
            Retry
          </button>
        </div>
      )}
    </AICard>
  )
}
