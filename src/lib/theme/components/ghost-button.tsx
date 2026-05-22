import { Pressable, Text } from 'react-native';

import { radius, spacing } from '../spacing';
import { fontFamily } from '../typography';
import { useTheme } from '../use-theme';

interface GhostButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  testID?: string;
}

export function GhostButton({ onPress, children, disabled, testID }: GhostButtonProps) {
  const { tokens } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      testID={testID}
      accessibilityRole="button"
      style={({ pressed }) => ({
        backgroundColor: pressed ? tokens.surfaceAlt : 'transparent',
        borderRadius: radius.pill,
        borderWidth: 1,
        borderColor: disabled ? tokens.hairline : tokens.hairline,
        paddingHorizontal: spacing[6],
        paddingVertical: spacing[3],
        minHeight: 48,
        alignItems: 'center',
        justifyContent: 'center',
      })}
    >
      <Text
        style={{
          fontFamily: fontFamily.uiMedium,
          fontSize: 15,
          fontWeight: '500',
          letterSpacing: 0.2,
          color: disabled ? tokens.faint : tokens.inkSoft,
        }}
        numberOfLines={1}
      >
        {children}
      </Text>
    </Pressable>
  );
}
