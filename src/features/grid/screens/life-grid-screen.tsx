import type { View as GridView } from '@/lib/view';

import { Redirect } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Headline } from '@/features/grid/components/headline';
import { LifeGrid } from '@/features/grid/components/life-grid';
import { ViewToggle } from '@/features/grid/components/view-toggle';
import { useReducedMotion } from '@/lib/a11y/use-reduced-motion';
import { todayCivilDate } from '@/lib/civil-date';
import { useAppTranslation } from '@/lib/i18n/use-translation';
import { usePreferencesStore } from '@/lib/storage/preferences-store';
import { Text } from '@/lib/theme/components/text';
import { getPressedStyle } from '@/lib/theme/utils/get-pressed-style';

const CROSS_FADE_DURATION = 120;

interface LifeGridScreenProps {
  onOpenSettings: () => void;
}

export function LifeGridScreen({ onOpenSettings }: LifeGridScreenProps) {
  const dob = usePreferencesStore((s) => s.dob);
  const defaultView = usePreferencesStore((s) => s.defaultView);
  const today = todayCivilDate();
  const insets = useSafeAreaInsets();
  const reducedMotion = useReducedMotion();
  const { t } = useAppTranslation();

  const [activeView, setActiveView] = useState<GridView>(defaultView);
  const [displayedView, setDisplayedView] = useState<GridView>(defaultView);
  const [gridLayout, setGridLayout] = useState<{ width: number; height: number } | null>(null);

  const gridOpacity = useSharedValue(1);

  const gridStyle = useAnimatedStyle(() => ({
    opacity: gridOpacity.value,
  }));

  if (dob === null) {
    return <Redirect href="/(onboarding)" />;
  }

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
      testID="main-screen"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <View className="px-4 pt-3 pb-2">
        <View className="flex-row items-center gap-2">
          <View className="flex-1">
            <ViewToggle view={activeView} onViewChange={handleViewChange} />
          </View>
          <Pressable
            onPress={onOpenSettings}
            hitSlop={12}
            accessibilityLabel={t('settings.title')}
            accessibilityRole="button"
            testID="settings-button"
            className="min-h-11 min-w-11 items-center justify-center"
            style={(s) => getPressedStyle(s)}
          >
            <Text variant="body" tone="muted" numberOfLines={1}>
              ⚙
            </Text>
          </Pressable>
        </View>
        <Headline view={activeView} dob={dob} today={today} />
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
