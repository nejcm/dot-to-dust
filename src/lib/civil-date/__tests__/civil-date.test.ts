import {
  defaultDobCivilDate,
  isCivilDate,
  isPastOrTodayCivilDate,
  parseCivilDate,
  toCivilDateString,
} from '../index';

describe('isCivilDate', () => {
  it('accepts well-formed calendar dates', () => {
    expect(isCivilDate('2024-01-01')).toBe(true);
    expect(isCivilDate('1999-12-31')).toBe(true);
    expect(isCivilDate('2024-02-29')).toBe(true); // leap year
  });

  it('rejects non-leap Feb 29', () => {
    expect(isCivilDate('2023-02-29')).toBe(false);
    expect(isCivilDate('1900-02-29')).toBe(false); // century-not-divisible-by-400
    expect(isCivilDate('2000-02-29')).toBe(true); // divisible by 400
  });

  it('rejects out-of-range months and days', () => {
    expect(isCivilDate('2024-13-01')).toBe(false);
    expect(isCivilDate('2024-00-10')).toBe(false);
    expect(isCivilDate('2024-02-31')).toBe(false);
    expect(isCivilDate('2024-04-31')).toBe(false);
    expect(isCivilDate('2024-01-00')).toBe(false);
  });

  it('rejects malformed strings', () => {
    expect(isCivilDate('')).toBe(false);
    expect(isCivilDate('not-a-date')).toBe(false);
    expect(isCivilDate('2024-1-1')).toBe(false);
    expect(isCivilDate('2024/01/01')).toBe(false);
    expect(isCivilDate('20240101')).toBe(false);
  });
});

describe('parseCivilDate', () => {
  it('returns a Date anchored to local midnight', () => {
    const d = parseCivilDate('2024-03-15');
    expect(d.getFullYear()).toBe(2024);
    expect(d.getMonth()).toBe(2);
    expect(d.getDate()).toBe(15);
  });

  it('throws on malformed input', () => {
    expect(() => parseCivilDate('nonsense')).toThrow(/Invalid civil date format/);
  });

  it('throws on invalid calendar dates instead of silently normalizing', () => {
    expect(() => parseCivilDate('2023-02-29')).toThrow(/Invalid civil date/);
    expect(() => parseCivilDate('2024-02-31')).toThrow(/Invalid civil date/);
  });
});

describe('toCivilDateString', () => {
  it('formats local dates as civil strings', () => {
    expect(toCivilDateString(new Date(2024, 0, 2))).toBe('2024-01-02');
  });
});

describe('defaultDobCivilDate', () => {
  it('returns Jan 1 thirty years before today', () => {
    expect(defaultDobCivilDate('2026-05-22')).toBe('1996-01-01');
  });
});

describe('isPastOrTodayCivilDate', () => {
  it('accepts past and current civil dates', () => {
    expect(isPastOrTodayCivilDate('2024-01-01', '2024-01-02')).toBe(true);
    expect(isPastOrTodayCivilDate('2024-01-02', '2024-01-02')).toBe(true);
  });

  it('rejects future and invalid civil dates', () => {
    expect(isPastOrTodayCivilDate('2024-01-03', '2024-01-02')).toBe(false);
    expect(isPastOrTodayCivilDate('2024-02-31', '2024-01-02')).toBe(false);
  });
});
