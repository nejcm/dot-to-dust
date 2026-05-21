# Dot to Dust — Implementation Plan

## Context

A mobile app that visualizes the user's life as a grid of colored dots — past stages colored by chapter (childhood → senior), future as muted potential, today highlighted. Inspired by Tim Urban's "Life in Weeks" and styled after a GitHub contributions chart. Goal: make finite time *felt*, not abstract, in one glance.

Must feel like a refined object you keep on your home screen — editorial / quiet luxury, not another generic template. Zero scope creep.

This plan adopts the conventions and tooling already proven in the sibling **Spendwise** project (`C:\Work\Personal\Spendwise`): pnpm, Expo + expo-router, TypeScript strict, Uniwind for styling, Zustand + MMKV for preferences, Jest + Maestro for tests, antfu ESLint config, Husky + commitlint + lint-staged, Knip for dead-code, EAS for builds.

## Locked decisions (post-grilling)

| Branch | Decision |
|---|---|
| Platform | iOS + Android via **Expo (React Native)** |
| Name | **Dot to Dust** (trademark check before production EAS submission) |
| Lifespan | Fixed **80 years**; post-80 = "bonus time" state in v1 |
| User input | **Date of birth** (single date picker). `maximumDate = today`; any past date accepted including >80y |
| Views | Toggle **Weeks / Months / Years** — all fit one screen, no scroll |
| Color encoding | **5-stage life gradient** on past+future dots only differs by spent/unspent; future is one muted color (no stage tinting) |
| Life stages | **0–11 · 12–22 · 23–39 · 40–59 · 60–80** (floor by completed-year) |
| Palette signal | **Lightness-driven** — stages encoded by OKLCH L first; hue/chroma for warmth, not signal. No CVD toggle. |
| Headline | "X weeks/months/years **ahead**" — matches active view. Bonus time: `+X` count-up. ICU plurals in en+de. |
| Visual weight | **Grid-as-hero** — grid fills primary canvas; headline is slim Inter caption; segmented control + caption top-docked. |
| Today's dot | Last-lived stage color + ring. **Pulse on Weeks/Months**; **static ring on Years**. No ring at all in bonus time. |
| Screens | **3**: Welcome+Onboarding · Main · Settings |
| Settings | Edit DOB · Theme (light/dark/system) · Default view |
| Defaults | `theme = system`, `defaultView = weeks`, `dob = null` |
| Storage | **MMKV**, OS backup-eligible (no cloud sync service operated by us). Sync hydration on module load. |
| Render | **React Native Skia** (canvas, GPU); pulse driven by Skia's own clock, not Reanimated |
| View toggle | **Segmented control** at top |
| Style | **Editorial / quiet luxury** — serif display, warm neutrals |
| Monetization | **Free**, no ads, no IAP |
| A11y | `useReducedMotion()` gates both pulse and view-switch cross-fade. Route transitions defer to OS defaults. Dynamic type for non-grid text. |
| Notifications | None in v1 |
| Timezone | DOB and "today" are civil dates (`YYYY-MM-DD`). No UTC conversion. Foreground-only recompute via `AppState`. |

## Tech stack (aligned with Spendwise)

### Runtime / framework
- **Expo SDK 55+** (managed workflow)
- **React Native 0.83+**, **React 19**
- **TypeScript 5.9** strict
- **expo-router** (file-based routing under `src/app`)

### State / storage
- **zustand** + **react-native-mmkv** — preferences (DOB, theme, defaultView). Synchronous hydration on module load.
- No SQLite needed — there is no relational data.

### UI / styling
- **uniwind** (Tailwind v4 for RN) with `className` — same as Spendwise
- **tailwind-variants** + **tailwind-merge** for variant styling
- **@shopify/react-native-skia** — grid canvas. Pulse uses `useClock` / `useComputedValue` (no Reanimated bridge).
- **react-native-reanimated** + **react-native-worklets** — segmented-control thumb + view-switch cross-fade only
- **react-native-gesture-handler**
- **react-native-safe-area-context**, **react-native-screens**, **react-native-edge-to-edge**
- **@react-native-community/datetimepicker** — DOB picker (platform defaults; no custom UI)
- **@expo-google-fonts/fraunces** (or **instrument-serif** via `expo-font`) — display headline
- **@expo-google-fonts/inter** — UI / caption

### i18n
- **i18next** + **react-i18next** + **expo-localization**
- Languages v1: **en**, **de** (parity required, mirrors Spendwise). Bonus-time + welcome copy flagged for native-de review.
- ICU plural rules across all count-bearing strings.

### Utilities
- **date-fns** — civil-date math only. **`@date-fns/utc` deliberately not used.**
- **es-toolkit** — lodash-tier helpers
- **zod** — DOB validation at the boundary; parse failure on persisted store treated as `dob === null`.

### Tooling (mirrors Spendwise)
- **pnpm 10** (`preinstall: only-allow pnpm`)
- **@antfu/eslint-config** with React + TS, kebab-case filenames
- **eslint-plugin-better-tailwindcss**, **eslint-plugin-react-compiler**, **eslint-plugin-react-hooks**, **eslint-plugin-unicorn**, **eslint-plugin-testing-library**, **eslint-plugin-i18n-json**
- **husky** + **commitlint** (conventional commits) + **lint-staged**
- **knip** for dead-code detection
- **jest** + **jest-expo** + **@testing-library/react-native**
- **maestro** for one happy-path E2E
- **eas.json** with `development`, `preview`, `production` profiles
- **cross-env** + `STRICT_ENV_VALIDATION=1` on prebuild (Spendwise pattern)
- **expo-dev-client** for dev builds
- **expo-updates** for OTA
- **expo-splash-screen**, **expo-status-bar**, **expo-system-ui**, **expo-constants**

## File structure

```
dot-to-dust/
├── .docs/
│   ├── architecture.md
│   ├── setup.md
│   ├── testing.md
│   └── release.md
├── .maestro/
│   └── happy-path.yaml
├── .vscode/settings.json
├── assets/
│   ├── fonts/                          # Fraunces / Inter weights
│   ├── splash.png
│   └── icon.png
├── plans/
│   └── implementation-plan.md          # this file
├── scripts/
│   └── i18next-syntax-validation.js
├── src/
│   ├── app/                            # expo-router (thin)
│   │   ├── _layout.tsx                 # providers, fonts, theme
│   │   ├── +html.tsx
│   │   ├── index.tsx                   # gate → onboarding or (app)
│   │   ├── onboarding/
│   │   │   ├── _layout.tsx
│   │   │   ├── welcome.tsx             # single-line display headline + Begin
│   │   │   └── dob.tsx                 # DOB picker → persist → (app)
│   │   └── (app)/
│   │       ├── _layout.tsx             # AppState listener for foreground recompute
│   │       ├── index.tsx               # main grid screen
│   │       └── settings.tsx
│   ├── features/
│   │   ├── grid/
│   │   │   ├── components/
│   │   │   │   ├── life-grid.tsx       # Skia canvas
│   │   │   │   ├── view-toggle.tsx     # segmented control (Reanimated thumb)
│   │   │   │   └── headline.tsx        # slim caption
│   │   │   ├── lib/
│   │   │   │   ├── life-math.ts        # weeksLived, stageFor, isBonusTime, etc.
│   │   │   │   ├── grid-layout.ts      # cols/rows/dot-size per view
│   │   │   │   └── stage-colors.ts     # lightness-driven 5-stage palette
│   │   │   └── __tests__/
│   │   │       ├── life-math.test.ts
│   │   │       ├── grid-layout.test.ts
│   │   │       └── stage-colors.test.ts
│   │   ├── onboarding/
│   │   │   └── components/
│   │   │       └── dob-picker.tsx
│   │   └── settings/
│   │       └── components/
│   │           ├── theme-row.tsx
│   │           ├── default-view-row.tsx
│   │           └── dob-row.tsx         # edit + reset path
│   ├── components/
│   │   └── ui/                         # primitives: button, row, sheet
│   ├── lib/
│   │   ├── storage/
│   │   │   ├── mmkv.ts
│   │   │   └── preferences-store.ts    # zustand store, MMKV-backed, sync hydration
│   │   ├── theme/
│   │   │   ├── tokens.ts
│   │   │   └── provider.tsx
│   │   ├── i18n/
│   │   │   ├── index.ts
│   │   │   └── use-translation.ts
│   │   └── a11y/
│   │       └── use-reduced-motion.ts   # consumed by pulse + view-switch
│   ├── translations/
│   │   ├── en.json
│   │   └── de.json
│   └── global.css                      # @import 'uniwind'
├── app.config.ts
├── babel.config.js
├── commitlint.config.js
├── eas.json
├── env.ts                              # zod-validated env
├── eslint.config.mjs
├── jest-setup.ts
├── jest.config.js
├── lint-staged.config.js
├── metro.config.js
├── package.json
├── pnpm-workspace.yaml
├── tsconfig.json
├── uniwind-types.d.ts
├── AGENTS.md
├── CLAUDE.md                           # → see AGENTS.md
├── CONTRIBUTING.md
├── README.md
└── LICENSE
```

## Critical modules

### `src/features/grid/lib/life-math.ts` — single source of truth

```ts
// All pure, exhaustively unit-tested. Civil-date inputs ('YYYY-MM-DD').
export const LIFE_YEARS = 80;
export const WEEKS_TOTAL  = LIFE_YEARS * 52;   // 4160
export const MONTHS_TOTAL = LIFE_YEARS * 12;   //  960
export const YEARS_TOTAL  = LIFE_YEARS;        //   80

export type View = 'weeks' | 'months' | 'years';

export function weeksLived(dob: string, today: string): number;
export function monthsLived(dob: string, today: string): number;
export function yearsLived(dob: string, today: string): number;

// Stage boundaries: 0-11 / 12-22 / 23-39 / 40-59 / 60-80.
// Floor by completed years: stageForWeek(624) === 0, stageForWeek(625) === 1.
export function stageForWeek(weekIndex: number): 0 | 1 | 2 | 3 | 4;

export function isBonusTime(dob: string, today: string): boolean;
export function remainingFor(view: View, dob: string, today: string): number;     // negative or zero in bonus time
export function bonusUnitsAhead(view: View, dob: string, today: string): number;  // 0 if not in bonus time
```

Every view renders from the same primitive: a flat array of dot states `{ stage: 0|1|2|3|4, isToday: boolean } | { kind: 'future' }`. The grid component knows nothing else. In bonus time the array is fully populated stage-by-stage with no `isToday` slot.

### `src/features/grid/lib/grid-layout.ts`

Computes `{ cols, rows, dotSize, gap }` per view to fit the available canvas with no scroll. Pre-computed on mount + dimension change.

- Weeks: 52 cols × 80 rows
- Months: 12 cols × 80 rows
- Years: 10 cols × 8 rows

### `src/features/grid/components/life-grid.tsx`

Single Skia `<Canvas>`. Iterates dot array, draws filled circles. Today's dot gets an animated ring on Weeks/Months and a static ring on Years; in bonus time, no ring is drawn anywhere. The pulse is driven by Skia's own clock via `useClock`/`useComputedValue` — Reanimated is **not** involved in the pulse path. Under reduced-motion, the computed value isn't mounted and the ring paints at constant 0.8 opacity.

### Palette (`src/features/grid/lib/stage-colors.ts`)

OKLCH-based, **lightness-driven**. The 5 stages are defined first as an L array (e.g., `[35, 45, 55, 65, 75]` in light mode, mirrored in dark); hue/chroma are layered on for warmth/character but do not carry the signal. A monotonicity invariant test in `stage-colors.test.ts` enforces this. Values are exposed as CSS variables in `global.css` so Uniwind can consume them and Skia reads via `useCSSVariable`.

Light mode:
- bg: `oklch(97% 0.01 80)`
- text: `oklch(22% 0.02 80)`
- 5 stages: warm earthy tones, lightness carries the gradient
- future dot: `oklch(90% 0.005 80)` (single muted color — no stage tinting)
- accent (today ring): `oklch(55% 0.18 30)` (terracotta)

Dark mode: hue-preserved inversion, same lightness monotonicity.

### `src/lib/storage/preferences-store.ts`

```ts
type Prefs = {
  dob: string | null;            // 'YYYY-MM-DD' civil date
  theme: 'light' | 'dark' | 'system';
  defaultView: 'weeks' | 'months' | 'years';
};
```

Zustand store backed by MMKV. Hydrates **synchronously** at module load (so the gate in `app/index.tsx` doesn't flash the wrong screen). Defaults: `theme = 'system'`, `defaultView = 'weeks'`, `dob = null`. A zod schema parses the stored value; parse failure or `dob === null` routes to onboarding. No explicit "reset all" affordance — the Settings DOB row is both edit and reset path.

### `src/lib/a11y/use-reduced-motion.ts`

Single hook returning a boolean, read by:
- the Skia pulse path (skip mounting the computed value when true)
- the view-switch cross-fade (instant key-swap when true; keep mount/unmount cycle)

Route transitions are not touched here — the OS attenuates them when the flag is on.

## Tooling configuration (mirrors Spendwise exactly where applicable)

- `package.json` scripts: `dev`, `start`, `android`, `ios`, `prebuild`, `lint`, `lint:ts`, `lint:translations`, `lint:all`, `test`, `test:ci`, `test:watch`, `verify`, `e2e-test`, `knip:check`, build profiles `build:{development,preview,production}:{ios,android}`
- `verify` = `lint && lint:ts && lint:translations && test`
- Husky `pre-commit` runs `lint-staged`; `commit-msg` runs `commitlint`
- `eslint.config.mjs` = antfu base + same plugins as Spendwise (better-tailwindcss, i18n-json, react-compiler, testing-library) + `unicorn/filename-case: kebabCase`
- `tsconfig.json` strict + `@/*` path alias to `src/*`
- `babel.config.js` includes `babel-plugin-module-resolver` for `@/`
- `app.config.ts` reads from `env.ts` (zod-validated); separate identifier per env (`com.ncncm.dottodust.dev`, `.preview`, production)
- `eas.json`: three profiles, `STRICT_ENV_VALIDATION=1` on prebuild scripts

## Build phases

1. **Scaffold** — `pnpm create expo-app dot-to-dust`, then port Spendwise's `package.json` deps/scripts, `eslint.config.mjs`, `tsconfig.json`, `babel.config.js`, `metro.config.js`, `commitlint.config.js`, `lint-staged.config.js`, `jest.config.js`, `jest-setup.ts`, husky hooks, `env.ts` skeleton, `eas.json`. Verify `pnpm verify` is green on the empty skeleton.
2. **Theme + tokens + Uniwind** — `global.css` with OKLCH variables for light/dark, Fraunces + Inter via `expo-font`, theme provider in `_layout.tsx`. Defaults `theme = system`.
3. **i18n** — `en.json` + `de.json` with all strings (welcome, picker, headline, bonus-time copy, settings). ICU plurals on every count-bearing string. ESLint i18n-json plugin enforces parity.
4. **`life-math.ts` + tests first (TDD)** — pure, full coverage. Civil-date semantics; bonus-time helpers; new stage boundaries.
5. **`grid-layout.ts` + tests** — fit-to-screen math for all 3 views.
6. **Onboarding** —
   - **6a**: welcome screen (display-serif headline + "Begin").
   - **6b**: DOB picker (`maximumDate = today`, platform defaults) → persist via preferences store → navigate to `(app)`.
7. **Static grid (weeks)** — Skia canvas, lightness-driven stage colors, single muted future color, no animation. Verify fit on iPhone SE, 15 Pro, Pixel 6, Pixel 8 Pro.
8. **Months + years views** — share grid component, different dot array.
9. **Segmented control + transitions** — Reanimated thumb + 240ms cross-fade between views, **gated on `useReducedMotion()`** (instant swap when true).
10. **Headline** — bind to active view, format remaining count via i18n ICU plurals ("X ahead"). Bonus-time variant emits `+X`.
11. **Today's dot ring + pulse** — **Skia clock drives the pulse**; gated on `useReducedMotion()`. Years view uses a static ring. Bonus-time draws no ring at all.
12. **Settings screen** — DOB row (re-opens picker, doubles as reset), theme row (Light/Dark/System), default view row.
13. **Polish** — splash, app icon (dot grid motif), spacing rhythm, dynamic type pass, CVD-simulation pass on stage palette, bonus-time visual check with a synthetic DOB.
14. **Tests & verify** — `pnpm verify` green, Maestro happy path passes.
15. **EAS Build** — preview channel → TestFlight + Play Internal Testing. Trademark check on "Dot to Dust" before production submission.

## Verification

`pnpm verify` (ESLint + tsc + translation lint + Jest) must be green.

Unit tests (Jest):
- `life-math.test.ts` — DOB on leap day; DOB today (newborn renders all-future, no divide hazard); DOB 79.99y ago; DOB exactly 80y ago (bonus-time entry at week 4160); DOB 81y+ ago (bonus-time on launch); stage boundaries at new cut points (11→12, 22→23, 39→40, 59→60); civil-date math across local DST transitions; civil-date math when device timezone changes after install.
- `grid-layout.test.ts` — sample widths; no overflow; `dotSize > 4` floor; gap > 0.
- `stage-colors.test.ts` — lightness monotonicity invariant across the 5 stages in both light and dark mode.
- `preferences-store.test.ts` — hydration is synchronous on module load; zod parse failure on stored `dob` resolves to `null` without throwing.

Maestro happy path (`.maestro/happy-path.yaml`):
1. Launch fresh install → **welcome screen** shows
2. Tap "Begin" → picker shows
3. Pick a DOB → advance to main
4. Assert headline contains "ahead" and a remaining count
5. Tap "Months" → grid changes, headline updates
6. Tap "Years" → grid changes, headline updates
7. Open settings → change theme to Dark → return → bg is dark
8. Force-quit + relaunch → lands on main (not welcome) with saved DOB, no flash

Manual checklist:
- [ ] Grid fully fits with no scroll on iPhone SE, 15 Pro, Pixel 6, Pixel 8 Pro
- [ ] Today's dot pulses on Weeks/Months and is a static ring on Years
- [ ] Pulse stops and view-switch is instant when OS reduced-motion is on
- [ ] Stage gradient distinguishable in both light and dark mode
- [ ] CVD simulation (Sim Daltonism or browser-extension equivalent on screenshots) — all 5 stages distinguishable under deuteranopia and protanopia
- [ ] Future dots present, single muted color, visually recede
- [ ] Headline + settings text scale with OS font size
- [ ] Bonus-time grid (synthetic DOB of `today − 81 years`): full gradient preserved, no today-ring, headline reads `+X weeks`
- [ ] Cold launch with valid persisted DOB does not flash welcome/onboarding
- [ ] No Reanimated layout errors, no console warnings
- [ ] `pnpm knip:check` reports no unused exports

## Pre-ship admin (not code; sign-off only)

- **App name trademark check** on "Dot to Dust" in iOS/Android app stores and target jurisdictions before production EAS submission.
- **Native-de copy review** for bonus-time string (`jede Woche ist Zugabe`), welcome headline (`Ein Leben, auf einen Blick`), and all ICU plural forms before TestFlight/Play Internal release.

## Out of scope (defer, do not build)

- Notifications, widgets, watch app, cloud sync
- Country/gender-adjusted lifespan
- Days view
- Tagging individual dots with life events
- Account / paid tier / IAP themes
- Languages beyond en + de
- Color-blind specific palette toggle (palette is lightness-driven by design)
- Bespoke screen-reader grid labeling
- Custom date picker UI (platform defaults are sufficient)
- Explicit "reset all data" affordance (DOB row covers it)
- Midnight rollover timer (foreground recompute is sufficient)
