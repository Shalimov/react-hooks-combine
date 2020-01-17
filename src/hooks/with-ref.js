import { useRef } from 'react'

export const withRef = (refName, initialValue) => () => {
  const ref = useRef(initialValue)
  return { [refName]: ref }
}
