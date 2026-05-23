import type { PressableProps } from 'react-native';
import { Pressable, Text } from 'react-native';

import { cn } from 'tailwind-variants';
import { getPressedStyle } from '../utils/get-pressed-style';

interface GhostButtonProps extends PressableProps {
  onPress: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  testID?: string;
}

export function GhostButton({ onPress, children, disabled, testID, className, ...rest }: GhostButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      testID={testID}
      accessibilityRole="button"
      role="button"
      className={cn('min-h-12 flex-row items-center justify-center rounded-pill px-6 py-3', className)}
      style={getPressedStyle}
      {...rest}
    >
      {typeof children === 'string'
        ? (
            <Text
              className={[
                'text-[15px] font-medium tracking-[0.2px]',
                disabled ? 'text-faint' : 'text-ink-soft',
              ].join(' ')}
              numberOfLines={1}
            >
              {children}
            </Text>
          )
        : children}
    </Pressable>
  );
}
