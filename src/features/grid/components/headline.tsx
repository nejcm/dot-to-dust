import type { View } from '@/lib/view';

import { View as RNView, Text } from 'react-native';

import { useAppTranslation } from '@/lib/i18n/use-translation';
import { fontFamily } from '@/lib/theme/typography';
import { useTheme } from '@/lib/theme/use-theme';

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
  const { tokens } = useTheme();
  const bonus = isBonusTime(dob, today);

  const lived = livedUnitsFor(view, dob, today);
  const total = totalUnitsFor(view);
  const remaining = bonus ? bonusUnitsAhead(view, dob, today) : remainingFor(view, dob, today);

  const eyebrowKey = bonus ? BONUS_EYEBROW_KEY[view] : EYEBROW_KEY[view];

  return (
    <RNView testID="headline" accessibilityRole="none">
      <Text
        style={{
          fontFamily: fontFamily.uiMedium,
          fontSize: 10.5,
          letterSpacing: 2.2,
          textTransform: 'uppercase',
          color: tokens.muted,
          marginBottom: 10,
        }}
      >
        {t(eyebrowKey)}
      </Text>

      <RNView style={{ flexDirection: 'row', alignItems: 'baseline', gap: 12 }}>
        <Text
          style={{
            fontFamily: fontFamily.displayItalic,
            fontSize: 44,
            letterSpacing: -1,
            color: tokens.ink,
            lineHeight: 44,
          }}
          testID="headline-lived"
        >
          {(bonus ? remaining : lived).toLocaleString()}
        </Text>
        {!bonus && (
          <Text
            style={{
              fontFamily: fontFamily.ui,
              fontSize: 12,
              letterSpacing: 0.3,
              color: tokens.muted,
            }}
          >
            {t('grid.headline.of', { total: total.toLocaleString() })}
          </Text>
        )}
      </RNView>

      {!bonus && (
        <Text
          style={{
            fontFamily: fontFamily.ui,
            fontSize: 12,
            letterSpacing: 0.2,
            color: tokens.muted,
            marginTop: 8,
          }}
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
