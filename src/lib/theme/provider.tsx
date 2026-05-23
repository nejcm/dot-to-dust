import type { ColorTokens, SkiaTokens } from './tokens';
import { createContext, useEffect, useMemo } from 'react';

import { useColorScheme } from 'react-native';
import { Uniwind } from 'uniwind';

import { useThemePreference } from '@/lib/storage/preferences-store';
import { darkSkiaTokens, darkTokens, lightSkiaTokens, lightTokens } from './tokens';

export interface ThemeContextValue {
  colorScheme: 'light' | 'dark';
  tokens: ColorTokens;
  skiaTokens: SkiaTokens;
  isDark: boolean;
}

// eslint-disable-next-line react-refresh/only-export-components -- context must be co-located with provider
export const ThemeContext = createContext<ThemeContextValue>({
  colorScheme: 'light',
  tokens: lightTokens,
  skiaTokens: lightSkiaTokens,
  isDark: false,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemRaw = useColorScheme();
  const systemColorScheme: 'light' | 'dark'
    = systemRaw === 'dark' ? 'dark' : 'light';
  const themePref = useThemePreference();

  useEffect(() => {
    Uniwind.setTheme(themePref);
  }, [themePref]);

  const colorScheme: 'light' | 'dark'
    = themePref === 'system' ? systemColorScheme : themePref;
  const isDark = colorScheme === 'dark';
  const tokens = isDark ? darkTokens : lightTokens;
  const skiaTokens = isDark ? darkSkiaTokens : lightSkiaTokens;
  const value = useMemo(
    () => ({ colorScheme, tokens, skiaTokens, isDark }),
    [colorScheme, isDark, skiaTokens, tokens],
  );

  return (
    <ThemeContext value={value}>
      {children}
    </ThemeContext>
  );
}
