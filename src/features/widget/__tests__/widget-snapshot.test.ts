import { buildWidgetSnapshot } from '../lib/widget-snapshot';

describe('buildWidgetSnapshot', () => {
  it('builds small summary content from the active view', () => {
    const snapshot = buildWidgetSnapshot({
      dob: '2000-01-01',
      theme: 'light',
      today: '2001-01-01',
      view: 'weeks',
      widgetSize: 'small',
    });

    expect(snapshot.kind).toBe('ready');
    if (snapshot.kind !== 'ready') return;

    expect(snapshot.view).toBe('weeks');
    expect(snapshot.lived).toBe(52);
    expect(snapshot.total).toBe(4160);
    expect(snapshot.percent).toBe(1);
    expect(snapshot.dots).toHaveLength(4160);
    expect(snapshot.progress).toBeCloseTo(52 / 4160);
    expect(snapshot.display).toEqual({
      hero: '52 / 4,160',
      percent: '1%',
      viewLabel: 'weeks',
    });
    expect(snapshot.widgetGrid).toBeNull();
  });

  it('adds a Widget Grid when medium dots meet the minimum rendered size', () => {
    const snapshot = buildWidgetSnapshot({
      dob: '2000-01-01',
      theme: 'dark',
      today: '2000-01-08',
      view: 'years',
      widgetSize: 'medium',
      widgetGridArea: { width: 160, height: 80 },
    });

    expect(snapshot.kind).toBe('ready');
    if (snapshot.kind !== 'ready') return;

    expect(snapshot.widgetGrid).not.toBeNull();
    expect(snapshot.widgetGrid?.dotSize).toBeGreaterThanOrEqual(2);
    expect(snapshot.widgetGrid?.todayRing).toBe('static');
    expect(snapshot.widgetGrid?.dots).toHaveLength(80);
  });

  it('falls back to summary when a full Widget Grid would be too dense', () => {
    const snapshot = buildWidgetSnapshot({
      dob: '2000-01-01',
      theme: 'light',
      today: '2000-01-08',
      view: 'weeks',
      widgetSize: 'medium',
      widgetGridArea: { width: 40, height: 20 },
    });

    expect(snapshot.kind).toBe('ready');
    if (snapshot.kind !== 'ready') return;

    expect(snapshot.widgetGrid).toBeNull();
  });

  it('uses bonus count-up display and suppresses the Today Ring in Bonus Time', () => {
    const snapshot = buildWidgetSnapshot({
      dob: '1940-01-01',
      theme: 'light',
      today: '2021-01-01',
      view: 'weeks',
      widgetSize: 'large',
      widgetGridArea: { width: 320, height: 240 },
    });

    expect(snapshot.kind).toBe('ready');
    if (snapshot.kind !== 'ready') return;

    expect(snapshot.bonus).toBe(true);
    expect(snapshot.progress).toBe(1);
    expect(snapshot.display.hero).toMatch(/^\+\d+ weeks$/);
    expect(snapshot.widgetGrid?.todayRing).toBeNull();
  });

  it('returns a setup prompt when no DOB is set', () => {
    const snapshot = buildWidgetSnapshot({
      dob: null,
      theme: 'system',
      today: '2026-05-28',
      view: 'months',
      widgetSize: 'small',
    });

    expect(snapshot).toEqual({
      kind: 'setup',
      cta: 'Set date of birth',
      nextSafetyRefreshDate: '2026-05-29',
    });
  });

  it('resolves system theme colors from the provided color scheme', () => {
    const snapshot = buildWidgetSnapshot({
      dob: '2000-01-01',
      resolvedColorScheme: 'dark',
      theme: 'system',
      today: '2000-01-08',
      view: 'weeks',
      widgetSize: 'small',
    });

    expect(snapshot.kind).toBe('ready');
    if (snapshot.kind !== 'ready') return;

    expect(snapshot.resolvedTheme).toBe('dark');
  });

  it('prepares view-boundary and daily safety refresh dates', () => {
    const weeks = buildWidgetSnapshot({
      dob: '2000-01-01',
      theme: 'light',
      today: '2000-01-08',
      view: 'weeks',
      widgetSize: 'small',
    });
    const months = buildWidgetSnapshot({
      dob: '2000-01-15',
      theme: 'light',
      today: '2000-02-20',
      view: 'months',
      widgetSize: 'small',
    });
    const years = buildWidgetSnapshot({
      dob: '2000-02-29',
      theme: 'light',
      today: '2001-03-01',
      view: 'years',
      widgetSize: 'small',
    });

    expect(weeks.kind === 'ready' && weeks.nextViewBoundaryDate).toBe('2000-01-15');
    expect(weeks.kind === 'ready' && weeks.nextSafetyRefreshDate).toBe('2000-01-09');
    expect(months.kind === 'ready' && months.nextViewBoundaryDate).toBe('2000-03-15');
    expect(years.kind === 'ready' && years.nextViewBoundaryDate).toBe('2002-02-28');
  });
});
