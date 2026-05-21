import type { ColorTokens } from './tokens';
import { createContext, useEffect } from 'react';

import { useColorScheme } from 'react-native';
import { Uniwind } from 'uniwind';

import { usePreferencesStore } from '@/lib/storage/preferences-store';
import { darkTokens, lightTokens } from './tokens';

export interface ThemeContextValue {
  colorScheme: 'light' | 'dark';
  tokens: ColorTokens;
  isDark: boolean;
}

// eslint-disable-next-line react-refresh/only-export-components -- context must be co-located with provider
export const ThemeContext = createContext<ThemeContextValue>({
  colorScheme: 'light',
  tokens: lightTokens,
  isDark: false,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemRaw = useColorScheme();
  const systemColorScheme: 'light' | 'dark'
    = systemRaw === 'dark' ? 'dark' : 'light';
  const themePref = usePreferencesStore((s) => s.theme);

  useEffect(() => {
    Uniwind.setTheme(themePref);
  }, [themePref]);

  const colorScheme: 'light' | 'dark'
    = themePref === 'system' ? systemColorScheme : themePref;
  const isDark = colorScheme === 'dark';
  const tokens = isDark ? darkTokens : lightTokens;

  return (
    <ThemeContext value={{ colorScheme, tokens, isDark }}>
      {children}
    </ThemeContext>
  );
}
