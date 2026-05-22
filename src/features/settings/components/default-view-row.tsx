import { Pressable, View } from 'react-native';

import { useAppTranslation } from '@/lib/i18n/use-translation';
import { usePreferencesStore } from '@/lib/storage/preferences-store';
import { Text } from '@/lib/theme/components/text';
import { radius, spacing } from '@/lib/theme/spacing';
import { useTheme } from '@/lib/theme/use-theme';
import { VIEWS } from '@/lib/view';

import { SettingRow } from './setting-row';

export function DefaultViewRow() {
  const defaultView = usePreferencesStore((s) => s.defaultView);
  const setDefaultView = usePreferencesStore((s) => s.setDefaultView);
  const { t } = useAppTranslation();
  const { tokens } = useTheme();

  return (
    <SettingRow label={t('settings.defaultView.label')}>
      <View style={{ flexDirection: 'row', gap: spacing[2] }}>
        {VIEWS.map((v) => (
          <Pressable
            key={v}
            onPress={() => setDefaultView(v)}
            accessibilityRole="button"
            accessibilityState={{ selected: defaultView === v }}
            style={({ pressed }) => [
              {
                flex: 1,
                minHeight: 44,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: radius.xs,
                borderWidth: 1,
                borderColor: tokens.hairline,
                paddingHorizontal: spacing[2],
                paddingVertical: spacing[2],
                opacity: defaultView === v ? 1 : 0.4,
              },
              pressed && defaultView === v && { opacity: 0.65 },
            ]}
          >
            <Text variant="meta" tone={defaultView === v ? 'ink' : 'muted'} numberOfLines={1}>
              {t(`grid.toggle.${v}`)}
            </Text>
          </Pressable>
        ))}
      </View>
    </SettingRow>
  );
}
