import { useState } from 'react'

import { isFunction } from '../utils'

export const withStateHandlers = (initialState, actionHandlers) => {
  const initState = isFunction(initialState) ?
    (state, props) => () => initialState(state, props) :
    () => initialState

  const actionHandlersWithState = {}

  let stateRef = null
  let propsRef = null
  let updateFn = null

  const assignToState = (updatedStatePart) => {
    const needUpdate = Object.entries(updatedStatePart).some(([key, value]) => stateRef[key] !== value)

    if (needUpdate) {
      updateFn({ ...stateRef, ...updatedStatePart })
    }
  }

  for (const [key, actionHandler] of Object.entries(actionHandlers)) {
    // eslint-disable-next-line no-loop-func
    actionHandlersWithState[key] = (...args) => {
      const result = actionHandler({ args, state: stateRef, props: propsRef })
      assignToState(result)
    }
  }

  return (state, props) => {
    const [localState, updater] = useState(initState(state, props))

    updateFn = updater
    propsRef = props
    stateRef = localState

    return { ...localState, ...actionHandlersWithState }
  }
}
