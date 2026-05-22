import { router } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { DefaultViewRow } from '@/features/settings/components/default-view-row';
import { DobRow } from '@/features/settings/components/dob-row';
import { LifeExpectancyRow } from '@/features/settings/components/life-expectancy-row';
import { ReplayOnboardingRow } from '@/features/settings/components/replay-onboarding-row';
import { ThemeRow } from '@/features/settings/components/theme-row';
import { useAppTranslation } from '@/lib/i18n/use-translation';
import { Text } from '@/lib/theme/components/text';
import { Wordmark } from '@/lib/theme/components/wordmark';
import { spacing } from '@/lib/theme/spacing';
import { fontFamily } from '@/lib/theme/typography';
import { useTheme } from '@/lib/theme/use-theme';
import { getPressedStyle } from '@/lib/theme/utils/get-pressed-style';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useAppTranslation();
  const { tokens } = useTheme();

  return (
    <View
      style={{ flex: 1, backgroundColor: tokens.bg, paddingTop: insets.top, paddingBottom: insets.bottom }}
      testID="settings-screen"
    >
      {/* Top bar: back | wordmark | spacer */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 28,
          paddingTop: spacing[4],
        }}
      >
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          accessibilityLabel={t('settings.back')}
          accessibilityRole="button"
          testID="settings-back"
          style={(s) => getPressedStyle(s, { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 44, justifyContent: 'center' })}
        >
          <Svg width={14} height={10} viewBox="0 0 14 10" fill="none">
            <Path
              d="M5 1L1 5l4 4M1 5h12"
              stroke={tokens.inkSoft}
              strokeWidth={0.9}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
          <Text variant="meta" tone="inkSoft">
            {t('settings.back')}
          </Text>
        </Pressable>
        <Wordmark size={9} />
        <View style={{ width: 50 }} />
      </View>

      {/* Title block */}
      <View style={{ paddingHorizontal: 28, paddingTop: 40, paddingBottom: 28 }}>
        <Text
          variant="eyebrow"
          tone="muted"
          style={{ marginBottom: 10, letterSpacing: 2.2, textTransform: 'uppercase' }}
        >
          {t('settings.eyebrow')}
        </Text>
        <Text
          style={{
            fontFamily: fontFamily.displayItalic,
            fontSize: 36,
            letterSpacing: -0.4,
            color: tokens.ink,
            lineHeight: 36,
          }}
        >
          {t('settings.title')}
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 28, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Life group */}
        <Text
          variant="micro"
          tone="faint"
          style={{ letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4, marginTop: 10 }}
        >
          {t('settings.group.life')}
        </Text>
        <DobRow />
        <LifeExpectancyRow />

        {/* Appearance group */}
        <Text
          variant="micro"
          tone="faint"
          style={{ letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4, marginTop: 32 }}
        >
          {t('settings.group.appearance')}
        </Text>
        <ThemeRow />
        <DefaultViewRow />

        {/* About group */}
        <Text
          variant="micro"
          tone="faint"
          style={{ letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4, marginTop: 32 }}
        >
          {t('settings.group.about')}
        </Text>
        <ReplayOnboardingRow />
        <VersionRow />
      </ScrollView>

      {/* Footer epigraph */}
      <View style={{ paddingHorizontal: 28, paddingBottom: 40, alignItems: 'center' }}>
        <Text
          style={{
            fontFamily: fontFamily.displayItalic,
            fontSize: 13,
            lineHeight: 20,
            color: tokens.faint,
            textAlign: 'center',
          }}
        >
          {t('settings.epigraph')}
        </Text>
      </View>
    </View>
  );
}

function VersionRow() {
  const { t } = useAppTranslation();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: spacing[4],
      }}
    >
      <Text variant="meta" tone="ink">
        {t('settings.version.label')}
      </Text>
      <Text variant="meta" tone="muted">
        {t('settings.version.value')}
      </Text>
    </View>
  );
}
