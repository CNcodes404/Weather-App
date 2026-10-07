import { useState, useEffect } from 'react'
import { Palette, RefreshCw } from 'lucide-react'
import { AICard } from '@/components/ai/AICard'
import { useGemini } from '@/hooks/useGemini'
import { buildMoodBoardPrompt } from '@/constants/prompts'
import { getTimeOfDay } from '@/lib/time.utils'
import type { CurrentWeather } from '@/types/weather'
import type { MoodBoardData } from '@/types/ai'

interface MoodBoardProps {
  weather: CurrentWeather
}

function parseMoodBoard(raw: string): MoodBoardData | null {
  try {
    const clean = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const parsed = JSON.parse(clean) as MoodBoardData
    if (
      typeof parsed.mood !== 'string' ||
      !Array.isArray(parsed.palette) ||
      parsed.palette.length < 4
    ) return null
    return parsed
  } catch {
    return null
  }
}

export function MoodBoard({ weather }: MoodBoardProps) {
  const { output, isLoading, error, generate, reset } = useGemini()
  const [data, setData] = useState<MoodBoardData | null>(null)
  const [hasGenerated, setHasGenerated] = useState(false)

  useEffect(() => {
    if (output && !isLoading) {
      setData(parseMoodBoard(output))
    }
  }, [output, isLoading])

  const timeOfDay = getTimeOfDay(new Date().getHours())

  async function handleGenerate() {
    setHasGenerated(true)
    setData(null)
    await generate(buildMoodBoardPrompt(weather, timeOfDay))
  }

  function handleRegenerate() {
    reset()
    void handleGenerate()
  }

  return (
    <AICard title="Mood Board" icon={Palette} isLoading={isLoading}>
      {/* Idle */}
      {!hasGenerated && !isLoading && (
        <div className="flex justify-center py-2">
          <button
            onClick={() => void handleGenerate()}
            className="px-5 py-2 rounded-full text-sm font-medium text-white bg-white/10 border border-white/20 hover:bg-white/20 transition-colors"
          >
            Generate Vibe
          </button>
        </div>
      )}

      {/* Loading placeholder */}
      {isLoading && (
        <div className="space-y-3 animate-pulse">
          <div className="flex gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 flex-1 rounded-xl bg-white/10" />
            ))}
          </div>
          <div className="h-8 w-32 rounded-lg bg-white/10" />
          <div className="flex gap-2">
            <div className="h-6 w-24 rounded-full bg-white/10" />
            <div className="h-6 w-28 rounded-full bg-white/10" />
          </div>
          <div className="h-4 w-3/4 rounded-lg bg-white/10" />
        </div>
      )}

      {/* Result */}
      {data && !isLoading && (
        <div className="space-y-4">
          {/* Vibe */}
          <div>
            <p className="text-[10px] text-white/35 uppercase tracking-widest mb-1">Today's Vibe</p>
            <p className="text-2xl font-semibold text-white capitalize tracking-wide">{data.mood}</p>
          </div>

          {/* Color palette */}
          <div>
            <p className="text-[10px] text-white/35 uppercase tracking-widest mb-2">Color Palette</p>
            <div className="flex gap-2">
              {data.palette.map((hex, i) => (
                <div key={i} className="flex-1 space-y-1">
                  <div
                    className="h-9 rounded-xl shadow-inner"
                    style={{ backgroundColor: hex }}
                  />
                  <p className="text-[9px] text-white/30 text-center font-mono">{hex}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Soundtrack + Activity */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/[0.06] rounded-xl p-3">
              <p className="text-[10px] text-white/35 uppercase tracking-widest mb-1">🎵 Soundtrack</p>
              <p className="text-xs font-medium text-white/80">{data.genre}</p>
            </div>
            <div className="bg-white/[0.06] rounded-xl p-3">
              <p className="text-[10px] text-white/35 uppercase tracking-widest mb-1">🎯 Activity</p>
              <p className="text-xs font-medium text-white/80">{data.activity}</p>
            </div>
          </div>

          {/* Moment quote */}
          <div className="bg-white/[0.06] rounded-xl px-3 py-2.5">
            <p className="text-[10px] text-white/35 uppercase tracking-widest mb-1">✨ Moment</p>
            <p className="text-sm text-white/60 italic">"{data.quote}"</p>
          </div>

          {/* Regenerate */}
          <div className="flex justify-end">
            <button
              onClick={handleRegenerate}
              className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors"
            >
              <RefreshCw className="h-3 w-3" />
              Regenerate
            </button>
          </div>
        </div>
      )}

      {/* Parse error */}
      {hasGenerated && !isLoading && !data && !error && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-white/40">Couldn't parse response. Try again.</p>
          <button
            onClick={() => void handleGenerate()}
            className="text-xs text-white/40 hover:text-white/70 transition-colors ml-3"
          >
            Retry
          </button>
        </div>
      )}

      {/* API error */}
      {error && !isLoading && (
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-red-400/80">
            {error.includes('429') || error.includes('quota')
              ? 'AI quota reached. Try again in a minute.'
              : error}
          </p>
          <button
            onClick={() => void handleGenerate()}
            className="text-xs text-white/40 hover:text-white/70 transition-colors shrink-0"
          >
            Retry
          </button>
        </div>
      )}
    </AICard>
  )
}
