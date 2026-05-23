import type { LayoutChangeEvent } from 'react-native';

import type { LifeGridHeaderState } from '@/features/grid/lib/life-grid-state';
import { Redirect } from 'expo-router';
import { memo, useCallback, useMemo, useState } from 'react';
import { Text } from 'react-native';

import { LifeGrid } from '@/features/grid/components/life-grid';
import { StageLegend } from '@/features/grid/components/stage-legend';
import { buildLifeGridHeaderState, buildLifeGridState } from '@/features/grid/lib/life-grid-state';
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

interface LifeGridScreenProps {
  onOpenSettings: () => void;
}

interface InlineHeaderProps {
  header: LifeGridHeaderState;
  iconColor: string;
  onOpenSettings: () => void;
  settingsLabel: string;
}

const InlineHeader = memo(({
  header,
  iconColor,
  onOpenSettings,
  settingsLabel,
}: InlineHeaderProps) => {
  const { t } = useAppTranslation();

  return (
    <View testID="inline-header">
      <View className="relative flex-row items-center justify-center px-4 py-3">
        <View className="flex-row items-baseline gap-2">
          <Text
            className="font-display-italic text-display-m/5 tracking-[-0.3px] text-ink"
            testID="headline-lived"
          >
            {header.lived.toLocaleString()}
          </Text>
          <Text className="font-ui text-eyebrow tracking-[1.6px] text-muted uppercase">
            {t('grid.headline.of', { total: header.total.toLocaleString() })}
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
});

InlineHeader.displayName = 'InlineHeader';

export function LifeGridScreen({ onOpenSettings }: LifeGridScreenProps) {
  const dob = usePreferencesStore.use.dob();
  const defaultView = usePreferencesStore.use.defaultView();
  const today = todayCivilDate();
  const { t } = useAppTranslation();
  const { tokens } = useTheme();
  const iconColor = toHex(tokens.muted);

  const [gridLayout, setGridLayout] = useState<{ width: number; height: number } | null>(null);
  const handleGridLayout = useCallback((e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setGridLayout((prev) => {
      if (prev?.width === width && prev.height === height) return prev;
      return { width, height };
    });
  }, []);

  const header = useMemo(
    () => dob === null ? { lived: 0, total: 0 } : buildLifeGridHeaderState(defaultView, dob, today),
    [defaultView, dob, today],
  );
  const lifeGridState = useMemo(
    () => {
      if (dob === null || gridLayout === null) return null;

      return buildLifeGridState({
        view: defaultView,
        dob,
        today,
        width: gridLayout.width,
        height: gridLayout.height,
      });
    },
    [defaultView, dob, gridLayout, today],
  );

  if (dob === null) {
    return <Redirect href="/(onboarding)" />;
  }

  return (
    <Screen testID="main-screen" contentClassName="relative">
      <InlineHeader
        header={header}
        iconColor={iconColor}
        onOpenSettings={onOpenSettings}
        settingsLabel={t('settings.title')}
      />

      <View className="flex-1 px-4 pt-6 pb-14">
        <View
          className="flex-1"
          onLayout={handleGridLayout}
        >
          {lifeGridState && (
            <LifeGrid
              state={lifeGridState}
            />
          )}
        </View>
      </View>

      <View testID="stage-legend-overlay" className="absolute inset-x-4 bottom-5 z-10">
        <StageLegend />
      </View>
    </Screen>
  );
}
