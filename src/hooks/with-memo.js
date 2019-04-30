import { useMemo } from 'react'

import { getDeps, unwindLoop, isFunction } from '../utils'

export const withMemos = (funcs, dependencies) => {
  const unrolledLoop = unwindLoop((fnCfg, deps, state, props) => {
    const activeFn = isFunction(fnCfg) ? fnCfg : fnCfg.func
    const activeDeps = getDeps({ ...state, ...props }, fnCfg.deps || deps)
    return useMemo(() => activeFn(state, props), activeDeps)
  }, funcs)

  return (state, props) => unrolledLoop(dependencies, state, props)
}

export const withMemo = (memoizedName, callback, deps) => (state, props) => {
  const memoizedValue = useMemo(
    () => callback(state, props),
    getDeps({ ...state, ...props }, deps),
  )

  return { [memoizedName]: memoizedValue }
}
