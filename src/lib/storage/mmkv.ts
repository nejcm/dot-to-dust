import type { StateStorage } from 'zustand/middleware';
import { createMMKV } from 'react-native-mmkv';

export const mmkv = createMMKV({ id: 'dot-to-dust-prefs' });

export const mmkvStorage: StateStorage = {
  getItem: (name) => mmkv.getString(name) ?? null,
  setItem: (name, value) => mmkv.set(name, value),
  removeItem: (name) => {
    mmkv.remove(name);
  },
};
