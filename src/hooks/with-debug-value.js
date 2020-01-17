import { useDebugValue } from 'react'

export const withDebugValue = (valueExtractor, formatter) => (state, props) => {
  const status = valueExtractor(state, props)
  useDebugValue(status, formatter)
}
