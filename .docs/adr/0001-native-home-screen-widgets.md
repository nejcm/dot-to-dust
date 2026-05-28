# 0001 Native Home-Screen Widgets

## Status

Accepted

## Context

Dot to Dust needs an ambient surface that stays current. Static wallpaper export can become stale and conflicts with the product purpose. Home-screen widgets can be periodically refreshed by the OS and can open the app when tapped.

## Decision

Implement native home-screen widgets for iOS and Android. The app will write a compact derived widget snapshot, and native widget surfaces will render from that snapshot. Small widgets show summary progress. Medium and large widgets also show a Widget Grid when dots can render at least 2 px.

## Consequences

- The app gains platform-specific native widget code.
- Expo Go cannot validate the widget surfaces; dev-client/EAS builds are required.
- Native widget code avoids duplicating life math by reading the app-generated snapshot.
- Static wallpaper export remains out of scope for the core ambient surface.
