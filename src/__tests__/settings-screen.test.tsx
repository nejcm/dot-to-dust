import { render, screen } from '@testing-library/react-native';

import SettingsScreen from '@/app/(app)/settings';

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
  it('gives the display title enough line height for native descenders', () => {
    render(<SettingsScreen />);

    expect(screen.getByText('Settings').props.className).toEqual(expect.stringContaining('leading-[44px]'));
  });
});
