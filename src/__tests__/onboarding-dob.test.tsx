import { fireEvent, render, screen } from '@testing-library/react-native';
import { router } from 'expo-router';

import DobScreen from '@/app/(onboarding)/dob';
import { usePreferencesStore } from '@/lib/storage/preferences-store';

jest.mock('expo-router', () => ({
  router: {
    replace: jest.fn(),
    back: jest.fn(),
  },
}));

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

describe('onboarding dob route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    usePreferencesStore.setState({
      dob: null,
      theme: 'system',
      defaultView: 'weeks',
    });
  });

  it('saves the selected date of birth and enters the app', () => {
    render(<DobScreen />);

    fireEvent.press(screen.getByTestId('onboarding-native-dob-picker'));
    fireEvent.press(screen.getByTestId('onboarding-dob-done'));

    expect(usePreferencesStore.getState().dob).toBe('2001-05-03');
    expect(router.replace).toHaveBeenCalledWith('/(app)');
  });
});
