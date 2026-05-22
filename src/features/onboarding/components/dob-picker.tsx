import { useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';

import { defaultDobCivilDate, formatCivilDateForDisplay, todayCivilDate } from '@/lib/civil-date';
import { NativeCivilDatePicker } from '@/lib/civil-date/native-civil-date-picker';
import { useAppTranslation } from '@/lib/i18n/use-translation';

interface DobPickerProps {
  onConfirm: (dob: string) => void;
  initialDob?: string;
}

export function DobPicker({ onConfirm, initialDob }: DobPickerProps) {
  const { t } = useAppTranslation();
  const [dob, setDob] = useState(() => initialDob ?? defaultDobCivilDate());
  const [showAndroid, setShowAndroid] = useState(false);
  const today = todayCivilDate();

  const handleConfirm = () => {
    onConfirm(dob);
  };

  return (
    <View className="flex-1 bg-[--color-bg] px-8">
      <View className="flex-1 justify-center">
        <Text
          adjustsFontSizeToFit
          minimumFontScale={0.78}
          numberOfLines={2}
          style={{ fontFamily: 'Fraunces_300Light_Italic' }}
          className="mb-12 text-center text-3xl text-[--color-text]"
        >
          {t('onboarding.dob.label')}
        </Text>

        {Platform.OS === 'android' && (
          <Pressable
            onPress={() => setShowAndroid(true)}
            testID="onboarding-dob-field"
            className="mb-8 min-h-14 items-center justify-center border border-[--color-text] p-4"
          >
            <Text
              numberOfLines={1}
              style={{ fontFamily: 'Inter_400Regular' }}
              className="text-center text-lg text-[--color-text]"
            >
              {formatCivilDateForDisplay(dob)}
            </Text>
          </Pressable>
        )}

        {(Platform.OS === 'ios' || showAndroid) && (
          <NativeCivilDatePicker
            value={dob}
            maximumValue={today}
            onChange={setDob}
            onAndroidClose={() => setShowAndroid(false)}
          />
        )}
      </View>

      <View className="pb-12">
        <Pressable
          onPress={handleConfirm}
          testID="onboarding-dob-done"
          className="min-h-12 items-center justify-center border border-[--color-text] px-4 py-3"
        >
          <Text
            numberOfLines={1}
            style={{ fontFamily: 'Inter_400Regular', letterSpacing: 4 }}
            className="text-center text-sm text-[--color-text] uppercase"
          >
            {t('onboarding.dob.done')}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
