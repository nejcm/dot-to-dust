import { darkTokens, lightTokens, toSkia } from '@/lib/theme/tokens';

function parseLightness(oklch: string): number {
  const match = oklch.match(/oklch\(\s*([\d.]+)/);
  if (!match) throw new Error(`Cannot parse lightness from: ${oklch}`);
  return Number.parseFloat(match[1]);
}

function expectHexColor(color: string): void {
  expect(color).toMatch(/^#[\da-f]{6}$/i);
}

describe('stage-colors lightness monotonicity', () => {
  it('light mode stages decrease in lightness from stage 0 to 4 (dawn → dusk)', () => {
    const lightnesses = lightTokens.stages.map(parseLightness);
    for (let i = 1; i < lightnesses.length; i++) {
      expect(lightnesses[i]).toBeLessThan(lightnesses[i - 1]);
    }
  });

  it('dark mode stages decrease in lightness from stage 0 to 4 (dawn → dusk)', () => {
    const lightnesses = darkTokens.stages.map(parseLightness);
    for (let i = 1; i < lightnesses.length; i++) {
      expect(lightnesses[i]).toBeLessThan(lightnesses[i - 1]);
    }
  });

  it('toSkia produces valid hex colors for all Skia tokens', () => {
    for (const tokens of [lightTokens, darkTokens]) {
      const skia = toSkia(tokens);
      skia.stages.forEach(expectHexColor);
      expectHexColor(skia.future);
      expectHexColor(skia.ring);
      expectHexColor(skia.accent);
    }
  });

  it('toSkia is deterministic', () => {
    const a = toSkia(lightTokens);
    const b = toSkia(lightTokens);
    expect(a.stages).toEqual(b.stages);
    expect(a.future).toBe(b.future);
    expect(a.ring).toBe(b.ring);
  });
});
