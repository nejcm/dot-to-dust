import { render, screen } from '@testing-library/react-native';
import { useReducedMotion as useReanimatedReducedMotion } from 'react-native-reanimated';

import { StageDustDots } from './stage-dust-dots';

describe('stage dust dots', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
    expect(screen.getByTestId('stage-dust-dots-particle-0-0', { includeHiddenElements: true })).toHaveStyle({
      left: 11.25,
      top: 11.25,
    });
  });

  it('renders static dots without particles when reduced motion is enabled', () => {
    jest.mocked(useReanimatedReducedMotion).mockReturnValue(true);

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
