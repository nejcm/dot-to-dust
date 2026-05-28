# Architecture

## High-Level Overview

Dot to Dust is a local-only Expo app. The product surface is intentionally small: onboarding captures date of birth, the main screen renders the life grid, and settings edits preferences.

Core layers:

- **Expo Router** for route files under `src/app`
- **Zustand + MMKV** for synchronous preference storage
- **Uniwind** for React Native styling
- **React Native Skia** for dot-grid rendering
- **i18next** for translatable copy and ICU plurals

## App Startup

`src/app/_layout.tsx` is the runtime entry point. It:

1. Loads Fraunces and Inter fonts.
2. Initializes i18n.
3. Imports `src/global.css` for Uniwind.
4. Mounts `ThemeProvider`.
5. Renders the Expo Router stack.

`src/app/index.tsx` gates the user by `dob`:

- `dob === null` -> `/(onboarding)`
- `dob !== null` -> `/(app)`

## Routing

- `src/app/index.tsx` routes to onboarding or app.
- `src/app/(onboarding)/index.tsx` shows the welcome screen.
- `src/app/(onboarding)/dob.tsx` persists DOB and enters the app.
- `src/app/(app)/index.tsx` renders the grid, headline, view toggle, and settings button.
- `src/app/(app)/settings.tsx` edits DOB, theme, and default view.

Route files should stay thin. Move reusable behavior into `src/features/*` or `src/lib/*`.

## Domain Modules

### `src/lib/civil-date`

Owns civil-date parsing, validation, formatting, and `todayCivilDate()`. It is the only place that should convert between `Date` and `YYYY-MM-DD`.

### `src/features/grid/lib/life-math.ts`

Single source of truth for:

- `LIFE_YEARS`, `WEEKS_TOTAL`, `MONTHS_TOTAL`, `YEARS_TOTAL`
- `weeksLived`, `monthsLived`, `yearsLived`
- `stageForWeek`
- `isBonusTime`
- `remainingFor`
- `bonusUnitsAhead`

Do not duplicate date math in UI components.

### `src/features/grid/lib/dot-states.ts`

Builds the flat dot array rendered by Skia:

- lived dot: `{ stage, isToday }`
- future dot: `{ kind: 'future' }`

In bonus time, every dot is lived and `isToday` is always false.

### `src/features/grid/lib/grid-layout.ts`

Fits all dots in the available canvas without scroll:

- Chooses the column count per measured canvas that maximizes dot size.
- Rows are derived from the active view's total dot count.

### `src/features/widget/lib/widget-snapshot.ts`

Builds the derived JSON model native widgets render:

- Uses the saved view, theme, DOB, and current civil date.
- Emits summary counts, progress, colors, optional Widget Grid data, and refresh dates.
- Keeps native widget code from reimplementing life math.

### `modules/dot-to-dust-widget`

Provides native widget integration:

- iOS writes the app-generated snapshot to App Group `UserDefaults`.
- WidgetKit extension templates read the same payload for small, medium, and large home-screen widgets.
- Android writes the app-generated snapshot to module `SharedPreferences`.
- Android AppWidget renders summary rows and draws the Widget Grid into a bitmap when there is room.

### `src/lib/storage/preferences-store.ts`

Persists `{ dob, theme, defaultView }` to MMKV using a plain JSON record. Invalid persisted state falls back to defaults.

## Styling And Theme

- `src/global.css` defines Uniwind entry imports and CSS variables.
- `src/lib/theme/tokens.ts` mirrors theme values for Skia.
- `ThemeProvider` resolves system/light/dark and calls `Uniwind.setTheme()`.
- Keep the palette lightness-driven; hue and chroma should not carry the stage signal.

## Privacy

No accounts, analytics, remote config, cloud sync, ads, or in-app purchases are in scope for v1. DOB and preferences stay local in MMKV, with normal OS backup behavior.
