import { Pressable, View } from 'react-native';
import { cn } from 'tailwind-variants';

import { useAppTranslation } from '@/lib/i18n/use-translation';
import { setDefaultView, usePreferencesStore } from '@/lib/storage/preferences-store';
import { Text } from '@/lib/theme/components/text';
import { VIEWS } from '@/lib/view';

import { SettingRow } from './setting-row';

export function DefaultViewRow() {
  const defaultView = usePreferencesStore.use.defaultView();
  const { t } = useAppTranslation();

  return (
    <SettingRow label={t('settings.defaultView.label')}>
      <View className="flex-row gap-2">
        {VIEWS.map((v) => (
          <Pressable
            key={v}
            onPress={() => setDefaultView(v)}
            accessibilityRole="button"
            accessibilityState={{ selected: defaultView === v }}
            className={cn(
              'min-h-11 flex-1 items-center justify-center rounded-xs border border-hairline p-2',
              defaultView === v ? 'opacity-100' : 'opacity-40',
            )}
            style={({ pressed }) => pressed && defaultView === v && { opacity: 0.65 }}
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
