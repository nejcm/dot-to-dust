import { useIsFocused } from '@react-navigation/native';
import { render, screen } from '@testing-library/react-native';
import { useReducedMotion as useReanimatedReducedMotion } from 'react-native-reanimated';

import { StageDustDots } from './stage-dust-dots';

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useIsFocused: jest.fn(() => true),
}));

describe('stage dust dots', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(useIsFocused).mockReturnValue(true);
    jest.mocked(useReanimatedReducedMotion).mockReturnValue(false);
  });

  it('renders dust particles for each stage dot', () => {
    render(<StageDustDots testID="stage-dust-dots" />);

    expect(screen.getByTestId('stage-dust-dots', { includeHiddenElements: true })).toHaveProp(
      'accessibilityElementsHidden',
      true,
    );
    expect(stageDots()).toHaveLength(5);
    expect(dustParticles()).toHaveLength(145);
    expect(screen.getByTestId('stage-dust-dots-particle-0-0', { includeHiddenElements: true })).toBeOnTheScreen();
  });

  it('renders static dots without particles when reduced motion is enabled', () => {
    jest.mocked(useReanimatedReducedMotion).mockReturnValue(true);

    render(<StageDustDots testID="stage-dust-dots" />);

    expect(stageDots()).toHaveLength(5);
    expect(dustParticles()).toHaveLength(0);
  });

  it('renders static dots without particles when the screen is not focused', () => {
    jest.mocked(useIsFocused).mockReturnValue(false);

    render(<StageDustDots testID="stage-dust-dots" />);

    expect(stageDots()).toHaveLength(5);
    expect(dustParticles()).toHaveLength(0);
  });
});

function stageDots() {
  return Array.from({ length: 5 }, (_, index) =>
    screen.getByTestId(`stage-dust-dots-dot-${index}`, { includeHiddenElements: true }));
}

function dustParticles() {
  return Array.from({ length: 5 }, (_, dotIndex) =>
    Array.from({ length: 29 }, (_, particleIndex) =>
      screen.queryByTestId(
        `stage-dust-dots-particle-${dotIndex}-${particleIndex}`,
        { includeHiddenElements: true },
      ))).flat().filter(Boolean);
}
