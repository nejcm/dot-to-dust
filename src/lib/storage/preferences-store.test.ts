import type { usePreferencesStore as usePreferencesStoreType } from './preferences-store';
import { STORAGE_KEY } from './preferences-store';

interface MmkvMock {
  __mockMmkvClear: () => void;
  __mockMmkvSetString: (key: string, value: string) => void;
  __mockMmkvGetString: (key: string) => string | undefined;
}

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
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2024, 2, 1));
  });

  afterEach(() => {
    jest.useRealTimers();
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

  it('falls back to defaults for future persisted DOB values', () => {
    mmkvMock().__mockMmkvSetString(
      STORAGE_KEY,
      JSON.stringify({ dob: '2024-03-02', theme: 'dark', defaultView: 'months' }),
    );

    const usePreferencesStore = loadStore();

    expect(usePreferencesStore.getState()).toMatchObject({
      dob: null,
      theme: 'system',
      defaultView: 'weeks',
    });
  });

  it('rejects future DOB setter values', () => {
    const usePreferencesStore = loadStore();

    usePreferencesStore.getState().setDob('2024-03-02');

    expect(usePreferencesStore.getState().dob).toBeNull();
  });

  it('persists setter mutations so they survive a reload', () => {
    const usePreferencesStore = loadStore();

    usePreferencesStore.getState().setDob('1990-06-15');
    usePreferencesStore.getState().setTheme('dark');
    usePreferencesStore.getState().setDefaultView('months');

    // Simulate an app restart by reloading the module (MMKV mock retains data).
    const usePreferencesStore2 = loadStore();

    expect(usePreferencesStore2.getState()).toMatchObject({
      dob: '1990-06-15',
      theme: 'dark',
      defaultView: 'months',
    });
  });
});
