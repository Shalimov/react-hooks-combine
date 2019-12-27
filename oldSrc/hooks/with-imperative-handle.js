import { useImperativeHandle } from 'react'

import { getDeps } from '../utils'

export const withImperativeHandle = (createHandler, dependencies) => (state, props, ref) => {
  const deps = getDeps({ ...state, ...props }, dependencies)
  useImperativeHandle(ref, () => createHandler(state, props), deps)
}
