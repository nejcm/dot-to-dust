import type { View } from '@/lib/view';

import { View as RNView, Text } from 'react-native';

import { useAppTranslation } from '@/lib/i18n/use-translation';

import { bonusUnitsAhead, isBonusTime, LIFE_YEARS, remainingFor } from '../lib/life-math';
import { livedUnitsFor, totalUnitsFor } from '../lib/view-policy';

const EYEBROW_KEY = {
  weeks: 'grid.headline.eyebrow.weeks',
  months: 'grid.headline.eyebrow.months',
  years: 'grid.headline.eyebrow.years',
} as const satisfies Record<View, string>;

const BONUS_EYEBROW_KEY = {
  weeks: 'grid.headline.eyebrow.bonusWeeks',
  months: 'grid.headline.eyebrow.bonusMonths',
  years: 'grid.headline.eyebrow.bonusYears',
} as const satisfies Record<View, string>;

const SUBLINE_KEY = {
  weeks: 'grid.headline.subline.weeks',
  months: 'grid.headline.subline.months',
  years: 'grid.headline.subline.years',
} as const satisfies Record<View, string>;

interface HeadlineProps {
  view: View;
  dob: string;
  today: string;
}

export function Headline({ view, dob, today }: HeadlineProps) {
  const { t } = useAppTranslation();
  const bonus = isBonusTime(dob, today);

  const lived = livedUnitsFor(view, dob, today);
  const total = totalUnitsFor(view);
  const remaining = bonus ? bonusUnitsAhead(view, dob, today) : remainingFor(view, dob, today);

  const eyebrowKey = bonus ? BONUS_EYEBROW_KEY[view] : EYEBROW_KEY[view];

  return (
    <RNView testID="headline" accessibilityRole="none">
      <Text
        className="mb-[10px] text-[10.5px] font-medium tracking-[2.2px] text-muted uppercase"
      >
        {t(eyebrowKey)}
      </Text>

      <RNView className="flex-row items-baseline gap-3">
        <Text
          className="font-display-italic text-display-xl leading-[44px] tracking-[-1px] text-ink"
          testID="headline-lived"
        >
          {(bonus ? remaining : lived).toLocaleString()}
        </Text>
        {!bonus && (
          <Text
            className="font-ui text-[12px] tracking-[0.3px] text-muted"
          >
            {t('grid.headline.of', { total: total.toLocaleString() })}
          </Text>
        )}
      </RNView>

      {!bonus && (
        <Text
          className="mt-2 font-ui text-[12px] tracking-[0.2px] text-muted"
          testID="headline-subline"
        >
          {t(SUBLINE_KEY[view], {
            count: remaining,
            years: LIFE_YEARS,
          })}
        </Text>
      )}
    </RNView>
  );
}
