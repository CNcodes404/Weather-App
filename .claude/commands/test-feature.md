Feature to test: $ARGUMENTS

Follow these steps in order.

## Step 1 — Load test cases
Read TESTING.md at the project root.
Find the section whose heading contains "$ARGUMENTS" (case-insensitive match).
Extract every test row from that section's table.
If no section matches, stop and report: "No test cases found for '$ARGUMENTS' in TESTING.md".

## Step 2 — Identify source files
Map the feature name to its component files using this table:
- Geolocation / Location Search → src/components/search/LocationSearch.tsx, src/hooks/useGeolocation.ts
- Unit Toggle               → src/components/common/UnitToggle.tsx, src/store/weatherStore.ts
- Current Conditions        → src/components/weather/CurrentConditions.tsx, src/components/weather/WeatherIcon.tsx
- Weather Stats             → src/components/weather/WeatherStats.tsx
- Sunrise / Sunset          → src/components/weather/SunriseSunset.tsx
- AQI Gauge                 → src/components/weather/AQIGauge.tsx
- Hourly Chart              → src/components/weather/HourlyChart.tsx
- 7-Day Forecast            → src/components/weather/DailyForecast.tsx, src/components/weather/ForecastDay.tsx
- Weather Map               → src/components/weather/WeatherMap.tsx
- Mood Board                → src/components/ai/MoodBoard.tsx
- Impact Score              → src/components/ai/ImpactScore.tsx
- Weather Narrator          → src/components/ai/WeatherNarrator.tsx
- Ask the Sky               → src/components/ai/AskTheSky.tsx
- Mobile Nav                → src/components/layout/MobileNav.tsx
- Loading Skeletons         → src/components/common/LoadingSkeleton.tsx, src/components/common/ErrorCard.tsx
- Dynamic Background        → src/hooks/useTheme.ts, src/components/layout/AppBackground.tsx

Read every identified source file in full.

## Step 3 — Run build
Run: npm run build
Record whether it passes or fails. If it fails, capture the error output.

## Step 4 — Classify each test case
For each row extracted in Step 1, classify as one of:
- AUTO-PASS ✅  — source code confirms the implementation exists (handler defined, state variable present, conditional rendering correct, correct import present, logic matches expectation)
- AUTO-FAIL ❌  — source code confirms the implementation is missing or clearly broken
- MANUAL 🔍    — cannot be confirmed without a running browser (animations, real API data, audio playback, map tile rendering, geolocation prompt, touch/scroll events, visual styling)

Rules for AUTO-PASS:
- The relevant state variable, function, or conditional exists in source → AUTO-PASS
- The correct service/hook is imported and called → AUTO-PASS
- The JSX condition matches the test expectation → AUTO-PASS

Rules for MANUAL:
- Anything involving animation, transition, or motion timing
- Anything requiring a live API response
- Audio (speechSynthesis), map tiles, geolocation browser prompt
- Touch targets, scroll behavior, visual layout

## Step 5 — Write dated report
Determine today's date in YYYY-MM-DD format.
Create the directory test-reports/ at the project root if it does not exist.
Create the file: test-reports/YYYY-MM-DD_[feature-slug].md

Use this format:
---
# Test Report: [Feature Name]
**Date:** YYYY-MM-DD
**Build:** ✅ Pass / ❌ Fail

## Results
| # | Test | Status | Notes |
|---|------|--------|-------|
[one row per test case — use ✅ AUTO-PASS / ❌ AUTO-FAIL / 🔍 MANUAL]

## Manual Verification Needed
[numbered list of MANUAL items with specific instructions for what to check in the browser]

## Summary
- Auto-passed: N
- Auto-failed: N
- Manual verification needed: N
---

## Step 6 — Update TESTING.md
For every AUTO-PASS row: change ⬜ → ✅ in its Status column in TESTING.md.
For every AUTO-FAIL row: change ⬜ → ❌ and add a brief note in the Notes column.
Leave MANUAL rows as ⬜ — only the user can change these after browser verification.

## Step 7 — Output to user
Print a summary:
- Feature tested and build result
- Counts: auto-passed / auto-failed / manual needed
- Path to the generated report file
- Numbered list of browser tests still needed, with specific instructions for each
