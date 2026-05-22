import type { DateTimePickerEvent } from '@react-native-community/datetimepicker';

import DateTimePicker from '@react-native-community/datetimepicker';
import { format, parseISO } from 'date-fns';
import { useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';

import { toCivilDateString } from '@/lib/civil-date';
import { useAppTranslation } from '@/lib/i18n/use-translation';
import { usePreferencesStore } from '@/lib/storage/preferences-store';

export function DobRow() {
  const dob = usePreferencesStore((s) => s.dob);
  const setDob = usePreferencesStore((s) => s.setDob);
  const { t } = useAppTranslation();

  const [editing, setEditing] = useState(false);
  const today = new Date();
  const initialDate = dob ? parseISO(dob) : new Date(today.getFullYear() - 30, 0, 1);
  const [pendingDate, setPendingDate] = useState(initialDate);

  const formattedDob = dob ? format(parseISO(dob), 'MMMM d, yyyy') : t('settings.dob.notSet');

  const handleChange = (event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === 'android') {
      setEditing(false);
      if (event.type === 'set' && selected) {
        setDob(toCivilDateString(selected));
      }
    }
    else if (selected) {
      setPendingDate(selected);
    }
  };

  const handleEdit = () => {
    setPendingDate(dob ? parseISO(dob) : initialDate);
    setEditing(true);
  };

  const handleDone = () => {
    setDob(toCivilDateString(pendingDate));
    setEditing(false);
  };

  const handleCancel = () => {
    setPendingDate(dob ? parseISO(dob) : initialDate);
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
            <DateTimePicker
              value={pendingDate}
              mode="date"
              maximumDate={today}
              onChange={handleChange}
            />
          )}
          {Platform.OS === 'ios' && (
            <>
              <DateTimePicker
                value={pendingDate}
                mode="date"
                maximumDate={today}
                onChange={handleChange}
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
