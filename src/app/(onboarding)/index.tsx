import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { useAppTranslation } from '@/lib/i18n/use-translation';

export default function WelcomeScreen() {
  const { t } = useAppTranslation();

  return (
    <View className="flex-1 items-center justify-center bg-[--color-bg] px-8">
      <Text
        style={{ fontFamily: 'Fraunces_300Light_Italic' }}
        className="text-center text-5xl text-[--color-text]"
      >
        {t('onboarding.welcome.headline')}
      </Text>

      <Pressable
        onPress={() => router.push('/(onboarding)/dob')}
        className="mt-16 border border-[--color-text] px-10 py-3"
      >
        <Text
          style={{ fontFamily: 'Inter_400Regular', letterSpacing: 4 }}
          className="text-sm text-[--color-text] uppercase"
        >
          {t('onboarding.welcome.begin')}
        </Text>
      </Pressable>
    </View>
  );
}
