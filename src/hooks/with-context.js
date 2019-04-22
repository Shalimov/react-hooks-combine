import { useContext } from 'react'

export const withContext = (Context, contextName) => () => {
  const context = useContext(Context)
  return { [contextName]: context }
}
