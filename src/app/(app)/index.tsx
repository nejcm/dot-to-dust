import { router } from 'expo-router';

import { LifeGridScreen } from '@/features/grid/screens/life-grid-screen';

export default function AppIndex() {
  return <LifeGridScreen onOpenSettings={() => router.push('/(app)/settings')} />;
}
