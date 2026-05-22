import type { ScrollViewProps, ViewProps } from 'react-native';
import type { Edge } from 'react-native-safe-area-context';

import { cn } from 'tailwind-variants';

import { SafeAreaView, ScrollView, View } from './ui';

interface ScreenProps extends ViewProps {
  children: React.ReactNode;
  contentClassName?: string;
  edges?: Edge[];
}

interface ScreenScrollViewProps extends ScrollViewProps {
  children: React.ReactNode;
  contentContainerClassName?: string;
  edges?: Edge[];
}

const defaultEdges: Edge[] = ['top', 'bottom'];

export function Screen({
  children,
  className,
  contentClassName,
  edges = defaultEdges,
  ...props
}: ScreenProps) {
  return (
    <SafeAreaView edges={edges} className={cn('flex-1 bg-[--color-bg]', className)}>
      <View className={cn('flex-1', contentClassName)} {...props}>
        {children}
      </View>
    </SafeAreaView>
  );
}

export function ScreenScrollView({
  children,
  className,
  contentContainerClassName,
  edges = defaultEdges,
  showsVerticalScrollIndicator = false,
  ...props
}: ScreenScrollViewProps) {
  return (
    <SafeAreaView edges={edges} className={cn('flex-1 bg-[--color-bg]', className)}>
      <ScrollView
        className="flex-1"
        contentContainerClassName={contentContainerClassName}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        {...props}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}
