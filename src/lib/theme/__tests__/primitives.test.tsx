import { render, screen } from '@testing-library/react-native';

import { GhostButton } from '../components/ghost-button';
import { Hairline } from '../components/hairline';
import { PrimaryButton } from '../components/primary-button';
import { Text } from '../components/text';
import { lightTokens } from '../tokens';
import { typeScale } from '../typography';

describe('text primitive', () => {
  it('renders children', () => {
    render(<Text>Hello</Text>);
    expect(screen.getByText('Hello')).toBeOnTheScreen();
  });

  it('applies body variant by default', () => {
    render(<Text testID="t">Body text</Text>);
    const el = screen.getByTestId('t');
    expect(el.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ fontSize: typeScale.body.fontSize }),
      ]),
    );
  });

  it('applies displayXl variant', () => {
    render(<Text variant="displayXl" testID="t">Big</Text>);
    const el = screen.getByTestId('t');
    expect(el.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ fontSize: typeScale.displayXl.fontSize }),
      ]),
    );
  });

  it('applies ink tone color from tokens', () => {
    render(<Text testID="t">Text</Text>);
    const el = screen.getByTestId('t');
    expect(el.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ color: lightTokens.ink }),
      ]),
    );
  });

  it('applies muted tone color from tokens', () => {
    render(<Text tone="muted" testID="t">Text</Text>);
    const el = screen.getByTestId('t');
    expect(el.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ color: lightTokens.muted }),
      ]),
    );
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
});

describe('hairline primitive', () => {
  it('renders a view with hairline background color', () => {
    render(<Hairline testID="line" />);
    const el = screen.getByTestId('line');
    const flatStyle = Array.isArray(el.props.style)
      ? Object.assign({}, ...el.props.style)
      : el.props.style;
    expect(flatStyle.backgroundColor).toBe(lightTokens.hairline);
  });
});
