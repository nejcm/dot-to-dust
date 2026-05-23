import { View } from 'react-native';
import { Text } from './text';

type WordmarkSize = 9 | 10 | 12;

interface WordmarkProps {
  size?: WordmarkSize;
  className?: string;
}

const WORDMARK_SIZE_CLASSES: Record<WordmarkSize, string> = {
  9: 'text-[9px]',
  10: 'text-[10px]',
  12: 'text-[12px]',
};

const WORDMARK_TO_SIZE_CLASSES: Record<WordmarkSize, string> = {
  9: 'text-[11px]',
  10: 'text-[12px]',
  12: 'text-[14px]',
};

export function Wordmark({ size = 12, className }: WordmarkProps) {
  return (
    <View className="flex-row gap-0.5">
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
