import { Pressable, Text } from 'react-native';

interface PrimaryButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  full?: boolean;
  testID?: string;
}

export function PrimaryButton({ onPress, children, disabled, full, testID }: PrimaryButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      testID={testID}
      accessibilityRole="button"
      className={[
        'min-h-12 items-center justify-center rounded-pill px-8 py-[17px]',
        disabled ? 'bg-faint' : 'bg-ink',
        full ? 'self-stretch' : 'self-center',
      ].join(' ')}
      style={({ pressed }) => pressed && { opacity: 0.75 }}
    >
      <Text
        className={[
          'text-[14px] font-medium tracking-[1.4px] uppercase',
          disabled ? 'text-muted' : 'text-bg',
        ].join(' ')}
        numberOfLines={1}
      >
        {children}
      </Text>
    </Pressable>
  );
}
