import type { View as GridView } from '@/features/grid/lib/life-math';
import { useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LifeGrid } from '@/features/grid/components/life-grid';
import { ViewToggle } from '@/features/grid/components/view-toggle';
import { todayCivilDate } from '@/lib/civil-date';
import { usePreferencesStore } from '@/lib/storage/preferences-store';

export default function AppIndex() {
  const dob = usePreferencesStore((s) => s.dob)!;
  const defaultView = usePreferencesStore((s) => s.defaultView);
  const today = todayCivilDate();
  const insets = useSafeAreaInsets();

  const [activeView, setActiveView] = useState<GridView>(defaultView);
  const [gridLayout, setGridLayout] = useState<{ width: number; height: number } | null>(null);

  return (
    <View
      className="flex-1 bg-[--color-bg]"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <View className="px-4 pt-3 pb-2">
        <ViewToggle view={activeView} onViewChange={setActiveView} />
      </View>

      <View
        className="flex-1"
        onLayout={(e) =>
          setGridLayout({
            width: e.nativeEvent.layout.width,
            height: e.nativeEvent.layout.height,
          })}
      >
        {gridLayout && (
          <LifeGrid
            view={activeView}
            dob={dob}
            today={today}
            width={gridLayout.width}
            height={gridLayout.height}
          />
        )}
      </View>
    </View>
  );
}
