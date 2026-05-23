import { View } from 'react-native';

import { Hairline } from '@/lib/theme/components/hairline';
import { Text } from '@/lib/theme/components/text';

interface SettingRowProps {
  label: string;
  children: React.ReactNode;
  last?: boolean;
}

export function SettingRow({ label, children, last = false }: SettingRowProps) {
  return (
    <View>
      <View className="min-h-[60px] flex-row items-center justify-between gap-4 py-5">
        <Text variant="meta" tone="ink" className="flex-1" numberOfLines={2}>
          {label}
        </Text>
        <View className="shrink-0 items-end">{children}</View>
      </View>
      {!last && <Hairline />}
    </View>
  );
}
