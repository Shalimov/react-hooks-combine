import { useState } from 'react'

import { isFunction } from '../utils'

export const withStateHandlers = (initialState, actionHandlers) => {
  const initState = isFunction(initialState) ?
    (state, props) => () => initialState(state, props) :
    () => initialState

  const weekComponentRef = new WeakMap()

  return (state, props) => {
    const [localState, updater] = useState(initState(state, props))

    if (!weekComponentRef.has(updater)) {
      const initialAttachedData = { state: localState, props, actionHandlers: {} }
      weekComponentRef.set(updater, initialAttachedData)

      const assignToState = (updatedStatePart) => {
        const internals = weekComponentRef.get(updater)
        const { state: inState } = internals
        const needUpdate = Object.entries(updatedStatePart).some(([key, value]) => inState[key] !== value)

        if (needUpdate) {
          const bufferedState = { ...inState, ...updatedStatePart }
          internals.state = bufferedState
          updater(bufferedState)
        }
      }

      for (const [key, actionHandler] of Object.entries(actionHandlers)) {
        // eslint-disable-next-line no-loop-func
        initialAttachedData.actionHandlers[key] = (...args) => {
          const { state: inState, props: inProps } = weekComponentRef.get(updater)
          const result = actionHandler({ args, state: inState, props: inProps })
          assignToState(result)
        }
      }
    }

    const internals = weekComponentRef.get(updater)
    internals.state = localState
    internals.props = props

    return { ...localState, ...internals.actionHandlers }
  }
}
