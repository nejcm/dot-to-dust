import type * as WidgetSnapshotStoreModule from '../lib/widget-snapshot-store';

interface MmkvMock {
  __mockMmkvClear: () => void;
  __mockMmkvGetString: (key: string) => string | undefined;
}

function mmkvMock(): MmkvMock {
  return jest.requireMock('react-native-mmkv') as MmkvMock;
}

function loadModule(): typeof WidgetSnapshotStoreModule {
  jest.resetModules();
  return require('../lib/widget-snapshot-store') as typeof WidgetSnapshotStoreModule;
}

describe('widget snapshot store', () => {
  beforeEach(() => {
    mmkvMock().__mockMmkvClear();
  });

  it('persists a versioned ready snapshot for native widgets', () => {
    const {
      syncWidgetSnapshot,
      WIDGET_SNAPSHOT_KEY,
      WIDGET_SNAPSHOT_VERSION,
    } = loadModule();

    syncWidgetSnapshot({
      preferences: {
        defaultView: 'weeks',
        dob: '2000-01-01',
        theme: 'system',
      },
      resolvedColorScheme: 'dark',
      today: '2000-01-08',
    });

    expect(JSON.parse(mmkvMock().__mockMmkvGetString(WIDGET_SNAPSHOT_KEY) ?? '')).toMatchObject({
      schemaVersion: WIDGET_SNAPSHOT_VERSION,
      snapshot: {
        dob: '2000-01-01',
        kind: 'ready',
        resolvedTheme: 'dark',
        view: 'weeks',
      },
    });
  });

  it('persists setup state when onboarding is incomplete', () => {
    const { readPersistedWidgetSnapshot, syncWidgetSnapshot } = loadModule();

    syncWidgetSnapshot({
      preferences: {
        defaultView: 'months',
        dob: null,
        theme: 'light',
      },
      resolvedColorScheme: 'light',
      today: '2026-05-28',
    });

    expect(readPersistedWidgetSnapshot()).toEqual({
      schemaVersion: 2,
      snapshot: {
        cta: 'Set date of birth',
        kind: 'setup',
        nextSafetyRefreshDate: '2026-05-29',
      },
    });
  });
});
