import type { View } from './life-math';

export type GridLayout = {
  cols: number;
  rows: number;
  dotSize: number;
  gap: number;
};

const GRID_DIMS: Record<View, { cols: number; rows: number }> = {
  weeks: { cols: 52, rows: 80 },
  months: { cols: 12, rows: 80 },
  years: { cols: 10, rows: 8 },
};

// Ratio of gap to dotSize. Produces visually balanced spacing.
const GAP_RATIO = 0.2;

// Computes the largest dotSize and proportional gap that fit the dot field inside
// the given canvas without scrolling. Gap is clamped to a minimum of 1 px, and
// dotSize is reduced if necessary so the integer (dotSize, gap) pair never
// overflows — needed when floor(dotSize * GAP_RATIO) would be 0 and gap is bumped
// above the ratio-derived bound.
export function computeGridLayout(
  view: View,
  canvasWidth: number,
  canvasHeight: number,
): GridLayout {
  const { cols, rows } = GRID_DIMS[view];

  // Total width = cols*d + (cols-1)*g = d*(cols + GAP_RATIO*(cols-1))
  const dotSizeW = canvasWidth / (cols + GAP_RATIO * (cols - 1));
  const dotSizeH = canvasHeight / (rows + GAP_RATIO * (rows - 1));
  let dotSize = Math.max(0, Math.floor(Math.min(dotSizeW, dotSizeH)));
  let gap = Math.max(1, Math.floor(dotSize * GAP_RATIO));

  while (
    dotSize > 0
    && (cols * dotSize + (cols - 1) * gap > canvasWidth
      || rows * dotSize + (rows - 1) * gap > canvasHeight)
  ) {
    dotSize -= 1;
    gap = Math.max(1, Math.floor(dotSize * GAP_RATIO));
  }

  return { cols, rows, dotSize, gap };
}
