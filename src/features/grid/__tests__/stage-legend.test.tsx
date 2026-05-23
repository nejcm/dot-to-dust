import { fireEvent, render, screen } from '@testing-library/react-native';

import { StageLegend } from '../components/stage-legend';

describe('stage legend', () => {
  it('keeps compact items visible and labels truncatable', () => {
    render(<StageLegend />);

    const toggle = screen.getByTestId('stage-legend-toggle');

    expect(toggle.props.className).toEqual(expect.stringContaining('w-full'));
    for (const name of ['Formation', 'Emergence', 'Construction', 'Tenure', 'Twilight']) {
      const label = screen.getByText(name);
      expect(label).toHaveProp('ellipsizeMode', 'tail');
      expect(label).toHaveProp('numberOfLines', 1);
      expect(label.props.className).toEqual(expect.stringContaining('min-w-0'));
      expect(label.props.className).toEqual(expect.stringContaining('flex-1'));
    }
  });

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
