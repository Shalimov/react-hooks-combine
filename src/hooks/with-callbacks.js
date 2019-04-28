import { useCallback } from 'react'

import { getDeps, unwindLoop } from '../utils'

export const withCallbacks = (callbacks, dependencies) => {
  const unrolledCalls = unwindLoop(useCallback, callbacks)
  return (state, props) => {
    const deps = getDeps({ ...state, ...props }, dependencies)
    return unrolledCalls(state, props, deps)
  }
}

export const withCallback = (callbackName, callback, dependencies) => (state, props) => {
  const deps = getDeps(props, dependencies)
  return { [callbackName]: useCallback(callback(state, props), deps) }
}