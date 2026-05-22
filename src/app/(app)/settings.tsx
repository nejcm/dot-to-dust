import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DefaultViewRow } from '@/features/settings/components/default-view-row';
import { DobRow } from '@/features/settings/components/dob-row';
import { ThemeRow } from '@/features/settings/components/theme-row';
import { useAppTranslation } from '@/lib/i18n/use-translation';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useAppTranslation();

  return (
    <View
      className="flex-1 bg-[--color-bg]"
      testID="settings-screen"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <View className="flex-row items-center px-6 pt-4 pb-6">
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          accessibilityLabel={t('settings.back')}
          accessibilityRole="button"
          testID="settings-back"
          className="min-h-11 justify-center"
        >
          <Text
            numberOfLines={1}
            style={{ fontFamily: 'Inter_400Regular', letterSpacing: 2 }}
            className="text-xs text-[--color-text] uppercase opacity-50"
          >
            ←
          </Text>
        </Pressable>
        <Text
          numberOfLines={1}
          style={{ fontFamily: 'Fraunces_300Light_Italic' }}
          className="ml-4 flex-1 text-2xl text-[--color-text]"
        >
          {t('settings.title')}
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-6"
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <DobRow />
        <View className="h-px bg-[--color-text] opacity-10" />
        <ThemeRow />
        <View className="h-px bg-[--color-text] opacity-10" />
        <DefaultViewRow />
      </ScrollView>
    </View>
  );
}
