import { fireEvent, render, screen } from '@testing-library/react-native';

import { usePreferencesStore } from '@/lib/storage/preferences-store';
import { DefaultViewRow } from './default-view-row';
import { DobRow } from './dob-row';
import { ThemeRow } from './theme-row';

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
});
