export const fontFamily = {
  display: 'CormorantGaramond_400Regular',
  displayLight: 'CormorantGaramond_300Light',
  displayMedium: 'CormorantGaramond_500Medium',
  ui: 'Geist_400Regular',
  uiMedium: 'Geist_500Medium',
  mono: 'GeistMono_400Regular',
} as const;

export type FontVariant = 'displayXl' | 'displayL' | 'displayM' | 'body' | 'meta' | 'eyebrow' | 'micro';

export interface TypeStyle {
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  letterSpacing: number;
  lineHeight?: number;
}

export const typeScale: Record<FontVariant, TypeStyle> = {
  displayXl: {
    fontFamily: fontFamily.displayLight,
    fontSize: 44,
    fontWeight: '300',
    letterSpacing: -0.5,
    lineHeight: 52,
  },
  displayL: {
    fontFamily: fontFamily.displayLight,
    fontSize: 32,
    fontWeight: '300',
    letterSpacing: -0.3,
    lineHeight: 40,
  },
  displayM: {
    fontFamily: fontFamily.display,
    fontSize: 22,
    fontWeight: '400',
    letterSpacing: -0.2,
    lineHeight: 28,
  },
  body: {
    fontFamily: fontFamily.ui,
    fontSize: 17,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 24,
  },
  meta: {
    fontFamily: fontFamily.ui,
    fontSize: 13,
    fontWeight: '400',
    letterSpacing: 0.1,
    lineHeight: 18,
  },
  eyebrow: {
    fontFamily: fontFamily.uiMedium,
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 1.5,
    lineHeight: 16,
  },
  micro: {
    fontFamily: fontFamily.ui,
    fontSize: 10,
    fontWeight: '400',
    letterSpacing: 0.2,
    lineHeight: 14,
  },
};
