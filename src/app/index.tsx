import { Redirect } from 'expo-router';

import { usePreferencesStore } from '@/lib/storage/preferences-store';

export default function Index() {
  const dob = usePreferencesStore.use.dob();

  return <Redirect href={dob === null ? '/(onboarding)' : '/(app)'} />;
}
