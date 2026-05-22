import type { View } from '@/lib/view';

import {
  bonusUnitsAhead,
  MONTHS_TOTAL,
  monthsLived,
  remainingFor,
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

export const HEADLINE_AHEAD_KEY = {
  weeks: 'grid.headline.weeksAhead',
  months: 'grid.headline.monthsAhead',
  years: 'grid.headline.yearsAhead',
} as const satisfies Record<View, string>;

export const HEADLINE_BONUS_KEY = {
  weeks: 'grid.headline.bonusWeeks',
  months: 'grid.headline.bonusMonths',
  years: 'grid.headline.bonusYears',
} as const satisfies Record<View, string>;

type HeadlineKey
  = | (typeof HEADLINE_AHEAD_KEY)[View]
    | (typeof HEADLINE_BONUS_KEY)[View];

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

export function headlineKeyFor(view: View, isBonus: boolean): HeadlineKey {
  return isBonus ? HEADLINE_BONUS_KEY[view] : HEADLINE_AHEAD_KEY[view];
}

export function headlineCountFor(view: View, dob: string, today: string, isBonus: boolean): number {
  return isBonus ? bonusUnitsAhead(view, dob, today) : remainingFor(view, dob, today);
}
