import type { View as GridView } from '@/features/grid/lib/life-math';
import { useState } from 'react';
import { View } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LifeGrid } from '@/features/grid/components/life-grid';
import { ViewToggle } from '@/features/grid/components/view-toggle';
import { useReducedMotion } from '@/lib/a11y/use-reduced-motion';
import { todayCivilDate } from '@/lib/civil-date';
import { usePreferencesStore } from '@/lib/storage/preferences-store';

const CROSS_FADE_DURATION = 120;

export default function AppIndex() {
  const dob = usePreferencesStore((s) => s.dob)!;
  const defaultView = usePreferencesStore((s) => s.defaultView);
  const today = todayCivilDate();
  const insets = useSafeAreaInsets();
  const reducedMotion = useReducedMotion();

  const [activeView, setActiveView] = useState<GridView>(defaultView);
  const [displayedView, setDisplayedView] = useState<GridView>(defaultView);
  const [gridLayout, setGridLayout] = useState<{ width: number; height: number } | null>(null);

  const gridOpacity = useSharedValue(1);

  const gridStyle = useAnimatedStyle(() => ({
    opacity: gridOpacity.value,
  }));

  function handleViewChange(newView: GridView) {
    if (newView === activeView) return;
    setActiveView(newView);
    if (reducedMotion) {
      setDisplayedView(newView);
      return;
    }
    // eslint-disable-next-line react-hooks/immutability -- Reanimated shared value; mutation is intentional
    gridOpacity.value = withTiming(0, { duration: CROSS_FADE_DURATION }, (finished) => {
      if (finished) {
        runOnJS(setDisplayedView)(newView);
        gridOpacity.value = withTiming(1, { duration: CROSS_FADE_DURATION });
      }
    });
  }

  return (
    <View
      className="flex-1 bg-[--color-bg]"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <View className="px-4 pt-3 pb-2">
        <ViewToggle view={activeView} onViewChange={handleViewChange} />
      </View>

      <View
        className="flex-1"
        onLayout={(e) =>
          setGridLayout({
            width: e.nativeEvent.layout.width,
            height: e.nativeEvent.layout.height,
          })}
      >
        <Animated.View style={[{ flex: 1 }, gridStyle]}>
          {gridLayout && (
            <LifeGrid
              view={displayedView}
              dob={dob}
              today={today}
              width={gridLayout.width}
              height={gridLayout.height}
            />
          )}
        </Animated.View>
      </View>
    </View>
  );
}
