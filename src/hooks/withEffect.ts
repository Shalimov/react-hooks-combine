import { useEffect, useLayoutEffect, useRef } from "react";

import { IKVPair, ICustomHook } from "../types";
import { getDeps } from "../utils";

export const createWithEffect = (
  useHook: (effect: React.EffectCallback, deps: React.DependencyList) => void
) => (
  fn: (
    state: IKVPair,
    props: IKVPair,
    prevStateProps: { state: IKVPair; props: IKVPair }
  ) => () => void,
  dependencies: string[]
): ICustomHook<any, void> => (state: IKVPair, props: IKVPair): void => {
  const deps = getDeps({ ...state, ...props }, dependencies);
  const referedStateProps = useRef({ state, props });

  useHook(() => {
    const dispose = fn(state, props, referedStateProps.current);

    referedStateProps.current = { state, props };

    return dispose;
  }, deps);
};

export const withEffect = createWithEffect(useEffect);
export const withLayoutEffect = createWithEffect(useLayoutEffect);
