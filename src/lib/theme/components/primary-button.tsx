import { Pressable, Text } from 'react-native';

import { radius, spacing } from '../spacing';
import { fontFamily } from '../typography';
import { useTheme } from '../use-theme';

interface PrimaryButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  full?: boolean;
  testID?: string;
}

export function PrimaryButton({ onPress, children, disabled, full, testID }: PrimaryButtonProps) {
  const { tokens } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      testID={testID}
      accessibilityRole="button"
      style={({ pressed }) => ({
        backgroundColor: disabled ? tokens.faint : tokens.ink,
        opacity: pressed ? 0.75 : 1,
        borderRadius: radius.pill,
        paddingHorizontal: spacing[8],
        paddingVertical: 17,
        minHeight: 48,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: full ? 'stretch' : 'center',
      })}
    >
      <Text
        style={{
          fontFamily: fontFamily.uiMedium,
          fontSize: 14,
          letterSpacing: 1.4,
          textTransform: 'uppercase',
          color: disabled ? tokens.muted : tokens.bg,
        }}
        numberOfLines={1}
      >
        {children}
      </Text>
    </Pressable>
  );
}
