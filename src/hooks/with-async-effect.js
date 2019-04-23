import { useEffect, useState } from 'react'

import { getDeps, isFunction, isPromiseLike, getInternalCtor } from '../utils'

export const withAsyncEffect = (asyncCallback, deps, unmountCallback) => (state, props) => {
  if (!isFunction(asyncCallback)) {
    throw Error(`withAsyncEffect expects function, got a: ${getInternalCtor(asyncCallback)}`)
  }

  const [data, setData] = useState({ loading: true, data: null })

  useEffect(() => {
    setData({ ...data, loading: true })

    const promise = asyncCallback(state, props)

    if (!isPromiseLike(promise)) {
      throw Error(`withAsyncEffect expects Promise, got a: ${getInternalCtor(promise)}`)
    }

    promise.then(result => setData({ loading: false, data: result }))

    return unmountCallback

  }, getDeps({ ...state, ...props }, deps))

  return data
}
