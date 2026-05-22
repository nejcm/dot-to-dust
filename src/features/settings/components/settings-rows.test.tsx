import { fireEvent, render, screen } from '@testing-library/react-native';
import { router } from 'expo-router';

import { usePreferencesStore } from '@/lib/storage/preferences-store';
import { DefaultViewRow } from './default-view-row';
import { DobRow } from './dob-row';
import { ReplayOnboardingRow } from './replay-onboarding-row';
import { ThemeRow } from './theme-row';

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

jest.mock('@react-native-community/datetimepicker', () => ({
  __esModule: true,
  default: jest.fn(({ onChange }) => {
    const { Pressable, Text } = require('react-native');

    return (
      <Pressable
        testID="dob-picker"
        onPress={() => onChange({ type: 'set' }, new Date(2001, 4, 3))}
      >
        <Text>Date picker</Text>
      </Pressable>
    );
  }),
}));

describe('settings rows', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    usePreferencesStore.setState({
      dob: '1990-01-01',
      theme: 'system',
      defaultView: 'weeks',
    });
  });

  it('updates the theme preference', () => {
    render(<ThemeRow />);

    fireEvent.press(screen.getByText('Dark'));

    expect(usePreferencesStore.getState().theme).toBe('dark');
  });

  it('updates the default view preference', () => {
    render(<DefaultViewRow />);

    fireEvent.press(screen.getByText('Months'));

    expect(usePreferencesStore.getState().defaultView).toBe('months');
  });

  it('saves a changed date of birth', () => {
    render(<DobRow />);

    fireEvent.press(screen.getByText('Edit'));
    fireEvent.press(screen.getByTestId('dob-picker'));
    fireEvent.press(screen.getByText('Done'));

    expect(usePreferencesStore.getState().dob).toBe('2001-05-03');
  });

  it('opens onboarding again from the local dev action', () => {
    const preferences = {
      dob: usePreferencesStore.getState().dob,
      theme: usePreferencesStore.getState().theme,
      defaultView: usePreferencesStore.getState().defaultView,
    };

    render(<ReplayOnboardingRow />);

    fireEvent.press(screen.getByTestId('settings-replay-onboarding'));

    expect(router.push).toHaveBeenCalledWith('/(onboarding)');
    expect(usePreferencesStore.getState()).toMatchObject(preferences);
  });

  it('hides onboarding replay outside local dev', () => {
    const originalDev = __DEV__;
    Object.defineProperty(globalThis, '__DEV__', { configurable: true, value: false });

    try {
      render(<ReplayOnboardingRow />);

      expect(screen.queryByTestId('settings-replay-onboarding')).toBeNull();
    }
    finally {
      Object.defineProperty(globalThis, '__DEV__', { configurable: true, value: originalDev });
    }
  });
});
