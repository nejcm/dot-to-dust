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
// the given canvas without scrolling. Both values are floored so the total never
// overflows the canvas.
export function computeGridLayout(
  view: View,
  canvasWidth: number,
  canvasHeight: number,
): GridLayout {
  const { cols, rows } = GRID_DIMS[view];

  // Total width = cols*d + (cols-1)*g = d*(cols + GAP_RATIO*(cols-1))
  const dotSizeW = canvasWidth / (cols + GAP_RATIO * (cols - 1));
  const dotSizeH = canvasHeight / (rows + GAP_RATIO * (rows - 1));
  const dotSize = Math.floor(Math.min(dotSizeW, dotSizeH));
  const gap = Math.max(1, Math.floor(dotSize * GAP_RATIO));

  return { cols, rows, dotSize, gap };
}
