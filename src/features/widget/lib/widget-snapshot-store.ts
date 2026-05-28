import type {
  ResolvedWidgetTheme,
  WidgetColors,
  WidgetDisplay,
  WidgetReadySnapshot,
  WidgetSetupSnapshot,
  WidgetSnapshot,
} from './widget-snapshot';
import type { PreferencesState } from '@/lib/storage/preferences-store';

import { mmkv } from '@/lib/storage/mmkv';
import { writeNativeWidgetSnapshot } from './native-widget-bridge';
import { buildWidgetSnapshot } from './widget-snapshot';

export const WIDGET_SNAPSHOT_KEY = 'widget-snapshot';
export const WIDGET_SNAPSHOT_VERSION = 3;

type PersistedWidgetSnapshotValue
  = | PersistedWidgetReadySnapshot
    | WidgetSetupSnapshot;

interface PersistedWidgetReadySnapshot {
  kind: 'ready';
  dob: string;
  view: WidgetReadySnapshot['view'];
  theme: WidgetReadySnapshot['theme'];
  resolvedTheme: WidgetReadySnapshot['resolvedTheme'];
  lived: number;
  total: number;
  percent: number;
  progress: number;
  bonus: boolean;
  display: WidgetDisplay;
  colors: WidgetColors;
  nextViewBoundaryDate: string;
  nextSafetyRefreshDate: string;
}

export interface PersistedWidgetSnapshot {
  schemaVersion: typeof WIDGET_SNAPSHOT_VERSION;
  snapshot: PersistedWidgetSnapshotValue;
}

export interface SyncWidgetSnapshotInput {
  preferences: PreferencesState;
  resolvedColorScheme: ResolvedWidgetTheme;
  today: string;
}

export function syncWidgetSnapshot(input: SyncWidgetSnapshotInput): WidgetSnapshot {
  const { preferences, resolvedColorScheme, today } = input;
  const snapshot = buildWidgetSnapshot({
    dob: preferences.dob,
    resolvedColorScheme,
    theme: preferences.theme,
    today,
    view: preferences.defaultView,
    widgetSize: 'small',
  });

  writeWidgetSnapshot(snapshot);
  return snapshot;
}

export function writeWidgetSnapshot(snapshot: WidgetSnapshot): void {
  const persisted: PersistedWidgetSnapshot = {
    schemaVersion: WIDGET_SNAPSHOT_VERSION,
    snapshot: toPersistedWidgetSnapshot(snapshot),
  };

  const payload = JSON.stringify(persisted);
  mmkv.set(WIDGET_SNAPSHOT_KEY, payload);
  writeNativeWidgetSnapshot(payload);
}

function toPersistedWidgetSnapshot(snapshot: WidgetSnapshot): PersistedWidgetSnapshotValue {
  if (snapshot.kind === 'setup') return snapshot;

  const {
    colors,
    display,
    dob,
    lived,
    total,
    percent,
    progress,
    bonus,
    view,
    theme,
    resolvedTheme,
    nextViewBoundaryDate,
    nextSafetyRefreshDate,
  } = snapshot;

  return {
    kind: 'ready',
    dob,
    view,
    theme,
    resolvedTheme,
    lived,
    total,
    percent,
    progress,
    bonus,
    display,
    colors,
    nextViewBoundaryDate,
    nextSafetyRefreshDate,
  };
}

export function readPersistedWidgetSnapshot(): PersistedWidgetSnapshot | null {
  const value = mmkv.getString(WIDGET_SNAPSHOT_KEY);
  if (!value) return null;

  try {
    const parsed = JSON.parse(value) as unknown;
    if (!isPersistedWidgetSnapshot(parsed)) return null;
    return parsed;
  }
  catch {
    return null;
  }
}

function isPersistedWidgetSnapshot(value: unknown): value is PersistedWidgetSnapshot {
  if (
    !value
    || typeof value !== 'object'
    || !('schemaVersion' in value)
    || value.schemaVersion !== WIDGET_SNAPSHOT_VERSION
    || !('snapshot' in value)
    || !value.snapshot
    || typeof value.snapshot !== 'object'
    || !('kind' in value.snapshot)
  ) {
    return false;
  }

  if (value.snapshot.kind === 'setup') return true;

  return (
    value.snapshot.kind === 'ready'
    && 'dob' in value.snapshot
    && typeof value.snapshot.dob === 'string'
    && 'colors' in value.snapshot
    && !('dots' in value.snapshot)
    && !('widgetGrid' in value.snapshot)
  );
}
