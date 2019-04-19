import { useContext } from 'react'

import { toCombineFn } from '../utils'

export const withContext = (Context, contextName) => toCombineFn(() => {
  const context = useContext(Context)
  return { [contextName]: context }
})
