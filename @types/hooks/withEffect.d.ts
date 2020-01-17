/// <reference types="react" />
import { IKVPair, ICustomHook } from "../types";

export declare const createWithEffect: (
  useHook: (
    effect: import("react").EffectCallback,
    deps: import("react").DependencyList
  ) => void
) => (
  fn: (
    state: IKVPair<any>,
    props: IKVPair<any>,
    prevStateProps: {
      state: IKVPair<any>;
      props: IKVPair<any>;
    }
  ) => () => void,
  dependencies?: string[]
) => ICustomHook<any, void>;

export declare const withEffect: (
  fn: (
    state: IKVPair<any>,
    props: IKVPair<any>,
    prevStateProps: {
      state: IKVPair<any>;
      props: IKVPair<any>;
    }
  ) => () => void,
  dependencies?: string[]
) => ICustomHook<any, void>;

export declare const withLayoutEffect: (
  fn: (
    state: IKVPair<any>,
    props: IKVPair<any>,
    prevStateProps: {
      state: IKVPair<any>;
      props: IKVPair<any>;
    }
  ) => () => void,
  dependencies?: string[]
) => ICustomHook<any, void>;
