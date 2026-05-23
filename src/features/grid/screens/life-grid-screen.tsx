import type { View as GridView } from '@/lib/view';

import { Redirect } from 'expo-router';
import { useState } from 'react';
import { Text } from 'react-native';

import { LifeGrid } from '@/features/grid/components/life-grid';
import { StageLegend } from '@/features/grid/components/stage-legend';
import { livedUnitsFor, totalUnitsFor } from '@/features/grid/lib/view-policy';
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

const GRID_TOP_PADDING = 24;

interface LifeGridScreenProps {
  onOpenSettings: () => void;
}

interface InlineHeaderProps {
  dob: string;
  iconColor: string;
  onOpenSettings: () => void;
  settingsLabel: string;
  today: string;
  view: GridView;
}

function InlineHeader({
  dob,
  iconColor,
  onOpenSettings,
  settingsLabel,
  today,
  view,
}: InlineHeaderProps) {
  const { t } = useAppTranslation();
  const lived = livedUnitsFor(view, dob, today);
  const total = totalUnitsFor(view);

  return (
    <View testID="inline-header">
      <View className="relative flex-row items-center justify-center px-4 py-3">
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

        <Pressable
          onPress={onOpenSettings}
          hitSlop={12}
          accessibilityLabel={settingsLabel}
          accessibilityRole="button"
          testID="settings-button"
          className="absolute right-4 min-h-9 min-w-8 items-center justify-center"
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
  const { t } = useAppTranslation();
  const { tokens } = useTheme();
  const iconColor = toHex(tokens.inkSoft);

  const [gridLayout, setGridLayout] = useState<{ width: number; height: number } | null>(null);

  if (dob === null) {
    return <Redirect href="/(onboarding)" />;
  }

  return (
    <Screen testID="main-screen">
      <InlineHeader
        dob={dob}
        iconColor={iconColor}
        onOpenSettings={onOpenSettings}
        settingsLabel={t('settings.title')}
        today={today}
        view={defaultView}
      />

      <View
        className="flex-1 px-4 pt-6"
        onLayout={(e) =>
          setGridLayout({
            width: e.nativeEvent.layout.width,
            height: e.nativeEvent.layout.height - GRID_TOP_PADDING,
          })}
      >
        <View className="flex-1">
          {gridLayout && (
            <LifeGrid
              view={defaultView}
              dob={dob}
              today={today}
              width={gridLayout.width}
              height={gridLayout.height}
            />
          )}
        </View>
      </View>

      <View className="px-5 py-6">
        <StageLegend />
      </View>
    </Screen>
  );
}
