import type { LayoutChangeEvent } from 'react-native';

import type { LifeGridHeaderState } from '@/features/grid/lib/life-grid-state';
import type { PreferencesState } from '@/lib/storage/preferences-store';
import { Redirect } from 'expo-router';
import { memo, useCallback, useMemo, useState } from 'react';

import { Platform, Text } from 'react-native';
import { LifeGrid } from '@/features/grid/components/life-grid';
import { StageLegend } from '@/features/grid/components/stage-legend';
import { buildLifeGridHeaderState, buildLifeGridState } from '@/features/grid/lib/life-grid-state';
import { useReducedMotion } from '@/lib/a11y/use-reduced-motion';
import { todayCivilDate } from '@/lib/civil-date';
import { useAppTranslation } from '@/lib/i18n/use-translation';
import { useDefaultViewPreference, useDobPreference } from '@/lib/storage/preferences-store';
import { Button } from '@/lib/theme/components/button';
import { GearIcon } from '@/lib/theme/components/icons';
import { Screen } from '@/lib/theme/components/screen';
import { View } from '@/lib/theme/components/ui';
import { toHex } from '@/lib/theme/tokens';
import { useTheme } from '@/lib/theme/use-theme';

interface LifeGridScreenProps {
  onOpenSettings: () => void;
}

interface InlineHeaderProps {
  header: LifeGridHeaderState;
  iconColor: string;
  onOpenSettings: () => void;
  settingsLabel: string;
  defaultView: PreferencesState['defaultView'];
}

const InlineHeader = memo(({
  header,
  iconColor,
  onOpenSettings,
  settingsLabel,
  defaultView,
}: InlineHeaderProps) => {
  const { t } = useAppTranslation();

  return (
    <View testID="inline-header" className="px-4 pt-3">
      <View className="relative flex-row items-center justify-between rounded-pill border border-hairline/60 bg-surface/70 px-4 py-1.5">
        <Text className="font-display-italic text-base/tight tracking-[-0.3px] text-muted">{t(`common.${defaultView}`)}</Text>
        <View className="flex-row items-baseline gap-2">
          <Text
            className="font-display-italic text-display-m/tight tracking-[-0.3px] text-ink"
            testID="headline-lived"
          >
            {header.lived.toLocaleString()}
          </Text>
          <Text className="font-ui text-eyebrow tracking-[1.6px] text-muted">
            {t('grid.headline.of', {
              percent: header.percent,
              total: header.total.toLocaleString(),
            })}
          </Text>
        </View>

        <Button
          onPress={onOpenSettings}
          hitSlop={12}
          accessibilityLabel={settingsLabel}
          testID="settings-button"
          className="-mr-2 items-center justify-center px-2"
        >
          <GearIcon color={iconColor} />
        </Button>
      </View>
    </View>
  );
});

InlineHeader.displayName = 'InlineHeader';

export const LifeGridScreen = memo(({ onOpenSettings }: LifeGridScreenProps) => {
  const dob = useDobPreference();
  const defaultView = useDefaultViewPreference();
  const today = todayCivilDate();
  const { t } = useAppTranslation();
  const { tokens } = useTheme();
  const iconColor = toHex(tokens.muted);
  const reducedMotion = useReducedMotion();

  const [gridLayout, setGridLayout] = useState<{ width: number; height: number } | null>(null);
  const handleGridLayout = useCallback((e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setGridLayout((prev) => {
      if (prev?.width === width && prev.height === height) return prev;
      return { width, height };
    });
  }, []);

  const header = useMemo(
    () => dob === null ? { lived: 0, percent: 0, total: 0 } : buildLifeGridHeaderState(defaultView, dob, today),
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
        reducedMotion,
        platformOS: Platform.OS,
      });
    },
    [defaultView, dob, gridLayout, reducedMotion, today],
  );

  if (dob === null) {
    return <Redirect href="/(onboarding)" />;
  }

  return (
    <Screen testID="main-screen" contentClassName="relative">
      <InlineHeader
        header={header}
        iconColor={iconColor}
        defaultView={defaultView}
        onOpenSettings={onOpenSettings}
        settingsLabel={t('settings.title')}
      />

      <View className="flex-1 px-4 pt-6 pb-16">
        <View
          className="flex-1"
          onLayout={handleGridLayout}
          testID="life-grid-layout"
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
});

LifeGridScreen.displayName = 'LifeGridScreen';
