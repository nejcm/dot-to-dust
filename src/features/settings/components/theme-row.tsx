import type { ThemePreference } from '@/lib/storage/preferences-store';

import { useAppTranslation } from '@/lib/i18n/use-translation';
import { setThemePreference, useThemePreference } from '@/lib/storage/preferences-store';

import { PreferencePickerRow } from './preference-picker-row';

const THEMES: ThemePreference[] = ['light', 'dark', 'system'];

export function ThemeRow() {
  const theme = useThemePreference();
  const { t } = useAppTranslation();
  const options = THEMES.map((value) => ({
    label: t(`settings.theme.${value}`),
    testID: `theme-${value}`,
    value,
  }));

  return (
    <PreferencePickerRow
      label={t('settings.theme.label')}
      value={theme}
      options={options}
      onChange={setThemePreference}
      editAccessibilityLabel={t('settings.theme.edit')}
      editTestID="settings-theme-edit"
      pickerTestID="settings-theme-picker"
    />
  );
}
