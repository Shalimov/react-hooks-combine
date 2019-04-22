import { useState } from 'react'

export const withState = (stateName, handler, initialState) => () => {
  const [state, updater] = useState(initialState)
  return { [stateName]: state, [handler]: updater }
}
