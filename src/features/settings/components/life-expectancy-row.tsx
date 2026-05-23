import { View } from 'react-native';

import { useAppTranslation } from '@/lib/i18n/use-translation';
import { Hairline } from '@/lib/theme/components/hairline';
import { Text } from '@/lib/theme/components/text';

export function LifeExpectancyRow() {
  const { t } = useAppTranslation();

  return (
    <>
      <View className="flex-row items-center justify-between py-4">
        <Text variant="meta" tone="ink">
          {t('settings.lifeExpectancy.label')}
        </Text>
        <View className="flex-row items-center gap-[10px]">
          <Text variant="meta" tone="muted">
            {t('settings.lifeExpectancy.value')}
          </Text>
          <View className="h-[10px] w-[6px] items-center justify-center">
            {/* Chevron */}
            <Text tone="faint" className="text-micro">›</Text>
          </View>
        </View>
      </View>
      <Hairline />
    </>
  );
}
