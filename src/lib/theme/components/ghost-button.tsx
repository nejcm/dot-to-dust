import { Pressable, Text } from 'react-native';

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
      className="min-h-12 items-center justify-center rounded-pill border border-hairline px-6 py-3"
      style={({ pressed }) => ({
        backgroundColor: pressed ? tokens.surfaceAlt : 'transparent',
      })}
    >
      <Text
        className={[
          'text-[15px] font-medium tracking-[0.2px]',
          disabled ? 'text-faint' : 'text-ink-soft',
        ].join(' ')}
        numberOfLines={1}
      >
        {children}
      </Text>
    </Pressable>
  );
}
