import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

export async function generateText(prompt: string): Promise<string> {
  const result = await model.generateContent(prompt)
  return result.response.text()
}

export async function generateStream(
  prompt: string,
  onChunk: (text: string) => void,
): Promise<void> {
  const result = await model.generateContentStream(prompt)
  for await (const chunk of result.stream) {
    const text = chunk.text()
    if (text) onChunk(text)
  }
}
