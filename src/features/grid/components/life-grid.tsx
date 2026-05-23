import type { SharedValue } from 'react-native-reanimated';
import type { DotState } from '../lib/dot-states';
import type { GridLayout } from '../lib/grid-layout';
import type { LifeGridState } from '../lib/life-grid-state';
import type { SkiaTokens } from '@/lib/theme/tokens';
import { Canvas, Circle, createPicture, Picture, Skia, useClock } from '@shopify/react-native-skia';

import { memo, useMemo } from 'react';
import { useDerivedValue } from 'react-native-reanimated';
import { useTheme } from '@/lib/theme/use-theme';

const RING_STROKE_WIDTH = 2;
const RING_RADIUS_OFFSET = RING_STROKE_WIDTH / 2;
const PULSE_PERIOD_MS = 2000;

interface LifeGridProps {
  state: LifeGridState;
}

export const LifeGrid = memo(({ state }: LifeGridProps) => {
  const { skiaTokens: skia } = useTheme();

  const { rows, dotSize, gap } = state.layout;
  const gridHeight = rows * dotSize + (rows - 1) * gap;
  const yOffset = Math.max(0, (state.height - gridHeight) / 2);
  const staticDotsPicture = useMemo(
    () => createStaticDotsPicture({
      dots: state.dots,
      height: state.height,
      layout: state.layout,
      skia,
      width: state.width,
      yOffset,
    }),
    [skia, state.dots, state.height, state.layout, state.width, yOffset],
  );
  const todayRing = useMemo(
    () => todayRingGeometryFor({
      dots: state.dots,
      layout: state.layout,
      yOffset,
    }),
    [state.dots, state.layout, yOffset],
  );

  const canvasStyle = useMemo(
    () => ({ width: state.width, height: state.height }),
    [state.height, state.width],
  );

  return (
    <Canvas style={canvasStyle}>
      <Picture picture={staticDotsPicture} />
      {todayRing && (
        <TodayRing
          cx={todayRing.cx}
          cy={todayRing.cy}
          radius={todayRing.radius}
          color={skia.ring}
          pulse={state.todayRing === 'pulse'}
        />
      )}
    </Canvas>
  );
});

LifeGrid.displayName = 'LifeGrid';

interface StaticDotsPictureInput {
  dots: DotState[];
  height: number;
  layout: GridLayout;
  skia: SkiaTokens;
  width: number;
  yOffset: number;
}

interface TodayRingGeometryInput {
  dots: DotState[];
  layout: GridLayout;
  yOffset: number;
}

interface TodayRingGeometry {
  cx: number;
  cy: number;
  radius: number;
}

interface DotCenterInput {
  cols: number;
  index: number;
  radius: number;
  stride: number;
  yOffset: number;
}

function createStaticDotsPicture(input: StaticDotsPictureInput) {
  const { dots, height, layout, skia, width, yOffset } = input;
  const { cols, dotSize, gap } = layout;
  const radius = dotSize / 2;
  const stride = dotSize + gap;
  const futureColor = Skia.Color(skia.future);
  const stageColors = skia.stages.map((color) => Skia.Color(color));

  return createPicture((canvas) => {
    const paint = Skia.Paint();
    paint.setAntiAlias(true);

    dots.forEach((dot, index) => {
      const color = 'kind' in dot ? futureColor : stageColors[dot.stage];
      const { cx, cy } = dotCenterFor({ cols, index, radius, stride, yOffset });
      paint.setColor(color);
      canvas.drawCircle(cx, cy, radius, paint);
    });
  }, { width, height });
}

function todayRingGeometryFor(input: TodayRingGeometryInput): TodayRingGeometry | null {
  const { dots, layout, yOffset } = input;
  const { cols, dotSize, gap } = layout;
  const index = dots.findIndex((dot) => !('kind' in dot) && dot.isToday);

  if (index < 0) return null;

  return {
    ...dotCenterFor({
      cols,
      index,
      radius: dotSize / 2,
      stride: dotSize + gap,
      yOffset,
    }),
    radius: dotSize / 2,
  };
}

function dotCenterFor(input: DotCenterInput) {
  const { cols, index, radius, stride, yOffset } = input;
  const col = index % cols;
  const row = Math.floor(index / cols);

  return {
    cx: col * stride + radius,
    cy: yOffset + row * stride + radius,
  };
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
