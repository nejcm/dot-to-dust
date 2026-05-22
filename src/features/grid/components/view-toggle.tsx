import type { View } from '@/lib/view';

import { Pressable, View as RNView, Text } from 'react-native';

import { useAppTranslation } from '@/lib/i18n/use-translation';
import { Hairline } from '@/lib/theme/components/hairline';
import { fontFamily } from '@/lib/theme/typography';
import { useTheme } from '@/lib/theme/use-theme';
import { VIEWS } from '@/lib/view';

interface ViewToggleProps {
  view: View;
  onViewChange: (view: View) => void;
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  const { t } = useAppTranslation();
  const { tokens } = useTheme();

  return (
    <RNView>
      <RNView style={{ flexDirection: 'row' }}>
        {VIEWS.map((v) => {
          const active = v === view;
          return (
            <Pressable
              key={v}
              onPress={() => onViewChange(v)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              testID={`view-toggle-${v}`}
              style={{ flex: 1, alignItems: 'center', paddingVertical: 12, position: 'relative' }}
            >
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: active ? fontFamily.uiMedium : fontFamily.ui,
                  fontSize: 12,
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                  color: active ? tokens.ink : tokens.muted,
                }}
              >
                {t(`grid.toggle.${v}`)}
              </Text>
              {active && (
                <RNView
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    width: 18,
                    height: 0.5,
                    backgroundColor: tokens.ink,
                  }}
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
