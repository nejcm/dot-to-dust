import { useState } from 'react';
import { Platform } from 'react-native';

import { yearsLived } from '@/features/grid/lib/life-math';
import { defaultDobCivilDate, formatCivilDateShort, toCivilDateString, todayCivilDate, tryParseDate } from '@/lib/civil-date';
import { NativeCivilDatePicker } from '@/lib/civil-date/native-civil-date-picker';
import { useAppTranslation } from '@/lib/i18n/use-translation';
import { Button } from '@/lib/theme/components/button';
import { ArrowLeftIcon } from '@/lib/theme/components/icons';
import { Input } from '@/lib/theme/components/input';
import { PrimaryButton } from '@/lib/theme/components/primary-button';
import { Screen } from '@/lib/theme/components/screen';
import { Text } from '@/lib/theme/components/text';
import { View } from '@/lib/theme/components/ui';
import { toHex } from '@/lib/theme/tokens';
import { useTheme } from '@/lib/theme/use-theme';

interface DobPickerProps {
  onConfirm: (dob: string) => void;
  onBack?: () => void;
  initialDob?: string;
}

export function DobPicker({ onConfirm, onBack, initialDob }: DobPickerProps) {
  const { t } = useAppTranslation();
  const { tokens } = useTheme();
  const iconColor = toHex(tokens.inkSoft);
  const [dob, setDob] = useState(() => initialDob ?? defaultDobCivilDate());
  const [showAndroid, setShowAndroid] = useState(false);
  const today = todayCivilDate();

  const age = yearsLived(dob, today);
  const preview = t('onboarding.dob.preview', {
    date: formatCivilDateShort(dob),
    age,
  });

  return (
    <Screen contentClassName="pt-16">
      {/* Top bar: back + step counter */}
      <View className="flex-row items-center justify-between px-7 pt-7">
        <Button
          onPress={onBack}
          hitSlop={12}
          accessibilityLabel={t('settings.back')}
          className="-ml-1 p-1"
        >
          <ArrowLeftIcon color={iconColor} width={22} height={14} />
        </Button>
        <Text variant="micro" tone="faint" className="tracking-[1.6px] uppercase">
          {t('onboarding.dob.step')}
        </Text>
      </View>

      {/* Headline block */}
      <View className="px-9 pt-10">
        <Text
          variant="eyebrow"
          tone="muted"
          className="mb-4 tracking-[2.2px] uppercase"
        >
          {t('onboarding.dob.eyebrow')}
        </Text>
        <Text
          className="font-display-italic text-[28px]/9 tracking-[-0.3px] text-ink"
        >
          {t('onboarding.dob.title')}
        </Text>
        <Text variant="meta" tone="muted" className="mt-3 leading-5">
          {t('onboarding.dob.body')}
        </Text>
      </View>

      <View className="flex-1 items-center justify-center px-7">
        {Platform.OS === 'android' && (
          <Button
            onPress={() => setShowAndroid(true)}
            testID="onboarding-dob-field"
            className="min-h-14 w-full items-center justify-center rounded-pill border-0 p-4"
          >
            <Text variant="body" tone="ink" numberOfLines={1}>
              {formatCivilDateShort(dob)}
            </Text>
          </Button>
        )}

        {(Platform.OS === 'ios' || showAndroid) && (
          <NativeCivilDatePicker
            value={dob}
            maximumValue={today}
            onChange={setDob}
            display={Platform.OS === 'ios' ? 'spinner' : undefined}
            onAndroidClose={() => setShowAndroid(false)}
          />
        )}

        {(Platform.OS === 'web') && (
          <Input
            align="center"
            className="border-0 px-0 text-2xl"
            defaultValue={dob}
            size="lg"
            testID="onboarding-web-dob-input"
            onChange={(e) => {
              const newVal = tryParseDate(e.nativeEvent.text);
              if (!newVal) return;
              setDob(toCivilDateString(newVal));
            }}
          />
        )}
      </View>

      <View className="items-center gap-4 px-9 pb-14">
        <PrimaryButton onPress={() => onConfirm(dob)} testID="onboarding-dob-done" full>
          {t('onboarding.dob.done')}
        </PrimaryButton>
        <Text variant="meta" tone="muted" className="tracking-[0.3px]">
          {preview}
        </Text>
      </View>
    </Screen>
  );
}
