import { useState } from 'react'

import { toReuseFn } from '../utils'

export const reuseState = (stateName, handler, initialState) => toReuseFn(() => {
  const [state, updater] = useState(initialState)
  return { [stateName]: state, [handler]: updater }
})
