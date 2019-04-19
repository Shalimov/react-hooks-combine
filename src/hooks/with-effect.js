import { useEffect } from 'react'

import { toCombineFn } from '../utils'

export const withEffect = (fn, memoizedProps) => toCombineFn((state) => {
  useEffect(fn.bind(null, state), memoizedProps)
})
