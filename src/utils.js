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

export const compose = (...fns) => (
  fns.reduce((prevFn, nextFn) => (
    (...args) => prevFn(nextFn(...args))
  ))
)

export const getDeps = (source, depsNames) => Array.isArray(depsNames) ?
  depsNames.map(dep => source[dep]) :
  depsNames
