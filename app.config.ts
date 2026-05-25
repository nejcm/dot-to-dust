import type { ConfigContext, ExpoConfig } from '@expo/config';

import 'tsx/cjs';

// eslint-disable-next-line perfectionist/sort-imports
import Env from './env';

const EXPO_ACCOUNT_OWNER = 'ncncm';
const EAS_PROJECT_ID
  = process.env.EAS_PROJECT_ID ?? 'f8cf91d4-9b67-4550-9b14-0e6494fc1e07';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: Env.EXPO_PUBLIC_NAME,
  description: 'Your life as a dot grid. One glance, finite time felt.',
  owner: EXPO_ACCOUNT_OWNER,
  scheme: Env.EXPO_PUBLIC_SCHEME,
  slug: 'dot-to-dust',
  version: Env.EXPO_PUBLIC_VERSION.toString(),
  icon: './assets/logo.png',
  orientation: 'portrait',
  userInterfaceStyle: 'automatic',
  ...(EAS_PROJECT_ID
    ? {
        updates: {
          fallbackToCacheTimeout: 0,
          url: `https://u.expo.dev/${EAS_PROJECT_ID}`,
        },
      }
    : {}),
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: false,
    bundleIdentifier: Env.EXPO_PUBLIC_BUNDLE_ID,
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  experiments: {
    typedRoutes: true,
  },
  android: {
    adaptiveIcon: {
      backgroundColor: '#faf8f5',
      foregroundImage: './assets/logo-icon.png',
    },
    package: Env.EXPO_PUBLIC_PACKAGE,
  },
  web: {
    bundler: 'metro',
    favicon: './assets/favicon.png',
  },
  plugins: [
    '@react-native-community/datetimepicker',
    [
      'expo-splash-screen',
      {
        backgroundColor: '#faf8f5',
        image: './assets/splash.png',
        imageWidth: 150,
      },
    ],
    [
      'expo-font',
      {
        ios: {
          fonts: [
            'node_modules/@expo-google-fonts/cormorant-garamond/300Light/CormorantGaramond_300Light.ttf',
            'node_modules/@expo-google-fonts/cormorant-garamond/400Regular/CormorantGaramond_400Regular.ttf',
            'node_modules/@expo-google-fonts/cormorant-garamond/400Regular_Italic/CormorantGaramond_400Regular_Italic.ttf',
            'node_modules/@expo-google-fonts/cormorant-garamond/500Medium/CormorantGaramond_500Medium.ttf',
            'node_modules/@expo-google-fonts/geist/400Regular/Geist_400Regular.ttf',
            'node_modules/@expo-google-fonts/geist/500Medium/Geist_500Medium.ttf',
            'node_modules/@expo-google-fonts/geist/700Bold/Geist_700Bold.ttf',
            'node_modules/@expo-google-fonts/geist-mono/400Regular/GeistMono_400Regular.ttf',
          ],
        },
        android: {
          fonts: [
            {
              fontFamily: 'CormorantGaramond_300Light',
              fontDefinitions: [
                {
                  path: 'node_modules/@expo-google-fonts/cormorant-garamond/300Light/CormorantGaramond_300Light.ttf',
                  weight: 300,
                },
              ],
            },
            {
              fontFamily: 'CormorantGaramond_400Regular',
              fontDefinitions: [
                {
                  path: 'node_modules/@expo-google-fonts/cormorant-garamond/400Regular/CormorantGaramond_400Regular.ttf',
                  weight: 400,
                },
              ],
            },
            {
              fontFamily: 'CormorantGaramond_400Regular_Italic',
              fontDefinitions: [
                {
                  path: 'node_modules/@expo-google-fonts/cormorant-garamond/400Regular_Italic/CormorantGaramond_400Regular_Italic.ttf',
                  weight: 400,
                  style: 'italic',
                },
              ],
            },
            {
              fontFamily: 'CormorantGaramond_500Medium',
              fontDefinitions: [
                {
                  path: 'node_modules/@expo-google-fonts/cormorant-garamond/500Medium/CormorantGaramond_500Medium.ttf',
                  weight: 500,
                },
              ],
            },
            {
              fontFamily: 'Geist_400Regular',
              fontDefinitions: [
                {
                  path: 'node_modules/@expo-google-fonts/geist/400Regular/Geist_400Regular.ttf',
                  weight: 400,
                },
              ],
            },
            {
              fontFamily: 'Geist_500Medium',
              fontDefinitions: [
                {
                  path: 'node_modules/@expo-google-fonts/geist/500Medium/Geist_500Medium.ttf',
                  weight: 500,
                },
              ],
            },
            {
              fontFamily: 'Geist_700Bold',
              fontDefinitions: [
                {
                  path: 'node_modules/@expo-google-fonts/geist/700Bold/Geist_700Bold.ttf',
                  weight: 700,
                },
              ],
            },
            {
              fontFamily: 'GeistMono_400Regular',
              fontDefinitions: [
                {
                  path: 'node_modules/@expo-google-fonts/geist-mono/400Regular/GeistMono_400Regular.ttf',
                  weight: 400,
                },
              ],
            },
          ],
        },
      },
    ],
    'expo-localization',
    [
      'expo-router',
      {},
    ],
    [
      'react-native-edge-to-edge',
      {
        android: {
          enforceNavigationBarContrast: false,
        },
      },
    ],
  ],
  ...(EAS_PROJECT_ID
    ? {
        extra: {
          eas: {
            projectId: EAS_PROJECT_ID,
          },
        },
      }
    : {}),
  runtimeVersion: {
    policy: 'appVersion',
  },
});
