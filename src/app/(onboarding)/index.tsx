import { router } from 'expo-router';

import { StageDustDots } from '@/features/onboarding/components/stage-dust-dots';
import { useAppTranslation } from '@/lib/i18n/use-translation';
import { PrimaryButton } from '@/lib/theme/components/primary-button';
import { Screen } from '@/lib/theme/components/screen';
import { Text } from '@/lib/theme/components/text';
import { View } from '@/lib/theme/components/ui';
import { Wordmark } from '@/lib/theme/components/wordmark';

export default function WelcomeScreen() {
  const { t } = useAppTranslation();

  return (
    <Screen contentClassName="pt-10">
      <View className="items-center px-8 pt-9">
        <Wordmark />
      </View>

      <View className="flex-1 items-center justify-center gap-10 px-9">
        <StageDustDots />

        <Text className="text-center font-display-italic text-[31px]/9 tracking-[-0.3px] text-ink">
          {t('onboarding.welcome.tagline')}
        </Text>

        {/* Body copy */}
        <Text
          variant="meta"
          tone="muted"
          className="max-w-60 text-center leading-5 tracking-[0.3px]"
        >
          {t('onboarding.welcome.body')}
        </Text>
      </View>

      {/* Bottom: Begin + step counter */}
      <View className="items-center gap-4 px-9 pt-6 pb-14">
        <PrimaryButton
          onPress={() => router.push('/(onboarding)/dob')}
          testID="onboarding-begin"
        >
          {t('onboarding.welcome.begin')}
        </PrimaryButton>
        <Text
          variant="micro"
          tone="faint"
          className="tracking-[1.6px] uppercase"
        >
          {t('onboarding.welcome.step')}
        </Text>
      </View>
    </Screen>
  );
}
