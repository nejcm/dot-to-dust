import { darkTokens, lightTokens, toSkia } from '../tokens';

function parseLightness(oklch: string): number {
  const match = oklch.match(/oklch\(\s*([\d.]+)/);
  if (!match) throw new Error(`Cannot parse lightness from: ${oklch}`);
  return Number.parseFloat(match[1]);
}

describe('toSkia', () => {
  it('returns a hex tuple of length 5 for stages', () => {
    const skia = toSkia(lightTokens);
    expect(skia.stages).toHaveLength(5);
    for (const hex of skia.stages) {
      expect(hex).toMatch(/^#[\da-f]{6}$/i);
    }
  });

  it('returns valid hex for future, ring, and accent', () => {
    const skia = toSkia(lightTokens);
    expect(skia.future).toMatch(/^#[\da-f]{6}$/i);
    expect(skia.ring).toMatch(/^#[\da-f]{6}$/i);
    expect(skia.accent).toMatch(/^#[\da-f]{6}$/i);
  });

  it('is deterministic for light tokens', () => {
    const a = toSkia(lightTokens);
    const b = toSkia(lightTokens);
    expect(a.stages).toEqual(b.stages);
    expect(a.future).toBe(b.future);
    expect(a.ring).toBe(b.ring);
    expect(a.accent).toBe(b.accent);
  });

  it('is deterministic for dark tokens', () => {
    const a = toSkia(darkTokens);
    const b = toSkia(darkTokens);
    expect(a.stages).toEqual(b.stages);
    expect(a.future).toBe(b.future);
    expect(a.ring).toBe(b.ring);
  });

  it('light and dark produce different stage colors', () => {
    expect(toSkia(lightTokens).stages[0]).not.toBe(toSkia(darkTokens).stages[0]);
  });
});

describe('stage color tokens', () => {
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
});
