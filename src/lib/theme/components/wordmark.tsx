import { Text } from 'react-native';

import { fontFamily } from '../typography';
import { useTheme } from '../use-theme';

interface WordmarkProps {
  size?: number;
}

export function Wordmark({ size = 11 }: WordmarkProps) {
  const { tokens } = useTheme();

  return (
    <Text
      style={{
        fontFamily: fontFamily.uiMedium,
        fontSize: size,
        letterSpacing: 2.2,
        color: tokens.muted,
      }}
    >
      DOT
      {' '}
      <Text
        style={{
          fontFamily: fontFamily.displayItalic,
          fontSize: size + 2,
          letterSpacing: 0,
        }}
      >
        to
      </Text>
      {' '}
      DUST
    </Text>
  );
}
