import type { SharedValue } from 'react-native-reanimated';
import { useEffect } from 'react';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { useReducedMotion } from '@/lib/a11y/use-reduced-motion';
import { View } from '@/lib/theme/components/ui';

const STAGE_DOTS = [
  { colorClassName: 'bg-stage-0' },
  { colorClassName: 'bg-stage-1' },
  { colorClassName: 'bg-stage-2' },
  { colorClassName: 'bg-stage-3' },
  { colorClassName: 'bg-stage-4' },
] as const;

const PARTICLE_VECTORS = [
  { x: -8, y: -5 },
  { x: -5, y: -9 },
  { x: -1, y: -7 },
  { x: 3, y: -11 },
  { x: 4, y: -8 },
  { x: 7, y: -10 },
  { x: 8, y: -4 },
  { x: 10, y: 1 },
  { x: 11, y: -2 },
  { x: 10, y: 5 },
  { x: 6, y: 6 },
  { x: 2, y: 9 },
  { x: -1, y: 11 },
  { x: 4, y: 12 },
  { x: -3, y: 8 },
  { x: -5, y: 11 },
  { x: -7, y: 5 },
  { x: -10, y: 1 },
  { x: -11, y: -2 },
  { x: -10, y: -6 },
  { x: -8, y: -9 },
  { x: -3, y: -12 },
  { x: -6, y: -1 },
  { x: 8, y: 9 },
  { x: 1, y: -12 },
  { x: 12, y: 3 },
  { x: -4, y: 3 },
  { x: 5, y: -2 },
  { x: -2, y: -10 },
] as const;

const DOT_COUNT = STAGE_DOTS.length;
const DOT_STAGGER_MS = 100;
const DISSOLVE_MS = 620;
const REFORM_MS = 620;
const HOLD_DOT_MS = 640;
const HOLD_DUST_MS = 1650;
const HOLD_REFORMED_MS = 900;
const PARTICLE_WANDER_MS = 4000;
const PARTICLE_WANDER_RADIUS = 2.2;
const PARTICLE_PHASE_STEP = 0.83;
const DOT_PHASE_STEP = 0.47;

interface StageDustDotsProps {
  testID?: string;
}

interface DustDotProps {
  dot: (typeof STAGE_DOTS)[number];
  index: number;
  testID: string;
}

interface DustParticleProps {
  className: (typeof STAGE_DOTS)[number]['colorClassName'];
  dotIndex: number;
  particleIndex: number;
  progress: SharedValue<number>;
  testID: string;
  vector: (typeof PARTICLE_VECTORS)[number];
  wander: SharedValue<number>;
}

export function StageDustDots({ testID = 'onboarding-stage-dust-dots' }: StageDustDotsProps) {
  const reducedMotion = useReducedMotion();

  return (
    <View
      accessibilityElementsHidden
      className="flex-row gap-1.5"
      importantForAccessibility="no-hide-descendants"
      testID={testID}
    >
      {STAGE_DOTS.map((dot, index) => {
        const dotTestID = `${testID}-dot-${index}`;

        if (reducedMotion) {
          return (
            <View
              key={dot.colorClassName}
              className={`size-3 rounded-full ${dot.colorClassName}`}
              testID={dotTestID}
            />
          );
        }

        return (
          <DustDot
            key={dot.colorClassName}
            dot={dot}
            index={index}
            testID={dotTestID}
          />
        );
      })}
    </View>
  );
}

function DustDot({ dot, index, testID }: DustDotProps) {
  const progress = useSharedValue(0);
  const wander = useSharedValue(0);

  useEffect(() => {
    const dissolveDelay = HOLD_DOT_MS + index * DOT_STAGGER_MS;
    const reformDelay = HOLD_DUST_MS + (DOT_COUNT - 1) * DOT_STAGGER_MS;
    const reformedDelay = HOLD_REFORMED_MS + (DOT_COUNT - 1 - index) * DOT_STAGGER_MS;

    progress.value = withRepeat(
      withSequence(
        withDelay(dissolveDelay, withTiming(1, { duration: DISSOLVE_MS })),
        withDelay(reformDelay, withTiming(0, { duration: REFORM_MS })),
        withDelay(reformedDelay, withTiming(0, { duration: 1 })),
      ),
      -1,
      false,
    );
    wander.value = withRepeat(
      withSequence(
        withTiming(1, { duration: PARTICLE_WANDER_MS, easing: Easing.linear }),
        withTiming(0, { duration: 1, easing: Easing.linear }),
      ),
      -1,
      false,
    );

    return () => {
      cancelAnimation(progress);
      cancelAnimation(wander);
    };
  }, [index, progress, wander]);

  const dotStyle = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
    transform: [
      {
        scale: 1 - progress.value * 0.58,
      },
    ],
  }));

  return (
    <View className="size-6 items-center justify-center" testID={testID}>
      <Animated.View
        className={`size-3 rounded-full ${dot.colorClassName}`}
        style={dotStyle}
      />
      {PARTICLE_VECTORS.map((vector, particleIndex) => (
        <DustParticle
          key={`${vector.x}:${vector.y}`}
          className={dot.colorClassName}
          dotIndex={index}
          particleIndex={particleIndex}
          progress={progress}
          testID={`${testID.replace('-dot-', '-particle-')}-${particleIndex}`}
          vector={vector}
          wander={wander}
        />
      ))}
    </View>
  );
}

function DustParticle({
  className,
  dotIndex,
  particleIndex,
  progress,
  testID,
  vector,
  wander,
}: DustParticleProps) {
  const particleStyle = useAnimatedStyle(() => {
    const drift = progress.value;
    const opacity = Math.min(progress.value * 1.35, 1);
    const scale = 0.5 + progress.value * 0.55;
    const shimmer = dotIndex % 2 === 0 ? 1 : -1;
    const phase = wander.value * Math.PI * 2 + particleIndex * PARTICLE_PHASE_STEP + dotIndex * DOT_PHASE_STEP;
    const wanderOffset = progress.value * PARTICLE_WANDER_RADIUS;

    return {
      opacity,
      transform: [
        { translateX: vector.x * drift + Math.cos(phase) * wanderOffset },
        { translateY: (vector.y + shimmer * (particleIndex % 3)) * drift + Math.sin(phase) * wanderOffset },
        { scale },
      ],
    };
  });

  return (
    <Animated.View
      className={`absolute size-px rounded-full ${className}`}
      style={particleStyle}
      testID={testID}
    />
  );
}
