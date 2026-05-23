import type { ReactNode } from 'react';

import { render } from '@testing-library/react-native';
import { Text } from 'react-native';

import AppLayout from '@/app/(app)/_layout';

interface TabsProps {
  children?: ReactNode;
  screenOptions?: unknown;
}

interface TabsScreenProps {
  name: string;
}

const mockTabsScreen = jest.fn((_props: TabsScreenProps) => null);
const mockTabs = jest.fn(({ children }: TabsProps) => (
  <>
    <Text testID="app-tabs" />
    {children}
  </>
));

jest.mock('expo-router', () => ({
  Tabs: Object.assign(
    (props: TabsProps) => mockTabs(props),
    { Screen: (props: TabsScreenProps) => mockTabsScreen(props) },
  ),
}));

describe('app layout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('keeps app routes in a hidden frozen tab navigator', () => {
    render(<AppLayout />);

    expect(mockTabs).toHaveBeenCalledWith(
      expect.objectContaining({
        screenOptions: {
          freezeOnBlur: true,
          headerShown: false,
          tabBarStyle: { display: 'none' },
        },
      }),
    );
    expect(mockTabsScreen).toHaveBeenCalledWith({ name: 'index' });
    expect(mockTabsScreen).toHaveBeenCalledWith({ name: 'settings' });
  });
});
