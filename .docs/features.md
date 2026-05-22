# Features

## Onboarding

Files:

- `src/app/(onboarding)/index.tsx`
- `src/app/(onboarding)/dob.tsx`
- `src/features/onboarding/components/dob-picker.tsx`

Flow:

1. Welcome screen.
2. Native DOB picker.
3. Persist civil DOB via `usePreferencesStore`.
4. Replace route with `/(app)`.

Rules:

- Future DOB values are not valid.
- Past DOB values older than 80 years are valid and enter bonus time.
- Store DOB as `YYYY-MM-DD`.

## Main Grid

Files:

- `src/app/(app)/index.tsx`
- `src/features/grid/components/life-grid.tsx`
- `src/features/grid/components/headline.tsx`
- `src/features/grid/components/view-toggle.tsx`
- `src/features/grid/lib/*`

Behavior:

- Active view is `weeks`, `months`, or `years`.
- The grid fits the available screen with no scrolling.
- Headline uses the active view unit.
- Today ring pulses on weeks/months, stays static on years, and disappears in bonus time.
- Reduced motion disables pulse and cross-fade.

## Settings

Files:

- `src/app/(app)/settings.tsx`
- `src/features/settings/components/dob-row.tsx`
- `src/features/settings/components/theme-row.tsx`
- `src/features/settings/components/default-view-row.tsx`

Preferences:

- DOB
- Theme: `system`, `light`, `dark`
- Default view: `weeks`, `months`, `years`

## Internationalization

Files:

- `src/lib/i18n/index.ts`
- `src/lib/i18n/use-translation.ts`
- `src/translations/en.json`

Rules:

- All user-facing strings go through translations.
- Count-bearing strings use ICU plural syntax.
- Keep English sorted and lint-clean.

## Planned Or External

- Maestro happy path is wired by script name but no `.maestro` flow exists yet.
- `plans/` remains reference material; implementation should reflect current source first.
