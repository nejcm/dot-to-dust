import { memo, useState } from 'react';
import { View } from 'react-native';

import { Button } from '@/lib/theme/components/button';
import { Text } from '@/lib/theme/components/text';
import { STAGES } from '../lib/stages';

const STAGE_DOT_CLASS_NAMES = [
  'bg-stage-0',
  'bg-stage-1',
  'bg-stage-2',
  'bg-stage-3',
  'bg-stage-4',
] as const;

export const StageLegend = memo(() => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Button
      accessibilityLabel={expanded ? 'Collapse life stage legend' : 'Expand life stage legend'}
      accessibilityState={{ expanded }}
      hitSlop={6}
      onPress={() => setExpanded((value) => !value)}
      testID="stage-legend-toggle"
      className={`border border-hairline/60 bg-surface/70 ${expanded ? 'rounded-2xl px-4 py-3' : 'rounded-pill px-3 py-2'}`}
    >
      <View className={expanded ? 'gap-2' : 'flex-row items-center justify-between gap-1.5'}>
        {STAGES.map((stage) => (
          <View
            key={stage.name}
            accessibilityLabel={`${stage.name}, ages ${stage.range}`}
            className={expanded ? 'flex-row items-center gap-2' : 'flex-1 flex-row items-center gap-1.5'}
          >
            <View
              className={`${expanded ? 'size-4' : 'size-2'} shrink-0 rounded-[6px] ${STAGE_DOT_CLASS_NAMES[stage.index]}`}
            />
            <Text
              variant="micro"
              tone="muted"
              numberOfLines={expanded ? undefined : 1}
              className={expanded ? 'flex-1 text-micro/tight tracking-[1.2px] uppercase' : 'text-[8px] tracking-[1.4px] uppercase'}
            >
              {stage.name}
            </Text>
            {expanded && (
              <Text variant="micro" tone="faint" className="shrink-0 text-micro tracking-[1px] uppercase">
                {stage.range}
              </Text>
            )}
          </View>
        ))}
      </View>
    </Button>
  );
});

StageLegend.displayName = 'StageLegend';
