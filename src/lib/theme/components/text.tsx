import type { TextProps as RNTextProps } from 'react-native';
import type { FontVariant } from '../typography';
import * as React from 'react';
import { Text as RNText } from 'react-native';
import { cn } from 'tailwind-variants';

export type TextTone = 'ink' | 'inkSoft' | 'muted' | 'faint' | 'accent';

const VARIANT_CLASS_NAMES: Record<FontVariant, string> = {
  displayXl: 'font-display text-[44px] font-light leading-[52px] tracking-[-0.5px]',
  displayL: 'font-display text-[32px] font-light leading-10 tracking-[-0.3px]',
  displayM: 'font-display-regular text-[22px] font-normal leading-7 tracking-[-0.2px]',
  body: 'font-ui text-[17px] font-normal leading-6 tracking-0',
  meta: 'font-ui text-[13px] font-normal leading-[18px] tracking-[0.1px]',
  eyebrow: 'font-ui text-[11px] font-medium leading-4 tracking-[1.5px]',
  micro: 'font-ui text-[10px] font-normal leading-[14px] tracking-[0.2px]',
};

const TONE_CLASS_NAMES: Record<TextTone, string> = {
  ink: 'text-ink',
  inkSoft: 'text-ink-soft',
  muted: 'text-muted',
  faint: 'text-faint',
  accent: 'text-accent',
};

interface TextProps extends RNTextProps {
  variant?: FontVariant;
  tone?: TextTone;
  className?: string;
}

export function Text({
  variant = 'body',
  tone = 'ink',
  children,
  style,
  className,
  ...props
}: TextProps) {
  const textClassName = React.useMemo(
    () => cn(VARIANT_CLASS_NAMES[variant], TONE_CLASS_NAMES[tone], className),
    [className, tone, variant],
  );

  return (
    <RNText
      className={textClassName}
      style={style}
      {...props}
    >
      {children}
    </RNText>
  );
}
