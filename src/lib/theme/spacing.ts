export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  6: 24,
  8: 32,
  10: 40,
  14: 56,
} as const;

export type SpacingKey = keyof typeof spacing;

export const radius = {
  none: 0,
  xs: 2,
  md: 8,
  pill: 999,
} as const;

export type RadiusKey = keyof typeof radius;
