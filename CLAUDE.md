# SkyMind — Weather App

## What This Is
A glassmorphism weather app with AI-powered features built with React + TypeScript + Vite.
Users get real-time weather data enhanced by Google Gemini AI for outfit recommendations,
mood boards, activity impact scores, weather narration, and conversational weather chat.

## Development Plan
`DEVELOPMENT_PLAN.md` in the project root contains the full build plan with progress tracker.
**Always read it before starting any work.** All steps (0–18) are complete.

## Current Progress
| Steps | Status |
|-------|--------|
| 0–12a | ✅ Complete (scaffold → types → services → UI → weather features → skeletons → mobile → AI infra → visual polish) |
| 14–17 | ✅ Complete — Mood Board, Impact Score, Weather Narrator + Speak, Ask the Sky |
| 18 | ✅ Complete — ErrorBoundary, final polish & animations |

---

## Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Framework | React 18 + TypeScript | Strict mode on |
| Build tool | Vite | Dev server at localhost:5173 |
| Styling | Tailwind CSS v3 | Utility-first, no custom CSS unless necessary |
| Components | shadcn/ui (New York, Neutral) | Components live in src/components/ui/ |
| Animations | Framer Motion | Used for gradients, entrances, icon floats |
| UI State | Zustand | Single store at src/store/weatherStore.ts |
| Server State | TanStack Query v5 | All API data — never useState for fetched data |
| Charts | Recharts | Hourly temperature + rain chart |
| Maps | Leaflet + react-leaflet | Weather radar tile overlay |
| Icons | Lucide React | Condition-specific colored icons throughout |
| Dates | date-fns | All date formatting |
| Weather API | OpenWeatherMap (free tier) | src/services/weather.service.ts |
| AI API | Google Gemini (gemini-2.0-flash, free) | src/services/gemini.service.ts |

---

## Project Structure

```
src/
├── types/
│   ├── weather.ts        # OWM API response types + WeatherCondition union
│   ├── ai.ts             # MoodBoardData, ImpactScoreData, ImpactItem
│   └── app.ts            # Units, Location, WeatherTheme (+ glowColor?), ChatMessage
├── constants/
│   ├── weather.ts        # getWeatherTheme(condition, timeOfDay) → WeatherTheme
│   └── prompts.ts        # ALL Gemini prompt builder functions (pure functions)
├── config/
│   └── api.ts            # OWM_BASE_URL, OWM_KEY, ENDPOINTS
├── lib/
│   ├── utils.ts          # shadcn cn() utility
│   ├── weather.utils.ts  # getConditionFromCode, getWindDirection, formatVisibility, getAQILabel, aggregateDailyForecasts
│   └── time.utils.ts     # getTimeOfDay, getSeason, formatSunTime, formatHour, formatDayName, isToday, isDaytime
├── services/
│   ├── weather.service.ts  # getCurrentWeather, getForecast, getAirQuality, searchCities, reverseGeocode
│   └── gemini.service.ts   # generateText(prompt), generateStream(prompt, onChunk)
├── store/
│   └── weatherStore.ts   # Zustand: location, units, narratorTone, chatHistory
├── hooks/
│   ├── useWeather.ts       # TanStack Query — current weather (stale 5 min)
│   ├── useForecast.ts      # TanStack Query — 5-day/3-hour forecast (stale 10 min)
│   ├── useAirQuality.ts    # TanStack Query — AQI (stale 5 min)
│   ├── useGeolocation.ts   # Browser geolocation → reverseGeocode, falls back to London
│   ├── useUnits.ts         # Thin wrapper: units + toggleUnits from Zustand
│   ├── useTheme.ts         # WeatherTheme derived from condition + current hour
│   └── useGemini.ts        # output, isLoading, error, generate(), stream(), reset()
├── components/
│   ├── ui/               # shadcn/ui auto-generated — do NOT hand-edit
│   ├── layout/
│   │   ├── AppBackground.tsx   # Fixed full-screen 3-layer animated gradient
│   │   ├── AppShell.tsx        # Container: max-w-4xl, pb-24 md:pb-6 for mobile nav
│   │   └── MobileNav.tsx       # Fixed bottom bar (md:hidden) — 4 scroll-anchor tabs
│   ├── weather/
│   │   ├── CurrentConditions.tsx  # Hero card: temp + glow, H/L arrows, icon ring
│   │   ├── WeatherStats.tsx       # 6-tile grid with color-coded icons + accent bottom line
│   │   ├── WeatherIcon.tsx        # Condition-specific colored icons with drop-shadow glow
│   │   ├── HourlyChart.tsx        # Recharts ComposedChart: Line (temp) + Bar (rain%)
│   │   ├── DailyForecast.tsx      # Horizontal scroll strip of ForecastDay cards
│   │   ├── ForecastDay.tsx        # Single day: name, icon, rain%, H/L
│   │   ├── SunriseSunset.tsx      # SVG arc with animated amber sun dot
│   │   ├── AQIGauge.tsx           # Self-fetching AQI: 5 glowing segments, color-coded label
│   │   └── WeatherMap.tsx         # Leaflet + OWM tile overlay, 4-layer toggle
│   ├── search/
│   │   └── LocationSearch.tsx     # Pill-style search, spinner, icon-badge dropdown
│   ├── ai/
│   │   ├── AICard.tsx             # Glassmorphism wrapper + shimmer border while loading
│   │   ├── StreamingText.tsx      # Animated text + blinking cursor (disappears when done)
│   │   ├── MoodBoard.tsx          # AI: weather mood palette + genre + quote (JSON)
│   │   ├── ImpactScore.tsx        # AI: activity impact grid with score bars (JSON)
│   │   ├── WeatherNarrator.tsx    # AI: streaming briefing with 4 tones + TTS speak
│   │   └── AskTheSky.tsx          # AI: multi-turn chat with weather context
│   └── common/
│       ├── GlassCard.tsx          # Base card — used everywhere (see Styling section)
│       ├── LoadingSkeleton.tsx    # HeroSkeleton, StatsSkeleton, ChartSkeleton, ForecastSkeleton, MapSkeleton, SunriseAQISkeleton
│       ├── ErrorCard.tsx          # Warning icon + message + retry button
│       ├── ErrorBoundary.tsx      # React class component — catches runtime crashes
│       └── UnitToggle.tsx         # °C / °F pill toggle
└── pages/
    └── WeatherDashboard.tsx       # Assembles all sections with per-section loading/error states
```

---

## Environment Variables

Stored in `.env` at project root — **never commit this file**.
`.env.example` is committed with empty values.

```
VITE_OWM_API_KEY=       # openweathermap.org → My API Keys
VITE_GEMINI_API_KEY=    # aistudio.google.com → Get API Key
```

Access in code: `import.meta.env.VITE_OWM_API_KEY`

---

## Running the Project

```bash
npm run dev       # Start dev server → localhost:5173
npm run build     # TypeScript check + production build
npm run preview   # Preview production build locally
```

---

## OpenWeatherMap Endpoints

| Function | Endpoint | Stale time |
|----------|---------|-----------|
| Current weather | `/data/2.5/weather` | 5 min |
| Forecast (3h slots) | `/data/2.5/forecast` | 10 min |
| Air quality | `/data/2.5/air_pollution` | 5 min |
| City search | `/geo/1.0/direct?limit=5` | 1 hr |
| Reverse geocode | `/geo/1.0/reverse?limit=1` | 1 hr |
| Map tiles | `tile.openweathermap.org/map/{layer}/{z}/{x}/{y}.png` | — |

React Query key pattern: `['weather', lat, lon, units]`

---

## Gemini API

Model: `gemini-2.0-flash`
SDK: `@google/generative-ai`
Called directly from the browser — no server proxy needed.

Two service functions used by all AI features:
- `generateText(prompt)` → `Promise<string>` — for JSON-output features
- `generateStream(prompt, onChunk)` → `Promise<void>` — for streaming text features

All AI calls go through `useGemini` hook — never call the service directly from a component.
All prompt templates are pure functions in `src/constants/prompts.ts`.

---

## Coding Conventions

### TypeScript
- Zero `any` types — if you don't know the type, define it in `src/types/`
- All component props have explicit interfaces defined above the component
- All API responses are mapped to internal types immediately in the service layer
- Use `unknown` + type guards when parsing Gemini JSON responses

### Components
- Every visible card uses `GlassCard` as its wrapper
- AI feature components use `AICard` as their wrapper
- Components only receive typed props — no implicit `any` from context
- Keep components focused — if a component exceeds ~150 lines, split it

### State
- UI preferences (units, tone, location) → Zustand store
- API data (weather, forecast, AQI) → TanStack Query
- Local UI state (dropdown open, input value) → `useState` in the component
- Never duplicate server state into Zustand

### Data fetching
- Always destructure `{ data, isLoading, isError }` from useQuery hooks
- Always render the matching skeleton from `LoadingSkeleton.tsx` when `isLoading` is true
- Always render `ErrorCard` when `isError` is true
- Never render data without first checking it exists

### Styling
- Tailwind utility classes only — no inline `style={{}}` except for dynamic values (e.g., hex colors from Gemini palette, textShadow)
- **GlassCard** current styles: `backdrop-blur-md bg-black/[0.20] border border-white/[0.15] shadow-lg shadow-black/30 rounded-2xl` + absolute `h-px` top-edge highlight inside
- **AICard** adds a shimmer sweep animation over GlassCard while `isLoading`
- Responsive order: mobile-first → `sm:` → `md:` → `lg:`
- `scrollbar-hide` class (defined in `index.css`) for horizontal scroll containers

### WeatherIcon colors
Icons are condition-specific, not uniform white:
- `clear` → `text-amber-300` with amber drop-shadow glow
- `rain` → `text-blue-400` with blue glow
- `thunderstorm` → `text-violet-400` with violet glow
- `snow` → `text-blue-100` with ice-blue glow
- `clouds` → `text-slate-300`
- `drizzle` → `text-sky-400`
- `tornado` → `text-red-400` with red glow
- fog/mist/haze → `text-slate-400` / `text-amber-200`

### AI features
- Every Gemini JSON response is wrapped in `try/catch` — never crash on parse failure
- Show a silent fallback UI if JSON parsing fails (not an error message to the user)
- Streaming text is rendered via `StreamingText` component — never build a custom one
- Rate limit protection: disable AI buttons while a request is in flight

### Git
- Commit after each completed step from DEVELOPMENT_PLAN.md
- Commit message format: `step N: short description`
- Never commit `.env`
- **No push to GitHub unless explicitly instructed by the user**

### What NOT to do
- No `console.log` left in committed code
- No TODO comments — finish the task or create a plan item
- No `// eslint-disable` — fix the actual issue
- No hardcoded city names, coordinates, or API URLs outside of `config/api.ts`
- No direct calls to `fetch()` in components — use services + hooks
- No Gemini calls outside of `useGemini` hook

---

## Zustand Store Shape

```typescript
// src/store/weatherStore.ts
{
  location: { lat: number; lon: number; name: string; country: string } | null
  units: 'metric' | 'imperial'
  narratorTone: 'newsanchor' | 'poetic' | 'sarcastic' | 'neighbor'
  chatHistory: ChatMessage[]

  setLocation: (loc: Location) => void
  toggleUnits: () => void
  setNarratorTone: (tone: NarratorTone) => void
  appendChatMessage: (msg: ChatMessage) => void
  clearChat: () => void
}
```

Persisted to `localStorage` via Zustand `persist` middleware, key: `'skymind-weather-store'`.

---

## Dynamic Background Themes

`useTheme()` returns a `WeatherTheme` based on OWM condition + current hour.
`AppBackground` renders **3 stacked layers** inside a Framer Motion crossfade (1.5s):
1. **Base gradient** — `linear-gradient(160deg, from 0%, via 50%, to 100%)`
2. **Radial glow** — `radial-gradient(ellipse at 78% 8%, glowColor 0%, transparent 55%)` — simulates sun/moon
3. **Bottom vignette** — `linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.25) 100%)`

`WeatherTheme` shape:
```typescript
{
  gradientFrom: string   // top-left color
  gradientVia: string    // midpoint color
  gradientTo: string     // bottom-right color
  glowColor?: string     // optional radial light source (rgba)
  glassOpacity: number
  textColor: 'light' | 'dark'
  accentColor: string
}
```

| Condition + Time | From → Via → To |
|-----------------|-----------------|
| Clear, dawn (5–8am) | `#FCD34D → #F97316 → #7DD3FC` |
| Clear, morning (8–12pm) | `#FCD34D → #38BDF8 → #0369A1` |
| Clear, midday (12–14pm) | `#38BDF8 → #0EA5E9 → #1E40AF` |
| Clear, afternoon (14–17pm) | `#FCD34D → #60A5FA → #1D4ED8` |
| Clear, evening (17–20pm) | `#F97316 → #EC4899 → #7C3AED` |
| Clear, night (20pm–5am) | `#0F172A → #1E1B4B → #030712` |
| Clouds | `#CBD5E1 → #475569 → #1E293B` |
| Rain / Drizzle | `#0C4A6E → #1E3A8A → #0F172A` |
| Thunderstorm | `#1A1A2E → #2D1B69 → #0F0F23` |
| Snow | `#BAE6FD → #93C5FD → #3B82F6` |
| Fog / Mist / Haze | `#E2E8F0 → #94A3B8 → #475569` |

---

## Skill Commands Available

| Command | Purpose |
|---------|---------|
| `/build-step` | Implement the next pending step from DEVELOPMENT_PLAN.md |
| `/add-feature` | Add a specific AI feature (pass feature name as argument) |
| `/review-feature` | Review a component for quality issues (pass file path as argument) |
