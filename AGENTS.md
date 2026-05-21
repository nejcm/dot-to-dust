# Dot to Dust — Agent Guide

A mobile app that visualizes a user's life as a grid of colored dots. Inspired by Tim Urban's "Life in Weeks".

## Project structure

- `src/app/` — expo-router screens (thin, no logic)
- `src/features/grid/` — grid canvas, life-math, layout, colors
- `src/features/onboarding/` — DOB picker component
- `src/features/settings/` — settings row components
- `src/lib/` — storage, theme, i18n, a11y
- `src/translations/` — en.json only for now; keep i18n tooling ready for future locales
- `plans/` — PRD and implementation plan (read-only reference)

## Key invariants

- `src/features/grid/lib/life-math.ts` is the single source of truth for all date math. Civil dates only (`YYYY-MM-DD`). No `Date` objects cross the API surface.
- Future dots are a single muted color — no stage tinting.
- Skia drives the pulse animation. Reanimated drives the segmented-control thumb and view-switch cross-fade only.
- `@date-fns/utc` is **never** used. `date-fns` only.
- No SQLite. MMKV only for storage.
- `pnpm verify` must stay green at all times.

## Commands

```bash
pnpm dev          # start Expo dev server
pnpm verify       # lint + typecheck + translation lint + tests
pnpm test         # jest
pnpm lint         # eslint
pnpm lint:ts      # tsc --noEmit
pnpm knip:check   # dead code scan
```

## Conventions

- Filenames: kebab-case enforced by ESLint
- Path alias: `@/` → `src/`
- Conventional commits enforced by commitlint
- All count-bearing strings use ICU plural rules
