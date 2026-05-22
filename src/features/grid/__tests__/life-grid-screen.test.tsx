import { fireEvent, render, screen } from '@testing-library/react-native';
import { Redirect } from 'expo-router';
import { View } from 'react-native';
import { withTiming } from 'react-native-reanimated';

import { usePreferencesStore } from '@/lib/storage/preferences-store';

import { LifeGridScreen } from '../screens/life-grid-screen';

jest.mock('expo-router', () => ({
  Redirect: jest.fn(() => null),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: jest.fn(() => ({ top: 0, right: 0, bottom: 0, left: 0 })),
}));

jest.mock('@/features/grid/components/life-grid', () => ({
  LifeGrid: jest.fn(({ view }: { view: string }) => {
    const { Text } = require('react-native');
    return <Text testID="life-grid">{view}</Text>;
  }),
}));

function renderLifeGridScreen(onOpenSettings = jest.fn()) {
  const view = render(<LifeGridScreen onOpenSettings={onOpenSettings} />);
  const layoutTarget = view.UNSAFE_getAllByType(View).find(
    (node) => node.props.className === 'flex-1' && typeof node.props.onLayout === 'function',
  );

  fireEvent(layoutTarget!, 'layout', {
    nativeEvent: { layout: { width: 320, height: 480 } },
  });

  return view;
}

describe('life grid screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    usePreferencesStore.setState({
      dob: '1990-01-01',
      theme: 'system',
      defaultView: 'weeks',
    });
  });

  it('does not animate when pressing the active view', () => {
    renderLifeGridScreen();

    fireEvent.press(screen.getByText('Weeks'));

    expect(withTiming).not.toHaveBeenCalled();
    expect(screen.getByTestId('life-grid')).toHaveTextContent('weeks');
  });

  it('updates the displayed grid after the view transition completes', () => {
    renderLifeGridScreen();

    fireEvent.press(screen.getByText('Months'));

    expect(withTiming).toHaveBeenCalled();
    expect(screen.getByTestId('life-grid')).toHaveTextContent('months');
  });

  it('opens settings through the route callback', () => {
    const onOpenSettings = jest.fn();
    renderLifeGridScreen(onOpenSettings);

    fireEvent.press(screen.getByTestId('settings-button'));

    expect(onOpenSettings).toHaveBeenCalledTimes(1);
  });

  it('redirects to onboarding when date of birth is missing', () => {
    usePreferencesStore.setState({
      dob: null,
      theme: 'system',
      defaultView: 'weeks',
    });

    render(<LifeGridScreen onOpenSettings={jest.fn()} />);

    expect(Redirect).toHaveBeenCalledWith({ href: '/(onboarding)' }, undefined);
    expect(screen.queryByTestId('main-screen')).toBeNull();
  });
});
