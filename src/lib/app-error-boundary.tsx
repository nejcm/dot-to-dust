import * as SplashScreen from 'expo-splash-screen';
import * as React from 'react';
import { View } from 'react-native';

import { useAppTranslation } from '@/lib/i18n/use-translation';
import { PrimaryButton } from '@/lib/theme/components/primary-button';
import { Text } from '@/lib/theme/components/text';

type Props = {
  children: React.ReactNode;
};

type State = {
  error: Error | null;
};

function ErrorFallback({ onRetry }: { onRetry: () => void }) {
  const { t } = useAppTranslation();

  return (
    <View className="flex-1 items-center justify-center bg-bg p-8">
      <Text variant="displayM" tone="ink" className="text-center">
        {t('errors.title')}
      </Text>
      <Text variant="meta" tone="muted" className="mt-3 mb-6 text-center">
        {t('errors.description')}
      </Text>
      <PrimaryButton onPress={onRetry} testID="app-error-retry">
        {t('errors.retry')}
      </PrimaryButton>
    </View>
  );
}

export class AppErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('[AppErrorBoundary]', error, errorInfo.componentStack);
    SplashScreen.hideAsync().catch(() => {});
  }

  handleRetry = (): void => {
    this.setState({ error: null });
  };

  render(): React.ReactNode {
    if (this.state.error) {
      return <ErrorFallback onRetry={this.handleRetry} />;
    }

    return this.props.children;
  }
}
