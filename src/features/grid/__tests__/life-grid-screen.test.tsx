import { fireEvent, render, screen } from '@testing-library/react-native';
import { Redirect } from 'expo-router';
import { View } from 'react-native';

import { usePreferencesStore } from '@/lib/storage/preferences-store';

import { LifeGridScreen } from '../screens/life-grid-screen';

jest.mock('expo-router', () => ({
  Redirect: jest.fn(() => null),
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: require('react-native').View,
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
    (node) => node.props.className?.includes('flex-1') && typeof node.props.onLayout === 'function',
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

  it('does not render view controls on the grid screen', () => {
    renderLifeGridScreen();

    expect(screen.queryByText('Weeks')).toBeNull();
    expect(screen.queryByText('Months')).toBeNull();
    expect(screen.queryByText('Years')).toBeNull();
    expect(screen.getByTestId('life-grid')).toHaveTextContent('weeks');
  });

  it('renders the inline header count and total', () => {
    renderLifeGridScreen();

    expect(screen.getByTestId('inline-header')).toBeTruthy();
    expect(screen.getByTestId('headline-lived')).toBeTruthy();
    expect(screen.getByText(/of 4[,.]160/)).toBeTruthy();
  });

  it('renders the stored default view', () => {
    usePreferencesStore.setState({
      dob: '1990-01-01',
      theme: 'system',
      defaultView: 'months',
    });

    renderLifeGridScreen();

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
