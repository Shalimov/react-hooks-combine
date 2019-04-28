import { useMemo } from 'react'

import { getDeps } from '../utils'

export const withMemos = config => {
  const FuncCtor = Function

  const invocations = Object.entries(config)
    .map(([key]) => `box.${key} = useMemo(() => cfg.${key}.func(state, props), getDeps({ ...state, ...props }, cfg.${key}.deps));`)
    .join('\n')

  const body = `
    const box = {};
    ${invocations}
    return box
  `

  return new FuncCtor('useMemo', 'getDeps', 'cfg', 'state', 'props', body)
    .bind(null, useMemo, getDeps, config)
}

export const withMemo = (memoizedName, callback, deps) => (state, props) => {
  const memoizedValue = useMemo(
    () => callback(state, props),
    getDeps({ ...state, ...props }, deps)
  )

  return { [memoizedName]: memoizedValue }
}
