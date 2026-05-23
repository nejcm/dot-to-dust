import type { GridLayout } from '../lib/grid-layout';
import { VIEWS } from '@/lib/view';
import { computeGridLayout } from '../lib/grid-layout';

const DEVICE_SCREENS = [
  { name: 'iPhone SE', width: 375, height: 667 },
  { name: 'iPhone 15 Pro', width: 393, height: 852 },
  { name: 'Pixel 6', width: 411, height: 914 },
  { name: 'Pixel 8 Pro', width: 448, height: 998 },
] as const;

const WIDTH_FITTED_VIEWS = ['weeks', 'years'] as const;
const EPSILON = 0.000001;

function fitsCanvas(layout: GridLayout, width: number, height: number): boolean {
  return usedWidth(layout) <= width + EPSILON && usedHeight(layout) <= height + EPSILON;
}

function usedWidth(layout: GridLayout): number {
  return layout.cols * layout.dotSize + (layout.cols - 1) * layout.gap;
}

function usedHeight(layout: GridLayout): number {
  return layout.rows * layout.dotSize + (layout.rows - 1) * layout.gap;
}

describe('computeGridLayout', () => {
  describe.each(DEVICE_SCREENS)('$name ($width × $height)', ({ width, height }) => {
    it.each(VIEWS)('view=%s: dotSize > 4, gap > 0, no overflow', (view) => {
      const layout = computeGridLayout(view, width, height);
      expect(layout.dotSize).toBeGreaterThan(4);
      expect(layout.gap).toBeGreaterThan(0);
      expect(fitsCanvas(layout, width, height)).toBe(true);
    });

    it.each(WIDTH_FITTED_VIEWS)('view=%s: uses the full canvas width when height allows it', (view) => {
      const layout = computeGridLayout(view, width, height);
      expect(usedWidth(layout)).toBeCloseTo(width, 5);
    });
  });

  it('weeks returns 52 cols × 80 rows', () => {
    const layout = computeGridLayout('weeks', 393, 852);
    expect(layout.cols).toBe(52);
    expect(layout.rows).toBe(80);
  });

  it('months returns 12 cols × 80 rows', () => {
    const layout = computeGridLayout('months', 393, 852);
    expect(layout.cols).toBe(12);
    expect(layout.rows).toBe(80);
  });

  it('years returns 10 cols × 8 rows', () => {
    const layout = computeGridLayout('years', 393, 852);
    expect(layout.cols).toBe(10);
    expect(layout.rows).toBe(8);
  });

  it('does not overflow on tight canvases', () => {
    const layout = computeGridLayout('weeks', 375, 390);
    expect(fitsCanvas(layout, 375, 390)).toBe(true);
  });

  it.each([
    { view: 'weeks' as const, width: 250, height: 250 },
    { view: 'months' as const, width: 200, height: 300 },
    { view: 'years' as const, width: 80, height: 80 },
  ])('view=$view at $width × $height fits without overflow', ({ view, width, height }) => {
    const layout = computeGridLayout(view, width, height);
    expect(fitsCanvas(layout, width, height)).toBe(true);
  });

  it('scales down instead of overflowing when full-width weeks would exceed height', () => {
    const layout = computeGridLayout('weeks', 375, 390);
    expect(fitsCanvas(layout, 375, 390)).toBe(true);
    expect(usedHeight(layout)).toBeCloseTo(390, 5);
    expect(usedWidth(layout)).toBeLessThan(375);
  });

  it('scales months by height because full-width proportional dots would overflow', () => {
    const layout = computeGridLayout('months', 393, 852);
    expect(fitsCanvas(layout, 393, 852)).toBe(true);
    expect(usedHeight(layout)).toBeCloseTo(852, 5);
    expect(usedWidth(layout)).toBeLessThan(393);
  });
});
