import type { Router } from 'expo-router';

import { goBackOrFallback } from './routing';

function createRouter(canGoBack: boolean): Router {
  return {
    back: jest.fn(),
    canGoBack: jest.fn(() => canGoBack),
    replace: jest.fn(),
  } as unknown as Router;
}

describe('routing helpers', () => {
  it('goes back when navigation history exists', () => {
    const router = createRouter(true);

    goBackOrFallback(router, '/(app)');

    expect(router.back).toHaveBeenCalledTimes(1);
    expect(router.replace).not.toHaveBeenCalled();
  });

  it('replaces with the fallback when there is no navigation history', () => {
    const router = createRouter(false);

    goBackOrFallback(router, '/(app)');

    expect(router.back).not.toHaveBeenCalled();
    expect(router.replace).toHaveBeenCalledWith('/(app)');
  });
});
