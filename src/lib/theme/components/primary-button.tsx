import { Pressable, Text } from 'react-native';

import { radius, spacing } from '../spacing';
import { fontFamily } from '../typography';
import { useTheme } from '../use-theme';

interface PrimaryButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  testID?: string;
}

export function PrimaryButton({ onPress, children, disabled, testID }: PrimaryButtonProps) {
  const { tokens } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      testID={testID}
      accessibilityRole="button"
      style={({ pressed }) => ({
        backgroundColor: disabled ? tokens.faint : pressed ? tokens.surfaceAlt : tokens.accent,
        borderRadius: radius.pill,
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
          color: disabled ? tokens.muted : tokens.bg,
        }}
        numberOfLines={1}
      >
        {children}
      </Text>
    </Pressable>
  );
}
