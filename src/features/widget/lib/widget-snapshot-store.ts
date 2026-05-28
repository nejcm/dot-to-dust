import type { ResolvedWidgetTheme, WidgetSnapshot } from './widget-snapshot';
import type { PreferencesState } from '@/lib/storage/preferences-store';

import { mmkv } from '@/lib/storage/mmkv';
import { writeNativeWidgetSnapshot } from './native-widget-bridge';
import { buildWidgetSnapshot } from './widget-snapshot';

export const WIDGET_SNAPSHOT_KEY = 'widget-snapshot';
export const WIDGET_SNAPSHOT_VERSION = 1;

export interface PersistedWidgetSnapshot {
  schemaVersion: typeof WIDGET_SNAPSHOT_VERSION;
  snapshot: WidgetSnapshot;
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
    snapshot,
  };

  const payload = JSON.stringify(persisted);
  mmkv.set(WIDGET_SNAPSHOT_KEY, payload);
  writeNativeWidgetSnapshot(payload);
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
  return Boolean(
    value
    && typeof value === 'object'
    && 'schemaVersion' in value
    && value.schemaVersion === WIDGET_SNAPSHOT_VERSION
    && 'snapshot' in value
    && value.snapshot
    && typeof value.snapshot === 'object'
    && 'kind' in value.snapshot,
  );
}
