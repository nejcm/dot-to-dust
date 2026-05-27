import { render, screen } from '@testing-library/react-native';

import { Headline } from '../components/headline';
import { viewSpec } from '../lib/view-policy';

describe('headline', () => {
  it('shows eyebrow for active view', () => {
    render(<Headline view="months" dob="2000-01-01" today="2000-01-01" />);

    expect(screen.getByText('Months lived')).toBeTruthy();
  });

  it('shows lived count as the main number', () => {
    render(<Headline view="months" dob="2000-01-01" today="2000-01-01" />);

    // 0 months lived when dob === today
    expect(screen.getByTestId('headline-lived')).toBeTruthy();
  });

  it('shows remaining count in subline', () => {
    render(<Headline view="months" dob="2000-01-01" today="2000-01-01" />);

    expect(screen.getByText('960 months ahead · assuming 80 years')).toBeTruthy();
  });

  it('uses singular units in subline', () => {
    render(<Headline view="years" dob="2000-01-01" today="2079-01-01" />);

    expect(screen.getByText('1 year ahead · assuming 80 years')).toBeTruthy();
  });

  it('uses bonus eyebrow in bonus time', () => {
    render(<Headline view="weeks" dob="1939-01-01" today="2020-01-01" />);

    expect(screen.getByText('Weeks and counting')).toBeTruthy();
  });

  it('shows bonus count as main number in bonus time', () => {
    const count = viewSpec('weeks').bonusAhead('1939-01-01', '2020-01-01');

    render(<Headline view="weeks" dob="1939-01-01" today="2020-01-01" />);

    expect(screen.getByText(count.toLocaleString())).toBeTruthy();
  });

  it('hides subline in bonus time', () => {
    render(<Headline view="weeks" dob="1939-01-01" today="2020-01-01" />);

    expect(screen.queryByTestId('headline-subline')).toBeNull();
  });
});
