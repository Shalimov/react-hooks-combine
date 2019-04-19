import React from 'react'

import { hookBuilder } from './hook-builder'
import { isCombineFn } from './utils'

export const combine = (...hooks) => (Component) => {
  let innerPropsRef = null
  let hooksComposition = null

  const isInitFunc = (hooks.length === 1 && !isCombineFn(hooks[0]))

  if (isInitFunc) {
    const forwardProps = fn => (...args) => fn(innerPropsRef, ...args)

    const initFunc = hooks[0];
    const extHooks = initFunc(forwardProps)

    hooksComposition = hookBuilder(extHooks)
  } else if (hooks.length > 0) {
    hooksComposition = hookBuilder(hooks)
  }

  const DisplayNameHooked = (props) => {
    innerPropsRef = props;

    const hookProps = hooksComposition(props)

    return <Component {...props} {...hookProps} />
  }

  return DisplayNameHooked
}