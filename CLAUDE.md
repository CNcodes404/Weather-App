# SkyMind — Weather App

## What This Is
A glassmorphism weather app with AI-powered features built with React + TypeScript + Vite.
Users get real-time weather data enhanced by Google Gemini AI for outfit recommendations,
mood boards, activity impact scores, weather narration, and conversational weather chat.

## Development Plan
`DEVELOPMENT_PLAN.md` in the project root contains the full 18-step build plan.
**Always read it before starting any work.** Track which step is current and follow
the Checkpoint at the end of each step before moving to the next.

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
| Icons | Lucide React | Consistent icon library throughout |
| Dates | date-fns | All date formatting |
| Weather API | OpenWeatherMap (free tier) | src/services/weather.service.ts |
| AI API | Google Gemini (gemini-2.0-flash, free) | src/services/gemini.service.ts |

---

## Project Structure

```
src/
├── types/
│   ├── weather.ts        # OWM API response types
│   ├── ai.ts             # Gemini request/response types
│   └── app.ts            # Units, Location, WeatherTheme, ChatMessage
├── constants/
│   ├── weather.ts        # OWM condition code → label/icon/color map
│   └── prompts.ts        # ALL Gemini prompt builder functions (pure functions)
├── config/
│   └── api.ts            # API base URLs, OWM endpoints
├── lib/
│   ├── utils.ts          # shadcn cn() utility
│   ├── weather.utils.ts  # formatWind, conditionToLabel, etc.
│   └── time.utils.ts     # getTimeOfDay, formatSunrise, etc.
├── services/
│   ├── weather.service.ts  # All OWM fetch functions
│   └── gemini.service.ts   # generateText() and generateStream()
├── store/
│   └── weatherStore.ts   # Zustand: location, units, tone, chatHistory
├── hooks/
│   ├── useWeather.ts       # TanStack Query — current weather
│   ├── useForecast.ts      # TanStack Query — 5-day/3-hour forecast
│   ├── useAirQuality.ts    # TanStack Query — AQI
│   ├── useGeolocation.ts   # Browser geolocation, falls back to London
│   ├── useUnits.ts         # °C/°F toggle with localStorage
│   ├── useTheme.ts         # WeatherTheme derived from condition + time
│   └── useGemini.ts        # Wraps gemini.service with loading/error/stream state
├── components/
│   ├── ui/               # shadcn/ui auto-generated — do not hand-edit
│   ├── layout/
│   │   ├── AppBackground.tsx   # Full-screen animated gradient
│   │   ├── AppShell.tsx        # Responsive grid layout
│   │   └── MobileNav.tsx       # Bottom nav bar (≤768px)
│   ├── weather/
│   │   ├── CurrentConditions.tsx
│   │   ├── WeatherStats.tsx
│   │   ├── WeatherIcon.tsx
│   │   ├── HourlyChart.tsx
│   │   ├── DailyForecast.tsx
│   │   ├── ForecastDay.tsx
│   │   ├── SunriseSunset.tsx
│   │   ├── AQIGauge.tsx
│   │   └── WeatherMap.tsx
│   ├── search/
│   │   └── LocationSearch.tsx
│   ├── ai/
│   │   ├── AICard.tsx          # Glassmorphism wrapper for all AI features
│   │   ├── StreamingText.tsx   # Animated token-by-token text renderer
│   │   ├── OutfitOracle.tsx
│   │   ├── MoodBoard.tsx
│   │   ├── ImpactScore.tsx
│   │   ├── WeatherNarrator.tsx
│   │   └── AskTheSky.tsx
│   └── common/
│       ├── GlassCard.tsx       # Base card — used everywhere
│       ├── LoadingSkeleton.tsx
│       ├── ErrorCard.tsx
│       └── UnitToggle.tsx
└── pages/
    └── WeatherDashboard.tsx    # Assembles all sections
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
- Always render a skeleton when `isLoading` is true
- Always render `ErrorCard` when `isError` is true
- Never render data without first checking it exists

### Styling
- Tailwind utility classes only — no inline `style={{}}` except for dynamic values (e.g., hex colors from Gemini palette)
- `GlassCard`: `backdrop-blur-md bg-white/10 border border-white/20 shadow-xl rounded-2xl`
- Responsive order: mobile-first → `sm:` → `md:` → `lg:`
- Dark/light text determined by `WeatherTheme.textColor` from `useTheme()`

### AI features
- Every Gemini JSON response is wrapped in `try/catch` — never crash on parse failure
- Show a silent fallback UI if JSON parsing fails (not an error message to the user)
- Streaming text is rendered via `StreamingText` component — never build a custom one
- Rate limit protection: disable AI buttons while a request is in flight

### Git
- Commit after each completed step from DEVELOPMENT_PLAN.md
- Commit message format: `step N: short description` (e.g., `step 4: current conditions hero card`)
- Never commit `.env`

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

Persisted to `localStorage` via Zustand `persist` middleware.

---

## Dynamic Background Themes

`useTheme()` returns a `WeatherTheme` based on OWM condition code + current hour.
`AppBackground` animates between themes using Framer Motion (2s transition).

| Condition + Time | Gradient |
|-----------------|----------|
| Clear, 5–8am | `#F97316 → #FB923C → #7DD3FC` |
| Clear, 8am–5pm | `#38BDF8 → #0EA5E9 → #1D4ED8` |
| Clear, 5–8pm | `#F97316 → #EC4899 → #7C3AED` |
| Clear, night | `#0F172A → #1E1B4B → #0F172A` |
| Clouds | `#94A3B8 → #64748B → #475569` |
| Rain/Drizzle | `#1E3A5F → #2D5986 → #1A2F4A` |
| Thunderstorm | `#1A1A2E → #2D1B69 → #0F0F23` |
| Snow | `#EFF6FF → #BFDBFE → #93C5FD` |
| Fog/Mist | `#D1D5DB → #9CA3AF → #6B7280` |

---

## Skill Commands Available

| Command | Purpose |
|---------|---------|
| `/build-step` | Implement the next pending step from DEVELOPMENT_PLAN.md |
| `/add-feature` | Add a specific AI feature (pass feature name as argument) |
| `/review-feature` | Review a component for quality issues (pass file path as argument) |
