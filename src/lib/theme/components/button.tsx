import type {
  AccessibilityState,
  ActivityIndicatorProps,
  PressableProps,
  PressableStateCallbackType,
  StyleProp,
  TextProps,
  ViewStyle,
} from 'react-native';
import { ActivityIndicator, Pressable, Text } from 'react-native';

import { cn } from 'tailwind-variants';
import { getPressedStyle } from '../utils/get-pressed-style';

const baseCls = 'flex flex-row items-center justify-center px-4';

export interface ButtonProps extends Omit<PressableProps, 'children'> {
  children?: React.ReactNode;
  loading?: boolean;
  className?: string;
  textClassName?: string;
  textProps?: TextProps;
  indicatorClassName?: string;
  indicatorSize?: ActivityIndicatorProps['size'];
}

export function Button({
  accessibilityRole,
  accessibilityState,
  children,
  className,
  disabled = false,
  indicatorClassName = 'accent-ink',
  indicatorSize = 'small',
  loading = false,
  style,
  testID,
  textClassName,
  textProps,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const resolvedAccessibilityState: AccessibilityState = {
    ...accessibilityState,
    ...(isDisabled || accessibilityState?.disabled !== undefined
      ? { disabled: isDisabled || accessibilityState?.disabled }
      : {}),
    ...(loading || accessibilityState?.busy !== undefined
      ? { busy: loading || accessibilityState?.busy }
      : {}),
  };
  const content = children ?? props.accessibilityLabel;

  return (
    <Pressable
      accessibilityRole={accessibilityRole ?? 'button'}
      accessibilityState={resolvedAccessibilityState}
      className={cn(baseCls, className)}
      disabled={isDisabled || undefined}
      style={(state: PressableStateCallbackType) => getPressedStyle(
        state,
        typeof style === 'function' ? style(state) as StyleProp<ViewStyle> : style,
        !isDisabled,
      )}
      testID={testID}
      {...props}
    >
      {loading
        ? (
            <ActivityIndicator
              colorClassName={indicatorClassName}
              size={indicatorSize}
              testID={testID ? `${testID}-activity-indicator` : undefined}
            />
          )
        : typeof content === 'string' || typeof content === 'number'
          ? (
              <Text
                className={textClassName}
                numberOfLines={1}
                testID={testID ? `${testID}-label` : undefined}
                {...textProps}
              >
                {content}
              </Text>
            )
          : content}
    </Pressable>
  );
}
