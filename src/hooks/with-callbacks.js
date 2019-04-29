import { useCallback } from 'react'

import { getDeps, unwindLoop, isFunction } from '../utils'

export const withCallbacks = (callbacks, dependencies) => {
  const unrolledCalls = unwindLoop((fnCfg, deps, state, props) => {
    const activeFn = isFunction(fnCfg) ? fnCfg : fnCfg.func
    const activeDeps = getDeps({ ...state, ...props }, fnCfg.deps || deps)
    return useCallback(activeFn(state, props), activeDeps)
  }, callbacks)

  return (state, props) => unrolledCalls(dependencies, state, props)
}

export const withCallback = (callbackName, callback, dependencies) => (state, props) => {
  const deps = getDeps(props, dependencies)
  return { [callbackName]: useCallback(callback(state, props), deps) }
}