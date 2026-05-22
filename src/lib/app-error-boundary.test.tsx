import { fireEvent, render, screen } from '@testing-library/react-native';
import * as SplashScreen from 'expo-splash-screen';

import { AppErrorBoundary } from './app-error-boundary';

jest.mock('expo-splash-screen', () => ({
  hideAsync: jest.fn(() => Promise.resolve()),
}));

function BrokenComponent(): null {
  throw new Error('render failed');
}

function MaybeBrokenComponent({ shouldThrow }: { shouldThrow: boolean }): null {
  if (shouldThrow) throw new Error('render failed');
  return null;
}

function HealthyComponent() {
  return null;
}

describe('app error boundary', () => {
  let consoleError: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleError.mockRestore();
  });

  it('shows a translated fallback and hides the splash screen after a render error', () => {
    render(
      <AppErrorBoundary>
        <BrokenComponent />
      </AppErrorBoundary>,
    );

    expect(screen.getByText('Something went wrong.')).toBeOnTheScreen();
    expect(screen.getByText('Try again')).toBeOnTheScreen();
    expect(SplashScreen.hideAsync).toHaveBeenCalledTimes(1);
  });

  it('can reset to render children again', () => {
    let shouldThrow = true;
    const view = render(
      <AppErrorBoundary>
        <MaybeBrokenComponent shouldThrow={shouldThrow} />
      </AppErrorBoundary>,
    );

    shouldThrow = false;
    view.rerender(
      <AppErrorBoundary>
        <MaybeBrokenComponent shouldThrow={shouldThrow} />
      </AppErrorBoundary>,
    );
    fireEvent.press(screen.getByText('Try again'));

    expect(screen.queryByText('Something went wrong.')).toBeNull();
  });

  it('renders children when there is no error', () => {
    render(
      <AppErrorBoundary>
        <HealthyComponent />
      </AppErrorBoundary>,
    );

    expect(screen.queryByText('Something went wrong.')).toBeNull();
  });
});
