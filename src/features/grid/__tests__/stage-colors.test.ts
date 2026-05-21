import { darkTokens, lightTokens } from '@/lib/theme/tokens';

function parseLightness(oklch: string): number {
  const match = oklch.match(/oklch\(\s*([\d.]+)%/);
  if (!match) throw new Error(`Cannot parse lightness from: ${oklch}`);
  return Number.parseFloat(match[1]);
}

function expectSkiaColor(color: string): void {
  expect(color).toMatch(/^#[\da-f]{6}$/i);
}

describe('stage-colors lightness monotonicity', () => {
  it('light mode stages increase in lightness from stage 0 to 4', () => {
    const lightnesses = lightTokens.stages.map(parseLightness);
    for (let i = 1; i < lightnesses.length; i++) {
      expect(lightnesses[i]).toBeGreaterThan(lightnesses[i - 1]);
    }
  });

  it('dark mode stages increase in lightness from stage 0 to 4', () => {
    const lightnesses = darkTokens.stages.map(parseLightness);
    for (let i = 1; i < lightnesses.length; i++) {
      expect(lightnesses[i]).toBeGreaterThan(lightnesses[i - 1]);
    }
  });

  it('exposes Skia-safe colors for canvas rendering', () => {
    for (const tokens of [lightTokens, darkTokens]) {
      tokens.skia.stages.forEach(expectSkiaColor);
      expectSkiaColor(tokens.skia.dotFuture);
      expectSkiaColor(tokens.skia.accent);
    }
  });
});
