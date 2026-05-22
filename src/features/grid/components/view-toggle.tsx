import type { View } from '../lib/life-math';
import { Pressable, View as RNView, Text } from 'react-native';

import { useAppTranslation } from '@/lib/i18n/use-translation';

interface ViewToggleProps {
  view: View;
  onViewChange: (view: View) => void;
}

const VIEWS: View[] = ['weeks', 'months', 'years'];

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  const { t } = useAppTranslation();

  return (
    <RNView className="flex-row items-center rounded-xl bg-[--color-surface] p-1">
      {VIEWS.map((v) => (
        <Pressable
          key={v}
          onPress={() => onViewChange(v)}
          className={`flex-1 items-center rounded-lg py-2 ${view === v ? 'bg-[--color-bg]' : ''}`}
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
  );
}
