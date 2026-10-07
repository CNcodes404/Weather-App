import { useState, useEffect, useRef, KeyboardEvent } from 'react'
import { MessageSquare, Send, Trash2, Loader2 } from 'lucide-react'
import { AICard } from '@/components/ai/AICard'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useWeatherStore } from '@/store/weatherStore'
import { buildChatSystemPrompt } from '@/constants/prompts'
import { generateChat } from '@/services/gemini.service'
import type { ServiceChatMessage } from '@/services/gemini.service'
import type { CurrentWeather } from '@/types/weather'
import type { Units, ChatMessage } from '@/types/app'

interface AskTheSkyProps {
  weather: CurrentWeather
  units: Units
}

const SUGGESTIONS = [
  'Should I carry an umbrella?',
  'Best time to go for a run?',
  'Is it safe to drive tonight?',
]

export function AskTheSky({ weather, units }: AskTheSkyProps) {
  const chatHistory = useWeatherStore((s) => s.chatHistory)
  const appendChatMessage = useWeatherStore((s) => s.appendChatMessage)
  const clearChat = useWeatherStore((s) => s.clearChat)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatHistory, isLoading])

  async function handleSend(text?: string) {
    const message = (text ?? input).trim()
    if (!message || isLoading) return
    setInput('')

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      text: message,
      timestamp: Date.now(),
    }
    appendChatMessage(userMsg)
    setIsLoading(true)

    try {
      const systemPrompt = buildChatSystemPrompt(weather, units)
      const history: ServiceChatMessage[] = [
        ...chatHistory.map((m) => ({
          role: m.role === 'user' ? 'user' as const : 'assistant' as const,
          content: m.text,
        })),
        { role: 'user', content: message },
      ]
      const response = await generateChat(systemPrompt, history)
      appendChatMessage({
        id: crypto.randomUUID(),
        role: 'model',
        text: response,
        timestamp: Date.now(),
      })
    } catch {
      appendChatMessage({
        id: crypto.randomUUID(),
        role: 'model',
        text: "Sorry, I couldn't connect. Please try again.",
        timestamp: Date.now(),
      })
    } finally {
      setIsLoading(false)
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void handleSend()
    }
  }

  return (
    <AICard title="Ask the Sky" icon={MessageSquare}>
      {/* Message history */}
      {chatHistory.length === 0 && !isLoading ? (
        <div className="space-y-2 mb-4">
          <p className="text-xs text-white/35 text-center mb-3">Ask me anything about today's weather</p>
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => void handleSend(s)}
              className="w-full text-left text-xs text-white/55 bg-white/[0.06] hover:bg-white/10 border border-white/10 rounded-xl px-3 py-2 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      ) : (
        <ScrollArea className="h-64 mb-3 pr-1">
          <div className="space-y-3">
            {chatHistory.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[82%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-white/20 text-white rounded-br-none'
                      : 'bg-white/[0.08] text-white/85 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Loading dots */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/[0.08] rounded-2xl rounded-bl-none px-4 py-3">
                  <Loader2 className="h-3.5 w-3.5 text-white/40 animate-spin" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </ScrollArea>
      )}

      {/* Input row */}
      <div className="flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about the weather..."
          disabled={isLoading}
          className="flex-1 bg-white/[0.08] border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/25 transition-colors disabled:opacity-50"
        />
        <button
          onClick={() => void handleSend()}
          disabled={!input.trim() || isLoading}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white/60 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Send className="h-4 w-4" />
        </button>
        {chatHistory.length > 0 && (
          <button
            onClick={clearChat}
            className="p-2 rounded-xl bg-white/[0.06] hover:bg-white/10 border border-white/10 text-white/30 hover:text-white/60 transition-all"
            title="Clear chat"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </AICard>
  )
}
