import { buildHeadlineState, buildLifeGridState, shouldPulseTodayRing } from '../lib/life-grid-state';
import { WEEKS_TOTAL } from '../lib/life-math';

describe('life grid state', () => {
  it('prepares header, layout, and dot state for the Life Grid', () => {
    const state = buildLifeGridState({
      view: 'weeks',
      dob: '2000-01-01',
      today: '2000-01-08',
      width: 393,
      height: 852,
    });

    expect(state.header).toEqual({ lived: 1, total: WEEKS_TOTAL });
    expect(state.layout.cols).toBe(52);
    expect(state.dots[0]).toEqual({ stage: 0, isToday: true });
    expect(state.bonus).toBe(false);
  });

  it('prepares bonus headline state without changing the visible count rule', () => {
    const normal = buildHeadlineState({
      view: 'months',
      dob: '2000-01-01',
      today: '2000-02-01',
    });
    const bonus = buildHeadlineState({
      view: 'weeks',
      dob: '1939-01-01',
      today: '2020-01-01',
    });

    expect(normal.count).toBe(1);
    expect(normal.remaining).toBe(959);
    expect(normal.bonus).toBe(false);
    expect(bonus.count).toBeGreaterThan(0);
    expect(bonus.bonus).toBe(true);
  });

  it('keeps Today Ring pulse policy out of the canvas implementation', () => {
    expect(shouldPulseTodayRing('weeks', false, 'ios')).toBe(true);
    expect(shouldPulseTodayRing('years', false, 'ios')).toBe(false);
    expect(shouldPulseTodayRing('weeks', true, 'ios')).toBe(false);
    expect(shouldPulseTodayRing('weeks', false, 'web')).toBe(false);
  });
});
