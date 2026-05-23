import type { StageIndex } from '../tokens';

/**
 * Maps a life-progress ratio [0, 1] to a stage index.
 *
 * Stage boundaries mirror the age thresholds in grid/lib/life-math.stageForWeek:
 *   age  0–11 → 0
 *   age 12–22 → 1
 *   age 23–39 → 2
 *   age 40–59 → 3
 *   age 60–80 → 4
 *
 * Useful for rendering stage colors in non-Skia contexts (legends, stat cards, etc.)
 * where `tokens.stages[stage]` returns the oklch string directly.
 *
 * @example
 * const stage = stageForRatio(weeksLived / WEEKS_TOTAL);
 * const color = tokens.stages[stage];
 */
export function stageForRatio(ratio: number): StageIndex {
  const age = Math.floor(Math.max(0, Math.min(1, ratio)) * 80);
  if (age < 12) return 0;
  if (age < 23) return 1;
  if (age < 40) return 2;
  if (age < 60) return 3;
  return 4;
}
