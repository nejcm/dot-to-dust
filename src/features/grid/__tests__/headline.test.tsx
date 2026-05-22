import { render, screen } from '@testing-library/react-native';

import { Headline } from '../components/headline';
import { bonusUnitsAhead } from '../lib/life-math';

describe('headline', () => {
  it('uses the active view unit for remaining time', () => {
    render(<Headline view="months" dob="2000-01-01" today="2000-01-01" />);

    expect(screen.getByText('960 months ahead')).toBeOnTheScreen();
  });

  it('uses count-up copy in bonus time', () => {
    const count = bonusUnitsAhead('weeks', '1939-01-01', '2020-01-01');

    render(<Headline view="weeks" dob="1939-01-01" today="2020-01-01" />);

    expect(screen.getByText(`+${count} weeks`)).toBeOnTheScreen();
  });
});
