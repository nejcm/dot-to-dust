import { router } from 'expo-router';

import { DobPicker } from '@/features/onboarding/components/dob-picker';
import { setDob } from '@/lib/storage/preferences-store';

export default function DobScreen() {
  const handleConfirm = (dob: string) => {
    setDob(dob);
    router.replace('/(app)');
  };

  return <DobPicker onConfirm={handleConfirm} onBack={() => router.back()} />;
}
