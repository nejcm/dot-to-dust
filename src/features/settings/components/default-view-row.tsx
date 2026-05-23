import { View } from 'react-native';
import { cn } from 'tailwind-variants';

import { useAppTranslation } from '@/lib/i18n/use-translation';
import { setDefaultViewPreference, useDefaultViewPreference } from '@/lib/storage/preferences-store';
import { Button } from '@/lib/theme/components/button';
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
            <Button
              key={v}
              onPress={() => setDefaultViewPreference(v)}
              accessibilityState={{ selected: defaultView === v }}
              className="min-h-11 flex-1 items-center justify-center px-2 pt-3 pb-3.5"
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
                  'absolute bottom-0 h-[hairlineWidth()] w-4.5',
                  defaultView === v ? 'bg-ink' : 'bg-transparent',
                )}
              />
            </Button>
          ))}
        </View>
        <Hairline />
      </View>
    </View>
  );
}
