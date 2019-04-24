import React from 'react'

import { hookBuilder } from './hook-builder'

import {
  isCombineConfigMode,
  defaultProps as withDefaultProps,
  isFunction,
  identity,
} from './utils'

const combineFromConfig = config => Component => {
  const { hooks, defaultProps, transformProps } = config
  const hooksComposition = hookBuilder(hooks)

  const transformFunction = isFunction(transformProps) ? transformProps : identity

  if (defaultProps) {
    withDefaultProps(defaultProps)(Component)
  }

  return (props) => {
    const state = hooksComposition(props)
    return <Component {...transformFunction({ ...state, ...props })} />
  }
}

export const combine = (...hooks) => (Component) => {
  let ExtendedComponent = null

  if (isCombineConfigMode(hooks)) {
    ExtendedComponent = combineFromConfig(hooks[0])(Component)
  } else {
    const hooksComposition = hookBuilder(hooks)

    ExtendedComponent = (props) => {
      const state = hooksComposition(props)
      return <Component {...props} {...state} />
    }
  }

  ExtendedComponent.displayName = `${Component.displayName || Component.name}Hooked`

  return ExtendedComponent
}
