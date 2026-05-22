import type { View } from '../lib/life-math';
import { Text } from 'react-native';

import { useAppTranslation } from '@/lib/i18n/use-translation';

import { bonusUnitsAhead, isBonusTime, remainingFor } from '../lib/life-math';

interface HeadlineProps {
  view: View;
  dob: string;
  today: string;
}

const AHEAD_KEY = {
  weeks: 'grid.headline.weeksAhead',
  months: 'grid.headline.monthsAhead',
  years: 'grid.headline.yearsAhead',
} as const;

const BONUS_KEY = {
  weeks: 'grid.headline.bonusWeeks',
  months: 'grid.headline.bonusMonths',
  years: 'grid.headline.bonusYears',
} as const;

export function Headline({ view, dob, today }: HeadlineProps) {
  const { t } = useAppTranslation();
  const bonus = isBonusTime(dob, today);

  const text = bonus
    ? t(BONUS_KEY[view], { count: bonusUnitsAhead(view, dob, today) })
    : t(AHEAD_KEY[view], { count: remainingFor(view, dob, today) });

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
