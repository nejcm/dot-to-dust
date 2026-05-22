import type { StoreApi, UseBoundStore } from 'zustand';

type WithSelectors<S> = S extends UseBoundStore<StoreApi<infer T>>
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never;

export function createSelectors<T extends object, S extends UseBoundStore<StoreApi<T>>>(_store: S): WithSelectors<S> {
  const store = _store as WithSelectors<S>;
  const selectors: Partial<{ [K in keyof T]: () => T[K] }> = {};

  function addSelector<K extends keyof T>(key: K) {
    selectors[key] = () => store((state) => state[key]);
  }

  for (const key of Object.keys(store.getState()) as Array<keyof T>) {
    addSelector(key);
  }

  store.use = selectors as WithSelectors<S>['use'];

  return store;
}
