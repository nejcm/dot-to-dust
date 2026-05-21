import { buildDotStates } from '../lib/dot-states';
import { WEEKS_TOTAL } from '../lib/life-math';

describe('buildDotStates', () => {
  it('returns one future dot per week before any complete week is lived', () => {
    const dots = buildDotStates('weeks', '2000-01-01', '2000-01-01');

    expect(dots).toHaveLength(WEEKS_TOTAL);
    expect(dots.every((dot) => 'kind' in dot && dot.kind === 'future')).toBe(true);
  });

  it('marks the last lived week as today and future weeks as future', () => {
    const dots = buildDotStates('weeks', '2000-01-01', '2000-01-08');

    expect(dots[0]).toEqual({ stage: 0, isToday: true });
    expect(dots[1]).toEqual({ kind: 'future' });
  });

  it('uses a single future state for all unlived dots', () => {
    const dots = buildDotStates('weeks', '2000-01-01', '2000-01-15');
    const futureDots = dots.slice(2);

    expect(futureDots.every((dot) => 'kind' in dot && dot.kind === 'future')).toBe(true);
  });

  it('preserves staged dots and suppresses today in bonus time', () => {
    const dots = buildDotStates('weeks', '1940-01-01', '2020-01-01');

    expect(dots).toHaveLength(WEEKS_TOTAL);
    expect(dots.every((dot) => !('kind' in dot) && dot.isToday === false)).toBe(true);
    expect(dots[0]).toEqual({ stage: 0, isToday: false });
    expect(dots[WEEKS_TOTAL - 1]).toEqual({ stage: 4, isToday: false });
  });
});
