import type { View } from '@/lib/view';

import { Pressable, View as RNView, Text } from 'react-native';

import { useAppTranslation } from '@/lib/i18n/use-translation';
import { Hairline } from '@/lib/theme/components/hairline';
import { VIEWS } from '@/lib/view';

interface ViewToggleProps {
  view: View;
  onViewChange: (view: View) => void;
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  const { t } = useAppTranslation();

  return (
    <RNView>
      <RNView className="flex-row">
        {VIEWS.map((v) => {
          const active = v === view;
          return (
            <Pressable
              key={v}
              onPress={() => onViewChange(v)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              testID={`view-toggle-${v}`}
              className="relative flex-1 items-center py-3"
            >
              <Text
                numberOfLines={1}
                className={[
                  'text-[12px] tracking-[2px] uppercase',
                  active ? 'font-medium text-ink' : 'font-ui text-muted',
                ].join(' ')}
              >
                {t(`grid.toggle.${v}`)}
              </Text>
              {active && (
                <RNView
                  className="absolute bottom-0 h-[0.5px] w-[18px] bg-ink"
                />
              )}
            </Pressable>
          );
        })}
      </RNView>
      <Hairline />
    </RNView>
  );
}
