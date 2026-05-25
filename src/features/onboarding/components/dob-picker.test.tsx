import { fireEvent, render, screen } from '@testing-library/react-native';
import { Platform } from 'react-native';

import { DobPicker } from './dob-picker';

const originalOS = Platform.OS;

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: require('react-native').View,
}));

jest.mock('@react-native-community/datetimepicker', () => ({
  __esModule: true,
  default: jest.fn(({ onChange }) => {
    const { Pressable, Text } = require('react-native');

    return (
      <Pressable
        testID="onboarding-native-dob-picker"
        onPress={() => onChange({ type: 'set' }, new Date(2001, 4, 3))}
      >
        <Text>Date picker</Text>
      </Pressable>
    );
  }),
}));

function setPlatformOS(os: typeof Platform.OS) {
  Object.defineProperty(Platform, 'OS', {
    configurable: true,
    get: () => os,
  });
}

describe('dob picker', () => {
  afterEach(() => {
    setPlatformOS(originalOS);
  });

  it('confirms a civil date string', () => {
    const onConfirm = jest.fn();
    render(<DobPicker onConfirm={onConfirm} initialDob="1990-01-01" />);

    fireEvent.press(screen.getByTestId('onboarding-native-dob-picker'));
    fireEvent.press(screen.getByTestId('onboarding-dob-done'));

    expect(onConfirm).toHaveBeenCalledWith('2001-05-03');
  });

  it('sets a civil date string from the web input', () => {
    setPlatformOS('web');
    const onConfirm = jest.fn();

    render(<DobPicker onConfirm={onConfirm} initialDob="1990-01-01" />);
    fireEvent(screen.getByTestId('onboarding-web-dob-input'), 'change', {
      nativeEvent: { text: '2001-05-03' },
    });
    fireEvent.press(screen.getByTestId('onboarding-dob-done'));

    expect(onConfirm).toHaveBeenCalledWith('2001-05-03');
  });

  it('renders the Android date field', () => {
    setPlatformOS('android');

    render(<DobPicker onConfirm={() => {}} initialDob="1990-01-01" />);

    expect(screen.getByTestId('onboarding-dob-field')).toBeOnTheScreen();
  });
});
