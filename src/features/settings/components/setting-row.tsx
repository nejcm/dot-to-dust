import { View } from 'react-native';

import { Hairline } from '@/lib/theme/components/hairline';
import { Text } from '@/lib/theme/components/text';

interface SettingRowProps {
  label: string;
  children: React.ReactNode;
}

export function SettingRow({ label, children }: SettingRowProps) {
  return (
    <View className="py-4">
      <Text variant="eyebrow" tone="muted" className="mb-3">
        {label}
      </Text>
      {children}
      <Hairline />
    </View>
  );
}
