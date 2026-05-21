import { useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LifeGrid } from '@/features/grid/components/life-grid';
import { todayCivilDate } from '@/lib/civil-date';
import { usePreferencesStore } from '@/lib/storage/preferences-store';

export default function AppIndex() {
  const dob = usePreferencesStore((s) => s.dob)!;
  const today = todayCivilDate();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const canvasWidth = width;
  const canvasHeight = height - insets.top - insets.bottom;

  return (
    <View className="flex-1 bg-[--color-bg]">
      <LifeGrid
        view="weeks"
        dob={dob}
        today={today}
        width={canvasWidth}
        height={canvasHeight}
      />
    </View>
  );
}
