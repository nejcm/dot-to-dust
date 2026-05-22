import { Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { render, screen } from './test-utils';

function InsetsProbe() {
  const insets = useSafeAreaInsets();
  return <Text>{`top:${insets.top}`}</Text>;
}

describe('test-utils render', () => {
  it('provides stable safe area metrics', () => {
    render(<InsetsProbe />);

    expect(screen.getByText('top:0')).toBeOnTheScreen();
  });
});
