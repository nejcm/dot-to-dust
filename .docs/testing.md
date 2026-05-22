# Testing

## Test Stack

- Jest
- React Native Testing Library
- `jest-expo`
- Maestro planned for one happy path

## Commands

```bash
pnpm test
pnpm test:watch
pnpm test:ci
pnpm verify
pnpm install-maestro
pnpm e2e-test
```

## What To Cover

- Civil date parsing and validation.
- Life math around leap days, stage boundaries, bonus time, and future DOB rejection.
- Dot-state conversion for lived/future/bonus states.
- Grid layout fit across representative mobile canvas sizes.
- Stage color monotonicity.
- Preference persistence behavior when schema validation matters.
- UI interactions for onboarding, settings rows, headline, and view toggle.

## Expectations For Changes

- Add or update tests when changing `src/features/grid/lib/*` or `src/lib/civil-date`.
- Run targeted Jest tests for touched modules.
- Run `pnpm lint:translations` when translation JSON changes.
- Consider Maestro updates when onboarding, route gating, or main/settings flows change.

## Current Coverage Shape

Tests are colocated with source:

- `src/features/grid/__tests__`
- `src/lib/civil-date/__tests__`
- `src/lib/i18n/*.test.ts`
- `src/lib/storage/*.test.ts`
- component tests beside route/feature areas

Prefer behavior assertions over snapshots.
