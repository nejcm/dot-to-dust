import type { PersistStorage, StorageValue } from 'zustand/middleware';
import { z } from 'zod/v4';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { isPastOrTodayCivilDate } from '@/lib/civil-date';
import { mmkv } from './mmkv';

export const STORAGE_KEY = 'preferences';

const dobSchema = z.string().refine(isPastOrTodayCivilDate).nullable().default(null);

const prefsSchema = z.object({
  dob: dobSchema,
  theme: z.enum(['light', 'dark', 'system']).default('system'),
  defaultView: z.enum(['weeks', 'months', 'years']).default('weeks'),
});

type Prefs = z.infer<typeof prefsSchema>;

// Stores the raw Prefs JSON instead of zustand's default `{ state, version }`
// envelope. The on-disk format must stay a plain Prefs object so the schema
// can be evolved without writing a migration just to unwrap the envelope.
const mmkvPersistStorage: PersistStorage<Prefs> = {
  getItem: (name) => {
    const raw = mmkv.getString(name);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as Partial<Prefs>;
      return { state: parsed } as StorageValue<Prefs>;
    }
    catch (error) {
      if (__DEV__) {
        console.warn('Failed to load preferences from MMKV.', error);
      }
      return null;
    }
  },
  setItem: (name, value) => {
    mmkv.set(name, JSON.stringify(value.state));
  },
  removeItem: (name) => {
    mmkv.remove(name);
  },
};

interface PreferencesStore extends Prefs {
  setDob: (dob: string | null) => void;
  setTheme: (theme: Prefs['theme']) => void;
  setDefaultView: (view: Prefs['defaultView']) => void;
}

export const usePreferencesStore = create<PreferencesStore>()(
  persist(
    (set) => ({
      ...prefsSchema.parse({}),
      setDob: (dob) => set({ dob: dobSchema.catch(null).parse(dob) }),
      setTheme: (theme) => set({ theme }),
      setDefaultView: (defaultView) => set({ defaultView }),
    }),
    {
      name: STORAGE_KEY,
      storage: mmkvPersistStorage,
      partialize: (state) => ({
        dob: state.dob,
        theme: state.theme,
        defaultView: state.defaultView,
      }),
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
