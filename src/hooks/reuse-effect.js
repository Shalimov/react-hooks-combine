import { useEffect } from 'react'

import { toReuseFn } from '../utils'

export const reuseEffect = (fn, memoizedProps) => toReuseFn((state) => {
  useEffect(fn.bind(null, state), memoizedProps)
})
