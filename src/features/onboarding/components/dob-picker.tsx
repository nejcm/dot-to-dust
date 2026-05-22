import { useState } from 'react';
import { Platform, Pressable, View } from 'react-native';

import { defaultDobCivilDate, formatCivilDateForDisplay, todayCivilDate } from '@/lib/civil-date';
import { NativeCivilDatePicker } from '@/lib/civil-date/native-civil-date-picker';
import { useAppTranslation } from '@/lib/i18n/use-translation';
import { PrimaryButton } from '@/lib/theme/components/primary-button';
import { Text } from '@/lib/theme/components/text';
import { radius, spacing } from '@/lib/theme/spacing';
import { useTheme } from '@/lib/theme/use-theme';

interface DobPickerProps {
  onConfirm: (dob: string) => void;
  initialDob?: string;
}

export function DobPicker({ onConfirm, initialDob }: DobPickerProps) {
  const { t } = useAppTranslation();
  const { tokens } = useTheme();
  const [dob, setDob] = useState(() => initialDob ?? defaultDobCivilDate());
  const [showAndroid, setShowAndroid] = useState(false);
  const today = todayCivilDate();

  const handleConfirm = () => {
    onConfirm(dob);
  };

  return (
    <View
      className="flex-1 bg-[--color-bg] px-8"
    >
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text
          variant="displayL"
          tone="ink"
          adjustsFontSizeToFit
          minimumFontScale={0.78}
          numberOfLines={2}
          style={{ textAlign: 'center', marginBottom: spacing[8] }}
        >
          {t('onboarding.dob.label')}
        </Text>

        {Platform.OS === 'android' && (
          <Pressable
            onPress={() => setShowAndroid(true)}
            testID="onboarding-dob-field"
            style={{
              marginBottom: spacing[8],
              minHeight: 56,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: tokens.hairline,
              borderRadius: radius.xs,
              padding: spacing[4],
            }}
          >
            <Text variant="body" tone="ink" numberOfLines={1}>
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

      <View style={{ paddingBottom: spacing[8] }}>
        <PrimaryButton onPress={handleConfirm} testID="onboarding-dob-done">
          {t('onboarding.dob.done')}
        </PrimaryButton>
      </View>
    </View>
  );
}
