// @flow

type GetItem = (key: string) => number;
type SetItem = (key: string, value: number) => void;

type Storage = {
  getItem: GetItem,
  setItem: SetItem,
};

let store: Storage = {
  state: {},
  getItem(key: string) {
    return this.state[key];
  },
  setItem(key: string, value: number) {
    this.state[key] = value;
  },
};

if (
  typeof window !== 'undefined' &&
  'localStorage' in window &&
  window.localStorage !== null
) {
  try {
    const key = '__smoke_test__';
    window.localStorage.setItem(key, key);
    if (window.localStorage.getItem(key) === key) {
      window.localStorage.removeItem(key);
      store = window.localStorage;
    }
  } catch (e) {}
}

export default store;
