import { useEffect } from 'react'

import { getDeps } from '../utils'

export const withEffect = (fn, dependencies) => (state, props) => {
  const deps = getDeps(props, dependencies)
  useEffect(fn.bind(null, state, props), deps)
}
