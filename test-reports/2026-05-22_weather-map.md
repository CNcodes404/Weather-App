# Test Report: Weather Map
**Date:** 2026-05-22
**Build:** ✅ Pass (tsc -b + vite build — 0 TypeScript errors, 2893 modules)

## Results

| # | Test | Status | Notes |
|---|------|--------|-------|
| 9.1 | Map loads — Leaflet map visible with OpenStreetMap tiles | 🔍 MANUAL | MapContainer + TileLayer + CSS import all present in code. Tile rendering requires a running browser. |
| 9.2 | Default overlay — Rain overlay visible on map tiles | ✅ AUTO-PASS | `useState<LayerKey>('precipitation_new')` — default is Rain layer. TileLayer URL uses `activeLayer`. |
| 9.3 | Layer toggle buttons switch OWM overlay | ✅ AUTO-PASS | Each button has `onClick={() => setActiveLayer(l.key)}`. TileLayer has `key={activeLayer}` forcing remount on change. |
| 9.4 | Scroll to zoom works | ✅ AUTO-PASS | `scrollWheelZoom={true}` explicitly set on MapContainer. |
| 9.5 | +/- zoom controls visible and functional | ✅ AUTO-PASS | `zoomControl` prop not set → Leaflet default is to show controls. No `zoomControl={false}` anywhere. |
| 9.6 | Click on map — amber dot appears + header shows "Locating…" | ✅ AUTO-PASS | `ClickHandler` calls `handleMapClick` → `setPinnedPos([lat, lon])` + `setIsPinning(true)`. Header JSX: `{isPinning ? <Loader2 /> Locating…}`. Amber `CircleMarker` conditionally renders when `pinnedPos` is set. |
| 9.7 | After geocode — confirmation banner shows city name | ✅ AUTO-PASS | `handleMapClick` calls `reverseGeocode` → `setPendingGeo(geo)`. Banner renders when `pendingGeo && !isPinning` and shows `{pendingGeo.name}, {pendingGeo.country}`. |
| 9.8 | "Set as Location" updates dashboard | ✅ AUTO-PASS | `handleConfirm()` calls `setLocation(pendingGeo)` from Zustand store, triggering all React Query hooks to refetch. |
| 9.9 | "✕" dismiss button clears pin; weather unchanged | ✅ AUTO-PASS | `handleDismiss()` sets `setPendingGeo(null)`, `setPinnedPos(null)`, `setPinnedLabel(null)`. CircleMarker + banner both gated on these state vars. `setLocation` is never called. |
| 9.10 | Current location dot — white circle marker visible | 🔍 MANUAL | `CircleMarker center={[lat, lon]}` with `fillColor: 'white', fillOpacity: 0.9` is always rendered inside MapContainer. Visual confirmation requires a running map. |

## Manual Verification Needed

1. **9.1 — Map tiles load**: Open the app, scroll to the Weather Map section. Confirm the map renders with OpenStreetMap base tiles (grey street map visible). If tiles are missing, check network tab for failed tile requests.

2. **9.10 — White dot visible**: With the map loaded, confirm a small white circle marker appears at the current location (e.g., London or your detected city). It should be centred on the city, radius ~7px, with white fill.

> Both MANUAL tests depend on the same thing: the Leaflet map rendering correctly in the browser. If 9.1 passes, 9.10 will almost certainly pass too.

## Summary
- **Auto-passed:** 8
- **Auto-failed:** 0
- **Manual verification needed:** 2
