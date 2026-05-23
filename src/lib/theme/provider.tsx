import type { ColorTokens } from './tokens';
import { createContext, useEffect, useMemo } from 'react';

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
  const themePref = usePreferencesStore.use.theme();

  useEffect(() => {
    Uniwind.setTheme(themePref);
  }, [themePref]);

  const colorScheme: 'light' | 'dark'
    = themePref === 'system' ? systemColorScheme : themePref;
  const isDark = colorScheme === 'dark';
  const tokens = isDark ? darkTokens : lightTokens;
  const value = useMemo(
    () => ({ colorScheme, tokens, isDark }),
    [colorScheme, isDark, tokens],
  );

  return (
    <ThemeContext value={value}>
      {children}
    </ThemeContext>
  );
}
