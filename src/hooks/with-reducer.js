import { useReducer } from 'react'

export const withReducer = (reducerFn, stateName, dispatchName, initialState) => () => {
  const [state, dispatch] = useReducer(reducerFn, initialState)
  return { [stateName]: state, [dispatchName]: dispatch }
}
