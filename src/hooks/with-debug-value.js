import { useDebugValue } from 'react'

export const withDebugValue = (value, formatter) => () => {
  useDebugValue(value, formatter)
}
