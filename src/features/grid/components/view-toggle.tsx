import type { View } from '../lib/life-math';
import { useEffect, useRef, useState } from 'react';
import { Pressable, View as RNView, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { useReducedMotion } from '@/lib/a11y/use-reduced-motion';
import { useAppTranslation } from '@/lib/i18n/use-translation';

interface ViewToggleProps {
  view: View;
  onViewChange: (view: View) => void;
}

const VIEWS: View[] = ['weeks', 'months', 'years'];
const THUMB_DURATION = 240;

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  const { t } = useAppTranslation();
  const reducedMotion = useReducedMotion();
  const [innerWidth, setInnerWidth] = useState(0);
  const layoutReadyRef = useRef(false);
  const thumbX = useSharedValue(0);

  const thumbWidth = innerWidth > 0 ? innerWidth / VIEWS.length : 0;

  useEffect(() => {
    if (innerWidth === 0) return;
    const targetX = VIEWS.indexOf(view) * thumbWidth;
    if (!layoutReadyRef.current) {
      layoutReadyRef.current = true;
      thumbX.value = targetX;
    }
    else {
      thumbX.value = withTiming(targetX, {
        duration: reducedMotion ? 0 : THUMB_DURATION,
      });
    }
  }, [innerWidth, view, thumbWidth, reducedMotion, thumbX]);

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: thumbX.value }],
  }));

  return (
    <RNView className="flex-row items-center rounded-xl bg-[--color-surface] p-1">
      <RNView
        style={{ flex: 1, flexDirection: 'row', position: 'relative' }}
        onLayout={(e) => setInnerWidth(e.nativeEvent.layout.width)}
      >
        {innerWidth > 0 && (
          <Animated.View
            style={[
              {
                position: 'absolute',
                width: thumbWidth,
                top: 0,
                bottom: 0,
                left: 0,
                borderRadius: 8,
              },
              thumbStyle,
            ]}
            className="bg-[--color-bg]"
          />
        )}
        {VIEWS.map((v) => (
          <Pressable
            key={v}
            onPress={() => onViewChange(v)}
            accessibilityRole="button"
            accessibilityState={{ selected: view === v }}
            style={{ flex: 1, alignItems: 'center', paddingVertical: 8, zIndex: 1 }}
          >
            <Text
              style={{ fontFamily: 'Inter_400Regular' }}
              className={`text-sm text-[--color-text] ${view === v ? '' : 'opacity-40'}`}
            >
              {t(`grid.toggle.${v}`)}
            </Text>
          </Pressable>
        ))}
      </RNView>
    </RNView>
  );
}
