import { Path } from 'react-native-svg';

import { StyledSvg as Svg } from '@/lib/theme/components/ui';

interface ArrowLeftIconProps {
  color: string;
  height?: number;
  width?: number;
}

export function ArrowLeftIcon({ color, height = 10, width = 14 }: ArrowLeftIconProps) {
  const centerY = height / 2;
  const arrowX = height / 2;

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none">
      <Path
        d={`M${arrowX} 1L1 ${centerY}l${arrowX - 1} ${centerY - 1}M1 ${centerY}h${width - 2}`}
        stroke={color}
        strokeWidth={0.9}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
