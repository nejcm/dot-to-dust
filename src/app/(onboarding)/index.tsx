import { router } from 'expo-router';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppTranslation } from '@/lib/i18n/use-translation';
import { PrimaryButton } from '@/lib/theme/components/primary-button';
import { Text } from '@/lib/theme/components/text';
import { Wordmark } from '@/lib/theme/components/wordmark';
import { spacing } from '@/lib/theme/spacing';
import { fontFamily } from '@/lib/theme/typography';
import { useTheme } from '@/lib/theme/use-theme';

export default function WelcomeScreen() {
  const { t } = useAppTranslation();
  const { tokens } = useTheme();
  const insets = useSafeAreaInsets();

  const stageDots = tokens.stages;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: tokens.bg,
        paddingTop: insets.top + 64,
        paddingBottom: insets.bottom,
      }}
    >
      {/* Wordmark */}
      <View style={{ alignItems: 'center', paddingHorizontal: spacing[8], paddingTop: spacing[8] }}>
        <Wordmark size={10} />
      </View>

      {/* Center content */}
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 36, gap: 40 }}>
        {/* Stage constellation */}
        <View style={{ flexDirection: 'row', gap: 12 }}>
          {stageDots.map((color, i) => (
            <View
              key={i}
              style={{ width: 7, height: 7, borderRadius: 7, backgroundColor: color }}
            />
          ))}
        </View>

        {/* Tagline */}
        <Text
          style={{
            fontFamily: fontFamily.displayItalic,
            fontSize: 30,
            lineHeight: 37,
            letterSpacing: -0.3,
            textAlign: 'center',
            color: tokens.ink,
          }}
        >
          {t('onboarding.welcome.tagline')}
        </Text>

        {/* Body copy */}
        <Text
          variant="meta"
          tone="muted"
          style={{ textAlign: 'center', maxWidth: 240, lineHeight: 21 }}
        >
          {t('onboarding.welcome.body')}
        </Text>
      </View>

      {/* Bottom: Begin + step counter */}
      <View style={{ alignItems: 'center', paddingHorizontal: 36, paddingBottom: 56, gap: 18 }}>
        <PrimaryButton
          onPress={() => router.push('/(onboarding)/dob')}
          testID="onboarding-begin"
        >
          {t('onboarding.welcome.begin')}
        </PrimaryButton>
        <Text variant="micro" tone="faint" style={{ letterSpacing: 1.6, textTransform: 'uppercase' }}>
          {t('onboarding.welcome.step')}
        </Text>
      </View>
    </View>
  );
}
