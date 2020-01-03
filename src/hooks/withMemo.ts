import { useMemo } from "react";

import { IKVPair, IFnCfg, ICustomHook } from "../types";
import { unwindLoop, getDeps, isObject } from "../utils";

export type MemoFunc = (state: IKVPair, props: IKVPair) => any;

export const withMemos = (
  funcs: IKVPair<IFnCfg<MemoFunc> | MemoFunc>,
  dependencies: string[]
): ICustomHook => {
  const unrolledLoop = unwindLoop((fnCfg, deps, state, props) => {
    let activeFn: MemoFunc = fnCfg as MemoFunc;
    let depNames: string[] = deps;

    if (isObject(fnCfg)) {
      activeFn = (<IFnCfg<MemoFunc>>fnCfg).func;
      depNames = (<IFnCfg<MemoFunc>>fnCfg).deps;
    }

    const activeDeps = getDeps({ ...state, ...props }, depNames);

    return useMemo(() => activeFn(state, props), activeDeps);
  }, funcs);

  return (state: IKVPair, props: IKVPair): IKVPair =>
    unrolledLoop(dependencies, state, props);
};

export const withMemo = <T>(
  memoizedName: string,
  callback: MemoFunc,
  deps: string[]
): ICustomHook => (state: IKVPair, props: IKVPair): IKVPair<T> => {
  const memoizedValue = useMemo(
    () => callback(state, props),
    getDeps({ ...state, ...props }, deps)
  );

  return { [memoizedName]: memoizedValue };
};
