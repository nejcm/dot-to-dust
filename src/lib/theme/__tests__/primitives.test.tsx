import { render, screen } from '@testing-library/react-native';

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

  it('applies body variant by default', () => {
    render(<Text testID="t">Body text</Text>);
    const el = screen.getByTestId('t');
    expect(el.props.className).toEqual(expect.stringContaining('text-[17px]'));
  });

  it('applies displayXl variant', () => {
    render(<Text variant="displayXl" testID="t">Big</Text>);
    const el = screen.getByTestId('t');
    expect(el.props.className).toEqual(expect.stringContaining('text-[44px]'));
  });

  it('applies ink tone color from tokens', () => {
    render(<Text testID="t">Text</Text>);
    const el = screen.getByTestId('t');
    expect(el.props.className).toEqual(expect.stringContaining('text-ink'));
  });

  it('applies muted tone color from tokens', () => {
    render(<Text tone="muted" testID="t">Text</Text>);
    const el = screen.getByTestId('t');
    expect(el.props.className).toEqual(expect.stringContaining('text-muted'));
  });

  it('leaves font-medium for the global font utility', () => {
    render(<Text className="font-ui font-medium" testID="t">Text</Text>);
    const el = screen.getByTestId('t');
    expect(el.props.className).toEqual(expect.stringContaining('font-medium'));
  });

  it('leaves display font-medium for the global compound utility', () => {
    render(<Text className="font-display font-medium" testID="t">Text</Text>);
    const el = screen.getByTestId('t');
    expect(el.props.className).toEqual(expect.stringContaining('font-display'));
    expect(el.props.className).toEqual(expect.stringContaining('font-medium'));
  });

  it('leaves font-bold for the global font utility', () => {
    render(<Text className="font-ui font-bold" testID="t">Text</Text>);
    const el = screen.getByTestId('t');
    expect(el.props.className).toEqual(expect.stringContaining('font-bold'));
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

  it('keeps the current md visual defaults', () => {
    render(<PrimaryButton onPress={() => {}} testID="btn">Go</PrimaryButton>);

    expect(screen.getByTestId('btn').props.className).toEqual(expect.stringContaining('min-h-12'));
    expect(screen.getByTestId('btn').props.className).toEqual(expect.stringContaining('px-8'));
    expect(screen.getByTestId('btn-label').props.className).toEqual(expect.stringContaining('text-[14px]'));
  });

  it('applies size variants and loading state', () => {
    render(<PrimaryButton onPress={() => {}} loading size="lg" testID="btn">Go</PrimaryButton>);

    expect(screen.getByTestId('btn').props.className).toEqual(expect.stringContaining('min-h-14'));
    expect(screen.getByTestId('btn').props.accessibilityState).toMatchObject({
      busy: true,
      disabled: true,
    });
    expect(screen.getByTestId('btn-activity-indicator').props.colorClassName).toEqual('accent-muted');
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

  it('applies shared size variants', () => {
    render(<GhostButton onPress={() => {}} size="sm" testID="btn">Skip</GhostButton>);

    expect(screen.getByTestId('btn').props.className).toEqual(expect.stringContaining('min-h-10'));
    expect(screen.getByTestId('btn-label').props.className).toEqual(expect.stringContaining('text-[14px]'));
  });
});

describe('outlineButton primitive', () => {
  it('renders label', () => {
    render(<OutlineButton onPress={() => {}}>More</OutlineButton>);
    expect(screen.getByText('More')).toBeOnTheScreen();
  });

  it('applies shared size variants', () => {
    render(<OutlineButton onPress={() => {}} size="lg" testID="btn">More</OutlineButton>);

    expect(screen.getByTestId('btn').props.className).toEqual(expect.stringContaining('min-h-14'));
    expect(screen.getByTestId('btn-label').props.className).toEqual(expect.stringContaining('text-[16px]'));
  });
});

describe('input primitive', () => {
  it('renders a label and value', () => {
    render(<Input label="Date" value="1990-01-01" testID="input" />);

    expect(screen.getByTestId('input-label')).toHaveTextContent('Date');
    expect(screen.getByDisplayValue('1990-01-01')).toBeOnTheScreen();
  });

  it('applies size variants', () => {
    render(<Input size="lg" testID="input" />);

    expect(screen.getByTestId('input').props.className).toEqual(expect.stringContaining('min-h-14'));
    expect(screen.getByTestId('input').props.className).toEqual(expect.stringContaining('text-[18px]'));
  });

  it('marks disabled inputs as inaccessible for editing', () => {
    render(<Input disabled testID="input" />);

    expect(screen.getByTestId('input').props.editable).toBe(false);
    expect(screen.getByTestId('input').props.accessibilityState).toMatchObject({
      disabled: true,
    });
  });
});

describe('hairline primitive', () => {
  it('renders a view with hairline classes', () => {
    render(<Hairline testID="line" />);
    const el = screen.getByTestId('line');
    expect(el.props.className).toEqual(expect.stringContaining('bg-hairline'));
  });
});
