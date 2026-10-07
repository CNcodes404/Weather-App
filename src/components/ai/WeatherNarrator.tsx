import { useEffect, useState } from 'react'
import { Mic2, Volume2, VolumeX } from 'lucide-react'
import { AICard } from '@/components/ai/AICard'
import { StreamingText } from '@/components/ai/StreamingText'
import { useGemini } from '@/hooks/useGemini'
import { useWeatherStore } from '@/store/weatherStore'
import { buildNarratorPrompt } from '@/constants/prompts'
import type { CurrentWeather } from '@/types/weather'
import type { Units, NarratorTone } from '@/types/app'

interface WeatherNarratorProps {
  weather: CurrentWeather
  units: Units
}

const TONES: { key: NarratorTone; label: string; emoji: string }[] = [
  { key: 'neighbor',   label: 'Neighbor',    emoji: '🏠' },
  { key: 'poetic',     label: 'Poetic',      emoji: '✨' },
  { key: 'newsanchor', label: 'News Anchor', emoji: '📺' },
  { key: 'sarcastic',  label: 'Sarcastic',   emoji: '😏' },
]

const VOICE_SETTINGS: Record<NarratorTone, { rate: number; pitch: number }> = {
  neighbor:   { rate: 1.0,  pitch: 1.0  },
  poetic:     { rate: 0.85, pitch: 1.1  },
  newsanchor: { rate: 1.05, pitch: 0.85 },
  sarcastic:  { rate: 1.1,  pitch: 1.0  },
}

export function WeatherNarrator({ weather, units }: WeatherNarratorProps) {
  const narratorTone = useWeatherStore((s) => s.narratorTone)
  const setNarratorTone = useWeatherStore((s) => s.setNarratorTone)
  const { output, isLoading, error, stream, reset } = useGemini()
  const [isSpeaking, setIsSpeaking] = useState(false)

  useEffect(() => {
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
    reset()
    void stream(buildNarratorPrompt(weather, narratorTone, units))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [narratorTone, weather.cityName, units])

  // Stop speech when component unmounts
  useEffect(() => () => { window.speechSynthesis.cancel() }, [])

  function handleToneChange(tone: NarratorTone) {
    if (tone === narratorTone) return
    setNarratorTone(tone)
  }

  function handleSpeak() {
    if (!output) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(output)
    const { rate, pitch } = VOICE_SETTINGS[narratorTone]
    utterance.rate = rate
    utterance.pitch = pitch
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)
    window.speechSynthesis.speak(utterance)
    setIsSpeaking(true)
  }

  function handleStop() {
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
  }

  return (
    <AICard title="Weather Narrator" icon={Mic2} isLoading={isLoading}>
      {/* Tone selector */}
      <div className="flex flex-wrap gap-2 mb-4">
        {TONES.map(({ key, label, emoji }) => (
          <button
            key={key}
            onClick={() => handleToneChange(key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              narratorTone === key
                ? 'bg-white/20 border-white/30 text-white'
                : 'bg-white/[0.06] border-white/10 text-white/50 hover:bg-white/10 hover:text-white/70'
            }`}
          >
            <span>{emoji}</span>
            {label}
          </button>
        ))}
      </div>

      {/* Streaming briefing */}
      {(output || isLoading) && (
        <StreamingText
          text={output}
          isDone={!isLoading}
          className="text-sm text-white/85 leading-relaxed"
        />
      )}

      {/* Speak / Stop button */}
      {output && !isLoading && (
        <div className="flex justify-end mt-3">
          <button
            onClick={isSpeaking ? handleStop : handleSpeak}
            className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors"
          >
            {isSpeaking
              ? <><VolumeX className="h-3 w-3" /> Stop</>
              : <><Volume2 className="h-3 w-3" /> Speak</>
            }
          </button>
        </div>
      )}

      {/* Error */}
      {error && !isLoading && (
        <p className="text-xs text-red-400/80 mt-2">
          {error.includes('429') || error.includes('quota')
            ? 'AI quota reached. Try again in a minute.'
            : error}
        </p>
      )}
    </AICard>
  )
}
