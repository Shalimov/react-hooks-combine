import { useEffect, useState, useRef } from 'react'

import { getDeps, isPromiseLike, getInternalCtor } from '../utils'

export const withAsyncEffect = (params) => {
  const {
    asyncAction,
    disposeAction,
    dataName,
    deps,
  } = { dataName: 'data', ...params }

  return (state, props) => {
    const referedStateProps = useRef({ state, props })
    const invalidartedRun = useRef(false)
    const [innerState, setData] = useState({ loading: true, [dataName]: null, error: null })

    useEffect(() => {
      if (invalidartedRun.current) {
        setData({ loading: true, [dataName]: innerState[dataName], error: null })
      }

      invalidartedRun.current = true

      const promise = asyncAction(state, props, referedStateProps.current)

      referedStateProps.current = { state, props }

      if (!isPromiseLike(promise)) {
        throw Error(`withAsyncEffect expects Promise, got a: ${getInternalCtor(promise)}`)
      }

      promise.then((result) => {
        setData({ loading: false, [dataName]: result, error: null })
      }, (error) => {
        setData({ loading: false, [dataName]: innerState[dataName], error })
      })

      return disposeAction
    }, getDeps({ ...state, ...props }, deps))

    return innerState
  }
}
