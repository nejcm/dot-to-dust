import type { StageIndex } from '@/features/grid/lib/stages';

import { formatHex, parse } from 'culori';

export interface ColorTokens {
  bg: string;
  surface: string;
  surfaceAlt: string;
  ink: string;
  inkSoft: string;
  muted: string;
  faint: string;
  hairline: string;
  stages: readonly [string, string, string, string, string];
  future: string;
  ring: string;
  accent: string;
}

export interface SkiaTokens {
  stages: readonly [string, string, string, string, string];
  future: string;
  ring: string;
  accent: string;
}

export function toHex(oklch: string): string {
  const color = parse(oklch);
  if (!color) throw new Error(`culori: cannot parse "${oklch}"`);
  return formatHex(color) ?? '#000000';
}

export function toSkia(tokens: ColorTokens): SkiaTokens {
  return {
    stages: tokens.stages.map(toHex) as unknown as readonly [string, string, string, string, string],
    future: toHex(tokens.future),
    ring: toHex(tokens.ring),
    accent: toHex(tokens.accent),
  };
}

export const lightTokens: ColorTokens = {
  bg: 'oklch(0.962 0.008 75)',
  surface: 'oklch(0.985 0.005 75)',
  surfaceAlt: 'oklch(0.945 0.008 72)',
  ink: 'oklch(0.225 0.012 50)',
  inkSoft: 'oklch(0.40 0.010 55)',
  muted: 'oklch(0.58 0.008 60)',
  faint: 'oklch(0.66 0.006 70)',
  hairline: 'oklch(0.88 0.008 70)',
  stages: [
    'oklch(0.842 0.072 82)',
    'oklch(0.720 0.075 58)',
    'oklch(0.598 0.082 38)',
    'oklch(0.478 0.075 25)',
    'oklch(0.360 0.058 20)',
  ],
  future: 'oklch(0.905 0.006 75)',
  ring: 'oklch(0.225 0.012 50)',
  accent: 'oklch(0.48 0.075 28)',
};

export const darkTokens: ColorTokens = {
  bg: 'oklch(0.155 0.008 50)',
  surface: 'oklch(0.195 0.008 50)',
  surfaceAlt: 'oklch(0.235 0.008 50)',
  ink: 'oklch(0.915 0.012 75)',
  inkSoft: 'oklch(0.78 0.010 70)',
  muted: 'oklch(0.58 0.010 65)',
  faint: 'oklch(0.40 0.008 60)',
  hairline: 'oklch(0.28 0.008 55)',
  stages: [
    'oklch(0.795 0.075 82)',
    'oklch(0.700 0.078 58)',
    'oklch(0.605 0.082 38)',
    'oklch(0.530 0.075 25)',
    'oklch(0.460 0.058 20)',
  ],
  future: 'oklch(0.275 0.006 60)',
  ring: 'oklch(0.915 0.012 75)',
  accent: 'oklch(0.78 0.075 70)',
};

export type { StageIndex };
