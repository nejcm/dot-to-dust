import type { ThemeContextValue } from './provider';

import { use } from 'react';
import { ThemeContext } from './provider';

export function useTheme(): ThemeContextValue {
  return use(ThemeContext);
}
