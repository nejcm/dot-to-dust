import type { DotState } from './dot-states';
import type { GridLayout } from './grid-layout';
import type { View } from '@/lib/view';

import { buildDotStates } from './dot-states';
import { computeGridLayout } from './grid-layout';
import { bonusUnitsAhead, isBonusTime, LIFE_YEARS, remainingFor } from './life-math';
import { BONUS_EYEBROW_KEY, EYEBROW_KEY, livedUnitsFor, SUBLINE_KEY, totalUnitsFor } from './view-policy';

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

type EyebrowKey = (typeof EYEBROW_KEY)[View] | (typeof BONUS_EYEBROW_KEY)[View];
type SublineKey = (typeof SUBLINE_KEY)[View];
export type TodayRingPolicy = 'pulse' | 'static';

export interface HeadlineState extends LifeGridHeaderState {
  bonus: boolean;
  count: number;
  remaining: number;
  eyebrowKey: EyebrowKey;
  sublineKey: SublineKey;
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
  const bonus = isBonusTime(dob, today);
  const header = buildLifeGridHeaderState(view, dob, today);
  const remaining = remainingFor(view, dob, today);

  return {
    ...header,
    bonus,
    count: bonus ? bonusUnitsAhead(view, dob, today) : header.lived,
    remaining,
    eyebrowKey: bonus ? BONUS_EYEBROW_KEY[view] : EYEBROW_KEY[view],
    sublineKey: SUBLINE_KEY[view],
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
  return {
    lived: livedUnitsFor(view, dob, today),
    total: totalUnitsFor(view),
  };
}
