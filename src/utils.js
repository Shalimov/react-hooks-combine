const CTOR_PATTERN = /\[object\s(\w+)\]/;

export const getInternalCtor = value => {
  const fullTypeDesc = Object.prototype.toString.call(value)
  const [, internalClass] = fullTypeDesc.match(CTOR_PATTERN)

  return internalClass
}

export const isPromiseLike = value => {
  return value && (
    getInternalCtor(value) === 'Promise' ||
    (isFunction(value.then) && isFunction(value.catch))
  )
}
export const isFunction = fn => getInternalCtor(fn) === 'Function'
export const isObject = obj => getInternalCtor(obj) === 'Object'

export const compose = (...fns) => (
  fns.reduce((prevFn, nextFn) => (
    (...args) => prevFn(nextFn(...args))
  ))
)

export const isCombineConfigMode = (args) => (
  args.length === 1 && isObject(args[0])
)

export const getDeps = (source, depsNames) => Array.isArray(depsNames) ?
  depsNames.map(dep => source[dep]) :
  depsNames

export const defaultProps = props => Component => {
  if (typeof props !== 'object') {
    throw Error(`defaultProps expects object, got a ${getInternalCtor(props)}`)
  }

  Component.defaultProps = props

  return Component
}

export const propTypes = props => Component => {
  if (typeof props !== 'object') {
    throw Error(`propTypes expects object, got a ${getInternalCtor(props)}`)
  }

  Component.propTypes = props

  return Component
}

export const flow = (...callbacks) => Component => {
  return callbacks.reduce((Component, callback) => callback(Component), Component)
}
