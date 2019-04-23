import { useMemo } from 'react'

import { getDeps } from '../utils'

export const withMemos = config => (state, props) => {
  const memoizedValues = {}

  const wrapFunc = func => () => func(state, props)

  for (const [memoizedValue, memoizedConfig] of Object.entries(config)) {
    memoizedValues[memoizedValue] = useMemo(
      wrapFunc(memoizedConfig.func),
      getDeps({ ...state, ...props }, memoizedConfig.deps)
    )
  }

  return memoizedValues
}

export const withMemo = (memoizedName, callback, deps) => (state, props) => {
  const memoizedValue = useMemo(
    () => callback(state, props),
    getDeps({ ...state, ...props }, deps)
  )

  return { [memoizedName]: memoizedValue }
}
