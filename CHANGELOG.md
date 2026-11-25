# Changelog

Upgrade notes for app-theme-kit, newest first. Each version is tagged in git (`v1.1.0`).

## 1.3.0 (2026-11-25)

Nothing breaks. `withAlpha` now uses app-core-kit's single copy of the alpha step (`app-core-kit/shared`), so the kits no longer carry copies that drift apart. It gives the same `#RRGGBBAA` result as before. New peer dependency: app-core-kit 1.11.0 or later, which every app on the kits already installs.

## 1.2.0 (2026-11-22)

- **Every kit's look from one palette.** `kitThemes(palette)` and the new `useKitThemes()` hook give the theme each kit takes (`account` for app-account-kit and app-settings-kit, `auth`, `subscription`, `launch`, `crash`) and the status bar style, so an app writes no color mapping of its own.
- **`palettesFromColors({ light, dark })`** makes both looks from the eight colors an app sets per look, with `danger` and `success` added.
- New entry point `app-theme-kit/kits` without React Native. Nothing changes for an app that does not use these.

## 1.1.0 (2026-11-19)

- `AppearancePage` takes an optional `cardStyle`, applied to the page's card (e.g., a thin border). Apps that do not pass it look exactly as before.

## 1.0.1 (2026-11-18)

- Plain entry points without React Native, for tests and pure code: `app-theme-kit/palette` (`makePalettes`), `app-theme-kit/color` and `app-theme-kit/choice`.

## 1.0.0 (2026-11-18)

- First release: one app colour becomes full light and dark palettes, a System, Light or Dark choice saved on the device, and a ready Appearance page.
