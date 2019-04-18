const storeBox = new Map();

export const getStore = name => {
  storeBox.get(name);
}

export const createStore = (name, initialState = {}) => {
  if (storeBox.has(name)) {
    throw new Error(`Store ${name} already exists`)
  }

  storeBox.set(name, initialState);
}