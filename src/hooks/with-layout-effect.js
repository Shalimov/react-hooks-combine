import { useLayoutEffect } from 'react'

import { getDeps } from '../utils'

export const withLayoutEffect = (fn, dependencies) => (state, props) => {
  const deps = getDeps(props, dependencies)
  useLayoutEffect(() => fn(state, props), deps)
}
