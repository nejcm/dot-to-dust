---
name: dot-to-dust-grid
description: >
  Dot to Dust grid/domain skill. Use when changing life math, civil dates,
  dot-state generation, grid layout, stage colors, headline counts, bonus time,
  reduced-motion grid behavior, or DOB/default-view preference behavior.
---

# Dot to Dust Grid

## Hard Rules

- `life-math.ts` is the only source of truth for lifespan totals, lived counts, stage boundaries, remaining units, and bonus units.
- Public date APIs use civil `YYYY-MM-DD` strings only. Use `src/lib/civil-date` for parsing and `todayCivilDate()`.
- Do not add `@date-fns/utc`; use `date-fns` only after converting civil dates locally.
- Future dots are always `{ kind: 'future' }` and one muted color.
- Bonus time starts when `weeksLived >= WEEKS_TOTAL`; all dots are lived and `isToday` is false.
- Stage boundaries are `0-11`, `12-22`, `23-39`, `40-59`, `60-80`.
- Skia owns grid rendering. Reanimated is allowed for segmented-control thumb and view cross-fade only.
- Reduced motion disables pulse/cross-fade.

## Change Workflow

1. Search existing tests for the behavior first.
2. Update pure logic before UI when possible.
3. Add or adjust focused tests for changed date/grid behavior.
4. Run the narrow relevant check:
   - `pnpm test -- life-math`
   - `pnpm test -- dot-states`
   - `pnpm test -- grid-layout`
   - `pnpm test -- stage-colors`
   - `pnpm lint:translations` for headline copy

## Files

- `src/lib/civil-date/index.ts`
- `src/features/grid/lib/life-math.ts`
- `src/features/grid/lib/dot-states.ts`
- `src/features/grid/lib/grid-layout.ts`
- `src/features/grid/lib/stage-colors.ts`
- `src/features/grid/components/life-grid.tsx`
- `src/features/grid/components/headline.tsx`
- `src/translations/en.json`
