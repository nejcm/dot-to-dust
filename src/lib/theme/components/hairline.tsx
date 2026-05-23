import { View } from 'react-native';

interface HairlineProps {
  vertical?: boolean;
  testID?: string;
}

export function Hairline({ vertical = false, testID }: HairlineProps) {
  return (
    <View
      testID={testID}
      className={vertical ? 'h-full w-[hairlineWidth()] bg-hairline' : 'h-[hairlineWidth()] w-full bg-hairline'}
    />
  );
}
