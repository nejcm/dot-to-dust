import { StyleSheet, View } from 'react-native';

import { useTheme } from '../use-theme';

interface HairlineProps {
  vertical?: boolean;
  testID?: string;
}

export function Hairline({ vertical = false, testID }: HairlineProps) {
  const { tokens } = useTheme();

  return (
    <View
      testID={testID}
      style={[
        vertical ? styles.vertical : styles.horizontal,
        { backgroundColor: tokens.hairline },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  horizontal: {
    width: '100%',
    height: StyleSheet.hairlineWidth,
  },
  vertical: {
    height: '100%',
    width: StyleSheet.hairlineWidth,
  },
});
