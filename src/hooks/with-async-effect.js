import { useEffect, useState } from 'react'

import { getDeps, isPromiseLike, getInternalCtor } from '../utils'

export const withAsyncEffect = params => (state, props) => {
  const { asyncAction, disposeAction, deps } = params
  const [innerState, setData] = useState({ loading: true, data: null, error: null })

  useEffect(() => {
    setData({ data: innerState.data, error: null, loading: true })

    const promise = asyncAction(state, props)

    if (!isPromiseLike(promise)) {
      throw Error(`withAsyncEffect expects Promise, got a: ${getInternalCtor(promise)}`)
    }

    promise.then((result) => {
      setData({ loading: false, data: result, error: null })
    }, (error) => {
      setData({ loading: false, data: innerState.data, error })
    })

    return disposeAction
  }, getDeps({ ...state, ...props }, deps))

  return innerState
}
