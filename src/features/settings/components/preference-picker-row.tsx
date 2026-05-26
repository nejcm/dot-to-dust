import { Picker } from '@react-native-picker/picker';
import { useEffect, useMemo, useRef, useState } from 'react';

import { Modal, Platform, Pressable, View } from 'react-native';

import { useAppTranslation } from '@/lib/i18n/use-translation';
import { Button } from '@/lib/theme/components/button';
import { Hairline } from '@/lib/theme/components/hairline';
import { Text } from '@/lib/theme/components/text';
import { toHex } from '@/lib/theme/tokens';
import { useTheme } from '@/lib/theme/use-theme';

import { SettingRow } from './setting-row';

interface PreferencePickerOption<T extends string> {
  label: string;
  value: T;
  testID?: string;
}

interface PreferencePickerRowProps<T extends string> {
  label: string;
  value: T;
  options: readonly PreferencePickerOption<T>[];
  onChange: (value: T) => void;
  editAccessibilityLabel: string;
  editTestID: string;
  pickerTestID: string;
}

export function PreferencePickerRow<T extends string>({
  editAccessibilityLabel,
  editTestID,
  label,
  onChange,
  options,
  pickerTestID,
  value,
}: PreferencePickerRowProps<T>) {
  const { t } = useAppTranslation();
  const { tokens } = useTheme();
  const pickerRef = useRef<Picker<T>>(null);
  const [editing, setEditing] = useState(false);
  const [pendingValue, setPendingValue] = useState(value);
  const isAndroid = Platform.OS === 'android';
  const isIOS = Platform.OS === 'ios';
  const isWeb = Platform.OS === 'web';
  const currentLabel = options.find((option) => option.value === value)?.label ?? value;
  const pickerColor = toHex(tokens.ink);
  const pickerBackground = toHex(tokens.bg);
  const selectionColor = toHex(tokens.hairline);
  const pickerStyle = useMemo(
    () => ({ backgroundColor: pickerBackground, color: pickerColor }),
    [pickerBackground, pickerColor],
  );
  const pickerItemStyle = useMemo(
    () => ({ color: pickerColor, fontSize: 17 }),
    [pickerColor],
  );
  const nativePickerProps = isWeb
    ? {}
    : {
        dropdownIconColor: pickerColor,
        mode: 'dialog' as const,
        numberOfLines: 1,
        prompt: label,
        selectionColor,
      };

  useEffect(() => {
    if (!editing || !isAndroid) return;

    const focusTimer = setTimeout(() => {
      try {
        pickerRef.current?.focus();
      }
      catch {
        // React Native test renderer can throw here because there is no native picker host.
      }
    }, 0);
    return () => clearTimeout(focusTimer);
  }, [editing, isAndroid]);

  const handleEdit = () => {
    setPendingValue(value);
    setEditing(true);
  };

  const handleCancel = () => {
    setPendingValue(value);
    setEditing(false);
  };

  const handleDone = () => {
    onChange(pendingValue);
    setEditing(false);
  };

  const handlePickerChange = (nextValue: T) => {
    setPendingValue(nextValue);
    if (!isAndroid) return;

    onChange(nextValue);
    setEditing(false);
  };

  const handlePickerBlur = () => {
    if (!isAndroid) return;

    setPendingValue(value);
    setEditing(false);
  };

  const picker = (
    <Picker
      ref={pickerRef}
      selectedValue={pendingValue}
      onBlur={handlePickerBlur}
      onValueChange={handlePickerChange}
      style={pickerStyle}
      itemStyle={pickerItemStyle}
      testID={pickerTestID}
      {...nativePickerProps}
    >
      {options.map((option) => (
        <Picker.Item
          key={option.value}
          label={option.label}
          value={option.value}
          color={pickerColor}
          testID={option.testID}
        />
      ))}
    </Picker>
  );

  const actions = (
    <View className="mt-2 flex-row justify-end gap-6">
      <Button onPress={handleCancel} className="min-h-11 justify-center">
        <Text variant="micro" tone="muted" className="font-medium tracking-[2px] uppercase">
          {t('settings.picker.cancel')}
        </Text>
      </Button>
      <Button onPress={handleDone} className="min-h-11 justify-center">
        <Text variant="micro" tone="ink" className="font-medium tracking-[2px] uppercase">
          {t('settings.picker.done')}
        </Text>
      </Button>
    </View>
  );

  return (
    <>
      {(!editing || !isWeb) && (
        <View>
          <SettingRow label={label}>
            <Button
              onPress={handleEdit}
              hitSlop={12}
              accessibilityLabel={editAccessibilityLabel}
              className="justify-end gap-3 pr-0"
              testID={editTestID}
            >
              <Text variant="meta" tone="muted" numberOfLines={1}>
                {currentLabel}
              </Text>
              <Text tone="faint" className="pb-1 text-xl">
                ›
              </Text>
            </Button>
          </SettingRow>
          {editing && isAndroid && (
            <View className="size-0 overflow-hidden">
              {picker}
            </View>
          )}
        </View>
      )}

      {editing && isIOS && (
        <Modal
          visible
          transparent
          animationType="fade"
          onRequestClose={handleCancel}
        >
          <View className="flex-1 justify-end bg-black/35 px-4 pb-6">
            <Pressable className="absolute inset-0" onPress={handleCancel} />
            <View className="rounded-lg border border-hairline bg-bg p-4">
              <Text variant="meta" tone="ink" className="mb-3">
                {label}
              </Text>
              {picker}
              {actions}
            </View>
          </View>
        </Modal>
      )}

      {editing && isWeb && (
        <View>
          <View className="py-5">
            <Text variant="meta" tone="ink" className="mb-3">
              {label}
            </Text>
            <View className="overflow-hidden">
              {picker}
            </View>
            {actions}
          </View>
          <Hairline />
        </View>
      )}
    </>
  );
}
