import { router } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DefaultViewRow } from '@/features/settings/components/default-view-row';
import { DobRow } from '@/features/settings/components/dob-row';
import { ThemeRow } from '@/features/settings/components/theme-row';
import { useAppTranslation } from '@/lib/i18n/use-translation';
import { Text } from '@/lib/theme/components/text';
import { spacing } from '@/lib/theme/spacing';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useAppTranslation();

  return (
    <View
      className="flex-1 bg-[--color-bg]"
      testID="settings-screen"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing[6], paddingTop: spacing[4], paddingBottom: spacing[6] }}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          accessibilityLabel={t('settings.back')}
          accessibilityRole="button"
          testID="settings-back"
          style={{ minHeight: 44, justifyContent: 'center' }}
        >
          <Text variant="meta" tone="muted">←</Text>
        </Pressable>
        <Text variant="displayM" tone="ink" numberOfLines={1} style={{ marginLeft: spacing[4], flex: 1 }}>
          {t('settings.title')}
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-6"
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <DobRow />
        <ThemeRow />
        <DefaultViewRow />
      </ScrollView>
    </View>
  );
}
