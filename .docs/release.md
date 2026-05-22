# Release

## Build Profiles

EAS profiles are defined in `eas.json`.

- `development`: internal development client builds
- `preview`: store-distributed QA builds
- `production`: store builds with auto-incrementing versioning
- `simulator`: iOS simulator-oriented development profile

## Common Commands

```bash
pnpm build:development:ios
pnpm build:development:android
pnpm build:preview:ios
pnpm build:preview:android
pnpm build:production:ios
pnpm build:production:android
```

## Environment Selection

Each EAS profile sets `EXPO_PUBLIC_APP_ENV`.

Local prebuild helpers run with strict env validation:

```bash
pnpm prebuild:development
pnpm prebuild:preview
pnpm prebuild:production
```

## Release Checklist

1. Run `pnpm verify`.
2. Confirm `app.config.ts`, `env.ts`, and `eas.json` changes are intentional.
3. Confirm bundle/package ids match the target environment.
4. Confirm onboarding, grid, settings, theme, and relaunch behavior on device.
5. Confirm "Dot to Dust" trademark/store-name checks before production submission.
6. Build the correct EAS profile.

## Platform Notes

- Prefer Expo config plugins over direct native edits.
- Keep `android/` and `ios/` generated.
- `runtimeVersion` follows `appVersion`.
- OTA updates are configured only when `EAS_PROJECT_ID` is present.
