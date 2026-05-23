import { Pressable, View } from 'react-native';
import { cn } from 'tailwind-variants';

import { useAppTranslation } from '@/lib/i18n/use-translation';
import { setDefaultViewPreference, useDefaultViewPreference } from '@/lib/storage/preferences';
import { Hairline } from '@/lib/theme/components/hairline';
import { Text } from '@/lib/theme/components/text';
import { VIEWS } from '@/lib/view';

export function DefaultViewRow() {
  const defaultView = useDefaultViewPreference();
  const { t } = useAppTranslation();

  return (
    <View>
      <View className="py-5">
        <Text variant="meta" tone="ink" className="mb-3">
          {t('settings.defaultView.label')}
        </Text>
        <View className="flex-row">
          {VIEWS.map((v) => (
            <Pressable
              key={v}
              onPress={() => setDefaultViewPreference(v)}
              accessibilityRole="button"
              accessibilityState={{ selected: defaultView === v }}
              className="min-h-11 flex-1 items-center justify-center px-2 pt-3 pb-[14px]"
              style={({ pressed }) => pressed && { opacity: 0.65 }}
            >
              <Text
                variant="micro"
                tone={defaultView === v ? 'ink' : 'muted'}
                numberOfLines={1}
                className="font-medium tracking-[2px] uppercase"
              >
                {t(`grid.toggle.${v}`)}
              </Text>
              <View
                className={cn(
                  'absolute bottom-0 h-[hairlineWidth()] w-[18px]',
                  defaultView === v ? 'bg-ink' : 'bg-transparent',
                )}
              />
            </Pressable>
          ))}
        </View>
        <Hairline />
      </View>
    </View>
  );
}
