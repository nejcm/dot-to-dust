import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { useAppTranslation } from '@/lib/i18n/use-translation';

export default function WelcomeScreen() {
  const { t } = useAppTranslation();

  return (
    <View className="flex-1 items-center justify-center bg-[--color-bg] px-8 py-12">
      <Text
        adjustsFontSizeToFit
        minimumFontScale={0.72}
        numberOfLines={2}
        style={{ fontFamily: 'Fraunces_300Light_Italic' }}
        className="text-center text-5xl text-[--color-text]"
      >
        {t('onboarding.welcome.headline')}
      </Text>

      <Pressable
        onPress={() => router.push('/(onboarding)/dob')}
        testID="onboarding-begin"
        className="mt-16 min-h-12 justify-center border border-[--color-text] px-10 py-3"
      >
        <Text
          numberOfLines={1}
          style={{ fontFamily: 'Inter_400Regular', letterSpacing: 4 }}
          className="text-center text-sm text-[--color-text] uppercase"
        >
          {t('onboarding.welcome.begin')}
        </Text>
      </Pressable>
    </View>
  );
}
