const REUSE_FN_SIGIL = Symbol('reuse_fn')
const FORWARD_PROPS_FN_SIGIL = Symbol('forward_props_fn')

const CTOR_PATTERN = /\[object\s(\w+)\]/;

const getInternalCtor = value => {
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
export const isReuseFn = fn => fn[REUSE_FN_SIGIL] === true

export const toReuseFn = (fn) => {
  if (!isFunction(fn)) {
    return fn
  }

  fn[REUSE_FN_SIGIL] = true;
  return Object.freeze(fn)
}

export const compose = (...fns) => (
  fns.reduce((prevFn, nextFn) => (
    (...args) => prevFn(nextFn(...args))
  ))
)

export const toForwardPropsFn = fn => {
  if (!isFunction(fn)) {
    return fn
  }

  fn[FORWARD_PROPS_FN_SIGIL] = true
  return Object.freeze(fn)
}

export const isForwardPropsFn = fn => fn[FORWARD_PROPS_FN_SIGIL] === true

export const forwardProps = callback => {
  if (!isFunction(callback)) {
    return callback
  }

  const forwardPropsFn = (props) => {
    return callback.bind(null, props)
  }

  return toForwardPropsFn(forwardPropsFn)
}
