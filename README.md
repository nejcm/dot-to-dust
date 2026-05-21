# Dot to Dust

A mobile app (iOS + Android) that visualizes your life as a grid of colored dots — past stages, today marked, future muted. Make finite time *felt*, not abstract.

## Status

Pre-implementation. Planning complete; ready for scaffold phase.

- **[Implementation Plan](plans/implementation-plan.md)** — 15 build phases, architecture, tech stack, verification strategy
- **[PRD](plans/PRD.md)** — problem, solution, user stories, testing decisions, out of scope

## Quick Start (Coming Soon)

```bash
pnpm install
pnpm dev
```

## Tech Stack

- **Expo SDK 55+** + React Native 0.83 + React 19
- **expo-router** for routing
- **React Native Skia** for the dot grid canvas
- **Zustand + MMKV** for preferences (local only)
- **Uniwind** (Tailwind for RN) for styling
- **Jest + Maestro** for testing
- **pnpm** for package management

## Architecture

Four deep modules carry the domain logic:

1. **life-math** — pure civil-date math; weeks/months/years lived; stage boundaries
2. **grid-layout** — fit-to-screen dot grid math per view
3. **stage-colors** — lightness-driven 5-stage palette
4. **preferences-store** — persistent user prefs (MMKV-backed)

UI is a thin layer over these. See [implementation-plan.md](plans/implementation-plan.md#critical-modules) for details.

## Development

Follow the build phases in the implementation plan. Phase 1 scaffolds the project; phase 15 ships to TestFlight + Play Internal Testing.

Clone Spendwise tooling where applicable (ESLint, Husky, commitlint, Jest config, etc.).

## Pre-Ship Admin

- [ ] Trademark check: "Dot to Dust" in iOS/Android app stores + target jurisdictions

## License

MIT
