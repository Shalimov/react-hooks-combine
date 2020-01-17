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

export const getDeps = (source, depsNames) => {
  if (!Array.isArray(depsNames)) {
    return depsNames
  }

  const deps = []

  for (let i = 0, l = depsNames.length; i < l; i += 1) {
    deps.push(prop(source, depsNames[i]))
  }

  return deps
}

export const identity = (value) => value
