import { router } from 'expo-router';

import { DefaultViewRow } from '@/features/settings/components/default-view-row';
import { DevRows } from '@/features/settings/components/dev-rows';
import { DobRow } from '@/features/settings/components/dob-row';
import { LifeExpectancyRow } from '@/features/settings/components/life-expectancy-row';
import { ThemeRow } from '@/features/settings/components/theme-row';
import { useAppTranslation } from '@/lib/i18n/use-translation';
import { goBackOrFallback } from '@/lib/routing';
import { GhostButton } from '@/lib/theme';
import { ArrowLeftIcon } from '@/lib/theme/components/icons';
import { ScreenScrollView } from '@/lib/theme/components/screen';
import { Text } from '@/lib/theme/components/text';
import { View } from '@/lib/theme/components/ui';
import { Wordmark } from '@/lib/theme/components/wordmark';
import { toHex } from '@/lib/theme/tokens';
import { useTheme } from '@/lib/theme/use-theme';

export default function SettingsScreen() {
  const { t } = useAppTranslation();
  const { tokens } = useTheme();
  const iconColor = toHex(tokens.inkSoft);

  return (
    <ScreenScrollView testID="settings-screen" contentContainerClassName="grow">
      <View className="flex-row items-center justify-between px-6 pt-2 pb-8">
        <GhostButton
          onPress={() => goBackOrFallback(router, '/(app)')}
          hitSlop={12}
          accessibilityLabel={t('settings.back')}
          testID="settings-back"
          className="gap-3 px-px"
        >
          <ArrowLeftIcon color={iconColor} />
          <Text variant="meta" tone="inkSoft">
            {t('settings.back')}
          </Text>
        </GhostButton>
        <Wordmark />
        <View className="w-12" />
      </View>

      <View className="px-6 pb-10">
        <Text
          variant="eyebrow"
          tone="muted"
          className="mb-2 tracking-[0.25em] uppercase"
        >
          {t('settings.eyebrow')}
        </Text>
        <Text
          className="font-display-italic text-[36px]/9 tracking-[-0.4px] text-ink"
        >
          {t('settings.title')}
        </Text>
      </View>

      <View className="px-6 pb-10">
        <Text
          variant="micro"
          tone="faint"
          className="mb-1 tracking-[0.25em] uppercase"
        >
          {t('settings.group.life')}
        </Text>
        <DobRow />
        <LifeExpectancyRow />

        <Text
          variant="micro"
          tone="faint"
          className="mt-8 mb-1 tracking-[0.25em] uppercase"
        >
          {t('settings.group.appearance')}
        </Text>
        <ThemeRow />
        <DefaultViewRow />

        <Text
          variant="micro"
          tone="faint"
          className="mt-8 mb-1 tracking-[0.25em] uppercase"
        >
          {t('settings.group.about')}
        </Text>
        <View className="flex-row items-center justify-between py-5">
          <Text variant="meta" tone="ink">
            {t('settings.version.label')}
          </Text>
          <Text variant="meta" tone="muted">
            {t('settings.version.value')}
          </Text>
        </View>
        <DevRows />
      </View>

      <View className="mt-auto items-center px-6 pb-10">
        <Text className="text-center font-display-italic text-meta/5 text-faint">
          {t('settings.epigraph')}
        </Text>
      </View>
    </ScreenScrollView>
  );
}
