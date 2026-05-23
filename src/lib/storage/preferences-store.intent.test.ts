import type * as PreferencesModule from './preferences-store';

interface MmkvMock {
  __mockMmkvClear: () => void;
}

function mmkvMock(): MmkvMock {
  return jest.requireMock('react-native-mmkv') as MmkvMock;
}

function loadPreferencesModule(): typeof PreferencesModule {
  jest.resetModules();
  return require('./preferences-store') as typeof PreferencesModule;
}

describe('preferences intent', () => {
  beforeEach(() => {
    mmkvMock().__mockMmkvClear();
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2024, 2, 1));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('updates preferences through intent actions', () => {
    const {
      getPreferences,
      setDefaultViewPreference,
      setDobPreference,
      setThemePreference,
    } = loadPreferencesModule();

    setDobPreference('1990-06-15');
    setThemePreference('dark');
    setDefaultViewPreference('months');

    expect(getPreferences()).toMatchObject({
      dob: '1990-06-15',
      theme: 'dark',
      defaultView: 'months',
    });
  });

  it('keeps DOB validation behind the intent interface', () => {
    const { getPreferences, setDobPreference } = loadPreferencesModule();

    setDobPreference('2024-03-02');

    expect(getPreferences().dob).toBeNull();
  });
});
