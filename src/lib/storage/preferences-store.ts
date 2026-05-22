import type { StateStorage } from 'zustand/middleware';
import { z } from 'zod/v4';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { isPastOrTodayCivilDate } from '@/lib/civil-date';
import { createSelectors } from '@/lib/utils';
import { DEFAULT_VIEW, VIEWS } from '@/lib/view';
import { mmkvStorage } from './mmkv';

export const STORAGE_KEY = 'preferences';

const dobSchema = z.string().refine(isPastOrTodayCivilDate).nullable().default(null);

const prefsSchema = z.object({
  dob: dobSchema,
  theme: z.enum(['light', 'dark', 'system']).default('system'),
  defaultView: z.enum(VIEWS).default(DEFAULT_VIEW),
});

export type PreferencesState = z.infer<typeof prefsSchema>;

const preferencesStorage: StateStorage = {
  ...mmkvStorage,
  getItem: (name) => {
    const value = mmkvStorage.getItem(name);
    if (value instanceof Promise) return value;
    if (!value) return value;

    try {
      const parsed = JSON.parse(value) as unknown;
      if (parsed && typeof parsed === 'object' && 'state' in parsed) return value;

      return JSON.stringify({ state: parsed, version: 0 });
    }
    catch {
      return value;
    }
  },
};

const _usePreferencesStore = create<PreferencesState>()(
  persist(
    () => ({
      ...prefsSchema.parse({}),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => preferencesStorage),
      partialize: (state) => ({
        dob: state.dob,
        theme: state.theme,
        defaultView: state.defaultView,
      }),
      onRehydrateStorage: () => (_state, error) => {
        if (error && __DEV__) {
          console.warn('Failed to load preferences from MMKV.', error);
        }
      },
      // Whole-record rejection: if any field is invalid (e.g. a corrupt DOB),
      // fall back to all defaults rather than merging in the valid fields.
      // This is intentional — partial preference state (e.g. dark theme but a
      // null DOB that was previously set) is harder to reason about than a clean
      // reset. The trade-off: a user with a valid theme preference and only an
      // invalid DOB loses the theme setting on next launch. Accept this for now;
      // revisit if field-level recovery becomes a user need.
      merge: (persistedState, currentState) => {
        const parsed = prefsSchema.safeParse(persistedState);
        if (parsed.success) return { ...currentState, ...parsed.data };
        return currentState;
      },
    },
  ),
);

export const usePreferencesStore = createSelectors(_usePreferencesStore);

export function getPreferencesState(): PreferencesState {
  return _usePreferencesStore.getState();
}

export function updatePreferencesState(
  state: Partial<PreferencesState> | ((prev: PreferencesState) => Partial<PreferencesState>),
): void {
  _usePreferencesStore.setState((prev) => ({
    ...prev,
    ...(typeof state === 'function' ? state(prev) : state),
  }));
}

export function setDob(dob: string | null): void {
  updatePreferencesState({ dob: dobSchema.catch(null).parse(dob) });
}

export function setTheme(theme: PreferencesState['theme']): void {
  updatePreferencesState({ theme });
}

export function setDefaultView(defaultView: PreferencesState['defaultView']): void {
  updatePreferencesState({ defaultView });
}
