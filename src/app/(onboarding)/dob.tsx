import { router } from 'expo-router';

import { DobPicker } from '@/features/onboarding/components/dob-picker';
import { goBackOrFallback } from '@/lib/routing';
import { setDobPreference } from '@/lib/storage/preferences-store';

export default function DobScreen() {
  const handleConfirm = (dob: string) => {
    setDobPreference(dob);
    router.replace('/(app)');
  };

  return <DobPicker onConfirm={handleConfirm} onBack={() => goBackOrFallback(router, '/(onboarding)')} />;
}
