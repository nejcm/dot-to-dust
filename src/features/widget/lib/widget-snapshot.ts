import type { DotState } from '@/features/grid/lib/dot-states';
import type { GridLayout } from '@/features/grid/lib/grid-layout';
import type { ThemePreference } from '@/lib/storage/preferences-store';
import type { View } from '@/lib/view';

import { addDays } from 'date-fns';

import { computeGridLayout } from '@/features/grid/lib/grid-layout';
import { buildLifeGridProjection } from '@/features/grid/lib/life-grid-state';
import { nextViewBoundaryDate } from '@/features/grid/lib/view-policy';
import { parseCivilDate, toCivilDateString } from '@/lib/civil-date';
import { darkSkiaTokens, darkTokens, lightSkiaTokens, lightTokens, toHex } from '@/lib/theme/tokens';

export type WidgetSize = 'small' | 'medium' | 'large';
export type ResolvedWidgetTheme = 'light' | 'dark';

export interface WidgetGridArea {
  width: number;
  height: number;
}

export interface BuildWidgetSnapshotInput {
  dob: string | null;
  resolvedColorScheme?: ResolvedWidgetTheme;
  theme: ThemePreference;
  today: string;
  view: View;
  widgetSize: WidgetSize;
  widgetGridArea?: WidgetGridArea;
}

export interface WidgetDisplay {
  hero: string;
  percent: string;
  viewLabel: View;
}

export interface WidgetGridSnapshot {
  layout: GridLayout;
  dots: DotState[];
  dotSize: number;
  todayRing: 'static' | null;
}

export interface WidgetColors {
  stages: readonly [string, string, string, string, string];
  future: string;
  ring: string;
  accent: string;
  background: string;
  text: string;
  secondaryText: string;
  progressTrack: string;
}

export type WidgetSnapshot
  = | WidgetReadySnapshot
    | WidgetSetupSnapshot;

export interface WidgetReadySnapshot {
  kind: 'ready';
  dob: string;
  view: View;
  theme: ThemePreference;
  resolvedTheme: ResolvedWidgetTheme;
  lived: number;
  total: number;
  percent: number;
  progress: number;
  bonus: boolean;
  dots: DotState[];
  display: WidgetDisplay;
  colors: WidgetColors;
  widgetGrid: WidgetGridSnapshot | null;
  nextViewBoundaryDate: string;
  nextSafetyRefreshDate: string;
}

export interface WidgetSetupSnapshot {
  kind: 'setup';
  cta: 'Set date of birth';
  nextSafetyRefreshDate: string;
}

const MIN_WIDGET_DOT_SIZE = 2;
const NUMBER_FORMAT = new Intl.NumberFormat('en-US');

export function buildWidgetSnapshot(input: BuildWidgetSnapshotInput): WidgetSnapshot {
  const {
    dob,
    resolvedColorScheme = 'light',
    theme,
    today,
    view,
    widgetGridArea,
    widgetSize,
  } = input;
  const nextSafetyRefreshDate = toCivilDateString(addDays(parseCivilDate(today), 1));
  const resolvedTheme = resolveWidgetTheme(theme, resolvedColorScheme);

  if (dob === null) {
    return {
      kind: 'setup',
      cta: 'Set date of birth',
      nextSafetyRefreshDate,
    };
  }

  const projection = buildLifeGridProjection({ view, dob, today });
  const { dots, header, headline } = projection;
  const progress = headline.bonus ? 1 : Math.min(1, header.lived / header.total);

  return {
    kind: 'ready',
    dob,
    view,
    theme,
    resolvedTheme,
    lived: header.lived,
    total: header.total,
    percent: header.percent,
    progress,
    bonus: projection.bonus,
    dots,
    display: {
      hero: headline.bonus
        ? `+${formatCount(headline.count)} ${view} ahead`
        : `${formatCount(header.lived)} / ${formatCount(header.total)}`,
      percent: `${headline.bonus ? 100 : header.percent}%`,
      viewLabel: view,
    },
    colors: colorsForTheme(resolvedTheme),
    widgetGrid: buildWidgetGridSnapshot({
      area: widgetGridArea,
      bonus: projection.bonus,
      dots,
      view,
      widgetSize,
    }),
    nextViewBoundaryDate: nextViewBoundaryDate(view, dob, today),
    nextSafetyRefreshDate,
  };
}

interface BuildWidgetGridSnapshotInput {
  area: WidgetGridArea | undefined;
  bonus: boolean;
  dots: DotState[];
  view: View;
  widgetSize: WidgetSize;
}

function buildWidgetGridSnapshot(input: BuildWidgetGridSnapshotInput): WidgetGridSnapshot | null {
  const { area, bonus, dots, view, widgetSize } = input;

  if (widgetSize === 'small' || !area) return null;

  const layout = computeGridLayout(view, area.width, area.height);
  if (layout.dotSize < MIN_WIDGET_DOT_SIZE) return null;

  return {
    layout,
    dots,
    dotSize: layout.dotSize,
    todayRing: bonus ? null : 'static',
  };
}

function colorsForTheme(theme: ResolvedWidgetTheme): WidgetColors {
  const skiaTokens = theme === 'dark' ? darkSkiaTokens : lightSkiaTokens;
  const tokens = theme === 'dark' ? darkTokens : lightTokens;

  return {
    ...skiaTokens,
    background: toHex(tokens.surface),
    text: toHex(tokens.ink),
    secondaryText: toHex(tokens.inkSoft),
    progressTrack: toHex(tokens.hairline),
  };
}

function resolveWidgetTheme(
  theme: ThemePreference,
  resolvedColorScheme: ResolvedWidgetTheme,
): ResolvedWidgetTheme {
  return theme === 'system' ? resolvedColorScheme : theme;
}

function formatCount(value: number): string {
  return NUMBER_FORMAT.format(value);
}
