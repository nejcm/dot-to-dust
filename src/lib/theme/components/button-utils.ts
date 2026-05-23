import type { ActivityIndicatorProps } from 'react-native';

export type ButtonSize = 'sm' | 'md' | 'lg';

export function getButtonIndicatorSize(size: ButtonSize): ActivityIndicatorProps['size'] {
  return size === 'lg' ? 'large' : 'small';
}
