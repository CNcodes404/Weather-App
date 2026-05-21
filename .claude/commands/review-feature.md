File or component to review: $ARGUMENTS

Read CLAUDE.md for the full list of conventions this project follows.
Read the file at "$ARGUMENTS" carefully.

Check for every item below and report findings with file path and line number:

**TypeScript**
- [ ] Any `any` types used?
- [ ] All component props have explicit interfaces?
- [ ] API response types mapped to internal types before use?
- [ ] `unknown` + type guard used when parsing Gemini JSON?

**Data fetching**
- [ ] All useQuery hooks destructure `data`, `isLoading`, `isError`?
- [ ] Skeleton shown when isLoading is true?
- [ ] ErrorCard shown when isError is true?
- [ ] Data existence checked before rendering?

**State**
- [ ] API data stored in TanStack Query, not Zustand?
- [ ] No useState for fetched data?

**Gemini / AI (if applicable)**
- [ ] All Gemini calls go through useGemini hook?
- [ ] JSON.parse wrapped in try/catch?
- [ ] Buttons disabled while request is in flight?
- [ ] Streaming uses StreamingText component?

**Style**
- [ ] No inline style={{}} except for dynamic hex colors?
- [ ] GlassCard wrapping all visible cards?
- [ ] Responsive classes present (sm:, md:, lg:)?

**Code quality**
- [ ] No console.log statements?
- [ ] No hardcoded API keys, URLs, or city names?
- [ ] No TODO comments?
- [ ] No direct fetch() calls in the component?

Summarize: list each issue found with a suggested fix. If no issues, confirm the component passes review.
