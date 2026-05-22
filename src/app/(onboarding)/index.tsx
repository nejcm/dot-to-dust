import { router } from 'expo-router';
import { View } from 'react-native';

import { useAppTranslation } from '@/lib/i18n/use-translation';
import { PrimaryButton } from '@/lib/theme/components/primary-button';
import { Text } from '@/lib/theme/components/text';
import { spacing } from '@/lib/theme/spacing';

export default function WelcomeScreen() {
  const { t } = useAppTranslation();

  return (
    <View className="flex-1 items-center justify-center bg-[--color-bg] px-8 py-12">
      <Text
        variant="displayXl"
        tone="ink"
        adjustsFontSizeToFit
        minimumFontScale={0.72}
        numberOfLines={2}
        style={{ textAlign: 'center' }}
      >
        {t('onboarding.welcome.headline')}
      </Text>

      <View style={{ marginTop: spacing[10] }}>
        <PrimaryButton
          onPress={() => router.push('/(onboarding)/dob')}
          testID="onboarding-begin"
        >
          {t('onboarding.welcome.begin')}
        </PrimaryButton>
      </View>
    </View>
  );
}
