# SkyMind — Manual Test Log

Update the **Status** column after testing each item in the browser.
- `⬜` Untested
- `✅` Pass
- `❌` Fail — fill in **Notes** with what broke

---

## 1. Geolocation & Location Search

| # | Test | Expected | Status | Notes |
|---|------|----------|--------|-------|
| 1.1 | Open app fresh (no saved location) | Browser prompts for location permission; weather loads for current city | ⬜ | |
| 1.2 | Deny location permission | App falls back to London | ⬜ | |
| 1.3 | Type 2+ characters in search bar | Dropdown appears with city suggestions within 1s | ⬜ | |
| 1.4 | Click a city suggestion | Dropdown closes; all weather sections update to new city | ⬜ | |
| 1.5 | Click outside the open dropdown | Dropdown closes without changing location | ⬜ | |
| 1.6 | Search for a city with the same name in multiple countries (e.g. "London") | Multiple results shown with country distinguisher | ⬜ | |

---

## 2. Unit Toggle (°C / °F)

| # | Test | Expected | Status | Notes |
|---|------|----------|--------|-------|
| 2.1 | Click the °C / °F toggle | All temperatures on screen switch units instantly | ⬜ | |
| 2.2 | Check wind speed after toggle | km/h → mph (or vice versa) | ⬜ | |
| 2.3 | Check visibility after toggle | km → mi (or vice versa) | ⬜ | |
| 2.4 | Reload the page after toggling to °F | °F stays selected (persisted via localStorage) | ⬜ | |

---

## 3. Current Conditions

| # | Test | Expected | Status | Notes |
|---|------|----------|--------|-------|
| 3.1 | Load any city | City name, temperature, description, H/L, feels-like all visible | ⬜ | |
| 3.2 | Clear sky during daytime | Weather icon is amber with amber glow ring | ⬜ | |
| 3.3 | Rain condition | Weather icon is blue with blue glow ring | ⬜ | |
| 3.4 | Switch location | Temperature and city name animate/transition to new values | ⬜ | |
| 3.5 | Toggle units | Displayed temperatures update | ⬜ | |

---

## 4. Weather Stats (6-tile grid)

| # | Test | Expected | Status | Notes |
|---|------|----------|--------|-------|
| 4.1 | All 6 tiles present | Humidity, Wind, Pressure, Visibility, Cloud Cover, Feels Like | ⬜ | |
| 4.2 | Hover over any stat tile | Card scales up slightly (spring animation) | ⬜ | |
| 4.3 | Wind direction | Abbreviation is one of: N, NE, E, SE, S, SW, W, NW | ⬜ | |
| 4.4 | Toggle units | Wind speed and Visibility values change | ⬜ | |
| 4.5 | Icon colors | Each tile's icon matches its accent bottom line color | ⬜ | |

---

## 5. Sunrise / Sunset Arc

| # | Test | Expected | Status | Notes |
|---|------|----------|--------|-------|
| 5.1 | Before sunset | SVG arc visible with amber sun dot on it | ⬜ | |
| 5.2 | Sun dot position | Dot is further along arc as the day progresses | ⬜ | |
| 5.3 | Sunrise/sunset times | Times are correct for the selected city's local timezone | ⬜ | |
| 5.4 | Dot animation | Subtle pulse on the sun dot (3s cycle) | ⬜ | |

---

## 6. AQI Gauge

| # | Test | Expected | Status | Notes |
|---|------|----------|--------|-------|
| 6.1 | Card renders | 5-segment bar visible with one glowing segment | ⬜ | |
| 6.2 | Label accuracy | Label (Good/Fair/Moderate/Poor/Very Poor) matches highlighted segment | ⬜ | |
| 6.3 | Segment colours | Segments are: emerald → lime → amber → orange → red | ⬜ | |
| 6.4 | API failure | Card silently disappears (no error shown to user) | ⬜ | |

---

## 7. Hourly Chart

| # | Test | Expected | Status | Notes |
|---|------|----------|--------|-------|
| 7.1 | Chart renders | White temperature line + blue rain probability bars visible | ⬜ | |
| 7.2 | Hover on chart | Tooltip appears showing time, temp, rain % | ⬜ | |
| 7.3 | X-axis hours | Times are in the selected city's local timezone | ⬜ | |
| 7.4 | Toggle units | Temperature values on Y-axis update | ⬜ | |

---

## 8. 7-Day Forecast

| # | Test | Expected | Status | Notes |
|---|------|----------|--------|-------|
| 8.1 | 7 cards visible | Horizontal scroll strip shows 7 day cards | ⬜ | |
| 8.2 | First card label | Shows "Today" not a day name | ⬜ | |
| 8.3 | Rain probability | Only shows if > 5%; hidden for dry days | ⬜ | |
| 8.4 | Toggle units | H/L temperatures update | ⬜ | |
| 8.5 | Scroll bar | No visible scroll bar (scrollbar-hide applied) | ⬜ | |

---

## 9. Weather Map

| # | Test | Expected | Status | Notes |
|---|------|----------|--------|-------|
| 9.1 | Map loads | Leaflet map visible with OpenStreetMap tiles | ⬜ | Requires browser — MapContainer + TileLayer + CSS confirmed in code |
| 9.2 | Default overlay | Rain overlay visible on map tiles | ✅ | Default state is `precipitation_new` (Rain) |
| 9.3 | Layer toggle buttons | Clicking Clouds/Wind/Temp switches OWM overlay layer | ✅ | onClick updates activeLayer; TileLayer key forces remount |
| 9.4 | Scroll to zoom | Mouse scroll zooms map in/out | ✅ | scrollWheelZoom={true} confirmed |
| 9.5 | +/- zoom controls | Leaflet zoom buttons visible and functional | ✅ | No zoomControl={false} — Leaflet default shows controls |
| 9.6 | Click on map | Amber dot appears + header shows "Locating…" | ✅ | ClickHandler + handleMapClick + isPinning logic + CircleMarker all confirmed |
| 9.7 | After geocode | Confirmation banner shows city name below layer toggles | ✅ | Banner conditional `pendingGeo && !isPinning` confirmed; shows name/country |
| 9.8 | "Set as Location" | Dashboard fully updates to the new location | ✅ | handleConfirm calls setLocation(pendingGeo) confirmed |
| 9.9 | "✕" dismiss button | Amber pin disappears; weather data unchanged | ✅ | handleDismiss nulls all 3 state vars; setLocation never called |
| 9.10 | Current location dot | White circle marker visible at the active location | ⬜ | Requires browser — CircleMarker with white fill confirmed in code |

---

## 10. Mood Board (AI)

| # | Test | Expected | Status | Notes |
|---|------|----------|--------|-------|
| 10.1 | Initial state | "Generate Vibe" button visible | ⬜ | |
| 10.2 | Click "Generate Vibe" | Loading state appears; API call made | ⬜ | |
| 10.3 | After generation | Mood text, 4 colour swatches + hex codes, genre, activity, quote all visible | ⬜ | |
| 10.4 | Colour swatches | Each swatch shows its hex code below it | ⬜ | |
| 10.5 | "Regenerate" button | Clears previous result and generates a new one | ⬜ | |
| 10.6 | API quota error | Shows "AI quota reached. Try again in a minute." message | ⬜ | |

---

## 11. Impact Score (AI)

| # | Test | Expected | Status | Notes |
|---|------|----------|--------|-------|
| 11.1 | Auto-generate on load | Score bars start animating without any button press | ⬜ | |
| 11.2 | 5 activity rows | Commute, Outdoor Dining, Exercise, Sleep, Mood all present | ⬜ | |
| 11.3 | Bar animation | Bars animate from 0 to final width (0.7s transition) | ⬜ | |
| 11.4 | Colour coding | Emerald for 8–10, amber for 5–7, red for 1–4 | ⬜ | |
| 11.5 | Reason text | Short explanation visible under each score | ⬜ | |
| 11.6 | "Refresh" button | Regenerates all 5 scores | ⬜ | |
| 11.7 | Location change | Scores re-generate automatically for new city | ⬜ | |

---

## 12. Weather Narrator (AI)

| # | Test | Expected | Status | Notes |
|---|------|----------|--------|-------|
| 12.1 | Auto-stream on load | Text begins streaming immediately; cursor visible | ⬜ | |
| 12.2 | Cursor disappears | Blinking cursor gone when streaming finishes | ⬜ | |
| 12.3 | Switch tone | Clicking a different tone stops current text and starts new stream | ⬜ | |
| 12.4 | Active tone styling | Selected tone button is visually highlighted | ⬜ | |
| 12.5 | "Speak" button | Appears after streaming finishes; plays audio in browser | ⬜ | |
| 12.6 | "Stop" button | Appears while speaking; cancels audio immediately | ⬜ | |
| 12.7 | Voice variation | Poetic tone sounds slower/higher pitched than News Anchor | ⬜ | |

---

## 13. Ask the Sky (AI Chat)

| # | Test | Expected | Status | Notes |
|---|------|----------|--------|-------|
| 13.1 | Initial state | 3 suggestion chips visible | ⬜ | |
| 13.2 | Click suggestion chip | Chip submits as a user message immediately | ⬜ | |
| 13.3 | Type + press Enter | Message sent; input clears | ⬜ | |
| 13.4 | Shift+Enter | Does NOT send; should move to new line | ⬜ | |
| 13.5 | User vs AI styling | User messages right-aligned; AI messages left-aligned | ⬜ | |
| 13.6 | Loading state | Spinner visible while awaiting response; input disabled | ⬜ | |
| 13.7 | Auto-scroll | Chat scrolls to bottom when new message arrives | ⬜ | |
| 13.8 | Clear chat button | Trash icon visible when history exists; clears all messages | ⬜ | |

---

## 14. Mobile Navigation Bar

| # | Test | Expected | Status | Notes |
|---|------|----------|--------|-------|
| 14.1 | Mobile viewport (< 768px) | Fixed bottom nav bar visible with 4 tabs | ⬜ | |
| 14.2 | Desktop viewport (≥ 768px) | Bottom nav completely hidden | ⬜ | |
| 14.3 | "Weather" tab | Scrolls to top of page (weather section) | ⬜ | |
| 14.4 | "Map" tab | Scrolls to weather map section | ⬜ | |
| 14.5 | "AI" tab | Scrolls to AI features section | ⬜ | |
| 14.6 | "Settings" tab | Scrolls to bottom settings anchor | ⬜ | |

---

## 15. Loading Skeletons & Error States

| # | Test | Expected | Status | Notes |
|---|------|----------|--------|-------|
| 15.1 | Throttle network to Slow 3G | Skeletons visible for each section during load | ⬜ | |
| 15.2 | Skeletons clear | All skeletons replaced by real data once loaded | ⬜ | |
| 15.3 | Disconnect network, load app | Error card appears with retry button | ⬜ | |
| 15.4 | Click "Retry" on error card | Attempts re-fetch | ⬜ | |
| 15.5 | Runtime crash (ErrorBoundary) | A broken component throws → full page replaced with "Something went wrong" + Reload button | ⬜ | |

---

## 16. Dynamic Background Theme

| # | Test | Expected | Status | Notes |
|---|------|----------|--------|-------|
| 16.1 | Clear sky at daytime | Gradient is blue/sky tones | ⬜ | |
| 16.2 | Clear sky at night | Gradient is deep navy/black | ⬜ | |
| 16.3 | Rain or storm | Gradient shifts to deep blue/charcoal | ⬜ | |
| 16.4 | Switch location | Background gradient cross-fades smoothly (1.5s) | ⬜ | |

---

*Last updated: 2026-05-22*
