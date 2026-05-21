# SkyMind — Weather App Development Plan

> Build order: skeleton first, one feature at a time. Each step has a clear deliverable and a checkpoint to verify before moving on.

---

## Tech Stack (Final)

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS + shadcn/ui (New York style) |
| Animations | Framer Motion |
| UI State | Zustand + localStorage persistence |
| Server State | TanStack Query v5 |
| Charts | Recharts |
| Maps | Leaflet + react-leaflet |
| Icons | Lucide React |
| Weather Data | OpenWeatherMap API (free) |
| AI | Google Gemini API — `gemini-2.0-flash` (free) |

---

## API Keys Needed

| Key | Where to get | .env variable |
|-----|-------------|---------------|
| OpenWeatherMap | openweathermap.org → My API Keys | `VITE_OWM_API_KEY` |
| Google Gemini | aistudio.google.com → Get API Key | `VITE_GEMINI_API_KEY` |

---

## Progress Tracker

| Step | Description | Status |
|------|-------------|--------|
| 0 | Project Scaffold | ✅ Done |
| 1 | Project Structure & Types | ✅ Done |
| 2 | Weather Service & Data Hooks | ✅ Done |
| 3 | App Shell & Dynamic Background | ✅ Done |
| 4 | Current Conditions Hero Card | ✅ Done |
| 5 | Weather Stats Bar | ✅ Done |
| 6 | 7-Day Forecast Strip | ✅ Done |
| 7 | Hourly Temperature Chart | ✅ Done |
| 8 | Sunrise / Sunset & AQI | ✅ Done |
| 9 | Weather Map | ✅ Done |
| 10 | Skeleton States & Error Handling | ✅ Done |
| 11 | Responsive Layout & Mobile | ✅ Done |
| 12 | Gemini Service & AI Infrastructure | ✅ Done |
| 12a | UI Visual Polish Sprint | ✅ Done |
| 13 | AI Feature: Outfit Oracle | ⬜ Next |
| 14 | AI Feature: Mood Board | ⬜ |
| 15 | AI Feature: Weather Impact Score | ⬜ |
| 16 | AI Feature: Weather Narrator | ⬜ |
| 17 | AI Feature: Ask the Sky (Chat) | ⬜ |
| 18 | Final Polish Pass | ⬜ |

---

## Step 0 — Project Scaffold

**Goal:** A running blank Vite app with all dependencies installed and Tailwind working.

### Actions
1. Run inside the project root:
   ```bash
   npm create vite@latest . -- --template react-ts
   ```
2. Install all dependencies in one shot:
   ```bash
   npm install @tanstack/react-query zustand framer-motion recharts leaflet react-leaflet clsx tailwind-merge class-variance-authority lucide-react date-fns @google/generative-ai
   npm install -D tailwindcss autoprefixer postcss @types/leaflet
   ```
3. Init Tailwind:
   ```bash
   npx tailwindcss init -p
   ```
4. Init shadcn/ui (choose: New York style, Neutral base color, yes to CSS variables):
   ```bash
   npx shadcn@latest init
   npx shadcn@latest add button card input badge tabs tooltip scroll-area separator skeleton
   ```
5. Create `.env` in project root:
   ```
   VITE_OWM_API_KEY=your_key_here
   VITE_GEMINI_API_KEY=your_key_here
   ```
6. Create `.env.example` (commit this, not .env):
   ```
   VITE_OWM_API_KEY=
   VITE_GEMINI_API_KEY=
   ```
7. Add `.env` to `.gitignore`

### Checkpoint ✓
- `npm run dev` opens a blank page with no errors in the browser console
- Tailwind utility classes apply (test by adding `className="text-red-500"` to App.tsx)

---

## Step 1 — Project Structure & Types

**Goal:** Create the full folder skeleton and all TypeScript types. No UI yet, just architecture.

### Folders to create under `src/`
```
src/
├── types/
│   ├── weather.ts        # All OWM API response types
│   ├── ai.ts             # Gemini request/response types
│   └── app.ts            # App-level types (units, location, theme)
├── constants/
│   ├── weather.ts        # OWM condition code → label/icon map
│   └── prompts.ts        # All Gemini prompt template functions
├── config/
│   └── api.ts            # API base URLs, endpoints
├── lib/
│   ├── utils.ts          # shadcn cn() helper
│   ├── weather.utils.ts  # Convert codes, format wind direction, etc.
│   └── time.utils.ts     # Time-of-day detection, format sunrise/sunset
├── services/
│   ├── weather.service.ts  # All OWM fetch functions
│   └── gemini.service.ts   # Gemini generateContent + streaming
├── store/
│   └── weatherStore.ts   # Zustand store
└── hooks/
    ├── useWeather.ts
    ├── useForecast.ts
    ├── useAirQuality.ts
    ├── useGeolocation.ts
    ├── useUnits.ts
    ├── useTheme.ts
    └── useGemini.ts
```

### Key types to define (`types/weather.ts`)
- `Coordinates` — `{ lat: number; lon: number }`
- `Location` — `{ lat, lon, name, country, state? }`
- `CurrentWeather` — mapped from OWM `/weather` response
- `ForecastItem` — single 3-hour slot from OWM `/forecast`
- `DailyForecast` — aggregated day (derived from ForecastItem[])
- `AirQuality` — from OWM `/air_pollution`
- `WeatherCondition` — union of all condition strings

### Key types to define (`types/app.ts`)
- `Units` — `'metric' | 'imperial'`
- `NarratorTone` — `'newsanchor' | 'poetic' | 'sarcastic' | 'neighbor'`
- `WeatherTheme` — `{ gradientFrom, gradientVia, gradientTo, glassOpacity, textColor, accentColor }`
- `ChatMessage` — `{ role: 'user' | 'model'; text: string; timestamp: Date }`

### Zustand Store (`store/weatherStore.ts`)
Persisted to localStorage:
```typescript
{
  location: Location | null
  units: 'metric' | 'imperial'
  narratorTone: NarratorTone
  chatHistory: ChatMessage[]
  // actions: setLocation, toggleUnits, setNarratorTone, appendChat, clearChat
}
```

### Checkpoint ✓
- `npm run dev` still compiles with zero TypeScript errors
- All imports resolve — no red squiggles

---

## Step 2 — Weather Service & Data Hooks

**Goal:** Fetch real weather data and verify it in the browser console before building any UI.

### OWM Endpoints to implement in `weather.service.ts`

| Function | Endpoint | Used for |
|----------|---------|---------|
| `getCurrentWeather(lat, lon, units)` | `/data/2.5/weather` | Hero card |
| `getForecast(lat, lon, units)` | `/data/2.5/forecast` | Hourly + 7-day |
| `getAirQuality(lat, lon)` | `/data/2.5/air_pollution` | AQI gauge |
| `searchCities(query)` | `/geo/1.0/direct?limit=5` | Search autocomplete |
| `reverseGeocode(lat, lon)` | `/geo/1.0/reverse?limit=1` | Coords → city name |

### React Query Hooks
- `useWeather(lat, lon)` — stale 5 min, refetch on window focus
- `useForecast(lat, lon)` — stale 10 min
- `useAirQuality(lat, lon)` — stale 5 min
- `useGeolocation()` — browser `navigator.geolocation`, falls back to `{ lat: 51.5, lon: -0.12 }` (London)

### Checkpoint ✓
- In App.tsx, temporarily `console.log(weatherData)` — verify real data comes back
- Response has `name`, `main.temp`, `weather[0].description`
- Geolocation prompt appears in browser

---

## Step 3 — App Shell & Dynamic Background

**Goal:** A beautiful full-screen gradient background that reacts to weather + time of day. This is the visual foundation everything else sits on.

### Components to build

**`components/layout/AppBackground.tsx`**
- Full-screen fixed div behind everything
- Reads `WeatherTheme` from `useTheme()` hook
- Framer Motion `animate` on gradient when theme changes (2s transition)
- Gradient defined as CSS variables on `:root`

**`useTheme.ts`** — pure mapping function, no state:
| Condition + Time | Gradient |
|-----------------|----------|
| Clear, 5am–8am | `#F97316 → #FB923C → #7DD3FC` (sunrise gold → sky) |
| Clear, 8am–5pm | `#38BDF8 → #0EA5E9 → #1D4ED8` (bright sky) |
| Clear, 5pm–8pm | `#F97316 → #EC4899 → #7C3AED` (sunset) |
| Clear, 8pm–5am | `#0F172A → #1E1B4B → #0F172A` (night) |
| Clouds | `#94A3B8 → #64748B → #475569` |
| Rain / Drizzle | `#1E3A5F → #2D5986 → #1A2F4A` |
| Thunderstorm | `#1A1A2E → #2D1B69 → #0F0F23` |
| Snow | `#EFF6FF → #BFDBFE → #93C5FD` |
| Fog / Mist | `#D1D5DB → #9CA3AF → #6B7280` |

**`components/common/GlassCard.tsx`**
- `backdrop-blur-md`, `bg-white/10`, `border border-white/20`, `shadow-xl`
- Accepts `className` prop for overrides

**`components/layout/AppShell.tsx`**
- Responsive grid layout: sidebar on desktop, stacked on mobile
- Wraps `AppBackground` + children

### Checkpoint ✓
- App renders a full-screen gradient
- Manually change the condition code in a hardcoded test — gradient visibly transitions
- GlassCard renders as a blurred glass panel over the gradient

---

## Step 4 — Current Conditions (Hero Card)

**Goal:** The main weather display — the first thing users see.

### Components to build

**`components/weather/WeatherIcon.tsx`**
- Maps OWM condition codes to Lucide icons (or inline SVGs)
- Framer Motion: subtle float animation on the icon
- Sizes: `sm | md | lg`

**`components/weather/CurrentConditions.tsx`**
- Large temperature display (primary number, dominant visual)
- City name + country
- Weather description (e.g., "Partly Cloudy")
- WeatherIcon (large)
- Feels like temp
- High / Low for today

**`components/search/LocationSearch.tsx`**
- Input with search icon
- Debounced (300ms) call to `searchCities()`
- Dropdown of suggestions using `useQuery`
- On select: updates Zustand `location`

**`components/common/UnitToggle.tsx`**
- °C / °F pill toggle
- Persisted in Zustand + localStorage
- Triggers refetch via React Query key change

### Wiring in `pages/WeatherDashboard.tsx`
- `useGeolocation` → sets initial location
- `useWeather` → feeds `CurrentConditions`
- `LocationSearch` → updates location in store

### Checkpoint ✓
- Current temperature shows for your actual location
- Clicking a searched city updates the display
- Toggling °C/°F updates the number immediately
- Location search dropdown appears and is clickable

---

## Step 5 — Weather Stats Bar

**Goal:** Secondary data row — the supporting details below the hero card.

### Component: `components/weather/WeatherStats.tsx`
Six stat tiles in a responsive grid:

| Stat | Icon | Data source |
|------|------|------------|
| Humidity | `Droplets` | `main.humidity` |
| Wind | `Wind` | `wind.speed` + `wind.deg` → direction label |
| Pressure | `Gauge` | `main.pressure` |
| Visibility | `Eye` | `visibility` (convert m → km) |
| UV Index | `Sun` | `uvi` (from forecast `current` if OWM One Call, else derive) |
| Feels Like | `Thermometer` | `main.feels_like` |

Each tile: icon + value + label, inside a mini GlassCard.

### Checkpoint ✓
- All 6 stats populate with real values
- Wind direction shows compass label (N, NE, SW, etc.)
- Visibility shows in km

---

## Step 6 — 7-Day Forecast Strip

**Goal:** Horizontal scrollable daily forecast.

### Components to build

**`components/weather/ForecastDay.tsx`**
- Day name (Mon, Tue…)
- WeatherIcon (small)
- Rain probability %
- High / Low temps
- Rounded pill card

**`components/weather/DailyForecast.tsx`**
- Aggregates `useForecast` 3-hour slots into daily min/max/condition/rain
- Horizontal scroll on mobile, 7 columns on desktop
- Today is slightly larger / highlighted

### Checkpoint ✓
- 7 days render with correct day names
- Temperatures and icons look correct
- Scrolls horizontally on narrow screen

---

## Step 7 — Hourly Temperature Chart

**Goal:** 24-hour temperature and rain probability chart.

### Component: `components/weather/HourlyChart.tsx`
- Recharts `ComposedChart`
- X-axis: hour labels (12am, 3am, 6am…)
- Line: temperature (left Y-axis)
- Bar: precipitation probability % (right Y-axis, muted)
- Custom tooltip showing both values on hover
- Responsive container, no fixed height

### Checkpoint ✓
- Chart renders with real hourly data
- Hovering a point shows temp + rain%
- Chart looks good on both desktop and mobile widths

---

## Step 8 — Sunrise / Sunset & AQI

**Goal:** Two supporting visual components.

### `components/weather/SunriseSunset.tsx`
- SVG arc showing sun position between sunrise and sunset
- Current time dot on the arc
- Sunrise and sunset times displayed at each end
- Inside a GlassCard

### `components/weather/AQIGauge.tsx`
- Uses `useAirQuality` hook
- AQI index 1–5 → label: Good / Fair / Moderate / Poor / Very Poor
- Color-coded badge: green → red
- Optional: simple horizontal bar gauge

### Checkpoint ✓
- Sunrise arc shows correctly (dot moves with current time)
- AQI shows correct label and color for current conditions

---

## Step 9 — Weather Map

**Goal:** Interactive map with weather tile overlay.

### Component: `components/weather/WeatherMap.tsx`
- Leaflet map centered on current location
- Base tile: OpenStreetMap
- OWM overlay layer selector: Precipitation | Clouds | Wind | Temperature
- Layer toggle buttons above map
- Marker at current location

OWM tile URL pattern:
```
https://tile.openweathermap.org/map/{layer}/{z}/{x}/{y}.png?appid={KEY}
```

### Checkpoint ✓
- Map loads centered on current location
- Switching layers updates the overlay
- Map is responsive and doesn't break layout

---

## Step 10 — Skeleton States & Error Handling

**Goal:** The app should never show broken/empty UI during loading or on API errors.

### Components to build

**`components/common/LoadingSkeleton.tsx`**
- Shimmer skeleton variants matching each card shape:
  - `WeatherHeroSkeleton`
  - `StatsSkeleton`
  - `ForecastSkeleton`
  - `ChartSkeleton`

**`components/common/ErrorCard.tsx`**
- Shown when a React Query fetch fails
- Shows friendly message + retry button
- Never breaks the whole layout

### Pattern
Every data-dependent component checks:
```
isLoading → show skeleton
isError   → show ErrorCard
data      → show real content
```

### Checkpoint ✓
- On slow network (throttle in DevTools), skeletons appear
- Providing a bad API key shows error cards, not a broken layout
- Retry button re-triggers the query

---

## Step 11 — Responsive Layout & Mobile Polish

**Goal:** App is fully usable on mobile before adding AI features.

### Changes
- AppShell: single column on mobile, 2-col grid on tablet, sidebar on desktop
- `components/layout/MobileNav.tsx` — bottom navigation bar on mobile (≤768px):
  - Weather | Map | AI | Settings tabs
- Touch-friendly tap targets (min 44px)
- Forecast strip: `overflow-x-scroll` + hidden scrollbar CSS
- Map: fixed height on mobile

### Checkpoint ✓
- Open on a 375px wide viewport (iPhone SE) — all content readable, no overflow
- Tapping location search works on touch
- Map doesn't expand beyond its container

---

## Step 12 — Gemini Service & AI Infrastructure

**Goal:** Reusable Gemini integration before any feature uses it.

### `services/gemini.service.ts`
```typescript
// Two exported functions used by all AI features:

generateText(prompt: string): Promise<string>
// → single response, used for JSON-output features

generateStream(prompt: string, onChunk: (text: string) => void): Promise<void>
// → streaming, used for Outfit Oracle and Narrator
```

### `hooks/useGemini.ts`
```typescript
// Wraps gemini.service with React state:
{
  generate: (prompt: string) => void
  stream: (prompt: string) => void
  output: string       // accumulated streamed text
  isLoading: boolean
  error: string | null
  reset: () => void
}
```

### `components/ai/AICard.tsx`
- Glassmorphism card with AI sparkle header
- Slot for a trigger button + output area
- `StreamingText.tsx` sub-component: displays text character by character with blinking cursor

### `constants/prompts.ts`
- All prompt builder functions live here
- Pure functions: `(weatherData) => string`
- Easy to iterate without touching component logic

### Checkpoint ✓
- Call `generateText("Say hello in 5 words")` in browser console via a test button
- Gemini responds with text
- `generateStream` streams tokens visibly one by one

---

## Step 12a — UI Visual Polish Sprint ✅

**Goal:** Fix flat/indistinct backgrounds and low-contrast glass cards before AI features are built on top of them.

**Why here:** Every AI card inherits the same visual foundation. Fixing it now means AI features look great immediately rather than requiring a second pass after Step 18.

### Changes made

**`src/types/app.ts`**
- Added optional `glowColor?: string` to `WeatherTheme` — used for per-condition radial light source

**`src/constants/weather.ts`**
- Reworked all clear daytime gradients to use warm-to-cool contrast instead of blue-on-blue:
  - Dawn: gold → orange → sky blue
  - Morning: warm cream → bright sky blue → deep blue
  - Midday: pale sky → vivid sky blue → deep ocean blue
  - Afternoon: amber → sky blue → rich blue
  - Evening: fiery orange → pink → violet (unchanged, already dramatic)
  - Night: deep navy → dark indigo → near-black
- Clouds: light silver top → dark slate bottom (high contrast)
- Rain: deep teal → dark navy
- Added `glowColor` to all themes that have a visible light source (sun, moon)

**`src/components/layout/AppBackground.tsx`**
- Added 3 stacked layers inside the animated div:
  1. Base gradient (was the only layer before)
  2. Radial glow at top-right using `theme.glowColor` — simulates sun/moon
  3. Bottom vignette (`rgba(0,0,0,0.25)`) — adds depth, grounds the cards

**`src/components/common/GlassCard.tsx`**
- Bumped opacity: `bg-white/10` → `bg-white/[0.13]`
- Adjusted border: `border-white/20` → `border-white/[0.18]`
- Added `shadow-black/20` tint so cards lift off the background

### Checkpoint ✓
- Clear sky and cloudy conditions are visually distinct at a glance
- A light source glow is visible in the upper-right for daytime clear conditions
- Cards are legible against all background conditions

---

## Step 13 — AI Feature: Outfit Oracle

**Goal:** First AI feature. Given today's weather, Gemini recommends a full outfit.

### Prompt (in `constants/prompts.ts`)
```
System context injected into prompt:
"You are a stylish, fun personal stylist who understands weather practicality.
Recommend a complete outfit: top, bottom, shoes, outerwear, and accessories.
Be specific about materials and colors. Confident, enthusiastic tone.
Under 100 words. No lists — write as flowing enthusiastic suggestions."

User part:
"{temp}°C, {description}, feels like {feelsLike}°, humidity {humidity}%,
wind {windSpeed}km/h, UV index {uvi}, {precipitation}mm rain expected.
Time of day: {timeOfDay}. Season: {season}."
```

### Component: `components/ai/OutfitOracle.tsx`
- Header: "Outfit Oracle" + wardrobe icon
- "What should I wear?" button → triggers stream
- Streaming text renders below (with cursor animation)
- Refresh icon to regenerate
- Inside AICard wrapper

### Checkpoint ✓
- Button triggers a Gemini call
- Text streams in visibly, character by character
- Outfit recommendation is relevant to actual current weather
- Refresh generates a different (but still valid) outfit

---

## Step 14 — AI Feature: Mood Board

**Goal:** Gemini returns structured JSON that directly drives a visual color UI.

### Prompt
```
"Respond ONLY with valid JSON, no extra text:
{
  \"mood\": \"single evocative word\",
  \"palette\": [\"#hex\", \"#hex\", \"#hex\", \"#hex\"],
  \"genre\": \"specific music genre (e.g. Nordic ambient folk, not just folk)\",
  \"activity\": \"one ideal activity for this weather\",
  \"quote\": \"atmospheric sentence under 10 words\"
}

Weather: {temp}°C, {description}, {humidity}% humidity, {windSpeed}km/h wind.
Time: {timeOfDay}. Month: {month}."
```

### Component: `components/ai/MoodBoard.tsx`
- Four color swatches rendered from `palette` hex codes (actual CSS `background-color`)
- Mood word in large display font
- Genre and Activity as pill badges
- Quote in italic
- "Generate Vibe" button
- JSON.parse with fallback if Gemini returns malformed JSON

### Checkpoint ✓
- Color swatches render as actual colors (not just text)
- Palette changes between weather conditions (rainy day vs. sunny)
- Malformed JSON shows a graceful fallback, not a crash

---

## Step 15 — AI Feature: Weather Impact Score

**Goal:** Gemini scores 5 activities based on weather. UI renders a visual grid.

### Prompt
```
"Score how today's weather affects each activity on 1–10 (10=perfect, 1=terrible/dangerous).
Respond ONLY with valid JSON:
{
  \"commute\":       { \"score\": N, \"reason\": \"one short sentence\" },
  \"outdoor_dining\": { \"score\": N, \"reason\": \"...\" },
  \"exercise\":       { \"score\": N, \"reason\": \"...\" },
  \"sleep\":          { \"score\": N, \"reason\": \"...\" },
  \"mood\":           { \"score\": N, \"reason\": \"...\" }
}

{temp}°C, {description}, humidity {humidity}%, wind {windSpeed}km/h,
UV {uvi}, overnight low {nightLow}°C, rain probability {rainProb}%."
```

### Component: `components/ai/ImpactScore.tsx`
- Grid of 5 activity cards (2×2 + 1 centered on mobile, 5-col on desktop)
- Each card: activity icon + name + score bar + reason text
- Score bar color: green (8–10) | yellow (5–7) | red (1–4)
- Scores animate in with Framer Motion when data arrives
- Auto-refreshes when location changes

### Checkpoint ✓
- 5 cards render with correct scores and reasons
- Score bar widths are proportional (score/10 × 100%)
- Colors are correct per score range
- Changes when you switch to a city with different weather

---

## Step 16 — AI Feature: Weather Narrator

**Goal:** Claude narrates the weather in a chosen personality tone.

### Tone options
| Tone | Persona |
|------|---------|
| News Anchor | Authoritative, formal, uses meteorological terms |
| Poetic | Lyrical, metaphorical, finds beauty in weather |
| Sarcastic | Dry humor, playful complaints about forecast |
| Friendly Neighbor | Warm, casual, like texting your friend |

### Component: `components/ai/WeatherNarrator.tsx`
- 4 tone selector buttons (pill style, one active at a time)
- Streamed briefing text below (3–4 sentences)
- Auto-generates on tone change
- Persisted tone selection in Zustand

### Checkpoint ✓
- Each tone produces a noticeably different writing style
- Switching tones triggers a new generation
- Streaming animation plays smoothly

---

## Step 17 — AI Feature: Ask the Sky (Chat)

**Goal:** A conversational chat widget where users ask weather-related questions.

### Architecture
- Multi-turn conversation — full `messages` array sent to Gemini each time
- System context (current weather snapshot) injected as first message context
- Chat history cap: last 10 exchanges (prevent token bloat)
- History persisted in Zustand (survives page refresh)

### Component: `components/ai/AskTheSky.tsx`
- Scrollable message history (`ScrollArea`)
- Input + send button at the bottom
- User messages right-aligned, AI messages left-aligned
- Loading indicator while Gemini responds
- "Clear chat" button

### Example questions it handles well
- "Is it safe to drive tonight?"
- "What should I cook given this weather?"
- "Will it clear up this afternoon?"
- "Should I cancel my outdoor event tomorrow?"

### Checkpoint ✓
- Multi-turn works (AI remembers earlier messages in the session)
- Weather context is accurate in AI responses
- History persists on page refresh
- Sending an empty message is blocked

---

## Step 18 — Final Polish Pass

**Goal:** Production-quality animations, transitions, and micro-interactions.

### Tasks
- Framer Motion entrance animations on all cards (`fadeInUp` stagger)
- Gradient background transitions (2s ease) on weather/time change
- WeatherIcon: subtle float animation (infinite, slow)
- Forecast cards: scale on hover
- AI cards: shimmer border while loading
- Score bars: count-up animation on mount
- Streamed text: blinking cursor disappears after completion
- `ErrorBoundary` wrapping major sections
- Console errors cleaned up
- Lighthouse performance check (aim for 85+)

### Checkpoint ✓
- Page feels alive — nothing is static or abrupt
- No layout shifts on load
- Lighthouse score > 85 in Performance + Accessibility

---

## Feature Sequence Summary

```
Step 0  ── Scaffold & dependencies
Step 1  ── Types, store, folder structure
Step 2  ── Weather service + data hooks
Step 3  ── App shell + dynamic background         ← visual foundation
Step 4  ── Current conditions hero card           ← MVP #1
Step 5  ── Weather stats bar
Step 6  ── 7-day forecast strip
Step 7  ── Hourly chart
Step 8  ── Sunrise/sunset + AQI
Step 9  ── Weather map
Step 10 ── Loading skeletons + error handling     ← app is solid
Step 11 ── Responsive layout + mobile             ← mobile-ready
Step 12 ── Gemini service + AI infrastructure     ← AI foundation
Step 13 ── Outfit Oracle (streaming)              ← AI feature #1
Step 14 ── Mood Board (JSON → visual)             ← AI feature #2
Step 15 ── Impact Score (JSON → grid)             ← AI feature #3
Step 16 ── Weather Narrator (tones)               ← AI feature #4
Step 17 ── Ask the Sky (chat)                     ← AI feature #5
Step 18 ── Final polish & animations
```

---

## Conventions to Follow Throughout

- **Never** hardcode API keys — always `import.meta.env.VITE_*`
- **Never** store derived data in state — compute it from raw API data
- **Always** handle `isLoading` and `isError` before rendering data
- **One** Zustand store, no prop drilling
- **Zero** `any` types — every variable is typed
- **No** comments explaining what code does — use clear naming instead
- If Gemini returns invalid JSON — `try/catch` with a silent fallback, never crash
