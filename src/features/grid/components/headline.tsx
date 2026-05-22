import type { View } from '@/lib/view';
import { Text } from 'react-native';

import { useAppTranslation } from '@/lib/i18n/use-translation';

import { isBonusTime } from '../lib/life-math';
import { headlineCountFor, headlineKeyFor } from '../lib/view-policy';

interface HeadlineProps {
  view: View;
  dob: string;
  today: string;
}

export function Headline({ view, dob, today }: HeadlineProps) {
  const { t } = useAppTranslation();
  const bonus = isBonusTime(dob, today);

  const text = t(headlineKeyFor(view, bonus), {
    count: headlineCountFor(view, dob, today, bonus),
  });

  return (
    <Text
      adjustsFontSizeToFit
      minimumFontScale={0.8}
      numberOfLines={1}
      style={{ fontFamily: 'Inter_400Regular' }}
      className="text-xs text-[--color-text] opacity-60"
      accessibilityRole="text"
      accessibilityLabel={text}
      testID="headline"
    >
      {text}
    </Text>
  );
}
