import type { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import type { ComponentProps } from 'react';

import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform } from 'react-native';

import { parseCivilDate, toCivilDateString, todayCivilDate } from './index';

type NativeDateTimePickerProps = ComponentProps<typeof DateTimePicker>;

interface NativeCivilDatePickerProps {
  value: string;
  onChange: (value: string) => void;
  maximumValue?: string;
  display?: NativeDateTimePickerProps['display'];
  testID?: string;
  onAndroidClose?: () => void;
}

export function NativeCivilDatePicker({
  value,
  onChange,
  maximumValue = todayCivilDate(),
  display,
  testID,
  onAndroidClose,
}: NativeCivilDatePickerProps) {
  const handleChange = (event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === 'android') {
      onAndroidClose?.();
      if (event.type !== 'set' || !selected) return;
    }

    if (selected) {
      onChange(toCivilDateString(selected));
    }
  };

  return (
    <DateTimePicker
      testID={testID}
      value={parseCivilDate(value)}
      mode="date"
      maximumDate={parseCivilDate(maximumValue)}
      display={display}
      onChange={handleChange}
    />
  );
}
