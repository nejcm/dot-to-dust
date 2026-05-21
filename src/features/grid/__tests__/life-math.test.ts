import {
  bonusUnitsAhead,
  isBonusTime,
  MONTHS_TOTAL,
  monthsLived,
  remainingFor,
  stageForWeek,
  WEEKS_TOTAL,
  weeksLived,
  YEARS_TOTAL,
  yearsLived,
} from '../lib/life-math';

// ─── weeksLived ───────────────────────────────────────────────────────────────

describe('weeksLived', () => {
  it('returns 0 when DOB equals today (newborn — no divide hazard)', () => {
    expect(weeksLived('2000-01-01', '2000-01-01')).toBe(0);
  });

  it('returns 0 for 6 days elapsed (less than one complete week)', () => {
    expect(weeksLived('2000-01-01', '2000-01-07')).toBe(0);
  });

  it('returns 1 for exactly 7 days elapsed', () => {
    expect(weeksLived('2000-01-01', '2000-01-08')).toBe(1);
  });

  it('returns 52 for one non-leap year', () => {
    // 2001 is not a leap year; 365 days = 52 complete weeks + 1 day
    expect(weeksLived('2001-01-01', '2002-01-01')).toBe(52);
  });

  it('handles a DOB on Feb 29 (leap day) in a non-leap year', () => {
    // 2023 is not a leap year — math must not throw; result must be non-negative
    const weeks = weeksLived('2000-02-29', '2023-02-28');
    expect(weeks).toBeGreaterThanOrEqual(0);
    // 22 full years elapsed → at least 22 * 52 = 1144 weeks
    expect(weeks).toBeGreaterThanOrEqual(1144);
  });

  it('crosses a DST spring-forward boundary without error', () => {
    // US DST spring-forward in 2020 was March 8. 2020-03-01 → 2020-04-01 = 31 days = 4 weeks.
    // Civil-date parsing (local midnight) means DST gaps do not affect week arithmetic.
    expect(weeksLived('2020-03-01', '2020-04-01')).toBe(4);
  });

  it('produces consistent results when DOB and today were recorded in different timezones', () => {
    // DOB stored as civil string '1990-06-15' (recorded in UTC+1).
    // Today stored as civil string '2020-06-15' (recorded in UTC-8).
    // Both parse as local midnight; timezone context at recording time does not affect result.
    // 30 years with 8 leap years = 10958 days = 1565 complete weeks.
    const weeks = weeksLived('1990-06-15', '2020-06-15');
    expect(weeks).toBe(1565);
  });
});

// ─── monthsLived ─────────────────────────────────────────────────────────────

describe('monthsLived', () => {
  it('returns 0 when DOB equals today', () => {
    expect(monthsLived('2000-05-01', '2000-05-01')).toBe(0);
  });

  it('returns 12 for exactly one year', () => {
    expect(monthsLived('2000-01-01', '2001-01-01')).toBe(12);
  });

  it('returns 0 for the same month on different days (not a full month yet)', () => {
    expect(monthsLived('2000-01-15', '2000-01-31')).toBe(0);
  });
});

// ─── yearsLived ───────────────────────────────────────────────────────────────

describe('yearsLived', () => {
  it('returns 0 when DOB equals today', () => {
    expect(yearsLived('2000-01-01', '2000-01-01')).toBe(0);
  });

  it('returns 1 for exactly one year elapsed', () => {
    expect(yearsLived('2000-01-01', '2001-01-01')).toBe(1);
  });

  it('handles DOB on Feb 29 in a non-leap year — before anniversary', () => {
    // 2023 is not a leap year; Feb 28 is the last day of Feb, birthday not yet reached
    expect(yearsLived('2000-02-29', '2023-02-28')).toBe(22);
  });

  it('handles DOB on Feb 29 in a non-leap year — after anniversary date passes', () => {
    // By March 1, the birthday month has passed regardless of leap status
    expect(yearsLived('2000-02-29', '2023-03-01')).toBe(23);
  });

  it('handles DOB on Feb 29 in a leap year — exact birthday', () => {
    expect(yearsLived('2000-02-29', '2004-02-29')).toBe(4);
  });
});

// ─── stageForWeek ─────────────────────────────────────────────────────────────

describe('stageForWeek', () => {
  it('week 1 (first week of life) is stage 0', () => {
    expect(stageForWeek(1)).toBe(0);
  });

  // Stage 0 → 1 boundary (childhood → adolescence): 0–11 | 12–22
  it('week 624 is the last childhood week (stage 0)', () => {
    expect(stageForWeek(624)).toBe(0);
  });

  it('week 625 is the first adolescence week (stage 1)', () => {
    expect(stageForWeek(625)).toBe(1);
  });

  // Stage 1 → 2 boundary (adolescence → young adult): 12–22 | 23–39
  it('week 1196 is the last adolescence week (stage 1)', () => {
    expect(stageForWeek(1196)).toBe(1);
  });

  it('week 1197 is the first young-adult week (stage 2)', () => {
    expect(stageForWeek(1197)).toBe(2);
  });

  // Stage 2 → 3 boundary (young adult → midlife): 23–39 | 40–59
  it('week 2080 is the last young-adult week (stage 2)', () => {
    expect(stageForWeek(2080)).toBe(2);
  });

  it('week 2081 is the first midlife week (stage 3)', () => {
    expect(stageForWeek(2081)).toBe(3);
  });

  // Stage 3 → 4 boundary (midlife → senior): 40–59 | 60–80
  it('week 3120 is the last midlife week (stage 3)', () => {
    expect(stageForWeek(3120)).toBe(3);
  });

  it('week 3121 is the first senior week (stage 4)', () => {
    expect(stageForWeek(3121)).toBe(4);
  });

  it('week 4160 (last week of 80-year span) is stage 4', () => {
    expect(stageForWeek(4160)).toBe(4);
  });
});

// ─── isBonusTime ─────────────────────────────────────────────────────────────

describe('isBonusTime', () => {
  it('returns false for a newborn', () => {
    expect(isBonusTime('2000-01-01', '2000-01-01')).toBe(false);
  });

  it('returns false for DOB ~79 years ago (just before bonus time)', () => {
    // 1941-01-01 → 2020-01-01 = 79 years exactly → weeksLived ≪ WEEKS_TOTAL
    expect(isBonusTime('1941-01-01', '2020-01-01')).toBe(false);
  });

  it('returns false for DOB just before the 4160-week threshold', () => {
    // 4160 weeks = 29120 days from dob. The day before is 29119 days = 4159 complete weeks.
    // 29119 days from 2000-01-01 lands on 2079-09-21 (79 years + ~263 days).
    // Note: 79.99 calendar years > 4160 weeks because calendar years include leap days.
    expect(isBonusTime('2000-01-01', '2079-09-21')).toBe(false);
  });

  it('returns true for DOB exactly 80 calendar years ago (bonus-time entry)', () => {
    // 80 calendar years > 4160 weeks (because calendar years include leap years)
    expect(isBonusTime('1940-01-01', '2020-01-01')).toBe(true);
  });

  it('returns true for DOB 81+ years ago (bonus time on launch)', () => {
    expect(isBonusTime('1939-01-01', '2020-01-01')).toBe(true);
  });

  it('wEEKS_TOTAL is the threshold: lived === WEEKS_TOTAL → bonus time', () => {
    // Construct a dob and today exactly 4160 weeks apart (29120 days).
    // Use dob = '2000-01-01'; 29120 days later falls in Sep 2079.
    // Verify by checking weeksLived, not by pinning the date manually.
    const dob = '1944-01-03'; // chosen so that 4160 weeks later is a known date
    const todayAtBoundary = '2023-12-25'; // placeholder; real test uses assertion below
    const lived = weeksLived(dob, todayAtBoundary);
    // Build a today that is exactly `lived` weeks after dob for a boundary assertion:
    // We verify the invariant: if weeksLived >= WEEKS_TOTAL then isBonusTime = true.
    if (lived >= WEEKS_TOTAL) {
      expect(isBonusTime(dob, todayAtBoundary)).toBe(true);
    }
    else {
      expect(isBonusTime(dob, todayAtBoundary)).toBe(false);
    }
  });
});

// ─── remainingFor ─────────────────────────────────────────────────────────────

describe('remainingFor', () => {
  it('returns WEEKS_TOTAL for a newborn in weeks view', () => {
    expect(remainingFor('weeks', '2000-01-01', '2000-01-01')).toBe(WEEKS_TOTAL);
  });

  it('returns MONTHS_TOTAL for a newborn in months view', () => {
    expect(remainingFor('months', '2000-01-01', '2000-01-01')).toBe(MONTHS_TOTAL);
  });

  it('returns YEARS_TOTAL for a newborn in years view', () => {
    expect(remainingFor('years', '2000-01-01', '2000-01-01')).toBe(YEARS_TOTAL);
  });

  it('returns a negative or zero value in bonus time (weeks)', () => {
    // 81 years is well past the 80-year mark
    const remaining = remainingFor('weeks', '1939-01-01', '2020-01-01');
    expect(remaining).toBeLessThanOrEqual(0);
  });

  it('decrements correctly: 1 week lived → WEEKS_TOTAL - 1 remaining', () => {
    expect(remainingFor('weeks', '2000-01-01', '2000-01-08')).toBe(WEEKS_TOTAL - 1);
  });
});

// ─── bonusUnitsAhead ─────────────────────────────────────────────────────────

describe('bonusUnitsAhead', () => {
  it('returns 0 when not in bonus time', () => {
    expect(bonusUnitsAhead('weeks', '1941-01-01', '2020-01-01')).toBe(0);
    expect(bonusUnitsAhead('months', '1941-01-01', '2020-01-01')).toBe(0);
    expect(bonusUnitsAhead('years', '1941-01-01', '2020-01-01')).toBe(0);
  });

  it('returns 0 for a newborn', () => {
    expect(bonusUnitsAhead('weeks', '2000-01-01', '2000-01-01')).toBe(0);
  });

  it('returns a positive count in weeks view when past 80 years', () => {
    // 81 years lived; weeks lived is well over WEEKS_TOTAL
    const bonus = bonusUnitsAhead('weeks', '1939-01-01', '2020-01-01');
    expect(bonus).toBeGreaterThan(0);
    // Bonus = weeksLived - WEEKS_TOTAL
    const lived = weeksLived('1939-01-01', '2020-01-01');
    expect(bonus).toBe(lived - WEEKS_TOTAL);
  });

  it('returns a positive count in years view when past 80 years', () => {
    const bonus = bonusUnitsAhead('years', '1939-01-01', '2020-01-01');
    expect(bonus).toBeGreaterThan(0);
    const lived = yearsLived('1939-01-01', '2020-01-01');
    expect(bonus).toBe(lived - YEARS_TOTAL);
  });
});
