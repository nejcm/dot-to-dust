import {
  CormorantGaramond_300Light,
  CormorantGaramond_400Regular,
  CormorantGaramond_500Medium,
} from '@expo-google-fonts/cormorant-garamond';
import { Geist_400Regular, Geist_500Medium } from '@expo-google-fonts/geist';
import { GeistMono_400Regular } from '@expo-google-fonts/geist-mono';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { ThemeProvider } from '@/lib/theme/provider';
import { useTheme } from '@/lib/theme/use-theme';

import '@/lib/i18n';
import '@/global.css';

void SplashScreen.preventAutoHideAsync().catch(() => {});

function RootNavigator() {
  const { colorScheme } = useTheme();

  return (
    <>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    CormorantGaramond_300Light,
    CormorantGaramond_400Regular,
    CormorantGaramond_500Medium,
    Geist_400Regular,
    Geist_500Medium,
    GeistMono_400Regular,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ThemeProvider>
      <RootNavigator />
    </ThemeProvider>
  );
}
