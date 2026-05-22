import { View } from 'react-native';

import { Text } from '@/lib/theme/components/text';
import { useTheme } from '@/lib/theme/use-theme';

const STAGES = [
  { name: 'Formation', range: '0–11' },
  { name: 'Emergence', range: '12–22' },
  { name: 'Construction', range: '23–39' },
  { name: 'Tenure', range: '40–59' },
  { name: 'Twilight', range: '60–80' },
] as const;

export function StageLegend() {
  const { tokens } = useTheme();

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      {STAGES.map((stage, i) => (
        <View key={stage.name} style={{ alignItems: 'center', gap: 4 }}>
          <View
            style={{
              width: 7,
              height: 7,
              borderRadius: 7,
              backgroundColor: tokens.stages[i],
            }}
          />
          <Text variant="micro" tone="muted" numberOfLines={1}>
            {stage.name}
          </Text>
          <Text variant="micro" tone="faint" numberOfLines={1}>
            {stage.range}
          </Text>
        </View>
      ))}
    </View>
  );
}
