import { VIEWS } from '@/lib/view';

import {
  MONTHS_TOTAL,
  monthsLived,
  WEEKS_TOTAL,
  weeksLived,
  YEARS_TOTAL,
  yearsLived,
} from '../lib/life-math';
import { VIEW_SPECS, viewSpec } from '../lib/view-policy';

describe('vIEW_SPECS registry', () => {
  it('contains an entry for every view', () => {
    for (const view of VIEWS) {
      expect(VIEW_SPECS[view]).toBeDefined();
      expect(VIEW_SPECS[view].view).toBe(view);
    }
  });

  it('keeps canonical view order', () => {
    expect(VIEWS).toEqual(['weeks', 'months', 'years']);
  });
});

describe('viewSpec totals', () => {
  it('weeks total matches WEEKS_TOTAL', () => {
    expect(viewSpec('weeks').total).toBe(WEEKS_TOTAL);
  });

  it('months total matches MONTHS_TOTAL', () => {
    expect(viewSpec('months').total).toBe(MONTHS_TOTAL);
  });

  it('years total matches YEARS_TOTAL', () => {
    expect(viewSpec('years').total).toBe(YEARS_TOTAL);
  });
});

describe('viewSpec.unitsLived', () => {
  const dob = '1990-01-01';
  const today = '2026-05-22';

  it('weeks delegates to weeksLived', () => {
    expect(viewSpec('weeks').unitsLived(dob, today)).toBe(weeksLived(dob, today));
  });

  it('months delegates to monthsLived', () => {
    expect(viewSpec('months').unitsLived(dob, today)).toBe(monthsLived(dob, today));
  });

  it('years delegates to yearsLived', () => {
    expect(viewSpec('years').unitsLived(dob, today)).toBe(yearsLived(dob, today));
  });
});

describe('viewSpec.toWeekIndex', () => {
  it('weeks returns the unit index unchanged', () => {
    expect(viewSpec('weeks').toWeekIndex(12)).toBe(12);
  });

  it('months unit 1 maps to week 1', () => {
    expect(viewSpec('months').toWeekIndex(1)).toBe(1);
  });

  it('months unit 13 maps to week 53', () => {
    expect(viewSpec('months').toWeekIndex(13)).toBe(53);
  });

  it('years unit 2 maps to week 53', () => {
    expect(viewSpec('years').toWeekIndex(2)).toBe(53);
  });
});

describe('viewSpec.remaining', () => {
  it('returns total for a newborn across all views', () => {
    const dob = '2000-01-01';
    const today = '2000-01-01';
    expect(viewSpec('weeks').remaining(dob, today)).toBe(WEEKS_TOTAL);
    expect(viewSpec('months').remaining(dob, today)).toBe(MONTHS_TOTAL);
    expect(viewSpec('years').remaining(dob, today)).toBe(YEARS_TOTAL);
  });

  it('decrements correctly: 1 week lived → WEEKS_TOTAL - 1 remaining', () => {
    expect(viewSpec('weeks').remaining('2000-01-01', '2000-01-08')).toBe(WEEKS_TOTAL - 1);
  });

  it('returns a negative or zero value in bonus time (weeks)', () => {
    const remaining = viewSpec('weeks').remaining('1939-01-01', '2020-01-01');
    expect(remaining).toBeLessThanOrEqual(0);
  });
});

describe('viewSpec.bonusAhead', () => {
  it('returns 0 when not in bonus time', () => {
    const dob = '1941-01-01';
    const today = '2020-01-01';
    for (const view of VIEWS) {
      expect(viewSpec(view).bonusAhead(dob, today)).toBe(0);
    }
  });

  it('returns 0 for a newborn', () => {
    expect(viewSpec('weeks').bonusAhead('2000-01-01', '2000-01-01')).toBe(0);
  });

  it('returns a positive count in weeks view past 80 years', () => {
    const bonus = viewSpec('weeks').bonusAhead('1939-01-01', '2020-01-01');
    expect(bonus).toBeGreaterThan(0);
    expect(bonus).toBe(weeksLived('1939-01-01', '2020-01-01') - WEEKS_TOTAL);
  });

  it('returns a positive count in years view past 80 years', () => {
    const bonus = viewSpec('years').bonusAhead('1939-01-01', '2020-01-01');
    expect(bonus).toBeGreaterThan(0);
    expect(bonus).toBe(yearsLived('1939-01-01', '2020-01-01') - YEARS_TOTAL);
  });

  it('clamps to 0 in years view when only the week-threshold has been crossed', () => {
    // At 4160 weeks the user is only ~79.72 calendar years old
    expect(viewSpec('years').bonusAhead('2000-01-01', '2079-09-23')).toBe(0);
  });

  it('clamps to 0 in months view when only the week-threshold has been crossed', () => {
    expect(viewSpec('months').bonusAhead('2000-01-01', '2079-09-23')).toBe(0);
  });
});

describe('viewSpec i18n keys', () => {
  it('every view has distinct non-empty eyebrow keys', () => {
    const eyebrows = VIEWS.map((v) => viewSpec(v).eyebrowKey);
    const bonusEyebrows = VIEWS.map((v) => viewSpec(v).bonusEyebrowKey);
    const sublines = VIEWS.map((v) => viewSpec(v).sublineKey);
    expect(new Set(eyebrows).size).toBe(3);
    expect(new Set(bonusEyebrows).size).toBe(3);
    expect(new Set(sublines).size).toBe(3);
  });

  it('eyebrow keys start with grid.headline.eyebrow', () => {
    for (const view of VIEWS) {
      expect(viewSpec(view).eyebrowKey).toMatch(/^grid\.headline\.eyebrow\./);
      expect(viewSpec(view).bonusEyebrowKey).toMatch(/^grid\.headline\.eyebrow\./);
    }
  });

  it('subline keys start with grid.headline.subline', () => {
    for (const view of VIEWS) {
      expect(viewSpec(view).sublineKey).toMatch(/^grid\.headline\.subline\./);
    }
  });
});
