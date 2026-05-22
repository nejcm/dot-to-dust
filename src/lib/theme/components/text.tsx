import type { TextStyle } from 'react-native';
import type { FontVariant } from '../typography';

import { Text as RNText } from 'react-native';
import { typeScale } from '../typography';
import { useTheme } from '../use-theme';

export type TextTone = 'ink' | 'inkSoft' | 'muted' | 'faint' | 'accent';

interface TextProps {
  variant?: FontVariant;
  tone?: TextTone;
  children: React.ReactNode;
  style?: TextStyle;
  numberOfLines?: number;
  adjustsFontSizeToFit?: boolean;
  minimumFontScale?: number;
  testID?: string;
  accessibilityRole?: React.ComponentProps<typeof RNText>['accessibilityRole'];
  accessibilityLabel?: string;
}

export function Text({
  variant = 'body',
  tone = 'ink',
  children,
  style,
  numberOfLines,
  adjustsFontSizeToFit,
  minimumFontScale,
  testID,
  accessibilityRole,
  accessibilityLabel,
}: TextProps) {
  const { tokens } = useTheme();
  const scale = typeScale[variant];

  return (
    <RNText
      style={[
        {
          fontFamily: scale.fontFamily,
          fontSize: scale.fontSize,
          fontWeight: scale.fontWeight as TextStyle['fontWeight'],
          letterSpacing: scale.letterSpacing,
          lineHeight: scale.lineHeight,
          color: tokens[tone],
        },
        style,
      ]}
      numberOfLines={numberOfLines}
      adjustsFontSizeToFit={adjustsFontSizeToFit}
      minimumFontScale={minimumFontScale}
      testID={testID}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
    >
      {children}
    </RNText>
  );
}
