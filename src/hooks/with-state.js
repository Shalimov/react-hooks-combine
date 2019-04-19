import { useState } from 'react'

import { toCombineFn } from '../utils'

export const withState = (stateName, handler, initialState) => toCombineFn(() => {
  const [state, updater] = useState(initialState)
  return { [stateName]: state, [handler]: updater }
})
