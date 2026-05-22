import type { View as GridView } from '@/features/grid/lib/life-math';

import { Pressable, Text, View } from 'react-native';

import { useAppTranslation } from '@/lib/i18n/use-translation';
import { usePreferencesStore } from '@/lib/storage/preferences-store';

const VIEWS: GridView[] = ['weeks', 'months', 'years'];

export function DefaultViewRow() {
  const defaultView = usePreferencesStore((s) => s.defaultView);
  const setDefaultView = usePreferencesStore((s) => s.setDefaultView);
  const { t } = useAppTranslation();

  return (
    <View className="py-4">
      <Text
        style={{ fontFamily: 'Inter_400Regular', letterSpacing: 2 }}
        className="mb-3 text-xs text-[--color-text] uppercase opacity-40"
      >
        {t('settings.defaultView.label')}
      </Text>
      <View className="flex-row gap-2">
        {VIEWS.map((v) => (
          <Pressable
            key={v}
            onPress={() => setDefaultView(v)}
            accessibilityRole="button"
            accessibilityState={{ selected: defaultView === v }}
            className="min-h-11 flex-1 items-center justify-center border border-[--color-text] px-2 py-2.5"
            style={{ opacity: defaultView === v ? 1 : 0.3 }}
          >
            <Text
              numberOfLines={1}
              style={{ fontFamily: 'Inter_400Regular' }}
              className="text-center text-sm text-[--color-text]"
            >
              {t(`grid.toggle.${v}`)}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
