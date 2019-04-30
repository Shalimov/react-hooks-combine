import React from 'react'

import { hookBuilder } from './hook-builder'

import {
  isCombineConfigMode,
  defaultProps as withDefaultProps,
  identity,
  flow,
} from './utils'

const combineFromConfig = (config, Component) => {
  const { hooks, hocs, defaultProps, transformProps } = Object.assign({
    hooks: [],
    hocs: [],
    transformProps: identity
  }, config)

  const hooksComposition = hookBuilder(hooks)

  if (defaultProps) {
    withDefaultProps(defaultProps)(Component)
  }

  const ExtendedComponent = (props) => {
    const state = hooksComposition(props)
    return <Component {...transformProps({ ...state, ...props })} />
  }

  return flow(...hocs)(ExtendedComponent)
}

export const combine = (...hooks) => (Component) => {
  const ExtendedComponent = isCombineConfigMode(hooks) ?
    combineFromConfig(hooks[0], Component) :
    combineFromConfig({ hooks }, Component)

  ExtendedComponent.displayName = `${Component.displayName || Component.name}Hooked`

  return ExtendedComponent
}
