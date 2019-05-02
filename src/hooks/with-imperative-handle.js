import { useImperativeHandle } from 'react'

import { getDeps } from '../utils'

export const withImperativeHandle = (ref, createHandler, dependencies) => (state, props) => {
  const deps = getDeps({ ...state, ...props }, dependencies)
  useImperativeHandle(ref, () => createHandler(state, props), deps)
}
