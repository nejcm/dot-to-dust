import { useState } from 'react';
import { Platform, Pressable, View } from 'react-native';

import { defaultDobCivilDate, formatCivilDateForDisplay, todayCivilDate } from '@/lib/civil-date';
import { NativeCivilDatePicker } from '@/lib/civil-date/native-civil-date-picker';
import { useAppTranslation } from '@/lib/i18n/use-translation';
import { usePreferencesStore } from '@/lib/storage/preferences-store';
import { Text } from '@/lib/theme/components/text';
import { spacing } from '@/lib/theme/spacing';
import { fontFamily } from '@/lib/theme/typography';

import { getPressedStyle } from '@/lib/theme/utils/get-pressed-style';

import { SettingRow } from './setting-row';

export function DobRow() {
  const dob = usePreferencesStore((s) => s.dob);
  const setDob = usePreferencesStore((s) => s.setDob);
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
        <View style={{ minHeight: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing[4] }}>
          <Text variant="body" tone="ink" numberOfLines={2} style={{ flex: 1 }}>
            {formattedDob}
          </Text>
          <Pressable onPress={handleEdit} hitSlop={12} style={(s) => getPressedStyle(s, { minHeight: 44, justifyContent: 'center' })}>
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
              <View style={{ marginTop: spacing[2], flexDirection: 'row', justifyContent: 'flex-end', gap: spacing[6] }}>
                <Pressable onPress={handleCancel} style={(s) => getPressedStyle(s, { minHeight: 44, justifyContent: 'center' })}>
                  <Text variant="eyebrow" tone="muted">
                    {t('settings.dob.cancel')}
                  </Text>
                </Pressable>
                <Pressable onPress={handleDone} style={(s) => getPressedStyle(s, { minHeight: 44, justifyContent: 'center' })}>
                  <Text variant="eyebrow" tone="ink" style={{ fontFamily: fontFamily.uiMedium }}>
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
