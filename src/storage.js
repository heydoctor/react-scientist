// @flow

type GetItem = (key: string) => number
type SetItem = (key: string, value: mixed) => void

type Storage = {
  getItem: GetItem,
  setItem: SetItem,
}

let store: Storage = {
  getItem(key: string) {
    return 0
  },
  setItem(key: string, value: mixed) {},
};

if (typeof window !== 'undefined' && 'localStorage' in window && window.localStorage !== null) {
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
