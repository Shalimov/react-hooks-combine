import { isNotFunction } from './utils'

const merge = (currentState, prevState) => ({ ...currentState, ...prevState })
const mapBody = (_fn, index) => `
  const result${index} = funcs[${index}](state${index}, props, ref);
  const state${index + 1} = merge(result${index}, state${index});
`

export const hookBuilder = (combineFuncs) => {
  const blackSheepIndex = combineFuncs.findIndex(isNotFunction)

  if (blackSheepIndex !== -1) {
    throw Error(`
      Expected function,
      got a: ${typeof combineFuncs[blackSheepIndex]}
      on index: ${blackSheepIndex}
    `)
  }

  // Restrict scope propagation
  const FuncCtor = Function

  const body = combineFuncs.map(mapBody).join('\n')

  const template = `
    const state0 = {};
    ${body}
    return state${combineFuncs.length};
  `

  return new FuncCtor('funcs', 'merge', 'props', 'ref', template)
    .bind(null, combineFuncs, merge)
}
