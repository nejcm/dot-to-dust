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

Preview store release builds and auto-submits the resulting artifacts:

```bash
pnpm release:preview:ios
pnpm release:preview:android
```

To submit an existing latest preview build instead, use:

```bash
pnpm submit:preview:ios
pnpm submit:preview:android
```

Do not run both flows for the same artifact. When multiple preview builds exist, submit by explicit EAS build ID instead of `--latest`.

## Environment Selection

Each EAS profile sets `EXPO_PUBLIC_APP_ENV`.

Local prebuild helpers run with strict env validation:

```bash
pnpm prebuild:development
pnpm prebuild:preview
pnpm prebuild:production
```

Validate resolved preview config before store submission:

```bash
cross-env EXPO_PUBLIC_APP_ENV=preview pnpm expo config --type public
```

Confirm the preview bundle/package ids and EAS project ID in the output.

## Store Prerequisites

- App Store Connect app record and iOS credentials must exist before TestFlight submission.
- Google Play Console app record must exist before Play Internal Testing submission.
- Google Play service-account credentials must be configured outside git, through EAS credentials/secrets or a local ignored file.
- Do not commit service-account JSON, API keys, or store credentials.
- Google Play may require the first app bundle upload to be completed manually in Play Console.

## Release Checklist

1. Run `pnpm verify`.
2. Confirm `app.config.ts`, `env.ts`, and `eas.json` changes are intentional.
3. Confirm bundle/package ids match the target environment.
4. Confirm onboarding, grid, settings, theme, and relaunch behavior on device.
5. Confirm "Dot to Dust" trademark/store-name checks before production submission.
6. Build the correct EAS profile.
7. Submit preview builds to TestFlight and Google Play Internal Testing before production.

## Platform Notes

- Prefer Expo config plugins over direct native edits.
- Keep `android/` and `ios/` generated.
- `runtimeVersion` follows `appVersion`.
- OTA updates are configured with the committed EAS project ID; `EAS_PROJECT_ID` can override it locally.
- The EAS project is `@ncncm/dot-to-dust`; `app.config.ts` includes its project ID.
- Preview Android builds use AAB output so they can be submitted to Google Play Internal Testing.
