import { router } from 'expo-router';

import { useAppTranslation } from '@/lib/i18n/use-translation';
import { OutlineButton, Text } from '@/lib/theme';

import { View } from '@/lib/theme/components/ui';

export function DevRows() {
  const { t } = useAppTranslation();
  if (!__DEV__) return null;

  return (
    <View className="pt-8">
      <Text
        variant="eyebrow"
        tone="muted"
        className="mb-2 tracking-[0.25em] uppercase"
      >
        {t('settings.replayOnboarding.label')}
      </Text>
      <View>
        <OutlineButton
          size="sm"
          onPress={() => router.push('/(onboarding)')}
          className="self-start"
          textClassName="text-left"
          testID="settings-replay-onboarding"
        >
          {t('settings.replayOnboarding.action')}
        </OutlineButton>
      </View>
    </View>
  );
}
