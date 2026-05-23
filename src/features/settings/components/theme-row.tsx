import { Pressable, View } from 'react-native';
import { cn } from 'tailwind-variants';

import { useAppTranslation } from '@/lib/i18n/use-translation';
import { setTheme, usePreferencesStore } from '@/lib/storage/preferences-store';
import { Text } from '@/lib/theme/components/text';

import { SettingRow } from './setting-row';

type Theme = 'light' | 'dark' | 'system';
const THEMES: Theme[] = ['light', 'dark', 'system'];

export function ThemeRow() {
  const theme = usePreferencesStore.use.theme();
  const { t } = useAppTranslation();

  return (
    <SettingRow label={t('settings.theme.label')}>
      <View className="flex-row gap-2">
        {THEMES.map((th) => (
          <Pressable
            key={th}
            onPress={() => setTheme(th)}
            accessibilityRole="button"
            accessibilityState={{ selected: theme === th }}
            testID={`theme-${th}`}
            className={cn(
              'min-h-11 flex-1 items-center justify-center rounded-xs border border-hairline p-2',
              theme === th ? 'opacity-100' : 'opacity-40',
            )}
            style={({ pressed }) => pressed && theme === th && { opacity: 0.65 }}
          >
            <Text variant="meta" tone={theme === th ? 'ink' : 'muted'} numberOfLines={1}>
              {t(`settings.theme.${th}`)}
            </Text>
          </Pressable>
        ))}
      </View>
    </SettingRow>
  );
}
