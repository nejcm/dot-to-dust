import { View } from 'react-native';
import { Text } from './text';

type WordmarkSize = 'sm' | 'md' | 'lg' | 'xl';

interface WordmarkProps {
  size?: WordmarkSize;
  className?: string;
}

const WORDMARK_SIZE_CLASSES: Record<WordmarkSize, string> = {
  sm: 'text-[10px]',
  md: 'text-[12px]',
  lg: 'text-[16px]',
  xl: 'text-[18px]',
};

const WORDMARK_TO_SIZE_CLASSES: Record<WordmarkSize, string> = {
  sm: 'text-[12px]',
  md: 'text-[14px]',
  lg: 'text-[18px]',
  xl: 'text-[20px]',
};

const GAP_SIZE: Record<WordmarkSize, string> = {
  sm: 'gap-0.25',
  md: 'gap-0.5',
  lg: 'gap-1',
  xl: 'gap-1',
};

export function Wordmark({ size = 'md', className }: WordmarkProps) {
  return (
    <View className={`flex-row items-end ${GAP_SIZE[size]}`}>
      <Text
        className={['font-medium tracking-widest text-muted', WORDMARK_SIZE_CLASSES[size], className].filter(Boolean).join(' ')}
      >
        DOT
      </Text>
      <Text
        className={['mr-px font-display-italic text-muted', WORDMARK_TO_SIZE_CLASSES[size]].join(' ')}
      >
        to
      </Text>
      <Text
        className={['font-medium tracking-widest text-muted', WORDMARK_SIZE_CLASSES[size], className].filter(Boolean).join(' ')}
      >
        DUST
      </Text>
    </View>
  );
}
