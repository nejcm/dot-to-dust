import type { View as ViewMode } from '@/lib/view';

import { useAppTranslation } from '@/lib/i18n/use-translation';
import { setDefaultViewPreference, useDefaultViewPreference } from '@/lib/storage/preferences-store';
import { VIEWS } from '@/lib/view';

import { PreferencePickerRow } from './preference-picker-row';

export function DefaultViewRow() {
  const defaultView = useDefaultViewPreference();
  const { t } = useAppTranslation();
  const options = VIEWS.map((value: ViewMode) => ({
    label: t(`grid.toggle.${value}`),
    value,
  }));

  return (
    <PreferencePickerRow
      label={t('settings.defaultView.label')}
      value={defaultView}
      options={options}
      onChange={setDefaultViewPreference}
      editAccessibilityLabel={t('settings.defaultView.edit')}
      editTestID="settings-default-view-edit"
      pickerTestID="settings-default-view-picker"
    />
  );
}
