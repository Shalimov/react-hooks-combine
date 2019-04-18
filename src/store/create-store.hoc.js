import React from 'react'

import { createStore as createStoreVault, getStore } from './store-box.singleton'
import { isFunction, isPromiseLike } from '../utils'

// TODO: need to PoC how to create stores
export const createStore = (name, initialData) => {
  let setReadyExternal = null
  let storeData = null

  const initalStoreData = isFunction(initialData) ?
    initialData() :
    initialData

  let readyExternal = isPromiseLike(initalStoreData)

  if (!readyExternal) {
    initalStoreData.then((data) => {
      createStoreVault(name, initalStoreData)
      storeData = data
      readyExternal = true
      setReadyExternal && setReadyExternal(readyExternal)
    })
  } else {
    createStoreVault(name, initalStoreData)
  }

  const ReuseDataProvider = React.createContext()

  const connectStore = Component => props => {
    const [ready, setReady] = React.useState(readyExternal);
    setReadyExternal = setReady

    return (
      <ReuseDataProvider.Provider value={storeData}>
        <Component reuseStoreReady={ready} {...props} />
      </ReuseDataProvider.Provider>
    )
  }

  return connectStore
}
