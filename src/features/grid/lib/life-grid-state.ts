import type { DotState } from './dot-states';
import type { GridLayout } from './grid-layout';
import type { HeadlineEyebrowKey, HeadlineSublineKey } from './view-policy';

import type { View } from '@/lib/view';
import { buildDotStates } from './dot-states';
import { computeGridLayout } from './grid-layout';
import { isBonusTime, LIFE_YEARS } from './life-math';
import { viewSpec } from './view-policy';

interface BuildLifeGridStateInput {
  view: View;
  dob: string;
  today: string;
  width: number;
  height: number;
  reducedMotion: boolean;
  platformOS: string;
}

export interface LifeGridHeaderState {
  lived: number;
  total: number;
}

export interface LifeGridState {
  view: View;
  width: number;
  height: number;
  layout: GridLayout;
  dots: DotState[];
  header: LifeGridHeaderState;
  headline: HeadlineState;
  bonus: boolean;
  todayRing: TodayRingPolicy;
}

interface BuildHeadlineStateInput {
  view: View;
  dob: string;
  today: string;
}

export type TodayRingPolicy = 'pulse' | 'static';

export interface HeadlineState extends LifeGridHeaderState {
  bonus: boolean;
  count: number;
  remaining: number;
  eyebrowKey: HeadlineEyebrowKey;
  sublineKey: HeadlineSublineKey;
  years: number;
}

export function buildLifeGridState(input: BuildLifeGridStateInput): LifeGridState {
  const { dob, height, platformOS, reducedMotion, today, view, width } = input;
  const headline = buildHeadlineState({ view, dob, today });

  return {
    view,
    width,
    height,
    layout: computeGridLayout(view, width, height),
    dots: buildDotStates(view, dob, today),
    header: {
      lived: headline.lived,
      total: headline.total,
    },
    headline,
    bonus: headline.bonus,
    todayRing: todayRingPolicyFor(view, reducedMotion, platformOS),
  };
}

export function buildHeadlineState(input: BuildHeadlineStateInput): HeadlineState {
  const { dob, today, view } = input;
  const spec = viewSpec(view);
  const bonus = isBonusTime(dob, today);
  const header = buildLifeGridHeaderState(view, dob, today);

  return {
    ...header,
    bonus,
    count: bonus ? spec.bonusAhead(dob, today) : header.lived,
    remaining: spec.remaining(dob, today),
    eyebrowKey: bonus ? spec.bonusEyebrowKey : spec.eyebrowKey,
    sublineKey: spec.sublineKey,
    years: LIFE_YEARS,
  };
}

export function todayRingPolicyFor(
  view: View,
  reducedMotion: boolean,
  platformOS: string,
): TodayRingPolicy {
  return platformOS !== 'web' && !reducedMotion && view !== 'years' ? 'pulse' : 'static';
}

export function buildLifeGridHeaderState(
  view: View,
  dob: string,
  today: string,
): LifeGridHeaderState {
  const spec = viewSpec(view);
  return {
    lived: spec.unitsLived(dob, today),
    total: spec.total,
  };
}
