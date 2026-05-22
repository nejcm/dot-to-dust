import { VIEWS } from '@/lib/view';

import {
  bonusUnitsAhead,
  MONTHS_TOTAL,
  monthsLived,
  remainingFor,
  WEEKS_TOTAL,
  weeksLived,
  YEARS_TOTAL,
  yearsLived,
} from '../lib/life-math';
import {
  gridDimensionsFor,
  headlineCountFor,
  headlineKeyFor,
  livedUnitsFor,
  totalUnitsFor,
  unitToWeekIndex,
} from '../lib/view-policy';

describe('view policy', () => {
  it('keeps canonical view order', () => {
    expect(VIEWS).toEqual(['weeks', 'months', 'years']);
  });

  it('returns grid dimensions by view', () => {
    expect(gridDimensionsFor('weeks')).toEqual({ cols: 52, rows: 80 });
    expect(gridDimensionsFor('months')).toEqual({ cols: 12, rows: 80 });
    expect(gridDimensionsFor('years')).toEqual({ cols: 10, rows: 8 });
  });

  it('returns total units by view', () => {
    expect(totalUnitsFor('weeks')).toBe(WEEKS_TOTAL);
    expect(totalUnitsFor('months')).toBe(MONTHS_TOTAL);
    expect(totalUnitsFor('years')).toBe(YEARS_TOTAL);
  });

  it('delegates lived unit counts to life math', () => {
    const dob = '1990-01-01';
    const today = '2026-05-22';

    expect(livedUnitsFor('weeks', dob, today)).toBe(weeksLived(dob, today));
    expect(livedUnitsFor('months', dob, today)).toBe(monthsLived(dob, today));
    expect(livedUnitsFor('years', dob, today)).toBe(yearsLived(dob, today));
  });

  it('maps view units to week indices', () => {
    expect(unitToWeekIndex('weeks', 12)).toBe(12);
    expect(unitToWeekIndex('months', 1)).toBe(1);
    expect(unitToWeekIndex('months', 13)).toBe(53);
    expect(unitToWeekIndex('years', 2)).toBe(53);
  });

  it('returns headline translation keys by view and bonus state', () => {
    expect(headlineKeyFor('weeks', false)).toBe('grid.headline.weeksAhead');
    expect(headlineKeyFor('months', false)).toBe('grid.headline.monthsAhead');
    expect(headlineKeyFor('years', false)).toBe('grid.headline.yearsAhead');
    expect(headlineKeyFor('weeks', true)).toBe('grid.headline.bonusWeeks');
    expect(headlineKeyFor('months', true)).toBe('grid.headline.bonusMonths');
    expect(headlineKeyFor('years', true)).toBe('grid.headline.bonusYears');
  });

  it('delegates headline counts to life math', () => {
    const dob = '1940-01-01';
    const today = '2026-05-22';

    for (const view of VIEWS) {
      expect(headlineCountFor(view, dob, today, false)).toBe(remainingFor(view, dob, today));
      expect(headlineCountFor(view, dob, today, true)).toBe(bonusUnitsAhead(view, dob, today));
    }
  });
});
