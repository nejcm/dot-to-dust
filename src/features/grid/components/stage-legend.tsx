import { memo, useState } from 'react';
import { Pressable, View } from 'react-native';

import { Text } from '@/lib/theme/components/text';
import { getPressedStyle } from '@/lib/theme/utils/get-pressed-style';

const STAGES = [
  { name: 'Formation', range: '0–11', dotClassName: 'bg-stage-0' },
  { name: 'Emergence', range: '12–22', dotClassName: 'bg-stage-1' },
  { name: 'Construction', range: '23–39', dotClassName: 'bg-stage-2' },
  { name: 'Tenure', range: '40–59', dotClassName: 'bg-stage-3' },
  { name: 'Twilight', range: '60–80', dotClassName: 'bg-stage-4' },
] as const;

export const StageLegend = memo(() => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Pressable
      accessibilityLabel={expanded ? 'Collapse life stage legend' : 'Expand life stage legend'}
      accessibilityRole="button"
      accessibilityState={{ expanded }}
      hitSlop={6}
      onPress={() => setExpanded((value) => !value)}
      style={getPressedStyle}
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
              className={`${expanded ? 'size-4' : 'size-2'} shrink-0 rounded-[6px] ${stage.dotClassName}`}
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
    </Pressable>
  );
});

StageLegend.displayName = 'StageLegend';
