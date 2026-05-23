import type { ReactNode } from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { router } from 'expo-router';
import { Platform } from 'react-native';

import { usePreferencesStore } from '@/lib/storage/preferences-store';
import { DefaultViewRow } from './default-view-row';
import { DevRows } from './dev-rows';
import { DobRow } from './dob-row';
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

jest.mock('@react-native-picker/picker', () => {
  const { Pressable, Text } = require('react-native');

  interface MockPickerProps {
    children?: ReactNode;
    dropdownIconColor?: unknown;
    itemStyle?: unknown;
    mode?: unknown;
    numberOfLines?: unknown;
    onValueChange?: (value: string, index: number) => void;
    prompt?: unknown;
    selectedValue?: unknown;
    selectionColor?: unknown;
    style?: unknown;
    testID?: string;
  }

  interface MockPickerItemProps {
    label: string;
    testID?: string;
  }

  const Picker = ({ children, onValueChange, testID, ...props }: MockPickerProps) => (
    <Pressable {...props} onValueChange={onValueChange} testID={testID}>
      {children}
    </Pressable>
  );

  Picker.Item = ({ label, testID }: MockPickerItemProps) => <Text testID={testID}>{label}</Text>;

  return { Picker };
});

const originalOS = Platform.OS;

function setPlatformOS(os: typeof Platform.OS) {
  Object.defineProperty(Platform, 'OS', {
    configurable: true,
    get: () => os,
  });
}

describe('settings rows', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setPlatformOS(originalOS);
    usePreferencesStore.setState({
      dob: '1990-01-01',
      theme: 'system',
      defaultView: 'weeks',
    });
  });

  it('updates the theme preference', () => {
    render(<ThemeRow />);

    fireEvent.press(screen.getByTestId('settings-theme-edit'));
    fireEvent(screen.getByTestId('settings-theme-picker'), 'valueChange', 'dark', 1);
    fireEvent.press(screen.getByText('Done'));

    expect(usePreferencesStore.getState().theme).toBe('dark');
    expect(screen.queryByText('Light')).toBeNull();
  });

  it('updates the theme preference from the Android picker dialog path', () => {
    setPlatformOS('android');
    render(<ThemeRow />);

    fireEvent.press(screen.getByTestId('settings-theme-edit'));
    fireEvent(screen.getByTestId('settings-theme-picker'), 'valueChange', 'dark', 1);

    expect(usePreferencesStore.getState().theme).toBe('dark');
    expect(screen.getByTestId('settings-theme-edit')).toBeTruthy();
    expect(screen.queryByText('Done')).toBeNull();
  });

  it('updates the default view preference', () => {
    render(<DefaultViewRow />);

    fireEvent.press(screen.getByTestId('settings-default-view-edit'));
    fireEvent(screen.getByTestId('settings-default-view-picker'), 'valueChange', 'months', 1);
    fireEvent.press(screen.getByText('Done'));

    expect(usePreferencesStore.getState().defaultView).toBe('months');
    expect(screen.queryByText('Years')).toBeNull();
  });

  it('omits native-only picker props on web', () => {
    setPlatformOS('web');
    render(<ThemeRow />);

    fireEvent.press(screen.getByTestId('settings-theme-edit'));

    expect(screen.getByTestId('settings-theme-picker').props).not.toMatchObject({
      numberOfLines: expect.anything(),
      selectionColor: expect.anything(),
    });
  });

  it('saves a changed date of birth', () => {
    render(<DobRow />);

    fireEvent.press(screen.getByLabelText('Edit'));
    fireEvent.press(screen.getByTestId('dob-picker'));
    fireEvent.press(screen.getByText('Done'));

    expect(usePreferencesStore.getState().dob).toBe('2001-05-03');
  });

  it('saves a changed date of birth from the web input', () => {
    setPlatformOS('web');
    render(<DobRow />);

    fireEvent.press(screen.getByLabelText('Edit'));
    fireEvent(screen.getByTestId('settings-web-dob-input'), 'change', {
      nativeEvent: { text: '2001-05-03' },
    });
    fireEvent.press(screen.getByText('Done'));

    expect(usePreferencesStore.getState().dob).toBe('2001-05-03');
  });

  it('opens onboarding again from the local dev action', () => {
    const preferences = {
      dob: usePreferencesStore.getState().dob,
      theme: usePreferencesStore.getState().theme,
      defaultView: usePreferencesStore.getState().defaultView,
    };

    render(<DevRows />);

    fireEvent.press(screen.getByTestId('settings-replay-onboarding'));

    expect(router.push).toHaveBeenCalledWith('/(onboarding)');
    expect(usePreferencesStore.getState()).toMatchObject(preferences);
  });

  it('hides onboarding replay outside local dev', () => {
    const originalDev = __DEV__;
    Object.defineProperty(globalThis, '__DEV__', { configurable: true, value: false });

    try {
      render(<DevRows />);

      expect(screen.queryByTestId('settings-replay-onboarding')).toBeNull();
    }
    finally {
      Object.defineProperty(globalThis, '__DEV__', { configurable: true, value: originalDev });
    }
  });
});
