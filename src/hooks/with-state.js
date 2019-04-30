import { useState } from 'react'

import { isFunction } from '../utils'

export const withState = (stateName, handler, initialState) => {
  const initState = isFunction(initialState) ? 
    (state, props) => () => initialState(state, props) :
    (_s, _p) => initialState

  return (state, props) => {
    const [innerState, updater] = useState(initState(state, props))
    return { [stateName]: innerState, [handler]: updater }
  }
}
