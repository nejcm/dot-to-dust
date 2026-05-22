import { View } from 'react-native';

import { useAppTranslation } from '@/lib/i18n/use-translation';
import { Hairline } from '@/lib/theme/components/hairline';
import { Text } from '@/lib/theme/components/text';
import { spacing } from '@/lib/theme/spacing';
import { useTheme } from '@/lib/theme/use-theme';

export function LifeExpectancyRow() {
  const { t } = useAppTranslation();
  const { tokens } = useTheme();

  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: spacing[4],
        }}
      >
        <Text variant="meta" tone="ink">
          {t('settings.lifeExpectancy.label')}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Text variant="meta" tone="muted">
            {t('settings.lifeExpectancy.value')}
          </Text>
          <View style={{ width: 6, height: 10, alignItems: 'center', justifyContent: 'center' }}>
            {/* Chevron */}
            <Text style={{ color: tokens.faint, fontSize: 10 }}>›</Text>
          </View>
        </View>
      </View>
      <Hairline />
    </>
  );
}
