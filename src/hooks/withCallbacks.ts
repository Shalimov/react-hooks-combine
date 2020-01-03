import { useCallback } from "react";

import { IKVPair, IFnCfg } from "../types";
import { unwindLoop, getDeps, isObject } from "../utils";

export type CallbackFunc = (state: IKVPair, props: IKVPair) => any;

export const withCallbacks = (
  callbacks: IKVPair<IFnCfg<CallbackFunc>>,
  dependencies: string[]
) => {
  const unrolledCalls = unwindLoop<CallbackFunc>(
    (fnCfg, deps, state, props) => {
      let activeFn: CallbackFunc = fnCfg as CallbackFunc;
      let depNames: string[] = deps;

      if (isObject(fnCfg)) {
        activeFn = (<IFnCfg<CallbackFunc>>fnCfg).func;
        depNames = (<IFnCfg<CallbackFunc>>fnCfg).deps;
      }

      const activeDeps = getDeps({ ...state, ...props }, depNames);
      return useCallback(activeFn(state, props), activeDeps);
    },
    callbacks
  );

  return (state: IKVPair, props: IKVPair): IKVPair =>
    unrolledCalls(dependencies, state, props);
};

export const withCallback = <T>(
  callbackName: string,
  callback: CallbackFunc,
  dependencies: string[]
) => (state: IKVPair, props: IKVPair): IKVPair<T> => {
  const deps = getDeps({ ...state, ...props }, dependencies);
  return { [callbackName]: useCallback(callback(state, props), deps) };
};
