import { useState } from 'react';
import { Platform, Pressable, View } from 'react-native';

import { defaultDobCivilDate, formatCivilDateForDisplay, todayCivilDate } from '@/lib/civil-date';
import { NativeCivilDatePicker } from '@/lib/civil-date/native-civil-date-picker';
import { useAppTranslation } from '@/lib/i18n/use-translation';
import { setDob, usePreferencesStore } from '@/lib/storage/preferences-store';
import { Hairline } from '@/lib/theme/components/hairline';
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
    <>
      {!editing && (
        <SettingRow label={t('settings.dob.label')}>
          <Pressable
            onPress={handleEdit}
            hitSlop={12}
            accessibilityLabel={t('settings.dob.edit')}
            accessibilityRole="button"
            className="min-h-11 flex-row items-center justify-end gap-[10px]"
            style={getPressedStyle}
          >
            <Text variant="meta" tone="muted" numberOfLines={1}>
              {formattedDob}
            </Text>
            <Text tone="faint" className="text-micro">
              ›
            </Text>
          </Pressable>
        </SettingRow>
      )}

      {editing && (
        <View>
          <View className="py-5">
            <Text variant="meta" tone="ink" className="mb-3">
              {t('settings.dob.label')}
            </Text>
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
                    <Text variant="micro" tone="muted" className="font-medium tracking-[2px] uppercase">
                      {t('settings.dob.cancel')}
                    </Text>
                  </Pressable>
                  <Pressable onPress={handleDone} className="min-h-11 justify-center" style={getPressedStyle}>
                    <Text variant="micro" tone="ink" className="font-medium tracking-[2px] uppercase">
                      {t('settings.dob.done')}
                    </Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>
          <Hairline />
        </View>
      )}
    </>
  );
}
