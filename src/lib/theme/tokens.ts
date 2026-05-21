export interface ColorTokens {
  bg: string;
  text: string;
  stages: readonly [string, string, string, string, string];
  dotFuture: string;
  accent: string;
}

export const lightTokens: ColorTokens = {
  bg: 'oklch(97% 0.01 80)',
  text: 'oklch(22% 0.02 80)',
  stages: [
    'oklch(35% 0.08 55)',
    'oklch(45% 0.10 52)',
    'oklch(55% 0.12 48)',
    'oklch(65% 0.10 55)',
    'oklch(75% 0.08 60)',
  ],
  dotFuture: 'oklch(90% 0.005 80)',
  accent: 'oklch(55% 0.18 30)',
};

export const darkTokens: ColorTokens = {
  bg: 'oklch(12% 0.01 80)',
  text: 'oklch(92% 0.01 80)',
  stages: [
    'oklch(45% 0.08 55)',
    'oklch(55% 0.10 52)',
    'oklch(65% 0.12 48)',
    'oklch(73% 0.10 55)',
    'oklch(82% 0.08 60)',
  ],
  dotFuture: 'oklch(22% 0.008 80)',
  accent: 'oklch(62% 0.18 30)',
};

export type StageIndex = 0 | 1 | 2 | 3 | 4;
