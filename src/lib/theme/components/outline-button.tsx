import type { PressableProps } from 'react-native';
import type { ButtonSize } from './button-utils';

import { tv } from 'tailwind-variants';
import { Button } from './button';
import { getButtonIndicatorSize } from './button-utils';

const outlineButtonTv = tv({
  slots: {
    container: 'flex-row items-center justify-center rounded-pill border-[0.5px] bg-transparent',
    label: 'font-ui font-medium tracking-[0.2px]',
    indicator: 'accent-ink-soft',
  },
  variants: {
    size: {
      sm: {
        container: 'min-h-10 px-5 py-2.5',
        label: 'text-[14px]',
      },
      md: {
        container: 'min-h-12 px-6 py-3',
        label: 'text-[15px]',
      },
      lg: {
        container: 'min-h-14 px-8 py-4',
        label: 'text-[16px]',
      },
    },
    disabled: {
      true: {
        container: 'border-faint',
        label: 'text-faint',
        indicator: 'accent-faint',
      },
      false: {
        container: 'border-hairline',
        label: 'text-ink-soft',
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

interface OutlineButtonProps extends Omit<PressableProps, 'children' | 'disabled'> {
  children: React.ReactNode;
  disabled?: boolean;
  fullWidth?: boolean;
  loading?: boolean;
  onPress: NonNullable<PressableProps['onPress']>;
  size?: ButtonSize;
  testID?: string;
  textClassName?: string;
}

export function OutlineButton({
  children,
  className,
  disabled = false,
  fullWidth = false,
  loading = false,
  size = 'md',
  testID,
  textClassName,
  ...props
}: OutlineButtonProps) {
  const styles = outlineButtonTv({ disabled: disabled || loading, fullWidth, size });

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
