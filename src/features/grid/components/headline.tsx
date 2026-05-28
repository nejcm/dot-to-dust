import type { View } from '@/lib/view';

import { View as RNView, Text } from 'react-native';

import { useAppTranslation } from '@/lib/i18n/use-translation';

import { buildHeadlineState } from '../lib/life-grid-state';

interface HeadlineProps {
  view: View;
  dob: string;
  today: string;
}

export function Headline({ view, dob, today }: HeadlineProps) {
  const { t } = useAppTranslation();
  const headline = buildHeadlineState({ view, dob, today });

  return (
    <RNView testID="headline" accessibilityRole="none">
      <Text
        className="mb-2.5 text-[10.5px] font-medium tracking-[2.2px] text-muted uppercase"
      >
        {t(headline.eyebrowKey)}
      </Text>

      <RNView className="flex-row items-baseline gap-3">
        <Text
          className="font-display-italic text-display-xl leading-[44px] tracking-[-1px] text-ink"
          testID="headline-lived"
        >
          {headline.count.toLocaleString()}
        </Text>
        {!headline.bonus && (
          <Text
            className="font-ui text-[12px] tracking-[0.3px] text-muted"
          >
            {t('grid.headline.of', {
              percent: headline.percent,
              total: headline.total.toLocaleString(),
            })}
          </Text>
        )}
      </RNView>

      {!headline.bonus && (
        <Text
          className="mt-2 font-ui text-[12px] tracking-[0.2px] text-muted"
          testID="headline-subline"
        >
          {t(headline.sublineKey, {
            count: headline.remaining,
            years: headline.years,
          })}
        </Text>
      )}
    </RNView>
  );
}
