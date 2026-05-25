import { fireEvent, render, screen } from '@testing-library/react-native';
import * as Linking from 'expo-linking';

import SettingsScreen from '@/app/(app)/settings';
import { config } from '@/config';

jest.mock('expo-router', () => ({
  router: {
    navigate: jest.fn(),
  },
}));

jest.mock('@/features/settings/components/default-view-row', () => ({
  DefaultViewRow: jest.fn(() => null),
}));

jest.mock('@/features/settings/components/dev-rows', () => ({
  DevRows: jest.fn(() => null),
}));

jest.mock('@/features/settings/components/dob-row', () => ({
  DobRow: jest.fn(() => null),
}));

jest.mock('@/features/settings/components/life-expectancy-row', () => ({
  LifeExpectancyRow: jest.fn(() => null),
}));

jest.mock('@/features/settings/components/theme-row', () => ({
  ThemeRow: jest.fn(() => null),
}));

describe('settings route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('gives the display title enough line height for native descenders', () => {
    render(<SettingsScreen />);

    expect(screen.getByText('Settings').props.className).toEqual(expect.stringContaining('text-[36px]/11'));
  });

  it('opens the settings support links', () => {
    jest.spyOn(Linking, 'openURL').mockResolvedValue(true);

    render(<SettingsScreen />);

    fireEvent.press(screen.getByTestId('settings-privacy'));
    fireEvent.press(screen.getByTestId('settings-bug-report'));
    fireEvent.press(screen.getByTestId('settings-support-me'));

    expect(Linking.openURL).toHaveBeenNthCalledWith(1, config.links.privacy);
    expect(Linking.openURL).toHaveBeenNthCalledWith(2, config.links.bugs);
    expect(Linking.openURL).toHaveBeenNthCalledWith(3, config.links.support);
  });
});
