import { useEffect, useState, useRef } from 'react'

import { getDeps, isPromiseLike, getInternalCtor } from '../utils'

export const withAsyncEffect = (params) => {
  const {
    asyncAction,
    disposeAction,
    dataName,
    errorName,
    deps,
  } = { dataName: 'data', errorName: 'error', ...params }

  return (state, props) => {
    const referedStateProps = useRef({ state, props })
    const invalidartedRun = useRef(false)
    const [innerState, setData] = useState({ loading: true, [dataName]: null, [errorName]: null })

    useEffect(() => {
      if (invalidartedRun.current) {
        setData({ loading: true, [dataName]: innerState[dataName], [errorName]: null })
      }

      invalidartedRun.current = true

      const promise = asyncAction(state, props, referedStateProps.current)

      referedStateProps.current = { state, props }

      if (!isPromiseLike(promise)) {
        throw Error(`withAsyncEffect expects Promise, got a: ${getInternalCtor(promise)}`)
      }

      promise.then((result) => {
        setData({ loading: false, [dataName]: result, [errorName]: null })
      }, (error) => {
        setData({ loading: false, [dataName]: innerState[dataName], [errorName]: error })
      })

      return disposeAction
    }, getDeps({ ...state, ...props }, deps))

    return innerState
  }
}
