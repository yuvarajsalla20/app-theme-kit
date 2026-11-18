import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { contrast, hexToHsl, hsl, readableOn, withAlpha } from '../src/color';
import { isThemeChoice, pickLook } from '../src/choice';
import { KIT_VERSION } from '../src/kit';
import { makePalettes } from '../src/palette';

describe('kit', () => {
  it('KIT_VERSION matches package.json', () => {
    expect(KIT_VERSION).toBe(JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')).version);
  });
});

describe('colour helpers', () => {
  it('round-trips hex through HSL', () => {
    const c = hexToHsl('#1F7A5C');
    expect(hsl(c.h, c.s, c.l)).toBe('#1F7A5C');
  });
  it('contrast and readable text', () => {
    expect(contrast('#FFFFFF', '#000000')).toBeCloseTo(21, 0);
    expect(readableOn('#1F7A5C')).toBe('#FFFFFF');
    expect(readableOn('#F7FBF9')).toBe('#111111');
    expect(withAlpha('#1F7A5C', 0.5)).toBe('#1F7A5C80');
  });
  it('rejects a bad colour', () => {
    expect(() => hexToHsl('green')).toThrow();
  });
});

describe('choice', () => {
  it('follows the phone only on System', () => {
    expect(pickLook('system', 'dark')).toBe('dark');
    expect(pickLook('system', null)).toBe('light');
    expect(pickLook('light', 'dark')).toBe('light');
    expect(pickLook('dark', 'light')).toBe('dark');
    expect(isThemeChoice('dark')).toBe(true);
    expect(isThemeChoice('blue')).toBe(false);
  });
});

describe('makePalettes', () => {
  for (const brand of ['#1F7A5C', '#6B3FA0', '#2D5BB5', '#B05F6D', '#C99A45']) {
    it(`${brand}: text and buttons are readable in both looks`, () => {
      const { light, dark } = makePalettes({ brand });
      for (const p of [light, dark]) {
        expect(contrast(p.text, p.bg)).toBeGreaterThanOrEqual(7);
        expect(contrast(p.text, p.card)).toBeGreaterThanOrEqual(7);
        expect(contrast(p.muted, p.bg)).toBeGreaterThanOrEqual(3);
        expect(contrast(p.onAccent, p.accent)).toBeGreaterThanOrEqual(2.5);
      }
      expect(light.scheme).toBe('light');
      expect(dark.scheme).toBe('dark');
    });
  }
  it('keeps the app colour and takes overrides', () => {
    const { light, dark } = makePalettes({ brand: '#1f7a5c', brandDark: '#6FD0AA', light: { card: '#FAFAFA' } });
    expect(light.accent).toBe('#1F7A5C');
    expect(dark.accent).toBe('#6FD0AA');
    expect(light.card).toBe('#FAFAFA');
  });
});
