import { toNavTheme } from '../nav-theme';
import { darkTokens, lightTokens, toHex } from '../tokens';
import { getPressedStyle } from '../utils/get-pressed-style';
import { stageForRatio } from '../utils/stage-color';

// ─── getPressedStyle ─────────────────────────────────────────────────────────

const notPressed = { pressed: false, hovered: false };
const isPressed = { pressed: true, hovered: false };

describe('getPressedStyle', () => {
  it('returns base style unchanged when not pressed', () => {
    const result = getPressedStyle(notPressed, { minHeight: 44 });
    expect(result).toEqual([{ minHeight: 44 }, false]);
  });

  it('appends opacity 0.6 when pressed', () => {
    const result = getPressedStyle(isPressed, { minHeight: 44 });
    expect(result).toEqual([{ minHeight: 44 }, { opacity: 0.6 }]);
  });

  it('works without a base style when not pressed', () => {
    const result = getPressedStyle(notPressed);
    expect(result).toEqual([undefined, false]);
  });

  it('works without a base style when pressed', () => {
    const result = getPressedStyle(isPressed);
    expect(result).toEqual([undefined, { opacity: 0.6 }]);
  });
});

// ─── stageForRatio ───────────────────────────────────────────────────────────

describe('stageForRatio', () => {
  it('returns 0 at ratio 0 (age 0)', () => {
    expect(stageForRatio(0)).toBe(0);
  });

  it('returns 0 just below the age-12 boundary (age 11)', () => {
    // age 11 = floor(11/80 * 80) — still stage 0
    expect(stageForRatio(11 / 80)).toBe(0);
  });

  it('returns 1 at the age-12 boundary', () => {
    expect(stageForRatio(12 / 80)).toBe(1);
  });

  it('returns 1 just below the age-23 boundary (age 22)', () => {
    expect(stageForRatio(22 / 80)).toBe(1);
  });

  it('returns 2 at the age-23 boundary', () => {
    expect(stageForRatio(23 / 80)).toBe(2);
  });

  it('returns 2 just below the age-40 boundary (age 39)', () => {
    expect(stageForRatio(39 / 80)).toBe(2);
  });

  it('returns 3 at the age-40 boundary', () => {
    expect(stageForRatio(40 / 80)).toBe(3);
  });

  it('returns 3 just below the age-60 boundary (age 59)', () => {
    expect(stageForRatio(59 / 80)).toBe(3);
  });

  it('returns 4 at the age-60 boundary', () => {
    expect(stageForRatio(60 / 80)).toBe(4);
  });

  it('returns 4 at ratio 1 (age 80)', () => {
    expect(stageForRatio(1)).toBe(4);
  });

  it('clamps ratio below 0 to stage 0', () => {
    expect(stageForRatio(-0.5)).toBe(0);
  });

  it('clamps ratio above 1 to stage 4', () => {
    expect(stageForRatio(1.5)).toBe(4);
  });
});

// ─── toNavTheme ──────────────────────────────────────────────────────────────

describe('toNavTheme', () => {
  it('maps light token colors to the nav theme', () => {
    const theme = toNavTheme(lightTokens, false);
    expect(theme.colors.background).toBe(toHex(lightTokens.bg));
    expect(theme.colors.card).toBe(toHex(lightTokens.surface));
    expect(theme.colors.text).toBe(toHex(lightTokens.ink));
    expect(theme.colors.border).toBe(toHex(lightTokens.hairline));
    expect(theme.colors.primary).toBe(toHex(lightTokens.accent));
    expect(theme.colors.notification).toBe(toHex(lightTokens.accent));
  });

  it('maps dark token colors to the nav theme', () => {
    const theme = toNavTheme(darkTokens, true);
    expect(theme.colors.background).toBe(toHex(darkTokens.bg));
    expect(theme.colors.card).toBe(toHex(darkTokens.surface));
    expect(theme.colors.text).toBe(toHex(darkTokens.ink));
    expect(theme.colors.border).toBe(toHex(darkTokens.hairline));
  });

  it('returns valid hex color strings', () => {
    const theme = toNavTheme(lightTokens, false);
    const HEX = /^#[\da-f]{6}$/i;
    expect(theme.colors.background).toMatch(HEX);
    expect(theme.colors.card).toMatch(HEX);
    expect(theme.colors.text).toMatch(HEX);
    expect(theme.colors.border).toMatch(HEX);
    expect(theme.colors.primary).toMatch(HEX);
  });

  it('light and dark produce different background colors', () => {
    const light = toNavTheme(lightTokens, false);
    const dark = toNavTheme(darkTokens, true);
    expect(light.colors.background).not.toBe(dark.colors.background);
  });

  it('is deterministic', () => {
    const a = toNavTheme(lightTokens, false);
    const b = toNavTheme(lightTokens, false);
    expect(a.colors.background).toBe(b.colors.background);
    expect(a.colors.text).toBe(b.colors.text);
  });
});
