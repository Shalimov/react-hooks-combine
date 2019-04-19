import { useReducer } from 'react'

import { toCombineFn } from '../utils'

export const withReducer = (reducerFn, stateName, dispatchName, initialState) => toCombineFn(() => {
  const [state, dispatch] = useReducer(reducerFn, initialState)
  return { [stateName]: state, [dispatchName]: dispatch }
})
