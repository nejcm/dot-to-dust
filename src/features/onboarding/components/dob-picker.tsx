import { useState } from 'react';
import { Platform } from 'react-native';
import { yearsLived } from '@/features/grid/lib/life-math';
import { defaultDobCivilDate, formatCivilDateShort, todayCivilDate } from '@/lib/civil-date';
import { NativeCivilDatePicker } from '@/lib/civil-date/native-civil-date-picker';
import { useAppTranslation } from '@/lib/i18n/use-translation';
import { ArrowLeftIcon } from '@/lib/theme/components/icons';
import { PrimaryButton } from '@/lib/theme/components/primary-button';
import { Screen } from '@/lib/theme/components/screen';
import { Text } from '@/lib/theme/components/text';
import { Pressable, View } from '@/lib/theme/components/ui';
import { spacing } from '@/lib/theme/spacing';
import { toHex } from '@/lib/theme/tokens';
import { fontFamily } from '@/lib/theme/typography';
import { useTheme } from '@/lib/theme/use-theme';
import { getPressedStyle } from '@/lib/theme/utils/get-pressed-style';

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
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 28,
          paddingTop: 28,
        }}
      >
        <Pressable
          onPress={onBack}
          hitSlop={12}
          accessibilityLabel={t('settings.back')}
          accessibilityRole="button"
          style={(s) => getPressedStyle(s, { padding: 4, marginLeft: -4 })}
        >
          <ArrowLeftIcon color={iconColor} width={22} height={14} />
        </Pressable>
        <Text variant="micro" tone="faint" style={{ letterSpacing: 1.6, textTransform: 'uppercase' }}>
          {t('onboarding.dob.step')}
        </Text>
      </View>

      {/* Headline block */}
      <View style={{ paddingHorizontal: 36, paddingTop: 40 }}>
        <Text
          variant="eyebrow"
          tone="muted"
          style={{ marginBottom: 14, letterSpacing: 2.2, textTransform: 'uppercase' }}
        >
          {t('onboarding.dob.eyebrow')}
        </Text>
        <Text
          style={{
            fontFamily: fontFamily.displayItalic,
            fontSize: 28,
            lineHeight: 34,
            letterSpacing: -0.3,
            color: tokens.ink,
          }}
        >
          {t('onboarding.dob.title')}
        </Text>
        <Text variant="meta" tone="muted" style={{ marginTop: 12, lineHeight: 21 }}>
          {t('onboarding.dob.body')}
        </Text>
      </View>

      {/* Picker */}
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28 }}>
        {Platform.OS === 'android' && (
          <Pressable
            onPress={() => setShowAndroid(true)}
            testID="onboarding-dob-field"
            style={{
              minHeight: 56,
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 0.5,
              borderColor: tokens.hairline,
              padding: spacing[4],
            }}
          >
            <Text variant="body" tone="ink" numberOfLines={1}>
              {formatCivilDateShort(dob)}
            </Text>
          </Pressable>
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
      </View>

      {/* Footer: Continue + preview */}
      <View style={{ paddingHorizontal: 36, paddingBottom: 56, gap: 14, alignItems: 'center' }}>
        <PrimaryButton onPress={() => onConfirm(dob)} testID="onboarding-dob-done" full>
          {t('onboarding.dob.done')}
        </PrimaryButton>
        <Text variant="meta" tone="muted" style={{ letterSpacing: 0.3 }}>
          {preview}
        </Text>
      </View>
    </Screen>
  );
}
