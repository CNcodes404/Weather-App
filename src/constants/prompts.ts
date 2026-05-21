import type { CurrentWeather, HourlyForecast } from '@/types/weather'
import type { Units, NarratorTone, Season, TimeOfDay } from '@/types/app'

export function buildOutfitPrompt(
  weather: CurrentWeather,
  units: Units,
  season: Season,
  timeOfDay: TimeOfDay,
): string {
  const t = units === 'metric' ? '°C' : '°F'
  const s = units === 'metric' ? 'km/h' : 'mph'
  return `You are a stylish, fun personal stylist who understands weather practicality.
Recommend a complete outfit: top, bottom, shoes, outerwear, and accessories.
Be specific about materials and colors. Confident, enthusiastic tone. Under 100 words.
Write as flowing, enthusiastic prose — no bullet lists.

Weather: ${Math.round(weather.temp)}${t}, ${weather.description}, feels like ${Math.round(weather.feelsLike)}${t}, humidity ${weather.humidity}%, wind ${Math.round(weather.windSpeed)}${s}. Time: ${timeOfDay}. Season: ${season}.`
}

export function buildMoodBoardPrompt(weather: CurrentWeather, timeOfDay: TimeOfDay): string {
  return `Respond ONLY with valid JSON, no extra text before or after:
{
  "mood": "single evocative word",
  "palette": ["#hex", "#hex", "#hex", "#hex"],
  "genre": "specific music genre (e.g. Nordic ambient folk, not just folk)",
  "activity": "one ideal activity for this weather",
  "quote": "atmospheric sentence, under 10 words"
}

Weather: ${Math.round(weather.temp)}°C, ${weather.description}, ${weather.humidity}% humidity, ${Math.round(weather.windSpeed)} km/h wind. Time: ${timeOfDay}. Month: ${new Date().toLocaleString('en', { month: 'long' })}.`
}

export function buildImpactScorePrompt(
  weather: CurrentWeather,
  hourly: HourlyForecast[],
): string {
  const nightLow = hourly.length > 0
    ? Math.round(Math.min(...hourly.map((h) => h.temp)))
    : Math.round(weather.tempMin)
  const maxPop = hourly.length > 0
    ? Math.round(Math.max(...hourly.map((h) => h.pop)) * 100)
    : 0

  return `Score how today's weather affects each activity on 1–10 (10=perfect, 1=terrible/dangerous).
Respond ONLY with valid JSON:
{
  "commute":        { "score": N, "reason": "one short sentence" },
  "outdoor_dining": { "score": N, "reason": "..." },
  "exercise":       { "score": N, "reason": "..." },
  "sleep":          { "score": N, "reason": "..." },
  "mood":           { "score": N, "reason": "..." }
}

${Math.round(weather.temp)}°C, ${weather.description}, humidity ${weather.humidity}%, wind ${Math.round(weather.windSpeed)} km/h, overnight low ${nightLow}°C, rain probability ${maxPop}%.`
}

export function buildNarratorPrompt(
  weather: CurrentWeather,
  tone: NarratorTone,
  units: Units,
): string {
  const t = units === 'metric' ? '°C' : '°F'
  const s = units === 'metric' ? 'km/h' : 'mph'

  const personas: Record<NarratorTone, string> = {
    newsanchor:
      'You are an authoritative TV meteorologist. Use proper weather terminology but stay accessible. Formal tone.',
    poetic:
      'You are a lyrical weather poet. Use metaphors, imagery, and find beauty or melancholy in the conditions.',
    sarcastic:
      'You are a dry, witty weather commentator. Playfully complain about or over-celebrate the forecast.',
    neighbor:
      'You are a warm, casual neighbor texting a friend about the weather. Keep it conversational and friendly.',
  }

  return `${personas[tone]}
Write a 3–4 sentence weather briefing. Present tense. No emojis unless tone is neighbor. No markdown.

${weather.cityName}, ${weather.country}: ${Math.round(weather.temp)}${t}, ${weather.description}, feels like ${Math.round(weather.feelsLike)}${t}, humidity ${weather.humidity}%, wind ${Math.round(weather.windSpeed)}${s}. High ${Math.round(weather.tempMax)}${t}, low ${Math.round(weather.tempMin)}${t}.`
}

export function buildChatSystemPrompt(weather: CurrentWeather, units: Units): string {
  const t = units === 'metric' ? '°C' : '°F'
  return `You are "Sky", a friendly and knowledgeable weather assistant.

Current conditions in ${weather.cityName}, ${weather.country}: ${Math.round(weather.temp)}${t}, ${weather.description}, humidity ${weather.humidity}%, wind ${Math.round(weather.windSpeed)} ${units === 'metric' ? 'km/h' : 'mph'}.

Answer weather-related questions helpfully and concisely (under 80 words unless more detail is genuinely needed). For safety questions (driving, storms, outdoor activities), err on the side of caution. Politely decline non-weather topics.`
}

export function buildDayPlannerPrompt(
  weather: CurrentWeather,
  hourly: HourlyForecast[],
  userPlans: string,
  units: Units,
): string {
  const t = units === 'metric' ? '°C' : '°F'
  const slots = hourly
    .slice(0, 8)
    .map((h) => `${new Date(h.dt * 1000).getUTCHours()}:00 ${Math.round(h.temp)}${t} ${h.description} rain:${Math.round(h.pop * 100)}%`)
    .join(' | ')

  return `You are a practical, friendly assistant helping someone plan their day around the weather.
Be specific about timing. Reference exact hours. Keep it under 120 words.
Write a brief paragraph then 2–3 bullet points with specific suggestions.

Hourly forecast for ${weather.cityName}: ${slots}

User's plans: "${userPlans}"

Give specific advice on timing adjustments, what to bring, and any warnings.`
}
