import { isFunction } from './utils'

const merge = (currentState, prevState) => ({ ...currentState, ...prevState })

export const hookBuilder = (combineFuncs) => {
  const blackSheepIndex = combineFuncs.findIndex(fn => !isFunction(fn))

  if (blackSheepIndex !== -1) {
    throw Error(`
      Expected function,
      got a: ${typeof combineFuncs[blackSheepIndex]}
      on index: ${blackSheepIndex}
    `)
  }

  const FuncCtor = Function

  const body = combineFuncs.map((_fn, index) => `  
    const result${index} = funcs[${index}](state${index}, props)
    const state${index + 1} = merge(result${index}, state${index});
  `).join('\n')

  const template = `
    const state0 = {};
    ${body}
    return state${combineFuncs.length};
  `

  return new FuncCtor('funcs', 'merge', 'props', template)
    .bind(null, combineFuncs, merge)
}
