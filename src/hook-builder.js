import { isCombineFn } from './utils'

export const hookBuilder = (combineFuncs) => {
  if (!combineFuncs.every(isCombineFn)) {
    const blackSheep = combineFuncs.find(fn => !isCombineFn(fn))
    throw Error(`Hacked ${blackSheep.name}`)
  }

  const FuncCtor = Function

  const body = combineFuncs.map((_fn, index) => `
    const state${index + 1} = {
      ...state${index},
      ...funcs[${index}](state${index}, props),
    };
  `).join('\n')

  const template = `
    const state0 = {};
    ${body}
    return state${combineFuncs.length};
  `

  return new FuncCtor(
    'funcs',
    'props',
    template
  ).bind(null, combineFuncs)
}
