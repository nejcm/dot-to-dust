import { z } from 'zod/v4';
import { create } from 'zustand';

import { mmkv } from './mmkv';

const STORAGE_KEY = 'preferences';

const prefsSchema = z.object({
  dob: z.string().nullable().default(null),
  theme: z.enum(['light', 'dark', 'system']).default('system'),
  defaultView: z.enum(['weeks', 'months', 'years']).default('weeks'),
});

type Prefs = z.infer<typeof prefsSchema>;

function loadStoredPrefs(): Prefs {
  try {
    const raw = mmkv.getString(STORAGE_KEY);
    if (raw) {
      const parsed = prefsSchema.safeParse(JSON.parse(raw));
      if (parsed.success) return parsed.data;
    }
  }
  catch {}
  return prefsSchema.parse({});
}

function persistPrefs(prefs: Prefs): void {
  mmkv.set(STORAGE_KEY, JSON.stringify(prefs));
}

interface PreferencesStore extends Prefs {
  setDob: (dob: string | null) => void;
  setTheme: (theme: Prefs['theme']) => void;
  setDefaultView: (view: Prefs['defaultView']) => void;
}

const initialPrefs = loadStoredPrefs();

export const usePreferencesStore = create<PreferencesStore>()((set) => ({
  ...initialPrefs,
  setDob: (dob) => {
    set((s) => {
      const next: Prefs = { dob, theme: s.theme, defaultView: s.defaultView };
      persistPrefs(next);
      return { dob };
    });
  },
  setTheme: (theme) => {
    set((s) => {
      const next: Prefs = { dob: s.dob, theme, defaultView: s.defaultView };
      persistPrefs(next);
      return { theme };
    });
  },
  setDefaultView: (defaultView) => {
    set((s) => {
      const next: Prefs = { dob: s.dob, theme: s.theme, defaultView };
      persistPrefs(next);
      return { defaultView };
    });
  },
}));
