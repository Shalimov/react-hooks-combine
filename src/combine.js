import React from 'react'

import { hookBuilder } from './hook-builder'

import {
  isCombineConfigMode,
  identity,
  isObject
} from './utils'

const combineFromConfig = (config, Component) => {
  const {
    hooks,
    transformProps,
    transformPropsBefore,
  } = {
    hooks: [],
    transformProps: identity,
    transformPropsBefore: identity,
    ...config,
  }

  const hooksComposition = hookBuilder(hooks)

  const ExtendedComponent = (props, ref) => {
    const transformedProps = transformPropsBefore(props)
    const state = hooksComposition(transformedProps, ref)
    const allProps = { ...transformedProps, ...state }

    let reference

    if (isObject(ref) && Object.hasOwnProperty.call(ref, 'current')) {
      reference = ref
    }

    return <Component {...transformProps(allProps)} ref={reference} />
  }

  return ExtendedComponent
}

export const combine = (...hooks) => (Component) => {
  const ExtendedComponent = isCombineConfigMode(hooks) ?
    combineFromConfig(hooks[0], Component) :
    combineFromConfig({ hooks }, Component)

  ExtendedComponent.displayName = `${Component.displayName || Component.name}Hooked`

  return ExtendedComponent
}
