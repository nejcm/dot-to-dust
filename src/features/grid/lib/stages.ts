export type StageIndex = 0 | 1 | 2 | 3 | 4;

export interface StageDefinition {
  index: StageIndex;
  name: string;
  range: string;
  startAge: number;
  endAge: number;
}

export const STAGES = [
  { index: 0, name: 'Formation', range: '0–11', startAge: 0, endAge: 11 },
  { index: 1, name: 'Emergence', range: '12–22', startAge: 12, endAge: 22 },
  { index: 2, name: 'Construction', range: '23–39', startAge: 23, endAge: 39 },
  { index: 3, name: 'Tenure', range: '40–59', startAge: 40, endAge: 59 },
  { index: 4, name: 'Twilight', range: '60–80', startAge: 60, endAge: 80 },
] as const satisfies readonly StageDefinition[];
