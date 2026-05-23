import { router } from 'expo-router';
import { useCallback } from 'react';

import { LifeGridScreen } from '@/features/grid/screens/life-grid-screen';

export default function AppIndex() {
  const handleOpenSettings = useCallback(() => {
    router.navigate('/(app)/settings');
  }, []);

  return <LifeGridScreen onOpenSettings={handleOpenSettings} />;
}
