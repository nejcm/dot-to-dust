export const VIEWS = ['weeks', 'months', 'years'] as const;

export type View = (typeof VIEWS)[number];

export const DEFAULT_VIEW: View = 'weeks';
