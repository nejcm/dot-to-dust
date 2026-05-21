import i18next from './index';

describe('i18n', () => {
  it('forces lng to English so plural rules match English-only resources', () => {
    expect(i18next.language).toBe('en');
    expect(i18next.resolvedLanguage).toBe('en');
  });

  describe('english plural rules', () => {
    it.each([
      [0, '0 weeks ahead'],
      [1, '1 week ahead'],
      [2, '2 weeks ahead'],
      [21, '21 weeks ahead'],
      [52, '52 weeks ahead'],
    ])('renders grid.headline.weeksAhead for count=%i as "%s"', (count, expected) => {
      expect(i18next.t('grid.headline.weeksAhead', { count })).toBe(expected);
    });

    it.each([
      [0, '+0 weeks'],
      [1, '+1 week'],
      [80, '+80 weeks'],
    ])('renders grid.headline.bonusWeeks for count=%i as "%s"', (count, expected) => {
      expect(i18next.t('grid.headline.bonusWeeks', { count })).toBe(expected);
    });
  });
});
