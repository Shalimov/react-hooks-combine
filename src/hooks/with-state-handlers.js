import { useState } from 'react'

import {
  toCombineFn,
  isFunction,
  compose,
} from '../utils'

export const withStateHandlers = (getState, actionHandlers) =>
  toCombineFn((props) => {
    const initialState = isFunction(getState) ? getState(props) : getState
    const [state, updater] = useState(initialState)
    const actionHandlersWithState = {}
    const assignToState = updatedStatePart => updater({ ...state, ...updatedStatePart })

    for (const key of Object.keys(actionHandlers)) {
      actionHandlersWithState[key] = compose(
        assignToState,
        actionHandlers[key](state)
      )
    }

    return { ...state, ...actionHandlersWithState }
  })
