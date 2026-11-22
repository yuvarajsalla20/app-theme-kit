import { withAlpha } from './color';
import { makePalettes, type BaseTokens } from './palette';

/** The eight colors an app sets for each look, e.g., in its colors.json. The same names the launch kit reads. */
export interface AppColors {
  bg: string;
  card: string;
  line: string;
  text: string;
  muted: string;
  accent: string;
  onAccent: string;
  accentSoft: string;
}

/** A full palette with the two status colors every kit needs. */
export type KitPalette = BaseTokens & {
  /** Erase Account, errors and the Cancel Subscription button. */
  danger: string;
  /** Switches that are on, and good news. */
  success: string;
};

const STATUS = {
  light: { danger: '#B3261E', success: '#1B7A3D' },
  dark: { danger: '#F2B8B5', success: '#7FD49A' },
} as const;

/**
 * 1.2.0: the app's two looks from its eight colors per look. The kit fills every other shade (panel, sunk, faint, tint,
 * gradients, shadow, scrim) and the status colors; an app may pass its own `danger` and `success` per look.
 */
export function palettesFromColors(colors: { light: AppColors; dark: AppColors }, status: { light?: Partial<Pick<KitPalette, 'danger' | 'success'>>; dark?: Partial<Pick<KitPalette, 'danger' | 'success'>> } = {}): { light: KitPalette; dark: KitPalette } {
  const made = makePalettes({ brand: colors.light.accent, brandDark: colors.dark.accent, light: { ...colors.light }, dark: { ...colors.dark } });
  return {
    light: { ...made.light, ...STATUS.light, ...status.light },
    dark: { ...made.dark, ...STATUS.dark, ...status.dark },
  };
}

/** The corner radius every kit card uses. */
export const KIT_RADIUS = 22;

/**
 * 1.2.0: every kit's theme made from one palette, so an app writes no color mapping of its own. Each object has the shape the
 * named kit takes (structurally, so this kit depends on none of them):
 *
 * - `account`: app-account-kit and app-settings-kit (Settings, `makePageHeader`, `makeHomeHeader`, `makeBackButton`)
 * - `auth`: app-auth-kit's sign-in screen
 * - `subscription`: app-subscriptions-kit's plans and Premium page
 * - `launch`: app-launch-kit's Welcome, tour, notifications prompt and Language page
 * - `crash`: app-core-kit's ErrorBoundary screen
 */
export function kitThemes(palette: BaseTokens & Partial<Pick<KitPalette, 'danger' | 'success'>>) {
  const dark = palette.scheme === 'dark';
  const p: KitPalette = { ...STATUS[palette.scheme], ...palette } as KitPalette;
  const tint = p.accent;
  return {
    account: {
      text: p.text,
      muted: p.muted,
      faint: p.faint,
      accent: p.accent,
      ink: p.onAccent,
      surface: p.card,
      border: p.line,
      line: p.line,
      field: p.sunk,
      panel: p.card,
      danger: p.danger,
      on: p.success,
      brand: p.accent,
      scrim: p.scrim,
      radius: KIT_RADIUS,
      shadow: p.shadow,
      soft: p.accentSoft,
      menu: withAlpha(p.card, dark ? 0.94 : 0.9),
      lock: { icon: p.accent, circle: p.accentSoft },
      tints: { account: tint, app: tint, about: tint, password: tint, data: tint, share: tint, rate: tint, privacy: tint, support: tint, version: p.muted },
    },
    auth: {
      bg: p.bg,
      surface: p.card,
      field: p.sunk,
      border: p.line,
      text: p.text,
      muted: p.muted,
      label: p.muted,
      accent: p.accent,
      primary: p.accent,
      onPrimary: p.onAccent,
      danger: p.danger,
    },
    subscription: {
      bg: p.bg,
      surface: p.card,
      border: p.line,
      text: p.text,
      muted: p.muted,
      accent: p.accent,
      onAccent: p.onAccent,
      premium: p.accent,
      onPremium: p.onAccent,
      premiumSoft: p.accentSoft,
      good: p.accentSoft,
      warn: p.accentSoft,
      radius: KIT_RADIUS,
      danger: p.danger,
      onDanger: dark ? p.bg : '#FFFFFF',
      success: p.success,
      hud: dark ? p.card : p.text,
      onHud: dark ? p.text : p.bg,
      hudAccent: p.accent,
    },
    launch: { bg: p.bg, card: p.card, line: p.line, text: p.text, muted: p.muted, accent: p.accent, onAccent: p.onAccent, accentSoft: p.accentSoft },
    crash: { bg: 'transparent', text: p.text, muted: p.muted, accent: p.accent },
    statusBar: dark ? ('light' as const) : ('dark' as const),
  };
}

export type KitThemes = ReturnType<typeof kitThemes>;
