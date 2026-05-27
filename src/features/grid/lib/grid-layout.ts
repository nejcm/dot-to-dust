import type { View } from '@/lib/view';

import { viewSpec } from './view-policy';

export type GridLayout = {
  cols: number;
  rows: number;
  dotSize: number;
  gap: number;
};

// Ratio of gap to dotSize. Produces visually balanced spacing.
const GAP_RATIO = 0.2;

// Computes the largest proportional dotSize and gap that fit every dot inside
// the given canvas without scrolling.
export function computeGridLayout(
  view: View,
  canvasWidth: number,
  canvasHeight: number,
): GridLayout {
  const total = viewSpec(view).total;

  if (canvasWidth <= 0 || canvasHeight <= 0) {
    return { cols: total, rows: 1, dotSize: 0, gap: 0 };
  }

  let best = layoutFor(total, 1, 0);

  for (let cols = 1; cols <= total; cols += 1) {
    const rows = Math.ceil(total / cols);
    const dotSize = Math.min(
      canvasWidth / gridUnits(cols),
      canvasHeight / gridUnits(rows),
    );
    if (dotSize > best.dotSize) {
      best = layoutFor(cols, rows, dotSize);
    }
  }

  return best;
}

function gridUnits(count: number): number {
  return count + GAP_RATIO * (count - 1);
}

function layoutFor(cols: number, rows: number, dotSize: number): GridLayout {
  return { cols, rows, dotSize, gap: dotSize * GAP_RATIO };
}
