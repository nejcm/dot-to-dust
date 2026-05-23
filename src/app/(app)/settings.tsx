import { router } from 'expo-router';

import { DefaultViewRow } from '@/features/settings/components/default-view-row';
import { DobRow } from '@/features/settings/components/dob-row';
import { LifeExpectancyRow } from '@/features/settings/components/life-expectancy-row';
import { ReplayOnboardingRow } from '@/features/settings/components/replay-onboarding-row';
import { ThemeRow } from '@/features/settings/components/theme-row';
import { useAppTranslation } from '@/lib/i18n/use-translation';
import { goBackOrFallback } from '@/lib/routing';
import { ArrowLeftIcon } from '@/lib/theme/components/icons';
import { ScreenScrollView } from '@/lib/theme/components/screen';
import { Text } from '@/lib/theme/components/text';
import { Pressable, View } from '@/lib/theme/components/ui';
import { Wordmark } from '@/lib/theme/components/wordmark';
import { toHex } from '@/lib/theme/tokens';
import { useTheme } from '@/lib/theme/use-theme';
import { getPressedStyle } from '@/lib/theme/utils/get-pressed-style';

export default function SettingsScreen() {
  const { t } = useAppTranslation();
  const { tokens } = useTheme();
  const iconColor = toHex(tokens.inkSoft);

  return (
    <ScreenScrollView testID="settings-screen" contentContainerClassName="grow">
      {/* Top bar: back | wordmark | spacer */}
      <View className="flex-row items-center justify-between px-7 pt-4">
        <Pressable
          onPress={() => goBackOrFallback(router, '/(app)')}
          hitSlop={12}
          accessibilityLabel={t('settings.back')}
          accessibilityRole="button"
          testID="settings-back"
          className="min-h-11 flex-row items-center justify-center gap-1.5"
          style={getPressedStyle}
        >
          <ArrowLeftIcon color={iconColor} />
          <Text variant="meta" tone="inkSoft">
            {t('settings.back')}
          </Text>
        </Pressable>
        <Wordmark size={9} />
        <View className="w-12.5" />
      </View>

      {/* Title block */}
      <View className="px-7 pt-10 pb-7">
        <Text
          variant="eyebrow"
          tone="muted"
          className="mb-2.5 tracking-[2.2px] uppercase"
        >
          {t('settings.eyebrow')}
        </Text>
        <Text
          className="font-display-italic text-[36px] leading-[36px] tracking-[-0.4px] text-ink"
        >
          {t('settings.title')}
        </Text>
      </View>

      <View className="px-7 pb-8">
        {/* Life group */}
        <Text
          variant="micro"
          tone="faint"
          className="mt-2.5 mb-1 tracking-[2px] uppercase"
        >
          {t('settings.group.life')}
        </Text>
        <DobRow />
        <LifeExpectancyRow />

        {/* Appearance group */}
        <Text
          variant="micro"
          tone="faint"
          className="mt-8 mb-1 tracking-[2px] uppercase"
        >
          {t('settings.group.appearance')}
        </Text>
        <ThemeRow />
        <DefaultViewRow />

        {/* About group */}
        <Text
          variant="micro"
          tone="faint"
          className="mt-8 mb-1 tracking-[2px] uppercase"
        >
          {t('settings.group.about')}
        </Text>
        <ReplayOnboardingRow />
        <VersionRow />
      </View>

      {/* Footer epigraph */}
      <View className="mt-auto items-center px-7 pb-10">
        <Text
          className="text-center font-display-italic text-meta/5 text-faint"
        >
          {t('settings.epigraph')}
        </Text>
      </View>
    </ScreenScrollView>
  );
}

function VersionRow() {
  const { t } = useAppTranslation();

  return (
    <View className="flex-row items-center justify-between py-5">
      <Text variant="meta" tone="ink">
        {t('settings.version.label')}
      </Text>
      <Text variant="meta" tone="muted">
        {t('settings.version.value')}
      </Text>
    </View>
  );
}
