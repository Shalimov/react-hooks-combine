import React, { forwardRef as reactForwardRef } from 'react'

import { hookBuilder } from './hook-builder'

import {
  isCombineConfigMode,
  defaultProps as withDefaultProps,
  identity,
  enchance
} from './utils'

const combineFromConfig = (config, Component) => {
  const {
    hooks,
    hocs,
    forwardRef,
    defaultProps,
    transformProps,
    transformPropsBefore,
  } = {
    hooks: [],
    hocs: [],
    forwardRef: false,
    transformProps: identity,
    transformPropsBefore: identity,
    ...config,
  }

  const hooksComposition = hookBuilder(hooks)

  const forwardRefWrapper = forwardRef ? reactForwardRef : identity

  const ReferredComponent = forwardRefWrapper(Component)

  const ExtendedComponent = forwardRefWrapper((props, ref) => {
    const transformedProps = transformPropsBefore(props)
    const state = hooksComposition(transformedProps, ref)
    const allProps = { ...transformedProps, ...state }

    let passedRef

    if (forwardRef) {
      passedRef = ref
    }

    return <ReferredComponent {...transformProps(allProps)} ref={passedRef} />
  })

  if (defaultProps) {
    withDefaultProps(defaultProps, ExtendedComponent)
  }

  return enchance(ExtendedComponent, ...hocs)
}

export const combine = (...hooks) => (Component) => {
  const ExtendedComponent = isCombineConfigMode(hooks) ?
    combineFromConfig(hooks[0], Component) :
    combineFromConfig({ hooks }, Component)

  ExtendedComponent.displayName = `${Component.displayName || Component.name}Hooked`

  return ExtendedComponent
}
