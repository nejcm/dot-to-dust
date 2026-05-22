import type { SharedValue } from 'react-native-reanimated';
import type { View } from '@/lib/view';
import { Canvas, Circle, Group, useClock } from '@shopify/react-native-skia';

import { useMemo } from 'react';
import { useDerivedValue } from 'react-native-reanimated';
import { useReducedMotion } from '@/lib/a11y/use-reduced-motion';
import { useTheme } from '@/lib/theme/use-theme';
import { buildDotStates } from '../lib/dot-states';
import { computeGridLayout } from '../lib/grid-layout';

const RING_STROKE_WIDTH = 2;
const RING_RADIUS_OFFSET = RING_STROKE_WIDTH / 2;
const PULSE_PERIOD_MS = 2000;

interface LifeGridProps {
  view: View;
  dob: string;
  today: string;
  width: number;
  height: number;
}

export function LifeGrid({ view, dob, today, width, height }: LifeGridProps) {
  const { tokens } = useTheme();
  const reducedMotion = useReducedMotion();

  const shouldPulse = !reducedMotion && view !== 'years';

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
                color={tokens.skia.dotFuture}
              />
            );
          }

          const fill = tokens.skia.stages[dot.stage];

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
                color={tokens.skia.accent}
                pulse={shouldPulse}
              />
            </Group>
          );
        })}
      </Group>
    </Canvas>
  );
}

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
