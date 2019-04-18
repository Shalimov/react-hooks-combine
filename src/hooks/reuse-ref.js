import { useRef } from 'react'

import { toReuseFn } from '../utils'

export const reuseRef = (refName, initialValue) => toReuseFn(() => {
  const ref = useRef(initialValue)
  return { [refName]: ref }
})
