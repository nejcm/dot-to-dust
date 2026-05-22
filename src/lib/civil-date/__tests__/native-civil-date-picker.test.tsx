import { fireEvent, render, screen } from '@testing-library/react-native';
import { Platform } from 'react-native';

import { formatCivilDateForDisplay } from '../index';
import { NativeCivilDatePicker } from '../native-civil-date-picker';

let mockEvent: { type: string };
let mockSelectedDate: Date | undefined;
const originalOS = Platform.OS;

jest.mock('@react-native-community/datetimepicker', () => ({
  __esModule: true,
  default: jest.fn((props) => {
    const { Pressable, Text } = require('react-native');

    return (
      <Pressable testID="native-date-picker" onPress={() => props.onChange(mockEvent, mockSelectedDate)}>
        <Text>{props.value.toISOString()}</Text>
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

describe('native civil date picker', () => {
  beforeEach(() => {
    mockEvent = { type: 'set' };
    mockSelectedDate = new Date(2001, 4, 3);
  });

  afterEach(() => {
    setPlatformOS(originalOS);
  });

  it('formats civil dates for display', () => {
    expect(formatCivilDateForDisplay('2001-05-03')).toBe('May 3, 2001');
  });

  it('emits civil strings on iOS changes', () => {
    setPlatformOS('ios');
    const onChange = jest.fn();

    render(<NativeCivilDatePicker value="1990-01-01" onChange={onChange} />);
    fireEvent.press(screen.getByTestId('native-date-picker'));

    expect(onChange).toHaveBeenCalledWith('2001-05-03');
  });

  it('emits civil strings and closes on Android set', () => {
    setPlatformOS('android');
    const onChange = jest.fn();
    const onAndroidClose = jest.fn();

    render(
      <NativeCivilDatePicker
        value="1990-01-01"
        onChange={onChange}
        onAndroidClose={onAndroidClose}
      />,
    );
    fireEvent.press(screen.getByTestId('native-date-picker'));

    expect(onAndroidClose).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('2001-05-03');
  });

  it('closes without changing on Android dismiss', () => {
    setPlatformOS('android');
    mockEvent = { type: 'dismissed' };
    mockSelectedDate = undefined;
    const onChange = jest.fn();
    const onAndroidClose = jest.fn();

    render(
      <NativeCivilDatePicker
        value="1990-01-01"
        onChange={onChange}
        onAndroidClose={onAndroidClose}
      />,
    );
    fireEvent.press(screen.getByTestId('native-date-picker'));

    expect(onAndroidClose).toHaveBeenCalledTimes(1);
    expect(onChange).not.toHaveBeenCalled();
  });
});
