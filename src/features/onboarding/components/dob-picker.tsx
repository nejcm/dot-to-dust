import type { DateTimePickerEvent } from '@react-native-community/datetimepicker';

import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';

import { toCivilDateString } from '@/lib/civil-date';
import { useAppTranslation } from '@/lib/i18n/use-translation';

// Reasonable starting position for the picker — 30 years back
const DEFAULT_DOB = new Date(new Date().getFullYear() - 30, 0, 1);

interface DobPickerProps {
  onConfirm: (dob: string) => void;
}

export function DobPicker({ onConfirm }: DobPickerProps) {
  const { t } = useAppTranslation();
  const [date, setDate] = useState(DEFAULT_DOB);
  const [showAndroid, setShowAndroid] = useState(false);
  const today = new Date();

  const handleChange = (event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === 'android') {
      setShowAndroid(false);
      if (event.type === 'set' && selected) {
        setDate(selected);
      }
    }
    else if (selected) {
      setDate(selected);
    }
  };

  const handleConfirm = () => {
    onConfirm(toCivilDateString(date));
  };

  return (
    <View className="flex-1 bg-[--color-bg] px-8">
      <View className="flex-1 justify-center">
        <Text
          style={{ fontFamily: 'Fraunces_300Light_Italic' }}
          className="mb-12 text-center text-3xl text-[--color-text]"
        >
          {t('onboarding.dob.label')}
        </Text>

        {Platform.OS === 'android' && (
          <Pressable
            onPress={() => setShowAndroid(true)}
            className="mb-8 items-center border border-[--color-text] py-4"
          >
            <Text
              style={{ fontFamily: 'Inter_400Regular' }}
              className="text-lg text-[--color-text]"
            >
              {format(date, 'MMMM d, yyyy')}
            </Text>
          </Pressable>
        )}

        {(Platform.OS === 'ios' || showAndroid) && (
          <DateTimePicker
            value={date}
            mode="date"
            maximumDate={today}
            onChange={handleChange}
          />
        )}
      </View>

      <View className="pb-12">
        <Pressable
          onPress={handleConfirm}
          className="items-center border border-[--color-text] py-3"
        >
          <Text
            style={{ fontFamily: 'Inter_400Regular', letterSpacing: 4 }}
            className="text-sm text-[--color-text] uppercase"
          >
            {t('onboarding.dob.done')}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
