import { View } from 'react-native';

import { Hairline } from '@/lib/theme/components/hairline';
import { Text } from '@/lib/theme/components/text';
import { spacing } from '@/lib/theme/spacing';

interface SettingRowProps {
  label: string;
  children: React.ReactNode;
}

export function SettingRow({ label, children }: SettingRowProps) {
  return (
    <View style={{ paddingVertical: spacing[4] }}>
      <Text variant="eyebrow" tone="muted" style={{ marginBottom: spacing[3] }}>
        {label}
      </Text>
      {children}
      <Hairline />
    </View>
  );
}
