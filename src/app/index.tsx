import { Redirect } from 'expo-router';

import { useDobPreference } from '@/lib/storage/preferences';

export default function Index() {
  const dob = useDobPreference();

  return <Redirect href={dob === null ? '/(onboarding)' : '/(app)'} />;
}
