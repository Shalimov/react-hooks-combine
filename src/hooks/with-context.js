import { useContext } from 'react'

import { identity } from '../utils'

export const withContext = (contextName, Context, transform = identity) => () => {
  const context = useContext(Context)
  return { [contextName]: transform(context) }
}
