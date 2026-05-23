import type { View as GridView } from '@/lib/view';

import { Redirect } from 'expo-router';
import { useState } from 'react';
import { Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { LifeGrid } from '@/features/grid/components/life-grid';
import { StageLegend } from '@/features/grid/components/stage-legend';
import { livedUnitsFor, totalUnitsFor } from '@/features/grid/lib/view-policy';
import { useReducedMotion } from '@/lib/a11y/use-reduced-motion';
import { todayCivilDate } from '@/lib/civil-date';
import { useAppTranslation } from '@/lib/i18n/use-translation';
import { usePreferencesStore } from '@/lib/storage/preferences-store';
import { Hairline } from '@/lib/theme/components/hairline';
import { GearIcon } from '@/lib/theme/components/icons';
import { Screen } from '@/lib/theme/components/screen';
import { Pressable, View } from '@/lib/theme/components/ui';
import { toHex } from '@/lib/theme/tokens';
import { useTheme } from '@/lib/theme/use-theme';
import { getPressedStyle } from '@/lib/theme/utils/get-pressed-style';
import { VIEWS } from '@/lib/view';

const CROSS_FADE_DURATION = 120;
const GRID_TOP_PADDING = 24;

interface LifeGridScreenProps {
  onOpenSettings: () => void;
}

interface InlineHeaderProps {
  dob: string;
  iconColor: string;
  onOpenSettings: () => void;
  onViewChange: (view: GridView) => void;
  settingsLabel: string;
  today: string;
  view: GridView;
}

function InlineHeader({
  dob,
  iconColor,
  onOpenSettings,
  onViewChange,
  settingsLabel,
  today,
  view,
}: InlineHeaderProps) {
  const { t } = useAppTranslation();
  const lived = livedUnitsFor(view, dob, today);
  const total = totalUnitsFor(view);

  return (
    <View testID="inline-header">
      <View className="flex-row items-center justify-between gap-3 px-4 py-2">
        <View className="flex-row items-baseline gap-2">
          <Text
            className="font-display-italic text-display-m/5 tracking-[-0.3px] text-ink"
            testID="headline-lived"
          >
            {lived.toLocaleString()}
          </Text>
          <Text className="font-ui text-eyebrow tracking-[1.6px] text-muted uppercase">
            {t('grid.headline.of', { total: total.toLocaleString() })}
          </Text>
        </View>

        <View className="flex-row items-center gap-2.5">
          {VIEWS.map((v) => {
            const active = v === view;
            return (
              <Pressable
                key={v}
                onPress={() => onViewChange(v)}
                hitSlop={10}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                testID={`view-toggle-${v}`}
                className="relative items-center py-1"
              >
                <Text
                  numberOfLines={1}
                  className={[
                    'text-[10.5px] tracking-[1.8px] uppercase',
                    active ? 'font-medium text-ink' : 'font-ui text-faint',
                  ].join(' ')}
                >
                  {t(`grid.toggle.${v}`)}
                </Text>
                {active && (
                  <View className="absolute -bottom-px h-[0.5px] w-2.5 self-center bg-ink" />
                )}
              </Pressable>
            );
          })}
        </View>

        <Pressable
          onPress={onOpenSettings}
          hitSlop={12}
          accessibilityLabel={settingsLabel}
          accessibilityRole="button"
          testID="settings-button"
          className="min-h-9 min-w-8 items-center justify-center"
          style={getPressedStyle}
        >
          <GearIcon color={iconColor} />
        </Pressable>
      </View>
      <Hairline />
    </View>
  );
}

export function LifeGridScreen({ onOpenSettings }: LifeGridScreenProps) {
  const dob = usePreferencesStore.use.dob();
  const defaultView = usePreferencesStore.use.defaultView();
  const today = todayCivilDate();
  const reducedMotion = useReducedMotion();
  const { t } = useAppTranslation();
  const { tokens } = useTheme();
  const iconColor = toHex(tokens.inkSoft);

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
        scheduleOnRN(setDisplayedView, newView);
        gridOpacity.value = withTiming(1, { duration: CROSS_FADE_DURATION });
      }
    });
  }

  return (
    <Screen testID="main-screen">
      <InlineHeader
        dob={dob}
        iconColor={iconColor}
        onOpenSettings={onOpenSettings}
        onViewChange={handleViewChange}
        settingsLabel={t('settings.title')}
        today={today}
        view={activeView}
      />

      <View
        className="flex-1 px-4 pt-6"
        onLayout={(e) =>
          setGridLayout({
            width: e.nativeEvent.layout.width,
            height: e.nativeEvent.layout.height - GRID_TOP_PADDING,
          })}
      >
        <Animated.View className="flex-1" style={gridStyle}>
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

      <View className="px-5 pt-5 pb-11">
        <StageLegend />
      </View>
    </Screen>
  );
}
