import { useCallback } from 'react'

import { getDeps } from '../utils'

export const withCallbacks = (callbacks, dependencies) => (state, props) => {
  const memoizedCallbacks = {}
  const deps = getDeps(props, dependencies)

  for (const [key, callback] of Object.entries(callbacks)) {
    memoizedCallbacks[key] = useCallback(callback(state, props), deps)
  }

  return memoizedCallbacks
}

export const withCallback = (callbackName, callback, dependencies) => (state, props) => {
  const deps = getDeps(props, dependencies)
  return { [callbackName]: useCallback(callback(state, props), deps) }
}