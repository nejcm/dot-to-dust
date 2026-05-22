# AGENTS Guide - Dot to Dust

Dot to Dust is a local-only Expo + React Native app that visualizes a user's life as a grid of colored dots. Use this file as the canonical operating guide for AI agents working in this repository.

## Stack

| Layer | Choice |
|---|---|
| Framework | Expo SDK 55 + React Native 0.83 |
| Language | TypeScript strict |
| Routing | Expo Router under `src/app` |
| Styling | Uniwind (`className`) + CSS variables in `src/global.css` |
| Canvas | React Native Skia for the life grid |
| Animation | Skia for today pulse; Reanimated for view toggle/cross-fade only |
| Storage | Zustand + MMKV for preferences |
| Dates | Civil `YYYY-MM-DD` strings; `date-fns` only |
| i18n | i18next + ICU plurals; English only for now |
| Testing | Jest + React Native Testing Library; Maestro planned |

## Project Structure

```md
src/
├── app/          # Expo Router route files and layouts; keep thin
├── features/     # grid, onboarding, settings
├── lib/          # civil-date, storage, theme, i18n, a11y
├── translations/ # en.json
└── global.css    # Uniwind entry and theme variables
```

## Core Rules

- Use `@/` absolute imports.
- Keep `src/app` route files thin; put behavior in `src/features/*` or `src/lib/*`.
- Keep `src/features/grid/lib/life-math.ts` as the single source of truth for life/date math.
- Do not let `Date` objects cross public life-math APIs; accept and return civil `YYYY-MM-DD` strings and integers.
- Use `src/lib/civil-date` for civil date parsing, validation, and `todayCivilDate()`.
- Future dots are one muted color; do not stage-tint future time.
- Bonus time starts at `WEEKS_TOTAL`; no today ring is drawn in bonus time.
- Preserve the five stage boundaries: `0-11`, `12-22`, `23-39`, `40-59`, `60-80`.
- Do not add `@date-fns/utc`, SQLite, cloud sync, analytics, ads, accounts, notifications, widgets, or IAP for v1.
- Store only preferences in MMKV: `dob`, `theme`, `defaultView`.
- User-facing strings go through `src/translations/en.json`; count-bearing strings use ICU plurals.
- Prefer Uniwind `className` and shared theme tokens over ad hoc inline styles.
- Keep generated native folders (`android/`, `ios/`) out of app logic.

## Verification Before Completing Tasks

- Prefer `pnpm verify` before handoff.
- For narrow changes, run the smallest useful subset: `pnpm lint`, `pnpm lint:ts`, targeted `pnpm test`, or `pnpm lint:translations`.
- Run grid/date tests when touching `life-math`, `dot-states`, `grid-layout`, or `stage-colors`.
- Run translation lint when editing `src/translations/en.json`.
- State any skipped checks and the reason.

## Commands

```bash
pnpm dev
pnpm verify
pnpm test
pnpm lint
pnpm lint:ts
pnpm lint:translations
pnpm knip:check
pnpm e2e-test
```

## Agent Skills

- `.claude/skills/uniwind` and `.agents/skills/uniwind`: use when styling React Native components with Uniwind/Tailwind classes.
- `.claude/skills/dot-to-dust-grid` and `.agents/skills/dot-to-dust-grid`: use when changing life math, dot states, grid layout, stage colors, or headline behavior.

## Reference Docs

| Topic | File |
|---|---|
| Domain language and product terms | [`CONTEXT.md`](CONTEXT.md) |
| Architecture, routing, modules | [`.docs/architecture.md`](.docs/architecture.md) |
| Feature map and current screens | [`.docs/features.md`](.docs/features.md) |
| Setup, env, commands | [`.docs/setup.md`](.docs/setup.md) |
| Testing strategy | [`.docs/testing.md`](.docs/testing.md) |
| Build profiles and release checklist | [`.docs/release.md`](.docs/release.md) |
| Product decisions | [`plans/PRD.md`](plans/PRD.md) |
| Implementation plan | [`plans/implementation-plan.md`](plans/implementation-plan.md) |
