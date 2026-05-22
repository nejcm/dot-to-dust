import type { View } from '../lib/life-math';
import { Canvas, Circle, Group, useClock } from '@shopify/react-native-skia';

import { useMemo } from 'react';
import { useDerivedValue } from 'react-native-reanimated';
import { useReducedMotion } from '@/lib/a11y/use-reduced-motion';
import { useTheme } from '@/lib/theme/use-theme';
import { buildDotStates } from '../lib/dot-states';
import { computeGridLayout } from '../lib/grid-layout';

// Ring stroke radius is offset outward by half the stroke width so the full
// 2 px stroke sits outside the fill dot rather than being bisected by its edge.
const RING_STROKE_WIDTH = 2;
const RING_RADIUS_OFFSET = RING_STROKE_WIDTH / 2;
// Pulse period in milliseconds.
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

  // Skia's own clock drives the pulse so Reanimated's animation system
  // (withRepeat / withTiming) is not involved in this path.
  const clock = useClock();

  // shouldPulse is a plain JS boolean. It is NOT tracked reactively inside the
  // worklet — it is baked into the serialised closure at construction time.
  // When view or reducedMotion changes the component re-renders, shouldPulse
  // changes, and because it is listed in the deps array useDerivedValue
  // discards the old derived value and creates a new worklet with the updated
  // closure. This is memoisation, not reactive tracking; there is a 1-frame
  // window on the UI thread between the two, which is visually imperceptible.
  const shouldPulse = !reducedMotion && view !== 'years';

  // Opacity oscillates 0.4–1.0 on a sine wave (pulse). Static 0.8 when
  // shouldPulse is false (years view always static; weeks/months respect
  // reduced-motion). The clock fires every frame even when shouldPulse is
  // false — acceptable for a single mounted LifeGrid.
  const ringOpacity = useDerivedValue(() => {
    if (!shouldPulse) return 0.8;
    const t = (clock.value % PULSE_PERIOD_MS) / PULSE_PERIOD_MS;
    return 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(2 * Math.PI * t));
  }, [clock, shouldPulse]);

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

          // Today's dot: filled circle with an accent ring on top.
          // - Bonus time: buildDotStates never sets isToday=true, so this
          //   branch is unreachable — no ring is drawn without special-casing.
          // - Years view: reaches this branch but shouldPulse is false,
          //   so ringOpacity returns the static 0.8 (no animation).
          return (
            <Group key={index}>
              <Circle cx={cx} cy={cy} r={radius} color={fill} />
              <Circle
                cx={cx}
                cy={cy}
                r={radius + RING_RADIUS_OFFSET}
                color={tokens.skia.accent}
                style="stroke"
                strokeWidth={RING_STROKE_WIDTH}
                opacity={ringOpacity}
              />
            </Group>
          );
        })}
      </Group>
    </Canvas>
  );
}
