import { isReuseFn } from './utils'

export const hookBuilder = (reuseFuncs) => {
  if (!reuseFuncs.every(isReuseFn)) {
    const blackSheep = reuseFuncs.find(fn => !isReuseFn(fn))
    throw Error(`Hacked ${blackSheep.name}`)
  }

  const FuncCtor = Function

  const body = reuseFuncs.map((_fn, index) => `
    const state${index + 1} = {
      ...state${index},
      ...funcs[${index}](state${index}, props),
    };
  `).join('\n')

  const template = `
    const state0 = {};
    ${body}
    return state${reuseFuncs.length};
  `

  return new FuncCtor(
    'funcs',
    'props',
    template
  ).bind(null, reuseFuncs)
}
