import type { ResolvedWidgetTheme } from './widget-snapshot';

import { useCallback, useEffect } from 'react';
import { AppState } from 'react-native';

import { todayCivilDate } from '@/lib/civil-date';
import {
  getPreferences,
  useDefaultViewPreference,
  useDobPreference,
  useThemePreference,
} from '@/lib/storage/preferences-store';
import { syncWidgetSnapshot } from './widget-snapshot-store';

export function useWidgetSnapshotSync(resolvedColorScheme: ResolvedWidgetTheme): void {
  const dob = useDobPreference();
  const theme = useThemePreference();
  const defaultView = useDefaultViewPreference();

  const sync = useCallback(() => {
    syncWidgetSnapshot({
      preferences: getPreferences(),
      resolvedColorScheme,
      today: todayCivilDate(),
    });
  }, [resolvedColorScheme]);

  useEffect(() => {
    sync();
  }, [defaultView, dob, sync, theme]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') sync();
    });

    return () => {
      subscription.remove();
    };
  }, [sync]);
}
