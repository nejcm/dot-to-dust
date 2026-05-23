import type { PressableStateCallbackType, StyleProp, ViewStyle } from 'react-native';

/**
 * Returns a style array that fades to 60% opacity while pressed.
 * Pass as the `style` prop of any `Pressable` that has no other pressed-state logic.
 *
 * @example
 * <Pressable style={(s) => getPressedStyle(s, { minHeight: 44 })}>
 */
export function getPressedStyle(
  state: PressableStateCallbackType,
  base?: StyleProp<ViewStyle>,
): StyleProp<ViewStyle> {
  return [base, state.pressed && { opacity: 0.6 }];
}
