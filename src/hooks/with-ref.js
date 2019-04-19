import { useRef } from 'react'

import { toCombineFn } from '../utils'

export const withRef = (refName, initialValue) => toCombineFn(() => {
  const ref = useRef(initialValue)
  return { [refName]: ref }
})
