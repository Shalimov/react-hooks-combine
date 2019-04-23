import React from 'react'

import { hookBuilder } from './hook-builder'

import {
  isCombineConfigMode,
  defaultProps as withDefaultProps,
  isFunction,
} from './utils'

const combineFromConfig = (hooks) => Component => {
  const { hooks: use, defaultProps, filterProps } = hooks[0]
  const hooksComposition = hookBuilder(use)

  if (defaultProps) {
    withDefaultProps(defaultProps)(Component)
  }

  return (props) => {
    const state = hooksComposition(props)
    const componentProps = isFunction(filterProps) ? filterProps({ ...state, ...props }) : { ...state, ...props }
    return <Component {...componentProps} />
  }
}

export const combine = (...hooks) => (Component) => {
  let ExtendedComponent = null

  if (isCombineConfigMode(hooks)) {
    ExtendedComponent = combineFromConfig(hooks)(Component)
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
