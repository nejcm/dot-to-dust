import type { ConfigContext, ExpoConfig } from '@expo/config';

import 'tsx/cjs';

// eslint-disable-next-line perfectionist/sort-imports
import Env from './env';

const EXPO_ACCOUNT_OWNER = 'ncncm';
const EAS_PROJECT_ID = process.env.EAS_PROJECT_ID;

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: Env.EXPO_PUBLIC_NAME,
  description: 'Your life as a dot grid. One glance, finite time felt.',
  owner: EXPO_ACCOUNT_OWNER,
  scheme: Env.EXPO_PUBLIC_SCHEME,
  slug: 'dot-to-dust',
  version: Env.EXPO_PUBLIC_VERSION.toString(),
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
    package: Env.EXPO_PUBLIC_PACKAGE,
  },
  web: {
    bundler: 'metro',
  },
  plugins: [
    '@react-native-community/datetimepicker',
    [
      'expo-splash-screen',
      {
        backgroundColor: '#faf8f5',
        imageWidth: 150,
      },
    ],
    [
      'expo-font',
      {
        ios: {
          fonts: [
            'node_modules/@expo-google-fonts/fraunces/300Light/Fraunces_300Light.ttf',
            'node_modules/@expo-google-fonts/fraunces/300Light_Italic/Fraunces_300Light_Italic.ttf',
            'node_modules/@expo-google-fonts/inter/400Regular/Inter_400Regular.ttf',
            'node_modules/@expo-google-fonts/inter/500Medium/Inter_500Medium.ttf',
          ],
        },
        android: {
          fonts: [
            {
              fontFamily: 'Fraunces',
              fontDefinitions: [
                {
                  path: 'node_modules/@expo-google-fonts/fraunces/300Light/Fraunces_300Light.ttf',
                  weight: 300,
                },
                {
                  path: 'node_modules/@expo-google-fonts/fraunces/300Light_Italic/Fraunces_300Light_Italic.ttf',
                  weight: 300,
                  style: 'italic',
                },
              ],
            },
            {
              fontFamily: 'Inter',
              fontDefinitions: [
                {
                  path: 'node_modules/@expo-google-fonts/inter/400Regular/Inter_400Regular.ttf',
                  weight: 400,
                },
                {
                  path: 'node_modules/@expo-google-fonts/inter/500Medium/Inter_500Medium.ttf',
                  weight: 500,
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
