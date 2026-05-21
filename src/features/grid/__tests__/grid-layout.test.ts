import type { GridLayout } from '../lib/grid-layout';
import type { View } from '../lib/life-math';
import { computeGridLayout } from '../lib/grid-layout';

const DEVICE_SCREENS = [
  { name: 'iPhone SE', width: 375, height: 667 },
  { name: 'iPhone 15 Pro', width: 393, height: 852 },
  { name: 'Pixel 6', width: 411, height: 914 },
  { name: 'Pixel 8 Pro', width: 448, height: 998 },
] as const;

const VIEWS: View[] = ['weeks', 'months', 'years'];

function fitsCanvas(layout: GridLayout, width: number, height: number): boolean {
  const usedW = layout.cols * layout.dotSize + (layout.cols - 1) * layout.gap;
  const usedH = layout.rows * layout.dotSize + (layout.rows - 1) * layout.gap;
  return usedW <= width && usedH <= height;
}

describe('computeGridLayout', () => {
  describe.each(DEVICE_SCREENS)('$name ($width × $height)', ({ width, height }) => {
    it.each(VIEWS)('view=%s: dotSize > 4, gap > 0, no overflow', (view) => {
      const layout = computeGridLayout(view, width, height);
      expect(layout.dotSize).toBeGreaterThan(4);
      expect(layout.gap).toBeGreaterThan(0);
      expect(fitsCanvas(layout, width, height)).toBe(true);
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
});
