/* eslint-disable react-refresh/only-export-components */
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';
import Svg from 'react-native-svg';
import { withUniwind } from 'uniwind';

export {
  ActivityIndicator,
  Image,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';

export const SafeAreaView = withUniwind(RNSafeAreaView);
export const StyledSvg = withUniwind(Svg);
