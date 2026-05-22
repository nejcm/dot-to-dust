import { useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';

import { defaultDobCivilDate, formatCivilDateForDisplay, todayCivilDate } from '@/lib/civil-date';
import { NativeCivilDatePicker } from '@/lib/civil-date/native-civil-date-picker';
import { useAppTranslation } from '@/lib/i18n/use-translation';
import { usePreferencesStore } from '@/lib/storage/preferences-store';

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
    <View className="py-4">
      <Text
        style={{ fontFamily: 'Inter_400Regular', letterSpacing: 2 }}
        className="mb-3 text-xs text-[--color-text] uppercase opacity-40"
      >
        {t('settings.dob.label')}
      </Text>

      {!editing && (
        <View className="min-h-11 flex-row items-center justify-between gap-4">
          <Text
            numberOfLines={2}
            style={{ fontFamily: 'Inter_400Regular' }}
            className="flex-1 text-base text-[--color-text]"
          >
            {formattedDob}
          </Text>
          <Pressable onPress={handleEdit} hitSlop={12} className="min-h-11 justify-center">
            <Text
              numberOfLines={1}
              style={{ fontFamily: 'Inter_400Regular', letterSpacing: 2 }}
              className="text-xs text-[--color-text] uppercase opacity-50"
            >
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
                <Pressable onPress={handleCancel} className="min-h-11 justify-center">
                  <Text
                    numberOfLines={1}
                    style={{ fontFamily: 'Inter_400Regular', letterSpacing: 2 }}
                    className="text-xs text-[--color-text] uppercase opacity-50"
                  >
                    {t('settings.dob.cancel')}
                  </Text>
                </Pressable>
                <Pressable onPress={handleDone} className="min-h-11 justify-center">
                  <Text
                    numberOfLines={1}
                    style={{ fontFamily: 'Inter_400Regular', letterSpacing: 2 }}
                    className="text-xs text-[--color-text] uppercase"
                  >
                    {t('settings.dob.done')}
                  </Text>
                </Pressable>
              </View>
            </>
          )}
        </>
      )}
    </View>
  );
}
