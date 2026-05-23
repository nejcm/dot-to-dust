import type { PreferencesState } from './preferences-store';

import {
  getPreferencesState,
  setDefaultView,
  setDob,
  setTheme,
  usePreferencesStore,
} from './preferences-store';

export type ThemePreference = PreferencesState['theme'];
export type DefaultViewPreference = PreferencesState['defaultView'];

export function useDobPreference(): PreferencesState['dob'] {
  return usePreferencesStore((state) => state.dob);
}

export function useThemePreference(): ThemePreference {
  return usePreferencesStore((state) => state.theme);
}

export function useDefaultViewPreference(): DefaultViewPreference {
  return usePreferencesStore((state) => state.defaultView);
}

export function getPreferences(): PreferencesState {
  return getPreferencesState();
}

export function setDobPreference(dob: string | null): void {
  setDob(dob);
}

export function setThemePreference(theme: ThemePreference): void {
  setTheme(theme);
}

export function setDefaultViewPreference(defaultView: DefaultViewPreference): void {
  setDefaultView(defaultView);
}
