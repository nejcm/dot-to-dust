import * as Linking from 'expo-linking';

import { config } from '@/config';
import { Button } from '@/lib/theme/components/button';
import { Text } from '@/lib/theme/components/text';
import { SettingRow } from './setting-row';

type ExternalLinkKey = keyof typeof config.links;

interface ExternalLinkRowProps {
  actionLabel: string;
  label: string;
  linkKey: ExternalLinkKey;
  testID: string;
}

export function ExternalLinkRow({ actionLabel, label, linkKey, testID }: ExternalLinkRowProps) {
  return (
    <SettingRow label={label}>
      <Button
        accessibilityLabel={label}
        accessibilityRole="link"
        className="justify-end gap-3 pr-0"
        hitSlop={12}
        onPress={() => Linking.openURL(config.links[linkKey])}
        testID={testID}
      >
        <Text variant="meta" tone="muted" numberOfLines={1}>
          {actionLabel}
        </Text>
        <Text tone="faint" className="pb-1 text-xl">
          ›
        </Text>
      </Button>
    </SettingRow>
  );
}
