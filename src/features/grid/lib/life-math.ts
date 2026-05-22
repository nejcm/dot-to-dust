import type { View } from '@/lib/view';

import { differenceInMonths, differenceInWeeks, differenceInYears } from 'date-fns';

import { parseCivilDate } from '@/lib/civil-date';

export type { View } from '@/lib/view';

export const LIFE_YEARS = 80;
export const WEEKS_TOTAL = LIFE_YEARS * 52; // 4160
export const MONTHS_TOTAL = LIFE_YEARS * 12; // 960
export const YEARS_TOTAL = LIFE_YEARS; // 80

export function weeksLived(dob: string, today: string): number {
  return Math.max(0, differenceInWeeks(parseCivilDate(today), parseCivilDate(dob)));
}

export function monthsLived(dob: string, today: string): number {
  return Math.max(0, differenceInMonths(parseCivilDate(today), parseCivilDate(dob)));
}

export function yearsLived(dob: string, today: string): number {
  return Math.max(0, differenceInYears(parseCivilDate(today), parseCivilDate(dob)));
}

// weekIndex is 1-based (1 = first week of life, 4160 = last week of the 80-year span).
// Stage is determined by completed years at the start of that week.
// Boundaries: 0-11 → 0 | 12-22 → 1 | 23-39 → 2 | 40-59 → 3 | 60-80 → 4
export function stageForWeek(weekIndex: number): 0 | 1 | 2 | 3 | 4 {
  const age = Math.floor((weekIndex - 1) / 52);
  if (age < 12) return 0;
  if (age < 23) return 1;
  if (age < 40) return 2;
  if (age < 60) return 3;
  return 4;
}

export function isBonusTime(dob: string, today: string): boolean {
  return weeksLived(dob, today) >= WEEKS_TOTAL;
}

// Returns units remaining before the 80-year mark. Zero or negative in bonus time.
export function remainingFor(view: View, dob: string, today: string): number {
  switch (view) {
    case 'weeks':
      return WEEKS_TOTAL - weeksLived(dob, today);
    case 'months':
      return MONTHS_TOTAL - monthsLived(dob, today);
    case 'years':
      return YEARS_TOTAL - yearsLived(dob, today);
  }
}

// Returns bonus units accrued beyond the 80-year mark in the active view's unit.
// Zero if not in bonus time. Also clamped to zero when bonus time is entered via
// weeks but the user has not yet crossed the corresponding months/years threshold
// (4160 weeks ≈ 79.72 years, so years/months can lag for several months).
export function bonusUnitsAhead(view: View, dob: string, today: string): number {
  if (!isBonusTime(dob, today)) return 0;
  switch (view) {
    case 'weeks':
      return Math.max(0, weeksLived(dob, today) - WEEKS_TOTAL);
    case 'months':
      return Math.max(0, monthsLived(dob, today) - MONTHS_TOTAL);
    case 'years':
      return Math.max(0, yearsLived(dob, today) - YEARS_TOTAL);
  }
}
