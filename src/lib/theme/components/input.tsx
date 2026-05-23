import type { BlurEvent, FocusEvent, TextInputProps } from 'react-native';
import * as React from 'react';
import { I18nManager, StyleSheet, TextInput, View } from 'react-native';
import { cn, tv } from 'tailwind-variants';

import { Text } from './text';

export type InputSize = 'sm' | 'md' | 'lg';

const inputSizeVariants = {
  sm: {
    label: 'text-[10px] leading-[14px]',
    input: 'min-h-10 px-4 text-[15px] leading-5',
  },
  md: {
    label: 'text-[11px] leading-4',
    input: 'min-h-12 px-5 text-[17px] leading-6',
  },
  lg: {
    label: 'text-[12px] leading-4',
    input: 'min-h-14 px-6 text-[18px] leading-7',
  },
} as const;

const inputTv = tv({
  slots: {
    container: 'gap-2',
    label: 'font-ui text-eyebrow font-medium tracking-[1.5px] text-muted uppercase',
    input: 'rounded-pill border-[0.5px] border-hairline bg-transparent font-ui text-ink',
    error: 'font-ui text-eyebrow leading-4 text-accent',
  },
  variants: {
    size: inputSizeVariants,
    align: {
      start: {
        input: 'text-left',
      },
      center: {
        input: 'text-center',
      },
    },
    disabled: {
      true: {
        input: 'opacity-50',
      },
    },
    error: {
      true: {
        input: 'border-accent',
      },
    },
    focused: {
      true: {
        input: 'border-ink',
      },
    },
  },
  defaultVariants: {
    align: 'start',
    disabled: false,
    error: false,
    focused: false,
    size: 'md',
  },
});

interface InputProps extends Omit<TextInputProps, 'editable' | 'size'> {
  align?: 'start' | 'center';
  containerClassName?: string;
  disabled?: boolean;
  editable?: boolean;
  error?: string;
  label?: string;
  showErrorMessage?: boolean;
  size?: InputSize;
}

export function Input({
  accessibilityState,
  align = 'start',
  className,
  containerClassName,
  disabled = false,
  editable = true,
  error,
  label,
  onBlur,
  onFocus,
  placeholderTextColorClassName = 'accent-muted',
  showErrorMessage = true,
  size = 'md',
  style,
  testID,
  ...props
}: InputProps) {
  const [focused, setFocused] = React.useState(false);
  const styles = inputTv({
    align,
    disabled,
    error: Boolean(error),
    focused,
    size,
  });
  const isEditable = editable && !disabled;

  const handleBlur = (event: BlurEvent) => {
    setFocused(false);
    onBlur?.(event);
  };

  const handleFocus = (event: FocusEvent) => {
    setFocused(true);
    onFocus?.(event);
  };

  return (
    <View className={cn(styles.container(), containerClassName)}>
      {label && (
        <Text
          className={styles.label()}
          testID={testID ? `${testID}-label` : undefined}
        >
          {label}
        </Text>
      )}
      <TextInput
        accessibilityState={{
          ...accessibilityState,
          ...(disabled || accessibilityState?.disabled !== undefined
            ? { disabled: disabled || accessibilityState?.disabled }
            : {}),
        }}
        className={cn(styles.input(), className)}
        editable={isEditable}
        onBlur={handleBlur}
        onFocus={handleFocus}
        placeholderTextColorClassName={placeholderTextColorClassName}
        style={StyleSheet.flatten([
          { writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr' },
          style,
        ])}
        testID={testID}
        {...props}
      />
      {error && showErrorMessage && (
        <Text
          className={styles.error()}
          testID={testID ? `${testID}-error` : undefined}
        >
          {error}
        </Text>
      )}
    </View>
  );
}
