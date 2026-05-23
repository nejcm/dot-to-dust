import type { SharedValue } from 'react-native-reanimated';
import type { LifeGridState } from '../lib/life-grid-state';
import { Canvas, Circle, Group, useClock } from '@shopify/react-native-skia';

import { memo, useMemo } from 'react';
import { useDerivedValue } from 'react-native-reanimated';
import { toSkia } from '@/lib/theme/tokens';
import { useTheme } from '@/lib/theme/use-theme';

const RING_STROKE_WIDTH = 2;
const RING_RADIUS_OFFSET = RING_STROKE_WIDTH / 2;
const PULSE_PERIOD_MS = 2000;

interface LifeGridProps {
  state: LifeGridState;
}

export const LifeGrid = memo(({ state }: LifeGridProps) => {
  const { tokens } = useTheme();
  const skia = useMemo(() => toSkia(tokens), [tokens]);

  const { cols, dotSize, gap } = state.layout;
  const radius = dotSize / 2;
  const stride = dotSize + gap;

  const canvasStyle = useMemo(
    () => ({ width: state.width, height: state.height }),
    [state.height, state.width],
  );

  return (
    <Canvas style={canvasStyle}>
      <Group>
        {state.dots.map((dot, index) => {
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
                color={skia.future}
              />
            );
          }

          const fill = skia.stages[dot.stage];

          if (!dot.isToday) {
            return <Circle key={index} cx={cx} cy={cy} r={radius} color={fill} />;
          }

          return (
            <Group key={index}>
              <Circle cx={cx} cy={cy} r={radius} color={fill} />
              <TodayRing
                cx={cx}
                cy={cy}
                radius={radius}
                color={skia.ring}
                pulse={state.todayRing === 'pulse'}
              />
            </Group>
          );
        })}
      </Group>
    </Canvas>
  );
});

LifeGrid.displayName = 'LifeGrid';

interface TodayRingProps {
  cx: number;
  cy: number;
  radius: number;
  color: string;
  pulse: boolean;
}

function TodayRing({ cx, cy, radius, color, pulse }: TodayRingProps) {
  if (pulse) {
    return <PulsingTodayRing cx={cx} cy={cy} radius={radius} color={color} />;
  }

  return <StaticTodayRing cx={cx} cy={cy} radius={radius} color={color} opacity={0.8} />;
}

function PulsingTodayRing({ cx, cy, radius, color }: Omit<TodayRingProps, 'pulse'>) {
  const clock = useClock();
  const ringOpacity = useDerivedValue(() => {
    const t = (clock.value % PULSE_PERIOD_MS) / PULSE_PERIOD_MS;
    return 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(2 * Math.PI * t));
  }, [clock]);

  return <StaticTodayRing cx={cx} cy={cy} radius={radius} color={color} opacity={ringOpacity} />;
}

interface StaticTodayRingProps extends Omit<TodayRingProps, 'pulse'> {
  opacity: number | SharedValue<number>;
}

function StaticTodayRing({ cx, cy, radius, color, opacity }: StaticTodayRingProps) {
  return (
    <Circle
      cx={cx}
      cy={cy}
      r={Math.max(0, radius - RING_RADIUS_OFFSET)}
      color={color}
      style="stroke"
      strokeWidth={RING_STROKE_WIDTH}
      opacity={opacity}
    />
  );
}
