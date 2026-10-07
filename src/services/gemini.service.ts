import Groq from 'groq-sdk'

// Supports both Groq (console.groq.com) and OpenRouter (openrouter.ai)
// Set whichever key you have in .env — the other can be left blank.
// OpenRouter free models: meta-llama/llama-3.1-8b-instruct:free, google/gemma-2-9b-it:free

const GROQ_KEY = import.meta.env.VITE_GROQ_API_KEY as string | undefined
const OPENROUTER_KEY = import.meta.env.VITE_OPENROUTER_API_KEY as string | undefined

function buildClient() {
  if (GROQ_KEY) {
    return new Groq({ apiKey: GROQ_KEY, dangerouslyAllowBrowser: true })
  }
  if (OPENROUTER_KEY) {
    return new Groq({
      apiKey: OPENROUTER_KEY,
      baseURL: 'https://openrouter.ai/api/v1',
      dangerouslyAllowBrowser: true,
    })
  }
  throw new Error('No AI API key found. Add VITE_GROQ_API_KEY or VITE_OPENROUTER_API_KEY to .env')
}

const client = buildClient()
const MODEL = GROQ_KEY ? 'openai/gpt-oss-120b' :'meta-llama/llama-3.1-8b-instruct:free'

export async function generateText(prompt: string): Promise<string> {
  const completion = await client.chat.completions.create({
    model: MODEL,
    messages: [{ role: 'user', content: prompt }],
  })
  return completion.choices[0]?.message?.content ?? ''
}

export interface ServiceChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export async function generateChat(
  systemPrompt: string,
  messages: ServiceChatMessage[],
): Promise<string> {
  const completion = await client.chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages,
    ],
  })
  return completion.choices[0]?.message?.content ?? ''
}

export async function generateStream(
  prompt: string,
  onChunk: (text: string) => void,
): Promise<void> {
  const stream = await client.chat.completions.create({
    model: MODEL,
    messages: [{ role: 'user', content: prompt }],
    stream: true,
  })
  for await (const chunk of stream) {
    const text = chunk.choices[0]?.delta?.content ?? ''
    if (text) onChunk(text)
  }
}
