Feature to build: $ARGUMENTS

Read CLAUDE.md for conventions and structure.
Read DEVELOPMENT_PLAN.md and find the step that corresponds to "$ARGUMENTS".

Implement the AI feature:
1. Add the prompt builder function in src/constants/prompts.ts
   - Pure function: (weatherData: CurrentWeather) => string
   - Follow the exact prompt template from DEVELOPMENT_PLAN.md for this feature
2. Create the component in src/components/ai/
   - Wrap with AICard component
   - Use useGemini hook for all Gemini calls — never call gemini.service directly
   - For streaming features: use StreamingText component
   - For JSON features: wrap JSON.parse in try/catch with a silent fallback
3. Add loading state: show AICard skeleton while Gemini is responding
4. Add error state: show a friendly inline message, never crash
5. Wire the component into src/pages/WeatherDashboard.tsx
6. Verify the Checkpoint from DEVELOPMENT_PLAN.md for this feature

Report: which files were created, what the Gemini call looks like, and confirm the feature renders correctly.
