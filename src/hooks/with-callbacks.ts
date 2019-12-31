import { useCallback } from "react";

import { KVPair, FnCfg } from "../types";
import { unwindLoop, getDeps, isObject } from "../utils";

export type CallbackFunc = (state: KVPair, props: KVPair) => any;

export const withCallbacks = (
  callbacks: KVPair<FnCfg<CallbackFunc>>,
  dependencies: string[]
) => {
  const unrolledCalls = unwindLoop<CallbackFunc>(
    (fnCfg, deps, state, props) => {
      let activeFn: CallbackFunc = fnCfg as CallbackFunc;
      let depNames: string[] = deps;

      if (isObject(fnCfg)) {
        activeFn = (<FnCfg<CallbackFunc>>fnCfg).func;
        depNames = (<FnCfg<CallbackFunc>>fnCfg).deps;
      }

      const activeDeps = getDeps({ ...state, ...props }, depNames);
      return useCallback(activeFn(state, props), activeDeps);
    },
    callbacks
  );

  return (state: KVPair, props: KVPair): KVPair =>
    unrolledCalls(dependencies, state, props);
};

export const withCallback = <T>(
  callbackName: string,
  callback: CallbackFunc,
  dependencies: string[]
) => (state: KVPair, props: KVPair): KVPair<T> => {
  const deps = getDeps({ ...state, ...props }, dependencies);
  return { [callbackName]: useCallback(callback(state, props), deps) };
};
