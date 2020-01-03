import { IKVPair, ICustomHook } from "./types";
import { isNotFunction } from "./utils";

/**
 * Merges two KVPairs into new one
 * 
 * @param {IKVPair} currentState
 * @param {IKVPair} prevState
 * @return {IKVPair} combination of two passed key value pairs
 */
const merge = (currentState: IKVPair, prevState: IKVPair): IKVPair => ({
  ...currentState,
  ...prevState
});

/**
 * Constructs body of custom hook
 * 
 * @param {ICustomHook} fn not used
 * @param {number} index
 * @return {string} return all invocations
 */
const mapBody = (fn: ICustomHook, index: number): string => `
  const result${index} = funcs[${index}](state${index}, props, ref);
  const state${index + 1} = merge(result${index}, state${index});
`;

/**
 *  Creates {CustomHook} from set of hooks and form an {KVPair} state from results of each particular hook in set
 * 
 * @param {ICustomHook[]} combineFuncs
 * @return {ICustomHook} Custom hook which contains all defined hooks invocations
 */
export const hookBuilder = (combineFuncs: ICustomHook[]): ICustomHook => {
  const blackSheepIndex = combineFuncs.findIndex(isNotFunction);

  if (blackSheepIndex !== -1) {
    throw Error(`
      Expected function,
      got a: ${typeof combineFuncs[blackSheepIndex]}
      on index ${blackSheepIndex}
    `);
  }

  // restrict propogation scope
  const FuncCtor = Function;

  const body = combineFuncs.map(mapBody).join("\n");

  const template = `
    const state0 = {};
    ${body}
    return state${combineFuncs.length};
  `;

  return new FuncCtor("funcs", "merge", "props", "ref", template).bind(
    null,
    combineFuncs,
    merge
  );
};
