# Dot to Dust — Product Requirements

> Companion to [implementation-plan.md](./implementation-plan.md). The plan covers *how*; this document covers *what* and *why*. Where the two disagree, the plan wins (it carries the resolved grilling decisions).

## Problem Statement

People in the target audience (English-speaking, smartphone-native) intellectually know their life is finite but rarely *feel* it. Existing memento-mori tools fall into two failure modes:

- **Calculator-grade utility** — "weeks lived" counters that present a number and stop. The number is forgettable; the app gets uninstalled the same week.
- **Generic productivity skins** — life-grid widgets bolted onto habit trackers or journaling apps, where the grid is one feature competing for attention with checklists, streaks, and tags.

Neither produces the felt sense the user is actually after: a refined object on the home screen that, in a single glance, makes the boundary between *spent* and *unspent* time visible without ceremony.

## Solution

A three-screen iOS + Android app that renders the user's life as a single dot grid — past dots colored by life stage (a 5-band gradient), today marked with a ring, future dots muted into one undifferentiated color. The user picks a date of birth once, picks a view (Weeks / Months / Years), and from then on the app is a quiet visual object: editorial / quiet-luxury styling, no streaks, no notifications, no upsell, no account.

The product's distinguishing commitments:

- The **grid is the hero**; the headline is a slim caption, not a doomsday number.
- **80-year canvas**, fixed. Users who exceed it enter a "bonus time" state with a preserved gradient and a count-up headline (`+X weeks`).
- **Lightness-driven palette** so the 5-stage gradient remains legible under common color-vision deficiencies without a settings toggle.
- **Device-local data**, OS-backup-eligible. No cloud sync, no analytics-by-default, no account.

## User Stories

1. As a first-time user, I want a brief welcome screen before I'm asked for personal data, so the app feels like an intentional object rather than a form.
2. As a first-time user, I want to enter my date of birth with the platform-native picker, so the interaction feels familiar and fast.
3. As a first-time user, I want the app to reject future dates of birth, so I cannot accidentally enter a value that breaks the visualization.
4. As a first-time user older than 80, I want the app to launch directly into a meaningful state instead of refusing my date of birth, so I am not excluded by the app's design.
5. As a returning user, I want the app to open straight to the grid on subsequent launches, so my home-screen tap takes me to the visual immediately.
6. As a returning user, I want the grid to update silently when I bring the app to the foreground after time has passed, so the "today" marker is always honest.
7. As a daily user, I want today's dot to be visually distinguished with a ring, so I can locate "now" on the grid in under a second.
8. As a daily user on the Weeks or Months view, I want today's ring to pulse subtly, so the app's "alive" quality is felt without being a UI affordance.
9. As a user on the Years view, I want today's ring to be static, so the coarse-grained view does not turn the ring into a tap-target affordance.
10. As a user with reduced-motion enabled at the OS level, I want both the pulse and the view-switch animation to respect that setting, so the app does not cause vestibular discomfort.
11. As a user, I want to toggle between Weeks, Months, and Years views via a segmented control at the top of the screen, so I can pick the granularity that matches my mood.
12. As a user, I want the grid to fit on screen with no scrolling in all three views, so the "life in one glance" promise is preserved.
13. As a user, I want the headline to read "X weeks/months/years ahead" matching the active view, so the framing is forward-looking without being saccharine.
14. As a user in bonus time (past week 4160), I want the headline to count up as `+X weeks ahead`, so each unit beyond 80 reads as a gain.
15. As a user in bonus time, I want the dot grid to preserve the gradient of my lived life rather than collapse to a single color, so my past is not visually erased by an arbitrary lifespan cap.
16. As a user with red-green color vision deficiency, I want all 5 life-stage colors to remain distinguishable, so the visualization works for me without a settings toggle.
17. As a user, I want to switch between light, dark, and system themes from Settings, so the app fits the environment my phone is in.
18. As a user, I want light/dark to follow my OS by default (system), so the app does not impose a theme on install.
19. As a user, I want my first view of the grid to be the Weeks view, so I see the most iconic and information-dense version of my life first.
20. As a user, I want to set a different default view in Settings, so subsequent app opens land me where I prefer.
21. As a user who mistyped my date of birth, I want to correct it from the Settings DOB row, so I do not have to reinstall the app.
22. As a user, I want my date of birth and preferences to survive a phone upgrade or OS restore via iCloud/Google Auto Backup, so I do not have to re-onboard on a new device.
23. As a user, I want the app to remain readable when I increase the OS text size, so accessibility settings affect non-grid text appropriately.
24. As a user, I want the app to launch from cold without flashing the welcome screen if I have already onboarded, so the first frame after a tap is correct.
25. As a user, I want no notifications, no daily streaks, no account, no in-app purchases, and no ads, so the app remains a quiet object I trust on my home screen.
26. As a user, I want the future part of the grid to be a single muted color, so the visual contrast between *lived* and *unlived* time is the dominant signal.
27. As a user travelling across timezones, I want today's dot to track the local civil date rather than UTC, so the "today" marker stays correct in the place I am.
28. As a user, I want a 240ms cross-fade between views when toggling, so transitions feel intentional rather than abrupt — and zero-duration when reduced-motion is on.
29. As a designer of my own home screen, I want the headline subordinated to the grid, so what I read first is the visualization, not a number.

## Implementation Decisions

### Module sketch

The implementation reduces to four deep modules with simple, testable interfaces. None of them carries UI state; UI is a thin layer over these.

1. **`life-math`** — Pure functions over civil dates (`YYYY-MM-DD` strings). Single source of truth for `weeksLived`, `monthsLived`, `yearsLived`, `stageForWeek`, `isBonusTime`, `remainingFor`, `bonusUnitsAhead`. No dependencies on Date, timezone libraries, or storage. Operates purely on string inputs and integer outputs.
2. **`grid-layout`** — Pure function `(view, canvasWidth, canvasHeight) → { cols, rows, dotSize, gap }` that fits the dot field to available space without scrolling. No knowledge of dot state or colors.
3. **`stage-colors`** — A lightness-driven palette definition. Exports an L array first (e.g., `[35, 45, 55, 65, 75]` for light, mirrored for dark); hue and chroma layered on for warmth but never carrying signal. Exposed as CSS variables consumed by Uniwind and Skia.
4. **`preferences-store`** — Zustand store backed by MMKV with synchronous hydration on module load. Holds `{ dob, theme, defaultView }`. Zod schema at the boundary; parse failure falls back to `dob === null`.

A fifth narrower module — **`use-reduced-motion`** — exposes a single boolean hook shared by both the Skia pulse path and the Reanimated view-switch path, keeping the a11y contract in one place.

### Decisions

- **Lifespan is fixed at 80 years.** Users who exceed it enter a bonus-time state in v1 — gradient preserved across all 4160 dots, no today-ring, headline counts up as `+X`. Bonus state is one boolean in the render path; `stageForWeek` math is unchanged through week 4159.
- **Life stages are 0–11 / 12–22 / 23–39 / 40–59 / 60–80**, floored by completed-year. Week 624 is the last childhood week; week 625 is the first adolescence week.
- **Today's dot uses the last-lived stage color with a ring on top.** Pulse renders on Weeks and Months; the Years view uses a static ring because the dot is large enough to read as a tap target if animated. In bonus time, no ring is drawn anywhere.
- **Future dots are a single muted color.** No stage tinting in the future half; the visual contrast between lived (rich gradient) and unlived (fog) is the dominant signal.
- **Palette is lightness-driven**, encoded primarily by OKLCH L. Hue and chroma layered on for warmth/character but not for signal. No CVD toggle in Settings; the palette is robust by design.
- **DOB is a civil date (`YYYY-MM-DD`).** No UTC conversion anywhere. `date-fns` is in scope; `@date-fns/utc` is explicitly out. Today is derived from `new Date()` in the device's local zone and converted to a civil-date string before being passed to `life-math`.
- **Today recomputes on app foreground only**, via an `AppState` listener in `(app)/_layout.tsx`. No midnight timer — the test/teardown surface is not worth it for an app that visibly changes once a week at most.
- **DOB validation is permissive on the past.** `maximumDate = today` is the only hard rule; any past date including >80 years is accepted and routes into bonus time on launch.
- **The picker is the platform default** (`@react-native-community/datetimepicker`). No custom date-picker UI in v1.
- **Onboarding is two steps**: a welcome screen with a single display-serif line and a "Begin" button, then the picker.
- **MMKV hydrates synchronously** at module load so the gate in `app/index.tsx` does not flash onboarding before the store resolves.
- **No explicit "reset all data" affordance.** The Settings DOB row is both edit and reset path. Corrupt or zod-invalid persisted state falls back silently to onboarding.
- **OS backup is in scope** (iCloud, Android Auto Backup). The phrase "device-local only" in this product refers to the absence of a cloud sync service we operate, not to the absence of OS backup.
- **Reduced-motion gates pulse + view-switch cross-fade.** Pulse paints at constant 0.8 opacity; view-switch becomes an instant key-swap (still mount/unmount, just no tween). Route transitions defer to OS-level attenuation.
- **The pulse animation lives entirely inside Skia**, driven by Skia's own clock (`useClock` / `useComputedValue`). Reanimated is not bridged into the pulse path. Reanimated remains the owner of the segmented-control thumb and the view-switch cross-fade — two animation systems, clean boundary, no shared state.
- **Headline framing is "ahead", not "left".** ICU plurals for count-bearing English strings. Bonus-time copy is `every week is bonus`.
- **Grid is the visual hero**; headline is a slim Inter caption docked at the top alongside the segmented control. Skia owns the rest of the canvas.
- **Defaults on first launch**: theme = system, defaultView = weeks, dob = null.

### Type shapes that encode decisions

```ts
// life-math.ts — civil-date inputs, integer outputs, no Date objects in the surface.
type View = 'weeks' | 'months' | 'years';

function weeksLived(dob: string, today: string): number;
function stageForWeek(weekIndex: number): 0 | 1 | 2 | 3 | 4;
function isBonusTime(dob: string, today: string): boolean;
function bonusUnitsAhead(view: View, dob: string, today: string): number;

// Dot state seen by the grid component — the only shape it understands.
type DotState =
  | { stage: 0 | 1 | 2 | 3 | 4; isToday: boolean }
  | { kind: 'future' };
```

In bonus time, no dot carries `isToday: true`; every dot is a `{ stage, isToday: false }`. This makes "no ring drawn anywhere" a property of the data, not a special case in the renderer.

## Testing Decisions

A good test in this codebase asserts external behavior of a pure function against a fixed input. The four deep modules above were chosen specifically because they push every interesting decision into pure, civil-date-string-in / integer-or-color-out functions that need no mocks, no fake timers, and no test renderers. Tests that reach into internal state, or that re-implement the math they're testing inside the assertion, are explicitly discouraged.

Modules covered by Jest in v1:

- **`life-math`** — the spine. Tests cover: DOB on a leap day (Feb 29) viewed in a non-leap year; newborn DOB (today) renders all-future without divide-by-zero; DOB exactly 79.99 years ago (just before bonus time); DOB at week 4160 (bonus-time entry); DOB > 80 years ago (bonus time on launch); stage boundaries at the new cut points (week 624 → stage 0, week 625 → stage 1; analogous transitions at 22/23, 39/40, 59/60); civil-date math across a local DST transition; civil-date math when the device's timezone changes between writes (DOB entered in UTC+1, today computed in UTC-8).
- **`grid-layout`** — sample canvas widths for iPhone SE, iPhone 15 Pro, Pixel 6, Pixel 8 Pro; assert no overflow, `dotSize > 4`, gap > 0 for all three views.
- **`stage-colors`** — assert lightness monotonicity across the 5 stages in both light and dark mode. This is the test that protects the CVD-robustness commitment from being silently broken by a future palette tweak.

Modules **not** covered by Jest:

- **`preferences-store`** — deliberately omitted. The store mostly exercises library behavior (MMKV sync hydration, zod parse). Manual verification on cold launch is sufficient.
- **UI components** — visual correctness is verified via the Maestro happy path and the manual device-fit checklist in the implementation plan, not via snapshot tests.

Prior art: testing patterns mirror the sibling **Spendwise** project's `__tests__` colocation, Jest + `jest-expo` config, and the convention that the most heavily-tested module is the one carrying the domain math (`life-math` here, transaction/category math in Spendwise).

End-to-end coverage is one Maestro happy path covering: fresh install → welcome → picker → main → view-switch → settings → theme change → force-quit → relaunch lands on main without flashing onboarding.

## Out of Scope

- Notifications, widgets, watch app, cloud sync
- Country/gender-adjusted lifespan
- Days view
- Tagging individual dots with life events
- Account / paid tier / IAP themes
- Languages beyond English
- Color-blind specific palette toggle (palette is lightness-driven by design)
- Bespoke screen-reader grid labeling
- Custom date picker UI
- Explicit "reset all data" affordance (Settings DOB row covers it)
- Midnight rollover timer (foreground recompute is sufficient)
- Settings telemetry, analytics, or remote config

## Further Notes

- **Publishing status**: this PRD lives locally as `plans/PRD.md`. The project is not yet a git repository and has no configured issue tracker, so the standard `/to-prd` "publish to issue tracker + apply `ready-for-agent`" step did not run. When the repo is initialized, this PRD should be filed as the first issue against the new repository.
- **Pre-ship admin** (not engineering work): trademark check on "Dot to Dust" before production EAS submission.
- **Reference implementation**: tooling, scripts, and project structure mirror the sibling Spendwise project at `C:\Work\Personal\Spendwise`. Diverge only where documented (no `@date-fns/utc`, no SQLite, Skia clock instead of Reanimated for the pulse).
