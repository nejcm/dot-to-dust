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
import Svg, { Circle, Path } from 'react-native-svg';

import { Headline } from '@/features/grid/components/headline';
import { LifeGrid } from '@/features/grid/components/life-grid';
import { StageLegend } from '@/features/grid/components/stage-legend';
import { ViewToggle } from '@/features/grid/components/view-toggle';
import { useReducedMotion } from '@/lib/a11y/use-reduced-motion';
import { todayCivilDate } from '@/lib/civil-date';
import { useAppTranslation } from '@/lib/i18n/use-translation';
import { usePreferencesStore } from '@/lib/storage/preferences-store';
import { Wordmark } from '@/lib/theme/components/wordmark';
import { spacing } from '@/lib/theme/spacing';
import { useTheme } from '@/lib/theme/use-theme';
import { getPressedStyle } from '@/lib/theme/utils/get-pressed-style';

const CROSS_FADE_DURATION = 120;

interface LifeGridScreenProps {
  onOpenSettings: () => void;
}

function GearIcon({ color }: { color: string }) {
  return (
    <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
      <Circle cx={9} cy={9} r={2.2} stroke={color} strokeWidth={0.9} />
      <Path
        d="M9 1.5v2M9 14.5v2M16.5 9h-2M3.5 9h-2M14.3 3.7l-1.4 1.4M5.1 12.9l-1.4 1.4M14.3 14.3l-1.4-1.4M5.1 5.1L3.7 3.7"
        stroke={color}
        strokeWidth={0.9}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function LifeGridScreen({ onOpenSettings }: LifeGridScreenProps) {
  const dob = usePreferencesStore((s) => s.dob);
  const defaultView = usePreferencesStore((s) => s.defaultView);
  const today = todayCivilDate();
  const insets = useSafeAreaInsets();
  const reducedMotion = useReducedMotion();
  const { t } = useAppTranslation();
  const { tokens } = useTheme();

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
      {/* Top bar: wordmark + settings */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: spacing[8],
          paddingTop: spacing[4],
          paddingBottom: 0,
        }}
      >
        <Wordmark size={10} />
        <Pressable
          onPress={onOpenSettings}
          hitSlop={12}
          accessibilityLabel={t('settings.title')}
          accessibilityRole="button"
          testID="settings-button"
          style={(s) => getPressedStyle(s, { minHeight: 44, minWidth: 44, alignItems: 'center', justifyContent: 'center' })}
        >
          <GearIcon color={tokens.inkSoft} />
        </Pressable>
      </View>

      {/* Headline */}
      <View style={{ paddingHorizontal: spacing[8], paddingTop: spacing[8], paddingBottom: spacing[6] }}>
        <Headline view={activeView} dob={dob} today={today} />
      </View>

      {/* Segmented view toggle */}
      <View style={{ paddingHorizontal: spacing[8] }}>
        <ViewToggle view={activeView} onViewChange={handleViewChange} />
      </View>

      {/* Dot grid */}
      <View
        className="flex-1"
        style={{ paddingTop: spacing[6] }}
        onLayout={(e) =>
          setGridLayout({
            width: e.nativeEvent.layout.width,
            height: e.nativeEvent.layout.height - spacing[6],
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

      {/* Stage legend */}
      <View style={{ paddingHorizontal: spacing[8], paddingTop: spacing[4], paddingBottom: spacing[6] }}>
        <StageLegend />
      </View>
    </View>
  );
}
