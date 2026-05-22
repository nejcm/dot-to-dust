import { fireEvent, render, screen } from '@testing-library/react-native';
import { router } from 'expo-router';

import AppIndex from '@/app/(app)';

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

jest.mock('@/features/grid/screens/life-grid-screen', () => ({
  LifeGridScreen: jest.fn(({ onOpenSettings }: { onOpenSettings: () => void }) => {
    const { Pressable } = require('react-native');
    return <Pressable testID="life-grid-screen" onPress={onOpenSettings} />;
  }),
}));

describe('app index', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('passes settings navigation to the life grid screen', () => {
    render(<AppIndex />);

    fireEvent.press(screen.getByTestId('life-grid-screen'));

    expect(router.push).toHaveBeenCalledWith('/(app)/settings');
  });
});
