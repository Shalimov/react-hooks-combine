import { useEffect, useState } from 'react'

import { getDeps, isFunction, isPromiseLike, getInternalCtor } from '../utils'

export const withAsyncEffect = (asyncCallback, deps, unmountCallback) => (state, props) => {
  if (!asyncCallback || !isFunction(asyncCallback)) {
    throw Error(`withAsyncEffect expects function, got a: ${typeof asyncCallback}`)
  }

  const [data, setData] = useState({ loading: true, data: null })

  useEffect(() => {
    const fetch = async () => {
      setData({ loading: true })

      const promise = asyncCallback(state, props)

      if (!isPromiseLike(promise)) {
        throw Error(`withAsyncEffect expects Promise, got a: ${getInternalCtor(promise)}`)
      }

      const result = await promise
      setData({ loading: false, data: result })
    }

    fetch()

    if (unmountCallback) {
      return unmountCallback
    }
  }, getDeps({ ...state, ...props }, deps))

  return data
}
