import { buildHeadlineState, buildLifeGridProjection, buildLifeGridState, todayRingPolicyFor } from '../lib/life-grid-state';
import { WEEKS_TOTAL } from '../lib/life-math';

describe('life grid state', () => {
  it('prepares header, layout, and dot state for the Life Grid', () => {
    const state = buildLifeGridState({
      view: 'weeks',
      dob: '2000-01-01',
      today: '2000-01-08',
      width: 393,
      height: 852,
      reducedMotion: false,
      platformOS: 'ios',
    });

    expect(state.header).toEqual({ lived: 1, percent: 0, total: WEEKS_TOTAL });
    expect(state.headline.count).toBe(1);
    expect(state.layout.cols).toBe(44);
    expect(state.dots[0]).toEqual({ stage: 0, isToday: true });
    expect(state.bonus).toBe(false);
    expect(state.todayRing).toBe('pulse');
  });

  it('prepares rounded header percentage', () => {
    const headline = buildHeadlineState({
      view: 'months',
      dob: '2000-01-01',
      today: '2040-01-01',
    });

    expect(headline.percent).toBe(50);
  });

  it('prepares layout-free Life Grid projection for non-canvas callers', () => {
    const projection = buildLifeGridProjection({
      view: 'months',
      dob: '2000-01-01',
      today: '2000-02-01',
    });

    expect(projection.header).toEqual({ lived: 1, percent: 0, total: 960 });
    expect(projection.headline.count).toBe(1);
    expect(projection.dots).toHaveLength(960);
    expect(projection.bonus).toBe(false);
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
    expect(todayRingPolicyFor('weeks', false, 'ios')).toBe('pulse');
    expect(todayRingPolicyFor('years', false, 'ios')).toBe('static');
    expect(todayRingPolicyFor('weeks', true, 'ios')).toBe('static');
    expect(todayRingPolicyFor('weeks', false, 'web')).toBe('static');
  });
});
