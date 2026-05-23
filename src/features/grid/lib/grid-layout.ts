import type { View } from '@/lib/view';

import { gridDimensionsFor } from './view-policy';

export type GridLayout = {
  cols: number;
  rows: number;
  dotSize: number;
  gap: number;
};

// Ratio of gap to dotSize. Produces visually balanced spacing.
const GAP_RATIO = 0.2;

// Computes the largest proportional dotSize and gap that fit the dot field
// inside the given canvas without scrolling. Width is preferred when possible
// so the grid spans the full measured container.
export function computeGridLayout(
  view: View,
  canvasWidth: number,
  canvasHeight: number,
): GridLayout {
  const { cols, rows } = gridDimensionsFor(view);
  const widthUnits = gridUnits(cols);
  const heightUnits = gridUnits(rows);

  if (canvasWidth <= 0 || canvasHeight <= 0) {
    return { cols, rows, dotSize: 0, gap: 0 };
  }

  const widthDotSize = canvasWidth / widthUnits;
  const widthHeight = widthDotSize * heightUnits;

  if (widthHeight <= canvasHeight) {
    return layoutFor(cols, rows, widthDotSize);
  }

  return layoutFor(cols, rows, canvasHeight / heightUnits);
}

function gridUnits(count: number): number {
  return count + GAP_RATIO * (count - 1);
}

function layoutFor(cols: number, rows: number, dotSize: number): GridLayout {
  return { cols, rows, dotSize, gap: dotSize * GAP_RATIO };
}
