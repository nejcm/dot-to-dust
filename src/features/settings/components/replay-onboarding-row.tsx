import { router } from 'expo-router';

import { useAppTranslation } from '@/lib/i18n/use-translation';
import { PrimaryButton } from '@/lib/theme/components/primary-button';

import { SettingRow } from './setting-row';

export function ReplayOnboardingRow() {
  const { t } = useAppTranslation();

  if (!__DEV__) return null;

  return (
    <SettingRow label={t('settings.replayOnboarding.label')}>
      <PrimaryButton onPress={() => router.push('/(onboarding)')} testID="settings-replay-onboarding">
        {t('settings.replayOnboarding.action')}
      </PrimaryButton>
    </SettingRow>
  );
}
