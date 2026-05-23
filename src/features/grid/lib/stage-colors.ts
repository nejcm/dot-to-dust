import type { StageIndex } from './stages';
import type { ColorTokens } from '@/lib/theme/tokens';

export type { StageIndex };

export function stageColor(tokens: ColorTokens, stage: StageIndex): string {
  return tokens.stages[stage];
}
