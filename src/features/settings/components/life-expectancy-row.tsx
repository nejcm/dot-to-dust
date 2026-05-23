import { useAppTranslation } from '@/lib/i18n/use-translation';
import { Text } from '@/lib/theme/components/text';

import { SettingRow } from './setting-row';

export function LifeExpectancyRow() {
  const { t } = useAppTranslation();

  return (
    <SettingRow label={t('settings.lifeExpectancy.label')} last>
      <Text variant="meta" tone="muted">
        {t('settings.lifeExpectancy.value')}
      </Text>
    </SettingRow>
  );
}
