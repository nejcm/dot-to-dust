import type { View } from '@/lib/view';
import {
  isBonusTime,
  stageForWeek,
} from './life-math';
import { livedUnitsFor, totalUnitsFor, unitToWeekIndex } from './view-policy';

export type DotState
  = | { stage: 0 | 1 | 2 | 3 | 4; isToday: boolean }
    | { kind: 'future' };

// Builds the flat dot array the grid canvas renders. Length is always totalFor(view).
// In bonus time: every dot carries a stage, isToday is always false (no ring drawn).
export function buildDotStates(view: View, dob: string, today: string): DotState[] {
  const total = totalUnitsFor(view);
  const lived = livedUnitsFor(view, dob, today);
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
