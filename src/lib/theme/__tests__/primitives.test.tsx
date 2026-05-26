import { fireEvent, render, screen } from '@testing-library/react-native';

import { GhostButton } from '../components/ghost-button';
import { Hairline } from '../components/hairline';
import { Input } from '../components/input';
import { OutlineButton } from '../components/outline-button';
import { PrimaryButton } from '../components/primary-button';
import { Text } from '../components/text';

describe('text primitive', () => {
  it('renders children', () => {
    render(<Text>Hello</Text>);
    expect(screen.getByText('Hello')).toBeOnTheScreen();
  });

  it('renders with the default body variant', () => {
    render(<Text testID="t">Body text</Text>);
    expect(screen.getByTestId('t')).toHaveTextContent('Body text');
  });

  it('renders with the displayXl variant', () => {
    render(<Text variant="displayXl" testID="t">Big</Text>);
    expect(screen.getByTestId('t')).toHaveTextContent('Big');
  });

  it('renders with the default ink tone', () => {
    render(<Text testID="t">Text</Text>);
    expect(screen.getByTestId('t')).toHaveTextContent('Text');
  });

  it('renders with the muted tone', () => {
    render(<Text tone="muted" testID="t">Text</Text>);
    expect(screen.getByTestId('t')).toHaveTextContent('Text');
  });

  it('renders with global font utility classes', () => {
    render(<Text className="font-ui font-medium" testID="t">Text</Text>);
    expect(screen.getByTestId('t')).toHaveTextContent('Text');
  });

  it('renders with global compound font utility classes', () => {
    render(<Text className="font-display font-medium" testID="t">Text</Text>);
    expect(screen.getByTestId('t')).toHaveTextContent('Text');
  });

  it('renders with global bold utility classes', () => {
    render(<Text className="font-ui font-bold" testID="t">Text</Text>);
    expect(screen.getByTestId('t')).toHaveTextContent('Text');
  });
});

describe('primaryButton primitive', () => {
  it('renders label', () => {
    render(<PrimaryButton onPress={() => {}}>Confirm</PrimaryButton>);
    expect(screen.getByText('Confirm')).toBeOnTheScreen();
  });

  it('has button accessibility role', () => {
    render(<PrimaryButton onPress={() => {}} testID="btn">Go</PrimaryButton>);
    expect(screen.getByRole('button')).toBeOnTheScreen();
  });

  it('renders the default size label', () => {
    render(<PrimaryButton onPress={() => {}} testID="btn">Go</PrimaryButton>);

    expect(screen.getByTestId('btn')).toBeOnTheScreen();
    expect(screen.getByTestId('btn-label')).toHaveTextContent('Go');
  });

  it('renders a loading state', () => {
    render(<PrimaryButton onPress={() => {}} loading size="lg" testID="btn">Go</PrimaryButton>);

    expect(screen.getByTestId('btn').props.accessibilityState).toMatchObject({
      busy: true,
      disabled: true,
    });
    expect(screen.getByTestId('btn-activity-indicator')).toBeOnTheScreen();
  });
});

describe('ghostButton primitive', () => {
  it('renders label', () => {
    render(<GhostButton onPress={() => {}}>Cancel</GhostButton>);
    expect(screen.getByText('Cancel')).toBeOnTheScreen();
  });

  it('has button accessibility role', () => {
    render(<GhostButton onPress={() => {}} testID="btn">Skip</GhostButton>);
    expect(screen.getByRole('button')).toBeOnTheScreen();
  });

  it('renders a small size label', () => {
    render(<GhostButton onPress={() => {}} size="sm" testID="btn">Skip</GhostButton>);

    expect(screen.getByTestId('btn')).toBeOnTheScreen();
    expect(screen.getByTestId('btn-label')).toHaveTextContent('Skip');
  });
});

describe('outlineButton primitive', () => {
  it('renders label', () => {
    render(<OutlineButton onPress={() => {}}>More</OutlineButton>);
    expect(screen.getByText('More')).toBeOnTheScreen();
  });

  it('renders a large size label', () => {
    render(<OutlineButton onPress={() => {}} size="lg" testID="btn">More</OutlineButton>);

    expect(screen.getByTestId('btn')).toBeOnTheScreen();
    expect(screen.getByTestId('btn-label')).toHaveTextContent('More');
  });
});

describe('input primitive', () => {
  it('renders a label and value', () => {
    render(<Input label="Date" value="1990-01-01" testID="input" />);

    expect(screen.getByTestId('input-label')).toHaveTextContent('Date');
    expect(screen.getByDisplayValue('1990-01-01')).toBeOnTheScreen();
  });

  it('renders a large input', () => {
    render(<Input size="lg" testID="input" />);

    expect(screen.getByTestId('input')).toBeOnTheScreen();
  });

  it('marks disabled inputs as inaccessible for editing', () => {
    render(<Input disabled testID="input" />);

    expect(screen.getByTestId('input').props.editable).toBe(false);
    expect(screen.getByTestId('input').props.accessibilityState).toMatchObject({
      disabled: true,
    });
  });

  it('marks read-only inputs as disabled for accessibility', () => {
    render(<Input editable={false} testID="input" />);

    expect(screen.getByTestId('input').props.editable).toBe(false);
    expect(screen.getByTestId('input').props.accessibilityState).toMatchObject({
      disabled: true,
    });
  });

  it('keeps error text while focused', () => {
    render(<Input error="Invalid" testID="input" />);

    fireEvent(screen.getByTestId('input'), 'focus');

    expect(screen.getByText('Invalid')).toBeOnTheScreen();
  });
});

describe('hairline primitive', () => {
  it('renders a view', () => {
    render(<Hairline testID="line" />);
    expect(screen.getByTestId('line')).toBeOnTheScreen();
  });
});
