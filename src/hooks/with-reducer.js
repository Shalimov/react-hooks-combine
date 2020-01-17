import { useReducer } from 'react'

export const withReducer = (config) => {
  const {
    reducer,
    stateName,
    dispatchName,
    initialState,
    init,
  } = { dispatchName: 'dispatch', ...config }

  return () => {
    const [state, dispatch] = useReducer(reducer, initialState, init)
    return { [stateName]: state, [dispatchName]: dispatch }
  }
}
