import type { View } from '@/lib/view';

import {
  isBonusTime,
  MONTHS_TOTAL,
  monthsLived,
  WEEKS_TOTAL,
  weeksLived,
  YEARS_TOTAL,
  yearsLived,
} from './life-math';

export type HeadlineEyebrowKey
  = | 'grid.headline.eyebrow.weeks'
    | 'grid.headline.eyebrow.months'
    | 'grid.headline.eyebrow.years'
    | 'grid.headline.eyebrow.bonusWeeks'
    | 'grid.headline.eyebrow.bonusMonths'
    | 'grid.headline.eyebrow.bonusYears';

export type HeadlineSublineKey
  = | 'grid.headline.subline.weeks'
    | 'grid.headline.subline.months'
    | 'grid.headline.subline.years';

export interface ViewSpec {
  readonly view: View;
  readonly total: number;
  readonly unitsLived: (dob: string, today: string) => number;
  // Approximate: maps to the week containing the start of the unit. Stage colour only — not cross-view aligned.
  readonly toWeekIndex: (unitIndex: number) => number;
  // Returns total - unitsLived. Negative when in Bonus Time; callers must guard on the bonus flag.
  readonly remaining: (dob: string, today: string) => number;
  readonly bonusAhead: (dob: string, today: string) => number;
  readonly eyebrowKey: HeadlineEyebrowKey;
  readonly bonusEyebrowKey: HeadlineEyebrowKey;
  readonly sublineKey: HeadlineSublineKey;
}

const weeksSpec: ViewSpec = {
  view: 'weeks',
  total: WEEKS_TOTAL,
  unitsLived: (dob, today) => weeksLived(dob, today),
  toWeekIndex: (i) => i,
  remaining: (dob, today) => WEEKS_TOTAL - weeksLived(dob, today),
  bonusAhead: (dob, today) =>
    isBonusTime(dob, today) ? Math.max(0, weeksLived(dob, today) - WEEKS_TOTAL) : 0,
  eyebrowKey: 'grid.headline.eyebrow.weeks',
  bonusEyebrowKey: 'grid.headline.eyebrow.bonusWeeks',
  sublineKey: 'grid.headline.subline.weeks',
};

const monthsSpec: ViewSpec = {
  view: 'months',
  total: MONTHS_TOTAL,
  unitsLived: (dob, today) => monthsLived(dob, today),
  toWeekIndex: (i) => Math.round(((i - 1) / 12) * 52) + 1,
  remaining: (dob, today) => MONTHS_TOTAL - monthsLived(dob, today),
  bonusAhead: (dob, today) =>
    isBonusTime(dob, today) ? Math.max(0, monthsLived(dob, today) - MONTHS_TOTAL) : 0,
  eyebrowKey: 'grid.headline.eyebrow.months',
  bonusEyebrowKey: 'grid.headline.eyebrow.bonusMonths',
  sublineKey: 'grid.headline.subline.months',
};

const yearsSpec: ViewSpec = {
  view: 'years',
  total: YEARS_TOTAL,
  unitsLived: (dob, today) => yearsLived(dob, today),
  toWeekIndex: (i) => (i - 1) * 52 + 1,
  remaining: (dob, today) => YEARS_TOTAL - yearsLived(dob, today),
  bonusAhead: (dob, today) =>
    isBonusTime(dob, today) ? Math.max(0, yearsLived(dob, today) - YEARS_TOTAL) : 0,
  eyebrowKey: 'grid.headline.eyebrow.years',
  bonusEyebrowKey: 'grid.headline.eyebrow.bonusYears',
  sublineKey: 'grid.headline.subline.years',
};

export const VIEW_SPECS: Record<View, ViewSpec> = {
  weeks: weeksSpec,
  months: monthsSpec,
  years: yearsSpec,
};

export function viewSpec(view: View): ViewSpec {
  return VIEW_SPECS[view];
}
