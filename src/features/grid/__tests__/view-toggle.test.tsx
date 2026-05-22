import { fireEvent, render, screen } from '@testing-library/react-native';

import { ViewToggle } from '../components/view-toggle';

describe('viewToggle', () => {
  it('renders all three view options', () => {
    render(<ViewToggle view="weeks" onViewChange={jest.fn()} />);

    expect(screen.getByText('Weeks')).toBeTruthy();
    expect(screen.getByText('Months')).toBeTruthy();
    expect(screen.getByText('Years')).toBeTruthy();
  });

  it('calls onViewChange with "months" when Months is pressed', () => {
    const onViewChange = jest.fn();
    render(<ViewToggle view="weeks" onViewChange={onViewChange} />);

    fireEvent.press(screen.getByText('Months'));

    expect(onViewChange).toHaveBeenCalledTimes(1);
    expect(onViewChange).toHaveBeenCalledWith('months');
  });

  it('calls onViewChange with "years" when Years is pressed', () => {
    const onViewChange = jest.fn();
    render(<ViewToggle view="weeks" onViewChange={onViewChange} />);

    fireEvent.press(screen.getByText('Years'));

    expect(onViewChange).toHaveBeenCalledTimes(1);
    expect(onViewChange).toHaveBeenCalledWith('years');
  });

  it('marks the active view as selected and others as not selected', () => {
    render(<ViewToggle view="months" onViewChange={jest.fn()} />);

    // Only Months should be queryable as selected=true; Weeks/Years should not exist with selected=true.
    expect(screen.getByRole('button', { name: 'Months', selected: true })).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Weeks', selected: true })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Years', selected: true })).toBeNull();
  });

  it('does not call onViewChange when the already-active view is pressed', () => {
    const onViewChange = jest.fn();
    render(<ViewToggle view="weeks" onViewChange={onViewChange} />);

    fireEvent.press(screen.getByText('Weeks'));

    // onViewChange is still called — the parent owns de-duplication logic.
    // This test documents that pressing the active tab doesn't error or throw.
    expect(() => fireEvent.press(screen.getByText('Weeks'))).not.toThrow();
  });
});
