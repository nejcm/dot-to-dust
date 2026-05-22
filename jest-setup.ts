/* eslint-disable ts/ban-ts-comment */
/* eslint-disable no-restricted-globals */

import { Uniwind } from 'uniwind';

const mockMmkvData = new Map<string, string | number | boolean>();
const mockMmkvInstance = {
  set: jest.fn((key: string, value: string | number | boolean) => {
    mockMmkvData.set(key, value);
  }),
  getString: jest.fn((key: string) => {
    const value = mockMmkvData.get(key);
    return typeof value === 'string' ? value : undefined;
  }),
  getNumber: jest.fn((key: string) => {
    const value = mockMmkvData.get(key);
    return typeof value === 'number' ? value : undefined;
  }),
  getBoolean: jest.fn((key: string) => {
    const value = mockMmkvData.get(key);
    return typeof value === 'boolean' ? value : undefined;
  }),
  remove: jest.fn((key: string) => {
    mockMmkvData.delete(key);
  }),
  clearAll: jest.fn(() => {
    mockMmkvData.clear();
  }),
  getAllKeys: jest.fn(() => [...mockMmkvData.keys()]),
};

// Suppress CSS variable resolution warnings in the Jest RN environment.
Uniwind.updateCSSVariables('light', {
  '--color-background': '#faf8f5',
  '--color-foreground': '#1a1a18',
});
Uniwind.updateCSSVariables('dark', {
  '--color-background': '#1a1a18',
  '--color-foreground': '#faf8f5',
});

// Mock react-native-worklets first
jest.mock('react-native-worklets', () => ({
  __esModule: true,
  default: {},
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const View = require('react-native').View;

  return {
    __esModule: true,
    default: {
      View,
      ScrollView: View,
      createAnimatedComponent: (component: any) => component,
      addWhitelistedUIProps: jest.fn(),
    },
    useSharedValue: jest.fn(() => ({ value: 0 })),
    useDerivedValue: jest.fn((fn) => ({ value: fn() })),
    useAnimatedStyle: jest.fn((fn) => fn()),
    useReducedMotion: jest.fn(() => false),
    runOnJS: jest.fn((fn) => fn),
    withTiming: jest.fn((value, _config, callback) => {
      callback?.(true);
      return value;
    }),
    withSpring: jest.fn((value) => value),
    withDecay: jest.fn((value) => value),
    withDelay: jest.fn((_, value) => value),
    withRepeat: jest.fn((value) => value),
    withSequence: jest.fn((...values) => values[0]),
    cancelAnimation: jest.fn(),
    Easing: {
      linear: jest.fn(),
      ease: jest.fn(),
      quad: jest.fn(),
      cubic: jest.fn(),
      bezier: jest.fn(),
      in: jest.fn((fn) => fn),
      out: jest.fn((fn) => fn),
      inOut: jest.fn((fn) => fn),
    },
    FadeIn: { duration: jest.fn(() => ({})) },
    FadeOut: { duration: jest.fn(() => ({})) },
    FadeInDown: { duration: jest.fn(() => ({})) },
    FadeInUp: { duration: jest.fn(() => ({})) },
    Layout: {},
    Keyframe: jest.fn(),
  };
});

// Mock @shopify/react-native-skia
jest.mock('@shopify/react-native-skia', () => {
  const React = require('react');
  const View = require('react-native').View;
  const SkiaNode = (type: string) => (props: { children?: unknown }) =>
    React.createElement(type, props, props.children);

  return {
    Canvas: View,
    Circle: SkiaNode('skCircle'),
    Group: SkiaNode('skGroup'),
    useClock: jest.fn(() => ({ value: 0 })),
  };
});

// Mock expo-localization
jest.mock('expo-localization', () => ({
  getLocales: jest.fn(() => [
    {
      languageTag: 'en-US',
      languageCode: 'en',
      textDirection: 'ltr',
      digitGroupingSeparator: ',',
      decimalSeparator: '.',
      measurementSystem: 'metric',
      currencyCode: 'USD',
      currencySymbol: '$',
      regionCode: 'US',
    },
  ]),
}));

// Mock react-native-mmkv
jest.mock('react-native-mmkv', () => ({
  __mockMmkvClear: jest.fn(() => mockMmkvData.clear()),
  __mockMmkvSetString: jest.fn((key: string, value: string) => {
    mockMmkvData.set(key, value);
  }),
  __mockMmkvGetString: jest.fn((key: string) => {
    const value = mockMmkvData.get(key);
    return typeof value === 'string' ? value : undefined;
  }),
  createMMKV: jest.fn(() => mockMmkvInstance),
  MMKV: jest.fn(() => mockMmkvInstance),
  useMMKVString: jest.fn((_key: string) => [undefined, jest.fn()]),
  useMMKVNumber: jest.fn((_key: string) => [undefined, jest.fn()]),
  useMMKVBoolean: jest.fn((_key: string) => [undefined, jest.fn()]),
  useMMKVObject: jest.fn((_key: string) => [undefined, jest.fn()]),
}));

// @ts-expect-error
global.window = {};
// @ts-expect-error
global.window = global;
