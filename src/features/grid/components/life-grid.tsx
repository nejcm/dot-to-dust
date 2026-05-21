import type { View } from '../lib/life-math';
import { Canvas, Circle, Group } from '@shopify/react-native-skia';

import { useMemo } from 'react';
import { useTheme } from '@/lib/theme/use-theme';
import { buildDotStates } from '../lib/dot-states';
import { computeGridLayout } from '../lib/grid-layout';

interface LifeGridProps {
  view: View;
  dob: string;
  today: string;
  width: number;
  height: number;
}

export function LifeGrid({ view, dob, today, width, height }: LifeGridProps) {
  const { tokens } = useTheme();

  const { cols, dotSize, gap } = useMemo(
    () => computeGridLayout(view, width, height),
    [view, width, height],
  );

  const dots = useMemo(
    () => buildDotStates(view, dob, today),
    [view, dob, today],
  );

  const radius = dotSize / 2;
  const stride = dotSize + gap;

  return (
    <Canvas style={{ width, height }}>
      <Group>
        {dots.map((dot, index) => {
          const col = index % cols;
          const row = Math.floor(index / cols);
          const cx = col * stride + radius;
          const cy = row * stride + radius;

          if ('kind' in dot) {
            return (
              <Circle
                key={index}
                cx={cx}
                cy={cy}
                r={radius}
                color={tokens.dotFuture}
              />
            );
          }

          const fill = tokens.stages[dot.stage];

          return (
            <Group key={index}>
              <Circle cx={cx} cy={cy} r={radius} color={fill} />
              {dot.isToday && (
                <Circle
                  cx={cx}
                  cy={cy}
                  r={radius + 1.5}
                  color={tokens.accent}
                  style="stroke"
                  strokeWidth={1.5}
                />
              )}
            </Group>
          );
        })}
      </Group>
    </Canvas>
  );
}
