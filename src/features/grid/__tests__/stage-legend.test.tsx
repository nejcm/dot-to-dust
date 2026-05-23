import { fireEvent, render, screen } from '@testing-library/react-native';

import { StageLegend } from '../components/stage-legend';

describe('stage legend', () => {
  it('toggles between compact and expanded states', () => {
    render(<StageLegend />);

    const toggle = screen.getByTestId('stage-legend-toggle');

    expect(toggle).toHaveProp('accessibilityState', { expanded: false });
    expect(screen.queryByText('0–11')).toBeNull();

    fireEvent.press(toggle);

    expect(toggle).toHaveProp('accessibilityState', { expanded: true });
    expect(screen.getByText('0–11')).toBeTruthy();
    expect(screen.getByText('60–80')).toBeTruthy();

    fireEvent.press(toggle);

    expect(toggle).toHaveProp('accessibilityState', { expanded: false });
    expect(screen.queryByText('0–11')).toBeNull();
  });
});
