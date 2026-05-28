import { requireOptionalNativeModule } from 'expo';

interface DotToDustWidgetModule {
  writeSnapshot: (payload: string) => void;
}

const nativeWidgetModule = requireOptionalNativeModule<DotToDustWidgetModule>('DotToDustWidget');

export function writeNativeWidgetSnapshot(payload: string): boolean {
  if (!nativeWidgetModule) return false;

  nativeWidgetModule.writeSnapshot(payload);
  return true;
}
