# app-theme-kit

One **app colour** turned into full **light and dark palettes**, a **System / Light / Dark** choice saved on the phone, and a ready **Appearance** page. For React Native / Expo apps. Nothing in it is specific to any one app: an app passes its own colour (the placeholder), and nothing changes for apps that don't use the kit.

**Current version: 1.1.0** (tag `v1.1.0`). First used by **PAL – Personal Asset Locker** (emerald). The release history is in [CHANGELOG.md](CHANGELOG.md).

Part of the shared kits:
[app-core-kit](https://github.com/yuvarajsalla20/app-core-kit) ·
[app-auth-kit](https://github.com/yuvarajsalla20/app-auth-kit) ·
[app-account-kit](https://github.com/yuvarajsalla20/app-account-kit) ·
[app-settings-kit](https://github.com/yuvarajsalla20/app-settings-kit) ·
[app-subscriptions-kit](https://github.com/yuvarajsalla20/app-subscriptions-kit) ·
[app-payments-kit](https://github.com/yuvarajsalla20/app-payments-kit) ·
[app-export-kit](https://github.com/yuvarajsalla20/app-export-kit) ·
[app-guard-kit](https://github.com/yuvarajsalla20/app-guard-kit) ·
**app-theme-kit** ·
[app-invite-kit](https://github.com/yuvarajsalla20/app-invite-kit) ·
[app-goldrates-api-kit](https://github.com/yuvarajsalla20/app-goldrates-api-kit)

Tools that work alongside them: [code-review-kit](https://github.com/yuvarajsalla20/code-review-kit) (reviews) and app-insights-kit (store numbers, private).

## The idea

Every app should have **one** colour (like Claude is orange). The kit takes that one colour and makes:

| Token | What it is |
|---|---|
| `accent` | the app colour: buttons, links, the chosen tab |
| `accentSoft` | a soft wash of it: chips, icon circles |
| `onAccent` | readable text/icons on `accent` |
| `bg`, `panel`, `card`, `sunk`, `line` | backgrounds and borders, with a hint of the app colour's hue |
| `text`, `muted`, `faint` | text greys |
| `tint` | 2-stop soft tint for hero cards |
| `grad` | 3-stop gentle (near flat) gradient for main buttons |
| `shadow`, `scrim` | shadow and backdrop |

…in a light and a dark version with the same names, so screens never check which look is on.

## Install

Pin by the full SHA of a release tag (never a branch):

```bash
npm install "git+https://github.com/yuvarajsalla20/app-theme-kit.git#<full SHA of v1.1.0>"
```

Record the tag in `kitVersions` (`"app-theme-kit": "v1.1.0"`). Find the SHA with `git ls-remote https://github.com/yuvarajsalla20/app-theme-kit refs/tags/v1.1.0`.

Peer dependencies: `react`, `react-native`, `@expo/vector-icons`. In `app.json` set `"userInterfaceStyle": "automatic"` so System can follow the phone (needs a new native build).

## How an app uses it

```tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createThemeKit, makePalettes } from 'app-theme-kit';

// 1. The placeholder: your one colour (and, if you like, its dark-mode version).
const base = makePalettes({ brand: '#1F7A5C', brandDark: '#6FD0AA' });

// 2. Add your own extra colours (status, data colours...) for each look.
const LIGHT = { ...base.light, up: '#2F9E55', down: '#B4473C' };
const DARK = { ...base.dark, up: '#8BE0A6', down: '#F0897E' };

// 3. Make the theme.
export const theme = createThemeKit({ light: LIGHT, dark: DARK, storage: AsyncStorage, storageKey: 'myapp.theme' });
export const { ThemeProvider, usePalette, useThemeChoice, AppearancePage, choiceLabel } = theme;
```

Wrap the app in `<ThemeProvider>`, read colours with `usePalette()`, and put `<AppearancePage />` on a Settings page (optional `cardStyle` prop adds your own style to its card, e.g. a border; nothing by default) (in app-settings-kit, an `extraPages` entry under Preferences, with `value: choiceLabel(useThemeChoice().choice)`).

**With app-settings-kit 8.0.0 or later**, pass the choice to its built-in Appearance row instead of placing the page yourself:

```tsx
const { choice, setChoice } = useThemeChoice();
<AppSettings … appearance={{ value: choice, onChange: setChoice }} />
```

Appearance is one of the two optional rows in app-settings-kit (with Security); the settings kit draws the row and its page.

Plain (no React Native) entry points for tests and pure code: `app-theme-kit/palette` (makePalettes), `app-theme-kit/color`, `app-theme-kit/choice`.

Options: `initial` (default `'system'`), `strings` (every word), `components.Text` (your font). Override any made-up colour with `makePalettes({ brand, light: { card: '#FAFAFA' }, dark: { ... } })`.

## Rules it follows

- No pop-ups: the Appearance page is three rows with a tick.
- Text on every generated palette passes contrast checks (tests run five very different colours).
- No app's colours, names or fonts are in the kit; apps opt in.
- `KIT_VERSION` in `src/kit.ts` equals `package.json` (a test checks it).

## Later (not built)

- An optional "choose your app colour" row for people using the app.

## Writing rule

Every word this kit shows, and every line of its documentation, follows the shared [Writing rule](https://github.com/yuvarajsalla20/app-settings-kit#writing-rule-every-word-is-professional): Title Case for titles, rows and buttons; calm, complete sentences for captions and messages; "e.g.," for examples; no chatty fragments, slang or exclamation marks. Apps do not override these words; a change is made in the kit so that every app receives it.
