let store;

const noopStore = {
  getItem() {},
  setItem() {},
};

if (typeof window !== 'undefined' && 'localStorage' in window && window.localStorage !== null) {
  try {
    const key = '__smoke_test__';
    window.localStorage.setItem(key, key);
    if (window.localStorage.getItem(key) !== key) {
      store = noopStore;
    } else {
      window.localStorage.removeItem(key);
      store = window.localStorage;
    }
  } catch (e) {
    store = noopStore;
  }
} else {
  store = noopStore;
}

export default store;
