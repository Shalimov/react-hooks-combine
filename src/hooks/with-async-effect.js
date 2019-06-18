import { useEffect, useState, useRef } from 'react'

import { getDeps, isPromiseLike, getInternalCtor, isFunction } from '../utils'

export const withAsyncEffect = (params) => {
  let nonInitial = false
  const {
    asyncAction,
    disposeAction,
    dataName,
    deps,
  } = { dataName: 'data', ...params }
  const resetNonInitialStatus = () => { nonInitial = false }

  const disposeWrapper = isFunction(disposeAction) ? () => {
    resetNonInitialStatus()
    disposeAction()
  } : resetNonInitialStatus

  return (state, props) => {
    const [innerState, setData] = useState({ loading: true, [dataName]: null, error: null })

    const referedStateProps = useRef({ state, props })

    useEffect(() => {
      if (nonInitial) {
        setData({ loading: true, [dataName]: innerState[dataName], error: null })
      }

      nonInitial = true

      const promise = asyncAction(state, props, referedStateProps.current)

      referedStateProps.current.state = state
      referedStateProps.current.props = props

      if (!isPromiseLike(promise)) {
        throw Error(`withAsyncEffect expects Promise, got a: ${getInternalCtor(promise)}`)
      }

      promise.then((result) => {
        setData({ loading: false, [dataName]: result, error: null })
      }, (error) => {
        setData({ loading: false, [dataName]: innerState[dataName], error })
      })

      return disposeWrapper
    }, getDeps({ ...state, ...props }, deps))

    return innerState
  }
}
