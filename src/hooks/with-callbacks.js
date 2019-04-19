import { useCallback } from 'react'

import {
  toCombineFn,
  isFunction,
  isForwardPropsFn,
} from '../utils'

export const withCallbacks = (callbacks, dependencies = []) =>
  toCombineFn((state, props = {}) => {
    const memoizedCallbacks = {}

    const deps = dependencies.map(key => props[key])

    for (const key of Object.keys(callbacks)) {
      if (!isFunction(callbacks[key])) {
        continue
      }

      if (isForwardPropsFn(callbacks[key])) {
        memoizedCallbacks[key] = useCallback(callbacks[key]({ ...state, ...props }), deps)
      } else {
        memoizedCallbacks[key] = useCallback(callbacks[key], deps)
      }
    }

    return { ...memoizedCallbacks }
  })
