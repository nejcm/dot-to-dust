import { Pressable, Text, View } from 'react-native';

import { useAppTranslation } from '@/lib/i18n/use-translation';
import { usePreferencesStore } from '@/lib/storage/preferences-store';

type Theme = 'light' | 'dark' | 'system';
const THEMES: Theme[] = ['light', 'dark', 'system'];

export function ThemeRow() {
  const theme = usePreferencesStore((s) => s.theme);
  const setTheme = usePreferencesStore((s) => s.setTheme);
  const { t } = useAppTranslation();

  return (
    <View className="py-4">
      <Text
        style={{ fontFamily: 'Inter_400Regular', letterSpacing: 2 }}
        className="mb-3 text-xs text-[--color-text] uppercase opacity-40"
      >
        {t('settings.theme.label')}
      </Text>
      <View className="flex-row gap-2">
        {THEMES.map((th) => (
          <Pressable
            key={th}
            onPress={() => setTheme(th)}
            accessibilityRole="button"
            accessibilityState={{ selected: theme === th }}
            className="min-h-11 flex-1 items-center justify-center border border-[--color-text] px-2 py-2.5"
            style={{ opacity: theme === th ? 1 : 0.3 }}
          >
            <Text
              numberOfLines={1}
              style={{ fontFamily: 'Inter_400Regular' }}
              className="text-center text-sm text-[--color-text]"
            >
              {t(`settings.theme.${th}`)}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
