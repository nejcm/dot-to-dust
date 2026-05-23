import type { PressableProps } from 'react-native';
import type { ButtonSize } from './button-utils';

import { tv } from 'tailwind-variants';
import { Button } from './button';
import { getButtonIndicatorSize } from './button-utils';

const primaryButtonTv = tv({
  slots: {
    container: 'items-center justify-center rounded-pill',
    label: 'font-ui font-medium uppercase',
    indicator: 'accent-bg',
  },
  variants: {
    size: {
      sm: {
        container: 'min-h-10 px-6 py-3',
        label: 'text-[12px] tracking-[1.2px]',
      },
      md: {
        container: 'min-h-12 px-8 py-[17px]',
        label: 'text-[14px] tracking-[1.4px]',
      },
      lg: {
        container: 'min-h-14 px-10 py-5',
        label: 'text-[15px] tracking-[1.5px]',
      },
    },
    disabled: {
      true: {
        container: 'bg-faint',
        label: 'text-muted',
        indicator: 'accent-muted',
      },
      false: {
        container: 'bg-ink',
        label: 'text-bg',
      },
    },
    fullWidth: {
      true: {
        container: 'self-stretch',
      },
      false: {
        container: 'self-center',
      },
    },
  },
  defaultVariants: {
    disabled: false,
    fullWidth: false,
    size: 'md',
  },
});

interface PrimaryButtonProps extends Omit<PressableProps, 'children' | 'disabled'> {
  children: React.ReactNode;
  disabled?: boolean;
  full?: boolean;
  fullWidth?: boolean;
  loading?: boolean;
  onPress: NonNullable<PressableProps['onPress']>;
  size?: ButtonSize;
  testID?: string;
  textClassName?: string;
}

export function PrimaryButton({
  children,
  className,
  disabled = false,
  full,
  fullWidth,
  loading = false,
  size = 'md',
  testID,
  textClassName,
  ...props
}: PrimaryButtonProps) {
  const styles = primaryButtonTv({
    disabled: disabled || loading,
    fullWidth: fullWidth ?? full,
    size,
  });

  return (
    <Button
      className={styles.container({ className })}
      disabled={disabled}
      indicatorClassName={styles.indicator()}
      indicatorSize={getButtonIndicatorSize(size)}
      loading={loading}
      testID={testID}
      textClassName={styles.label({ className: textClassName })}
      {...props}
    >
      {children}
    </Button>
  );
}
