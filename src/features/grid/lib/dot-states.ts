import type { View } from './life-math';
import {
  isBonusTime,
  MONTHS_TOTAL,
  monthsLived,
  stageForWeek,
  WEEKS_TOTAL,
  weeksLived,
  YEARS_TOTAL,
  yearsLived,
} from './life-math';

export type DotState
  = | { stage: 0 | 1 | 2 | 3 | 4; isToday: boolean }
    | { kind: 'future' };

// Converts a 1-based unit index to a week index so stageForWeek can be reused
// for months and years views.
function unitToWeekIndex(view: View, unitIndex: number): number {
  switch (view) {
    case 'weeks':
      return unitIndex;
    case 'months':
      return Math.round(((unitIndex - 1) / 12) * 52) + 1;
    case 'years':
      return (unitIndex - 1) * 52 + 1;
  }
}

function totalFor(view: View): number {
  switch (view) {
    case 'weeks':
      return WEEKS_TOTAL;
    case 'months':
      return MONTHS_TOTAL;
    case 'years':
      return YEARS_TOTAL;
  }
}

function livedFor(view: View, dob: string, today: string): number {
  switch (view) {
    case 'weeks':
      return weeksLived(dob, today);
    case 'months':
      return monthsLived(dob, today);
    case 'years':
      return yearsLived(dob, today);
  }
}

// Builds the flat dot array the grid canvas renders. Length is always totalFor(view).
// In bonus time: every dot carries a stage, isToday is always false (no ring drawn).
export function buildDotStates(view: View, dob: string, today: string): DotState[] {
  const total = totalFor(view);
  const lived = livedFor(view, dob, today);
  const bonus = isBonusTime(dob, today);

  const dots: DotState[] = [];

  for (let i = 1; i <= total; i++) {
    const stage = stageForWeek(unitToWeekIndex(view, i));
    if (bonus) {
      dots.push({ stage, isToday: false });
    }
    else if (i <= lived) {
      dots.push({ stage, isToday: i === lived });
    }
    else {
      dots.push({ kind: 'future' });
    }
  }

  return dots;
}
