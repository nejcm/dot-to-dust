import { fireEvent, render, screen } from '@testing-library/react-native';

import { DobPicker } from './dob-picker';

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

describe('dob picker', () => {
  it('confirms a civil date string', () => {
    const onConfirm = jest.fn();
    render(<DobPicker onConfirm={onConfirm} initialDob="1990-01-01" />);

    fireEvent.press(screen.getByTestId('onboarding-native-dob-picker'));
    fireEvent.press(screen.getByTestId('onboarding-dob-done'));

    expect(onConfirm).toHaveBeenCalledWith('2001-05-03');
  });
});
