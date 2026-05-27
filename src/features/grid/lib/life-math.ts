import type { StageIndex } from './stages';

import { differenceInMonths, differenceInWeeks, differenceInYears } from 'date-fns';

import { parseCivilDate } from '@/lib/civil-date';
import { STAGES } from './stages';

export type { StageDefinition, StageIndex } from './stages';
export { STAGES } from './stages';
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
function stageForAge(age: number): StageIndex {
  if (age <= 0) return 0;
  return STAGES.find((stage) => age >= stage.startAge && age <= stage.endAge)?.index ?? 4;
}

export function stageForWeek(weekIndex: number): StageIndex {
  const age = Math.floor((weekIndex - 1) / 52);
  return stageForAge(age);
}

export function stageForRatio(ratio: number): StageIndex {
  const age = Math.floor(Math.max(0, Math.min(1, ratio)) * LIFE_YEARS);
  return stageForAge(age);
}

export function isBonusTime(dob: string, today: string): boolean {
  return weeksLived(dob, today) >= WEEKS_TOTAL;
}
