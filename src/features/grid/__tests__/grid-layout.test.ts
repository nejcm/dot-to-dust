import type { GridLayout } from '../lib/grid-layout';
import type { View } from '@/lib/view';
import { VIEWS } from '@/lib/view';
import { computeGridLayout } from '../lib/grid-layout';
import { viewSpec } from '../lib/view-policy';

const DEVICE_SCREENS = [
  { name: 'iPhone SE', width: 375, height: 667 },
  { name: 'iPhone 15 Pro', width: 393, height: 852 },
  { name: 'Pixel 6', width: 411, height: 914 },
  { name: 'Pixel 8 Pro', width: 448, height: 998 },
] as const;

const EPSILON = 0.000001;
const GAP_RATIO = 0.2;

function fitsCanvas(layout: GridLayout, width: number, height: number): boolean {
  return usedWidth(layout) <= width + EPSILON && usedHeight(layout) <= height + EPSILON;
}

function usedWidth(layout: GridLayout): number {
  return layout.cols * layout.dotSize + (layout.cols - 1) * layout.gap;
}

function usedHeight(layout: GridLayout): number {
  return layout.rows * layout.dotSize + (layout.rows - 1) * layout.gap;
}

function fitsAllDots(layout: GridLayout, view: View): boolean {
  return layout.cols * layout.rows >= viewSpec(view).total;
}

function maxDotSizeFor(view: View, width: number, height: number): number {
  let maxDotSize = 0;
  const total = viewSpec(view).total;

  for (let cols = 1; cols <= total; cols += 1) {
    const rows = Math.ceil(total / cols);
    const dotSize = Math.min(
      width / (cols + GAP_RATIO * (cols - 1)),
      height / (rows + GAP_RATIO * (rows - 1)),
    );
    maxDotSize = Math.max(maxDotSize, dotSize);
  }

  return maxDotSize;
}

describe('computeGridLayout', () => {
  describe.each(DEVICE_SCREENS)('$name ($width × $height)', ({ width, height }) => {
    it.each(VIEWS)('view=%s: dotSize > 4, gap > 0, no overflow, all dots fit', (view) => {
      const layout = computeGridLayout(view, width, height);
      expect(layout.dotSize).toBeGreaterThan(4);
      expect(layout.gap).toBeGreaterThan(0);
      expect(fitsCanvas(layout, width, height)).toBe(true);
      expect(fitsAllDots(layout, view)).toBe(true);
    });
  });

  it('maximizes week dot size for a tall phone canvas', () => {
    const layout = computeGridLayout('weeks', 393, 852);
    expect(layout.cols).toBe(44);
    expect(layout.rows).toBe(95);
    expect(layout.dotSize).toBeCloseTo(7.47148288973384, 5);
    expect(usedWidth(layout)).toBeCloseTo(393, 5);
    expect(usedHeight(layout)).toBeLessThanOrEqual(852);
  });

  it('maximizes month dot size for a tall phone canvas', () => {
    const layout = computeGridLayout('months', 393, 852);
    expect(layout.cols).toBe(21);
    expect(layout.rows).toBe(46);
    expect(usedHeight(layout)).toBeCloseTo(852, 5);
    expect(usedWidth(layout)).toBeLessThanOrEqual(393);
  });

  it('maximizes year dot size for a tall phone canvas', () => {
    const layout = computeGridLayout('years', 393, 852);
    expect(layout.cols).toBe(6);
    expect(layout.rows).toBe(14);
    expect(usedHeight(layout)).toBeCloseTo(852, 5);
    expect(usedWidth(layout)).toBeLessThanOrEqual(393);
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

  it('fills the limiting axis when sizing weeks on a short canvas', () => {
    const layout = computeGridLayout('weeks', 375, 390);
    expect(fitsCanvas(layout, 375, 390)).toBe(true);
    expect(usedWidth(layout)).toBeCloseTo(375, 5);
  });

  it('fills the limiting axis when sizing months on a tall canvas', () => {
    const layout = computeGridLayout('months', 393, 852);
    expect(fitsCanvas(layout, 393, 852)).toBe(true);
    expect(usedHeight(layout)).toBeCloseTo(852, 5);
  });

  it.each([
    { view: 'weeks' as const, width: 393, height: 852 },
    { view: 'weeks' as const, width: 375, height: 390 },
    { view: 'months' as const, width: 200, height: 300 },
    { view: 'years' as const, width: 80, height: 80 },
  ])('view=$view at $width × $height maximizes dot size', ({ view, width, height }) => {
    const layout = computeGridLayout(view, width, height);
    expect(layout.dotSize).toBeCloseTo(maxDotSizeFor(view, width, height), 10);
  });
});
