import { Pressable, View } from 'react-native';
import { cn } from 'tailwind-variants';

import { useAppTranslation } from '@/lib/i18n/use-translation';
import { setThemePreference, useThemePreference } from '@/lib/storage/preferences';
import { Hairline } from '@/lib/theme/components/hairline';
import { Text } from '@/lib/theme/components/text';

type Theme = 'light' | 'dark' | 'system';
const THEMES: Theme[] = ['light', 'dark', 'system'];

export function ThemeRow() {
  const theme = useThemePreference();
  const { t } = useAppTranslation();

  return (
    <View>
      <View className="py-5">
        <Text variant="meta" tone="ink" className="mb-3">
          {t('settings.theme.label')}
        </Text>
        <View className="flex-row">
          {THEMES.map((th) => (
            <Pressable
              key={th}
              onPress={() => setThemePreference(th)}
              accessibilityRole="button"
              accessibilityState={{ selected: theme === th }}
              testID={`theme-${th}`}
              className="min-h-11 flex-1 items-center justify-center px-2 pt-3 pb-[14px]"
              style={({ pressed }) => pressed && { opacity: 0.65 }}
            >
              <Text
                variant="micro"
                tone={theme === th ? 'ink' : 'muted'}
                numberOfLines={1}
                className="font-medium tracking-[2px] uppercase"
              >
                {t(`settings.theme.${th}`)}
              </Text>
              <View
                className={cn(
                  'absolute bottom-0 h-[hairlineWidth()] w-[18px]',
                  theme === th ? 'bg-ink' : 'bg-transparent',
                )}
              />
            </Pressable>
          ))}
        </View>
        <Hairline />
      </View>
      <Hairline />
    </View>
  );
}
