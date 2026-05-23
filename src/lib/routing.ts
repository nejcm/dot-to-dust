import type { Router } from 'expo-router';

export function goBackOrFallback(router: Router, fallbackHref?: Parameters<Router['replace']>[0]): void {
  if (router.canGoBack()) {
    router.back();
    return;
  }

  router.replace(fallbackHref ?? '/');
}
