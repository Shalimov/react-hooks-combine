import React from 'react'

import { hookBuilder } from './hook-builder'

export const combine = (...hooks) => (Component) => {
  const hooksComposition = hookBuilder(hooks)

  const ExtendedComponent = (props) => {
    const state = hooksComposition(props)
    return <Component {...props} {...state} />
  }

  ExtendedComponent.displayName = `${Component.displayName || Component.name}Hooked`

  return ExtendedComponent
}
