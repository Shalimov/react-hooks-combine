import { useState } from 'react'

import { isFunction, compose } from '../utils'

// TODO: get state as lazy func
// TODO: updater -> should not react
// Revise this method !!!
export const withStateHandlers = (getState, actionHandlers) => (state, props) => {
  const initialState = isFunction(getState) ? getState(state, props) : getState
  const [localState, updater] = useState(initialState)
  const actionHandlersWithState = {}
  const assignToState = updatedStatePart => updater({ ...localState, ...updatedStatePart })

  for (const [key, actionHandler] of Object.entries(actionHandlers)) {
    actionHandlersWithState[key] = compose(
      assignToState,
      actionHandler(localState)
    )
  }

  return { ...localState, ...actionHandlersWithState }
}
