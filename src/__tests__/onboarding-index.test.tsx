import { fireEvent, render, screen } from '@testing-library/react-native';
import { router } from 'expo-router';

import WelcomeScreen from '@/app/(onboarding)';

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

jest.mock('@/features/onboarding/components/stage-dust-dots', () => ({
  StageDustDots: jest.fn(() => {
    const { View } = require('react-native');
    return <View testID="onboarding-stage-dust-dots" />;
  }),
}));

describe('onboarding welcome route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders stage dust dots and opens the date of birth step', () => {
    render(<WelcomeScreen />);

    expect(screen.getByTestId('onboarding-stage-dust-dots')).toBeOnTheScreen();

    fireEvent.press(screen.getByTestId('onboarding-begin'));

    expect(router.push).toHaveBeenCalledWith('/(onboarding)/dob');
  });
});
