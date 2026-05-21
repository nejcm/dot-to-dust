import { darkTokens, lightTokens } from '@/lib/theme/tokens';

function parseLightness(oklch: string): number {
  const match = oklch.match(/oklch\(\s*([\d.]+)%/);
  if (!match) throw new Error(`Cannot parse lightness from: ${oklch}`);
  return Number.parseFloat(match[1]);
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
});
