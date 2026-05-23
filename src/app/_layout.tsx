import {
  CormorantGaramond_300Light,
  CormorantGaramond_400Regular,
  CormorantGaramond_400Regular_Italic,
  CormorantGaramond_500Medium,
} from '@expo-google-fonts/cormorant-garamond';
import { Geist_400Regular, Geist_500Medium, Geist_700Bold } from '@expo-google-fonts/geist';
import { GeistMono_400Regular } from '@expo-google-fonts/geist-mono';
import { ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { withUniwind } from 'uniwind';

import { AppErrorBoundary } from '@/lib/app-error-boundary';
import { toNavTheme } from '@/lib/theme/nav-theme';
import { ThemeProvider } from '@/lib/theme/provider';
import { toHex } from '@/lib/theme/tokens';
import { useTheme } from '@/lib/theme/use-theme';

import '@/lib/i18n';
import '@/global.css';

export { ErrorBoundary } from 'expo-router';

// eslint-disable-next-line react-refresh/only-export-components
export const unstable_settings = {
  initialRouteName: '(app)',
};

void SplashScreen.preventAutoHideAsync().catch(() => {});
SplashScreen.setOptions({
  duration: 500,
  fade: true,
});

const StyledGestureHandlerRootView = withUniwind(GestureHandlerRootView);

function RootNavigator() {
  const { colorScheme, tokens, isDark } = useTheme();
  const navTheme = toNavTheme(tokens, isDark);
  const backgroundColor = toHex(tokens.bg);

  return (
    <NavigationThemeProvider value={navTheme}>
      <StatusBar
        style={colorScheme === 'dark' ? 'light' : 'dark'}
      />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor } }} />
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    CormorantGaramond_300Light,
    CormorantGaramond_400Regular,
    CormorantGaramond_400Regular_Italic,
    CormorantGaramond_500Medium,
    Geist_400Regular,
    Geist_500Medium,
    Geist_700Bold,
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
    <StyledGestureHandlerRootView className="flex-1">
      <SafeAreaProvider>
        <ThemeProvider>
          <AppErrorBoundary>
            <RootNavigator />
          </AppErrorBoundary>
        </ThemeProvider>
      </SafeAreaProvider>
    </StyledGestureHandlerRootView>
  );
}
