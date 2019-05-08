import { useEffect, useState } from 'react'

import { getDeps, isPromiseLike, getInternalCtor, isFunction } from '../utils'

export const withAsyncEffect = (params) => {
  let nonInitial = false
  const { asyncAction, disposeAction, deps } = params
  const resetNonInitialStatus = () => { nonInitial = false }

  const disposeWrapper = isFunction(disposeAction) ? () => {
    resetNonInitialStatus()
    disposeAction()
  } : resetNonInitialStatus

  return (state, props) => {
    const [innerState, setData] = useState({ loading: true, data: null, error: null })

    useEffect(() => {
      if (nonInitial) {
        setData({ data: innerState.data, error: null, loading: true })
      }

      nonInitial = true

      const promise = asyncAction(state, props)

      if (!isPromiseLike(promise)) {
        throw Error(`withAsyncEffect expects Promise, got a: ${getInternalCtor(promise)}`)
      }

      promise.then((result) => {
        setData({ loading: false, data: result, error: null })
      }, (error) => {
        setData({ loading: false, data: innerState.data, error })
      })

      return disposeWrapper
    }, getDeps({ ...state, ...props }, deps))

    return innerState
  }
}
