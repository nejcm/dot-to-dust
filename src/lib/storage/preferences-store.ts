import { z } from 'zod/v4';
import { create } from 'zustand';

import { mmkv } from './mmkv';

const STORAGE_KEY = 'preferences';
const CIVIL_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] as const;

function isLeapYear(year: number): boolean {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

function isCivilDate(value: string): boolean {
  if (!CIVIL_DATE_PATTERN.test(value)) return false;

  const [yearRaw, monthRaw, dayRaw] = value.split('-');
  const year = Number(yearRaw);
  const month = Number(monthRaw);
  const day = Number(dayRaw);

  if (month < 1 || month > 12) return false;

  const maxDay = month === 2 && isLeapYear(year) ? 29 : DAYS_IN_MONTH[month - 1];
  return day >= 1 && day <= maxDay;
}

const dobSchema = z.string().refine(isCivilDate).nullable().default(null);

const prefsSchema = z.object({
  dob: dobSchema,
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
  catch (error) {
    if (__DEV__) {
      console.warn('Failed to load preferences from MMKV.', error);
    }
  }
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
