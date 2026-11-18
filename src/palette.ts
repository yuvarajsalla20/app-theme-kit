import { contrast, hexToHsl, hsl, readableOn } from './color';

/**
 * The base colours every app needs, made from ONE app colour. Light and dark versions share these names, so screens
 * just read `p.accent`, `p.card`, ... and work in both. An app adds its own extra colours on top (status, data colours).
 */
export interface BaseTokens {
  scheme: 'light' | 'dark';
  /** Page background. */
  bg: string;
  /** Slightly different background for grouped areas. */
  panel: string;
  /** Cards and sheets. */
  card: string;
  /** Inputs and pressed rows. */
  sunk: string;
  /** Hairlines and borders. */
  line: string;
  text: string;
  muted: string;
  faint: string;
  /** THE app colour: buttons, links, the chosen tab. */
  accent: string;
  /** A soft wash of the app colour: chips, icon circles, highlights. */
  accentSoft: string;
  /** Text and icons on `accent`. */
  onAccent: string;
  /** Two-stop soft tint for hero cards (the "soft tint" gradient). */
  tint: [string, string];
  /** Three-stop gentle gradient for main buttons (near flat). */
  grad: [string, string, string];
  /** Shadow colour. */
  shadow: string;
  /** Dimmed backdrop behind menus. */
  scrim: string;
}

export interface PaletteSeed {
  /** The app colour as shown in light mode, e.g. '#1F7A5C'. */
  brand: string;
  /** The app colour in dark mode. Default: the same hue, lighter, so it reads on a dark background. */
  brandDark?: string;
  /** Replace any made-up colour with your own (per look). */
  light?: Partial<BaseTokens>;
  dark?: Partial<BaseTokens>;
}

/** Turns one app colour into full light and dark palettes. Neutrals carry a hint of the app colour's hue. */
export function makePalettes(seed: PaletteSeed): { light: BaseTokens; dark: BaseTokens } {
  const { h, s } = hexToHsl(seed.brand);
  const ns = Math.min(s, 40); // neutrals: a whisper of the hue, never loud
  const brandDark = seed.brandDark ?? hsl(h, Math.min(s, 55), 62);
  const shift = (hex: string, dl: number) => {
    const c = hexToHsl(hex);
    return hsl(c.h, c.s, c.l + dl);
  };

  const light: BaseTokens = {
    scheme: 'light',
    bg: hsl(h, ns * 0.9, 98),
    panel: hsl(h, ns * 0.8, 96),
    card: '#FFFFFF',
    sunk: hsl(h, ns * 0.75, 94),
    line: hsl(h, ns * 0.7, 88),
    text: hsl(h, ns, 14),
    muted: hsl(h, ns * 0.35, 42),
    faint: hsl(h, ns * 0.3, 62),
    accent: seed.brand.toUpperCase(),
    accentSoft: hsl(h, Math.min(s, 50), 92),
    onAccent: readableOn(seed.brand),
    tint: [hsl(h, Math.min(s, 45), 94), hsl(h, Math.min(s, 40), 87)],
    grad: [shift(seed.brand, 5), seed.brand.toUpperCase(), shift(seed.brand, -5)],
    shadow: hsl(h, Math.min(s, 50), 22),
    scrim: 'rgba(0,0,0,0.30)',
    ...seed.light,
  };

  const bgDark = hsl(h, ns * 0.5, 7);
  const dark: BaseTokens = {
    scheme: 'dark',
    bg: bgDark,
    panel: hsl(h, ns * 0.5, 9),
    card: hsl(h, ns * 0.45, 11),
    sunk: hsl(h, ns * 0.4, 14),
    line: hsl(h, ns * 0.35, 19),
    text: hsl(h, ns * 0.75, 93),
    muted: hsl(h, ns * 0.35, 63),
    faint: hsl(h, ns * 0.3, 46),
    accent: brandDark.toUpperCase(),
    accentSoft: hsl(h, Math.min(s, 40), 16),
    onAccent: contrast(brandDark, bgDark) >= 4.5 ? bgDark : readableOn(brandDark),
    tint: [hsl(h, Math.min(s, 40), 16), hsl(h, Math.min(s, 30), 10)],
    grad: [shift(brandDark, 5), brandDark.toUpperCase(), shift(brandDark, -5)],
    shadow: '#000000',
    scrim: 'rgba(0,0,0,0.55)',
    ...seed.dark,
  };
  return { light, dark };
}
