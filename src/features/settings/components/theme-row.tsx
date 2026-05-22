import { Pressable, View } from 'react-native';

import { useAppTranslation } from '@/lib/i18n/use-translation';
import { usePreferencesStore } from '@/lib/storage/preferences-store';
import { Text } from '@/lib/theme/components/text';
import { radius, spacing } from '@/lib/theme/spacing';
import { useTheme } from '@/lib/theme/use-theme';

import { SettingRow } from './setting-row';

type Theme = 'light' | 'dark' | 'system';
const THEMES: Theme[] = ['light', 'dark', 'system'];

export function ThemeRow() {
  const theme = usePreferencesStore((s) => s.theme);
  const setTheme = usePreferencesStore((s) => s.setTheme);
  const { t } = useAppTranslation();
  const { tokens } = useTheme();

  return (
    <SettingRow label={t('settings.theme.label')}>
      <View style={{ flexDirection: 'row', gap: spacing[2] }}>
        {THEMES.map((th) => (
          <Pressable
            key={th}
            onPress={() => setTheme(th)}
            accessibilityRole="button"
            accessibilityState={{ selected: theme === th }}
            testID={`theme-${th}`}
            style={{
              flex: 1,
              minHeight: 44,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: radius.xs,
              borderWidth: 1,
              borderColor: tokens.hairline,
              paddingHorizontal: spacing[2],
              paddingVertical: spacing[2],
              opacity: theme === th ? 1 : 0.4,
            }}
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
