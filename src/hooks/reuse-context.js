import { useContext } from 'react'

import { toReuseFn } from '../utils'

export const reuseContext = (Context, contextName) => toReuseFn(() => {
  const context = useContext(Context)
  return { [contextName]: context }
})
