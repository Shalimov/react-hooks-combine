import { useEffect, useLayoutEffect, useRef } from 'react'

import { getDeps } from '../utils'

export const createWithEffect = (useHook) => (fn, dependencies) => (state, props) => {
  const deps = getDeps({ ...state, ...props }, dependencies)
  const referedStateProps = useRef({ state, props })

  useHook(() => {
    const dispose = fn(state, props, referedStateProps.current)

    referedStateProps.current = { state, props }

    return dispose
  }, deps)
}

export const withEffect = createWithEffect(useEffect)
export const withLayoutEffect = createWithEffect(useLayoutEffect)
