import type { SharedValue } from 'react-native-reanimated';
import { useEffect } from 'react';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { useReducedMotion } from '@/lib/a11y/use-reduced-motion';
import { View } from '@/lib/theme/components/ui';

const STAGE_DOT_CLASSES = [
  'bg-stage-0',
  'bg-stage-1',
  'bg-stage-2',
  'bg-stage-3',
  'bg-stage-4',
] as const;

const PARTICLE_VECTORS = [
  { x: -8, y: -5 },
  { x: -5, y: -9 },
  { x: -1, y: -7 },
  { x: 4, y: -8 },
  { x: 8, y: -4 },
  { x: 10, y: 1 },
  { x: 6, y: 6 },
  { x: 2, y: 9 },
  { x: -3, y: 8 },
  { x: -7, y: 5 },
  { x: -10, y: 1 },
  { x: -6, y: -1 },
] as const;

const DOT_COUNT = STAGE_DOT_CLASSES.length;
const DOT_STAGGER_MS = 140;
const DISSOLVE_MS = 420;
const REFORM_MS = 420;
const HOLD_DOT_MS = 560;
const HOLD_DUST_MS = 420;
const HOLD_REFORMED_MS = 760;

interface StageDustDotsProps {
  testID?: string;
}

interface DustDotProps {
  className: (typeof STAGE_DOT_CLASSES)[number];
  index: number;
  testID: string;
}

interface DustParticleProps {
  className: (typeof STAGE_DOT_CLASSES)[number];
  dotIndex: number;
  particleIndex: number;
  progress: SharedValue<number>;
  testID: string;
  vector: (typeof PARTICLE_VECTORS)[number];
}

export function StageDustDots({ testID = 'onboarding-stage-dust-dots' }: StageDustDotsProps) {
  const reducedMotion = useReducedMotion();

  return (
    <View
      accessibilityElementsHidden
      className="flex-row gap-3"
      importantForAccessibility="no-hide-descendants"
      testID={testID}
    >
      {STAGE_DOT_CLASSES.map((className, index) => {
        const dotTestID = `${testID}-dot-${index}`;

        if (reducedMotion) {
          return (
            <View
              key={className}
              className={`size-2 rounded-full ${className}`}
              testID={dotTestID}
            />
          );
        }

        return (
          <DustDot
            key={className}
            className={className}
            index={index}
            testID={dotTestID}
          />
        );
      })}
    </View>
  );
}

function DustDot({ className, index, testID }: DustDotProps) {
  const progress = useSharedValue(0);

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

    return () => {
      cancelAnimation(progress);
    };
  }, [index, progress]);

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
        className={`size-2 rounded-full ${className}`}
        style={dotStyle}
      />
      {PARTICLE_VECTORS.map((vector, particleIndex) => (
        <DustParticle
          key={`${vector.x}:${vector.y}`}
          className={className}
          dotIndex={index}
          particleIndex={particleIndex}
          progress={progress}
          testID={`${testID.replace('-dot-', '-particle-')}-${particleIndex}`}
          vector={vector}
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
}: DustParticleProps) {
  const particleStyle = useAnimatedStyle(() => {
    const drift = progress.value;
    const opacity = Math.min(progress.value * 1.35, 1);
    const scale = 0.5 + progress.value * 0.55;
    const shimmer = dotIndex % 2 === 0 ? 1 : -1;

    return {
      opacity,
      transform: [
        { translateX: vector.x * drift },
        { translateY: (vector.y + shimmer * (particleIndex % 3)) * drift },
        { scale },
      ],
    };
  });

  return (
    <Animated.View
      className={`absolute size-0.5 rounded-full ${className}`}
      style={particleStyle}
      testID={testID}
    />
  );
}
