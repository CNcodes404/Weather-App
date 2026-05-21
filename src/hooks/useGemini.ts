import { useState, useCallback } from 'react'
import { generateText, generateStream } from '@/services/gemini.service'

export function useGemini() {
  const [output, setOutput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generate = useCallback(async (prompt: string): Promise<string | null> => {
    setIsLoading(true)
    setError(null)
    setOutput('')
    try {
      const result = await generateText(prompt)
      setOutput(result)
      return result
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'AI generation failed'
      setError(msg)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const stream = useCallback(async (prompt: string): Promise<void> => {
    setIsLoading(true)
    setError(null)
    setOutput('')
    try {
      await generateStream(prompt, (chunk) => {
        setOutput((prev) => prev + chunk)
      })
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'AI streaming failed'
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setOutput('')
    setError(null)
    setIsLoading(false)
  }, [])

  return { output, isLoading, error, generate, stream, reset }
}
