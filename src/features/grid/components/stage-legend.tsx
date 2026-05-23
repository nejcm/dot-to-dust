import { View } from 'react-native';

import { Text } from '@/lib/theme/components/text';

const STAGES = [
  { name: 'Formation', range: '0–11', dotClassName: 'bg-stage-0' },
  { name: 'Emergence', range: '12–22', dotClassName: 'bg-stage-1' },
  { name: 'Construction', range: '23–39', dotClassName: 'bg-stage-2' },
  { name: 'Tenure', range: '40–59', dotClassName: 'bg-stage-3' },
  { name: 'Twilight', range: '60–80', dotClassName: 'bg-stage-4' },
] as const;

export function StageLegend() {
  return (
    <View className="flex-row items-center justify-between gap-1.5">
      {STAGES.map((stage) => (
        <View
          key={stage.name}
          accessibilityLabel={`${stage.name}, ages ${stage.range}`}
          className="flex-1 flex-row items-center gap-1.5"
        >
          <View
            className={`size-1.5 shrink-0 rounded-[6px] ${stage.dotClassName}`}
          />
          <Text
            variant="micro"
            tone="muted"
            numberOfLines={1}
            className="text-[9px] tracking-[1.4px] uppercase"
          >
            {stage.name}
          </Text>
        </View>
      ))}
    </View>
  );
}
