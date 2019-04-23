import { useMemo } from 'react'

import { getDeps } from '../utils'

export const withMemo = (memoisedName, callback, deps) => (state, props) => {
  const memoizedValue = useMemo(
    () => callback(state, props),
    getDeps({ ...state, ...props }, deps)
  )

  return { [memoisedName]: memoizedValue }
}
