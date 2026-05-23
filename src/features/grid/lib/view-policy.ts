import type { View } from '@/lib/view';

import {
  MONTHS_TOTAL,
  monthsLived,
  WEEKS_TOTAL,
  weeksLived,
  YEARS_TOTAL,
  yearsLived,
} from './life-math';

export type GridDimensions = {
  cols: number;
  rows: number;
};

export const GRID_DIMENSIONS: Record<View, GridDimensions> = {
  weeks: { cols: 52, rows: 80 },
  months: { cols: 12, rows: 80 },
  years: { cols: 10, rows: 8 },
};

export function gridDimensionsFor(view: View): GridDimensions {
  return GRID_DIMENSIONS[view];
}

export function totalUnitsFor(view: View): number {
  switch (view) {
    case 'weeks':
      return WEEKS_TOTAL;
    case 'months':
      return MONTHS_TOTAL;
    case 'years':
      return YEARS_TOTAL;
  }
}

export function livedUnitsFor(view: View, dob: string, today: string): number {
  switch (view) {
    case 'weeks':
      return weeksLived(dob, today);
    case 'months':
      return monthsLived(dob, today);
    case 'years':
      return yearsLived(dob, today);
  }
}

export function unitToWeekIndex(view: View, unitIndex: number): number {
  switch (view) {
    case 'weeks':
      return unitIndex;
    case 'months':
      return Math.round(((unitIndex - 1) / 12) * 52) + 1;
    case 'years':
      return (unitIndex - 1) * 52 + 1;
  }
}

export const EYEBROW_KEY = {
  weeks: 'grid.headline.eyebrow.weeks',
  months: 'grid.headline.eyebrow.months',
  years: 'grid.headline.eyebrow.years',
} as const satisfies Record<View, string>;

export const BONUS_EYEBROW_KEY = {
  weeks: 'grid.headline.eyebrow.bonusWeeks',
  months: 'grid.headline.eyebrow.bonusMonths',
  years: 'grid.headline.eyebrow.bonusYears',
} as const satisfies Record<View, string>;

export const SUBLINE_KEY = {
  weeks: 'grid.headline.subline.weeks',
  months: 'grid.headline.subline.months',
  years: 'grid.headline.subline.years',
} as const satisfies Record<View, string>;
