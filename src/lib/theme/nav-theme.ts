import type { ColorTokens } from './tokens';

import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { toHex } from './tokens';

/**
 * Builds a React Navigation Theme object whose colors are derived from the
 * active design-system tokens. Pass the result to NavigationThemeProvider so
 * modals, sheets, and platform chrome stay in sync with the app's palette.
 */
export function toNavTheme(tokens: ColorTokens, isDark: boolean) {
  const base = isDark ? DarkTheme : DefaultTheme;
  return {
    ...base,
    colors: {
      ...base.colors,
      background: toHex(tokens.bg),
      card: toHex(tokens.surface),
      text: toHex(tokens.ink),
      border: toHex(tokens.hairline),
      primary: toHex(tokens.accent),
      notification: toHex(tokens.accent),
    },
  };
}
