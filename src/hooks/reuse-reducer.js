import { useReducer } from 'react'

import { toReuseFn } from '../utils'

export const reuseReducer = (reducerFn, stateName, dispatchName, initialState) => toReuseFn(() => {
  const [state, dispatch] = useReducer(reducerFn, initialState)
  return { [stateName]: state, [dispatchName]: dispatch }
})
