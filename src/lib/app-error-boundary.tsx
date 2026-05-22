import * as SplashScreen from 'expo-splash-screen';
import * as React from 'react';
import { View } from 'react-native';

import { useAppTranslation } from '@/lib/i18n/use-translation';
import { PrimaryButton } from '@/lib/theme/components/primary-button';
import { Text } from '@/lib/theme/components/text';
import { spacing } from '@/lib/theme/spacing';
import { useTheme } from '@/lib/theme/use-theme';

type Props = {
  children: React.ReactNode;
};

type State = {
  error: Error | null;
};

function ErrorFallback({ onRetry }: { onRetry: () => void }) {
  const { t } = useAppTranslation();
  const { tokens } = useTheme();

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing[8],
        backgroundColor: tokens.bg,
      }}
    >
      <Text variant="displayM" tone="ink" style={{ textAlign: 'center' }}>
        {t('errors.title')}
      </Text>
      <Text variant="meta" tone="muted" style={{ marginTop: spacing[3], marginBottom: spacing[6], textAlign: 'center' }}>
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
