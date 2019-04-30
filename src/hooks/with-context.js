import { useContext } from 'react'

export const withContext = (contextName, Context) => () => {
  const context = useContext(Context)
  return { [contextName]: context }
}
