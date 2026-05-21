import type { usePreferencesStore as usePreferencesStoreType } from './preferences-store';

interface MmkvMock {
  __mockMmkvClear: () => void;
  __mockMmkvSetString: (key: string, value: string) => void;
}

const STORAGE_KEY = 'preferences';

function mmkvMock(): MmkvMock {
  return jest.requireMock('react-native-mmkv') as MmkvMock;
}

function loadStore(): typeof usePreferencesStoreType {
  jest.resetModules();
  return require('./preferences-store').usePreferencesStore as typeof usePreferencesStoreType;
}

describe('preferences store', () => {
  beforeEach(() => {
    mmkvMock().__mockMmkvClear();
  });

  it('uses first-launch defaults', () => {
    const usePreferencesStore = loadStore();

    expect(usePreferencesStore.getState()).toMatchObject({
      dob: null,
      theme: 'system',
      defaultView: 'weeks',
    });
  });

  it('hydrates synchronously on module load', () => {
    mmkvMock().__mockMmkvSetString(
      STORAGE_KEY,
      JSON.stringify({ dob: '2024-02-29', theme: 'dark', defaultView: 'years' }),
    );

    const usePreferencesStore = loadStore();

    expect(usePreferencesStore.getState()).toMatchObject({
      dob: '2024-02-29',
      theme: 'dark',
      defaultView: 'years',
    });
  });

  it('falls back to defaults for corrupt JSON', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    mmkvMock().__mockMmkvSetString(STORAGE_KEY, '{');

    const usePreferencesStore = loadStore();

    expect(usePreferencesStore.getState().dob).toBeNull();
    expect(warnSpy).toHaveBeenCalledTimes(1);
    warnSpy.mockRestore();
  });

  it('falls back to defaults for invalid DOB values', () => {
    mmkvMock().__mockMmkvSetString(
      STORAGE_KEY,
      JSON.stringify({ dob: '2023-02-29', theme: 'dark', defaultView: 'months' }),
    );

    const usePreferencesStore = loadStore();

    expect(usePreferencesStore.getState()).toMatchObject({
      dob: null,
      theme: 'system',
      defaultView: 'weeks',
    });
  });
});
