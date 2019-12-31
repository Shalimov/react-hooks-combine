import { useMemo } from "react";

import { KVPair, FnCfg, CustomHook } from "../types";
import { unwindLoop, getDeps, isObject } from "../utils";

export type MemoFunc = (state: KVPair, props: KVPair) => any;

export const withMemos = (
  funcs: KVPair<FnCfg<MemoFunc> | MemoFunc>,
  dependencies: string[]
): CustomHook => {
  const unrolledLoop = unwindLoop((fnCfg, deps, state, props) => {
    let activeFn: MemoFunc = fnCfg as MemoFunc;
    let depNames: string[] = deps;

    if (isObject(fnCfg)) {
      activeFn = (<FnCfg<MemoFunc>>fnCfg).func;
      depNames = (<FnCfg<MemoFunc>>fnCfg).deps;
    }

    const activeDeps = getDeps({ ...state, ...props }, depNames);

    return useMemo(() => activeFn(state, props), activeDeps);
  }, funcs);

  return (state: KVPair, props: KVPair): KVPair =>
    unrolledLoop(dependencies, state, props);
};

export const withMemo = <T>(
  memoizedName: string,
  callback: MemoFunc,
  deps: string[]
): CustomHook => (state: KVPair, props: KVPair): KVPair<T> => {
  const memoizedValue = useMemo(
    () => callback(state, props),
    getDeps({ ...state, ...props }, deps)
  );

  return { [memoizedName]: memoizedValue };
};
