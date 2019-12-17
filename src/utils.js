const baseToString = Object.prototype.toString

export const getInternalCtor = (value) => baseToString.call(value).slice(8, -1)
export const isFunction = (fn) => getInternalCtor(fn) === 'Function'
export const isObject = (obj) => getInternalCtor(obj) === 'Object'
export const isNotFunction = (fn) => !isFunction(fn)

export const isPromiseLike = (value) => value && (
  getInternalCtor(value) === 'Promise' ||
    (isFunction(value.then) && isFunction(value.catch))
)

export const isCombineConfigMode = (args) => isObject(args[0])

export const unwindLoop = (useCustomHook, funcDescriptions) => {
  const FuncCtor = Function
  const invocations = Object.entries(funcDescriptions)
    .map(([key]) => `box.${key} = useCustomHook(fns.${key}, deps, state, props);`)
    .join('\n')

  const body = `
    const box = {};
    ${invocations}
    return box
  `

  return new FuncCtor('useCustomHook', 'fns', 'deps', 'state', 'props', body)
    .bind(null, useCustomHook, funcDescriptions)
}

export const prop = (obj, path) => {
  if (obj == null) {
    return obj
  }

  let value = obj
  const parts = path.split('.')

  for (const part of parts) {
    value = value && value[part]

    if (!value) {
      return undefined
    }
  }

  return value
}

export const getDeps = (source, depsNames) => (Array.isArray(depsNames) ?
  depsNames.map((dep) => prop(source, dep)) :
  depsNames)

export const defaultProps = (props, Component) => {
  if (typeof props !== 'object') {
    throw Error(`defaultProps expects object, got a ${getInternalCtor(props)}`)
  }

  // eslint-disable-next-line
  Component.defaultProps = props

  return Component
}

export const identity = (value) => value

const iteratee = (Component, callback) => callback(Component)
export const enchance = (Component, ...callbacks) => callbacks.reduce(iteratee, Component)
