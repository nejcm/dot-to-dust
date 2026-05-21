import type { ColorTokens, StageIndex } from '@/lib/theme/tokens';

export type { StageIndex };

export function stageColor(tokens: ColorTokens, stage: StageIndex): string {
  return tokens.stages[stage];
}
