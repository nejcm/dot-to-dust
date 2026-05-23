import { useState } from 'react';
import { Platform, Pressable, View } from 'react-native';

import { defaultDobCivilDate, formatCivilDateForDisplay, todayCivilDate } from '@/lib/civil-date';
import { NativeCivilDatePicker } from '@/lib/civil-date/native-civil-date-picker';
import { useAppTranslation } from '@/lib/i18n/use-translation';
import { setDob, usePreferencesStore } from '@/lib/storage/preferences-store';
import { Text } from '@/lib/theme/components/text';

import { getPressedStyle } from '@/lib/theme/utils/get-pressed-style';

import { SettingRow } from './setting-row';

export function DobRow() {
  const dob = usePreferencesStore.use.dob();
  const { t } = useAppTranslation();

  const [editing, setEditing] = useState(false);
  const today = todayCivilDate();
  const fallbackDob = defaultDobCivilDate(today);
  const [pendingDob, setPendingDob] = useState(dob ?? fallbackDob);

  const formattedDob = dob ? formatCivilDateForDisplay(dob) : t('settings.dob.notSet');

  const handleEdit = () => {
    setPendingDob(dob ?? fallbackDob);
    setEditing(true);
  };

  const handleDone = () => {
    setDob(pendingDob);
    setEditing(false);
  };

  const handleCancel = () => {
    setPendingDob(dob ?? fallbackDob);
    setEditing(false);
  };

  return (
    <SettingRow label={t('settings.dob.label')}>
      {!editing && (
        <View className="min-h-11 flex-row items-center justify-between gap-4">
          <Text variant="body" tone="ink" numberOfLines={2} className="flex-1">
            {formattedDob}
          </Text>
          <Pressable onPress={handleEdit} hitSlop={12} className="min-h-11 justify-center" style={getPressedStyle}>
            <Text variant="eyebrow" tone="muted">
              {t('settings.dob.edit')}
            </Text>
          </Pressable>
        </View>
      )}

      {editing && (
        <>
          {Platform.OS === 'android' && (
            <NativeCivilDatePicker
              value={pendingDob}
              maximumValue={today}
              onChange={setDob}
              onAndroidClose={() => setEditing(false)}
            />
          )}
          {Platform.OS === 'ios' && (
            <>
              <NativeCivilDatePicker
                value={pendingDob}
                maximumValue={today}
                onChange={setPendingDob}
                display="spinner"
              />
              <View className="mt-2 flex-row justify-end gap-6">
                <Pressable onPress={handleCancel} className="min-h-11 justify-center" style={getPressedStyle}>
                  <Text variant="eyebrow" tone="muted">
                    {t('settings.dob.cancel')}
                  </Text>
                </Pressable>
                <Pressable onPress={handleDone} className="min-h-11 justify-center" style={getPressedStyle}>
                  <Text variant="eyebrow" tone="ink" className="font-medium">
                    {t('settings.dob.done')}
                  </Text>
                </Pressable>
              </View>
            </>
          )}
        </>
      )}
    </SettingRow>
  );
}
